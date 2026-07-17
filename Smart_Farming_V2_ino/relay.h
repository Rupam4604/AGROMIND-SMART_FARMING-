#ifndef RELAY_H
#define RELAY_H

#include <Arduino.h>

//==================================================
// INITIALIZATION
//==================================================

void initRelays();

//==================================================
// INDIVIDUAL RELAY CONTROL
//==================================================

void fanON();
void fanOFF();

void humidifierON();
void humidifierOFF();

void lightON();
void lightOFF();

void pumpON();
void pumpOFF();

//==================================================
// GLOBAL CONTROL
//==================================================

void allRelaysOFF();

#endif