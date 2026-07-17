#include <Arduino.h>

#include "config.h"
#include "datatypes.h"
#include "relay.h"

#include "fan_controller.h"

void initFanController()
{
    greenhouse.fanController.state = IDLE;
    greenhouse.fanController.timer = 0;
    greenhouse.fanController.runTimer = 0;
}

void runFanController()
{
    switch (greenhouse.fanController.state)
    {

    //-------------------------------------------------
    case IDLE:

        fanOFF();

        if (!greenhouse.sensor.dhtError &&
            greenhouse.sensor.temperature >= greenhouse.settings.fanOnTemp)
        {
            greenhouse.fanController.timer = millis();
            greenhouse.fanController.state = WAITING;
        }

        break;

    //-------------------------------------------------
    case WAITING:

        if (greenhouse.sensor.dhtError)
        {
            greenhouse.fanController.state = FAULT;
            break;
        }

        if (greenhouse.sensor.temperature < greenhouse.settings.fanOnTemp)
        {
            greenhouse.fanController.state = IDLE;
            break;
        }

        if (millis() - greenhouse.fanController.timer >= FAN_CONFIRM_TIME)
        {
            fanON();

            greenhouse.fanController.runTimer = millis();

            greenhouse.fanController.state = RUNNING;
        }

        break;

    //-------------------------------------------------
    case RUNNING:

        if (greenhouse.sensor.dhtError)
        {
            fanOFF();

            greenhouse.fanController.state = FAULT;

            break;
        }

        if (millis() - greenhouse.fanController.runTimer < FAN_MIN_ON_TIME)
            break;

        if (greenhouse.sensor.temperature <= greenhouse.settings.fanOffTemp)
        {
            fanOFF();

            greenhouse.fanController.timer = millis();

            greenhouse.fanController.state = COOLDOWN;
        }

        break;

    //-------------------------------------------------
    case COOLDOWN:

        if (millis() - greenhouse.fanController.timer >= FAN_MIN_OFF_TIME)
        {
            greenhouse.fanController.state = IDLE;
        }

        break;

    //-------------------------------------------------
    case FAULT:

        fanOFF();

        if (!greenhouse.sensor.dhtError)
        {
            greenhouse.fanController.state = IDLE;
        }

        break;
    }
}