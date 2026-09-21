import React, { useState, useRef, useEffect } from "react";

export interface GlossaryEntry {
  title: string;
  sanskrit: string;
  englishExplanation: string;
  hinglishExplanation: string;
  scripturalContext: string;
}

export const JYOTISH_GLOSSARY: Record<string, GlossaryEntry> = {
  Lagna: {
    title: "Lagna / Ascendant (लग्न)",
    sanskrit: "उदय लग्न (Rising Sign)",
    englishExplanation:
      "The exact zodiac sign rising on the eastern horizon at the moment of your birth. It defines your physical vitality, outer personality, life direction, and constitutional strength.",
    hinglishExplanation:
      "Aapke janm ke samay poorvi kshitij (eastern horizon) par jo rashi thi. Yeh aapka physical body, vyaktitva (personality) aur jeevan ki mukhya disha ko darshata hai.",
    scripturalContext: "BPHS: 'Tanu Bhava' - Foundation of the entire Kundali chart.",
  },
  Rashi: {
    title: "Chandra Rashi / Moon Sign (चन्द्र राशि)",
    sanskrit: "मनःकारक राशि",
    englishExplanation:
      "The zodiac constellation in which the Moon was positioned at birth. In Vedic astrology, the Moon sign rules your emotional mind, inner subconscious feelings, and psychological peace.",
    hinglishExplanation:
      "Janm ke waqt Chandrama jis rashi me sthit the. Vedic Jyotish me yeh aapke man (mind), bhavnaon (emotions) aur antarik shanti ka mukhya kendra hai.",
    scripturalContext: "Brihat Parashara Hora Shastra Chapter 4.",
  },
  Nakshatra: {
    title: "Nakshatra / Lunar Mansion (नक्षत्र)",
    sanskrit: "27 दिव्य नक्षत्र क्षेत्र",
    englishExplanation:
      "One of the 27 stellar constellations that the Moon travels through. It gives deep insight into your innate karmic talents, behavioral temperament, and Vimshottari dasha cycles.",
    hinglishExplanation:
      "Aakash ke 27 vishesh sitare/kshetra. Aapka janm nakshatra aapke karmic gun, dhyan aur kshamtaon ka sukshma naksha hota hai.",
    scripturalContext: "Rigveda & Taittiriya Samhita astronomical foundation.",
  },
  Dasha: {
    title: "Vimshottari Dasha (विंशोत्तरी दशा)",
    sanskrit: "120-वर्षीय ग्रह काल चक्र",
    englishExplanation:
      "A 120-year planetary timeline unique to your birth Moon. Different planets take leadership of different life periods (Mahadasha & Antardasha), dictating timing of events.",
    hinglishExplanation:
      "Jeevan ka samay-chakra jisme alag-alag grah bari-bari se shasan karte hain. Chal rahi Mahadasha/Antardasha tay karti hai ki abhi career, health ya rishton me kaisa samay chal raha hai.",
    scripturalContext: "BPHS Chapter 46: Primary timing system of Kaliyuga.",
  },
  Yogas: {
    title: "Vedic Yogas (शुभ ग्रहीय योग)",
    sanskrit: "विशेष शुभ ग्रहीय योग",
    englishExplanation:
      "Specific auspicious combinations and aspects of benefic planets (like Gajakesari, Budhaditya, Pancha Mahapurusha) that bestow wisdom, wealth, leadership, and protection.",
    hinglishExplanation:
      "Kundali me shubh grahon ka vishesh mail jo jatak ko safalta, gyan, dhan aur samaj me samman dilata hai.",
    scripturalContext: "Saravali & Jataka Parijata.",
  },
  Doshas: {
    title: "Doshas / Afflictions (ग्रह दोष)",
    sanskrit: "कार्मिक असंतुलन",
    englishExplanation:
      "Planetary afflictions (such as Manglik, Kaal Sarp, or Sade Sati) indicating specific karmic learning areas. Classical Jyotish provides authentic Sattvik remedies to harmonise these energies.",
    hinglishExplanation:
      "Karmic challenges jo dhairya, anushasan aur sattvik upayon (mantra, daan, puja) se shant aur anukool kiye ja sakte hain.",
    scripturalContext: "BPHS Remedies & Shanti Vidhana.",
  },
  Bhavas: {
    title: "Bhavas / Houses (12 भाव)",
    sanskrit: "द्वादश भाव",
    englishExplanation:
      "The 12 sectors of life: 1st (Self), 2nd (Wealth/Family), 3rd (Courage), 4th (Home/Mother), 5th (Intellect/Children), 6th (Health/Service), 7th (Partnership), 8th (Transformation), 9th (Dharma/Luck), 10th (Career), 11th (Gains), 12th (Moksha).",
    hinglishExplanation:
      "Jeevan ke 12 mukhya pehlu: Sharir, Dhan, Sahas, Sukh/Ghar, Buddhi, Rog/Shatru, Vivah, Aayu, Bhagya, Karma/Job, Labh, aur Moksha.",
    scripturalContext: "BPHS Bhavaphala Adhyaya.",
  },
  Navamsha: {
    title: "Navamsha Chakra (D9 नवमांश चक्र)",
    sanskrit: "नवम अंश - सूक्ष्म भाग्य चक्र",
    englishExplanation:
      "The 9th harmonic divisional chart. It reveals inner planetary strength, married life compatibility, spiritual inclination (dharma), and life outcomes in the second half of life.",
    hinglishExplanation:
      "Kundali ka sabse mahatvapoorna sukshma chakra jo vivah ke baad ki sthiti, bhagya aur aatma ki asali shakti ko darshata hai.",
    scripturalContext: "BPHS Varga Adhyaya: Most important of the 16 Shodashavargas.",
  },
  Ayanamsha: {
    title: "Lahiri / Chitra Paksha Ayanamsha (अयनांश)",
    sanskrit: "चित्रपक्ष अयनांश",
    englishExplanation:
      "The precise astronomical angle difference between the tropical (Sayana) and Vedic sidereal (Nirayana) zodiac, caused by the precession of the equinoxes (~24°).",
    hinglishExplanation:
      "True astronomical correction angle jo actual stars aur nakshatras ke real coordinates ko calculate karne ke liye zaroori hai.",
    scripturalContext: "Indian Astronomical Ephemeris Standard.",
  },
  SadeSati: {
    title: "Shani Sade Sati (शनि साढ़े साती)",
    sanskrit: "शनैश्चर साढ़े साती",
    englishExplanation:
      "A 7.5-year transit period when Saturn moves through the 12th, 1st, and 2nd houses from your natal Moon sign. It fosters deep discipline, maturity, humility, and karma balancing.",
    hinglishExplanation:
      "Shani Dev ka 7.5 saal ka transit jo vyakti ko anushasit, parishrami aur sakaratmak roop se paripakva (mature) banata hai.",
    scripturalContext: "Bhavartha Ratnakara & Phaladeepika.",
  },
  Manglik: {
    title: "Manglik Dosha / Kuja Dosha (मांगलिक प्रभाव)",
    sanskrit: "भौम दोष",
    englishExplanation:
      "Placement of Mars (Mangal) in the 1st, 2nd, 4th, 7th, 8th, or 12th house. Indicates high passion and drive that requires balanced communication in relationships.",
    hinglishExplanation:
      "Mangal grah ki sthiti jo energy aur passion deti hai. Shanti ke liye Hanuman Chalisa, gusse par niyantran aur patience zaroori hota hai.",
    scripturalContext: "Brihat Jataka & BPHS.",
  },
  Ashtakoota: {
    title: "Ashtakoota Milan (अष्टकूट 36 गुण मिलान)",
    sanskrit: "36-गुण अष्टकूट मिलान",
    englishExplanation:
      "Vedic 8-fold compatibility system totaling 36 points: Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), Nadi (8). 18+ is acceptable.",
    hinglishExplanation:
      "Var aur Kanya ki kundali ka 8 staro par milan jisme 36 guno me se 18+ gun shubh maane jaate hain.",
    scripturalContext: "Muhurta Chintamani.",
  },
  Choghadiya: {
    title: "Choghadiya (चौघड़िया मुहूर्त)",
    sanskrit: "शुभ मुहूर्त समय विभाग",
    englishExplanation:
      "7 time segments in day and night: Amrit (Best), Shubh (Good), Labh (Gain), Char (Neutral), Rog/Kaal/Udveg (Inauspicious). Ideal for initiating new tasks.",
    hinglishExplanation:
      "Din aur raat ke 7 hisse jo batate hain ki koi naya kaam kab shuru karna shubh hoga (Amrit, Shubh, Labh).",
    scripturalContext: "Vedic Muhurta Shastra.",
  },
  RahuKaal: {
    title: "Rahu Kaalam (राहु काल)",
    sanskrit: "राहु काल (अशुभ 90-मिनट समय)",
    englishExplanation:
      "A daily 90-minute inauspicious window governed by Rahu. In traditional Jyotish, starting new ventures, contracts, or long journeys is avoided during this time.",
    hinglishExplanation:
      "Har din ka lagbhag 1.5 ghante ka samay jisme naye shubh karya shuru karne se bacha jata hai.",
    scripturalContext: "Kalaprakashika.",
  },
};

interface GlossaryTooltipProps {
  term?: keyof typeof JYOTISH_GLOSSARY | string;
  customText?: string;
  customTitle?: string;
  children?: React.ReactNode;
  inline?: boolean;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  term,
  customText,
  customTitle,
  children,
  inline = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const entry = term ? JYOTISH_GLOSSARY[term] : undefined;
  const title = customTitle || entry?.title || term || "Vedic Term";
  const english = customText || entry?.englishExplanation || "Astronomical Vedic concept.";
  const hinglish = entry?.hinglishExplanation;
  const scriptural = entry?.scripturalContext;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <span className={`relative ${inline ? "inline-flex items-center" : "inline-block"}`}>
      {children}
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-amber-100 text-[10px] font-bold border border-amber-500/30 transition-all cursor-pointer align-middle"
        title="Click or hover to learn what this means"
        aria-label={`Info about ${title}`}
      >
        ?
      </button>

      {/* Popover Bubble */}
      {isVisible && (
        <div
          ref={popoverRef}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 bg-slate-900 border border-amber-500/50 rounded-xl p-3.5 shadow-2xl text-left pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-900/40">
            <div>
              <span className="text-xs font-bold text-amber-200 font-serif block">
                {title}
              </span>
              {entry?.sanskrit && (
                <span className="text-[10px] text-amber-400/80 font-serif">
                  {entry.sanskrit}
                </span>
              )}
            </div>
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[9px] border border-amber-800">
              JYOTISH
            </span>
          </div>

          {/* Plain English */}
          <div className="space-y-1.5 text-xs text-slate-200">
            <p className="leading-relaxed text-[11px] text-slate-300">{english}</p>

            {/* Hinglish Explanation */}
            {hinglish && (
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-2 mt-1.5">
                <span className="text-[9px] uppercase font-bold text-amber-400 block mb-0.5">
                  🇮🇳 Simple Hinglish (सरल भाषा):
                </span>
                <p className="text-[11px] text-amber-100/90 leading-snug italic">
                  "{hinglish}"
                </p>
              </div>
            )}

            {/* Scriptural Context */}
            {scriptural && (
              <div className="pt-1 text-[9px] text-slate-500 font-mono flex items-center gap-1">
                <span>📖</span>
                <span>{scriptural}</span>
              </div>
            )}
          </div>

          {/* Pointer Triangle */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-amber-500/50" />
        </div>
      )}
    </span>
  );
};
