import React, { useState } from "react";
import { calculateKundali, calculateKundaliMilan } from "../utils/vedicCalculations";
import { AshtakootaResult } from "../types/jyotish";
import { LocationSearchBar } from "./LocationSearchBar";
import { GlossaryTooltip } from "./GlossaryTooltip";

export const KundaliMilanView: React.FC = () => {
  // Groom details
  const [boyName, setBoyName] = useState("Rohit Sharma");
  const [boyDate, setBoyDate] = useState("1995-04-30");
  const [boyTime, setBoyTime] = useState("06:30");
  const [boyLocationName, setBoyLocationName] = useState("New Delhi, India");
  const [boyLat, setBoyLat] = useState(28.6139);
  const [boyLon, setBoyLon] = useState(77.209);
  const [boyTz, setBoyTz] = useState(5.5);

  // Bride details
  const [girlName, setGirlName] = useState("Ritika Sajdeh");
  const [girlDate, setGirlDate] = useState("1997-12-21");
  const [girlTime, setGirlTime] = useState("14:15");
  const [girlLocationName, setGirlLocationName] = useState("Mumbai, Maharashtra, India");
  const [girlLat, setGirlLat] = useState(19.076);
  const [girlLon, setGirlLon] = useState(72.8777);
  const [girlTz, setGirlTz] = useState(5.5);

  const [result, setResult] = useState<AshtakootaResult | null>(() => {
    // Initial compute
    const boyK = calculateKundali({
      name: "Rohit Sharma",
      gender: "Male",
      dateOfBirth: "1995-04-30",
      timeOfBirth: "06:30",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 5.5,
    });
    const girlK = calculateKundali({
      name: "Ritika Sajdeh",
      gender: "Female",
      dateOfBirth: "1997-12-21",
      timeOfBirth: "14:15",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: 5.5,
    });
    return calculateKundaliMilan(boyK, girlK);
  });

  const handleCalculateMilan = (e: React.FormEvent) => {
    e.preventDefault();

    const boyKundali = calculateKundali({
      name: boyName || "Boy",
      gender: "Male",
      dateOfBirth: boyDate,
      timeOfBirth: boyTime,
      latitude: boyLat,
      longitude: boyLon,
      timezone: boyTz,
    });

    const girlKundali = calculateKundali({
      name: girlName || "Girl",
      gender: "Female",
      dateOfBirth: girlDate,
      timeOfBirth: girlTime,
      latitude: girlLat,
      longitude: girlLon,
      timezone: girlTz,
    });

    const milan = calculateKundaliMilan(boyKundali, girlKundali);
    setResult(milan);
  };

  return (
    <div id="kundali-milan-section" className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-950/40 via-slate-900 to-amber-950/40 border border-amber-800/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl text-rose-400">💍</span>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif">
            Ashtakoota Kundali Milan (अष्टकूट 36 गुण मिलान)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Authentic 36-point compatibility matrix matching Moon signs, Nakshatras, Ganas, and Nadis to determine emotional, psychological, and physiological harmony.
        </p>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleCalculateMilan} className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Groom Profile */}
          <div className="bg-slate-950/60 border border-blue-900/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm font-serif">
              <span>🤵</span>
              <h4>Groom's Details (वर विवरण)</h4>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={boyName}
                onChange={(e) => setBoyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Birth Date</label>
                <input
                  type="date"
                  value={boyDate}
                  onChange={(e) => setBoyDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Birth Time</label>
                <input
                  type="time"
                  value={boyTime}
                  onChange={(e) => setBoyTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <LocationSearchBar
              currentLocationName={boyLocationName}
              currentLat={boyLat}
              currentLon={boyLon}
              currentTimezone={boyTz}
              label="Groom's Birth Location (वर का जन्म स्थान)"
              placeholder="Search city/town (e.g. Akola, Delhi, London)..."
              showQuickChips={false}
              onSelectLocation={(loc) => {
                setBoyLocationName(loc.locationName);
                setBoyLat(loc.latitude);
                setBoyLon(loc.longitude);
                setBoyTz(loc.timezone);
              }}
            />
          </div>

          {/* Bride Profile */}
          <div className="bg-slate-950/60 border border-pink-900/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-pink-300 font-bold text-sm font-serif">
              <span>👰</span>
              <h4>Bride's Details (कन्या विवरण)</h4>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Birth Date</label>
                <input
                  type="date"
                  value={girlDate}
                  onChange={(e) => setGirlDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Birth Time</label>
                <input
                  type="time"
                  value={girlTime}
                  onChange={(e) => setGirlTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <LocationSearchBar
              currentLocationName={girlLocationName}
              currentLat={girlLat}
              currentLon={girlLon}
              currentTimezone={girlTz}
              label="Bride's Birth Location (कन्या का जन्म स्थान)"
              placeholder="Search city/town (e.g. Pune, Akola, Jaipur)..."
              showQuickChips={false}
              onSelectLocation={(loc) => {
                setGirlLocationName(loc.locationName);
                setGirlLat(loc.latitude);
                setGirlLon(loc.longitude);
                setGirlTz(loc.timezone);
              }}
            />
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg cursor-pointer"
          >
            Calculate 36 Guna Milan & Compatibility
          </button>
        </div>
      </form>

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Score Header Card */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                Total Ashtakoota Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-bold font-mono text-amber-300">
                  {result.totalScore}
                </span>
                <span className="text-xl text-slate-400 font-mono">/ 36 Gunas</span>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                  result.totalScore >= 28
                    ? "bg-emerald-950/70 text-emerald-300 border border-emerald-700/60"
                    : result.totalScore >= 18
                    ? "bg-amber-950/70 text-amber-300 border border-amber-700/60"
                    : "bg-rose-950/70 text-rose-300 border border-rose-700/60"
                }`}
              >
                Verdict: {result.verdict}
              </span>
            </div>

            <div className="max-w-md bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="text-amber-400 font-bold block mb-1">
                Astrological Summary:
              </span>
              {result.compatibilitySummary}
            </div>
          </div>

          {/* 8 Kootas Table */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl overflow-x-auto">
            <h3 className="text-base font-bold text-amber-200 font-serif mb-3">
              Detailed 8 Koota Score Breakdown (अष्टकूट विवरण)
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-900/30 text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="py-2.5 px-3">Koota</th>
                  <th className="py-2.5 px-3">Signification Domain</th>
                  <th className="py-2.5 px-3">Groom vs Bride</th>
                  <th className="py-2.5 px-3 text-center">Max Gunas</th>
                  <th className="py-2.5 px-3 text-center">Scored</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/20 text-slate-200">
                {result.kootas.map((k) => (
                  <tr key={k.name} className="hover:bg-amber-500/5">
                    <td className="py-3 px-3">
                      <span className="font-bold text-amber-100">{k.name}</span>
                      <span className="text-[10px] text-slate-400 block">{k.sanskritName}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{k.description}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      <span className="text-blue-300">{k.boyAttribute}</span> vs{" "}
                      <span className="text-pink-300">{k.girlAttribute}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                      {k.maxPoints}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-300 text-sm">
                      {k.obtainedPoints}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          k.obtainedPoints === k.maxPoints
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : k.obtainedPoints > 0
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-rose-950 text-rose-300 border border-rose-800"
                        }`}
                      >
                        {k.hasDosha ? "Dosha" : k.obtainedPoints === k.maxPoints ? "Excellent" : k.obtainedPoints > 0 ? "Partial" : "Needs attention"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
