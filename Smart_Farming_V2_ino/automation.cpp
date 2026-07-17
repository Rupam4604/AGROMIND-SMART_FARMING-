#include <Arduino.h>

#include "config.h"
#include "datatypes.h"

#include "automation.h"

#include "light_controller.h"
#include "pump_controller.h"
#include "fan_controller.h"
#include "humidifier_controller.h"

#include "alarm_manager.h"

extern SystemData greenhouse;

//==================================================
// INITIALIZATION
//==================================================

void initAutomation()
{
    // Reserved for future use
}

//==================================================
// MAIN AUTOMATION
//==================================================

void runAutomation()
{
    //--------------------------------------------------
    // Always update alarms
    //--------------------------------------------------

    runAlarmManager();

    //--------------------------------------------------
    // Manual Mode
    //--------------------------------------------------

    if (!greenhouse.settings.autoMode)
    {
        // ESP32 automation disabled.
        // Firebase dashboard controls the relays.
        return;
    }

    //--------------------------------------------------
    // Automatic Controllers
    //--------------------------------------------------

    runFanController();

    runHumidifierController();

    runLightController();

    runPumpController();
}