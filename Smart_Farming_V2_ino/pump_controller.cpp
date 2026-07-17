#include <Arduino.h>

#include "config.h"
#include "datatypes.h"
#include "relay.h"

#include "pump_controller.h"

void initPumpController()
{
    greenhouse.pumpController.state = IDLE;

    greenhouse.pumpController.timer = 0;

    greenhouse.pumpController.runTimer = 0;
}

void runPumpController()
{
    int averageSoil =
        (greenhouse.sensor.soil1 +
         greenhouse.sensor.soil2) / 2;

    switch(greenhouse.pumpController.state)
    {

    //------------------------------------------------
    case IDLE:

        pumpOFF();

        if(averageSoil <= greenhouse.settings.soilDry &&
           greenhouse.sensor.pumpTank > greenhouse.settings.tankLowLevel)
        {
            greenhouse.pumpController.timer = millis();

            greenhouse.pumpController.state = WAITING;
        }

        break;

    //------------------------------------------------
    case WAITING:

        if(averageSoil > greenhouse.settings.soilDry)
        {
            greenhouse.pumpController.state = IDLE;
            break;
        }

        if(greenhouse.sensor.pumpTank <= greenhouse.settings.tankLowLevel)
        {
            greenhouse.pumpController.state = FAULT;
            break;
        }

        if(millis() - greenhouse.pumpController.timer >= PUMP_CONFIRM_TIME)
        {
            pumpON();

            greenhouse.pumpController.runTimer = millis();

            greenhouse.pumpController.state = RUNNING;
        }

        break;

    //------------------------------------------------
    case RUNNING:

        if(greenhouse.sensor.pumpTank <= greenhouse.settings.tankLowLevel)
        {
            pumpOFF();

            greenhouse.pumpController.state = FAULT;

            break;
        }

        if(millis() - greenhouse.pumpController.runTimer < PUMP_MIN_ON_TIME)
            break;

        if(averageSoil >= greenhouse.settings.soilWet)
        {
            pumpOFF();

            greenhouse.pumpController.timer = millis();

            greenhouse.pumpController.state = COOLDOWN;
        }

        break;

    //------------------------------------------------
    case COOLDOWN:

        if(millis() - greenhouse.pumpController.timer >= PUMP_MIN_OFF_TIME)
        {
            greenhouse.pumpController.state = IDLE;
        }

        break;

    //------------------------------------------------
    case FAULT:

    pumpOFF();

    if (greenhouse.sensor.pumpTank >
        greenhouse.settings.tankLowLevel + 5)
    {
        greenhouse.pumpController.state = IDLE;
    }

    break;
    }
}