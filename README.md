# 🌱 AgroMind — Smart Farming AI Platform

> An ESP32-based Smart Farming and Greenhouse Automation System with IoT monitoring using Firebase Realtime Database, a browser-based dashboard, weather information, and AI-powered plant disease detection.
>
> 
## 🌐 Live Demo

👉 [Open AgroMind Web Application](https://agromind-2bd7f.web.app)


## 📌 Project Overview

AgroMind is a smart farming and greenhouse automation platform developed using ESP32, sensors, Firebase, web technologies, and AI.

The system monitors environmental conditions such as temperature, humidity, soil moisture, water level, and light intensity. It can automatically control devices such as a water pump, exhaust fan, grow light, and humidifier.

The platform also provides a web-based dashboard for monitoring and control, along with weather information and AI-based plant disease detection using MobileNetV2.


## ✨ Features

### 🌡️ Environmental Monitoring

The ESP32 monitors:

- Temperature
- Humidity
- Soil Moisture
- Water Tank Level
- Humidifier Tank Level
- Light Intensity

### ⚙️ Automatic Control

The system can automatically control:

- 💧 Water Pump
- 💨 Exhaust Fan
- 💡 Grow Light
- 🌫️ Humidifier

Control decisions are based on configured threshold values.

### 📡 IoT & Firebase

The system uses Wi-Fi and Firebase Realtime Database for:

- Live sensor data
- Device status
- Alarm information
- Remote manual control
- Crop selection
- Auto/Manual mode

### 📟 Local Display

The hardware uses:

- 20x4 I2C LCD
- SSD1306 OLED Display

The displays provide information such as sensor readings, device status, Wi-Fi status, Firebase status, and alarms.

### 🚨 Safety & Alarm Features

The system includes:

- Low Water Tank Alarm
- Low Humidifier Tank Alarm
- DHT Failure Detection
- Emergency Alarm
- Dedicated Buzzers
