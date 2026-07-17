#include <WiFi.h>

#include <cstring>

#include "config.h"
#include "datatypes.h"

#include "wifi_manager.h"
#include "wifi_config.h"

extern SystemData greenhouse;

static bool printedConnected = false;

void initWiFi()
{
    greenhouse.wifi.connected = false;
    greenhouse.wifi.internet = false;
    greenhouse.wifi.rssi = 0;
    strcpy(greenhouse.wifi.ip, "");

    greenhouse.wifi.lastReconnect = 0;
    greenhouse.wifi.lastCheck = 0;

    WiFi.mode(WIFI_STA);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.println();
    Serial.println("==================================");
    Serial.println("Connecting to WiFi...");
    Serial.print("SSID : ");
    Serial.println(WIFI_SSID);
    Serial.println("==================================");
}

void updateWiFi()
{
    //---------------------------------
    // Connected
    //---------------------------------

    if (WiFi.status() == WL_CONNECTED)
    {
        greenhouse.wifi.connected = true;
        greenhouse.wifi.internet = true;

        greenhouse.wifi.rssi = WiFi.RSSI();
        greenhouse.wifi.lastCheck = millis();

        String ip = WiFi.localIP().toString();

strncpy(
    greenhouse.wifi.ip,
    ip.c_str(),
    sizeof(greenhouse.wifi.ip) - 1
);

greenhouse.wifi.ip[sizeof(greenhouse.wifi.ip) - 1] = '\0';

        if (!printedConnected)
        {
            Serial.println();
            Serial.println("==================================");
            Serial.println("WiFi Connected!");
            Serial.print("IP Address : ");
            Serial.println(greenhouse.wifi.ip);
            Serial.print("Signal RSSI: ");
            Serial.println(greenhouse.wifi.rssi);
            Serial.println("==================================");
            printedConnected = true;
        }

        return;
    }

    //---------------------------------
    // Not Connected
    //---------------------------------

    if (printedConnected)
    {
        Serial.println("WiFi Disconnected!");
        printedConnected = false;
    }

    greenhouse.wifi.connected = false;
    greenhouse.wifi.internet = false;

    strcpy(greenhouse.wifi.ip, "");

    if (millis() - greenhouse.wifi.lastReconnect >= WIFI_RETRY_TIME)
    {
        greenhouse.wifi.lastReconnect = millis();

        Serial.println("WiFi Reconnecting...");
        Serial.print("Status code: ");
        Serial.println(WiFi.status());

        WiFi.disconnect();

        delay(100);

        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    }
}

bool wifiConnected()
{
    return WiFi.status() == WL_CONNECTED;
}