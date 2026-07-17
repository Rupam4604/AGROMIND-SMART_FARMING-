#include <Arduino.h>

#include "config.h"
#include "datatypes.h"
#include "relay.h"
#include "light_controller.h"

void initLightController()
{
    greenhouse.lightController.state = IDLE;
    greenhouse.lightController.timer = 0;
    greenhouse.lightController.runTimer = 0;
}

void runLightController()
{
    switch (greenhouse.lightController.state)
    {

    //--------------------------------------------------
    case IDLE:

        // Dark detected
        if (greenhouse.sensor.light >= greenhouse.settings.lightOn)
        {
            greenhouse.lightController.timer = millis();

            greenhouse.lightController.state = WAITING;
        }

        break;

    //--------------------------------------------------
    case WAITING:

        // Became bright again before confirmation
        if (greenhouse.sensor.light < greenhouse.settings.lightOn)
        {
            greenhouse.lightController.state = IDLE;
            break;
        }

        // Dark confirmed
        if (millis() - greenhouse.lightController.timer >= LIGHT_CONFIRM_TIME)
        {
            lightON();

            greenhouse.lightController.runTimer = millis();

            greenhouse.lightController.state = RUNNING;
        }

        break;

    //--------------------------------------------------
    case RUNNING:

        // Keep light ON for minimum time
        if (millis() - greenhouse.lightController.runTimer < LIGHT_MIN_ON_TIME)
            break;

        // Bright again
        if (greenhouse.sensor.light <= greenhouse.settings.lightOff)
        {
            lightOFF();

            greenhouse.lightController.state = IDLE;
        }

        break;

    //--------------------------------------------------
    case FAULT:

        lightOFF();

        break;
    }
}