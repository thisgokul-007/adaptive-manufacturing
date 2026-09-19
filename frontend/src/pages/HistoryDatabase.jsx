import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { Database, Download, Search, Calendar, RefreshCw } from 'lucide-react';

export const HistoryDatabase = () => {
  const { history } = useMachine();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('ALL');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.timestamp?.includes(searchTerm) ||
                          item.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.active_scenario?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `telemetry_history_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">Telemetry History & Database</h2>
          <p className="text-sm text-textSecondary">
            Persistent telemetry logs stored in MongoDB / SQLite dual storage engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportJSON}
            className="px-4 py-2 rounded-lg bg-purpleAccent/10 border border-purpleAccent/30 text-purpleAccent font-bold text-xs flex items-center gap-2 hover:bg-purpleAccent/20"
          >
            <Download className="w-4 h-4" /> Export Database JSON
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="industrial-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-textSecondary absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search logs by timestamp or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bgPrimary border border-borderColor rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-textPrimary focus:outline-none focus:border-cyanAccent"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-textSecondary">
          <Calendar className="w-4 h-4 text-cyanAccent" /> Time Window:
          <button onClick={() => setTimeFilter('ALL')} className={`px-3 py-1 rounded font-bold ${timeFilter === 'ALL' ? 'bg-cyanAccent text-black' : 'bg-cardHover'}`}>
            Last 24 Hours
          </button>
          <button onClick={() => setTimeFilter('HOUR')} className={`px-3 py-1 rounded font-bold ${timeFilter === 'HOUR' ? 'bg-cyanAccent text-black' : 'bg-cardHover'}`}>
            Last Hour
          </button>
        </div>
      </div>

      {/* Telemetry Log Table */}
      <div className="industrial-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-bgSecondary text-textSecondary uppercase border-b border-borderColor">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Temp (°C)</th>
                <th className="px-5 py-3.5">Vibration (mm/s)</th>
                <th className="px-5 py-3.5">Speed (RPM)</th>
                <th className="px-5 py-3.5">Load (%)</th>
                <th className="px-5 py-3.5">Condition</th>
                <th className="px-5 py-3.5">Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/60 text-textPrimary">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-textSecondary">No telemetry records logged.</td>
                </tr>
              ) : (
                filteredHistory.slice().reverse().map((r, idx) => (
                  <tr key={idx} className="hover:bg-cardHover transition-all">
                    <td className="px-5 py-3 text-cyanAccent">{r.timestamp}</td>
                    <td className={`px-5 py-3 font-bold ${r.temperature >= 90 ? 'text-statusRed' : r.temperature >= 75 ? 'text-statusAmber' : 'text-statusGreen'}`}>
                      {r.temperature}°C
                    </td>
                    <td className={`px-5 py-3 font-bold ${r.vibration >= 6.0 ? 'text-statusRed' : r.vibration >= 3.5 ? 'text-statusAmber' : 'text-statusGreen'}`}>
                      {r.vibration} mm/s
                    </td>
                    <td className="px-5 py-3 text-cyanAccent font-bold">{r.rpm} RPM</td>
                    <td className="px-5 py-3">{r.load}%</td>
                    <td className="px-5 py-3 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        r.condition === 'CRITICAL' ? 'bg-statusRed/20 text-statusRed' :
                        r.condition === 'WARNING' ? 'bg-statusAmber/20 text-statusAmber' : 'bg-statusGreen/20 text-statusGreen'
                      }`}>
                        {r.condition}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-textSecondary">{r.active_scenario || 'NORMAL'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
