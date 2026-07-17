
//==================================================
// Smart Farming V2
// Configuration File
// Contains hardware pins, timing values,
// default thresholds and project settings.
//==================================================



#ifndef CONFIG_H
#define CONFIG_H

//==================================================
// PROJECT INFORMATION
//==================================================

#define PROJECT_NAME            "Smart Farming V2.0"

//==================================================
// ESP32 PIN CONFIGURATION
//==================================================

//--------------- DHT22 ----------------------------

#define DHT_PIN                 4
#define DHT_TYPE                DHT22

//--------------- Analog Sensors -------------------

#define LDR_PIN                 34

#define SOIL1_PIN               32
#define SOIL2_PIN               33

#define PUMP_LEVEL_PIN          26
#define HUMIDIFIER_LEVEL_PIN    27

//--------------- LCD ------------------------------

#define I2C_SDA                 22
#define I2C_SCL                 23

#define LCD_ADDRESS             0x27
#define LCD_COLUMNS             20
#define LCD_ROWS                4

//--------------- Relay Outputs --------------------
// Active LOW Relay Module

#define RELAY_FAN               5
#define RELAY_HUMIDIFIER        18
#define RELAY_LIGHT             19
#define RELAY_PUMP              15

//--------------- Buzzers --------------------------

#define ERROR_BUZZER            25
#define PUMP_BUZZER             13
#define HUMIDIFIER_BUZZER       14

//==================================================
// SCHEDULER
//==================================================

#define SENSOR_TASK_INTERVAL          500UL
#define AUTOMATION_TASK_INTERVAL      250UL
#define DISPLAY_TASK_INTERVAL        1000UL
#define DEBUG_TASK_INTERVAL          2000UL

// Future Modules

#define WIFI_TASK_INTERVAL            100UL
#define FIREBASE_TASK_INTERVAL        1000UL
#define OTA_TASK_INTERVAL             100UL
#define LOGGER_TASK_INTERVAL         5000UL
#define AI_TASK_INTERVAL          600000UL

//==================================================
// TEMPERATURE CONTROL
//==================================================

#define FAN_ON_TEMP       30.0f
#define FAN_OFF_TEMP      28.0f


//==================================================
// HUMIDITY CONTROL
//==================================================

#define HUMIDIFIER_ON     55.0f
#define HUMIDIFIER_OFF    70.0f




//==================================================
// SOIL MOISTURE (%)
//==================================================

#define SOIL_DRY_LEVEL            40
#define SOIL_WET_LEVEL            70

//==================================================
// GROW LIGHT CONTROL
//==================================================

// LDR Calibration
// Bright : ~600
// Dark   : ~4095

#define LIGHT_ON_LEVEL           3000
#define LIGHT_OFF_LEVEL          1500

//==================================================
// LIGHT TIMERS
//==================================================

// Testing Values

#define LIGHT_CONFIRM_TIME       5000UL
#define LIGHT_MIN_ON_TIME       10000UL
#define LIGHT_MIN_OFF_TIME       5000UL

/*

// Production Values

#define LIGHT_CONFIRM_TIME      30000UL
#define LIGHT_MIN_ON_TIME      300000UL
#define LIGHT_MIN_OFF_TIME      60000UL

*/

//==================================================
// PUMP CONTROLLER
//==================================================

// Testing Values

#define PUMP_CONFIRM_TIME      5000UL
#define PUMP_MIN_ON_TIME      10000UL
#define PUMP_MIN_OFF_TIME      5000UL

/*
// Production Values

#define PUMP_CONFIRM_TIME     30000UL
#define PUMP_MIN_ON_TIME     60000UL
#define PUMP_MIN_OFF_TIME    30000UL
*/


//==================================================
// FAN CONTROLLER
//==================================================

// Testing Values

#define FAN_CONFIRM_TIME      5000UL
#define FAN_MIN_ON_TIME      10000UL
#define FAN_MIN_OFF_TIME      5000UL

/*

// Production Values

#define FAN_CONFIRM_TIME     30000UL
#define FAN_MIN_ON_TIME     60000UL
#define FAN_MIN_OFF_TIME    30000UL

*/

//==================================================
// HUMIDIFIER CONTROLLER
//==================================================

// Testing

#define HUMIDIFIER_CONFIRM_TIME      5000UL
#define HUMIDIFIER_MIN_ON_TIME      10000UL
#define HUMIDIFIER_MIN_OFF_TIME      5000UL

/*

// Production

#define HUMIDIFIER_CONFIRM_TIME     30000UL
#define HUMIDIFIER_MIN_ON_TIME      60000UL
#define HUMIDIFIER_MIN_OFF_TIME     30000UL

*/

//==================================================
// WATER TANK
//==================================================

// Analog Threshold
// Change after calibration if required

#define TANK_LOW_LEVEL             20

//==================================================
// SENSOR UPDATE
//==================================================

#define DHT_READ_DELAY           2000UL

//==================================================
// SERIAL DEBUG
//==================================================

#define SERIAL_BAUDRATE        115200

//==================================================
// EEPROM (Future)
//==================================================

#define EEPROM_SIZE              512



//==================================================
// WIFI
//==================================================

// Replace with your WiFi


#define WIFI_TIMEOUT      15000UL
#define WIFI_RETRY_TIME    5000UL



//==================================================
// FIREBASE (Future)
//==================================================

#define FIREBASE_SYNC_TIME      1000UL

//==================================================
// OTA UPDATE (Future)
//==================================================

#define OTA_PORT                3232

//==================================================
// DISPLAY
//==================================================

#define LCD_PAGE_CHANGE_TIME   3000UL

//==================================================
// DEBUG
//==================================================

#define ENABLE_SERIAL_DEBUG      true
#define ENABLE_LCD_DEBUG         false

#endif