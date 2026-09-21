import React, { useState } from "react";
import { KundaliData, PlanetPosition, PlanetKey } from "../types/jyotish";
import { RASHIS } from "../data/vedicData";

interface KundaliChartProps {
  kundali: KundaliData;
  onSelectHouse?: (houseNumber: number) => void;
  selectedHouse?: number | null;
  chartType?: "D1" | "D9";
}

export const KundaliChart: React.FC<KundaliChartProps> = ({
  kundali,
  onSelectHouse,
  selectedHouse = 1,
  chartType = "D1",
}) => {
  const [style, setStyle] = useState<"North" | "South">("North");
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetKey | null>(null);

  const isD9 = chartType === "D9";
  const lagnaRashiIndex = kundali.ascendant.rashiIndex;

  // Compute planets per house for D1 or D9
  const getHousePlanets = (houseNum: number): PlanetPosition[] => {
    if (!isD9) {
      return kundali.planets.filter((p) => p.house === houseNum);
    } else {
      // In D9, planets have navamshaHouse
      return kundali.planets.filter((p) => p.navamshaHouse === houseNum);
    }
  };

  // Get Rashi index for house
  const getHouseRashiIndex = (houseNum: number): number => {
    if (!isD9) {
      return (lagnaRashiIndex + houseNum - 1) % 12;
    } else {
      const d9LagnaRashiIdx = RASHIS.findIndex((r) => r.key === kundali.ascendant.navamshaRashi);
      return ((d9LagnaRashiIdx >= 0 ? d9LagnaRashiIdx : 0) + houseNum - 1) % 12;
    }
  };

  // North Indian Diamond Chart coordinates (viewBox 0 0 400 400)
  // 12 houses in North Indian system:
  // House 1: Top diamond (center top)
  // House 2: Top-left triangle
  // House 3: Left-top triangle
  // House 4: Left diamond (center left)
  // House 5: Left-bottom triangle
  // House 6: Bottom-left triangle
  // House 7: Bottom diamond (center bottom)
  // House 8: Bottom-right triangle
  // House 9: Right-bottom triangle
  // House 10: Right diamond (center right)
  // House 11: Right-top triangle
  // House 12: Top-right triangle

  const northIndianPolygons = [
    { house: 1, points: "200,0 300,100 200,200 100,100", labelPos: { x: 200, y: 70 }, rashiPos: { x: 200, y: 130 } },
    { house: 2, points: "0,0 200,0 100,100", labelPos: { x: 100, y: 40 }, rashiPos: { x: 135, y: 65 } },
    { house: 3, points: "0,0 100,100 0,200", labelPos: { x: 40, y: 100 }, rashiPos: { x: 65, y: 135 } },
    { house: 4, points: "0,200 100,100 200,200 100,300", labelPos: { x: 70, y: 200 }, rashiPos: { x: 130, y: 200 } },
    { house: 5, points: "0,200 100,300 0,400", labelPos: { x: 40, y: 300 }, rashiPos: { x: 65, y: 265 } },
    { house: 6, points: "0,400 100,300 200,400", labelPos: { x: 100, y: 360 }, rashiPos: { x: 135, y: 335 } },
    { house: 7, points: "200,200 300,300 200,400 100,300", labelPos: { x: 200, y: 330 }, rashiPos: { x: 200, y: 270 } },
    { house: 8, points: "200,400 300,300 400,400", labelPos: { x: 300, y: 360 }, rashiPos: { x: 265, y: 335 } },
    { house: 9, points: "300,300 400,200 400,400", labelPos: { x: 360, y: 300 }, rashiPos: { x: 335, y: 265 } },
    { house: 10, points: "200,200 300,100 400,200 300,300", labelPos: { x: 330, y: 200 }, rashiPos: { x: 270, y: 200 } },
    { house: 11, points: "300,100 400,0 400,200", labelPos: { x: 360, y: 100 }, rashiPos: { x: 335, y: 135 } },
    { house: 12, points: "200,0 400,0 300,100", labelPos: { x: 300, y: 40 }, rashiPos: { x: 265, y: 65 } },
  ];

  return (
    <div id="kundali-chart-card" className="bg-slate-900 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background Sacred Geometric Accent */}
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-lg font-semibold text-amber-200 tracking-wide font-serif">
              {isD9 ? "Navamsha Chakra (नवमांश D9)" : "Lagna Kundali (जन्म चक्र D1)"}
            </h3>
          </div>
          <p className="text-xs text-amber-300/70 mt-0.5">
            {isD9
              ? "Soul destiny, inner nature & marital fortune chart"
              : `Ascendant: ${kundali.ascendant.rashi} (${kundali.ascendant.formattedDegree}) • Ayanamsha: Lahiri`}
          </p>
        </div>

        {/* Style toggle */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-amber-900/40 text-xs">
          <button
            id="chart-style-north"
            onClick={() => setStyle("North")}
            className={`px-2.5 py-1 rounded transition-colors ${
              style === "North"
                ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                : "text-amber-300/80 hover:text-amber-100"
            }`}
          >
            North Indian
          </button>
          <button
            id="chart-style-south"
            onClick={() => setStyle("South")}
            className={`px-2.5 py-1 rounded transition-colors ${
              style === "South"
                ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                : "text-amber-300/80 hover:text-amber-100"
            }`}
          >
            South Indian
          </button>
        </div>
      </div>

      {/* Main SVG Render Area */}
      <div className="relative w-full aspect-square max-w-[460px] mx-auto flex items-center justify-center">
        {style === "North" ? (
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-md select-none"
            aria-label="North Indian Kundali Chart"
          >
            <defs>
              <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#d97706" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="houseHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="houseSelected" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect width="400" height="400" fill="#0f172a" stroke="url(#goldBorder)" strokeWidth="2.5" />

            {/* Houses Polygons */}
            {northIndianPolygons.map((poly) => {
              const houseNum = poly.house;
              const rashiIdx = getHouseRashiIndex(houseNum);
              const rashiNum = rashiIdx + 1;
              const housePlanets = getHousePlanets(houseNum);
              const isSelected = selectedHouse === houseNum;
              const isKendra = [1, 4, 7, 10].includes(houseNum);
              const isTrikona = [1, 5, 9].includes(houseNum);

              return (
                <g
                  key={`house-${houseNum}`}
                  id={`house-polygon-${houseNum}`}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => onSelectHouse?.(houseNum)}
                >
                  <polygon
                    points={poly.points}
                    fill={
                      isSelected
                        ? "url(#houseSelected)"
                        : isKendra
                        ? "#1e293b"
                        : "#0f172a"
                    }
                    stroke="url(#goldBorder)"
                    strokeWidth={isSelected ? "2.5" : "1.2"}
                    className="hover:fill-amber-500/20 transition-colors"
                  />

                  {/* Rashi Number in Roman / Decimal */}
                  <text
                    x={poly.rashiPos.x}
                    y={poly.rashiPos.y}
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="opacity-75 font-mono pointer-events-none"
                  >
                    {rashiNum}
                  </text>

                  {/* House Number badge */}
                  <text
                    x={poly.labelPos.x}
                    y={poly.labelPos.y - 14}
                    fill="#94a3b8"
                    fontSize="8"
                    textAnchor="middle"
                    className="font-mono opacity-50 uppercase pointer-events-none"
                  >
                    H{houseNum}
                  </text>

                  {/* Resident Planets Text & Badges */}
                  <g>
                    {housePlanets.map((p, pIdx) => {
                      const yOffset = poly.labelPos.y + pIdx * 13;
                      const isHovered = hoveredPlanet === p.name;
                      let color = "#e2e8f0";
                      if (p.dignity === "Exalted") color = "#34d399"; // emerald
                      else if (p.dignity === "Debilitated") color = "#f87171"; // rose
                      else if (p.dignity === "Own Sign" || p.dignity === "Moolatrikona") color = "#60a5fa"; // blue
                      else if (p.name === "Sun" || p.name === "Jupiter") color = "#fbbf24"; // gold

                      return (
                        <text
                          key={p.name}
                          x={poly.labelPos.x}
                          y={yOffset}
                          fill={color}
                          fontSize="9.5"
                          fontWeight={p.dignity === "Exalted" || isHovered ? "bold" : "600"}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="transition-all pointer-events-auto cursor-pointer"
                          onMouseEnter={() => setHoveredPlanet(p.name)}
                          onMouseLeave={() => setHoveredPlanet(null)}
                        >
                          {p.name === "Ascendant" ? "Asc (लग्न)" : p.name.substring(0, 2)}
                          {p.isRetrograde ? " (R)" : ""}
                          {p.isCombust ? " *" : ""}
                        </text>
                      );
                    })}
                  </g>
                </g>
              );
            })}

            {/* Central Divine Om / Sacred Emblem */}
            <circle cx="200" cy="200" r="14" fill="#0f172a" stroke="#d97706" strokeWidth="1.2" />
            <text
              x="200"
              y="204"
              fill="#fbbf24"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none font-serif"
            >
              ॐ
            </text>
          </svg>
        ) : (
          /* South Indian Chart Layout (Fixed Rashis) */
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 border-2 border-amber-600 bg-slate-950 text-xs font-mono">
            {/* South Indian fixed rashi layout:
                Row 1: Pisces (12), Aries (1), Taurus (2), Gemini (3)
                Row 2: Aquarius (11), [CENTER], [CENTER], Cancer (4)
                Row 3: Capricorn (10), [CENTER], [CENTER], Leo (5)
                Row 4: Sagittarius (9), Scorpio (8), Libra (7), Virgo (6)
            */}
            {[
              { rashiIdx: 11, label: "Pisces (मीन)", rashiNum: 12 },
              { rashiIdx: 0, label: "Aries (मेष)", rashiNum: 1 },
              { rashiIdx: 1, label: "Taurus (वृषभ)", rashiNum: 2 },
              { rashiIdx: 2, label: "Gemini (मिथुन)", rashiNum: 3 },
              { rashiIdx: 10, label: "Aquarius (कुम्भ)", rashiNum: 11 },
              { isCenter: true },
              { isCenter: true },
              { rashiIdx: 3, label: "Cancer (कर्क)", rashiNum: 4 },
              { rashiIdx: 9, label: "Capricorn (मकर)", rashiNum: 10 },
              { isCenter: true },
              { isCenter: true },
              { rashiIdx: 4, label: "Leo (सिंह)", rashiNum: 5 },
              { rashiIdx: 8, label: "Sagittarius (धनु)", rashiNum: 9 },
              { rashiIdx: 7, label: "Scorpio (वृश्चिक)", rashiNum: 8 },
              { rashiIdx: 6, label: "Libra (तुला)", rashiNum: 7 },
              { rashiIdx: 5, label: "Virgo (कन्या)", rashiNum: 6 },
            ].map((cell, idx) => {
              if (cell.isCenter) {
                if (idx === 5) {
                  return (
                    <div
                      key={idx}
                      className="col-span-2 row-span-2 border border-amber-800/40 bg-slate-900/90 flex flex-col items-center justify-center p-3 text-center"
                    >
                      <span className="text-2xl text-amber-400 font-serif mb-1">ॐ</span>
                      <p className="text-amber-200 font-serif font-semibold text-xs">
                        {isD9 ? "Navamsha D9" : "Lagna D1"}
                      </p>
                      <p className="text-[10px] text-amber-300/60 mt-0.5">South Indian Rashi Chakra</p>
                    </div>
                  );
                }
                return null; // Covered by col-span-2 row-span-2
              }

              const rIdx = cell.rashiIdx!;
              // Find house number for this rashi in D1 / D9
              const houseNum = ((rIdx - lagnaRashiIndex + 12) % 12) + 1;
              const isSelected = selectedHouse === houseNum;
              const cellPlanets = kundali.planets.filter((p) =>
                !isD9 ? p.rashiIndex === rIdx : RASHIS.findIndex((r) => r.key === p.navamshaRashi) === rIdx
              );

              return (
                <div
                  key={idx}
                  onClick={() => onSelectHouse?.(houseNum)}
                  className={`border border-amber-800/40 p-1.5 flex flex-col justify-between cursor-pointer transition-colors ${
                    isSelected ? "bg-amber-500/20 border-amber-400" : "hover:bg-amber-500/10 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-amber-400/80 font-bold">{cell.rashiNum}</span>
                    <span className="text-slate-400 text-[8px]">H{houseNum}</span>
                  </div>

                  <div className="flex flex-col gap-0.5 my-auto text-[9.5px]">
                    {cellPlanets.map((p) => (
                      <span
                        key={p.name}
                        className={`font-semibold ${
                          p.dignity === "Exalted"
                            ? "text-emerald-400"
                            : p.dignity === "Debilitated"
                            ? "text-rose-400"
                            : "text-amber-100"
                        }`}
                      >
                        {p.name === "Ascendant" ? "Asc" : p.name.substring(0, 2)}
                        {p.isRetrograde ? " (R)" : ""}
                      </span>
                    ))}
                  </div>

                  <span className="text-[8px] text-slate-500 truncate">{cell.label?.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend & Quick Info */}
      <div className="mt-4 pt-3 border-t border-amber-900/30 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Exalted (उच्च)
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Own Sign (स्वक्षेत्र)
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Debilitated (नीच)
          </span>
          <span className="flex items-center gap-1 text-[11px] text-amber-300">
            <span className="text-amber-400 font-bold">(R)</span> Retrograde
          </span>
        </div>
        <p className="text-[11px] text-amber-400/70 italic">Click any house to inspect Bhavaphala</p>
      </div>
    </div>
  );
};
