import React from 'react';
import { useMachine } from '../context/MachineContext';
import { Thermometer, Zap, Gauge, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DigitalTwin = ({ compact = false }) => {
  const { telemetry } = useMachine();

  const getStatusColor = (val, warn, crit) => {
    if (val >= crit) return { hex: '#EF4444', text: 'text-statusRed', bg: 'bg-statusRed/20', border: 'border-statusRed' };
    if (val >= warn) return { hex: '#F59E0B', text: 'text-statusAmber', bg: 'bg-statusAmber/20', border: 'border-statusAmber' };
    return { hex: '#22C55E', text: 'text-statusGreen', bg: 'bg-statusGreen/20', border: 'border-statusGreen' };
  };

  const tempStatus = getStatusColor(telemetry.temperature, 75, 90);
  const vibStatus = getStatusColor(telemetry.vibration, 3.5, 6.0);
  const loadStatus = getStatusColor(telemetry.load, 75, 90);

  // Rotation duration calculation based on RPM
  const rotationDuration = Math.max(0.15, 60 / Math.max(100, telemetry.rpm));

  return (
    <div className={`industrial-card p-5 relative overflow-hidden flex flex-col justify-between ${compact ? 'h-72' : 'h-[440px]'}`}>
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#273340_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyanAccent animate-ping" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-textPrimary">
            Digital Twin — 2D Spindle Assembly (AM-01)
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-textSecondary">State:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${tempStatus.bg} ${tempStatus.text} border ${tempStatus.border}`}>
            {telemetry.condition}
          </span>
        </div>
      </div>

      {/* 2D Industrial SVG Machine Diagram */}
      <div className="relative flex-1 flex items-center justify-center my-2 z-10">
        <svg className="w-full h-full max-h-72" viewBox="0 0 700 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main CNC Chassis Frame */}
          <rect x="50" y="40" width="600" height="240" rx="12" fill="#111820" stroke="#273340" strokeWidth="2" />
          <rect x="70" y="60" width="560" height="200" rx="8" fill="#0B0F14" stroke="#1B2530" strokeWidth="1.5" />

          {/* Heavy Machine Base Guide Rails */}
          <line x1="90" y1="230" x2="610" y2="230" stroke="#384A5E" strokeWidth="6" strokeDasharray="12 6" />
          <line x1="90" y1="240" x2="610" y2="240" stroke="#273340" strokeWidth="3" />

          {/* Motor Housing (Left) */}
          <rect x="100" y="90" width="130" height="130" rx="10" fill="#151D26" stroke="#273340" strokeWidth="2" />
          <rect x="110" y="100" width="110" height="110" rx="6" fill="#1B2530" />
          
          {/* Motor Cooling Fins */}
          <line x1="120" y1="110" x2="120" y2="200" stroke="#273340" strokeWidth="2" />
          <line x1="140" y1="110" x2="140" y2="200" stroke="#273340" strokeWidth="2" />
          <line x1="160" y1="110" x2="160" y2="200" stroke="#273340" strokeWidth="2" />
          <line x1="180" y1="110" x2="180" y2="200" stroke="#273340" strokeWidth="2" />
          <line x1="200" y1="110" x2="200" y2="200" stroke="#273340" strokeWidth="2" />

          {/* Drive Shaft Connection */}
          <rect x="230" y="135" width="70" height="40" fill="#273340" stroke="#384A5E" strokeWidth="1.5" />

          {/* Spindle Head Assembly (Center) */}
          <rect x="300" y="80" width="160" height="150" rx="12" fill="#151D26" stroke={tempStatus.hex} strokeWidth="2" />
          
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

          {/* Workpiece & Cutting Tool */}
          <rect x="520" y="145" width="70" height="20" rx="2" fill="#7C5CFF" stroke="#A78BFA" strokeWidth="1.5" />
          <polygon points="495,155 520,150 520,160" fill="#F59E0B" />

          {/* SENSOR NODES & INDICATORS */}
          {/* 1. Temp Sensor Probe */}
          <g transform="translate(380, 65)">
            <line x1="0" y1="0" x2="0" y2="15" stroke={tempStatus.hex} strokeWidth="2" />
            <circle cx="0" cy="0" r="10" fill={tempStatus.hex} className="animate-pulse" />
            <text x="0" y="4" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">T</text>
          </g>

          {/* 2. Vibration Sensor Probe */}
          <g transform="translate(165, 75)">
            <line x1="0" y1="0" x2="0" y2="15" stroke={vibStatus.hex} strokeWidth="2" />
            <circle cx="0" cy="0" r="10" fill={vibStatus.hex} className="animate-pulse" />
            <text x="0" y="4" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">V</text>
          </g>

          {/* 3. RPM Optical Encoder */}
          <g transform="translate(265, 120)">
            <circle cx="0" cy="0" r="9" fill="#00D4FF" className="animate-pulse" />
            <text x="0" y="4" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">R</text>
          </g>

          {/* 4. Load Sensor Probe */}
          <g transform="translate(555, 125)">
            <circle cx="0" cy="0" r="9" fill={loadStatus.hex} className="animate-pulse" />
            <text x="0" y="4" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">L</text>
          </g>
        </svg>

        {/* Floating Sensor Parameter Badges Over Twin */}
        <div className="absolute top-2 left-4 bg-cardBg/90 border border-borderColor p-2 rounded-lg backdrop-blur text-xs flex items-center gap-2">
          <Thermometer className={`w-4 h-4 ${tempStatus.text}`} />
          <div>
            <div className="text-[10px] text-textSecondary uppercase">Temp Probe</div>
            <div className={`font-mono font-bold ${tempStatus.text}`}>{telemetry.temperature}°C</div>
          </div>
        </div>

        <div className="absolute bottom-2 left-4 bg-cardBg/90 border border-borderColor p-2 rounded-lg backdrop-blur text-xs flex items-center gap-2">
          <Flame className={`w-4 h-4 ${vibStatus.text}`} />
          <div>
            <div className="text-[10px] text-textSecondary uppercase">Vibration Probe</div>
            <div className={`font-mono font-bold ${vibStatus.text}`}>{telemetry.vibration} mm/s</div>
          </div>
        </div>

        <div className="absolute top-2 right-4 bg-cardBg/90 border border-borderColor p-2 rounded-lg backdrop-blur text-xs flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyanAccent" />
          <div>
            <div className="text-[10px] text-textSecondary uppercase">Drive Speed</div>
            <div className="font-mono font-bold text-cyanAccent">{telemetry.rpm} RPM</div>
          </div>
        </div>

        <div className="absolute bottom-2 right-4 bg-cardBg/90 border border-borderColor p-2 rounded-lg backdrop-blur text-xs flex items-center gap-2">
          <Zap className={`w-4 h-4 ${loadStatus.text}`} />
          <div>
            <div className="text-[10px] text-textSecondary uppercase">Motor Load</div>
            <div className={`font-mono font-bold ${loadStatus.text}`}>{telemetry.load}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
