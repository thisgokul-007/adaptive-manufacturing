import React from 'react';
import { useMachine } from '../context/MachineContext';
import { Sliders, Gauge, CheckCircle2, ArrowRight, RotateCcw, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';

export const AdaptiveControl = () => {
  const { telemetry, applyAdaptiveControl, setScenario } = useMachine();

  const currentRpm = telemetry.rpm || 1500;
  const recommendedRpm = telemetry.recommended_rpm || 1200;
  const adjustmentPct = telemetry.adjustment_pct || 0.0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyanAccent/20 text-cyanAccent text-xs font-mono font-bold">
            CLOSED-LOOP ADAPTIVE SYSTEM
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight mt-1">
          Autonomous Adaptive Speed Control
        </h2>
        <p className="text-sm text-textSecondary">
          Real-time closed-loop feedback attenuating spindle speed to stabilize machine health and thermal expansion
        </p>
      </div>

      {/* Main Grid: Control Panel + Closed-Loop Cycle Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: RPM Control & Apply Panel */}
        <div className="lg:col-span-6 industrial-card p-6 border-l-4 border-l-cyanAccent space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-borderColor">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyanAccent/20 text-cyanAccent flex items-center justify-center font-bold shadow-glow-cyan">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-textPrimary">Spindle Speed Attenuator</h3>
                <p className="text-xs text-textSecondary">Closed-Loop Adjustment Engine</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/30 font-mono">
              CLOSED-LOOP ACTIVE
            </span>
          </div>

          {/* RPM Comparison Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-bgPrimary border border-borderColor text-center">
              <div className="text-[10px] text-textSecondary uppercase font-mono">Current Speed</div>
              <div className="text-2xl font-black font-mono text-textPrimary mt-1">{currentRpm}</div>
              <div className="text-[11px] text-textSecondary font-mono">RPM</div>
            </div>

            <div className="p-4 rounded-xl bg-cardHover border border-purpleAccent/40 text-center shadow-glow-purple">
              <div className="text-[10px] text-purpleAccent uppercase font-mono font-bold">Recommended</div>
              <div className="text-2xl font-black font-mono text-purpleAccent mt-1">{recommendedRpm}</div>
              <div className="text-[11px] text-purpleAccent font-mono">RPM</div>
            </div>

            <div className="p-4 rounded-xl bg-bgPrimary border border-borderColor text-center">
              <div className="text-[10px] text-textSecondary uppercase font-mono">Adjustment</div>
              <div className={`text-2xl font-black font-mono mt-1 ${adjustmentPct < 0 ? 'text-statusAmber' : 'text-statusGreen'}`}>
                {adjustmentPct}%
              </div>
              <div className="text-[11px] text-textSecondary font-mono">Delta</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => applyAdaptiveControl(recommendedRpm)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyanAccent via-purpleAccent to-cyanAccent text-black font-black text-base hover:opacity-95 shadow-glow-cyan flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5 fill-current" /> APPLY ADAPTIVE RECOMMENDATION ({recommendedRpm} RPM)
            </button>

            <button
              onClick={() => setScenario('NORMAL')}
              className="w-full py-3 rounded-xl bg-cardBg border border-borderColor text-textSecondary hover:text-textPrimary font-bold text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Machine to Baseline (1500 RPM)
            </button>
          </div>

          {/* AI Reasoning Summary */}
          <div className="p-4 rounded-xl bg-cardHover border border-borderColor text-xs space-y-1">
            <div className="font-bold text-textPrimary uppercase">AI CLOSED-LOOP STATUS:</div>
            <p className="text-textSecondary leading-relaxed">{telemetry.ai_insight}</p>
          </div>
        </div>

        {/* Right Column: Closed-Loop System Architecture Cycle */}
        <div className="lg:col-span-6 space-y-6">
          {/* Closed-Loop Cycle Card */}
          <div className="industrial-card p-6 border-t-4 border-t-purpleAccent">
            <h3 className="font-extrabold text-base text-textPrimary mb-1">
              CLOSED-LOOP FEEDBACK CYCLE
            </h3>
            <p className="text-xs text-textSecondary mb-6">
              Continuous autonomous cycle maintaining physical machine equilibrium
            </p>

            {/* Step-by-Step Flow Visual */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-bgPrimary border border-borderColor flex items-center justify-between">
                <span className="text-cyanAccent font-bold">1. SENSORS:</span>
                <span className="text-textPrimary">Temp ({telemetry.temperature}°C), Vib ({telemetry.vibration} mm/s)</span>
              </div>
              <div className="text-center text-borderColor">↓</div>

              <div className="p-3 rounded-xl bg-bgPrimary border border-borderColor flex items-center justify-between">
                <span className="text-purpleAccent font-bold">2. AI ANALYSIS:</span>
                <span className="text-textPrimary">Condition: {telemetry.condition}</span>
              </div>
              <div className="text-center text-borderColor">↓</div>

              <div className="p-3 rounded-xl bg-bgPrimary border border-borderColor flex items-center justify-between">
                <span className="text-statusAmber font-bold">3. ADAPTIVE DECISION:</span>
                <span className="text-textPrimary">Recommend {recommendedRpm} RPM ({adjustmentPct}%)</span>
              </div>
              <div className="text-center text-borderColor">↓</div>

              <div className="p-3 rounded-xl bg-bgPrimary border border-borderColor flex items-center justify-between">
                <span className="text-statusGreen font-bold">4. MACHINE ADJUSTMENT:</span>
                <span className="text-textPrimary">Drive Inverter target set to {recommendedRpm} RPM</span>
              </div>
              <div className="text-center text-borderColor">↓</div>

              <div className="p-3 rounded-xl bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-between text-cyanAccent font-bold">
                <span>5. THERMAL RECOVERY:</span>
                <span>Dissipates frictional heat → NORMAL</span>
              </div>
            </div>
          </div>

          {/* Thermal Cooldown Curve Step Preview */}
          <div className="industrial-card p-6">
            <h4 className="font-bold text-sm text-textPrimary mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-statusGreen" /> Physical Cooldown & Recovery Simulation
            </h4>
            <div className="flex items-center justify-between bg-bgPrimary p-4 rounded-xl border border-borderColor font-mono text-xs text-textSecondary">
              <span className="text-statusRed font-bold">91°C (CRITICAL)</span>
              <span>→</span>
              <span className="text-statusAmber font-bold">84°C (WARNING)</span>
              <span>→</span>
              <span className="text-statusAmber font-bold">78°C</span>
              <span>→</span>
              <span className="text-statusGreen font-bold">72°C (NORMAL)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
