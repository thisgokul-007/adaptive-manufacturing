import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const MachineContext = createContext(null);

export const MachineProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState({
    device_id: "ESP32-AM01",
    connected: true,
    packet_count: 1,
    temperature: 72.0,
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
    ai_insight: "Machine telemetry is stable at 72.0°C, 2.4 mm/s vibration, and 64.0% load. Spindle harmonics are within optimal tolerance.",
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

  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Demo Mode State
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const demoTimerRef = useRef(null);

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
        eventSource.close();
        startPolling();
      };
    } catch (e) {
      startPolling();
    }

    function startPolling() {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/telemetry');
          if (res.ok) {
            const data = await res.json();
            handleNewTelemetry(data);
          }
        } catch (err) {
          console.error("Polling error", err);
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
    setTelemetry(packet);
    setHistory((prev) => {
      const updated = [...prev, packet];
      return updated.slice(-60);
    });

    if (packet.condition === "CRITICAL" || packet.condition === "WARNING") {
      setNotifications((prev) => {
        if (prev.length > 0 && prev[0].condition === packet.condition) return prev;
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
    try {
      const res = await fetch('/api/history?limit=40');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setHistory(data);
      }
    } catch (err) {
      console.error("History fetch error", err);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await fetch('/api/timeline?limit=30');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      }
    } catch (err) {
      console.error("Timeline fetch error", err);
    }
  };

  const setScenario = async (scenarioName) => {
    try {
      const res = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioName })
      });
      if (res.ok) {
        const data = await res.json();
        handleNewTelemetry(data.telemetry);
        fetchTimeline();
      }
    } catch (err) {
      console.error("Set scenario error", err);
    }
  };

  const applyAdaptiveControl = async (targetRpm) => {
    try {
      const res = await fetch('/api/adaptive/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_rpm: targetRpm })
      });
      if (res.ok) {
        const data = await res.json();
        handleNewTelemetry(data.telemetry);
        fetchTimeline();
      }
    } catch (err) {
      console.error("Apply adaptive control error", err);
    }
  };

  const toggleSensorConnection = async (sensorType, connectedState) => {
    try {
      const res = await fetch('/api/hardware/sensor-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensor: sensorType, connected: connectedState })
      });
      if (res.ok) {
        const data = await res.json();
        handleNewTelemetry(data.telemetry);
        fetchTimeline();
      }
    } catch (err) {
      console.error("Sensor toggle error", err);
    }
  };

  const injectManualParameters = async (params) => {
    try {
      const res = await fetch('/api/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        handleNewTelemetry(data.telemetry);
      }
    } catch (err) {
      console.error("Manual param injection error", err);
    }
  };

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
  };

  const stopDemoMode = () => {
    setDemoActive(false);
    setDemoPlaying(false);
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setScenario("NORMAL");
  };

  const togglePauseDemo = () => {
    setDemoPlaying(!demoPlaying);
  };

  const executeDemoStep = (stepNum) => {
    if (stepNum > 10) {
      setDemoPlaying(false);
      return;
    }
    setDemoStep(stepNum);
    const stepConfig = demoSteps.find(s => s.step === stepNum);
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
