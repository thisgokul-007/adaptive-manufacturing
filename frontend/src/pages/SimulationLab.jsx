import React, { useState, useEffect } from 'react';
import { useMachine } from '../context/MachineContext';
import { DigitalTwin } from '../components/DigitalTwin';
import { FlaskConical, Play, Sliders, ArrowRight, TrendingDown, Sparkles, AlertTriangle } from 'lucide-react';

export const SimulationLab = () => {
  const { setScenario } = useMachine();

  // Scenario A (Baseline)
  const [tempA, setTempA] = useState(88.0);
  const [vibA, setVibA] = useState(5.4);
  const [rpmA, setRpmA] = useState(1800);
  const [loadA, setLoadA] = useState(88.0);
  const [durA, setDurA] = useState(4.0);
  const [riskA, setRiskA] = useState(74.0);

  // Scenario B (Adjusted)
  const [tempB, setTempB] = useState(72.0);
  const [vibB, setVibB] = useState(2.2);
  const [rpmB, setRpmB] = useState(1350);
  const [loadB, setLoadB] = useState(62.0);
  const [durB, setDurB] = useState(4.0);
  const [riskB, setRiskB] = useState(28.0);

  useEffect(() => {
    calculateWhatIf();
  }, [tempA, vibA, rpmA, loadA, durA, tempB, vibB, rpmB, loadB, durB]);

  const calculateWhatIf = async () => {
    try {
      const resA = await fetch('/api/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature: tempA, vibration: vibA, rpm: rpmA, load: loadA, duration: durA })
      });
      if (resA.ok) {
        const dataA = await resA.json();
        setRiskA(dataA.risk_probability);
      }

      const resB = await fetch('/api/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature: tempB, vibration: vibB, rpm: rpmB, load: loadB, duration: durB })
      });
      if (resB.ok) {
        const dataB = await resB.json();
        setRiskB(dataB.risk_probability);
      }
    } catch (err) {
      console.error("What-if calculation error", err);
    }
  };

  const riskReducedPct = Math.max(0, roundOne(riskA - riskB));

  function roundOne(num) {
    return Math.round(num * 10) / 10;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyanAccent/20 text-cyanAccent text-xs font-mono font-bold">
            EXPERIMENTAL SIMULATION LAB
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight mt-1">
          What-If Scenario Simulation Matrix
        </h2>
        <p className="text-sm text-textSecondary">
          Interactively test operational parameters and compare risk probability reduction side-by-side
        </p>
      </div>

      {/* Preset Quick Scenario Cards */}
      <div className="industrial-card p-6 border-l-4 border-l-cyanAccent">
        <h3 className="font-extrabold text-base text-textPrimary mb-3 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-cyanAccent" /> PRESET SIMULATION RUNNERS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setScenario('NORMAL')}
            className="p-3 rounded-xl bg-cardBg border border-statusGreen/30 hover:bg-statusGreen/10 text-left transition-all"
          >
            <div className="text-xs font-bold text-statusGreen">NORMAL RUN</div>
            <div className="text-[11px] text-textSecondary font-mono mt-0.5">72°C | 1500 RPM</div>
          </button>

          <button
            onClick={() => setScenario('HIGH_LOAD')}
            className="p-3 rounded-xl bg-cardBg border border-statusAmber/30 hover:bg-statusAmber/10 text-left transition-all"
          >
            <div className="text-xs font-bold text-statusAmber">HIGH LOAD</div>
            <div className="text-[11px] text-textSecondary font-mono mt-0.5">79°C | 88% Load</div>
          </button>

          <button
            onClick={() => setScenario('OVERHEATING')}
            className="p-3 rounded-xl bg-cardBg border border-statusRed/30 hover:bg-statusRed/10 text-left transition-all"
          >
            <div className="text-xs font-bold text-statusRed">OVERHEATING</div>
            <div className="text-[11px] text-textSecondary font-mono mt-0.5">93.5°C | Thermal</div>
          </button>

          <button
            onClick={() => setScenario('HIGH_VIBRATION')}
            className="p-3 rounded-xl bg-cardBg border border-statusAmber/30 hover:bg-statusAmber/10 text-left transition-all"
          >
            <div className="text-xs font-bold text-statusAmber">VIBRATION SPIKE</div>
            <div className="text-[11px] text-textSecondary font-mono mt-0.5">6.8 mm/s Chatter</div>
          </button>

          <button
            onClick={() => setScenario('CRITICAL')}
            className="p-3 rounded-xl bg-cardBg border border-statusRed/30 hover:bg-statusRed/10 text-left transition-all"
          >
            <div className="text-xs font-bold text-statusRed">CRITICAL FAILURE</div>
            <div className="text-[11px] text-textSecondary font-mono mt-0.5">Multi-Vector Overload</div>
          </button>
        </div>
      </div>

      {/* Main Feature: WHAT-IF COMPARISON MATRIX */}
      <div className="industrial-card p-6 bg-gradient-to-r from-cardBg via-bgSecondary to-cardBg border-t-4 border-t-purpleAccent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-borderColor gap-4">
          <div>
            <span className="text-xs font-bold text-purpleAccent uppercase tracking-wider">HACKATHON DEMO SHOWCASE</span>
            <h3 className="text-xl font-extrabold text-textPrimary">WHAT-IF SCENARIO COMPARISON MATRIX</h3>
          </div>

          {/* Animated Risk Delta Badge */}
          <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-statusRed/20 via-statusAmber/20 to-statusGreen/20 border border-statusGreen/40 shadow-glow-green text-center">
            <div className="text-[10px] text-textSecondary uppercase font-mono font-bold">FAILURE RISK REDUCTION</div>
            <div className="text-2xl font-black font-mono text-statusGreen flex items-center justify-center gap-2">
              <TrendingDown className="w-6 h-6 text-statusGreen" /> {riskA}% → {riskB}% ({riskReducedPct}% REDUCED)
            </div>
          </div>
        </div>

        {/* Side-by-Side Slider Slates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Scenario A: Baseline High Risk */}
          <div className="p-5 rounded-2xl bg-bgPrimary border border-statusRed/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-borderColor">
              <h4 className="font-extrabold text-base text-statusRed">Scenario A (High Stress Baseline)</h4>
              <span className="text-lg font-mono font-black text-statusRed">{riskA}% Risk</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Temperature:</span>
                  <span className="text-textPrimary font-bold">{tempA}°C</span>
                </div>
                <input type="range" min="30" max="110" value={tempA} onChange={(e) => setTempA(parseFloat(e.target.value))} className="w-full accent-statusRed bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Vibration:</span>
                  <span className="text-textPrimary font-bold">{vibA} mm/s</span>
                </div>
                <input type="range" min="0.5" max="10.0" step="0.1" value={vibA} onChange={(e) => setVibA(parseFloat(e.target.value))} className="w-full accent-statusRed bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Spindle Speed:</span>
                  <span className="text-textPrimary font-bold">{rpmA} RPM</span>
                </div>
                <input type="range" min="800" max="2400" step="50" value={rpmA} onChange={(e) => setRpmA(parseInt(e.target.value))} className="w-full accent-statusRed bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Machine Load:</span>
                  <span className="text-textPrimary font-bold">{loadA}%</span>
                </div>
                <input type="range" min="20" max="100" value={loadA} onChange={(e) => setLoadA(parseFloat(e.target.value))} className="w-full accent-statusRed bg-borderColor rounded h-1.5" />
              </div>
            </div>
          </div>

          {/* Scenario B: AI Optimized */}
          <div className="p-5 rounded-2xl bg-bgPrimary border border-statusGreen/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-borderColor">
              <h4 className="font-extrabold text-base text-statusGreen">Scenario B (AI Adapted Target)</h4>
              <span className="text-lg font-mono font-black text-statusGreen">{riskB}% Risk</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Temperature:</span>
                  <span className="text-textPrimary font-bold">{tempB}°C</span>
                </div>
                <input type="range" min="30" max="110" value={tempB} onChange={(e) => setTempB(parseFloat(e.target.value))} className="w-full accent-statusGreen bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Vibration:</span>
                  <span className="text-textPrimary font-bold">{vibB} mm/s</span>
                </div>
                <input type="range" min="0.5" max="10.0" step="0.1" value={vibB} onChange={(e) => setVibB(parseFloat(e.target.value))} className="w-full accent-statusGreen bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Spindle Speed:</span>
                  <span className="text-textPrimary font-bold">{rpmB} RPM</span>
                </div>
                <input type="range" min="800" max="2400" step="50" value={rpmB} onChange={(e) => setRpmB(parseInt(e.target.value))} className="w-full accent-statusGreen bg-borderColor rounded h-1.5" />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-textSecondary">Machine Load:</span>
                  <span className="text-textPrimary font-bold">{loadB}%</span>
                </div>
                <input type="range" min="20" max="100" value={loadB} onChange={(e) => setLoadB(parseFloat(e.target.value))} className="w-full accent-statusGreen bg-borderColor rounded h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Machine Twin Visual */}
      <DigitalTwin compact={true} />
    </div>
  );
};
