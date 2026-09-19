import time
import random
import datetime
import threading
from typing import Dict, Any, List, Callable
from ai_engine import AIEngine

class VirtualESP32Simulator:
    """
    Virtual ESP32 Sensor Lab Simulator with Interactive Hardware Workbench support.
    Simulates physical sensor telemetry from an industrial CNC machine (AM-01),
    allows individual sensor wire connect/disconnect toggles, coolant pressure dynamics,
    and publishes live telemetry streams.
    """
    def __init__(self, db_manager):
        self.db = db_manager
        self.device_id = "ESP32-AM01"
        self.connected = True
        self.packet_count = 0
        self.active_scenario = "NORMAL"
        
        # Sensor Wire Connection States (Physical Breadboard Toggles)
        self.temp_sensor_connected = True
        self.vib_sensor_connected = True
        self.rpm_sensor_connected = True
        self.load_sensor_connected = True
        self.pressure_sensor_connected = True

        # Physical State
        self.target_temperature = 72.0
        self.current_temperature = 72.0
        
        self.target_vibration = 2.4
        self.current_vibration = 2.4
        
        self.target_rpm = 1500
        self.current_rpm = 1500
        
        self.target_load = 64.0
        self.current_load = 64.0
        
        self.target_pressure = 5.5 # Bar (Hydraulic Coolant Pressure)
        self.current_pressure = 5.5
        
        self.machine_status = "RUNNING"
        self.auto_simulation = True
        
        self.listeners: List[Callable[[Dict[str, Any]], None]] = []
        self.lock = threading.Lock()
        
        # Start background simulator thread
        self.thread = threading.Thread(target=self._run_loop, daemon=True)
        self.thread.start()

    def toggle_sensor(self, sensor_type: str, connected: bool):
        """Toggle physical sensor wiring connection."""
        with self.lock:
            if sensor_type == "temperature":
                self.temp_sensor_connected = connected
            elif sensor_type == "vibration":
                self.vib_sensor_connected = connected
            elif sensor_type == "rpm":
                self.rpm_sensor_connected = connected
            elif sensor_type == "load":
                self.load_sensor_connected = connected
            elif sensor_type == "pressure":
                self.pressure_sensor_connected = connected

            status_str = "CONNECTED" if connected else "DISCONNECTED (SIGNAL LOST)"
            self.db.insert_timeline_event({
                "timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
                "event_type": "HARDWARE_FAULT" if not connected else "HARDWARE_INFO",
                "message": f"Hardware Workbench: {sensor_type.upper()} sensor wire {status_str}",
                "severity": "WARNING" if not connected else "INFO",
                "details": {"sensor": sensor_type, "connected": connected}
            })

    def set_scenario(self, scenario_name: str):
        """Set preset operational scenario."""
        with self.lock:
            self.active_scenario = scenario_name.upper()
            if self.active_scenario == "NORMAL":
                self.target_temperature = 72.0
                self.target_vibration = 2.4
                self.target_rpm = 1500
                self.target_load = 64.0
                self.target_pressure = 5.5
            elif self.active_scenario == "HIGH_LOAD":
                self.target_temperature = 79.5
                self.target_vibration = 4.2
                self.target_rpm = 1650
                self.target_load = 88.0
                self.target_pressure = 4.8
            elif self.active_scenario == "OVERHEATING":
                self.target_temperature = 93.5
                self.target_vibration = 5.2
                self.target_rpm = 1550
                self.target_load = 84.0
                self.target_pressure = 2.1 # Low coolant pressure
            elif self.active_scenario == "HIGH_VIBRATION":
                self.target_temperature = 81.0
                self.target_vibration = 6.8
                self.target_rpm = 1750
                self.target_load = 78.0
                self.target_pressure = 5.0
            elif self.active_scenario == "CRITICAL":
                self.target_temperature = 95.2
                self.target_vibration = 7.4
                self.target_rpm = 1800
                self.target_load = 94.0
                self.target_pressure = 1.2

            self.db.insert_timeline_event({
                "timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
                "event_type": "SCENARIO_CHANGE",
                "message": f"Virtual ESP32 set to scenario [{self.active_scenario}]",
                "severity": "WARNING" if self.active_scenario in ["OVERHEATING", "HIGH_VIBRATION", "CRITICAL"] else "INFO",
                "details": {"scenario": self.active_scenario}
            })

    def apply_adaptive_rpm(self, new_rpm: int):
        """Closed-loop speed adaptation."""
        with self.lock:
            old_rpm = self.current_rpm
            self.target_rpm = new_rpm
            self.current_rpm = new_rpm
            
            rpm_ratio = new_rpm / 1500.0
            self.target_temperature = max(68.0, 72.0 * (rpm_ratio ** 1.2))
            self.target_vibration = max(1.8, 2.4 * (rpm_ratio ** 1.3))
            self.target_load = max(45.0, 64.0 * rpm_ratio)
            self.target_pressure = 5.5
            self.active_scenario = "ADAPTED"

            self.db.insert_timeline_event({
                "timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
                "event_type": "ADAPTIVE_CONTROL",
                "message": f"Closed-loop control applied: Speed adjusted {old_rpm} RPM → {new_rpm} RPM",
                "severity": "AI_ACTION",
                "details": {"old_rpm": old_rpm, "new_rpm": new_rpm}
            })

    def update_manual_parameters(self, temp: float = None, vibration: float = None, rpm: int = None, load: float = None, pressure: float = None):
        """Manual parameter injection from Hardware Workbench sliders."""
        with self.lock:
            if temp is not None:
                self.target_temperature = temp
                self.current_temperature = temp
            if vibration is not None:
                self.target_vibration = vibration
                self.current_vibration = vibration
            if rpm is not None:
                self.target_rpm = rpm
                self.current_rpm = rpm
            if load is not None:
                self.target_load = load
                self.current_load = load
            if pressure is not None:
                self.target_pressure = pressure
                self.current_pressure = pressure
                # Low coolant pressure causes thermal buildup rate to double
                if pressure < 3.0:
                    self.target_temperature = max(self.target_temperature, 92.0)

            self.active_scenario = "CUSTOM"

    def _physics_step(self):
        """Physics step convergence loop."""
        with self.lock:
            if not self.connected:
                return

            # Thermal convergence
            temp_diff = self.target_temperature - self.current_temperature
            self.current_temperature += temp_diff * 0.20 + random.uniform(-0.15, 0.15)
            self.current_temperature = max(20.0, min(120.0, round(self.current_temperature, 1)))

            # Vibration convergence
            vib_diff = self.target_vibration - self.current_vibration
            self.current_vibration += vib_diff * 0.25 + random.uniform(-0.08, 0.08)
            self.current_vibration = max(0.2, min(15.0, round(self.current_vibration, 2)))

            # Load convergence
            load_diff = self.target_load - self.current_load
            self.current_load += load_diff * 0.20 + random.uniform(-0.3, 0.3)
            self.current_load = max(0.0, min(100.0, round(self.current_load, 1)))

            # Pressure convergence
            pres_diff = self.target_pressure - self.current_pressure
            self.current_pressure += pres_diff * 0.25 + random.uniform(-0.05, 0.05)
            self.current_pressure = max(0.0, min(10.0, round(self.current_pressure, 2)))

            self.current_rpm = max(0, int(self.target_rpm + random.randint(-5, 5)))
            self.packet_count += 1
            now_str = datetime.datetime.now().strftime("%H:%M:%S")

            # Determine sensor readings based on wiring connection state
            reported_temp = self.current_temperature if self.temp_sensor_connected else 0.0
            reported_vib = self.current_vibration if self.vib_sensor_connected else 0.0
            reported_rpm = self.current_rpm if self.rpm_sensor_connected else 0
            reported_load = self.current_load if self.load_sensor_connected else 0.0
            reported_pressure = self.current_pressure if self.pressure_sensor_connected else 0.0

            # AI Engine evaluation
            cond_data = AIEngine.classify_condition(reported_temp, reported_vib, reported_load, reported_rpm)
            
            # Check for wire fault warning
            wire_faults = []
            if not self.temp_sensor_connected: wire_faults.append("TEMP SENSOR DISCONNECTED")
            if not self.vib_sensor_connected: wire_faults.append("VIBRATION SENSOR DISCONNECTED")
            if not self.rpm_sensor_connected: wire_faults.append("RPM ENCODER DISCONNECTED")
            if not self.load_sensor_connected: wire_faults.append("LOAD SENSOR DISCONNECTED")
            if not self.pressure_sensor_connected: wire_faults.append("PRESSURE TRANSDUCER DISCONNECTED")

            if wire_faults:
                cond_data["condition"] = "WARNING" if cond_data["condition"] == "NORMAL" else cond_data["condition"]
                cond_data["reason"] = f"Hardware Sensor Fault: {', '.join(wire_faults)}"

            insight_data = AIEngine.generate_ai_insight(reported_temp, reported_vib, reported_load, reported_rpm, cond_data)
            health_data = AIEngine.calculate_health_and_risk(reported_temp, reported_vib, reported_load)

            telemetry_packet = {
                "device_id": self.device_id,
                "connected": self.connected,
                "packet_count": self.packet_count,
                "temperature": reported_temp,
                "vibration": reported_vib,
                "rpm": reported_rpm,
                "load": reported_load,
                "pressure": reported_pressure,
                "temp_connected": self.temp_sensor_connected,
                "vib_connected": self.vib_sensor_connected,
                "rpm_connected": self.rpm_sensor_connected,
                "load_connected": self.load_sensor_connected,
                "pressure_connected": self.pressure_sensor_connected,
                "machineStatus": self.machine_status,
                "active_scenario": self.active_scenario,
                "condition": cond_data["condition"],
                "reason": cond_data["reason"],
                "ai_insight": insight_data["insight"],
                "recommendation": insight_data["recommendation"],
                "recommended_rpm": insight_data["recommended_rpm"],
                "adjustment_pct": insight_data["adjustment_pct"],
                "expected_outcome": insight_data["expected_outcome"],
                "machine_health": health_data["machine_health"],
                "failure_risk": health_data["failure_risk"],
                "temp_stability": health_data["temp_stability"],
                "vib_stability": health_data["vib_stability"],
                "load_stability": health_data["load_stability"],
                "timestamp": now_str
            }

            self.db.insert_telemetry(telemetry_packet)
            return telemetry_packet

    def get_latest_telemetry(self) -> Dict[str, Any]:
        return self._physics_step()

    def _run_loop(self):
        while True:
            try:
                if self.auto_simulation:
                    self._physics_step()
            except Exception as e:
                pass
            time.sleep(1.5)
