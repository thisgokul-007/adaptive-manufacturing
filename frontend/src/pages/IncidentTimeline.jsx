import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { History, ShieldAlert, AlertTriangle, CheckCircle2, Sliders, RefreshCw, Filter } from 'lucide-react';

export const IncidentTimeline = () => {
  const { events, fetchTimeline } = useMachine();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredEvents = filterSeverity === 'ALL'
    ? events
    : events.filter(e => e.severity === filterSeverity);

  const getSeverityBadge = (severity) => {
    if (severity === 'CRITICAL') return <span className="px-2.5 py-0.5 rounded bg-statusRed/20 text-statusRed font-bold text-[10px] border border-statusRed/40">CRITICAL</span>;
    if (severity === 'WARNING') return <span className="px-2.5 py-0.5 rounded bg-statusAmber/20 text-statusAmber font-bold text-[10px] border border-statusAmber/40">WARNING</span>;
    if (severity === 'AI_ACTION') return <span className="px-2.5 py-0.5 rounded bg-purpleAccent/20 text-purpleAccent font-bold text-[10px] border border-purpleAccent/40">AI ACTION</span>;
    return <span className="px-2.5 py-0.5 rounded bg-statusGreen/20 text-statusGreen font-bold text-[10px] border border-statusGreen/40">INFO</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">Real-Time Incident Timeline</h2>
          <p className="text-sm text-textSecondary">
            Chronological audit log of machine transitions, AI insights, and adaptive control actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-cardBg border border-borderColor rounded-lg px-3 py-1.5 text-xs text-textSecondary">
            <Filter className="w-3.5 h-3.5 text-cyanAccent" /> Filter:
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-textPrimary font-bold focus:outline-none"
            >
              <option value="ALL">All Events</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="WARNING">Warning Only</option>
              <option value="AI_ACTION">AI Actions Only</option>
              <option value="INFO">Info Only</option>
            </select>
          </div>

          <button
            onClick={fetchTimeline}
            className="p-2 rounded-lg bg-cardBg border border-borderColor hover:bg-cardHover text-textSecondary hover:text-textPrimary"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Feed Container */}
      <div className="industrial-card p-6 border-l-4 border-l-cyanAccent">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-textSecondary text-sm">
            No events match the selected severity filter.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-borderColor space-y-6">
            {filteredEvents.map((evt, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-bgPrimary ${
                  evt.severity === 'CRITICAL' ? 'border-statusRed bg-statusRed' :
                  evt.severity === 'WARNING' ? 'border-statusAmber bg-statusAmber' :
                  evt.severity === 'AI_ACTION' ? 'border-purpleAccent bg-purpleAccent' : 'border-cyanAccent bg-cyanAccent'
                }`} />

                <div className="p-4 rounded-xl bg-cardBg border border-borderColor hover:border-borderColor/80 transition-all space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyanAccent font-bold">{evt.timestamp}</span>
                    {getSeverityBadge(evt.severity)}
                  </div>
                  <h4 className="font-extrabold text-sm text-textPrimary">{evt.event_type}</h4>
                  <p className="text-xs text-textSecondary leading-relaxed">{evt.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
