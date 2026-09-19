import React, { useState, useEffect, useRef } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  Cpu, 
  Wifi, 
  Zap, 
  Sliders, 
  Radio, 
  Activity, 
  Thermometer, 
  Gauge, 
  Wind, 
  Unplug, 
  Plug, 
  Terminal, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';

export const HardwareWorkbench = () => {
  const { telemetry, toggleSensorConnection, injectManualParameters } = useMachine();

  const [tempVal, setTempVal] = useState(telemetry.temperature || 72.0);
  const [vibVal, setVibVal] = useState(telemetry.vibration || 2.4);
  const [rpmVal, setRpmVal] = useState(telemetry.rpm || 1500);
  const [loadVal, setLoadVal] = useState(telemetry.load || 64.0);
  const [presVal, setPresVal] = useState(telemetry.pressure || 5.5);

  const canvasRef = useRef(null);

  // Synchronize manual sliders when telemetry updates
  useEffect(() => {
    if (telemetry.temperature) setTempVal(telemetry.temperature);
    if (telemetry.vibration) setVibVal(telemetry.vibration);
    if (telemetry.rpm) setRpmVal(telemetry.rpm);
    if (telemetry.load) setLoadVal(telemetry.load);
    if (telemetry.pressure) setPresVal(telemetry.pressure);
  }, [telemetry]);

  const handleApplySliders = () => {
    injectManualParameters({
      temperature: parseFloat(tempVal),
      vibration: parseFloat(vibVal),
      rpm: parseInt(rpmVal),
      load: parseFloat(loadVal),
      pressure: parseFloat(presVal)
    });
  };

  // Oscilloscope Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const renderScope = () => {
      ctx.fillStyle = '#0B0F14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Oscilloscope Grid Lines
      ctx.strokeStyle = '#1B2530';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Voltage Waveforms if sensors are connected
      phase += 0.08;

      // 1. Temp Analog Waveform (Cyan/Red)
      if (telemetry.temp_connected !== false) {
        ctx.strokeStyle = telemetry.temperature >= 90 ? '#EF4444' : '#00D4FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 2) {
          const y = (canvas.height / 3) + Math.sin((x * 0.04) + phase) * (telemetry.temperature * 0.25);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 2. Vibration High-Frequency Waveform (Amber)
      if (telemetry.vib_connected !== false) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 2) {
          const y = (2 * canvas.height / 3) + Math.sin((x * 0.15) + phase * 2) * (telemetry.vibration * 3.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(renderScope);
    };

    renderScope();
    return () => cancelAnimationFrame(animationFrameId);
  }, [telemetry]);

  // Heatmap Color Interpolation
  const getHeatmapColor = (temp) => {
    if (temp >= 90) return 'rgba(239, 68, 68, 0.6)';
    if (temp >= 75) return 'rgba(245, 158, 11, 0.5)';
    if (temp >= 55) return 'rgba(0, 212, 255, 0.4)';
    return 'rgba(59, 130, 246, 0.3)';
  };

  const heatmapGlow = getHeatmapColor(telemetry.temperature || 72);
  const rotationDuration = Math.max(0.15, 60 / Math.max(100, telemetry.rpm || 1500));

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyanAccent/20 text-cyanAccent text-xs font-mono font-bold">
              HARDWARE-IN-THE-LOOP WORKBENCH
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight mt-1">
            Interactive Hardware & Physics Simulator
          </h2>
          <p className="text-sm text-textSecondary">
            Plug/unplug physical GPIO sensors, adjust hydraulic coolant pressure, and observe real-time thermal heatmaps
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-cardBg border border-borderColor text-textSecondary flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyanAccent" /> Microcontroller: <strong className="text-cyanAccent">ESP32-AM01</strong>
          </span>
        </div>
      </div>

      {/* 1. SENSOR WIRING BREADBOARD (Interactive Wire Connect / Disconnect Cards) */}
      <div className="industrial-card p-6 border-t-4 border-t-cyanAccent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-textPrimary flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyanAccent animate-pulse" /> SENSOR WIRING BREADBOARD BAY
            </h3>
            <p className="text-xs text-textSecondary">
              Click any sensor toggle button to attach or disconnect physical hardware GPIO lines in real-time
            </p>
          </div>
          <span className="text-xs font-mono text-cyanAccent font-bold">5 Active Hardware Channels</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Sensor 1: NTC Temp */}
          <div className={`p-4 rounded-xl border transition-all ${
            telemetry.temp_connected !== false ? 'bg-cardBg border-statusRed/40' : 'bg-statusRed/10 border-statusRed border-dashed'
          }`}>
            <div className="flex items-center justify-between">
              <Thermometer className="w-5 h-5 text-statusRed" />
              <span className="text-[10px] font-mono text-textSecondary">GPIO 34</span>
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-textPrimary">NTC Thermal Probe</div>
              <div className="text-lg font-black font-mono text-statusRed mt-0.5">
                {telemetry.temp_connected !== false ? `${telemetry.temperature}°C` : 'SIGNAL LOST'}
              </div>
            </div>
            <button
              onClick={() => toggleSensorConnection('temperature', telemetry.temp_connected === false)}
              className={`w-full mt-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                telemetry.temp_connected !== false
                  ? 'bg-statusRed/20 text-statusRed border border-statusRed/40 hover:bg-statusRed/30'
                  : 'bg-statusGreen text-black hover:bg-statusGreen/90'
              }`}
            >
              {telemetry.temp_connected !== false ? <Unplug className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5" />}
              {telemetry.temp_connected !== false ? 'Disconnect Wire' : 'Reconnect Wire'}
            </button>
          </div>

          {/* Sensor 2: Vibration ADXL345 */}
          <div className={`p-4 rounded-xl border transition-all ${
            telemetry.vib_connected !== false ? 'bg-cardBg border-statusAmber/40' : 'bg-statusRed/10 border-statusRed border-dashed'
          }`}>
            <div className="flex items-center justify-between">
              <Activity className="w-5 h-5 text-statusAmber" />
              <span className="text-[10px] font-mono text-textSecondary">GPIO 35</span>
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-textPrimary">ADXL345 Accelerometer</div>
              <div className="text-lg font-black font-mono text-statusAmber mt-0.5">
                {telemetry.vib_connected !== false ? `${telemetry.vibration} mm/s` : 'SIGNAL LOST'}
              </div>
            </div>
            <button
              onClick={() => toggleSensorConnection('vibration', telemetry.vib_connected === false)}
              className={`w-full mt-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                telemetry.vib_connected !== false
                  ? 'bg-statusAmber/20 text-statusAmber border border-statusAmber/40 hover:bg-statusAmber/30'
                  : 'bg-statusGreen text-black hover:bg-statusGreen/90'
              }`}
            >
              {telemetry.vib_connected !== false ? <Unplug className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5" />}
              {telemetry.vib_connected !== false ? 'Disconnect Wire' : 'Reconnect Wire'}
            </button>
          </div>

          {/* Sensor 3: Hall RPM Encoder */}
          <div className={`p-4 rounded-xl border transition-all ${
            telemetry.rpm_connected !== false ? 'bg-cardBg border-cyanAccent/40' : 'bg-statusRed/10 border-statusRed border-dashed'
          }`}>
            <div className="flex items-center justify-between">
              <Gauge className="w-5 h-5 text-cyanAccent" />
              <span className="text-[10px] font-mono text-textSecondary">GPIO 18</span>
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-textPrimary">Hall Speed Encoder</div>
              <div className="text-lg font-black font-mono text-cyanAccent mt-0.5">
                {telemetry.rpm_connected !== false ? `${telemetry.rpm} RPM` : 'SIGNAL LOST'}
              </div>
            </div>
            <button
              onClick={() => toggleSensorConnection('rpm', telemetry.rpm_connected === false)}
              className={`w-full mt-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                telemetry.rpm_connected !== false
                  ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40 hover:bg-cyanAccent/30'
                  : 'bg-statusGreen text-black hover:bg-statusGreen/90'
              }`}
            >
              {telemetry.rpm_connected !== false ? <Unplug className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5" />}
              {telemetry.rpm_connected !== false ? 'Disconnect Wire' : 'Reconnect Wire'}
            </button>
          </div>

          {/* Sensor 4: ACS712 Current Load */}
          <div className={`p-4 rounded-xl border transition-all ${
            telemetry.load_connected !== false ? 'bg-cardBg border-purpleAccent/40' : 'bg-statusRed/10 border-statusRed border-dashed'
          }`}>
            <div className="flex items-center justify-between">
              <Zap className="w-5 h-5 text-purpleAccent" />
              <span className="text-[10px] font-mono text-textSecondary">GPIO 32</span>
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-textPrimary">ACS712 Load Sensor</div>
              <div className="text-lg font-black font-mono text-purpleAccent mt-0.5">
                {telemetry.load_connected !== false ? `${telemetry.load}%` : 'SIGNAL LOST'}
              </div>
            </div>
            <button
              onClick={() => toggleSensorConnection('load', telemetry.load_connected === false)}
              className={`w-full mt-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                telemetry.load_connected !== false
                  ? 'bg-purpleAccent/20 text-purpleAccent border border-purpleAccent/40 hover:bg-purpleAccent/30'
                  : 'bg-statusGreen text-black hover:bg-statusGreen/90'
              }`}
            >
              {telemetry.load_connected !== false ? <Unplug className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5" />}
              {telemetry.load_connected !== false ? 'Disconnect Wire' : 'Reconnect Wire'}
            </button>
          </div>

          {/* Sensor 5: Piezo Pressure Transducer */}
          <div className={`p-4 rounded-xl border transition-all ${
            telemetry.pressure_connected !== false ? 'bg-cardBg border-statusGreen/40' : 'bg-statusRed/10 border-statusRed border-dashed'
          }`}>
            <div className="flex items-center justify-between">
              <Wind className="w-5 h-5 text-statusGreen" />
              <span className="text-[10px] font-mono text-textSecondary">GPIO 33</span>
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-textPrimary">Coolant Transducer</div>
              <div className="text-lg font-black font-mono text-statusGreen mt-0.5">
                {telemetry.pressure_connected !== false ? `${telemetry.pressure || 5.5} Bar` : 'SIGNAL LOST'}
              </div>
            </div>
            <button
              onClick={() => toggleSensorConnection('pressure', telemetry.pressure_connected === false)}
              className={`w-full mt-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                telemetry.pressure_connected !== false
                  ? 'bg-statusGreen/20 text-statusGreen border border-statusGreen/40 hover:bg-statusGreen/30'
                  : 'bg-statusGreen text-black hover:bg-statusGreen/90'
              }`}
            >
              {telemetry.pressure_connected !== false ? <Unplug className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5" />}
              {telemetry.pressure_connected !== false ? 'Disconnect Wire' : 'Reconnect Wire'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKBENCH SIMULATION CANVAS & DYNAMIC HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 2D Spindle Twin with Thermal Heatmap Overlay */}
        <div className="lg:col-span-7 industrial-card p-6 relative overflow-hidden flex flex-col justify-between h-[450px]">
          <div className="flex items-center justify-between z-10">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-textPrimary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyanAccent" /> 2D Machine Twin with Thermal Heatmap Overlay
            </h3>
            <span className="text-xs font-mono text-textSecondary">
              Coolant Flow: <strong className="text-statusGreen">{telemetry.pressure || 5.5} Bar</strong>
            </span>
          </div>

          {/* SVG Machine Twin with Dynamic Radial Heatmap Glow */}
          <div className="relative flex-1 flex items-center justify-center my-4 z-10">
            {/* Dynamic Radial Thermal Heatmap Canvas Circle around Spindle Head */}
            <div 
              className="absolute w-64 h-64 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
              style={{
                backgroundColor: heatmapGlow,
                left: '50%',
                top: '40%',
                transform: 'translate(-50%, -50%)'
              }}
            />

            <svg className="w-full h-full max-h-72 relative z-10" viewBox="0 0 700 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="40" width="600" height="240" rx="12" fill="#111820" stroke="#273340" strokeWidth="2" />
              <rect x="70" y="60" width="560" height="200" rx="8" fill="#0B0F14" stroke="#1B2530" strokeWidth="1.5" />
              <line x1="90" y1="230" x2="610" y2="230" stroke="#384A5E" strokeWidth="6" strokeDasharray="12 6" />

              {/* Motor Housing */}
              <rect x="100" y="90" width="130" height="130" rx="10" fill="#151D26" stroke="#273340" strokeWidth="2" />
              
              {/* Spindle Head */}
              <rect x="300" y="80" width="160" height="150" rx="12" fill="#151D26" stroke={telemetry.temperature >= 90 ? '#EF4444' : '#00D4FF'} strokeWidth="2" />

              {/* Rotating Spindle Chuck */}
              <g transform="translate(460, 155)">
                <circle cx="0" cy="0" r="38" fill="#1B2530" stroke="#00D4FF" strokeWidth="2" />
                <g style={{ transformOrigin: '0px 0px', animation: `spin ${rotationDuration}s linear infinite` }}>
                  <circle cx="0" cy="0" r="28" fill="#273340" stroke="#384A5E" strokeWidth="1.5" />
                  <line x1="-30" y1="0" x2="30" y2="0" stroke="#00D4FF" strokeWidth="3" />
                  <line x1="0" y1="-30" x2="0" y2="30" stroke="#00D4FF" strokeWidth="3" />
                  <circle cx="0" cy="0" r="10" fill="#00D4FF" />
                </g>
              </g>

              {/* Coolant Fluid Spray Animation */}
              {telemetry.pressure > 0.5 && (
                <g transform="translate(460, 115)">
                  <path d="M0,0 Q15,20 30,35" stroke="#00D4FF" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />
                  <path d="M5,0 Q20,25 35,40" stroke="#00D4FF" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Column: Oscilloscope Waveform Scope & Physics Sliders */}
        <div className="lg:col-span-5 space-y-6">
          {/* Oscilloscope Waveform Display */}
          <div className="industrial-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-sm text-textPrimary flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyanAccent" /> Real-Time Signal Oscilloscope (0 - 3.3V)
              </h4>
              <span className="text-[10px] font-mono text-cyanAccent">Scope Ch 1 & Ch 2</span>
            </div>
            <canvas ref={canvasRef} width={380} height={130} className="w-full h-32 rounded-lg border border-borderColor bg-bgPrimary" />
          </div>

          {/* Interactive Physics Controls Sliders */}
          <div className="industrial-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-borderColor pb-2">
              <h4 className="font-extrabold text-xs text-textPrimary uppercase">PHYSICS PARAMETER TUNER</h4>
              <button
                onClick={handleApplySliders}
                className="px-3 py-1 rounded bg-cyanAccent text-black font-extrabold text-xs hover:bg-cyanAccent/90 shadow-glow-cyan"
              >
                Inject Physics
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Temperature:</span>
                  <span className="text-statusRed font-bold">{tempVal}°C</span>
                </div>
                <input type="range" min="20" max="120" value={tempVal} onChange={(e) => setTempVal(e.target.value)} className="w-full accent-statusRed bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Vibration:</span>
                  <span className="text-statusAmber font-bold">{vibVal} mm/s</span>
                </div>
                <input type="range" min="0.5" max="10.0" step="0.1" value={vibVal} onChange={(e) => setVibVal(e.target.value)} className="w-full accent-statusAmber bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Spindle Speed:</span>
                  <span className="text-cyanAccent font-bold">{rpmVal} RPM</span>
                </div>
                <input type="range" min="500" max="2500" step="25" value={rpmVal} onChange={(e) => setRpmVal(e.target.value)} className="w-full accent-cyanAccent bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Coolant Pressure:</span>
                  <span className="text-statusGreen font-bold">{presVal} Bar</span>
                </div>
                <input type="range" min="0.0" max="10.0" step="0.5" value={presVal} onChange={(e) => setPresVal(e.target.value)} className="w-full accent-statusGreen bg-borderColor rounded h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
