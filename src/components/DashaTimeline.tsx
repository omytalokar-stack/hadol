import React, { useState } from "react";
import { DashaPeriod } from "../types/jyotish";
import { GlossaryTooltip } from "./GlossaryTooltip";

interface DashaTimelineProps {
  allDashas: DashaPeriod[];
  currentDasha: {
    mahadasha: DashaPeriod;
    antardasha: DashaPeriod;
  };
}

export const DashaTimeline: React.FC<DashaTimelineProps> = ({
  allDashas,
  currentDasha,
}) => {
  const [expandedMaha, setExpandedMaha] = useState<string | null>(
    currentDasha.mahadasha.planet
  );

  return (
    <div id="vimshottari-dasha-card" className="bg-slate-900 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-amber-200 font-serif">
              Vimshottari Dasha Chakra (विंशोत्तरी दशा)
            </h3>
            <GlossaryTooltip term="Dasha" />
            <GlossaryTooltip term="Mahadasha" />
            <GlossaryTooltip term="Antardasha" />
          </div>
          <p className="text-xs text-amber-300/70 mt-0.5">
            120-Year Parashari planetary period progression from birth Nakshatra
          </p>
        </div>

        {/* Current Period Highlight Pill */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <span className="text-slate-400">Current Phase: </span>
            <span className="font-bold text-amber-200">
              {currentDasha.mahadasha.planet} / {currentDasha.antardasha.planet}
            </span>
            <span className="text-[11px] text-amber-300/70 block">
              Until {currentDasha.antardasha.endDate}
            </span>
          </div>
        </div>
      </div>

      {/* Mahadasha Horizontal Bar Track */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Lifespan Mahadasha Timeline
        </h4>
        <div className="w-full flex h-8 rounded-lg overflow-hidden border border-amber-900/40 bg-slate-950 p-0.5 gap-0.5">
          {allDashas.map((maha) => {
            const isSelected = expandedMaha === maha.planet;
            const isCurrent = maha.isCurrent;
            return (
              <button
                key={maha.planet}
                onClick={() => setExpandedMaha(maha.planet)}
                style={{ flex: maha.durationYears }}
                title={`${maha.planet} Mahadasha (${maha.startDate} to ${maha.endDate}, Age: ${maha.startAge}-${maha.endAge})`}
                className={`h-full relative transition-all text-[10px] font-bold truncate px-1 flex items-center justify-center rounded-sm ${
                  isCurrent
                    ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 z-10"
                    : isSelected
                    ? "bg-amber-700/80 text-amber-100"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span className="truncate">{maha.planet.substring(0, 3)}</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>Birth (Age 0)</span>
          <span>Age 60</span>
          <span>Age 120</span>
        </div>
      </div>

      {/* Detailed Accordion for Selected Mahadasha and its Antardashas */}
      <div className="space-y-3">
        {allDashas.map((maha) => {
          const isExpanded = expandedMaha === maha.planet;
          const isCurrent = maha.isCurrent;

          return (
            <div
              key={maha.planet}
              className={`border rounded-xl transition-all overflow-hidden ${
                isCurrent
                  ? "border-amber-500/60 bg-amber-950/10"
                  : isExpanded
                  ? "border-amber-900/60 bg-slate-950/40"
                  : "border-slate-800 bg-slate-950/20 hover:border-slate-700"
              }`}
            >
              {/* Mahadasha Header */}
              <button
                onClick={() => setExpandedMaha(isExpanded ? null : maha.planet)}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCurrent
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-amber-200"
                    }`}
                  >
                    {maha.planet.substring(0, 2)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-amber-100 font-serif">
                        {maha.planet} Mahadasha ({maha.sanskritName.split(" ")[0]})
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                          Active Now
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {maha.startDate} → {maha.endDate} • Duration: {maha.durationYears} yrs (Age: {maha.startAge} to {maha.endAge})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <span>{isExpanded ? "Collapse" : "Explore Antardashas"}</span>
                  <span className="text-base">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Antardashas Sub-table */}
              {isExpanded && maha.antardashas && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-amber-900/20 bg-slate-950/60">
                  <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Antardasha (Bhukti) Sub-Periods under {maha.planet}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {maha.antardashas.map((antar) => (
                      <div
                        key={antar.planet}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
                          antar.isCurrent
                            ? "bg-amber-500/20 border-amber-400 text-amber-100 shadow-sm"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-200">
                            {maha.planet} / {antar.planet}
                          </span>
                          {antar.isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {antar.startDate} → {antar.endDate}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Duration: {antar.durationYears} yrs (Age ~{antar.startAge})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
