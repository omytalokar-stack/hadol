import React, { useState } from "react";
import { KundaliData } from "../types/jyotish";
import { GlossaryTooltip } from "./GlossaryTooltip";

interface ExecutiveSummaryCardProps {
  kundali: KundaliData;
  isSimpleMode: boolean;
  onAskAI?: (question: string) => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  kundali,
  isSimpleMode,
  onAskAI,
}) => {
  const [lang, setLang] = useState<"Hinglish" | "English">("Hinglish");

  const moonPlanet = kundali.planets.find((p) => p.name === "Moon");
  const sunPlanet = kundali.planets.find((p) => p.name === "Sun");
  const currentMaha = kundali.currentDasha.mahadasha.planet;
  const currentAntar = kundali.currentDasha.antardasha.planet;

  // Sign descriptions in Plain English and Hinglish
  const getMoonSignInsight = (rashi: string) => {
    switch (rashi) {
      case "Aries":
        return {
          en: "Aries Moon (Mesha): Dynamic, courageous, and proactive. You have quick emotional responses, high leadership energy, and an inspiring entrepreneurial spirit.",
          hi: "Mesha Rashi (Aries): Sahasi, urja-vaan aur proactive swabhaav. Aap jaldi nirnay lete hain aur nayi shuruaat karne me aage rehte hain.",
        };
      case "Taurus":
        return {
          en: "Taurus Moon (Vrishabha - Exalted): Calm, steady, and trustworthy. You value emotional stability, financial security, aesthetic beauty, and loyal relationships.",
          hi: "Vrishabha Rashi (Taurus): Shant, sthir aur vishwasniya vyaktitva. Aapko parivar, aarthik suraksha aur sundar vatavaran pasand hai.",
        };
      case "Gemini":
        return {
          en: "Gemini Moon (Mithuna): Highly communicative, curious, and intellectually versatile. You adapt rapidly and excel in learning, networking, and creative sharing.",
          hi: "Mithuna Rashi (Gemini): Tez buddhi, baat-cheet me kushal aur har cheez seekhne ke shaukeen. Aap naye vicharon ko aasani se apnate hain.",
        };
      case "Cancer":
        return {
          en: "Cancer Moon (Karka - Own Sign): Deeply empathetic, intuitive, and caring. You possess strong emotional intelligence, maternal warmth, and deep protective loyalty.",
          hi: "Karka Rashi (Cancer): Bhavuk, doosron ka khayal rakhne wale aur gahan anubhooti wale vyakti. Aapka man pavitra aur parivarik shanti chahata hai.",
        };
      case "Leo":
        return {
          en: "Leo Moon (Simha): Noble, self-respecting, and charismatic. You have natural leadership, a generous heart, and thrive when inspiring and encouraging others.",
          hi: "Simha Rashi (Leo): Rajasi swabhaav, aatm-samman aur dil ke udar. Aapme aage badhkar lead karne aur sabko prabhavit karne ki kshamta hai.",
        };
      case "Virgo":
        return {
          en: "Virgo Moon (Kanya): Analytical, practical, and detail-oriented. You excel in organization, problem-solving, health awareness, and meaningful service.",
          hi: "Kanya Rashi (Virgo): Practical, samajhdaar aur har kaam ko bariki se karne wale. Aap samasyaon ka solid solution nikalne me expert hain.",
        };
      case "Libra":
        return {
          en: "Libra Moon (Tula): Diplomatic, graceful, and harmony-seeking. You bring balance, justice, artistic appreciation, and refined partnership skills.",
          hi: "Tula Rashi (Libra): Santulan, shanti aur kala-priya vyaktitva. Aap ladai-jhagde se door rehkar rishton me prem aur fairness banaye rakhte hain.",
        };
      case "Scorpio":
        return {
          en: "Scorpio Moon (Vrishchika): Intense, perceptive, and resilient. You have immense willpower, deep research capabilities, and emotional transformative strength.",
          hi: "Vrishchika Rashi (Scorpio): Gahri soch, mazboot iccha-shakti aur vishleshan kshamta. Mushkil se mushkil halat me bhi aap naye roop me nikalte hain.",
        };
      case "Sagittarius":
        return {
          en: "Sagittarius Moon (Dhanu): Optimistic, philosophical, and truth-loving. You seek higher knowledge, spiritual growth, freedom, and ethical expansion.",
          hi: "Dhanu Rashi (Sagittarius): Sakaratmak (optimistic), dharmik aur gyan-priya. Aap hamesha jeevan me kuch bada seekhne aur sikhane me vishwas rakhte hain.",
        };
      case "Capricorn":
        return {
          en: "Capricorn Moon (Makara): Disciplined, ambitious, and dutiful. You have tremendous patience, realistic planning, and an ability to build lasting success over time.",
          hi: "Makara Rashi (Capricorn): Anushasit, mehnati aur dhairya-vaan. Aap dheere-dheere par pakka rasta banakar badi safalta haasil karte hain.",
        };
      case "Aquarius":
        return {
          en: "Aquarius Moon (Kumbha): Visionary, humanitarian, and independent thinker. You care about collective welfare, innovation, and original ideas.",
          hi: "Kumbha Rashi (Aquarius): Door-darshi vichar, sabka bhala chahne wale aur naye ideas ke pakki follower. Aap bheed se alag sochte hain.",
        };
      case "Pisces":
        return {
          en: "Pisces Moon (Meena): Compassionate, imaginative, and spiritually attuned. You have deep artistic sensitivity, kindness, and intuitive connection to the cosmos.",
          hi: "Meena Rashi (Pisces): Dayalu, kalpanasheel aur aadhyatmik swabhaav. Aap doosron ke dukh ko aasani se samajh lete hain aur shanti priya hain.",
        };
      default:
        return {
          en: "Balanced Vedic Moon constellation imparting deep inner awareness.",
          hi: "Shubh Chandra sthiti jo aapke man aur swabhaav ko santulan deti hai.",
        };
    }
  };

  // Dasha interpretation
  const getDashaAdvice = (maha: string, antar: string) => {
    return {
      en: `You are currently in ${maha} Mahadasha with ${antar} Antardasha. ${
        maha === "Jupiter"
          ? "Jupiter brings expansion in wisdom, learning, mentorship, and auspicious dharma. A golden phase to pursue ethical growth and education."
          : maha === "Saturn"
          ? "Saturn demands discipline, patience, hard work, and humility. Focus on consistent effort, structured routines, and serving others."
          : maha === "Mercury"
          ? "Mercury enhances communication, business intellect, analytical clarity, and trade skills. Excellent for networking and learning."
          : maha === "Venus"
          ? "Venus fosters creative expression, luxury, relationship harmony, and comforts. Great for artistic endeavors and partnerships."
          : maha === "Sun"
          ? "Sun enhances self-confidence, leadership, fatherly support, and public recognition. Lead with integrity."
          : maha === "Moon"
          ? "Moon heightens intuition, public relations, peace of mind, and motherly care. Keep emotional balance steady."
          : maha === "Mars"
          ? "Mars ignites courage, decisive action, technical acumen, and stamina. Channel passion constructively without impulsiveness."
          : maha === "Rahu"
          ? "Rahu brings worldly ambitions, technological breakthroughs, and fast changes. Stay grounded in sattvik habits to avoid overthinking."
          : "Ketu deepens spiritual inquiry, detachment, meditation, and inner liberation. Ideal for meditation and letting go of clutter."
      }`,
      hi: `Abhi aapki ${maha} ki Mahadasha me ${antar} ki Antardasha chal rahi hai. ${
        maha === "Jupiter"
          ? "Guru (Jupiter) ki dasha gyan, aadar, dharamik vikas aur naye shubh kamo ke liye behad anukool hai. Seekhne aur naye projects shuru karne ka samay hai."
          : maha === "Saturn"
          ? "Shani Dev ka samay anushasan, parishram aur dhairya maangta hai. Imandari se mehnat karein aur shant rahein - yeh samay lambi safalta ki neev rakhta hai."
          : maha === "Mercury"
          ? "Budh (Mercury) ki dasha me dimaag tez chalta hai, communication aur vyapar (business/job) me naye mauke milte hain."
          : maha === "Venus"
          ? "Shukra (Venus) ki dasha prem, kala, aarthik sukh-suvidha aur rishton me mithaas laane ka samay hai."
          : maha === "Sun"
          ? "Surya (Sun) ki dasha aatm-vishwas, samman aur leadership me vriddhi karti hai. Aatm-samman banaye rakhein."
          : maha === "Moon"
          ? "Chandra (Moon) ki dasha man me naye vichar aur bhavnayein laati hai. Dhyan aur yoga se man shant rakhein."
          : maha === "Mars"
          ? "Mangal (Mars) ki dasha himmat aur urja badhati hai. Jaldbaazi ya gusse se bachein aur urja sahi kaam me lagayein."
          : maha === "Rahu"
          ? "Rahu ki dasha naye aur unconventional mauke laati hai. Rozana anushasit rahein aur overthinking se bachein."
          : "Ketu ki dasha aadhyatm, dhyan aur antarik shanti ke liye uttam samay hai."
      }`,
    };
  };

  // Top 2 tailored remedies
  const getTopTwoRemedies = (maha: string, rashi: string) => {
    let rem1 = {
      title: "🌅 Surya Arghya & Gayatri Mantra (प्रातः सूर्य अर्घ्य)",
      descEn: "Offer pure water in a copper vessel facing East during morning sunrise with 11 repetitions of the Gayatri Mantra for physical vitality, mental clarity, and divine aura.",
      descHi: "Subah suryoday ke samay tambe ke lote se Surya Dev ko jal arpit karein aur 11 baar Gayatri Mantra ka jaap karein. Isse tejasvi urja aur aatm-vishwas milta hai.",
    };

    let rem2 = {
      title: "🕊️ Compassionate Daan & Seva (सेवा एवं दान)",
      descEn: "Feed birds or stray animals with grains/water daily. Support elders and teachers with humility to invite planetary grace.",
      descHi: "Rozana pakshiyon ko daana aur paani dalein ya kisi zarooratmand ki madad karein. Isse grahon ke sabhi anukul prabhav badhte hain.",
    };

    if (maha === "Saturn") {
      rem1 = {
        title: "🛡️ Hanuman Chalisa & Evening Oil Lamp (हनुमान चालीसा)",
        descEn: "Recite the Hanuman Chalisa on Tuesdays and Saturdays. Light a mustard oil lamp under a Peepal tree on Saturday evenings.",
        descHi: "Mangalwar aur Shanivar ko Hanuman Chalisa ka path karein. Shanivar shaam ko sarson ke tel ka deepak jalayein. Shani Dev ki kripa prapt hoti hai.",
      };
      rem2 = {
        title: "🖤 Seva to the Needy (जरूरतमंदों की सेवा)",
        descEn: "Donate black sesame, warm blankets, or wholesome food to hardworking laborers on Saturdays. Practice humble speech.",
        descHi: "Shanivar ko kisi garib ya mehnatkash vyakti ko bhojan ya kale til ka daan karein. Vinamra vyavahar rakhein.",
      };
    } else if (maha === "Jupiter") {
      rem1 = {
        title: "💛 Guru Gayatri / Vishnu Sahasranama (विष्णु उपासना)",
        descEn: "Chant 'Om Gram Greem Groom Sah Gurave Namah' (21 times) or listen to Vishnu Sahasranama on Thursdays for divine guidance.",
        descHi: "Guruwar ko 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' ka 21 baar jaap karein ya Bhagwan Vishnu ki aarti karein. Gyan aur dhan me vriddhi hoti hai.",
      };
      rem2 = {
        title: "🌾 Feed Cows with Yellow Grains / Bananas (गौ सेवा)",
        descEn: "Feed a desi cow with fresh green grass, soaked gram lentils (Chana Dal), or yellow bananas on Thursday mornings.",
        descHi: "Guruwar ko gay ko chane ki daal, gud ya kela khilayein. Mata-pita aur guruon ka aashirwad lein.",
      };
    } else if (maha === "Mercury") {
      rem1 = {
        title: "💚 Budh Beej Mantra & Tulsi Puja (तुलसी सेवा)",
        descEn: "Chant 'Om Bram Breem Broum Sah Budhaya Namah' on Wednesdays and water a holy Tulsi plant daily with reverence.",
        descHi: "Budhwar ko Budh Beej Mantra ka jaap karein aur Tulsi ji ko roz jal arpit karein. Buddhi aur vyapar me safalta milti hai.",
      };
      rem2 = {
        title: "🌱 Green Mung Daan (हरी मूंग दान)",
        descEn: "Donate green mung beans or green vegetables to students or shrines on Wednesday mornings.",
        descHi: "Budhwar ko hari sabji ya hari moong daal ka daan karein. Shiksha aur communication me vikas hota hai.",
      };
    }

    return [rem1, rem2];
  };

  const moonSignInsight = getMoonSignInsight(kundali.moonSign);
  const dashaAdvice = getDashaAdvice(currentMaha, currentAntar);
  const topRemedies = getTopTwoRemedies(currentMaha, kundali.moonSign);

  return (
    <div
      id="executive-summary-card"
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Background Sacred Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title & Language Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-900/40 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-amber-400">🌟</span>
            <h3 className="text-lg sm:text-xl font-bold text-amber-100 font-serif">
              AI Astrological Executive Summary
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Key 3 Takeaways
            </span>
          </div>
          <p className="text-xs text-amber-300/80 mt-1">
            Essential plain-language astrological summary for quick, actionable clarity
          </p>
        </div>

        {/* Hinglish / English Toggle Switch */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Language:</span>
          <div className="bg-slate-950 p-1 rounded-xl border border-amber-900/40 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setLang("Hinglish")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                lang === "Hinglish"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-amber-200"
              }`}
            >
              🇮🇳 Hinglish
            </button>
            <button
              type="button"
              onClick={() => setLang("English")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                lang === "English"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-amber-200"
              }`}
            >
              🌐 English
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {/* CARD 1: MAIN ZODIAC & INNER NATURE */}
        <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base text-amber-400">🌙</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-serif">
                  1. Main Zodiac & Persona
                </h4>
              </div>
              <GlossaryTooltip term="Rashi" />
            </div>

            {/* Main Signs Badges */}
            <div className="space-y-2 mb-3">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center">
                    Moon Sign (चन्द्र राशि):
                    <GlossaryTooltip term="Rashi" />
                  </span>
                  <strong className="text-amber-200 font-serif">
                    {kundali.moonSign}
                  </strong>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Nakshatra: {kundali.birthNakshatra} (Pada {kundali.birthPada})
                </span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center">
                    Ascendant (लग्न):
                    <GlossaryTooltip term="Lagna" />
                  </span>
                  <strong className="text-amber-200 font-serif">
                    {kundali.ascendant.rashi}
                  </strong>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Lord: {kundali.ascendant.rashiLord}
                </span>
              </div>
            </div>

            {/* Plain explanation */}
            <p className="text-xs text-slate-300 leading-relaxed italic bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
              "{lang === "Hinglish" ? moonSignInsight.hi : moonSignInsight.en}"
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Sun Sign: <strong className="text-amber-200">{kundali.sunSign}</strong></span>
            <span className="text-emerald-400 font-medium">Core Soul Strength</span>
          </div>
        </div>

        {/* CARD 2: CURRENT DASHA PHASE */}
        <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base text-emerald-400">⏳</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-serif">
                  2. Current Dasha Phase
                </h4>
              </div>
              <GlossaryTooltip term="Dasha" />
            </div>

            {/* Dasha Highlight Badge */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-900/40 mb-3">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                Ongoing Mahadasha / Antardasha:
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-emerald-300 font-serif">
                  {currentMaha} / {currentAntar}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Until {kundali.currentDasha.antardasha.endDate}
                </span>
              </div>
            </div>

            {/* Plain Dasha Meaning */}
            <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
              {lang === "Hinglish" ? dashaAdvice.hi : dashaAdvice.en}
            </p>
          </div>

          {onAskAI && (
            <div className="mt-3 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Please explain the effects and opportunities of my current ${currentMaha} Mahadasha and ${currentAntar} Antardasha in plain language.`
                  )
                }
                className="w-full text-center text-xs text-amber-300 hover:text-amber-100 font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>✨</span>
                <span>Ask AI Astrologer About This Period</span>
              </button>
            </div>
          )}
        </div>

        {/* CARD 3: TOP 2 SAFE SATTVIK REMEDIES */}
        <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base text-amber-400">🌿</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-serif">
                  3. Top 2 Safe Daily Remedies
                </h4>
              </div>
              <GlossaryTooltip term="Doshas" />
            </div>

            {/* Top 2 Items List */}
            <div className="space-y-2.5">
              {topRemedies.map((rem, rIdx) => (
                <div
                  key={rIdx}
                  className="bg-slate-900/80 border border-amber-900/30 rounded-lg p-2.5"
                >
                  <strong className="text-xs font-bold text-amber-200 block mb-1">
                    {rem.title}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {lang === "Hinglish" ? rem.descHi : rem.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>100% Safe Sattvik Upay (शास्त्रसम्मत)</span>
            <span className="text-amber-400 font-medium">Daily Harmony</span>
          </div>
        </div>
      </div>
    </div>
  );
};
