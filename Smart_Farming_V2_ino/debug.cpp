#include <Arduino.h>

#include "debug.h"
#include "datatypes.h"

void printDebug()
{
    Serial.println();
    Serial.println("======================================");
    Serial.println(" SMART FARMING V2 DEBUG");
    Serial.println("======================================");

    if (greenhouse.sensor.dhtError)
    {
        Serial.println("DHT22 : ERROR");
    }
    else
    {
        Serial.print("Temperature : ");
        Serial.print(greenhouse.sensor.temperature);
        Serial.println(" C");

        Serial.print("Humidity    : ");
        Serial.print(greenhouse.sensor.humidity);
        Serial.println(" %");
    }

    Serial.print("LDR         : ");
    Serial.println(greenhouse.sensor.light);

    Serial.print("Soil 1      : ");
    Serial.println(greenhouse.sensor.soil1);

    Serial.print("Soil 2      : ");
    Serial.println(greenhouse.sensor.soil2);

    Serial.print("Pump Tank   : ");
    Serial.println(greenhouse.sensor.pumpTank);

    Serial.print("Hum Tank    : ");
    Serial.println(greenhouse.sensor.humidifierTank);

    Serial.println("======================================");


    //  RELAY STATUS //

    Serial.println();
Serial.println("----------- RELAY STATUS -----------");

Serial.print("Fan          : ");
Serial.println(greenhouse.relay.fan ? "ON" : "OFF");

Serial.print("Humidifier   : ");
Serial.println(greenhouse.relay.humidifier ? "ON" : "OFF");

Serial.print("Grow Light   : ");
Serial.println(greenhouse.relay.light ? "ON" : "OFF");

Serial.print("Pump         : ");
Serial.println(greenhouse.relay.pump ? "ON" : "OFF");

Serial.println("------------------------------------");

Serial.println();

Serial.println("========== AUTOMATION ==========");

Serial.print("Fan          : ");
Serial.println(greenhouse.relay.fan ? "ON" : "OFF");

Serial.print("Humidifier   : ");
Serial.println(greenhouse.relay.humidifier ? "ON" : "OFF");

Serial.print("Grow Light   : ");
Serial.println(greenhouse.relay.light ? "ON" : "OFF");

Serial.print("Pump         : ");
Serial.println(greenhouse.relay.pump ? "ON" : "OFF");

Serial.println("===============================");


// PUMP STATUS

Serial.println();
Serial.println("========== PUMP ==========");

Serial.print("Average Soil : ");
Serial.println((greenhouse.sensor.soil1 +
                greenhouse.sensor.soil2)/2);

Serial.print("Pump State : ");

switch(greenhouse.pumpController.state)
{
    case IDLE:
        Serial.println("IDLE");
        break;

    case WAITING:
        Serial.println("WAITING");
        break;

    case RUNNING:
        Serial.println("RUNNING");
        break;

    case COOLDOWN:
        Serial.println("COOLDOWN");
        break;

    case FAULT:
        Serial.println("FAULT");
        break;
}

Serial.println();
Serial.println("========== FAN ==========");

Serial.print("Temperature : ");
Serial.println(greenhouse.sensor.temperature);

Serial.print("Fan State : ");

switch (greenhouse.fanController.state)
{
    case IDLE:
        Serial.println("IDLE");
        break;

    case WAITING:
        Serial.println("WAITING");
        break;

    case RUNNING:
        Serial.println("RUNNING");
        break;

    case COOLDOWN:
        Serial.println("COOLDOWN");
        break;

    case FAULT:
        Serial.println("FAULT");
        break;
}

Serial.println();
Serial.println("====== HUMIDIFIER ======");

Serial.print("Humidity : ");
Serial.println(greenhouse.sensor.humidity);

Serial.print("Pump Tank   : ");
Serial.println(greenhouse.sensor.pumpTank);

Serial.print("Humidity Tank : ");
Serial.println(greenhouse.sensor.humidifierTank);



Serial.print("State : ");

switch(greenhouse.humidifierController.state)
{
    case IDLE:      Serial.println("IDLE"); break;
    case WAITING:   Serial.println("WAITING"); break;
    case RUNNING:   Serial.println("RUNNING"); break;
    case COOLDOWN:  Serial.println("COOLDOWN"); break;
    case FAULT:     Serial.println("FAULT"); break;
}

}