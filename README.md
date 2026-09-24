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


## 🤖 AI Plant Disease Detection

AgroMind includes a browser-based plant disease detection system powered by **MobileNetV2**.

Users can upload a plant leaf image and run AI-based disease analysis directly through the web application.

### 🧠 AI Pipeline

```text
Leaf Image
     │
     ▼
Image Pre-processing
     │
     ▼
MobileNetV2
     │
     ▼
Disease Classification
     │
     ▼

```
### AI Model Details

| Parameter | Details |
|---|---|
| Architecture | MobileNetV2 |
| Input | 160 × 160 RGB Image |
| Classes | 39 PlantVillage Crop Disease Classes |
| Runtime | TensorFlow.js |
| Inference | Browser-based |
| Model | AgroMind.keras |


## 🔧 Hardware Used

| Component | Quantity |
|---|---:|
| ESP32 DevKit V1 | 1 |
| DHT22 Sensor | 1 |
| Capacitive Soil Moisture Sensor | 2 |
| HW-038 Water Level Sensor | 2 |
| LDR Module | 1 |
| 4-Channel Relay Module | 1 |
| 20x4 I2C LCD | 1 |
| SSD1306 OLED Display | 1 |
| Buzzers | 3 |
| Water Pump | 1 |
| Humidifier | 1 |
| DC Fan | 1 |
| LED Grow Light | 1 |

Prediction + Confidence



## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      Firebase       │
                         │  Realtime Database  │
                         └──────────▲──────────┘
                                    │
                                    │ Wi-Fi
                                    │
                         ┌──────────┴──────────┐
                         │        ESP32        │
                         │   Main Controller   │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
             Sensors            Automation          Displays
                │                   │                   │
        ┌───────┼───────┐           │             ┌─────┴─────┐
        │       │       │           │             │           │
      DHT22   Soil     LDR        Relay          LCD        OLED
              Moisture            Module
                                    │
                         ┌──────────┼──────────┐
                         │          │          │
                       Pump        Fan       Light
                                    │
                                Humidifier
```
🔄 Data Flow
Sensors
   ↓
ESP32
   ↓
Wi-Fi
   ↓
Firebase Realtime Database
   ↓
AgroMind Web Dashboard
   ↓
Monitoring / Control


## 🔄 Working Principle

### 1. ESP32 Initialization

The ESP32 initializes the connected sensors, displays, Wi-Fi communication, and control system.

### 2. Sensor Data Collection

The system reads:

- Temperature
- Humidity
- Soil Moisture
- Water Tank Level
- Humidifier Tank Level
- Light Intensity

### 3. Local Monitoring

Sensor readings and system information are displayed on the connected LCD and OLED displays.

### 4. Automation

The automation controller compares sensor readings with configured threshold values.

### 5. Device Control

The relay module controls:

- Water Pump
- Exhaust Fan
- Grow Light
- Humidifier

### 6. Firebase Communication

The ESP32 communicates with Firebase through Wi-Fi and uploads sensor information, device status, alarm information, and configuration data.

### 7. Remote Monitoring

The user can monitor and control the system through the AgroMind web dashboard.



## 🗄️ Firebase Database Structure

AgroMind organizes sensor data, device states, alerts, and system configuration in Firebase Realtime Database.

```text
/
├── sensors
│   ├── temperature
│   ├── humidity
│   ├── soil_moisture
│   ├── water_level
│   └── light
│
├── devices
│   ├── pump
│   ├── fan
│   ├── light
│   └── humidifier
│
├── alerts
│   ├── low_water
│   ├── dht_failure
│   └── emergency
│
└── config
    ├── auto_mode
    └── selected_crop

```
## 💻 Software & Technologies

### 🔌 Embedded / IoT

- C/C++
- Arduino IDE
- ESP32
- Wi-Fi
- Firebase ESP Client Library
- DHT Library
- LiquidCrystal I2C
- Preferences Library

### 🌐 Web

- HTML
- CSS
- JavaScript
- Chart.js
- Firebase

### 🤖 AI / Machine Learning

- Python
- TensorFlow
- TensorFlow.js
- Keras
- MobileNetV2


## 📁 Project Structure

```text
AGROMIND-SMART-FARMING-/
│
├── Smart_Farming_V2_.ino
├── agromind_logo/
├── public/
│
├── .firebase
├── .gitignore
├── firebase.json
│
├── convert_model.js
├── convert_model.py
├── fix_convert.py
│
├── package.json
├── package-lock.json
│
└── README.md

```
📂 Main Components
| File / Folder           | Purpose                              |
| ----------------------- | ------------------------------------ |
| `Smart_Farming_V2_.ino` | ESP32 smart farming firmware         |
| `public/`               | Web application files                |
| `agromind_logo/`        | AgroMind project assets              |
| `convert_model.py`      | AI model conversion workflow         |
| `convert_model.js`      | JavaScript model-related utility     |
| `fix_convert.py`        | Model conversion support script      |
| `firebase.json`         | Firebase project configuration       |
| `package.json`          | Web project dependencies and scripts |
| `README.md`             | Project documentation                |


## 🚀 Web Application Setup

### 1. Install Dependencies

```bash
npm install

```
### 2.Convert the AI Model
Install the required Python packages:

```bash
pip install tensorflowjs tensorflow

```
Run the model conversion script:
```bash
python convert_model.py

```
### 3.Start the Application

```bash
npm start
```
The application can also be opened using VS Code Live Server.

### 4.Use the Application
   
1.Open the AgroMind web application.

2.Sign in to the dashboard.

3.Open Disease Detection.

4.Upload a plant leaf image.

5.Run the disease analysis.

6.View the AI prediction and confidence result.


## 🔮 Future Improvements

Potential future improvements include:

- AI-based Crop Recommendation
- OTA Firmware Updates
- Dedicated Mobile Application
- Solar Power System
- Voice Assistant Support
- MQTT Communication
- Advanced Agricultural Data Analytics


## 👨‍💻 Developer

**Rupam Ghosh**

Electronics & Communication Engineering Graduate  
Embedded Systems | IoT | Robotics | Smart Agriculture

### 🔗 Connect

- GitHub: [Rupam4604](https://github.com/Rupam4604)
- LinkedIn: [Rupam Ghosh](https://www.linkedin.com/in/rupam-ghosh-0406047119326s)
