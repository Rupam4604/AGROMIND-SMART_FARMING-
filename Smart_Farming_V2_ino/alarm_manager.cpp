#include <Arduino.h>

#include "config.h"
#include "datatypes.h"

#include "alarm_manager.h"

void initAlarmManager()
{
    greenhouse.alarm.pumpTankLow = false;

    greenhouse.alarm.humidifierTankLow = false;

    greenhouse.alarm.dhtFailure = false;

    greenhouse.alarm.soilFailure = false;

    greenhouse.alarm.ldrFailure = false;

    greenhouse.alarm.emergency = false;
}

void runAlarmManager()
{
    //--------------------------------------------------
    // Pump Tank
    //--------------------------------------------------

    greenhouse.alarm.pumpTankLow =
        (greenhouse.sensor.pumpTank <= greenhouse.settings.tankLowLevel);

    //--------------------------------------------------
    // Humidifier Tank
    //--------------------------------------------------

    greenhouse.alarm.humidifierTankLow =
        (greenhouse.sensor.humidifierTank <= greenhouse.settings.tankLowLevel);

    //--------------------------------------------------
    // DHT
    //--------------------------------------------------

    greenhouse.alarm.dhtFailure =
        greenhouse.sensor.dhtError;

    //--------------------------------------------------
    // Emergency
    //--------------------------------------------------

    greenhouse.alarm.emergency =
        greenhouse.alarm.dhtFailure ||
        greenhouse.alarm.pumpTankLow ||
        greenhouse.alarm.humidifierTankLow;

    //--------------------------------------------------
    // BUZZER CONTROL
    //--------------------------------------------------

    // Pump Tank Buzzer
    digitalWrite(PUMP_BUZZER,
                 greenhouse.alarm.pumpTankLow ? HIGH : LOW);

    // Humidifier Tank Buzzer
    digitalWrite(HUMIDIFIER_BUZZER,
                 greenhouse.alarm.humidifierTankLow ? HIGH : LOW);

    // Error Buzzer
    digitalWrite(ERROR_BUZZER,
                 greenhouse.alarm.dhtFailure ? LOW : HIGH);
}