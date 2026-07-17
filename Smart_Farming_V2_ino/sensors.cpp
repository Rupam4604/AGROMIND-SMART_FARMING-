#include <Arduino.h>
#include <DHT.h>

#include "config.h"
#include "datatypes.h"
#include "sensors.h"

extern SystemData greenhouse;

DHT dht(DHT_PIN, DHT_TYPE);

//==================================================
// Local Calibration Values
//==================================================

// Soil Sensor
const int SOIL_RAW_DRY = 4095;
const int SOIL_RAW_WET = 1200;

// Tank Sensor
const int TANK_RAW_EMPTY = 0;
const int TANK_RAW_FULL  = 4095;

//==================================================
// Initialization
//==================================================

/*void initSensors()
{
    dht.begin();

    pinMode(LDR_PIN, INPUT);

    pinMode(SOIL1_PIN, INPUT);
    pinMode(SOIL2_PIN, INPUT);

    pinMode(PUMP_LEVEL_PIN, INPUT);
    pinMode(HUMIDIFIER_LEVEL_PIN, INPUT);
}
*/

void initSensors()
{
    dht.begin();

    analogReadResolution(12);

    analogSetPinAttenuation(LDR_PIN, ADC_11db);
    analogSetPinAttenuation(SOIL1_PIN, ADC_11db);
    analogSetPinAttenuation(SOIL2_PIN, ADC_11db);
    analogSetPinAttenuation(PUMP_LEVEL_PIN, ADC_11db);
    analogSetPinAttenuation(HUMIDIFIER_LEVEL_PIN, ADC_11db);

    pinMode(LDR_PIN, INPUT);

    pinMode(SOIL1_PIN, INPUT);
    pinMode(SOIL2_PIN, INPUT);

    pinMode(PUMP_LEVEL_PIN, INPUT);
    pinMode(HUMIDIFIER_LEVEL_PIN, INPUT);
}

//==================================================
// Main Sensor Update
//==================================================

void readSensors()
{
    readDHT();

    readLDR();

    readSoil();

    readTankLevels();

    greenhouse.sensor.lastUpdate = millis();
}

//==================================================
// DHT22
//==================================================

void readDHT()
{
    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (isnan(t) || isnan(h))
    {
        greenhouse.sensor.dhtError = true;
        return;
    }

    greenhouse.sensor.temperature = t;
    greenhouse.sensor.humidity = h;
    greenhouse.sensor.dhtError = false;
}

//==================================================
// LDR
//==================================================

void readLDR()
{
    long total = 0;

    for (int i = 0; i < 10; i++)
    {
        total += analogRead(LDR_PIN);
        delayMicroseconds(500);
    }

    greenhouse.sensor.light = total / 10;
}

//==================================================
// Soil Moisture
//==================================================

void readSoil()
{
    long total1 = 0;
    long total2 = 0;

    for (int i = 0; i < 10; i++)
    {
        total1 += analogRead(SOIL1_PIN);
        total2 += analogRead(SOIL2_PIN);

        delayMicroseconds(500);
    }

    int raw1 = total1 / 10;
    int raw2 = total2 / 10;

    greenhouse.sensor.soil1 =
        map(raw1,
            SOIL_RAW_DRY,
            SOIL_RAW_WET,
            0,
            100);

    greenhouse.sensor.soil2 =
        map(raw2,
            SOIL_RAW_DRY,
            SOIL_RAW_WET,
            0,
            100);

    greenhouse.sensor.soil1 =
        constrain(greenhouse.sensor.soil1, 0, 100);

    greenhouse.sensor.soil2 =
        constrain(greenhouse.sensor.soil2, 0, 100);
}

//==================================================
// Water Tank Levels
//==================================================

/*
void readTankLevels()
{
    long pumpTotal = 0;
    long humidTotal = 0;

    for (int i = 0; i < 10; i++)
    {
        pumpTotal += analogRead(PUMP_LEVEL_PIN);
        humidTotal += analogRead(HUMIDIFIER_LEVEL_PIN);

        delayMicroseconds(500);
    }

    int pumpRaw = pumpTotal / 10;
    int humidRaw = humidTotal / 10;

    greenhouse.sensor.pumpTank =
        map(pumpRaw,
            TANK_RAW_EMPTY,
            TANK_RAW_FULL,
            0,
            100);

    greenhouse.sensor.humidifierTank =
        map(humidRaw,
            TANK_RAW_EMPTY,
            TANK_RAW_FULL,
            0,
            100);

    greenhouse.sensor.pumpTank =
        constrain(greenhouse.sensor.pumpTank, 0, 100);

    greenhouse.sensor.humidifierTank =
        constrain(greenhouse.sensor.humidifierTank, 0, 100);
}
*/

void readTankLevels()
{
    int pumpRaw = analogRead(PUMP_LEVEL_PIN);
    int humidRaw = analogRead(HUMIDIFIER_LEVEL_PIN);

    greenhouse.sensor.pumpTank = pumpRaw;
    greenhouse.sensor.humidifierTank = humidRaw;
}