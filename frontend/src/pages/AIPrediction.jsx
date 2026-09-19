import React, { useState } from 'react';
import { fetchApi } from '../utils/api';
import { BrainCircuit, Play, AlertTriangle, ShieldCheck, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const AIPrediction = () => {
  const [opType, setOpType] = useState('High-Speed Drilling');
  const [material, setMaterial] = useState('Stainless Steel 316');
  const [duration, setDuration] = useState(4.0);
  const [rpm, setRpm] = useState(1800);
  const [load, setLoad] = useState(80.0);
  const [ambient, setAmbient] = useState(32.0);

  const [prediction, setPrediction] = useState({
    operation_type: "High-Speed Drilling",
    material: "Stainless Steel 316",
    duration: 4.0,
    rpm: 1800,
    expected_load: 80.0,
    ambient_temp: 32.0,
    predicted_condition: "WARNING",
    risk_probability: 72.0,
    possible_issues: [
      "High centrifugal force and bearing chatter at >1700 RPM",
      "Elevated tool wear rate cutting Stainless Steel 316",
      "Spindle torque saturation & current overload risk",
      "Reduced ambient heat dissipation at 32°C"
    ],
    recommended_action: "Set spindle speed to 1450 RPM (down from 1800 RPM) and maintain load below 70%. Increase coolant flow by 20%.",
    recommended_rpm: 1450,
    expected_result: "Reduces thermal build-up by ~28%, prevents micro-vibration chatter, and extends cutter insert life by 40%."
  });

  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    const data = await fetchApi('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation_type: opType,
        material: material,
        duration: parseFloat(duration),
        rpm: parseInt(rpm),
        expected_load: parseFloat(load),
        ambient_temp: parseFloat(ambient)
      })
    });

    if (data) {
      setPrediction(data);
    } else {
      // Local fallback algorithm
      const hardness = material.includes("Titanium") ? 1.45 : material.includes("Tool Steel") ? 1.35 : 1.2;
      const speedRatio = rpm / 1500.0;
      const risk = Math.min(96, Math.max(10, Math.round((speedRatio * 25.0) * (load / 70.0) * hardness * (1 + (ambient - 25) * 0.02))));
      const cond = risk >= 70 ? "CRITICAL" : risk >= 40 ? "WARNING" : "NORMAL";
      const recRpm = Math.round(rpm * (risk >= 70 ? 0.8 : risk >= 40 ? 0.88 : 1.0));

      setPrediction({
        operation_type: opType,
        material: material,
        duration: duration,
        rpm: rpm,
        expected_load: load,
        ambient_temp: ambient,
        predicted_condition: cond,
        risk_probability: risk,
        possible_issues: [
          `High centrifugal forces cutting ${material} at ${rpm} RPM`,
          `Elevated thermal creep under ${load}% load`
        ],
        recommended_action: `Set spindle speed to ${recRpm} RPM (down from ${rpm} RPM) and maintain load below 70%.`,
        recommended_rpm: recRpm,
        expected_result: `Reduces thermal build-up by ~${Math.round(risk * 0.4)}% and extends cutter insert life.`
      });
    }
    setLoading(false);
  };

  const getCondColor = (cond) => {
    if (cond === 'CRITICAL') return { text: 'text-statusRed', bg: 'bg-statusRed/20', border: 'border-statusRed', stroke: '#EF4444' };
    if (cond === 'WARNING') return { text: 'text-statusAmber', bg: 'bg-statusAmber/20', border: 'border-statusAmber', stroke: '#F59E0B' };
    return { text: 'text-statusGreen', bg: 'bg-statusGreen/20', border: 'border-statusGreen', stroke: '#22C55E' };
  };

  const condStyle = getCondColor(prediction.predicted_condition);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-purpleAccent/20 text-purpleAccent text-xs font-mono font-bold">
            PREDICT BEFORE PRODUCTION
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight mt-1">
          AI Production Risk Forecasting Engine
        </h2>
        <p className="text-sm text-textSecondary">
          Simulate machine health, thermal stress, and failure risk before beginning production job cycles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 industrial-card p-6 border-l-4 border-l-purpleAccent space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-borderColor">
            <div className="w-9 h-9 rounded-xl bg-purpleAccent/20 text-purpleAccent flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-textPrimary">Production Job Parameters</h3>
              <p className="text-xs text-textSecondary">Specify planned machining operation</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-1">
                Operation Type
              </label>
              <select
                value={opType}
                onChange={(e) => setOpType(e.target.value)}
                className="w-full bg-bgPrimary border border-borderColor rounded-lg px-3 py-2 text-sm font-medium text-textPrimary focus:border-purpleAccent focus:outline-none"
              >
                <option>High-Speed Drilling</option>
                <option>Heavy End-Milling</option>
                <option>Deep Hole Boring</option>
                <option>Precision Turning</option>
                <option>Surface Grinding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-1">
                Workpiece Material
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-bgPrimary border border-borderColor rounded-lg px-3 py-2 text-sm font-medium text-textPrimary focus:border-purpleAccent focus:outline-none"
              >
                <option>Stainless Steel 316</option>
                <option>Titanium Grade 5</option>
                <option>Hardened Tool Steel</option>
                <option>Cast Iron</option>
                <option>Aluminum 6061</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-textSecondary">Expected Duration:</span>
                <span className="text-purpleAccent font-bold">{duration} hours</span>
              </div>
              <input
                type="range" min="0.5" max="12.0" step="0.5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full accent-purpleAccent bg-borderColor rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-textSecondary">Planned Speed (RPM):</span>
                <span className="text-cyanAccent font-bold">{rpm} RPM</span>
              </div>
              <input
                type="range" min="800" max="2400" step="50"
                value={rpm}
                onChange={(e) => setRpm(e.target.value)}
                className="w-full accent-cyanAccent bg-borderColor rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-textSecondary">Expected Spindle Load (%):</span>
                <span className="text-statusAmber font-bold">{load}%</span>
              </div>
              <input
                type="range" min="20" max="100" step="5"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className="w-full accent-statusAmber bg-borderColor rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-textSecondary">Ambient Temperature (°C):</span>
                <span className="text-statusRed font-bold">{ambient}°C</span>
              </div>
              <input
                type="range" min="15" max="45" step="1"
                value={ambient}
                onChange={(e) => setAmbient(e.target.value)}
                className="w-full accent-statusRed bg-borderColor rounded-lg h-2"
              />
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purpleAccent to-cyanAccent text-black font-extrabold text-sm hover:opacity-95 shadow-glow-purple flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
              {loading ? 'Evaluating AI Physics Model...' : 'RUN AI PREDICTION'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="industrial-card p-6 bg-gradient-to-br from-cardBg via-bgSecondary to-cardBg">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5 flex flex-col items-center justify-center border-r-0 sm:border-r border-borderColor pr-0 sm:pr-6">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#273340" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="60" cy="60" r="50"
                      stroke={condStyle.stroke}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={314}
                      strokeDashoffset={314 - (314 * (prediction.risk_probability / 100))}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black font-mono text-textPrimary">{prediction.risk_probability}%</span>
                    <span className="text-[10px] text-textSecondary uppercase font-mono font-bold">Failure Risk</span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${condStyle.bg} ${condStyle.text} ${condStyle.border}`}>
                    PREDICTED STATE: {prediction.predicted_condition}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-7 space-y-4">
                <div>
                  <div className="text-xs font-bold text-textSecondary uppercase tracking-wider">PREDICTED OPERATION</div>
                  <div className="text-lg font-extrabold text-textPrimary">{prediction.operation_type} on {prediction.material}</div>
                </div>

                <div>
                  <div className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-1.5">KEY FAILURE VECTORS:</div>
                  <ul className="space-y-1.5 text-xs text-textSecondary">
                    {prediction.possible_issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-statusAmber shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-borderColor space-y-3">
              <div className="p-4 rounded-xl bg-purpleAccent/10 border border-purpleAccent/30">
                <div className="text-xs font-bold text-purpleAccent uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI MITIGATION RECOMMENDATION
                </div>
                <p className="text-sm font-bold text-textPrimary mt-1">
                  {prediction.recommended_action}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyanAccent/10 border border-cyanAccent/30">
                <div className="text-xs font-bold text-cyanAccent uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> EXPECTED RESULT
                </div>
                <p className="text-xs text-textPrimary mt-1">
                  {prediction.expected_result}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
