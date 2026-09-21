import React, { useState, useEffect, useRef } from "react";
import { PlanetKey } from "../types/jyotish";
import { SATTVIK_REMEDIES_DATA } from "../data/vedicData";

interface MantraJapaCounterProps {
  initialPlanet?: PlanetKey;
}

export const MantraJapaCounter: React.FC<MantraJapaCounterProps> = ({
  initialPlanet = "Sun",
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey>(initialPlanet);
  const [count, setCount] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const remedy = SATTVIK_REMEDIES_DATA[selectedPlanet] || SATTVIK_REMEDIES_DATA.Sun;

  // Synthesize Bell Sound via Web Audio API
  const playBell = (isCompletion: boolean = false) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isCompletion) {
        // Grand Temple Gong (Major chord resonance)
        osc.type = "sine";
        osc.frequency.setValueAtTime(432, now); // Sacred 432 Hz
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 3.0);

        // Overtone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(864, now);
        gain2.gain.setValueAtTime(0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 2.5);
      } else {
        // Gentle Mala Bead Click Chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, now); // E5 soothing bell
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.warn("Web Audio chime unavailable", e);
    }
  };

  const handleIncrement = () => {
    const nextCount = count + 1;
    if (nextCount >= 108) {
      setCount(0);
      setRounds((r) => r + 1);
      playBell(true);
    } else {
      setCount(nextCount);
      playBell(false);
    }
  };

  const handleReset = () => {
    setCount(0);
    setRounds(0);
  };

  const progressPercent = Math.round((count / 108) * 100);

  return (
    <div id="mantra-japa-counter-card" className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-amber-400">📿</span>
            <h3 className="text-lg font-semibold text-amber-200 font-serif">
              Mantra Japa Mala (108 जप साधना)
            </h3>
          </div>
          <p className="text-xs text-amber-300/70 mt-0.5">
            Sattvik Japa counter with temple bell chime & Sanskrit Beej Mantras
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <span>{soundEnabled ? "🔔 Chime On" : "🔕 Muted"}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Planet Selector */}
      <div className="mb-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Select Planetary Mantra:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              "Sun",
              "Moon",
              "Mars",
              "Mercury",
              "Jupiter",
              "Venus",
              "Saturn",
              "Rahu",
              "Ketu",
            ] as PlanetKey[]
          ).map((p) => {
            const isSelected = selectedPlanet === p;
            return (
              <button
                key={p}
                onClick={() => {
                  setSelectedPlanet(p);
                  setCount(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md ring-1 ring-amber-300"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-amber-200 border border-slate-700/50"
                }`}
              >
                {p} ({SATTVIK_REMEDIES_DATA[p]?.sanskritName.split(" ")[0]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Mantra Display Box */}
      <div className="bg-slate-950/80 border border-amber-800/50 rounded-xl p-4 text-center mb-6 shadow-inner">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
          {remedy.sanskritName} Beej Mantra
        </span>
        <p className="text-base sm:text-lg font-bold text-amber-100 font-serif my-2 leading-relaxed tracking-wide">
          {remedy.beejMantra.sanskrit}
        </p>
        <p className="text-xs text-amber-300/80 italic font-mono mb-2">
          "{remedy.beejMantra.transliteration}"
        </p>
        <p className="text-[11px] text-slate-400 max-w-lg mx-auto leading-relaxed border-t border-amber-900/20 pt-2">
          {remedy.beejMantra.meaning}
        </p>
        <p className="text-[10px] text-amber-400/70 mt-1">
          Prescribed Time: {remedy.beejMantra.bestTime}
        </p>
      </div>

      {/* Interactive Touch / Click Japa Bead Center */}
      <div className="flex flex-col items-center justify-center mb-6">
        <button
          id="mantra-japa-touch-button"
          onClick={handleIncrement}
          className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-50 p-2 shadow-2xl hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center border-4 border-amber-400/80 focus:outline-none focus:ring-4 focus:ring-amber-400/40 select-none cursor-pointer group"
          aria-label="Tap to count Japa bead"
        >
          {/* Subtle Bead Ring Visual */}
          <div className="absolute inset-2 rounded-full border border-amber-300/30 pointer-events-none" />

          <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight group-hover:text-amber-200">
            {count}
          </span>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-200/90 mt-0.5">
            / 108 Beads
          </span>
          <span className="text-[10px] bg-slate-950/60 px-2.5 py-0.5 rounded-full text-amber-300 mt-2 font-mono">
            Tap anywhere
          </span>
        </button>

        {/* Progress Bar & Stats */}
        <div className="w-full max-w-sm mt-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Current Mala Progress</span>
            <span className="font-mono font-bold text-amber-300">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-center">
            <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] uppercase text-slate-500 block">Mala Rounds Completed</span>
              <span className="text-base font-bold text-amber-300 font-mono">{rounds}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] uppercase text-slate-500 block">Total Japa Count</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {rounds * 108 + count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
