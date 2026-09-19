import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  Wrench,
  BrainCircuit, 
  Sliders, 
  FlaskConical, 
  History, 
  Database, 
  Settings,
  ShieldCheck,
  Radio
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'workbench', label: 'Hardware Workbench', icon: Wrench },
  { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'esp32', label: 'Virtual ESP32', icon: Cpu },
  { id: 'prediction', label: 'AI Prediction', icon: BrainCircuit },
  { id: 'adaptive', label: 'Adaptive Control', icon: Sliders },
  { id: 'simulation', label: 'Simulation Lab', icon: FlaskConical },
  { id: 'timeline', label: 'Incident Timeline', icon: History },
  { id: 'database', label: 'History & Database', icon: Database },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-bgSecondary border-r border-borderColor flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        <div className="p-5 border-b border-borderColor flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyanAccent/10 border border-cyanAccent/40 flex items-center justify-center text-cyanAccent shadow-glow-cyan">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-textPrimary tracking-tight leading-none">
              ADAPTIVE<span className="text-cyanAccent">.AI</span>
            </h1>
            <p className="text-[11px] font-semibold text-textSecondary uppercase tracking-widest mt-1">
              Smart Manufacturing
            </p>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyanAccent/15 text-cyanAccent border border-cyanAccent/30 font-semibold shadow-glow-cyan'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-cardHover border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyanAccent' : 'text-textSecondary'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-borderColor bg-cardBg/50">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-statusGreen/10 border border-statusGreen/30">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-statusGreen opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-statusGreen"></span>
          </div>
          <div>
            <div className="text-xs font-bold text-statusGreen uppercase tracking-wider flex items-center gap-1">
              SYSTEM ONLINE <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] text-textSecondary font-medium">All systems operational</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
