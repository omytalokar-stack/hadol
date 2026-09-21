import React, { useState } from "react";
import { PlanetKey } from "../types/jyotish";
import { SATTVIK_REMEDIES_DATA } from "../data/vedicData";
import { MantraJapaCounter } from "./MantraJapaCounter";

export const SattvikRemedies: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Planetary" | "Japa" | "GemstoneCaution" | "LifeSpheres">("Planetary");
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey>("Sun");

  const remedy = SATTVIK_REMEDIES_DATA[selectedPlanet] || SATTVIK_REMEDIES_DATA.Sun;

  return (
    <div id="sattvik-remedies-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>🌿</span> Sattvik & Scripture-Grounded Upay
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 font-serif">
            Vedic Upay & Spiritual Remedies (सात्त्विक उपाय)
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Strictly rooted in <em>Brihat Parashara Hora Shastra</em> and classical Vedic traditions.
            We prescribe <strong>only safe, positive, uplifting remedies</strong>: sacred Mantras, Sattvik Daan (charity), meditation, puja, and harmonious lifestyle practices.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-amber-900/30">
          {[
            { id: "Planetary", label: "9 Graha Shanti Upay", icon: "🪐" },
            { id: "Japa", label: "108 Mantra Japa Mala", icon: "📿" },
            { id: "GemstoneCaution", label: "Gemstone Caution & Rules", icon: "💎" },
            { id: "LifeSpheres", label: "Life Spheres (Career, Health, Marriage)", icon: "✨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-lg ring-1 ring-amber-300 font-bold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-amber-200 border border-slate-700/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Planetary Remedies */}
      {activeTab === "Planetary" && (
        <div className="space-y-6">
          {/* Planet Selector Bar */}
          <div className="flex flex-wrap gap-2">
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
              const info = SATTVIK_REMEDIES_DATA[p];
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPlanet(p)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md ring-1 ring-amber-300"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {p} ({info.sanskritName.split(" ")[0]})
                </button>
              );
            })}
          </div>

          {/* Selected Planet Comprehensive Upay Card */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-900/30">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
                  Parashari Remedial Protocol
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif mt-0.5">
                  {remedy.sanskritName} Upay
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                Sattvik & Safe
              </span>
            </div>

            {/* Grid of 4 Remedial Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Sacred Mantras */}
              <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-serif">
                  <span>📿</span>
                  <h4>Vedic & Beej Mantra</h4>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-amber-950/60 text-center">
                  <p className="text-base font-bold text-amber-100 font-serif">
                    {remedy.beejMantra.sanskrit}
                  </p>
                  <p className="text-xs text-amber-300/80 italic mt-1 font-mono">
                    "{remedy.beejMantra.transliteration}"
                  </p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Meaning:</strong> {remedy.beejMantra.meaning}
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded border border-slate-800">
                  <span className="text-amber-300 font-medium">Prescribed Count: </span>
                  {remedy.beejMantra.prescribedCount} times • <strong>Timing: </strong>
                  {remedy.beejMantra.bestTime}
                </div>
              </div>

              {/* 2. Sattvik Daan (Charity) */}
              <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-serif">
                  <span>🌾</span>
                  <h4>Sattvik Daan (Charity Items & Timing)</h4>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                    Recommended Daan Items:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {remedy.daan.items.map((item, iIdx) => (
                      <span
                        key={iIdx}
                        className="px-2.5 py-1 rounded bg-amber-950/40 text-amber-200 border border-amber-800/40 text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Auspicious Day:</strong> {remedy.daan.auspiciousDay}
                </p>
                <p className="text-xs text-slate-300">
                  <strong>Recipient:</strong> {remedy.daan.recipient}
                </p>
                <p className="text-[11px] text-amber-300/80 italic border-t border-slate-800 pt-2">
                  Guideline: {remedy.daan.guideline}
                </p>
              </div>

              {/* 3. Puja, Deities & Fasting */}
              <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-serif">
                  <span>🪔</span>
                  <h4>Puja, Deity & Vrata (Fasting)</h4>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Presiding Deity:</strong> {remedy.pujaAndVrata.deity}
                </p>
                <p className="text-xs text-slate-300">
                  <strong>Vrata (Fasting Day):</strong> {remedy.pujaAndVrata.vratDay}
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-amber-300 block mb-1">Puja Practice:</span>
                  {remedy.pujaAndVrata.pujaPractice}
                </div>
                <p className="text-xs text-slate-400">
                  <strong>Meditation Focus:</strong> {remedy.pujaAndVrata.meditationFocus}
                </p>
              </div>

              {/* 4. Lifestyle & Karma Yoga */}
              <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-serif">
                  <span>🧘</span>
                  <h4>Daily Habits & Karma Alignment</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {remedy.lifestyleAndKarma.map((habit, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold mt-0.5">✔</span>
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gemstone Reference with Caution Notice */}
            <div className="bg-amber-950/20 border border-amber-700/40 rounded-xl p-4.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-serif mb-2">
                <span>💎</span>
                <h4>Gemstone (Ratna) Reference & Caution</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 mb-3">
                <div>
                  <span className="text-slate-400">Gemstone: </span>
                  <strong className="text-amber-100">{remedy.gemstone.name}</strong> ({remedy.gemstone.sanskritName})
                </div>
                <div>
                  <span className="text-slate-400">Metal & Finger: </span>
                  <strong className="text-amber-100">
                    {remedy.gemstone.metal} • {remedy.gemstone.finger}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Safe Herbal / Rudraksha Alternative: </span>
                  <strong className="text-emerald-300">{remedy.gemstone.safeAlternative}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Timing: </span>
                  <strong className="text-amber-100">{remedy.gemstone.auspiciousDayTime}</strong>
                </div>
              </div>

              <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-3 text-xs text-rose-200">
                <strong className="text-rose-300 block mb-0.5 font-sans">⚠️ Parashari Gemstone Caution:</strong>
                {remedy.gemstone.caution}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Mantra Japa Counter */}
      {activeTab === "Japa" && (
        <MantraJapaCounter initialPlanet={selectedPlanet} />
      )}

      {/* Tab 3: Gemstone Caution Guide */}
      {activeTab === "GemstoneCaution" && (
        <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-amber-900/30">
            <span className="text-xs uppercase tracking-wider text-rose-400 font-bold block">
              Vedic Astrology Safety Protocol
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif mt-1">
              Gemstone (Ratna) Caution & Astrological Rules
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
              Gemstones are cosmic amplifiers that magnify planetary energy. In Parashari Jyotish, wearing a gemstone for a functional malefic planet or during an adverse dasha can trigger severe difficulties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4">
              <span className="text-2xl block mb-2">1️⃣</span>
              <h4 className="text-sm font-bold text-amber-200 font-serif mb-1">
                Only Functional Benefics
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gemstones should strictly be worn only for your Lagna Lord (1st house), 5th Lord, or 9th Lord (Trikona Lords). Never wear stones of 6th, 8th, or 12th house lords.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4">
              <span className="text-2xl block mb-2">2️⃣</span>
              <h4 className="text-sm font-bold text-amber-200 font-serif mb-1">
                Mandatory Physical Verification
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Always have an authentic Jyotish Acharya physically verify your birth chart, dasha transitions, and gemstone quality before investing in or wearing any natural gemstone.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4">
              <span className="text-2xl block mb-2">3️⃣</span>
              <h4 className="text-sm font-bold text-amber-200 font-serif mb-1">
                Safe Herbal & Rudraksha Alternatives
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authentic Rudraksha beads and sacred herbal roots (Vanamool) carry zero malefic side effects and provide equal spiritual pacification without gemstone risks.
              </p>
            </div>
          </div>

          {/* Incompatible Gemstone Matrix */}
          <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-5">
            <h4 className="text-sm font-bold text-rose-300 font-serif mb-2 flex items-center gap-2">
              <span>🚫</span> Conflicting Gemstone Combinations (Never Wear Together)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 mt-3">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-amber-200">Ruby (Sun)</strong> + <strong className="text-rose-400">Blue Sapphire (Saturn) / Gomed (Rahu)</strong>
                <p className="text-[11px] text-slate-400 mt-1">Causes extreme internal friction, ego clashes, and vitality disturbances.</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-amber-200">Pearl (Moon)</strong> + <strong className="text-rose-400">Gomed (Rahu) / Cat's Eye (Ketu)</strong>
                <p className="text-[11px] text-slate-400 mt-1">Triggers severe psychological anxiety, restlessness, and emotional distress.</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-amber-200">Red Coral (Mars)</strong> + <strong className="text-rose-400">Emerald (Mercury) / Diamond (Venus)</strong>
                <p className="text-[11px] text-slate-400 mt-1">Mars and Mercury/Venus are mutual enemies; wearing together induces erratic temperament.</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-amber-200">Yellow Sapphire (Jupiter)</strong> + <strong className="text-rose-400">Diamond (Venus) / Blue Sapphire (Saturn)</strong>
                <p className="text-[11px] text-slate-400 mt-1">Guru and Shukra represent opposing spiritual and material philosophies.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Life Spheres Remedies */}
      {activeTab === "LifeSpheres" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Career & Karma */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base font-serif">
              <span>💼</span>
              <h3>Career & Karma Elevation (10th Bhava Upay)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strengthening the Sun, Saturn, and 10th lord brings authority, ethical respect, and stability in profession:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Aditya Hridaya Stotra:</strong> Recite on Sunday mornings facing East for clarity, leadership, and public standing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Fair Conduct with Subordinates:</strong> Always treat staff, cleaners, and colleagues with integrity (Saturn remedy).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Vishnu Sahasranama:</strong> Recite on Thursdays for career roadblocks and administrative favor.</span>
              </li>
            </ul>
          </div>

          {/* Wealth & Prosperity */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base font-serif">
              <span>💰</span>
              <h3>Wealth, Savings & Family (2nd & 11th Bhava Upay)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Harmonizing Jupiter (expansion) and Venus (wealth) with Mercury (commercial acumen):
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Sri Suktam & Kanakadhara Stotram:</strong> Chanting on Fridays with a pure ghee lamp to Goddess Lakshmi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Feeding Gomata (Cows):</strong> Offering fresh green spinach or soaked chana dal to cows weekly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Truthful Speech:</strong> The 2nd house governs speech; avoiding deceptive speech preserves Dhana Lakshmi.</span>
              </li>
            </ul>
          </div>

          {/* Marriage & Harmony */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base font-serif">
              <span>🕊️</span>
              <h3>Marital Harmony & Relationships (7th Bhava Upay)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pacifying Mars (Kuja), strengthening Venus (Kalatrakaraka) and Jupiter:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Gauri Shankara Puja:</strong> Joint worship of Lord Shiva and Goddess Parvati on Mondays.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Hanuman Chalisa:</strong> Calms fiery aggression and impatient speech in partnerships.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Mutual Respect:</strong> Respecting women and partner's perspective with compassionate active listening.</span>
              </li>
            </ul>
          </div>

          {/* Health & Vitality */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base font-serif">
              <span>🌱</span>
              <h3>Health, Immunity & Vitality (1st & 6th Bhava Upay)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fortifying the Lagna Lord, Sun (vital force) and soothing Moon (nervous system):
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Maha Mrityunjaya Mantra:</strong> 108 japa daily during Brahma Muhurta for cellular vitality and protection.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Surya Namaskar & Pranayama:</strong> 12 sun salutations synchronized with breath.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Sattvik Diet:</strong> Fresh seasonal meals, water from copper vessels, and mindful sleep routines.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
