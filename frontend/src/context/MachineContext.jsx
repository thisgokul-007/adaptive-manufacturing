import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchApi } from '../utils/api';

const MachineContext = createContext(null);

const DEFAULT_EVENTS = [
  { timestamp: "11:28:01", event_type: "SYSTEM_INIT", message: "Adaptive Manufacturing AI Engine & Virtual ESP32 initialized", severity: "INFO" },
  { timestamp: "11:28:15", event_type: "TELEMETRY_BUS", message: "Hardware telemetry stream active at 115200 bps on GPIO 34, 35, 18, 32", severity: "INFO" },
  { timestamp: "11:28:30", event_type: "CONDITION_STABLE", message: "CNC Spindle AM-01 operating within nominal parameters (1500 RPM, 72°C)", severity: "INFO" },
  { timestamp: "11:29:05", event_type: "AI_DIAGNOSTIC", message: "Thermal stability 92%, vibration harmonics stable at 2.4 mm/s", severity: "INFO" }
];

const generateInitialHistory = () => {
  const points = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3000);
    const timeStr = t.toLocaleTimeString();
    points.push({
      timestamp: timeStr,
      temperature: 71.5 + Math.random() * 2.0,
      vibration: 2.3 + Math.random() * 0.3,
      rpm: 1500 + Math.floor(Math.random() * 10 - 5),
      load: 63.5 + Math.random() * 2.0,
      pressure: 5.5,
      condition: "NORMAL",
      active_scenario: "NORMAL"
    });
  }
  return points;
};

export const MachineProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState({
    device_id: "ESP32-AM01",
    connected: true,
    packet_count: 128,
    temperature: 72.1,
    vibration: 2.4,
    rpm: 1500,
    load: 64.0,
    pressure: 5.5,
    temp_connected: true,
    vib_connected: true,
    rpm_connected: true,
    load_connected: true,
    pressure_connected: true,
    machineStatus: "RUNNING",
    active_scenario: "NORMAL",
    condition: "NORMAL",
    reason: "All telemetry metrics operating within nominal baseline parameters.",
    ai_insight: "Machine telemetry is stable at 72.1°C, 2.4 mm/s vibration, and 64.0% load. Spindle harmonics are within optimal tolerance limits.",
    recommendation: "Maintain current speed at 1500 RPM. System operating at peak efficiency.",
    recommended_rpm: 1500,
    adjustment_pct: 0.0,
    expected_outcome: "Standard production yield with zero micro-fracture or thermal defect risk.",
    machine_health: 87.0,
    failure_risk: 13.0,
    temp_stability: 92.0,
    vib_stability: 84.0,
    load_stability: 79.0,
    timestamp: new Date().toLocaleTimeString()
  });

  const [history, setHistory] = useState(generateInitialHistory());
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Demo Mode State
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const demoTimerRef = useRef(null);

  const showToast = (msg, type = "info") => {
    setToastMessage({ message: msg, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let eventSource = null;
    let pollInterval = null;

    try {
      eventSource = new EventSource('/api/stream');
      eventSource.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          handleNewTelemetry(packet);
        } catch (e) {
          console.error("SSE parse error", e);
        }
      };

      eventSource.onerror = () => {
        if (eventSource) eventSource.close();
        startPolling();
      };
    } catch (e) {
      startPolling();
    }

    function startPolling() {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        const data = await fetchApi('/api/telemetry');
        if (data) {
          handleNewTelemetry(data);
        }
      }, 1500);
    }

    fetchHistory();
    fetchTimeline();

    return () => {
      if (eventSource) eventSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const handleNewTelemetry = (packet) => {
    if (!packet) return;
    setTelemetry(packet);
    setHistory((prev) => {
      const updated = [...prev, packet];
      return updated.slice(-60);
    });

    if (packet.condition === "CRITICAL" || packet.condition === "WARNING") {
      setNotifications((prev) => {
        if (prev.length > 0 && prev[0].message === packet.reason) return prev;
        const newAlert = {
          id: Date.now(),
          condition: packet.condition,
          message: packet.reason,
          timestamp: packet.timestamp
        };
        return [newAlert, ...prev.slice(0, 9)];
      });
    }
  };

  const fetchHistory = async () => {
    const data = await fetchApi('/api/history?limit=60');
    if (Array.isArray(data) && data.length > 0) {
      setHistory(data);
    }
  };

  const fetchTimeline = async () => {
    const data = await fetchApi('/api/timeline?limit=50');
    if (Array.isArray(data) && data.length > 0) {
      setEvents(data);
    }
  };

  // API Actions
  const setScenario = async (scenarioName) => {
    showToast(`Setting scenario: [${scenarioName}]...`, "info");
    const data = await fetchApi('/api/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: scenarioName })
    });
    if (data && data.telemetry) {
      handleNewTelemetry(data.telemetry);
      fetchTimeline();
      showToast(`Triggered scenario: [${scenarioName}]`, "success");
    } else {
      // Offline fallback state update
      setTelemetry((prev) => ({
        ...prev,
        active_scenario: scenarioName,
        temperature: scenarioName === "OVERHEATING" ? 93.5 : scenarioName === "CRITICAL" ? 95.2 : 72.0,
        condition: scenarioName === "OVERHEATING" || scenarioName === "CRITICAL" ? "CRITICAL" : "NORMAL"
      }));
      showToast(`Triggered scenario: [${scenarioName}]`, "success");
    }
  };

  const applyAdaptiveControl = async (targetRpm) => {
    const rpmNum = parseInt(targetRpm) || 1200;
    showToast(`Applying closed-loop speed adjustment (${rpmNum} RPM)...`, "info");
    const data = await fetchApi('/api/adaptive/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_rpm: rpmNum })
    });
    if (data && data.telemetry) {
      handleNewTelemetry(data.telemetry);
      fetchTimeline();
      showToast(`Closed-loop speed adjusted to ${rpmNum} RPM!`, "success");
    } else {
      // Offline fallback update
      setTelemetry((prev) => ({
        ...prev,
        rpm: rpmNum,
        temperature: 73.0,
        condition: "NORMAL"
      }));
      showToast(`Closed-loop speed adjusted to ${rpmNum} RPM!`, "success");
    }
  };

  const toggleSensorConnection = async (sensorType, connectedState) => {
    const data = await fetchApi('/api/hardware/sensor-toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensor: sensorType, connected: connectedState })
    });
    if (data && data.telemetry) {
      handleNewTelemetry(data.telemetry);
      fetchTimeline();
      showToast(`${sensorType.toUpperCase()} sensor ${connectedState ? 'reconnected' : 'unplugged'}!`, connectedState ? "success" : "warning");
    }
  };

  const injectManualParameters = async (params) => {
    const data = await fetchApi('/api/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (data && data.telemetry) {
      handleNewTelemetry(data.telemetry);
      showToast("Injected custom telemetry parameters!", "info");
    } else {
      // Fallback local update
      setTelemetry((prev) => ({
        ...prev,
        ...params
      }));
      showToast("Injected custom telemetry parameters!", "info");
    }
  };

  // Demo Mode Script Execution
  const demoSteps = [
    { step: 1, title: "Normal Operation", desc: "Machine running at nominal baseline (1500 RPM, 72°C)", action: () => setScenario("NORMAL") },
    { step: 2, title: "Load Surge", desc: "Heavy milling operation initiates (Load increases to 88%)", action: () => setScenario("HIGH_LOAD") },
    { step: 3, title: "Thermal & Vibration Spike", desc: "Temperature surges past 90°C & vibration exceeds 5.0 mm/s", action: () => setScenario("OVERHEATING") },
    { step: 4, title: "AI Diagnostic Analysis", desc: "AI Engine detects CRITICAL state & calculates optimal RPM reduction", action: () => setScenario("CRITICAL") },
    { step: 5, title: "AI Insight & Recommendation", desc: "AI recommends speed reduction from 1500 RPM → 1100 RPM", action: () => {} },
    { step: 6, title: "Closed-Loop Speed Adaptation", desc: "Executing closed-loop speed adjustment (-27% RPM reduction)", action: () => applyAdaptiveControl(1100) },
    { step: 7, title: "Thermal Dissipation Cycle", desc: "Lower spindle friction dissipates heat and dampens harmonics", action: () => {} },
    { step: 8, title: "Condition Recovery to Warning", desc: "Temperature drops below 80°C threshold into WARNING zone", action: () => {} },
    { step: 9, title: "Full Stabilization", desc: "Machine telemetry fully stabilizes back to NORMAL baseline", action: () => setScenario("NORMAL") },
    { step: 10, title: "Demo Completed", desc: "End-to-end closed-loop AI adaptation cycle completed successfully", action: () => {} }
  ];

  const startDemoMode = () => {
    setDemoActive(true);
    setDemoStep(1);
    setDemoPlaying(true);
    executeDemoStep(1);
    showToast("Automated 10-Step Demo Mode Started!", "info");
  };

  const stopDemoMode = () => {
    setDemoActive(false);
    setDemoPlaying(false);
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setScenario("NORMAL");
    showToast("Exited Demo Mode", "info");
  };

  const togglePauseDemo = () => {
    setDemoPlaying((prev) => !prev);
  };

  const executeDemoStep = (stepNum) => {
    const validStep = Math.max(1, Math.min(10, stepNum));
    setDemoStep(validStep);
    const stepConfig = demoSteps.find(s => s.step === validStep);
    if (stepConfig && stepConfig.action) {
      stepConfig.action();
    }
  };

  useEffect(() => {
    if (demoActive && demoPlaying) {
      demoTimerRef.current = setTimeout(() => {
        if (demoStep < 10) {
          executeDemoStep(demoStep + 1);
        } else {
          setDemoPlaying(false);
        }
      }, 7000);
    }
    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    };
  }, [demoActive, demoPlaying, demoStep]);

  return (
    <MachineContext.Provider
      value={{
        telemetry,
        history,
        events,
        notifications,
        toastMessage,
        setScenario,
        applyAdaptiveControl,
        toggleSensorConnection,
        injectManualParameters,
        fetchTimeline,
        demoActive,
        demoStep,
        demoPlaying,
        demoSteps,
        startDemoMode,
        stopDemoMode,
        togglePauseDemo,
        executeDemoStep
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachine = () => useContext(MachineContext);
