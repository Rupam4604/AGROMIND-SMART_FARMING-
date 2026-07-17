#include <Arduino.h>

#include "config.h"
#include "datatypes.h"
#include "relay.h"

extern SystemData greenhouse;

//==================================================
// INTERNAL HELPER
//==================================================

static void setRelay(uint8_t pin, bool &status, bool on)
{
    // Active LOW Relay
    digitalWrite(pin, on ? LOW : HIGH);
    status = on;
}

//==================================================
// INITIALIZATION
//==================================================

void initRelays()
{
    pinMode(RELAY_FAN, OUTPUT);
    pinMode(RELAY_HUMIDIFIER, OUTPUT);
    pinMode(RELAY_LIGHT, OUTPUT);
    pinMode(RELAY_PUMP, OUTPUT);

    allRelaysOFF();
}

//==================================================
// FAN
//==================================================

void fanON()
{
    setRelay(RELAY_FAN, greenhouse.relay.fan, true);
}

void fanOFF()
{
    setRelay(RELAY_FAN, greenhouse.relay.fan, false);
}

//==================================================
// HUMIDIFIER
//==================================================

void humidifierON()
{
    setRelay(RELAY_HUMIDIFIER, greenhouse.relay.humidifier, true);
}

void humidifierOFF()
{
    setRelay(RELAY_HUMIDIFIER, greenhouse.relay.humidifier, false);
}

//==================================================
// GROW LIGHT
//==================================================

void lightON()
{
    setRelay(RELAY_LIGHT, greenhouse.relay.light, true);
}

void lightOFF()
{
    setRelay(RELAY_LIGHT, greenhouse.relay.light, false);
}

//==================================================
// WATER PUMP
//==================================================

void pumpON()
{
    setRelay(RELAY_PUMP, greenhouse.relay.pump, true);
}

void pumpOFF()
{
    setRelay(RELAY_PUMP, greenhouse.relay.pump, false);
}

//==================================================
// ALL RELAYS OFF
//==================================================

void allRelaysOFF()
{
    fanOFF();
    humidifierOFF();
    lightOFF();
    pumpOFF();
}