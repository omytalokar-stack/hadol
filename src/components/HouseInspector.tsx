import React from "react";
import { BhavaData, PlanetPosition } from "../types/jyotish";
import { GlossaryTooltip } from "./GlossaryTooltip";

interface HouseInspectorProps {
  house: BhavaData;
  allPlanets: PlanetPosition[];
}

export const HouseInspector: React.FC<HouseInspectorProps> = ({ house, allPlanets }) => {
  return (
    <div id="house-inspector-card" className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        {/* House Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                House {house.houseNumber}
              </span>
              <h4 className="text-base font-semibold text-amber-100 font-serif">
                {house.sanskritName}
              </h4>
              <GlossaryTooltip term={house.houseNumber === 1 ? "Lagna" : "Bhavas"} />
            </div>
            <p className="text-xs text-amber-300/80 mt-0.5">{house.meaning}</p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-amber-300/90">{house.rashiSanskrit}</span>
            <span className="text-[11px] text-slate-400">Lord: {house.lord}</span>
          </div>
        </div>

        {/* Badges: Kendra / Trikona / Dusthana */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {house.isKendra && (
            <div className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 font-medium">
                Kendra (केन्द्र स्तम्भ)
              </span>
              <GlossaryTooltip term="Kendra" />
            </div>
          )}
          {house.isTrikona && (
            <div className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 font-medium">
                Trikona (त्रिकोण लक्ष्मी स्थान)
              </span>
              <GlossaryTooltip term="Trikona" />
            </div>
          )}
          {house.isDusthana && (
            <div className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-900/50 text-rose-300 border border-rose-700/50 font-medium">
                Dusthana (त्रिक स्थान)
              </span>
              <GlossaryTooltip term="Dusthana" />
            </div>
          )}
          {house.isUpachaya && (
            <div className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/50 font-medium">
                Upachaya (वृद्धि स्थान)
              </span>
            </div>
          )}
        </div>

        {/* Resident Planets */}
        <div className="mt-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Resident Grahas ({house.planets.length})
          </h5>
          {house.planets.length === 0 ? (
            <p className="text-xs text-slate-500 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              No planets sitting directly in this house. House results are governed by lord ({house.lord}) and aspecting planets.
            </p>
          ) : (
            <div className="space-y-2">
              {house.planets.map((p) => (
                <div
                  key={p.name}
                  className="bg-slate-950/60 border border-amber-900/30 rounded-lg p-2.5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">{p.symbol}</span>
                      <span className="text-xs font-bold text-amber-100">{p.sanskritName}</span>
                      {p.isRetrograde && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Retrograde (वक्री)
                        </span>
                      )}
                      {p.isCombust && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                          Combust (अस्त)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {p.formattedDegree} • {p.nakshatra} (Pada {p.nakshatraPada})
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold block ${
                        p.dignity === "Exalted"
                          ? "text-emerald-400"
                          : p.dignity === "Debilitated"
                          ? "text-rose-400"
                          : p.dignity === "Own Sign" || p.dignity === "Moolatrikona"
                          ? "text-blue-400"
                          : "text-amber-200"
                      }`}
                    >
                      {p.dignitySanskrit}
                    </span>
                    <span className="text-[10px] text-slate-500">Navamsha: {p.navamshaRashi}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aspecting Grahas (Drishti) */}
        <div className="mt-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Aspecting Grahas (दृष्टि)
          </h5>
          {house.aspectingPlanets.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No direct planetary aspects on this house.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {house.aspectingPlanets.map((asp, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-950/70 border border-slate-800 text-xs text-amber-300/90 font-medium"
                >
                  {asp.planet} ({asp.aspectType})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Core Significations */}
        <div className="mt-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Key Parashari Significations (कारकत्व)
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {house.significations.map((sig, sIdx) => (
              <span
                key={sIdx}
                className="text-[11px] px-2 py-0.5 bg-amber-950/30 text-amber-200/90 rounded border border-amber-800/30"
              >
                {sig}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
