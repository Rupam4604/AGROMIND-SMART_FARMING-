#include "config.h"
#include "datatypes.h"

#include "settings_manager.h"

extern SystemData greenhouse;

void loadDefaultSettings()
{
    //-----------------------------
    // Fan
    //-----------------------------

    greenhouse.settings.fanOnTemp = FAN_ON_TEMP;
    greenhouse.settings.fanOffTemp = FAN_OFF_TEMP;

    //-----------------------------
    // Humidifier
    //-----------------------------

    greenhouse.settings.humidifierOn = HUMIDIFIER_ON;
    greenhouse.settings.humidifierOff = HUMIDIFIER_OFF;

    //-----------------------------
    // Soil
    //-----------------------------

    greenhouse.settings.soilDry = SOIL_DRY_LEVEL;
    greenhouse.settings.soilWet = SOIL_WET_LEVEL;

    //-----------------------------
    // Light
    //-----------------------------

    greenhouse.settings.lightOn = LIGHT_ON_LEVEL;
    greenhouse.settings.lightOff = LIGHT_OFF_LEVEL;

    //-----------------------------
    // Tank
    //-----------------------------

    greenhouse.settings.tankLowLevel = TANK_LOW_LEVEL;

    //-----------------------------
    // LCD

    greenhouse.settings.lcdBrightness = 100;

    //-----------------------------
    // Automation

    greenhouse.settings.autoMode = true;
}