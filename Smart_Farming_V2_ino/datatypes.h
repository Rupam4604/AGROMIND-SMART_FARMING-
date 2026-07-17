#ifndef DATATYPES_H
#define DATATYPES_H

#include <Arduino.h>

//==================================================
// CONTROLLER STATES
//==================================================

enum ControllerState
{
    IDLE,
    WAITING,
    RUNNING,
    COOLDOWN,
    FAULT
};

//==================================================
// SENSOR DATA
//==================================================

struct SensorData
{
    float temperature = 0.0f;
    float humidity = 0.0f;

    int light = 0;

    int soil1 = 0;
    int soil2 = 0;

    int pumpTank = 0;
    int humidifierTank = 0;

    bool dhtError = false;

    unsigned long lastUpdate = 0;
};

//==================================================
// RELAY STATUS
//==================================================

struct RelayData
{
    bool fan = false;
    bool humidifier = false;
    bool light = false;
    bool pump = false;
};

//==================================================
// ALARM STATUS
//==================================================

struct AlarmData
{
    bool pumpTankLow = false;

    bool humidifierTankLow = false;

    bool dhtFailure = false;

    bool soilFailure = false;

    bool ldrFailure = false;

    bool emergency = false;
};

//==================================================
// GENERIC CONTROLLER DATA
//==================================================

struct ControllerData
{
    ControllerState state = IDLE;

    unsigned long timer = 0;

    unsigned long runTimer = 0;
};

//==================================================
// SYSTEM SETTINGS
//==================================================

struct Settings
{
    // Fan
    float fanOnTemp = 30.0f;
    float fanOffTemp = 28.0f;

    // Humidifier
    float humidifierOn = 55.0f;
    float humidifierOff = 70.0f;

    // Soil
    int soilDry = 40;
    int soilWet = 70;

    // Grow Light
    int lightOn = 3000;
    int lightOff = 1500;

    // Tank
    int tankLowLevel = 20;

    // LCD
    uint8_t lcdBrightness = 100;

    // Automation
    bool autoMode = true;
};

//==================================================
// WIFI STATUS
//==================================================

struct WiFiData
{
    bool connected = false;

    bool internet = false;

    int rssi = 0;

    char ip[16] = "";

    unsigned long lastReconnect = 0;

    unsigned long lastCheck = 0;
};

//==================================================
// SYSTEM DATA
//==================================================

struct SystemData
{
    //---------------- Sensors ----------------

    SensorData sensor;

    //---------------- Outputs ----------------

    RelayData relay;

    //---------------- Alarm ------------------

    AlarmData alarm;

    //---------------- Settings ---------------

    Settings settings;

    //---------------- WiFi -------------------

    WiFiData wifi;

    //---------------- Controllers ------------

    ControllerData lightController;

    ControllerData pumpController;

    ControllerData fanController;

    ControllerData humidifierController;
};

//==================================================
// GLOBAL OBJECT
//==================================================

extern SystemData greenhouse;

#endif