import React from 'react';
import { Settings, Cpu, ShieldCheck, Database, HardDrive, Terminal } from 'lucide-react';

export const SystemSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">System Configuration & Settings</h2>
        <p className="text-sm text-textSecondary">
          Manage Industry 4.0 telemetry thresholds, hardware GPIO pin mappings, and API endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threshold Settings */}
        <div className="lg:col-span-6 industrial-card p-6 border-l-4 border-l-cyanAccent space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-borderColor">
            <div className="w-8 h-8 rounded-lg bg-cyanAccent/20 text-cyanAccent flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-textPrimary">AI Decision Engine Thresholds</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Temperature Warning / Critical Limit:</span>
              <span className="font-mono font-bold text-statusAmber">75.0°C / 90.0°C</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Vibration Warning / Critical Limit:</span>
              <span className="font-mono font-bold text-statusAmber">3.5 mm/s / 6.0 mm/s</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Machine Load Warning / Critical Limit:</span>
              <span className="font-mono font-bold text-statusAmber">75.0% / 90.0%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Closed-Loop Cooldown Step Decay Rate:</span>
              <span className="font-mono font-bold text-cyanAccent">20% per cycle</span>
            </div>
          </div>
        </div>

        {/* Hardware & Database Integration Summary */}
        <div className="lg:col-span-6 industrial-card p-6 border-l-4 border-l-purpleAccent space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-borderColor">
            <div className="w-8 h-8 rounded-lg bg-purpleAccent/20 text-purpleAccent flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-textPrimary">ESP32 Hardware Mappings</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Microcontroller Protocol:</span>
              <span className="font-mono font-bold text-cyanAccent">ESP32 Wi-Fi / HTTP REST</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Primary Database Adapter:</span>
              <span className="font-mono font-bold text-statusGreen">MongoDB (mongodb://localhost:27017)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Fallback Storage Engine:</span>
              <span className="font-mono font-bold text-cyanAccent">Local SQLite3 (adaptive_manufacturing.db)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-bgPrimary border border-borderColor">
              <span className="text-textSecondary">Real-Time Data Stream:</span>
              <span className="font-mono font-bold text-purpleAccent">Server-Sent Events (SSE /api/stream)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
