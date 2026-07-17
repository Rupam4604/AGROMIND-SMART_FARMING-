#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#include "config.h"
#include "version.h"
#include "datatypes.h"
#include "display.h"

#include "wifi_manager.h"
#include "firebase_manager.h"

extern SystemData greenhouse;

LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);

//==================================================
// Variables
//==================================================

byte currentPage = 0;
unsigned long lastPageChange = 0;

//==================================================

void initDisplay()
{
    Wire.begin(I2C_SDA, I2C_SCL);

    lcd.init();
    lcd.backlight();

    showBootScreen();
}

//==================================================

void showBootScreen()
{
    lcd.clear();

    lcd.setCursor(0,0);
    lcd.print(PROJECT_NAME);

    lcd.setCursor(0,1);
    lcd.print("Firmware ");
    lcd.print(FIRMWARE_VERSION);

    lcd.setCursor(0,2);
    lcd.print("Initializing...");

    delay(2500);

    lcd.clear();
}

//==================================================

void nextPage()
{
    currentPage++;

    if(currentPage > 5)
        currentPage = 0;
}

//==================================================

void updateDisplay()
{
    if(millis() - lastPageChange >= LCD_PAGE_CHANGE_TIME)
    {
        lastPageChange = millis();

        nextPage();

        lcd.clear();
    }

    switch(currentPage)
    {

    //==================================================
    // PAGE 1 : ENVIRONMENT
    //==================================================

    case 0:

        lcd.setCursor(0,0);
        lcd.print("===ENVIRONMENT====");

        lcd.setCursor(0,1);
        lcd.print("T:");
        lcd.print(greenhouse.sensor.temperature,1);
        lcd.print((char)223);
        lcd.print("C");

        lcd.setCursor(11,1);
        lcd.print("H:");
        lcd.print(greenhouse.sensor.humidity,0);
        lcd.print("%");

        lcd.setCursor(0,2);
        lcd.print("Light:");
        lcd.print(greenhouse.sensor.light);
        lcd.print("   ");

        lcd.setCursor(0,3);
        lcd.print("Mode:");
        lcd.print(greenhouse.settings.autoMode ? "AUTO " : "MANUAL");

        break;

    //==================================================
    // PAGE 2 : SOIL & TANK
    //==================================================

    case 1:

        lcd.setCursor(0,0);
        lcd.print("===SOIL & TANK===");

        lcd.setCursor(0,1);
        lcd.print("S1:");
        lcd.print(greenhouse.sensor.soil1);
        lcd.print("% ");

        lcd.setCursor(10,1);
        lcd.print("S2:");
        lcd.print(greenhouse.sensor.soil2);
        lcd.print("% ");

        lcd.setCursor(0,2);
        lcd.print("Pump:");
        lcd.print(greenhouse.sensor.pumpTank);
        lcd.print("% ");

        lcd.setCursor(10,2);
        lcd.print("Hum:");
        lcd.print(greenhouse.sensor.humidifierTank);
        lcd.print("% ");

        break;

    //==================================================
    // PAGE 3 : DEVICES
    //==================================================

    case 2:

        lcd.setCursor(0,0);
        lcd.print("====DEVICES=====");

        lcd.setCursor(0,1);
        lcd.print("Fan:");
        lcd.print(greenhouse.relay.fan ? "ON " : "OFF");

        lcd.setCursor(11,1);
        lcd.print("Hum:");
        lcd.print(greenhouse.relay.humidifier ? "ON " : "OFF");

        lcd.setCursor(0,2);
        lcd.print("Light:");
        lcd.print(greenhouse.relay.light ? "ON " : "OFF");

        lcd.setCursor(11,2);
        lcd.print("Pump:");
        lcd.print(greenhouse.relay.pump ? "ON " : "OFF");

        break;

    //==================================================
    // PAGE 4 : NETWORK
    //==================================================

    case 3:

lcd.setCursor(0,0);
lcd.print("====NETWORK====");

lcd.setCursor(0,1);
lcd.print("WiFi:");

lcd.print(greenhouse.wifi.connected ? "OK " : "OFF");

lcd.setCursor(0,2);
lcd.print("Cloud:");

lcd.print(firebaseConnected() ? "OK" : "OFF");

lcd.setCursor(0,3);
lcd.print("RSSI:");

lcd.print(greenhouse.wifi.rssi);

break;

    //==================================================
    // PAGE 5 : ALARMS
    //==================================================

    case 4:

        lcd.setCursor(0,0);
        lcd.print("=====ALARMS=====");

        lcd.setCursor(0,1);

        if(greenhouse.alarm.pumpTankLow)
            lcd.print("Pump Tank LOW ");
        else
            lcd.print("Pump Tank OK  ");

        lcd.setCursor(0,2);

        if(greenhouse.alarm.humidifierTankLow)
            lcd.print("Hum Tank LOW  ");
        else
            lcd.print("Hum Tank OK   ");

        lcd.setCursor(0,3);

        if(greenhouse.alarm.dhtFailure)
            lcd.print("DHT ERROR");
        else
            lcd.print("Sensors OK");

        break;

    //==================================================
    // PAGE 6 : SYSTEM
    //==================================================

    case 5:

lcd.setCursor(0,0);
lcd.print("====SYSTEM====");

lcd.setCursor(0,1);
lcd.print(FIRMWARE_VERSION);

lcd.setCursor(0,2);
lcd.print("AUTO:");

lcd.print(greenhouse.settings.autoMode ? "YES" : "NO ");

lcd.setCursor(0,3);
lcd.print("UP:");

lcd.print(millis()/1000);

lcd.print("s");

break;
    }
}