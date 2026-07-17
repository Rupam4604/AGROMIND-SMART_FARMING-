#include <Arduino.h>

#include "config.h"
#include "scheduler.h"

#include "sensors.h"
#include "automation.h"
#include "display.h"
#include "debug.h"
#include "wifi_manager.h"
#include "firebase_manager.h"

//==================================================
// Scheduler Timers
//==================================================

static unsigned long sensorTimer = 0;
static unsigned long automationTimer = 0;
static unsigned long displayTimer = 0;
static unsigned long debugTimer = 0;
static unsigned long wifiTimer = 0;
static unsigned long firebaseTimer = 0;

//==================================================
// Scheduler Initialization
//==================================================

void initScheduler()
{
    unsigned long now = millis();

    sensorTimer = now;
    automationTimer = now;
    displayTimer = now;
    debugTimer = now;
    wifiTimer = now;
    firebaseTimer = now;
}

//==================================================
// Scheduler
//==================================================

void runScheduler()
{
    unsigned long now = millis();

    //==================================================
    // Sensor Task
    //==================================================

    if (now - sensorTimer >= SENSOR_TASK_INTERVAL)
    {
        sensorTimer = now;
        readSensors();
    }

    //==================================================
    // Automation Task
    //==================================================

    if (now - automationTimer >= AUTOMATION_TASK_INTERVAL)
    {
        automationTimer = now;
        runAutomation();
    }

    //==================================================
    // LCD Display Task
    //==================================================

    if (now - displayTimer >= DISPLAY_TASK_INTERVAL)
    {
        displayTimer = now;
        updateDisplay();
    }

    //==================================================
    // Serial Debug Task
    //==================================================

    if (now - debugTimer >= DEBUG_TASK_INTERVAL)
    {
        debugTimer = now;

#if ENABLE_SERIAL_DEBUG
        printDebug();
#endif
    }

    //==================================================
    // WiFi Task
    //==================================================

    if (now - wifiTimer >= WIFI_TASK_INTERVAL)
    {
        wifiTimer = now;
        updateWiFi();
    }

    //==================================================
    // Firebase Task
    //==================================================


    if (now - firebaseTimer >= FIREBASE_TASK_INTERVAL)
{
    firebaseTimer = now;

    // Only update Firebase after initialization
    updateFirebase();
}


}