import React, { useState } from "react";
import { PlanetPosition } from "../types/jyotish";
import { GlossaryTooltip } from "./GlossaryTooltip";

interface PlanetaryTableProps {
  planets: PlanetPosition[];
  ascendant: PlanetPosition;
  isSimpleMode?: boolean;
}

export const PlanetaryTable: React.FC<PlanetaryTableProps> = ({
  planets,
  ascendant,
  isSimpleMode = false,
}) => {
  const allRows = [ascendant, ...planets];
  const [showFullTableInSimple, setShowFullTableInSimple] = useState(false);

  return (
    <div id="planetary-positions-card" className="bg-slate-900 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-amber-200 font-serif">
              Graha Spashta (ग्रह स्पष्ट - Planetary Positions)
            </h3>
            <GlossaryTooltip term="Graha" />
          </div>
          <p className="text-xs text-amber-300/70 mt-0.5">
            Nirayana Sidereal Zodiac (Chitra Paksha / Lahiri Ayanamsha)
          </p>
        </div>

        {isSimpleMode && (
          <button
            onClick={() => setShowFullTableInSimple(!showFullTableInSimple)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            {showFullTableInSimple ? "Hide Detailed Degrees" : "View Full Astronomical Table"}
          </button>
        )}
      </div>

      {/* Simple Beginner Cards Grid (Shown in Simple Mode by Default) */}
      {isSimpleMode && !showFullTableInSimple ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allRows.map((p) => {
            const isAsc = p.name === "Ascendant";
            return (
              <div
                key={p.name}
                className={`p-3 rounded-xl border transition-all ${
                  isAsc
                    ? "bg-amber-950/30 border-amber-600/50 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-amber-900/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-amber-400 font-bold">{p.symbol}</span>
                    <span className="font-semibold text-amber-100 text-sm">{p.name}</span>
                    <span className="text-[11px] text-slate-400">({p.sanskritName.split(" ")[0]})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px] font-bold">
                    House {p.house}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Zodiac Sign</span>
                    <span className="font-medium text-amber-200">{p.rashi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Dignity</span>
                    <span
                      className={`font-medium ${
                        p.dignity === "Exalted"
                          ? "text-emerald-400"
                          : p.dignity === "Debilitated"
                          ? "text-rose-400"
                          : "text-amber-300"
                      }`}
                    >
                      {p.dignitySanskrit}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Star: <strong className="text-slate-300">{p.nakshatra}</strong></span>
                  {p.isRetrograde && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">
                      Vakri (Retrograde)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Full Technical Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-amber-900/40 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Graha (Planet)</span>
                    <GlossaryTooltip term="Graha" />
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Rashi (Sign)</span>
                    <GlossaryTooltip term="Rashi" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Degrees</th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>House</span>
                    <GlossaryTooltip term="Bhavas" />
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Nakshatra & Pada</span>
                    <GlossaryTooltip term="Nakshatra" />
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Dignity (Avastha)</span>
                    <GlossaryTooltip term="Dignity" />
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Navamsha (D9)</span>
                    <GlossaryTooltip term="Navamsha" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>Status</span>
                    <GlossaryTooltip term="Vakri" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/20 text-slate-200">
              {allRows.map((p) => {
                const isAsc = p.name === "Ascendant";
                return (
                  <tr
                    key={p.name}
                    className={`hover:bg-amber-500/5 transition-colors ${
                      isAsc ? "bg-amber-950/20 font-semibold" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base text-amber-400 font-bold w-4 text-center">{p.symbol}</span>
                        <div>
                          <span className="font-semibold text-amber-100 block">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{p.sanskritName.split(" ")[0]}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-medium text-amber-200">{p.rashi}</span>
                      <span className="text-[10px] text-slate-400 block">{p.rashiSanskrit.split(" ")[0]}</span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {p.formattedDegree}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold">
                        H{p.house}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-200">{p.nakshatra}</span>
                      <span className="text-[10px] text-amber-400/80 block">
                        Pada {p.nakshatraPada} • Lord: {p.nakshatraLord}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                          p.dignity === "Exalted"
                            ? "bg-emerald-950/70 text-emerald-300 border border-emerald-700/50"
                            : p.dignity === "Debilitated"
                            ? "bg-rose-950/70 text-rose-300 border border-rose-700/50"
                            : p.dignity === "Own Sign" || p.dignity === "Moolatrikona"
                            ? "bg-blue-950/70 text-blue-300 border border-blue-700/50"
                            : p.dignity === "Friend"
                            ? "bg-slate-800 text-amber-200"
                            : "text-slate-300"
                        }`}
                      >
                        {p.dignitySanskrit}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="text-slate-300 font-medium">{p.navamshaRashi}</span>
                      <span className="text-[10px] text-slate-500 block">H{p.navamshaHouse} in D9</span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {p.isRetrograde && (
                          <span
                            title="Vakri / Retrograde motion"
                            className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold"
                          >
                            R
                          </span>
                        )}
                        {p.isCombust && (
                          <span
                            title="Asta / Combust near Sun"
                            className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold"
                          >
                            *
                          </span>
                        )}
                        {!p.isRetrograde && !p.isCombust && (
                          <span className="text-slate-500 text-[11px]">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
