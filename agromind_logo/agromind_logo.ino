#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "logo.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup()
{
  Serial.begin(115200);

  // ESP32 I2C Pins
  Wire.begin(22, 23);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  {
    Serial.println("SSD1306 allocation failed");
    while (1);
  }

  display.clearDisplay();

  // Draw the bitmap
  display.drawBitmap(
      0,                  // X Position
      0,                  // Y Position
      logoBitmap,         // Bitmap Array
      128,                // Width
      64,                 // Height
      SSD1306_WHITE);

  display.display();

  Serial.println("Logo Displayed");
}

void loop()
{
  // Nothing to do
}