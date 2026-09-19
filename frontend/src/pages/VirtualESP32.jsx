import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { Cpu, Wifi, Radio, Zap, Sliders, CheckCircle2, AlertTriangle, AlertOctagon, Terminal } from 'lucide-react';

export const VirtualESP32 = () => {
  const { telemetry, setScenario, injectManualParameters } = useMachine();
  const [manualTemp, setManualTemp] = useState(telemetry.temperature);
  const [manualVib, setManualVib] = useState(telemetry.vibration);
  const [manualRpm, setManualRpm] = useState(telemetry.rpm);
  const [manualLoad, setManualLoad] = useState(telemetry.load);

  const handleApplyManual = () => {
    injectManualParameters({
      temperature: parseFloat(manualTemp),
      vibration: parseFloat(manualVib),
      rpm: parseInt(manualRpm),
      load: parseFloat(manualLoad)
    });
  };

  const scenarioList = [
    { id: 'NORMAL', label: 'NORMAL OPERATION', desc: '72°C | 2.4 mm/s | 1500 RPM | 64% Load', color: 'border-statusGreen text-statusGreen hover:bg-statusGreen/10' },
    { id: 'HIGH_LOAD', label: 'HIGH LOAD', desc: '79°C | 4.2 mm/s | 1650 RPM | 88% Load', color: 'border-statusAmber text-statusAmber hover:bg-statusAmber/10' },
    { id: 'OVERHEATING', label: 'OVERHEATING', desc: '93.5°C | 5.2 mm/s | 1550 RPM | 84% Load', color: 'border-statusRed text-statusRed hover:bg-statusRed/10' },
    { id: 'HIGH_VIBRATION', label: 'HIGH VIBRATION', desc: '81°C | 6.8 mm/s | 1750 RPM | 78% Load', color: 'border-statusAmber text-statusAmber hover:bg-statusAmber/10' },
    { id: 'CRITICAL', label: 'CRITICAL FAILURE', desc: '95°C | 7.4 mm/s | 1800 RPM | 94% Load', color: 'border-statusRed text-statusRed hover:bg-statusRed/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">Virtual ESP32 Sensor Lab</h2>
        <p className="text-sm text-textSecondary">
          Hardware-in-the-loop simulation of an ESP32 microcontroller publishing industrial telemetry to REST API
        </p>
      </div>

      {/* Main Grid: Hardware Device Mockup + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ESP32 Hardware Device Card & Telemetry Stream */}
        <div className="lg:col-span-6 space-y-6">
          {/* Virtual Hardware Box */}
          <div className="industrial-card p-6 border-t-4 border-t-cyanAccent relative overflow-hidden bg-gradient-to-b from-cardBg to-bgSecondary">
            <div className="flex items-center justify-between pb-4 border-b border-borderColor">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyanAccent/20 border border-cyanAccent flex items-center justify-center text-cyanAccent shadow-glow-cyan">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-textPrimary">ESP32 SENSOR BOARD</h3>
                  <p className="text-xs font-mono text-cyanAccent">DEVICE ID: ESP32-AM01</p>
                </div>
              </div>

              {/* Status LEDs */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-textSecondary uppercase font-mono">TX/RX Data</div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyanAccent animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-purpleAccent animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-textSecondary uppercase font-mono">Status</div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-statusGreen/20 text-statusGreen border border-statusGreen/40 flex items-center gap-1 mt-0.5">
                    <Wifi className="w-3 h-3" /> ONLINE
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware Pin Telemetry Readout */}
            <div className="grid grid-cols-2 gap-4 my-5">
              <div className="p-3 rounded-lg bg-bgPrimary border border-borderColor">
                <div className="text-xs text-textSecondary uppercase font-mono">GPIO Pin 34 (NTC Temp)</div>
                <div className="text-xl font-black font-mono text-statusRed mt-1">{telemetry.temperature}°C</div>
              </div>
              <div className="p-3 rounded-lg bg-bgPrimary border border-borderColor">
                <div className="text-xs text-textSecondary uppercase font-mono">GPIO Pin 35 (ADXL345 Vib)</div>
                <div className="text-xl font-black font-mono text-statusAmber mt-1">{telemetry.vibration} mm/s</div>
              </div>
              <div className="p-3 rounded-lg bg-bgPrimary border border-borderColor">
                <div className="text-xs text-textSecondary uppercase font-mono">GPIO Pin 18 (Hall RPM)</div>
                <div className="text-xl font-black font-mono text-cyanAccent mt-1">{telemetry.rpm} RPM</div>
              </div>
              <div className="p-3 rounded-lg bg-bgPrimary border border-borderColor">
                <div className="text-xs text-textSecondary uppercase font-mono">GPIO Pin 32 (ACS712 Load)</div>
                <div className="text-xl font-black font-mono text-purpleAccent mt-1">{telemetry.load}%</div>
              </div>
            </div>

            {/* Live Packet Counter */}
            <div className="flex items-center justify-between text-xs text-textSecondary pt-3 border-t border-borderColor/60 font-mono">
              <span>Telemetry Packets Transmitted: <strong className="text-textPrimary">{telemetry.packet_count || 1284}</strong></span>
              <span>Baud Rate: <strong className="text-cyanAccent">115200 bps</strong></span>
            </div>
          </div>

          {/* Raw JSON Payload Inspector */}
          <div className="industrial-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-sm text-textPrimary flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyanAccent" /> Live HTTP POST Payload Stream
              </h4>
              <span className="text-[10px] font-mono text-textSecondary uppercase">Endpoint: /api/telemetry</span>
            </div>
            <pre className="bg-bgPrimary p-4 rounded-xl border border-borderColor text-xs font-mono text-cyanAccent overflow-x-auto max-h-56">
              {JSON.stringify({
                device_id: telemetry.device_id,
                temperature: telemetry.temperature,
                vibration: telemetry.vibration,
                rpm: telemetry.rpm,
                load: telemetry.load,
                machineStatus: telemetry.machineStatus,
                active_scenario: telemetry.active_scenario,
                timestamp: telemetry.timestamp
              }, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right Column: Scenario Trigger Buttons & Manual Sliders */}
        <div className="lg:col-span-6 space-y-6">
          {/* Preset Scenario Cards */}
          <div className="industrial-card p-6">
            <h3 className="font-extrabold text-base text-textPrimary mb-1">
              PRESET SCENARIO SIMULATOR
            </h3>
            <p className="text-xs text-textSecondary mb-4">
              Click a scenario to trigger physical ESP32 telemetry injection & AI condition detection
            </p>

            <div className="space-y-3">
              {scenarioList.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setScenario(sc.id)}
                  className={`w-full p-4 rounded-xl border font-bold text-left transition-all flex items-center justify-between bg-cardBg hover:bg-cardHover ${sc.color}`}
                >
                  <div>
                    <div className="text-sm tracking-wider uppercase flex items-center gap-2">
                      {sc.label}
                    </div>
                    <div className="text-xs text-textSecondary font-mono font-normal mt-0.5">
                      {sc.desc}
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded bg-bgPrimary border border-borderColor font-mono text-textPrimary">
                    Trigger Scenario →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Sensor Injection Sliders */}
          <div className="industrial-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-textPrimary flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyanAccent" /> MANUAL PARAMETER INJECTION
              </h3>
              <button
                onClick={handleApplyManual}
                className="px-4 py-1.5 rounded-lg bg-cyanAccent text-black font-extrabold text-xs hover:bg-cyanAccent/90 shadow-glow-cyan"
              >
                Inject Telemetry
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-textSecondary">Temperature (°C):</span>
                  <span className="text-statusRed font-bold">{manualTemp}°C</span>
                </div>
                <input
                  type="range" min="20" max="120" step="0.5"
                  value={manualTemp}
                  onChange={(e) => setManualTemp(e.target.value)}
                  className="w-full accent-statusRed bg-borderColor rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-textSecondary">Vibration (mm/s):</span>
                  <span className="text-statusAmber font-bold">{manualVib} mm/s</span>
                </div>
                <input
                  type="range" min="0.5" max="12.0" step="0.1"
                  value={manualVib}
                  onChange={(e) => setManualVib(e.target.value)}
                  className="w-full accent-statusAmber bg-borderColor rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-textSecondary">Machine Speed (RPM):</span>
                  <span className="text-cyanAccent font-bold">{manualRpm} RPM</span>
                </div>
                <input
                  type="range" min="500" max="2500" step="25"
                  value={manualRpm}
                  onChange={(e) => setManualRpm(e.target.value)}
                  className="w-full accent-cyanAccent bg-borderColor rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-textSecondary">Machine Load (%):</span>
                  <span className="text-purpleAccent font-bold">{manualLoad}%</span>
                </div>
                <input
                  type="range" min="10" max="100" step="1"
                  value={manualLoad}
                  onChange={(e) => setManualLoad(e.target.value)}
                  className="w-full accent-purpleAccent bg-borderColor rounded-lg h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
