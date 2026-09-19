import React, { useState, useEffect } from 'react';
import { Bell, Play, Pause, RotateCcw, Cpu, Clock, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useMachine } from '../context/MachineContext';

const pageTitles = {
  overview: 'Overview Dashboard',
  monitoring: 'Real-Time Sensor Monitoring',
  esp32: 'Virtual ESP32 Sensor Lab',
  prediction: 'AI Production Prediction',
  adaptive: 'Adaptive Speed Control',
  simulation: 'Simulation Lab & What-If Matrix',
  timeline: 'Incident Timeline Log',
  database: 'Telemetry History & Database',
  settings: 'System Configuration'
};

export const Header = ({ activeTab }) => {
  const { telemetry, notifications, startDemoMode, demoActive, stopDemoMode } = useMachine();
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getConditionBadge = () => {
    if (telemetry.condition === 'CRITICAL') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-statusRed/20 text-statusRed border border-statusRed/40 flex items-center gap-1.5 animate-pulse shadow-glow-red">
          <AlertOctagon className="w-4 h-4" /> CRITICAL
        </span>
      );
    }
    if (telemetry.condition === 'WARNING') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-statusAmber/20 text-statusAmber border border-statusAmber/40 flex items-center gap-1.5 shadow-glow-amber">
          <AlertTriangle className="w-4 h-4" /> WARNING
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-statusGreen/20 text-statusGreen border border-statusGreen/40 flex items-center gap-1.5 shadow-glow-green">
        <CheckCircle2 className="w-4 h-4" /> NORMAL
      </span>
    );
  };

  return (
    <header className="h-20 bg-bgSecondary border-b border-borderColor px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Current Page Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">
          {pageTitles[activeTab] || 'Dashboard'}
        </h2>
        <p className="text-xs font-medium text-textSecondary flex items-center gap-2 mt-0.5">
          <span>Machine Unit:</span> <span className="text-cyanAccent font-bold font-mono">AM-01 (CNC Spindle)</span>
          <span className="text-borderColor">•</span>
          <span>Status:</span> {getConditionBadge()}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Live Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cardBg border border-borderColor text-textSecondary text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyanAccent" />
          <span>{timeStr}</span>
        </div>

        {/* Hero Demo Mode CTA Button */}
        <button
          onClick={demoActive ? stopDemoMode : startDemoMode}
          className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
            demoActive
              ? 'bg-statusAmber text-black hover:bg-statusAmber/90 shadow-glow-amber'
              : 'bg-gradient-to-r from-cyanAccent to-purpleAccent text-black hover:opacity-95 shadow-glow-cyan'
          }`}
        >
          {demoActive ? (
            <>
              <RotateCcw className="w-4 h-4" /> Exit Demo Mode
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Run Demo Mode (90s)
            </>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2.5 rounded-lg bg-cardBg border border-borderColor hover:bg-cardHover text-textSecondary hover:text-textPrimary transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-statusRed text-white text-[10px] font-bold flex items-center justify-center border-2 border-bgSecondary">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-cardBg border border-borderColor rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-borderColor">
                <h4 className="font-bold text-sm text-textPrimary">System Alerts</h4>
                <span className="text-xs text-cyanAccent font-mono">{notifications.length} Active</span>
              </div>
              <div className="py-2 max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-textSecondary py-4 text-center">No recent critical alerts</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border text-xs ${
                        n.condition === 'CRITICAL'
                          ? 'bg-statusRed/10 border-statusRed/30 text-statusRed'
                          : 'bg-statusAmber/10 border-statusAmber/30 text-statusAmber'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{n.condition} ALERT</span>
                        <span className="text-[10px] text-textSecondary font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-textSecondary mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-borderColor">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyanAccent to-purpleAccent flex items-center justify-center font-bold text-black text-sm shadow-glow-cyan">
            OP
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-bold text-textPrimary leading-none">Operator #402</div>
            <div className="text-[10px] text-textSecondary mt-0.5 font-mono">Lead Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
