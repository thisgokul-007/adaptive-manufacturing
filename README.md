# ADAPTIVE MANUFACTURING — AI-Based Smart Production & Monitoring

> **Hackathon-Ready Industrial Cyber-Physical Prototype**  
> AI-powered real-time CNC spindle monitoring, Virtual ESP32 sensor lab, pre-production failure forecasting, and autonomous closed-loop adaptive speed control.

---

## 🌟 Key Features

1. **Dark Industrial Mission-Control UI**: Tesla / Siemens inspired Industry 4.0 SaaS interface with large typography, vibrant status colors, and glowing metrics.
2. **2D Digital Twin Visualizer**: Custom SVG/Canvas diagram of CNC Spindle Assembly `AM-01` with spindle rotational animation synchronized to actual RPM and dynamic glowing sensor probes.
3. **Virtual ESP32 Sensor Lab**: Simulated ESP32 microcontroller publishing 115200 bps telemetry over HTTP REST & Server-Sent Events (SSE). Includes preset scenario triggers (`NORMAL`, `HIGH_LOAD`, `OVERHEATING`, `HIGH_VIBRATION`, `CRITICAL`) and manual parameter injection sliders.
4. **AI Diagnostic Engine**: Multi-threshold classification (`NORMAL`, `WARNING`, `CRITICAL`), natural language insight synthesis, and automated failure vector identification.
5. **Autonomous Closed-Loop Speed Control**: Real-time speed attenuation engine. Applying recommended RPM updates drive targets and simulates thermal cooldown physics (`93.5°C → 84°C → 78°C → 72°C`).
6. **"Predict Before Production"**: Pre-job failure risk calculator (circular SVG probability gauge) evaluating operation type, material hardness, duration, RPM, load, and ambient temperature.
7. **What-If Simulation Matrix**: Interactive side-by-side scenario comparison calculating risk probability reduction % delta (`74% → 28%`).
8. **Automated 10-Step Demo Mode**: 90-second hero presentation script walking judges through the entire closed-loop adaptation cycle automatically.
9. **Dual MongoDB / SQLite Storage**: Automatic connection to local MongoDB (`mongodb://localhost:27017/adaptive_manufacturing`) with seamless fallback to SQLite3 for 100% out-of-the-box zero-config execution.

---

## 🏗 System Architecture

```
                       ┌─────────────────────────┐
                       │   Virtual ESP32 Lab     │
                       │  (Sensor Telemetry Bus) │
                       └────────────┬────────────┘
                                    │ HTTP POST / SSE
                                    ▼
                       ┌─────────────────────────┐
                       │   Python Flask Server   │
                       │     (Port 5000)         │
                       └─────┬─────────────┬─────┘
                             │             │
              ┌──────────────┴─┐         ┌─┴───────────────┐
              │  AI Diagnostic │         │  Dual Storage   │
              │     Engine     │         │ (MongoDB/SQLite)│
              └──────────────┬─┘         └─────────────────┘
                             │
                             ▼
                       ┌─────────────────────────┐
                       │   React + Vite UI       │
                       │     (Port 5173)         │
                       └─────────────────────────┘
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/telemetry` | Fetch current sensor telemetry packet and AI condition assessment |
| `POST` | `/api/telemetry` | Hardware endpoint for ingesting real/virtual ESP32 JSON payload |
| `POST` | `/api/scenario` | Trigger preset scenario (`NORMAL`, `HIGH_LOAD`, `OVERHEATING`, `HIGH_VIBRATION`, `CRITICAL`) |
| `POST` | `/api/adaptive/apply` | Apply recommended RPM to machine drive (Closed-Loop feedback) |
| `POST` | `/api/manual` | Inject manual slider parameters into Virtual ESP32 telemetry bus |
| `POST` | `/api/predict` | Calculate pre-production job failure risk probability & issues |
| `POST` | `/api/what-if` | Calculate What-If scenario risk score for custom parameter sliders |
| `GET` | `/api/history` | Retrieve stored telemetry logs (supports `?limit=50`) |
| `GET` | `/api/timeline` | Fetch chronological incident audit log |
| `GET` | `/api/stream` | Server-Sent Events (SSE) live data stream |

---

## 🧠 AI Condition Classification Rules

- **NORMAL**: Temperature < 75.0°C **AND** Vibration < 3.5 mm/s **AND** Load < 75.0%
- **WARNING**: Temperature 75.0°C – 90.0°C **OR** Vibration 3.5 – 6.0 mm/s **OR** Load 75.0% – 90.0%
- **CRITICAL**: Temperature > 90.0°C **OR** Vibration > 6.0 mm/s **OR** Load > 90.0%

---

## ⚡ How to Run

### 1. One-Click Launcher Script (Recommended)
Run the automated script to launch both Backend API and Frontend concurrently:
```bash
python start_all.py
```
Open **http://localhost:5173** in your web browser.

### 2. Manual Startup

**Backend**:
```bash
cd backend
python app.py
```

**Frontend**:
```bash
cd frontend
npm run dev
```

---

## 🔌 Replacing Virtual ESP32 with Real Hardware

To replace the Virtual ESP32 simulator with a physical ESP32 microcontroller, flash the following C++ code using the Arduino IDE:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_COMPUTER_IP:5000/api/telemetry";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nESP32 Connected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["temperature"] = analogRead(34) * 0.025; // NTC Sensor Pin 34
    doc["vibration"] = analogRead(35) * 0.002;   // Accelerometer Pin 35
    doc["rpm"] = 1500;
    doc["load"] = 65.0;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    Serial.printf("HTTP Response: %d\n", httpResponseCode);
    http.end();
  }
  delay(1500);
}
```
