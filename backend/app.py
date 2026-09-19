import json
import time
import datetime
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from database import DatabaseManager
from ai_engine import AIEngine
from simulator import VirtualESP32Simulator

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

db = DatabaseManager()
simulator = VirtualESP32Simulator(db)

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ONLINE",
        "timestamp": datetime.datetime.now().isoformat(),
        "database": "MongoDB" if db.use_mongo else "SQLite Fallback",
        "device_id": simulator.device_id,
        "esp32_connected": simulator.connected
    })

@app.route("/api/telemetry", methods=["GET", "POST"])
def telemetry():
    if request.method == "POST":
        data = request.get_json(force=True) or {}
        temp = float(data.get("temperature", simulator.current_temperature))
        vib = float(data.get("vibration", simulator.current_vibration))
        rpm = int(data.get("rpm", simulator.current_rpm))
        load = float(data.get("load", simulator.current_load))
        pressure = float(data.get("pressure", simulator.current_pressure))
        
        simulator.update_manual_parameters(temp=temp, vibration=vib, rpm=rpm, load=load, pressure=pressure)
        latest = simulator.get_latest_telemetry()
        return jsonify({"status": "SUCCESS", "telemetry": latest})

    latest = simulator.get_latest_telemetry()
    return jsonify(latest)

@app.route("/api/hardware/sensor-toggle", methods=["POST"])
def toggle_hardware_sensor():
    """Toggle physical sensor wiring connection state (Connect / Disconnect)."""
    data = request.get_json(force=True) or {}
    sensor_type = data.get("sensor", "temperature")
    connected = bool(data.get("connected", True))
    
    simulator.toggle_sensor(sensor_type, connected)
    latest = simulator.get_latest_telemetry()
    return jsonify({"status": "SUCCESS", "sensor": sensor_type, "connected": connected, "telemetry": latest})

@app.route("/api/scenario", methods=["POST"])
def change_scenario():
    data = request.get_json(force=True) or {}
    scenario = data.get("scenario", "NORMAL")
    simulator.set_scenario(scenario)
    latest = simulator.get_latest_telemetry()
    return jsonify({"status": "SUCCESS", "active_scenario": scenario, "telemetry": latest})

@app.route("/api/adaptive/apply", methods=["POST"])
def apply_adaptive_control():
    data = request.get_json(force=True) or {}
    target_rpm = int(data.get("target_rpm", 1200))
    simulator.apply_adaptive_rpm(target_rpm)
    latest = simulator.get_latest_telemetry()
    return jsonify({"status": "SUCCESS", "applied_rpm": target_rpm, "telemetry": latest})

@app.route("/api/manual", methods=["POST"])
def manual_injection():
    data = request.get_json(force=True) or {}
    temp = float(data["temperature"]) if "temperature" in data else None
    vib = float(data["vibration"]) if "vibration" in data else None
    rpm = int(data["rpm"]) if "rpm" in data else None
    load = float(data["load"]) if "load" in data else None
    pressure = float(data["pressure"]) if "pressure" in data else None

    simulator.update_manual_parameters(temp=temp, vibration=vib, rpm=rpm, load=load, pressure=pressure)
    latest = simulator.get_latest_telemetry()
    return jsonify({"status": "SUCCESS", "telemetry": latest})

@app.route("/api/predict", methods=["POST"])
def predict_production():
    data = request.get_json(force=True) or {}
    op_type = data.get("operation_type", "High-Speed Drilling")
    material = data.get("material", "Stainless Steel 316")
    duration = float(data.get("duration", 4.0))
    rpm = int(data.get("rpm", 1800))
    load = float(data.get("expected_load", 80.0))
    ambient = float(data.get("ambient_temp", 32.0))

    result = AIEngine.predict_production(op_type, material, duration, rpm, load, ambient)
    db.insert_prediction(result)
    return jsonify(result)

@app.route("/api/what-if", methods=["POST"])
def what_if_simulation():
    data = request.get_json(force=True) or {}
    temp = float(data.get("temperature", 75.0))
    vib = float(data.get("vibration", 3.0))
    rpm = int(data.get("rpm", 1500))
    load = float(data.get("load", 65.0))
    duration = float(data.get("duration", 2.0))

    res = AIEngine.what_if_simulation(temp, vib, rpm, load, duration)
    return jsonify(res)

@app.route("/api/history", methods=["GET"])
def history():
    limit = int(request.args.get("limit", 60))
    records = db.get_telemetry_history(limit=limit)
    return jsonify(records)

@app.route("/api/timeline", methods=["GET"])
def timeline():
    limit = int(request.args.get("limit", 50))
    events = db.get_timeline_events(limit=limit)
    return jsonify(events)

@app.route("/api/stream")
def sse_stream():
    def generate():
        while True:
            packet = simulator.get_latest_telemetry()
            yield f"data: {json.dumps(packet)}\n\n"
            time.sleep(1.5)

    return Response(generate(), mimetype="text/event-stream")

if __name__ == "__main__":
    print("=" * 60)
    print("  ADAPTIVE MANUFACTURING — Backend API Server")
    print("  Running on http://localhost:5000")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=False)
