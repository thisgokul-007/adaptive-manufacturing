import React from 'react';
import { useMachine } from '../context/MachineContext';
import { DigitalTwin } from '../components/DigitalTwin';
import { 
  Thermometer, 
  Activity, 
  Gauge, 
  Zap, 
  BrainCircuit, 
  ShieldAlert, 
  Sliders, 
  ArrowDownRight, 
  Sparkles,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const Overview = ({ setActiveTab }) => {
  const { telemetry, history, applyAdaptiveControl } = useMachine();

  const getConditionStyle = () => {
    if (telemetry.condition === 'CRITICAL') {
      return {
        bg: 'bg-statusRed/10',
        border: 'border-statusRed/40',
        text: 'text-statusRed',
        badgeBg: 'bg-statusRed',
        shadow: 'shadow-glow-red'
      };
    }
    if (telemetry.condition === 'WARNING') {
      return {
        bg: 'bg-statusAmber/10',
        border: 'border-statusAmber/40',
        text: 'text-statusAmber',
        badgeBg: 'bg-statusAmber',
        shadow: 'shadow-glow-amber'
      };
    }
    return {
      bg: 'bg-statusGreen/10',
      border: 'border-statusGreen/40',
      text: 'text-statusGreen',
      badgeBg: 'bg-statusGreen',
      shadow: 'shadow-glow-green'
    };
  };

  const condStyle = getConditionStyle();

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <div className="industrial-card p-6 bg-gradient-to-r from-cardBg via-bgSecondary to-cardBg flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-cyanAccent">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-cyanAccent/10 border border-cyanAccent/30 text-cyanAccent text-xs font-mono font-bold tracking-wider uppercase">
              Unit ID: AM-01
            </span>
            <span className="text-textSecondary text-xs">|</span>
            <span className="text-textSecondary text-xs font-medium">CNC Precision Milling Spindle</span>
          </div>
          <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight mt-2">
            ADAPTIVE MANUFACTURING
          </h1>
          <p className="text-textSecondary text-base mt-1">
            AI-powered real-time production intelligence & autonomous closed-loop machine monitoring
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-textSecondary uppercase font-mono">Machine Status</div>
            <div className={`text-xl font-black ${condStyle.text} flex items-center justify-end gap-2 mt-0.5`}>
              <span className={`w-3 h-3 rounded-full ${condStyle.badgeBg} animate-ping`} />
              {telemetry.condition}
            </div>
          </div>
          <div className="h-10 w-[1px] bg-borderColor" />
          <div className="text-right">
            <div className="text-xs text-textSecondary uppercase font-mono">Production Mode</div>
            <div className="text-xl font-black text-cyanAccent flex items-center justify-end gap-1 mt-0.5 font-mono">
              RUNNING
            </div>
          </div>
        </div>
      </div>

      {/* 4 Large KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Temperature */}
        <div className="industrial-card p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">TEMPERATURE</span>
            <div className="p-2 rounded-lg bg-statusRed/10 text-statusRed">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-textPrimary font-mono">{telemetry.temperature}</span>
            <span className="text-xl font-bold text-textSecondary">°C</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-textSecondary">Nominal: &lt;75°C</span>
            <span className={telemetry.temperature >= 75 ? 'text-statusAmber font-bold' : 'text-statusGreen font-bold'}>
              {telemetry.temperature >= 90 ? 'Critical Thermal' : telemetry.temperature >= 75 ? 'Elevated' : 'Optimal'}
            </span>
          </div>
          <div className="w-full bg-borderColor/50 h-1.5 mt-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                telemetry.temperature >= 90 ? 'bg-statusRed' : telemetry.temperature >= 75 ? 'bg-statusAmber' : 'bg-statusGreen'
              }`}
              style={{ width: `${Math.min(100, (telemetry.temperature / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Vibration */}
        <div className="industrial-card p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">VIBRATION</span>
            <div className="p-2 rounded-lg bg-statusAmber/10 text-statusAmber">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-textPrimary font-mono">{telemetry.vibration}</span>
            <span className="text-xl font-bold text-textSecondary">mm/s</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-textSecondary">Limit: 3.5 mm/s</span>
            <span className={telemetry.vibration >= 3.5 ? 'text-statusAmber font-bold' : 'text-statusGreen font-bold'}>
              {telemetry.vibration >= 6.0 ? 'Excessive Chatter' : telemetry.vibration >= 3.5 ? 'Elevated' : 'Stable'}
            </span>
          </div>
          <div className="w-full bg-borderColor/50 h-1.5 mt-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                telemetry.vibration >= 6.0 ? 'bg-statusRed' : telemetry.vibration >= 3.5 ? 'bg-statusAmber' : 'bg-statusGreen'
              }`}
              style={{ width: `${Math.min(100, (telemetry.vibration / 10) * 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Machine Speed */}
        <div className="industrial-card p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">MACHINE SPEED</span>
            <div className="p-2 rounded-lg bg-cyanAccent/10 text-cyanAccent">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-textPrimary font-mono">{telemetry.rpm}</span>
            <span className="text-xl font-bold text-textSecondary">RPM</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-textSecondary">Target: 1500 RPM</span>
            <span className="text-cyanAccent font-bold">Spindle Active</span>
          </div>
          <div className="w-full bg-borderColor/50 h-1.5 mt-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyanAccent transition-all duration-500"
              style={{ width: `${Math.min(100, (telemetry.rpm / 2500) * 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Machine Load */}
        <div className="industrial-card p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">MACHINE LOAD</span>
            <div className="p-2 rounded-lg bg-purpleAccent/10 text-purpleAccent">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-textPrimary font-mono">{telemetry.load}</span>
            <span className="text-xl font-bold text-textSecondary">%</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-textSecondary">Capacity: 100%</span>
            <span className={telemetry.load >= 75 ? 'text-statusAmber font-bold' : 'text-statusGreen font-bold'}>
              {telemetry.load >= 90 ? 'Critical Load' : telemetry.load >= 75 ? 'High Load' : 'Moderate'}
            </span>
          </div>
          <div className="w-full bg-borderColor/50 h-1.5 mt-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                telemetry.load >= 90 ? 'bg-statusRed' : telemetry.load >= 75 ? 'bg-statusAmber' : 'bg-statusGreen'
              }`}
              style={{ width: `${telemetry.load}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid: AI Insight Panel + Digital Twin */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Diagnostic Insight & Adaptive Control Recommendation */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Condition Alert Banner */}
          <div className={`industrial-card p-6 ${condStyle.bg} ${condStyle.border} ${condStyle.shadow}`}>
            <div className="flex items-center justify-between pb-4 border-b border-borderColor/40">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${condStyle.badgeBg} text-black font-bold`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-textSecondary uppercase tracking-wider">CURRENT CONDITION</div>
                  <div className={`text-2xl font-black ${condStyle.text}`}>{telemetry.condition}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-textSecondary uppercase font-mono">Failure Risk</div>
                <div className="text-2xl font-mono font-black text-textPrimary">{telemetry.failure_risk}%</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-bold text-textSecondary uppercase tracking-wider">REASON DETECTED:</div>
              <p className="text-sm font-medium text-textPrimary mt-1">{telemetry.reason}</p>
            </div>
          </div>

          {/* AI INSIGHT PANEL */}
          <div className="industrial-card p-6 border-l-4 border-l-purpleAccent relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purpleAccent/20 text-purpleAccent flex items-center justify-center font-bold">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-textPrimary">AI DIAGNOSTIC INSIGHT</h3>
                  <p className="text-xs text-textSecondary">Real-time deep diagnostic analysis</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-purpleAccent/10 text-purpleAccent text-xs font-mono font-bold border border-purpleAccent/30">
                GPT-4 Industrial Engine
              </span>
            </div>

            <p className="text-sm text-textPrimary leading-relaxed bg-bgPrimary/60 p-4 rounded-lg border border-borderColor/60 font-medium">
              "{telemetry.ai_insight}"
            </p>

            {/* Recommendation Box */}
            <div className="mt-5 p-4 rounded-xl bg-cardHover border border-borderColor flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-purpleAccent uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI RECOMMENDATION
                </div>
                <div className="text-sm font-bold text-textPrimary mt-1">
                  {telemetry.recommendation}
                </div>
                <div className="text-xs text-textSecondary mt-0.5">
                  Expected Result: {telemetry.expected_outcome}
                </div>
              </div>

              {telemetry.recommended_rpm !== telemetry.rpm && (
                <button
                  onClick={() => applyAdaptiveControl(telemetry.recommended_rpm)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purpleAccent to-cyanAccent text-black font-extrabold text-sm hover:opacity-95 shadow-glow-purple whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" /> APPLY RECOMMENDATION
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 2D Digital Twin Visualizer */}
        <div className="lg:col-span-5">
          <DigitalTwin />
        </div>
      </div>

      {/* Mini Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="industrial-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-textPrimary flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-statusRed" /> Temperature vs Time Preview
            </h4>
            <button onClick={() => setActiveTab('monitoring')} className="text-xs text-cyanAccent hover:underline">
              View Full Charts →
            </button>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 110]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151D26', borderColor: '#273340', borderRadius: '8px', color: '#FFF' }} />
                <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="industrial-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-textPrimary flex items-center gap-2">
              <Activity className="w-4 h-4 text-statusAmber" /> Vibration vs Time Preview
            </h4>
            <button onClick={() => setActiveTab('monitoring')} className="text-xs text-cyanAccent hover:underline">
              View Full Charts →
            </button>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151D26', borderColor: '#273340', borderRadius: '8px', color: '#FFF' }} />
                <Line type="monotone" dataKey="vibration" stroke="#F59E0B" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
