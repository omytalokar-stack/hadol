import React, { useState } from "react";
import { calculatePanchang } from "../utils/vedicCalculations";
import { CHOGHADIYA_ORDER_DAY, CHOGHADIYA_NATURE } from "../data/vedicData";

export const DailyPanchangView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [latitude, setLatitude] = useState<number>(28.6139); // New Delhi default
  const [longitude, setLongitude] = useState<number>(77.209);

  const dateObj = new Date(selectedDate + "T12:00:00Z");
  const panchang = calculatePanchang(dateObj, latitude, longitude);

  return (
    <div id="daily-panchang-view" className="space-y-6">
      {/* Header & Date / Location Selector */}
      <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-amber-400">🌞</span>
            <h3 className="text-xl font-bold text-amber-100 font-serif">
              Dainik Panchang (दैनिक पञ्चाङ्ग)
            </h3>
          </div>
          <p className="text-xs text-amber-300/70 mt-0.5">
            5 Limbs of Vedic Timekeeping: Tithi, Vara, Nakshatra, Yoga, and Karana
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <label className="text-slate-400">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-amber-200 font-mono focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <label className="text-slate-400">City Preset:</label>
            <select
              onChange={(e) => {
                const [lat, lon] = e.target.value.split(",").map(Number);
                setLatitude(lat);
                setLongitude(lon);
              }}
              className="bg-transparent text-amber-200 focus:outline-none cursor-pointer"
            >
              <option value="28.6139,77.2090">New Delhi (28°N, 77°E)</option>
              <option value="19.0760,72.8777">Mumbai (19°N, 72°E)</option>
              <option value="25.3176,82.9739">Varanasi (Kashi)</option>
              <option value="12.9716,77.5946">Bengaluru</option>
              <option value="51.5074,-0.1278">London (UK)</option>
              <option value="40.7128,-74.0060">New York (USA)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5 Angas Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Tithi */}
        <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            1. Tithi (तिथि)
          </span>
          <div className="my-2">
            <h4 className="text-base font-bold text-amber-100 font-serif">
              {panchang.tithi.name}
            </h4>
            <span className="text-xs text-slate-300 block">
              {panchang.tithi.paksha} Paksha
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Tithi #{panchang.tithi.number}
          </span>
        </div>

        {/* 2. Vara */}
        <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            2. Vara (वार)
          </span>
          <div className="my-2">
            <h4 className="text-base font-bold text-amber-100 font-serif">
              {panchang.vara.sanskritName}
            </h4>
            <span className="text-xs text-slate-300 block">
              {panchang.vara.name}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Lord: {panchang.vara.rulingPlanet}
          </span>
        </div>

        {/* 3. Nakshatra */}
        <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            3. Nakshatra (नक्षत्र)
          </span>
          <div className="my-2">
            <h4 className="text-base font-bold text-amber-100 font-serif">
              {panchang.nakshatra.name}
            </h4>
            <span className="text-xs text-slate-300 block">
              Pada {panchang.nakshatra.pada}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Lord: {panchang.nakshatra.lord}
          </span>
        </div>

        {/* 4. Yoga */}
        <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            4. Nitya Yoga (योग)
          </span>
          <div className="my-2">
            <h4 className="text-base font-bold text-amber-100 font-serif">
              {panchang.yoga.name}
            </h4>
            <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full inline-block mt-0.5 bg-emerald-900/50 text-emerald-300">
              Auspicious Union
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Meaning: {panchang.yoga.meaning}
          </span>
        </div>

        {/* 5. Karana */}
        <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            5. Karana (करण)
          </span>
          <div className="my-2">
            <h4 className="text-base font-bold text-amber-100 font-serif">
              {panchang.karana.name}
            </h4>
            <span className="text-xs text-slate-300 block">
              Half-Tithi Division
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Lord: {panchang.karana.lord}
          </span>
        </div>
      </div>

      {/* Muhurta Timings & Rahu Kaal Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rahu Kaal & Yamaganda */}
        <div className="bg-slate-900 border border-rose-900/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-900/30">
            <h4 className="text-sm font-bold text-rose-300 font-serif flex items-center gap-2">
              <span>⚠️</span> Inauspicious Muhurtas (त्याज्य काल)
            </h4>
            <span className="text-xs text-slate-400 font-mono">Avoid New Ventures</span>
          </div>
          <div className="space-y-3">
            <div className="bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-rose-200 block text-xs">Rahu Kaalam (राहु काल)</strong>
                <span className="text-[11px] text-slate-400">Inauspicious Rahu phase</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-300 bg-slate-950 px-2.5 py-1 rounded border border-rose-900/40">
                {panchang.muhurtas.rahuKaal}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-200 block text-xs">Yamaganda Kaalam</strong>
                <span className="text-[11px] text-slate-400">Inauspicious window</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                {panchang.muhurtas.yamaganda}
              </span>
            </div>
          </div>
        </div>

        {/* Abhijit Muhurta & Sun Timings */}
        <div className="bg-slate-900 border border-emerald-900/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-900/30">
            <h4 className="text-sm font-bold text-emerald-300 font-serif flex items-center gap-2">
              <span>✨</span> Auspicious Muhurtas (शुभ मुहूर्त)
            </h4>
            <span className="text-xs text-slate-400 font-mono">Victory Window</span>
          </div>
          <div className="space-y-3">
            <div className="bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-emerald-200 block text-xs">Abhijit Muhurta (अभिजित मुहूर्त)</strong>
                <span className="text-[11px] text-slate-400">Removes 100,000 doshas for auspicious work</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 px-2.5 py-1 rounded border border-emerald-900/40">
                {panchang.muhurtas.abhijitMuhurta}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Sunrise: </span>
                <strong className="text-amber-200 font-mono">{panchang.sunrise}</strong>
              </div>
              <div>
                <span className="text-slate-400">Sunset: </span>
                <strong className="text-amber-200 font-mono">{panchang.sunset}</strong>
              </div>
              <div>
                <span className="text-slate-400">Brahma Muhurta: </span>
                <strong className="text-amber-200 font-mono">{panchang.muhurtas.brahmaMuhurta}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Choghadiya Table */}
      <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-xl">
        <h4 className="text-sm font-bold text-amber-200 font-serif mb-3 flex items-center gap-2">
          <span>🕒</span> Dina Choghadiya (दिन चौघड़िया - Auspicious Hourly Divisions)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {CHOGHADIYA_ORDER_DAY[panchang.vara.name as any]?.map((chogh: string, cIdx: number) => {
            const nature = CHOGHADIYA_NATURE[chogh] || "Neutral";
            const isGood = nature === "Best" || nature === "Good" || nature === "Gain";
            const isBad = nature === "Bad" || nature === "Loss";

            return (
              <div
                key={cIdx}
                className={`p-2.5 rounded-xl border text-center flex flex-col justify-between ${
                  isGood
                    ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-200"
                    : isBad
                    ? "bg-rose-950/40 border-rose-800/50 text-rose-200"
                    : "bg-slate-950/50 border-slate-800 text-slate-300"
                }`}
              >
                <span className="text-[10px] text-slate-400 block font-mono">
                  Phase {cIdx + 1}
                </span>
                <h5 className="font-bold text-xs my-1 font-serif">{chogh}</h5>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-block ${
                    isGood
                      ? "bg-emerald-500/20 text-emerald-300"
                      : isBad
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {nature}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
