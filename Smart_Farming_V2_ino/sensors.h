#ifndef SENSORS_H
#define SENSORS_H

void initSensors();
void readSensors();

// Individual sensor readers
void readDHT();
void readLDR();
void readSoil();
void readTankLevels();

#endif