#include <Arduino.h>

#include "config.h"
#include "datatypes.h"
#include "relay.h"

#include "humidifier_controller.h"

void initHumidifierController()
{
    greenhouse.humidifierController.state = IDLE;

    greenhouse.humidifierController.timer = 0;

    greenhouse.humidifierController.runTimer = 0;
}

void runHumidifierController()
{
    switch(greenhouse.humidifierController.state)
    {

    //------------------------------------------------
    case IDLE:

        humidifierOFF();

        if(!greenhouse.sensor.dhtError &&
           greenhouse.sensor.humidity <= greenhouse.settings.humidifierOn &&
           greenhouse.sensor.humidifierTank > greenhouse.settings.tankLowLevel)
        {
            greenhouse.humidifierController.timer = millis();

            greenhouse.humidifierController.state = WAITING;
        }

        break;

    //------------------------------------------------
    case WAITING:

        if(greenhouse.sensor.dhtError)
        {
            greenhouse.humidifierController.state = FAULT;
            break;
        }

        if(greenhouse.sensor.humidifierTank <= greenhouse.settings.tankLowLevel)
        {
            greenhouse.humidifierController.state = FAULT;
            break;
        }

        if(greenhouse.sensor.humidity > greenhouse.settings.humidifierOn)
        {
            greenhouse.humidifierController.state = IDLE;
            break;
        }

        if(millis() - greenhouse.humidifierController.timer >= HUMIDIFIER_CONFIRM_TIME)
        {
            humidifierON();

            greenhouse.humidifierController.runTimer = millis();

            greenhouse.humidifierController.state = RUNNING;
        }

        break;

    //------------------------------------------------
    case RUNNING:

        if(greenhouse.sensor.dhtError ||
           greenhouse.sensor.humidifierTank <= greenhouse.settings.tankLowLevel)
        {
            humidifierOFF();

            greenhouse.humidifierController.state = FAULT;

            break;
        }

        if(millis() - greenhouse.humidifierController.runTimer < HUMIDIFIER_MIN_ON_TIME)
            break;

        if(greenhouse.sensor.humidity >= greenhouse.settings.humidifierOff)
        {
            humidifierOFF();

            greenhouse.humidifierController.timer = millis();

            greenhouse.humidifierController.state = COOLDOWN;
        }

        break;

    //------------------------------------------------
    case COOLDOWN:

        if(millis() - greenhouse.humidifierController.timer >= HUMIDIFIER_MIN_OFF_TIME)
        {
            greenhouse.humidifierController.state = IDLE;
        }

        break;

    //------------------------------------------------
    case FAULT:

        humidifierOFF();

        if(!greenhouse.sensor.dhtError &&
           greenhouse.sensor.humidifierTank > greenhouse.settings.tankLowLevel)
        {
            greenhouse.humidifierController.state = IDLE;
        }

        break;
    }
}