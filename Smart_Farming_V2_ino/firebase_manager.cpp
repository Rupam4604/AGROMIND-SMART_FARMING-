#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>

#include "config.h"
#include "datatypes.h"
#include "firebase_manager.h"
#include "firebase_config.h"
#include "relay.h"

extern SystemData greenhouse;


FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig fbConfig;

bool fbConnected = false;
unsigned long lastFirebaseSync = 0;

// Round-robin step counter — spreads blocking calls across cycles
// so the scheduler / display never freezes waiting on one big batch
int fbStep = 0;

struct CropThreshold { const char* key; int min; int max; };

CropThreshold cropTable[] = {
    {"tomato",     60, 80},
    {"potato",     65, 85},
    {"pepper",     55, 75},
    {"corn",       60, 80},
    {"apple",      50, 75},
    {"grape",      40, 65},
    {"strawberry", 65, 85},
    {"orange",     50, 75},
    {"peach",      55, 75},
    {"blueberry",  60, 80},
    {"cherry",     55, 75},
    {"squash",     65, 85},
    {"soybean",    55, 75},
    {"raspberry",  60, 80},
};

void applyCropThreshold(String cropKey)
{
    for (auto &c : cropTable)
    {
        if (cropKey == c.key)
        {
            greenhouse.settings.soilDry = c.min;
            greenhouse.settings.soilWet = c.max;

            Serial.print("Crop threshold applied: ");
            Serial.print(cropKey);
            Serial.print(" -> ");
            Serial.print(c.min);
            Serial.print("% - ");
            Serial.print(c.max);
            Serial.println("%");
            return;
        }
    }
}

//==================================================
// Init Firebase
//==================================================

void initFirebase()
{
    Serial.println();
    Serial.println("========== Firebase ==========");

    fbConfig.api_key = FIREBASE_API_KEY;
    fbConfig.database_url = FIREBASE_DATABASE_URL;

    auth.user.email = FIREBASE_USER_EMAIL;
    auth.user.password = FIREBASE_USER_PASSWORD;

    fbConfig.token_status_callback = tokenStatusCallback;

    fbConfig.timeout.serverResponse = 10000;

    Serial.println("Starting Firebase...");

    Firebase.begin(&fbConfig, &auth);

    Firebase.reconnectWiFi(true);

    fbdo.setResponseSize(1024);
    fbdo.setBSSLBufferSize(4096, 1024);

    Serial.println("Firebase.begin() Finished");
    Serial.println("==============================");
}



//==================================================
// Upload sensor data -> /sensors/  (ONE call, fast)
//==================================================

void uploadSensorData()
{
    FirebaseJson json;

    json.set("temperature",   greenhouse.sensor.temperature);
    json.set("humidity",      greenhouse.sensor.humidity);
    json.set("soil_moisture", (greenhouse.sensor.soil1 + greenhouse.sensor.soil2) / 2);
    json.set("water_level",   greenhouse.sensor.pumpTank);
    json.set("light",         greenhouse.sensor.light);
    json.set("timestamp",     (double)millis());

    if (!Firebase.RTDB.updateNodeAsync(&fbdo, "/sensors", &json))
    {
        Serial.println("Firebase sensor upload failed: " + fbdo.errorReason());
    }
}

//==================================================
// Upload device relay states -> /devices/ (ONE call, fast)
//==================================================

void uploadDeviceStates()
{
    FirebaseJson json;

    json.set("pump",       greenhouse.relay.pump);
    json.set("fan",        greenhouse.relay.fan);
    json.set("light",      greenhouse.relay.light);
    json.set("humidifier", greenhouse.relay.humidifier);

    if (!Firebase.RTDB.updateNodeAsync(&fbdo, "/devices", &json))
    {
        Serial.println("Firebase device upload failed: " + fbdo.errorReason());
    }
}

//==================================================
// Upload alerts -> /alerts/ (ONE call, fast)
//==================================================

void uploadAlerts()
{
    FirebaseJson json;

    json.set("low_water",     greenhouse.alarm.pumpTankLow);
    json.set("dht_failure",   greenhouse.alarm.dhtFailure);
    json.set("soil_failure",  greenhouse.alarm.soilFailure);
    json.set("emergency",     greenhouse.alarm.emergency);

    if (!Firebase.RTDB.updateNodeAsync(&fbdo, "/alerts", &json))
    {
        Serial.println("Firebase alert upload failed: " + fbdo.errorReason());
    }
}

//==================================================
// Read manual device commands (ONE blocking call at a time)
//==================================================

void readDeviceCommand(const char* path, void (*onFn)(), void (*offFn)())
{
    if (Firebase.RTDB.getBool(&fbdo, path))
    {
        bool val = fbdo.boolData();
        if (val) onFn(); else offFn();
    }
}

//==================================================
// Read Auto/Manual mode + selected crop (ONE call at a time)
//==================================================

void readAutoMode()
{
    if (Firebase.RTDB.getBool(&fbdo, "/config/auto_mode"))
    {
        greenhouse.settings.autoMode = fbdo.boolData();
    }
}

void readSelectedCrop()
{
    static String lastCrop = "";

    if (Firebase.RTDB.getString(&fbdo, "/config/selected_crop"))
    {
        String crop = fbdo.stringData();

        if (crop != lastCrop && crop.length() > 0)
        {
            applyCropThreshold(crop);
            lastCrop = crop;
        }
    }
}

//==================================================
// Main Update Function — ROUND ROBIN
// Only ONE Firebase operation runs per call, so the
// scheduler (and display) never blocks for long.
// Call this every FIREBASE_TASK_INTERVAL from scheduler.
//==================================================

void updateFirebase()
{
    if (WiFi.status() != WL_CONNECTED) { fbConnected = false; return; }

    
    if (!Firebase.ready())
{
    fbConnected = false;

    static unsigned long lastPrint = 0;

    if (millis() - lastPrint > 3000)
    {
        lastPrint = millis();
        Serial.println("Firebase NOT Ready");
    }

    return;
}


    fbConnected = true;

static bool printed = false;

if (!printed)
{
    printed = true;
    Serial.println("Firebase Ready");
}

    if (millis() - lastFirebaseSync < FIREBASE_SYNC_TIME) return;
    lastFirebaseSync = millis();

    // Only do auto_mode / manual device reads when NOT in auto mode
    switch (fbStep)
    {
        case 0:
            uploadSensorData();
            break;

        case 1:
            uploadDeviceStates();
            break;

        case 2:
            uploadAlerts();
            break;

        case 3:
            readAutoMode();
            break;

        case 4:
            readSelectedCrop();
            break;

        case 5:
            if (!greenhouse.settings.autoMode)
                readDeviceCommand("/devices/pump", pumpON, pumpOFF);
            break;

        case 6:
            if (!greenhouse.settings.autoMode)
                readDeviceCommand("/devices/fan", fanON, fanOFF);
            break;

        case 7:
            if (!greenhouse.settings.autoMode)
                readDeviceCommand("/devices/light", lightON, lightOFF);
            break;

        case 8:
            if (!greenhouse.settings.autoMode)
                readDeviceCommand("/devices/humidifier", humidifierON, humidifierOFF);
            break;
    }

    fbStep = (fbStep + 1) % 9;
}

bool firebaseConnected()
{
    return fbConnected;
}