import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { Thermometer, Activity, Gauge, Zap, Download, RefreshCw, Pause, Play } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export const LiveMonitoring = () => {
  const { history } = useMachine();
  const [isPaused, setIsPaused] = useState(false);

  const displayHistory = isPaused ? history : history;

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Timestamp', 'Temperature (°C)', 'Vibration (mm/s)', 'RPM', 'Load (%)', 'Condition'];
    const rows = history.map(r => [r.timestamp, r.temperature, r.vibration, r.rpm, r.load, r.condition]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `telemetry_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">Real-Time Sensor Telemetry</h2>
          <p className="text-sm text-textSecondary">
            High-frequency live data feeds streamed directly from Virtual ESP32 telemetry bus
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 border transition-all ${
              isPaused
                ? 'bg-statusAmber/20 border-statusAmber text-statusAmber'
                : 'bg-cardBg border-borderColor text-textSecondary hover:text-textPrimary'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume Stream' : 'Freeze Stream'}
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg bg-cyanAccent/10 border border-cyanAccent/30 text-cyanAccent font-bold text-xs flex items-center gap-2 hover:bg-cyanAccent/20"
          >
            <Download className="w-4 h-4" /> Export Telemetry CSV
          </button>
        </div>
      </div>

      {/* 4 Large Real-Time Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Temperature vs Time */}
        <div className="industrial-card p-6 border-l-4 border-l-statusRed">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-statusRed/10 text-statusRed">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-textPrimary">Temperature vs Time</h3>
                <span className="text-xs text-textSecondary font-mono">Operating Range: 20°C – 120°C</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-textSecondary">Current:</span>
              <div className="text-xl font-extrabold text-statusRed">
                {history.length > 0 ? history[history.length - 1].temperature : 72}°C
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273340" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 110]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151D26', borderColor: '#273340', borderRadius: '8px', color: '#FFF' }} />
                <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Warning (75°C)', fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={90} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Critical (90°C)', fill: '#EF4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vibration vs Time */}
        <div className="industrial-card p-6 border-l-4 border-l-statusAmber">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-statusAmber/10 text-statusAmber">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-textPrimary">Vibration vs Time</h3>
                <span className="text-xs text-textSecondary font-mono">Operating Range: 0.0 – 10.0 mm/s</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-textSecondary">Current:</span>
              <div className="text-xl font-extrabold text-statusAmber">
                {history.length > 0 ? history[history.length - 1].vibration : 2.4} mm/s
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273340" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151D26', borderColor: '#273340', borderRadius: '8px', color: '#FFF' }} />
                <ReferenceLine y={3.5} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Warning (3.5 mm/s)', fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={6.0} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Critical (6.0 mm/s)', fill: '#EF4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="vibration" stroke="#F59E0B" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Machine Speed (RPM) vs Time */}
        <div className="industrial-card p-6 border-l-4 border-l-cyanAccent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyanAccent/10 text-cyanAccent">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-textPrimary">Machine Speed (RPM) vs Time</h3>
                <span className="text-xs text-textSecondary font-mono">Operating Range: 500 – 3000 RPM</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-textSecondary">Current Speed:</span>
              <div className="text-xl font-extrabold text-cyanAccent">
                {history.length > 0 ? history[history.length - 1].rpm : 1500} RPM
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273340" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[500, 2500]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151D26', borderColor: '#273340', borderRadius: '8px', color: '#FFF' }} />
                <ReferenceLine y={1500} stroke="#00D4FF" strokeDasharray="3 3" label={{ value: 'Nominal Target (1500 RPM)', fill: '#00D4FF', fontSize: 10 }} />
                <Line type="stepAfter" dataKey="rpm" stroke="#00D4FF" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Machine Load (%) vs Time */}
        <div className="industrial-card p-6 border-l-4 border-l-purpleAccent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purpleAccent/10 text-purpleAccent">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-textPrimary">Machine Load (%) vs Time</h3>
                <span className="text-xs text-textSecondary font-mono">Capacity Range: 0% – 100%</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-textSecondary">Current Load:</span>
              <div className="text-xl font-extrabold text-purpleAccent">
                {history.length > 0 ? history[history.length - 1].load : 64}%
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273340" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151D26', borderColor: '#273340', borderRadius: '8px', color: '#FFF' }} />
                <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Heavy Load (75%)', fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={90} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Max Load (90%)', fill: '#EF4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="load" stroke="#7C5CFF" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
