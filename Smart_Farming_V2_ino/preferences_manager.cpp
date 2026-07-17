#include <Preferences.h>

#include "preferences_manager.h"
#include "settings_manager.h"
#include "datatypes.h"

Preferences preferences;

extern SystemData greenhouse;

void initPreferences()
{
    preferences.begin("Greenhouse", false);
}

void loadSettings()
{
    if (!preferences.isKey("fanOn"))
    {
        loadDefaultSettings();
        saveSettings();
        return;
    }

    greenhouse.settings.fanOnTemp =
        preferences.getFloat("fanOn");

    greenhouse.settings.fanOffTemp =
        preferences.getFloat("fanOff");

    greenhouse.settings.humidifierOn =
        preferences.getFloat("humOn");

    greenhouse.settings.humidifierOff =
        preferences.getFloat("humOff");

    greenhouse.settings.soilDry =
        preferences.getInt("soilDry");

    greenhouse.settings.soilWet =
        preferences.getInt("soilWet");

    greenhouse.settings.lightOn =
        preferences.getInt("lightOn");

    greenhouse.settings.lightOff =
        preferences.getInt("lightOff");

    greenhouse.settings.tankLowLevel =
        preferences.getInt("tankLow");

    greenhouse.settings.autoMode =
        preferences.getBool("auto");
}

void saveSettings()
{
    preferences.putFloat("fanOn",
        greenhouse.settings.fanOnTemp);

    preferences.putFloat("fanOff",
        greenhouse.settings.fanOffTemp);

    preferences.putFloat("humOn",
        greenhouse.settings.humidifierOn);

    preferences.putFloat("humOff",
        greenhouse.settings.humidifierOff);

    preferences.putInt("soilDry",
        greenhouse.settings.soilDry);

    preferences.putInt("soilWet",
        greenhouse.settings.soilWet);

    preferences.putInt("lightOn",
        greenhouse.settings.lightOn);

    preferences.putInt("lightOff",
        greenhouse.settings.lightOff);

    preferences.putInt("tankLow",
        greenhouse.settings.tankLowLevel);

    preferences.putBool("auto",
        greenhouse.settings.autoMode);
}

void resetSettings()
{
    preferences.clear();

    loadDefaultSettings();

    saveSettings();
}