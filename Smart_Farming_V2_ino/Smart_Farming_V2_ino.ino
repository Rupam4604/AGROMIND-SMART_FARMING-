#include "version.h"
#include "config.h"
#include "datatypes.h"

#include "settings_manager.h"
#include "preferences_manager.h"

#include "sensors.h"
#include "relay.h"
#include "display.h"
#include "automation.h"

#include "light_controller.h"
#include "pump_controller.h"
#include "fan_controller.h"
#include "humidifier_controller.h"

#include "alarm_manager.h"
#include "wifi_manager.h"
#include "firebase_manager.h"
#include "scheduler.h"

#include "debug.h"

void setup()
{
    //==================================================
    // Serial
    //==================================================

    Serial.begin(SERIAL_BAUDRATE);

    Serial.println();
    Serial.println("====================================");
    Serial.println(PROJECT_NAME);
    Serial.println(FIRMWARE_VERSION);
    Serial.println("Booting...");
    Serial.println("====================================");

    //==================================================
    // Load Default Settings
    //==================================================

    loadDefaultSettings();

    //==================================================
    // Load Saved Settings (NVS)
    //==================================================

    initPreferences();
    loadSettings();

    //==================================================
    // Hardware Initialization
    //==================================================

    initSensors();
    initRelays();
    initDisplay();

    //==================================================
    // Controllers
    //==================================================

    initLightController();
    initPumpController();
    initFanController();
    initHumidifierController();

    //==================================================
    // Alarm Manager
    //==================================================

    initAlarmManager();

    //==================================================
    // Automation
    //==================================================

    initAutomation();

    //==================================================
// WiFi
//==================================================

initWiFi();

// Wait until WiFi connects

Serial.println("Waiting for WiFi...");

while (!wifiConnected())
{
    updateWiFi();
    delay(100);
}

Serial.println("WiFi Ready!");

//==================================================
// Firebase
//==================================================

initFirebase();

//==================================================
// Scheduler
//==================================================

initScheduler();


    Serial.println("System Ready");
    Serial.println();
}

// IMPROVE LOOP WITH SCHEDULAR

void loop()
{
    runScheduler();
}



