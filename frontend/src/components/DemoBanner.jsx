import React from 'react';
import { Play, Pause, SkipForward, SkipBack, XCircle, Sparkles } from 'lucide-react';
import { useMachine } from '../context/MachineContext';

export const DemoBanner = () => {
  const { 
    demoActive, 
    demoStep, 
    demoPlaying, 
    demoSteps, 
    togglePauseDemo, 
    stopDemoMode, 
    executeDemoStep 
  } = useMachine();

  if (!demoActive) return null;

  const currentStepObj = demoSteps.find(s => s.step === demoStep) || demoSteps[0];
  const progressPct = (demoStep / 10) * 100;

  return (
    <div className="bg-gradient-to-r from-cardBg via-bgSecondary to-cardBg border-b-2 border-cyanAccent px-8 py-3.5 shadow-2xl relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Step Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyanAccent/20 border border-cyanAccent flex items-center justify-center text-cyanAccent shadow-glow-cyan">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded bg-cyanAccent text-black text-xs font-extrabold uppercase font-mono tracking-wider">
                DEMO STEP {demoStep} / 10
              </span>
              <h4 className="font-extrabold text-base text-textPrimary tracking-tight">
                {currentStepObj.title}
              </h4>
            </div>
            <p className="text-xs text-textSecondary mt-0.5">
              {currentStepObj.desc}
            </p>
          </div>
        </div>

        {/* Right: Step Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => executeDemoStep(Math.max(1, demoStep - 1))}
            disabled={demoStep === 1}
            className="p-2 rounded-lg bg-cardBg border border-borderColor hover:bg-cardHover disabled:opacity-40 text-textSecondary"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePauseDemo}
            className="px-3.5 py-1.5 rounded-lg bg-cyanAccent/20 border border-cyanAccent text-cyanAccent font-bold text-xs flex items-center gap-2 hover:bg-cyanAccent/30"
          >
            {demoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Auto-Advance
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Resume Demo
              </>
            )}
          </button>

          <button
            onClick={() => executeDemoStep(Math.min(10, demoStep + 1))}
            disabled={demoStep === 10}
            className="p-2 rounded-lg bg-cardBg border border-borderColor hover:bg-cardHover disabled:opacity-40 text-textSecondary"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={stopDemoMode}
            className="p-2 rounded-lg bg-statusRed/10 border border-statusRed/30 text-statusRed hover:bg-statusRed/20 ml-2"
            title="Exit Demo Mode"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated Step Progress Bar */}
      <div className="w-full bg-borderColor/40 h-1 mt-3 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-cyanAccent via-purpleAccent to-cyanAccent h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
};
