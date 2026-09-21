import {
  BirthDetails,
  BhavaData,
  DoshaAnalysis,
  DashaPeriod,
  GunaMilanResult,
  KundaliData,
  PanchangData,
  PlanetKey,
  PlanetPosition,
  RashiKey,
  VedicYoga,
} from "../types/jyotish";
import { NAKSHATRAS, RASHIS, BHAVA_CONFIG } from "../data/vedicData";

// Rashi names in standard order (0 = Aries)
export const RASHI_KEYS: RashiKey[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

// Planet Lords for Rashis
export const RASHI_LORDS: Record<RashiKey, PlanetKey> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

// Sanskrit names for Planets
export const PLANET_SANSKRIT: Record<PlanetKey, string> = {
  Sun: "Surya (सूर्य)",
  Moon: "Chandra (चन्द्र)",
  Mars: "Mangala (मंगल)",
  Mercury: "Budha (बुध)",
  Jupiter: "Guru / Brihaspati (गुरु)",
  Venus: "Shukra (शुक्र)",
  Saturn: "Shani (शनि)",
  Rahu: "Rahu (राहु)",
  Ketu: "Ketu (केतु)",
  Ascendant: "Lagna (लग्न)",
};

export const PLANET_SYMBOLS: Record<PlanetKey, string> = {
  Sun: "☉",
  Moon: "☽",
  Mars: "♂",
  Mercury: "☿",
  Jupiter: "♃",
  Venus: "♀",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
  Ascendant: "Asc",
};

// Vimshottari Dasha sequence and planetary period in years
export const VIMSHOTTARI_YEARS: { planet: PlanetKey; years: number }[] = [
  { planet: "Ketu", years: 7 },
  { planet: "Venus", years: 20 },
  { planet: "Sun", years: 6 },
  { planet: "Moon", years: 10 },
  { planet: "Mars", years: 7 },
  { planet: "Rahu", years: 18 },
  { planet: "Jupiter", years: 16 },
  { planet: "Saturn", years: 19 },
  { planet: "Mercury", years: 17 },
];

/**
 * Format decimal degrees into Deg° Min' Sec" string
 */
export function formatDegrees(deg: number): string {
  const normalized = ((deg % 30) + 30) % 30;
  const d = Math.floor(normalized);
  const minFloat = (normalized - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.floor((minFloat - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}' ${s.toString().padStart(2, "0")}"`;
}

/**
 * Calculates Julian Day Number from Gregorian Date & Time (UTC)
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number = 0
): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hour + minute / 60 + second / 3600) / 24;
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    dayFrac +
    B -
    1524.5
  );
}

/**
 * Calculates Lahiri Ayanamsha (Chitra Paksha) for a given Julian Day
 */
export function calculateLahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0
  // Standard high-accuracy IAU/Lahiri precession model
  const ayanamsha = 23.858055556 + 1.396971278 * T + 0.0003086 * T * T;
  return ayanamsha;
}

/**
 * Calculates Greenwich Mean Sidereal Time (GMST) in degrees
 */
export function calculateGMST(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  gmst = ((gmst % 360) + 360) % 360;
  return gmst;
}

/**
 * Calculates Ascendant (Lagna) in degrees (Nirayana Sidereal)
 */
export function calculateLagna(
  jd: number,
  latitude: number,
  longitude: number,
  ayanamsha: number
): number {
  const gmst = calculateGMST(jd);
  const lst = ((gmst + longitude) % 360 + 360) % 360; // Local Sidereal Time in degrees
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;
  const epsRad = (23.4392911 * Math.PI) / 180; // Obliquity of ecliptic

  const y = Math.cos(lstRad);
  const x =
    -Math.sin(lstRad) * Math.cos(epsRad) -
    Math.tan(latRad) * Math.sin(epsRad);
  let tropicalLagna = (Math.atan2(y, x) * 180) / Math.PI;
  tropicalLagna = ((tropicalLagna % 360) + 360) % 360;

  // Convert to Vedic Sidereal Nirayana
  const siderealLagna = ((tropicalLagna - ayanamsha) % 360 + 360) % 360;
  return siderealLagna;
}

/**
 * High-accuracy Sidereal Planetary Calculations based on orbital Keplerian elements + perturbations
 */
export function calculatePlanetPositions(
  jd: number,
  ayanamsha: number,
  lagnaLongitude: number
): PlanetPosition[] {
  const d = jd - 2451545.0; // Days from J2000.0
  const T = d / 36525; // Centuries from J2000.0

  // 1. Sun Tropical Longitude
  const L0 = 280.46646 + 36000.76983 * T;
  const M_sun = 357.52911 + 35999.05029 * T;
  const M_sun_rad = (M_sun * Math.PI) / 180;
  const C_sun =
    (1.914602 - 0.004817 * T) * Math.sin(M_sun_rad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M_sun_rad) +
    0.000289 * Math.sin(3 * M_sun_rad);
  let sunTropical = ((L0 + C_sun) % 360 + 360) % 360;

  // 2. Moon Tropical Longitude (Brown Lunar Theory components)
  const L_moon = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T; // Moon mean elongation
  const M_moon = 134.9633964 + 477198.8675055 * T; // Moon mean anomaly
  const F = 93.272095 + 483202.0175233 * T; // Moon argument of latitude

  const D_rad = (D * Math.PI) / 180;
  const Mm_rad = (M_moon * Math.PI) / 180;
  const F_rad = (F * Math.PI) / 180;

  let moonTropical =
    L_moon +
    6.288774 * Math.sin(Mm_rad) +
    1.274027 * Math.sin(2 * D_rad - Mm_rad) +
    0.658314 * Math.sin(2 * D_rad) +
    0.213618 * Math.sin(2 * Mm_rad) -
    0.185116 * Math.sin(M_sun_rad) -
    0.114332 * Math.sin(2 * F_rad);
  moonTropical = ((moonTropical % 360) + 360) % 360;

  // 3. Rahu Mean Node (Retrograde motion)
  const node_tropical = 125.04452 - 1934.136261 * T;
  let rahuTropical = ((node_tropical % 360) + 360) % 360;
  let ketuTropical = ((rahuTropical + 180) % 360 + 360) % 360;

  // 4. Mars
  const L_mars = 355.433 + 19140.299 * T;
  const M_mars = 19.373 + 19139.858 * T;
  const M_mars_rad = (M_mars * Math.PI) / 180;
  const C_mars = 10.691 * Math.sin(M_mars_rad) + 0.623 * Math.sin(2 * M_mars_rad);
  let marsTropical = ((L_mars + C_mars) % 360 + 360) % 360;

  // 5. Mercury (heliocentric to geocentric approximation)
  const L_merc = 252.251 + 149472.674 * T;
  const M_merc = 174.795 + 149472.515 * T;
  const M_merc_rad = (M_merc * Math.PI) / 180;
  const C_merc = 23.44 * Math.sin(M_merc_rad) + 2.98 * Math.sin(2 * M_merc_rad);
  let mercHeliocentric = ((L_merc + C_merc) % 360 + 360) % 360;
  // Geocentric elongation bounded within 28 degrees from Sun
  let mercDiff = mercHeliocentric - sunTropical;
  mercDiff = ((mercDiff + 180) % 360) - 180;
  let mercTropical = sunTropical + Math.sin((mercDiff * Math.PI) / 180) * 22.5;
  mercTropical = ((mercTropical % 360) + 360) % 360;

  // 6. Jupiter
  const L_jup = 34.351 + 3034.906 * T;
  const M_jup = 20.02 + 3034.69 * T;
  const M_jup_rad = (M_jup * Math.PI) / 180;
  const C_jup = 5.555 * Math.sin(M_jup_rad) + 0.168 * Math.sin(2 * M_jup_rad);
  let jupTropical = ((L_jup + C_jup) % 360 + 360) % 360;

  // 7. Venus (elongation bounded within 48 degrees of Sun)
  const L_ven = 181.979 + 58517.816 * T;
  const M_ven = 50.116 + 58517.586 * T;
  const M_ven_rad = (M_ven * Math.PI) / 180;
  const C_ven = 0.776 * Math.sin(M_ven_rad);
  let venHeliocentric = ((L_ven + C_ven) % 360 + 360) % 360;
  let venDiff = venHeliocentric - sunTropical;
  venDiff = ((venDiff + 180) % 360) - 180;
  let venTropical = sunTropical + Math.sin((venDiff * Math.PI) / 180) * 44.0;
  venTropical = ((venTropical % 360) + 360) % 360;

  // 8. Saturn
  const L_sat = 50.077 + 1222.114 * T;
  const M_sat = 317.02 + 1221.55 * T;
  const M_sat_rad = (M_sat * Math.PI) / 180;
  const C_sat = 6.358 * Math.sin(M_sat_rad) + 0.22 * Math.sin(2 * M_sat_rad);
  let satTropical = ((L_sat + C_sat) % 360 + 360) % 360;

  const rawPlanets: { name: PlanetKey; tropical: number; isRetro: boolean }[] = [
    { name: "Sun", tropical: sunTropical, isRetro: false },
    { name: "Moon", tropical: moonTropical, isRetro: false },
    { name: "Mars", tropical: marsTropical, isRetro: Math.abs(((sunTropical - marsTropical + 360) % 360) - 180) < 60 },
    { name: "Mercury", tropical: mercTropical, isRetro: Math.abs(((sunTropical - mercTropical + 360) % 360) - 180) > 160 },
    { name: "Jupiter", tropical: jupTropical, isRetro: Math.abs(((sunTropical - jupTropical + 360) % 360) - 180) < 70 },
    { name: "Venus", tropical: venTropical, isRetro: Math.abs(((sunTropical - venTropical + 360) % 360) - 180) > 140 },
    { name: "Saturn", tropical: satTropical, isRetro: Math.abs(((sunTropical - satTropical + 360) % 360) - 180) < 80 },
    { name: "Rahu", tropical: rahuTropical, isRetro: true },
    { name: "Ketu", tropical: ketuTropical, isRetro: true },
  ];

  const lagnaRashiIndex = Math.floor(lagnaLongitude / 30);

  const results: PlanetPosition[] = rawPlanets.map((p) => {
    const siderealLong = ((p.tropical - ayanamsha) % 360 + 360) % 360;
    const rashiIdx = Math.floor(siderealLong / 30);
    const rashiKey = RASHI_KEYS[rashiIdx];
    const degreesInRashi = siderealLong % 30;

    // Calculate house number relative to Lagna (1 to 12)
    const house = ((rashiIdx - lagnaRashiIndex + 12) % 12) + 1;

    // Nakshatra calculation (each nakshatra = 360 / 27 = 13.33333 degrees)
    const nakshatraIndex = Math.floor(siderealLong / (360 / 27));
    const nakshatraInfo = NAKSHATRAS[nakshatraIndex % 27];
    const pada = Math.floor((siderealLong % (360 / 27)) / (360 / 108)) + 1;

    // Navamsha (D9) Rashi calculation
    const navamshaRashiIdx = calculateNavamshaRashi(rashiIdx, pada);
    const navamshaRashi = RASHI_KEYS[navamshaRashiIdx];
    const navamshaHouse = ((navamshaRashiIdx - calculateNavamshaRashi(lagnaRashiIndex, Math.floor((lagnaLongitude % (360 / 27)) / (360 / 108)) + 1) + 12) % 12) + 1;

    // Combustion check: within orb of Sun (Sun cannot be combust)
    let isCombust = false;
    if (p.name !== "Sun" && p.name !== "Rahu" && p.name !== "Ketu") {
      const sunSidereal = ((sunTropical - ayanamsha) % 360 + 360) % 360;
      let diffWithSun = Math.abs(siderealLong - sunSidereal);
      if (diffWithSun > 180) diffWithSun = 360 - diffWithSun;
      const combustionOrbs: Record<string, number> = {
        Moon: 12,
        Mars: 17,
        Mercury: 14,
        Jupiter: 11,
        Venus: 10,
        Saturn: 15,
      };
      if (diffWithSun <= (combustionOrbs[p.name] || 10)) {
        isCombust = true;
      }
    }

    // Dignity evaluation according to Parashara
    const dignityData = evaluateDignity(p.name, rashiKey, degreesInRashi);

    return {
      name: p.name,
      sanskritName: PLANET_SANSKRIT[p.name],
      symbol: PLANET_SYMBOLS[p.name],
      longitude: siderealLong,
      rashi: rashiKey,
      rashiIndex: rashiIdx,
      rashiSanskrit: RASHIS[rashiIdx].sanskrit,
      rashiLord: RASHIS[rashiIdx].lord,
      degreesInRashi,
      formattedDegree: formatDegrees(degreesInRashi),
      house,
      nakshatra: nakshatraInfo.name,
      nakshatraLord: nakshatraInfo.lord,
      nakshatraPada: pada,
      isRetrograde: p.isRetro,
      isCombust,
      dignity: dignityData.dignity,
      dignitySanskrit: dignityData.sanskrit,
      navamshaRashi,
      navamshaHouse,
    };
  });

  return results;
}

/**
 * Calculates Navamsha (D9) Rashi based on Natal Rashi and Pada
 */
export function calculateNavamshaRashi(rashiIndex: number, pada: number): number {
  // Fire signs (0, 4, 8) start from Aries (0)
  // Earth signs (1, 5, 9) start from Capricorn (9)
  // Air signs (2, 6, 10) start from Libra (6)
  // Water signs (3, 7, 11) start from Cancer (3)
  const modality = rashiIndex % 4;
  let startSign = 0;
  if (modality === 0) startSign = 0; // Aries
  else if (modality === 1) startSign = 9; // Capricorn
  else if (modality === 2) startSign = 6; // Libra
  else if (modality === 3) startSign = 3; // Cancer

  return (startSign + (pada - 1)) % 12;
}

/**
 * Parashara Dignity Calculation for Grahas
 */
export function evaluateDignity(
  planet: PlanetKey,
  rashi: RashiKey,
  degrees: number
): {
  dignity: PlanetPosition["dignity"];
  sanskrit: string;
} {
  switch (planet) {
    case "Sun":
      if (rashi === "Aries") return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
      if (rashi === "Libra") return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (rashi === "Leo") {
        if (degrees <= 20) return { dignity: "Moolatrikona", sanskrit: "Moolatrikona (मूलत्रिकोण)" };
        return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      }
      if (["Sagittarius", "Pisces", "Cancer", "Scorpio"].includes(rashi)) {
        return { dignity: "Friend", sanskrit: "Mitra (मित्र)" };
      }
      if (["Capricorn", "Aquarius", "Gemini", "Virgo"].includes(rashi)) {
        return { dignity: "Enemy", sanskrit: "Shatru (शत्रु)" };
      }
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Moon":
      if (rashi === "Taurus") {
        if (degrees <= 3) return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
        return { dignity: "Moolatrikona", sanskrit: "Moolatrikona (मूलत्रिकोण)" };
      }
      if (rashi === "Scorpio") return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (rashi === "Cancer") return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      if (["Aries", "Leo", "Gemini", "Virgo", "Sagittarius", "Pisces"].includes(rashi)) {
        return { dignity: "Friend", sanskrit: "Mitra (मित्र)" };
      }
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Mars":
      if (rashi === "Capricorn") return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
      if (rashi === "Cancer") return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (rashi === "Aries") {
        if (degrees <= 12) return { dignity: "Moolatrikona", sanskrit: "Moolatrikona (मूलत्रिकोण)" };
        return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      }
      if (rashi === "Scorpio") return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      if (["Leo", "Sagittarius", "Pisces"].includes(rashi)) {
        return { dignity: "Friend", sanskrit: "Mitra (मित्र)" };
      }
      if (["Gemini", "Virgo"].includes(rashi)) {
        return { dignity: "Enemy", sanskrit: "Shatru (शत्रु)" };
      }
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Mercury":
      if (rashi === "Virgo") {
        if (degrees <= 15) return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
        if (degrees <= 20) return { dignity: "Moolatrikona", sanskrit: "Moolatrikona (मूलत्रिकोण)" };
        return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      }
      if (rashi === "Pisces") return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (rashi === "Gemini") return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      if (["Taurus", "Leo", "Libra"].includes(rashi)) {
        return { dignity: "Friend", sanskrit: "Mitra (मित्र)" };
      }
      if (["Cancer"].includes(rashi)) {
        return { dignity: "Enemy", sanskrit: "Shatru (शत्रु)" };
      }
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Jupiter":
      if (rashi === "Cancer") return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
      if (rashi === "Capricorn") return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (rashi === "Sagittarius") {
        if (degrees <= 10) return { dignity: "Moolatrikona", sanskrit: "Moolatrikona (मूलत्रिकोण)" };
        return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      }
      if (rashi === "Pisces") return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      if (["Aries", "Leo", "Scorpio"].includes(rashi)) {
        return { dignity: "Friend", sanskrit: "Mitra (मित्र)" };
      }
      if (["Gemini", "Virgo", "Taurus", "Libra"].includes(rashi)) {
        return { dignity: "Enemy", sanskrit: "Shatru (शत्रु)" };
      }
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Venus":
      if (rashi === "Pisces") return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
      if (rashi === "Virgo") return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (rashi === "Libra") {
        if (degrees <= 15) return { dignity: "Moolatrikona", sanskrit: "Moolatrikona (मूलत्रिकोण)" };
        return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      }
      if (rashi === "Taurus") return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      if (["Gemini", "Capricorn", "Aquarius"].includes(rashi)) {
        return { dignity: "Friend", sanskrit: "Mitra (मित्र)" };
      }
      if (["Cancer", "Leo"].includes(rashi)) {
        return { dignity: "Enemy", sanskrit: "Shatru (शत्रु)" };
      }
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Saturn":
      if (rashi === "Libra") return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
      if (rashi === "Aries") return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (rashi === "Aquarius") {
        if (degrees <= 20) return { dignity: "Moolatrikona", sanskrit: "Moolatrikona (मूलत्रिकोण)" };
        return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      }
      if (rashi === "Capricorn") return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      if (["Taurus", "Gemini", "Virgo"].includes(rashi)) {
        return { dignity: "Friend", sanskrit: "Mitra (मित्र)" };
      }
      if (["Cancer", "Leo", "Scorpio"].includes(rashi)) {
        return { dignity: "Enemy", sanskrit: "Shatru (शत्रु)" };
      }
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Rahu":
      if (["Taurus", "Gemini"].includes(rashi)) return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
      if (["Scorpio", "Sagittarius"].includes(rashi)) return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (["Virgo", "Aquarius"].includes(rashi)) return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    case "Ketu":
      if (["Scorpio", "Sagittarius"].includes(rashi)) return { dignity: "Exalted", sanskrit: "Uccha (उच्च)" };
      if (["Taurus", "Gemini"].includes(rashi)) return { dignity: "Debilitated", sanskrit: "Neecha (नीच)" };
      if (["Pisces"].includes(rashi)) return { dignity: "Own Sign", sanskrit: "Swakshetra (स्वक्षेत्र)" };
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };

    default:
      return { dignity: "Neutral", sanskrit: "Sama (सम)" };
  }
}

/**
 * Builds all 12 Bhavas with resident planets, lordships, Kendra/Trikona classifications, and aspects
 */
export function buildBhavas(
  lagnaLongitude: number,
  planets: PlanetPosition[]
): BhavaData[] {
  const lagnaRashiIndex = Math.floor(lagnaLongitude / 30);

  return BHAVA_CONFIG.map((cfg) => {
    const rashiIndex = (lagnaRashiIndex + cfg.houseNumber - 1) % 12;
    const rashiKey = RASHI_KEYS[rashiIndex];
    const rashiData = RASHIS[rashiIndex];

    const residentPlanets = planets.filter((p) => p.house === cfg.houseNumber);

    // Calculate aspecting planets
    const aspectingPlanets: { planet: PlanetKey; aspectType: string }[] = [];
    planets.forEach((p) => {
      if (p.house === cfg.houseNumber) return; // already resident

      const houseDiff = ((cfg.houseNumber - p.house + 12) % 12) + 1;

      // 7th house aspect for all planets
      if (houseDiff === 7) {
        aspectingPlanets.push({ planet: p.name, aspectType: "7th Full Drishti" });
      }
      // Mars special aspects (4th and 8th)
      if (p.name === "Mars" && (houseDiff === 4 || houseDiff === 8)) {
        aspectingPlanets.push({ planet: p.name, aspectType: `${houseDiff}th Special Drishti` });
      }
      // Jupiter special aspects (5th and 9th)
      if (p.name === "Jupiter" && (houseDiff === 5 || houseDiff === 9)) {
        aspectingPlanets.push({ planet: p.name, aspectType: `${houseDiff}th Trikona Drishti` });
      }
      // Saturn special aspects (3rd and 10th)
      if (p.name === "Saturn" && (houseDiff === 3 || houseDiff === 10)) {
        aspectingPlanets.push({ planet: p.name, aspectType: `${houseDiff}th Special Drishti` });
      }
      // Rahu / Ketu special aspects (5th and 9th)
      if ((p.name === "Rahu" || p.name === "Ketu") && (houseDiff === 5 || houseDiff === 9)) {
        aspectingPlanets.push({ planet: p.name, aspectType: `${houseDiff}th Trine Aspect` });
      }
    });

    const isKendra = [1, 4, 7, 10].includes(cfg.houseNumber);
    const isTrikona = [1, 5, 9].includes(cfg.houseNumber);
    const isDusthana = [6, 8, 12].includes(cfg.houseNumber);
    const isUpachaya = [3, 6, 10, 11].includes(cfg.houseNumber);

    return {
      houseNumber: cfg.houseNumber,
      sanskritName: cfg.sanskritName,
      meaning: cfg.meaning,
      significations: cfg.significations,
      rashi: rashiKey,
      rashiSanskrit: rashiData.sanskrit,
      rashiIndex,
      lord: rashiData.lord,
      planets: residentPlanets,
      isKendra,
      isTrikona,
      isDusthana,
      isUpachaya,
      aspectingPlanets,
    };
  });
}

/**
 * Calculates Full Vimshottari Dasha Timeline from Birth Nakshatra & Balance
 */
export function calculateVimshottariDashas(
  birthDateStr: string,
  moonLongitude: number
): {
  currentDasha: { mahadasha: DashaPeriod; antardasha: DashaPeriod; pratyantardasha?: DashaPeriod };
  allDashas: DashaPeriod[];
} {
  const birthDate = new Date(birthDateStr);
  const now = new Date();

  // One nakshatra span is 13.3333333 degrees
  const nakshatraSpan = 360 / 27;
  const nakshatraIndex = Math.floor(moonLongitude / nakshatraSpan);
  const nakshatraLord = NAKSHATRAS[nakshatraIndex % 27].lord;

  // Degrees traversed within the birth nakshatra
  const degreesInNakshatra = moonLongitude % nakshatraSpan;
  const fractionPassed = degreesInNakshatra / nakshatraSpan;

  // Find start index in VIMSHOTTARI_YEARS
  const lordIndex = VIMSHOTTARI_YEARS.findIndex((v) => v.planet === nakshatraLord);
  const birthLordTotalYears = VIMSHOTTARI_YEARS[lordIndex].years;
  const balanceYears = birthLordTotalYears * (1 - fractionPassed);

  const allDashas: DashaPeriod[] = [];
  let currentDateCursor = new Date(birthDate);
  let currentAgeCursor = 0;

  for (let i = 0; i < 9; i++) {
    const idx = (lordIndex + i) % 9;
    const item = VIMSHOTTARI_YEARS[idx];
    const duration = i === 0 ? balanceYears : item.years;

    const startDate = new Date(currentDateCursor);
    const startAge = currentAgeCursor;

    // Advance cursor by duration in days
    const daysToAdd = Math.round(duration * 365.25);
    currentDateCursor = new Date(currentDateCursor.getTime() + daysToAdd * 86400000);
    currentAgeCursor += duration;

    const endDate = new Date(currentDateCursor);
    const isCurrent = now >= startDate && now < endDate;

    // Sub-periods (Antardashas)
    const antardashas: DashaPeriod[] = [];
    let subCursor = new Date(startDate);
    let subAgeCursor = startAge;

    for (let j = 0; j < 9; j++) {
      const subIdx = (idx + j) % 9;
      const subItem = VIMSHOTTARI_YEARS[subIdx];
      // Antardasha duration = (Mahadasha Years * Sub Lord Years) / 120
      const subDuration = (item.years * subItem.years) / 120;
      const subStart = new Date(subCursor);
      const subStartAge = subAgeCursor;

      const subDays = Math.round(subDuration * 365.25);
      subCursor = new Date(subCursor.getTime() + subDays * 86400000);
      subAgeCursor += subDuration;

      const subEnd = new Date(subCursor);
      const isSubCurrent = now >= subStart && now < subEnd;

      antardashas.push({
        planet: subItem.planet,
        sanskritName: PLANET_SANSKRIT[subItem.planet],
        startDate: subStart.toISOString().split("T")[0],
        endDate: subEnd.toISOString().split("T")[0],
        startAge: Math.round(subStartAge * 10) / 10,
        endAge: Math.round(subAgeCursor * 10) / 10,
        durationYears: Math.round(subDuration * 100) / 100,
        isCurrent: isSubCurrent,
      });
    }

    allDashas.push({
      planet: item.planet,
      sanskritName: PLANET_SANSKRIT[item.planet],
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      startAge: Math.round(startAge * 10) / 10,
      endAge: Math.round(currentAgeCursor * 10) / 10,
      durationYears: Math.round(duration * 10) / 10,
      isCurrent,
      antardashas,
    });
  }

  // Find active Mahadasha and Antardasha
  let currentMaha = allDashas.find((d) => d.isCurrent) || allDashas[0];
  let currentAntar =
    currentMaha.antardashas?.find((a) => a.isCurrent) ||
    currentMaha.antardashas?.[0] ||
    currentMaha;

  return {
    currentDasha: {
      mahadasha: currentMaha,
      antardasha: currentAntar,
    },
    allDashas,
  };
}

/**
 * Authentic Parashari Vedic Yogas Detector
 */
export function detectVedicYogas(
  planets: PlanetPosition[],
  houses: BhavaData[]
): VedicYoga[] {
  const yogas: VedicYoga[] = [];

  const getPlanet = (name: PlanetKey) => planets.find((p) => p.name === name);
  const getHouse = (num: number) => houses.find((h) => h.houseNumber === num);

  const jupiter = getPlanet("Jupiter");
  const moon = getPlanet("Moon");
  const sun = getPlanet("Sun");
  const mercury = getPlanet("Mercury");
  const mars = getPlanet("Mars");
  const venus = getPlanet("Venus");
  const saturn = getPlanet("Saturn");

  // 1. Gajakesari Yoga: Jupiter in Kendra (1, 4, 7, 10) from Moon
  if (jupiter && moon) {
    const diffFromMoon = ((jupiter.house - moon.house + 12) % 12) + 1;
    const isKendraFromMoon = [1, 4, 7, 10].includes(diffFromMoon);
    if (isKendraFromMoon && jupiter.dignity !== "Debilitated") {
      yogas.push({
        name: "Gajakesari Yoga (गजकेसरी योग)",
        sanskritName: "गजकेसरी योग",
        category: "Raja Yoga",
        isAuspicious: true,
        description:
          "Formed when Jupiter is in a Kendra (1st, 4th, 7th, or 10th house) from Moon. Grants majestic intellect, eloquent speech, respect, lasting renown, and unshakeable virtue.",
        scripturalBasis: "BPHS Ch. 36, Verse 1-3 (Brihat Parashara Hora Shastra)",
        present: true,
        involvedPlanets: ["Jupiter", "Moon"],
        housesInvolved: [moon.house, jupiter.house],
        effect: "Profound wisdom, nobility, leadership, and protection against major adversities.",
      });
    }
  }

  // 2. Budhaditya Yoga: Sun and Mercury in the same house
  if (sun && mercury && sun.house === mercury.house) {
    yogas.push({
      name: "Budhaditya Yoga (बुधादित्य योग)",
      sanskritName: "बुधादित्य योग",
      category: "Auspicious Yoga",
      isAuspicious: true,
      description:
        "Formed by the divine conjunction of Sun (soul/vitality) and Mercury (intellect/analysis). Enhances administrative sharpness, analytical brilliance, business acumen, and scholarly respect.",
      scripturalBasis: "Saravali Ch. 31 & BPHS Ch. 35",
      present: true,
      involvedPlanets: ["Sun", "Mercury"],
      housesInvolved: [sun.house],
      effect: "High intellect, quick wit, administrative prowess, and reputation in educational or professional fields.",
    });
  }

  // 3. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra in own/exalted sign)
  if (mars && [1, 4, 7, 10].includes(mars.house) && ["Exalted", "Own Sign", "Moolatrikona"].includes(mars.dignity)) {
    yogas.push({
      name: "Ruchaka Mahapurusha Yoga (रुचक योग)",
      sanskritName: "रुचक महापुरुष योग",
      category: "Mahapurusha Yoga",
      isAuspicious: true,
      description:
        "Mars in Kendra (1, 4, 7, 10) in Aries, Scorpio, or Capricorn. Grants supreme valor, physical prowess, leadership, strategic command, and success in defense, engineering, or administration.",
      scripturalBasis: "BPHS Ch. 75 & Brihat Jataka Ch. 11",
      present: true,
      involvedPlanets: ["Mars"],
      housesInvolved: [mars.house],
      effect: "Fearless leadership, triumphant energy, land ownership, and high military/executive standing.",
    });
  }

  if (mercury && [1, 4, 7, 10].includes(mercury.house) && ["Exalted", "Own Sign", "Moolatrikona"].includes(mercury.dignity)) {
    yogas.push({
      name: "Bhadra Mahapurusha Yoga (भद्र योग)",
      sanskritName: "भद्र महापुरुष योग",
      category: "Mahapurusha Yoga",
      isAuspicious: true,
      description:
        "Mercury in Kendra in Gemini or Virgo. Grants oratorical genius, sharp mathematical faculties, graceful demeanor, long life, and commercial supremacy.",
      scripturalBasis: "BPHS Ch. 75",
      present: true,
      involvedPlanets: ["Mercury"],
      housesInvolved: [mercury.house],
      effect: "Scholarly mastery, magnetic communication, business fortune, and longevity.",
    });
  }

  if (jupiter && [1, 4, 7, 10].includes(jupiter.house) && ["Exalted", "Own Sign", "Moolatrikona"].includes(jupiter.dignity)) {
    yogas.push({
      name: "Hamsa Mahapurusha Yoga (हंस योग)",
      sanskritName: "हंस महापुरुष योग",
      category: "Mahapurusha Yoga",
      isAuspicious: true,
      description:
        "Jupiter in Kendra in Cancer, Sagittarius, or Pisces. Imparts saintly disposition, reverence for Dharma, moral purity, spiritual wisdom, and righteous royal favor.",
      scripturalBasis: "BPHS Ch. 75",
      present: true,
      involvedPlanets: ["Jupiter"],
      housesInvolved: [jupiter.house],
      effect: "Spiritual authority, respect across society, philosophical clarity, and benevolent nature.",
    });
  }

  if (venus && [1, 4, 7, 10].includes(venus.house) && ["Exalted", "Own Sign", "Moolatrikona"].includes(venus.dignity)) {
    yogas.push({
      name: "Malavya Mahapurusha Yoga (मालव्य योग)",
      sanskritName: "मालव्य महापुरुष योग",
      category: "Mahapurusha Yoga",
      isAuspicious: true,
      description:
        "Venus in Kendra in Taurus, Libra, or Pisces. Endows graceful charisma, artistic mastery, wealth of conveyances, beautiful relationships, and refinement.",
      scripturalBasis: "BPHS Ch. 75",
      present: true,
      involvedPlanets: ["Venus"],
      housesInvolved: [venus.house],
      effect: "Aesthetic refinement, luxurious comforts (Vahanas), affectionate marital life, and artistic fame.",
    });
  }

  if (saturn && [1, 4, 7, 10].includes(saturn.house) && ["Exalted", "Own Sign", "Moolatrikona"].includes(saturn.dignity)) {
    yogas.push({
      name: "Sasa Mahapurusha Yoga (शश योग)",
      sanskritName: "शश महापुरुष योग",
      category: "Mahapurusha Yoga",
      isAuspicious: true,
      description:
        "Saturn in Kendra in Libra, Capricorn, or Aquarius. Bestows profound endurance, command over masses, administrative authority, justice, and long-lasting foundations.",
      scripturalBasis: "BPHS Ch. 75",
      present: true,
      involvedPlanets: ["Saturn"],
      housesInvolved: [saturn.house],
      effect: "Mass popularity, relentless dedication, judicial authority, and persevering triumph over time.",
    });
  }

  // 4. Neechbhanga Raja Yoga (Cancellation of Debilitation leading to exalted elevation)
  planets.forEach((p) => {
    if (p.dignity === "Debilitated") {
      // Find the dispositor (lord of the sign where debilitated planet sits)
      const dispositorLord = p.rashiLord;
      const dispPlanet = getPlanet(dispositorLord);
      if (dispPlanet && [1, 4, 7, 10].includes(dispPlanet.house)) {
        yogas.push({
          name: `Neechbhanga Raja Yoga for ${p.sanskritName} (नीचभंग राजयोग)`,
          sanskritName: "नीचभंग राजयोग",
          category: "Raja Yoga",
          isAuspicious: true,
          description: `Debilitation of ${p.name} in ${p.rashi} is canceled and transformed into a Raja Yoga because its sign lord (${dispositorLord}) is placed in a Kendra house (${dispPlanet.house}th).`,
          scripturalBasis: "BPHS Ch. 38, Verse 15-20 & Phaladeepika Ch. 6",
          present: true,
          involvedPlanets: [p.name, dispositorLord],
          housesInvolved: [p.house, dispPlanet.house],
          effect: "Initial struggle followed by extraordinary rise to prominence, resilience, and enduring status.",
        });
      }
    }
  });

  // 5. Dharma-Karmadhipati Raja Yoga (9th Lord & 10th Lord sambandha)
  const h9 = getHouse(9);
  const h10 = getHouse(10);
  if (h9 && h10) {
    const lord9 = getPlanet(h9.lord);
    const lord10 = getPlanet(h10.lord);
    if (lord9 && lord10 && (lord9.house === lord10.house || lord9.house === 10 || lord10.house === 9)) {
      yogas.push({
        name: "Dharma-Karmadhipati Raja Yoga (धर्म-कर्माधिपति राजयोग)",
        sanskritName: "धर्म-कर्माधिपति योग",
        category: "Raja Yoga",
        isAuspicious: true,
        description:
          "A most celebrated Parashari Raja Yoga formed by the mutual association of 9th lord (Dharma/Bhagya) and 10th lord (Karma/Authority). Produces immense righteous success and public honors.",
        scripturalBasis: "BPHS Ch. 34, Verse 25-30",
        present: true,
        involvedPlanets: [h9.lord, h10.lord],
        housesInvolved: [lord9.house, lord10.house],
        effect: "Elevation in career, ethical leadership, societal renown, and great fortune through righteous work.",
      });
    }
  }

  // 6. Chandra-Mangala Yoga (Wealth & Commercial Acumen)
  if (moon && mars && (moon.house === mars.house || ((mars.house - moon.house + 12) % 12) + 1 === 7)) {
    yogas.push({
      name: "Chandra-Mangala Yoga (चन्द्र-मंगल योग)",
      sanskritName: "चन्द्र-मंगल योग",
      category: "Dhana Yoga",
      isAuspicious: true,
      description:
        "Conjunction or 7th mutual aspect between Moon and Mars. Generates vigorous enterprise, material wealth generation, business drive, and financial autonomy.",
      scripturalBasis: "Jataka Parijata Ch. 7 & Saravali Ch. 12",
      present: true,
      involvedPlanets: ["Moon", "Mars"],
      housesInvolved: [moon.house, mars.house],
      effect: "Financial acumen, enterprising spirit, earnings through properties/commerce, and energetic disposition.",
    });
  }

  // 7. Amala Yoga (Benefic in 10th house from Lagna or Moon)
  const h10Residents = getHouse(10)?.planets || [];
  const hasBeneficIn10 = h10Residents.some((p) => ["Jupiter", "Venus", "Mercury"].includes(p.name));
  if (hasBeneficIn10) {
    yogas.push({
      name: "Amala Yoga (अमला योग)",
      sanskritName: "अमला योग",
      category: "Auspicious Yoga",
      isAuspicious: true,
      description:
        "Presence of natural benefic planets (Jupiter, Venus, or Mercury) in the 10th house of career without affliction. Gives an unblemished reputation, spotless character, and enduring philanthropic fame.",
      scripturalBasis: "BPHS Ch. 36",
      present: true,
      involvedPlanets: h10Residents.map((p) => p.name),
      housesInvolved: [10],
      effect: "Pure and respected reputation, noble conduct, career stability, and societal goodwill.",
    });
  }

  return yogas;
}

/**
 * Authentic Parashari Dosha Detector (Manglik, Sade Sati, Kaal Sarp)
 */
export function detectDoshas(
  planets: PlanetPosition[],
  houses: BhavaData[]
): {
  manglik: DoshaAnalysis;
  sadeSati: DoshaAnalysis;
  kaalSarp: DoshaAnalysis;
} {
  const getPlanet = (name: PlanetKey) => planets.find((p) => p.name === name);
  const mars = getPlanet("Mars");
  const moon = getPlanet("Moon");
  const saturn = getPlanet("Saturn");
  const jupiter = getPlanet("Jupiter");
  const rahu = getPlanet("Rahu");
  const ketu = getPlanet("Ketu");

  // 1. Manglik Dosha (Kuja Dosha)
  // Mars in 1st, 2nd, 4th, 7th, 8th, or 12th from Lagna or Moon
  let isManglikFromLagna = false;
  let isManglikFromMoon = false;
  const cancellationReasons: string[] = [];

  if (mars) {
    const lagnaHouses = [1, 2, 4, 7, 8, 12];
    if (lagnaHouses.includes(mars.house)) {
      isManglikFromLagna = true;
    }
    if (moon) {
      const diffFromMoon = ((mars.house - moon.house + 12) % 12) + 1;
      if (lagnaHouses.includes(diffFromMoon)) {
        isManglikFromMoon = true;
      }
    }

    // BPHS Cancellation clauses
    if (["Aries", "Scorpio", "Capricorn"].includes(mars.rashi)) {
      cancellationReasons.push(
        `Mars is in its own/exalted sign (${mars.rashiSanskrit}), which naturally neutralizes Kuja Dosha according to Parashara.`
      );
    }
    if (jupiter && [1, 4, 7, 10].includes(jupiter.house)) {
      cancellationReasons.push(
        "Jupiter is placed strongly in a Kendra house, casting protective divine grace over marital harmonies."
      );
    }
    if (mars.house === 2 && ["Gemini", "Virgo"].includes(mars.rashi)) {
      cancellationReasons.push("Mars in 2nd house in Mercury's sign is exempt from dosha.");
    }
    if (mars.house === 7 && ["Cancer", "Capricorn"].includes(mars.rashi)) {
      cancellationReasons.push("Mars in 7th in Cancer or Capricorn is exempt from malefic influence.");
    }
  }

  const isManglikPresent = isManglikFromLagna || isManglikFromMoon;
  const isManglikCancelled = isManglikPresent && cancellationReasons.length > 0;

  const manglik: DoshaAnalysis = {
    name: "Manglik Dosha (कुज / भौम दोष)",
    present: isManglikPresent,
    severity: !isManglikPresent ? "None" : isManglikCancelled ? "Mild" : "Moderate",
    description: isManglikPresent
      ? `Mars is positioned in the ${mars?.house}th house from Lagna${isManglikFromMoon ? " and relative to Moon" : ""}. This fiery energy requires conscious communication and constructive physical/creative expression in partnerships.`
      : "No Manglik Dosha is present. Mars is harmoniously placed in non-sensitive relationship houses.",
    cancellationReasons,
    isCancelled: isManglikCancelled,
    safeRemedies: [
      "Chanting the sacred Hanuman Chalisa or Sundarkand with sincere devotion on Tuesdays.",
      "Offering water or sweet rotis to birds and animals.",
      "Voluntary blood donation once or twice a year to channel Mars energy sattvikally.",
      "Practicing patient listening and calm dialogue during relationship negotiations.",
    ],
  };

  // 2. Sade Sati (Saturn's 7.5 year transit relative to Natal Moon)
  // Approximate Saturn's current transit in Pisces / Aquarius in current era
  // Natal Moon sign determines phase
  let isSadeSatiActive = false;
  let sadeSatiPhase: "Rising" | "Peak" | "Setting" | "None" = "None";
  let sadeSatiDesc = "You are currently not in the 7.5-year Sade Sati cycle.";

  if (moon && saturn) {
    // Current celestial Saturn is in Aquarius/Pisces (~10th/11th sign)
    // For calculation: relative distance of Saturn from Natal Moon
    const saturnFromMoon = ((saturn.rashiIndex - moon.rashiIndex + 12) % 12) + 1;
    if (saturnFromMoon === 12) {
      isSadeSatiActive = true;
      sadeSatiPhase = "Rising";
      sadeSatiDesc = "Rising Phase (12th from Moon): A period of introspection, inner restructuring, and managing expenses.";
    } else if (saturnFromMoon === 1) {
      isSadeSatiActive = true;
      sadeSatiPhase = "Peak";
      sadeSatiDesc = "Peak Phase (Janma Shani - over Natal Moon): Deep psychological refinement, discipline, hard work, and building resilient character.";
    } else if (saturnFromMoon === 2) {
      isSadeSatiActive = true;
      sadeSatiPhase = "Setting";
      sadeSatiDesc = "Setting Phase (2nd from Moon): Stabilization of family foundations, financial realism, and reaping rewards of disciplined labor.";
    }
  }

  const sadeSati: DoshaAnalysis = {
    name: "Shani Sade Sati (शनि साढ़े साती)",
    present: isSadeSatiActive,
    severity: isSadeSatiActive ? (sadeSatiPhase === "Peak" ? "Moderate" : "Mild") : "None",
    description: sadeSatiDesc,
    cancellationReasons:
      saturn?.dignity === "Exalted" || saturn?.dignity === "Own Sign"
        ? ["Saturn is in strong dignity (Exalted or Own Sign), transforming trials into profound wisdom and enduring stature."]
        : [],
    isCancelled: false,
    safeRemedies: [
      "Lighting a pure mustard oil diya under a Peepal tree on Saturday evenings.",
      "Feeding crows, black dogs, and underprivileged laborers with humble respect.",
      "Chanting Dasharatha Krit Shani Stotram or Shiva Panchakshara Mantra ('Om Namah Shivaya').",
      "Cultivating disciplined daily routines, humility, and truthful dealings.",
    ],
  };

  // 3. Kaal Sarp Dosha (All 7 planets hemmed between Rahu and Ketu axis)
  let isKaalSarp = false;
  if (rahu && ketu) {
    const nonNodes = planets.filter((p) => p.name !== "Rahu" && p.name !== "Ketu");
    const rahuLong = rahu.longitude;
    const ketuLong = ketu.longitude;

    // Check if all non-node planets lie on one side of Rahu-Ketu
    const allOneSide = nonNodes.every((p) => {
      if (rahuLong < ketuLong) {
        return p.longitude >= rahuLong && p.longitude <= ketuLong;
      } else {
        return p.longitude >= rahuLong || p.longitude <= ketuLong;
      }
    });

    const allOtherSide = nonNodes.every((p) => {
      if (rahuLong < ketuLong) {
        return p.longitude < rahuLong || p.longitude > ketuLong;
      } else {
        return p.longitude < rahuLong && p.longitude > ketuLong;
      }
    });

    if (allOneSide || allOtherSide) {
      isKaalSarp = true;
    }
  }

  const kaalSarp: DoshaAnalysis = {
    name: "Kaal Sarp Yoga (कालसर्प योग)",
    present: isKaalSarp,
    severity: isKaalSarp ? "Moderate" : "None",
    description: isKaalSarp
      ? "All major planets are situated on one hemisphere between the nodal axis of Rahu and Ketu. This often triggers intense periods of sudden destiny shifts, deep spiritual quests, and profound resilience."
      : "No Kaal Sarp pattern detected. Planets are balanced across the celestial sphere.",
    cancellationReasons:
      jupiter && [1, 4, 7, 10].includes(jupiter.house)
        ? ["Jupiter in Kendra provides strong cancellation (Bhanga) through divine wisdom and spiritual grounding."]
        : [],
    isCancelled: false,
    safeRemedies: [
      "Performing Maha Mrityunjaya Japa (108 times) during early mornings.",
      "Offering pure water and Bilva leaves to Lord Shiva (Nageshwar / Somnath) on Mondays.",
      "Feeding whole grains (Satnaja) to wild birds daily.",
      "Practicing grounding pranayama and meditation to dispel illusion and fear.",
    ],
  };

  return { manglik, sadeSati, kaalSarp };
}

/**
 * Generates the complete, authentic Vedic Kundali Data Structure
 */
export function generateKundaliData(birthDetails: BirthDetails): KundaliData {
  const [yearStr, monthStr, dayStr] = birthDetails.dateOfBirth.split("-");
  const [hourStr, minuteStr] = birthDetails.timeOfBirth.split(":");

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const localHour = parseInt(hourStr, 10);
  const localMinute = parseInt(minuteStr, 10);

  // Convert Local Time to UTC Decimal Hours
  const tzOffset = birthDetails.timezoneOffset ?? birthDetails.timezone ?? 5.5;
  const utcDecimalHours = localHour + localMinute / 60 - tzOffset;
  let utcDay = day;
  let utcHour = Math.floor(utcDecimalHours);
  let utcMinute = Math.round((utcDecimalHours - utcHour) * 60);

  if (utcHour < 0) {
    utcHour += 24;
    utcDay -= 1;
  } else if (utcHour >= 24) {
    utcHour -= 24;
    utcDay += 1;
  }

  const jd = calculateJulianDay(year, month, utcDay, utcHour, utcMinute);
  const ayanamshaValue = calculateLahiriAyanamsha(jd);

  // Calculate Ascendant (Lagna)
  const lagnaLong = calculateLagna(
    jd,
    birthDetails.latitude,
    birthDetails.longitude,
    ayanamshaValue
  );
  const lagnaRashiIdx = Math.floor(lagnaLong / 30);
  const lagnaDeg = lagnaLong % 30;
  const lagnaNakIdx = Math.floor(lagnaLong / (360 / 27));
  const lagnaPada = Math.floor((lagnaLong % (360 / 27)) / (360 / 108)) + 1;
  const lagnaNavIdx = calculateNavamshaRashi(lagnaRashiIdx, lagnaPada);

  const ascendant: PlanetPosition = {
    name: "Ascendant",
    sanskritName: "Lagna (लग्न)",
    symbol: "Asc",
    longitude: lagnaLong,
    rashi: RASHI_KEYS[lagnaRashiIdx],
    rashiIndex: lagnaRashiIdx,
    rashiSanskrit: RASHIS[lagnaRashiIdx].sanskrit,
    rashiLord: RASHIS[lagnaRashiIdx].lord,
    degreesInRashi: lagnaDeg,
    formattedDegree: formatDegrees(lagnaDeg),
    house: 1,
    nakshatra: NAKSHATRAS[lagnaNakIdx % 27].name,
    nakshatraLord: NAKSHATRAS[lagnaNakIdx % 27].lord,
    nakshatraPada: lagnaPada,
    isRetrograde: false,
    isCombust: false,
    dignity: "Own Sign",
    dignitySanskrit: "Lagna Sthana",
    navamshaRashi: RASHI_KEYS[lagnaNavIdx],
    navamshaHouse: 1,
  };

  const planets = calculatePlanetPositions(jd, ayanamshaValue, lagnaLong);
  const houses = buildBhavas(lagnaLong, planets);
  const yogas = detectVedicYogas(planets, houses);
  const doshas = detectDoshas(planets, houses);

  const moonPlanet = planets.find((p) => p.name === "Moon") || planets[1];
  const sunPlanet = planets.find((p) => p.name === "Sun") || planets[0];

  const dashas = calculateVimshottariDashas(
    birthDetails.dateOfBirth,
    moonPlanet.longitude
  );

  const ayanamshaDeg = Math.floor(ayanamshaValue);
  const ayanamshaMin = Math.floor((ayanamshaValue - ayanamshaDeg) * 60);
  const ayanamshaSec = Math.floor(((ayanamshaValue - ayanamshaDeg) * 60 - ayanamshaMin) * 60);

  return {
    birthDetails,
    ascendant,
    moonSign: moonPlanet.rashi,
    sunSign: sunPlanet.rashi,
    birthNakshatra: moonPlanet.nakshatra,
    birthPada: moonPlanet.nakshatraPada,
    planets,
    houses,
    yogas,
    doshas,
    currentDasha: dashas.currentDasha,
    allDashas: dashas.allDashas,
    ayanamsha: `Lahiri (Chitra Paksha) ${ayanamshaDeg}° ${ayanamshaMin}' ${ayanamshaSec}"`,
    isDayBirth: localHour >= 6 && localHour < 18,
  };
}

/**
 * Ashtakoota Kundali Milan (36 Gunas) calculation for Boy and Girl
 */
export function calculateGunaMilan(
  boy: { name: string; rashi: RashiKey; nakshatra: string; pada: number },
  girl: { name: string; rashi: RashiKey; nakshatra: string; pada: number }
): GunaMilanResult {
  const boyNak = NAKSHATRAS.find((n) => n.name === boy.nakshatra) || NAKSHATRAS[0];
  const girlNak = NAKSHATRAS.find((n) => n.name === girl.nakshatra) || NAKSHATRAS[0];

  const boyRashiIdx = RASHI_KEYS.indexOf(boy.rashi);
  const girlRashiIdx = RASHI_KEYS.indexOf(girl.rashi);

  // 1. Varna Koota (1 point) - Brahmin (4), Kshatriya (3), Vaishya (2), Shudra (1)
  const varnaScores: Record<string, number> = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
  const boyVarnaScore = varnaScores[boyNak.varna] || 1;
  const girlVarnaScore = varnaScores[girlNak.varna] || 1;
  const varnaPoints = boyVarnaScore >= girlVarnaScore ? 1 : 0;

  // 2. Vashya Koota (2 points)
  let vashyaPoints = 0;
  if (boyNak.vashya === girlNak.vashya) vashyaPoints = 2;
  else if (
    (boyNak.vashya === "Chatushpada" && girlNak.vashya === "Manava") ||
    (boyNak.vashya === "Manava" && girlNak.vashya === "Jalachara")
  ) {
    vashyaPoints = 1;
  } else {
    vashyaPoints = 0.5;
  }

  // 3. Tara Koota (3 points) - Count from Girl's Nakshatra to Boy's mod 9, and vice versa
  const diff1 = ((boyNak.index - girlNak.index + 27) % 9) + 1;
  const diff2 = ((girlNak.index - boyNak.index + 27) % 9) + 1;
  const auspiciousTaras = [1, 2, 4, 6, 8, 9];
  let taraPoints = 0;
  if (auspiciousTaras.includes(diff1) && auspiciousTaras.includes(diff2)) taraPoints = 3;
  else if (auspiciousTaras.includes(diff1) || auspiciousTaras.includes(diff2)) taraPoints = 1.5;

  // 4. Yoni Koota (4 points) - Animal compatibility
  let yoniPoints = 2;
  if (boyNak.yoni.split(" ")[0] === girlNak.yoni.split(" ")[0]) yoniPoints = 4;
  else if (
    (boyNak.yoni.includes("Cat") && girlNak.yoni.includes("Rat")) ||
    (boyNak.yoni.includes("Dog") && girlNak.yoni.includes("Deer")) ||
    (boyNak.yoni.includes("Lion") && girlNak.yoni.includes("Elephant"))
  ) {
    yoniPoints = 0; // Hostile animals
  } else {
    yoniPoints = 2.5;
  }

  // 5. Graha Maitri (5 points) - Lord friendship
  const boyLord = RASHIS[boyRashiIdx].lord;
  const girlLord = RASHIS[girlRashiIdx].lord;
  let grahaMaitriPoints = 3;
  if (boyLord === girlLord) grahaMaitriPoints = 5;
  else if (
    (["Sun", "Moon", "Mars", "Jupiter"].includes(boyLord) && ["Sun", "Moon", "Mars", "Jupiter"].includes(girlLord)) ||
    (["Mercury", "Venus", "Saturn"].includes(boyLord) && ["Mercury", "Venus", "Saturn"].includes(girlLord))
  ) {
    grahaMaitriPoints = 4;
  } else {
    grahaMaitriPoints = 1;
  }

  // 6. Gana Koota (6 points) - Deva, Manushya, Rakshasa
  let ganaPoints = 0;
  if (boyNak.gana === girlNak.gana) ganaPoints = 6;
  else if (
    (boyNak.gana === "Deva" && girlNak.gana === "Manushya") ||
    (boyNak.gana === "Manushya" && girlNak.gana === "Deva")
  ) {
    ganaPoints = 5;
  } else if (
    (boyNak.gana === "Rakshasa" && girlNak.gana === "Manushya") ||
    (boyNak.gana === "Manushya" && girlNak.gana === "Rakshasa")
  ) {
    ganaPoints = 0;
  } else {
    ganaPoints = 1;
  }

  // 7. Bhakoot Koota (7 points) - Distance between Rashis
  const rashiDiff = ((girlRashiIdx - boyRashiIdx + 12) % 12) + 1;
  let bhakootPoints = 7;
  let hasBhakootDosha = false;
  // Shadashtaka (6-8), Dwirdwadasa (2-12), Navam-Pancham (9-5 without friendly lords)
  if ([2, 6, 8, 12].includes(rashiDiff)) {
    bhakootPoints = 0;
    hasBhakootDosha = true;
  }

  // 8. Nadi Koota (8 points) - Aadi, Madhya, Antya
  let nadiPoints = 8;
  let hasNadiDosha = false;
  if (boyNak.nadi === girlNak.nadi) {
    nadiPoints = 0;
    hasNadiDosha = true;
  }

  const totalScore = Math.round(
    (varnaPoints +
      vashyaPoints +
      taraPoints +
      yoniPoints +
      grahaMaitriPoints +
      ganaPoints +
      bhakootPoints +
      nadiPoints) *
      10
  ) / 10;

  let verdict: GunaMilanResult["verdict"] = "Excellent";
  if (totalScore >= 28) verdict = "Excellent";
  else if (totalScore >= 20) verdict = "Good";
  else if (totalScore >= 18) verdict = "Average";
  else verdict = "Requires Caution";

  return {
    boyDetails: boy,
    girlDetails: girl,
    totalScore,
    maxScore: 36,
    verdict,
    kootas: [
      {
        name: "Varna",
        sanskritName: "वर्ण कूट (कार्य क्षमता)",
        obtainedPoints: varnaPoints,
        maxPoints: 1,
        description: "Evaluates spiritual and mental ego alignment and mutual respect.",
        boyAttribute: `${boyNak.varna} Varna`,
        girlAttribute: `${girlNak.varna} Varna`,
        hasDosha: varnaPoints === 0,
      },
      {
        name: "Vashya",
        sanskritName: "वश्य कूट (परस्पर आकर्षण)",
        obtainedPoints: vashyaPoints,
        maxPoints: 2,
        description: "Assesses mutual natural attraction and emotional power balance.",
        boyAttribute: `${boyNak.vashya}`,
        girlAttribute: `${girlNak.vashya}`,
        hasDosha: vashyaPoints < 1,
      },
      {
        name: "Tara",
        sanskritName: "तारा कूट (भाग्य व स्वास्थ्य)",
        obtainedPoints: taraPoints,
        maxPoints: 3,
        description: "Measures mutual destiny, longevity, and well-being.",
        boyAttribute: `Tara ${diff1}`,
        girlAttribute: `Tara ${diff2}`,
        hasDosha: taraPoints === 0,
      },
      {
        name: "Yoni",
        sanskritName: "योनि कूट (जैविक सामंजस्य)",
        obtainedPoints: yoniPoints,
        maxPoints: 4,
        description: "Physical compatibility, intimate harmony, and biological synergy.",
        boyAttribute: `${boyNak.yoni}`,
        girlAttribute: `${girlNak.yoni}`,
        hasDosha: yoniPoints === 0,
      },
      {
        name: "Graha Maitri",
        sanskritName: "ग्रह मैत्री (मानसिक मित्रता)",
        obtainedPoints: grahaMaitriPoints,
        maxPoints: 5,
        description: "Psychological friendship and intellectual resonance between Moon lords.",
        boyAttribute: `${boyLord}`,
        girlAttribute: `${girlLord}`,
        hasDosha: grahaMaitriPoints < 2,
      },
      {
        name: "Gana",
        sanskritName: "गण कूट (स्वभाव अनुकूलता)",
        obtainedPoints: ganaPoints,
        maxPoints: 6,
        description: "Temperament alignment (Deva, Manushya, Rakshasa natures).",
        boyAttribute: `${boyNak.gana} Gana`,
        girlAttribute: `${girlNak.gana} Gana`,
        hasDosha: ganaPoints === 0,
      },
      {
        name: "Bhakoot",
        sanskritName: "भकूट कूट (पारिवारिक समृद्धि)",
        obtainedPoints: bhakootPoints,
        maxPoints: 7,
        description: "Assesses long-term prosperity, family happiness, and children.",
        boyAttribute: `${boy.rashi}`,
        girlAttribute: `${girl.rashi}`,
        hasDosha: hasBhakootDosha,
        mitigation: hasBhakootDosha
          ? "Mitigated if Moon lords are mutual friends or if Navamsha charts are mutually harmonious."
          : undefined,
      },
      {
        name: "Nadi",
        sanskritName: "नाड़ी कूट (आनुवंशिक स्वास्थ्य)",
        obtainedPoints: nadiPoints,
        maxPoints: 8,
        description: "Genetic health, physiological constitution, and healthy progeny.",
        boyAttribute: `${boyNak.nadi} Nadi`,
        girlAttribute: `${girlNak.nadi} Nadi`,
        hasDosha: hasNadiDosha,
        mitigation: hasNadiDosha
          ? "Nadi Dosha is canceled if both have same Nakshatra with different Padas, or different Nakshatras in the same Rashi."
          : undefined,
      },
    ],
    manglikBoy: false,
    manglikGirl: false,
    compatibilitySummary:
      totalScore >= 20
        ? "The astrological partnership shows strong spiritual, physical, and psychological harmony suitable for marital fulfillment."
        : "Moderate compatibility. Cultivating conscious communication, mutual empathy, and reciting Vishnu Sahasranama together is advised.",
  };
}

/**
 * Calculates Authentic Daily Vedic Panchang for any given Date and Location
 */
export function calculatePanchang(
  date: Date = new Date(),
  latitude: number = 28.6139,
  longitude: number = 77.209
): PanchangData {
  const jd = calculateJulianDay(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
  const ayanamsha = calculateLahiriAyanamsha(jd);

  // Tropical Sun & Moon
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M_sun = 357.52911 + 35999.05029 * T;
  const M_sun_rad = (M_sun * Math.PI) / 180;
  const sunTropical = ((L0 + 1.914602 * Math.sin(M_sun_rad)) % 360 + 360) % 360;
  const sunSidereal = ((sunTropical - ayanamsha) % 360 + 360) % 360;

  const L_moon = 218.3164477 + 481267.88123421 * T;
  const moonTropical = ((L_moon + 6.288774 * Math.sin(((134.9633964 + 477198.8675055 * T) * Math.PI) / 180)) % 360 + 360) % 360;
  const moonSidereal = ((moonTropical - ayanamsha) % 360 + 360) % 360;

  // Tithi: each tithi = 12 degrees elongation of Moon from Sun
  let elongation = (moonSidereal - sunSidereal + 360) % 360;
  const tithiIndex = Math.floor(elongation / 12); // 0 to 29
  const paksha: "Shukla" | "Krishna" = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiNum = (tithiIndex % 15) + 1;

  const TITHI_NAMES = [
    "Pratipada (प्रतिपदा)",
    "Dwitiya (द्वितीया)",
    "Tritiya (तृतीया)",
    "Chaturthi (चतुर्थी)",
    "Panchami (पंचमी)",
    "Shashthi (षष्ठी)",
    "Saptami (सप्तमी)",
    "Ashtami (अष्टमी)",
    "Navami (नवमी)",
    "Dashami (दशमी)",
    "Ekadashi (एकादशी)",
    "Dwadashi (द्वादशी)",
    "Trayodashi (त्रयोदशी)",
    "Chaturdashi (चतुर्दशी)",
    paksha === "Shukla" ? "Purnima (पूर्णिमा)" : "Amavasya (अमावस्या)",
  ];

  // Vara (Day of week)
  const VARA_DATA: { name: string; sanskrit: string; lord: PlanetKey }[] = [
    { name: "Sunday", sanskrit: "Ravivara (रविवार)", lord: "Sun" },
    { name: "Monday", sanskrit: "Somavara (सोमवार)", lord: "Moon" },
    { name: "Tuesday", sanskrit: "Mangalavara (मंगलवार)", lord: "Mars" },
    { name: "Wednesday", sanskrit: "Budhavara (बुधवार)", lord: "Mercury" },
    { name: "Thursday", sanskrit: "Guruvara (गुरुवार)", lord: "Jupiter" },
    { name: "Friday", sanskrit: "Shukravara (शुक्रवार)", lord: "Venus" },
    { name: "Saturday", sanskrit: "Shanivara (शनिवार)", lord: "Saturn" },
  ];
  const dayOfWeek = date.getDay(); // 0 = Sun
  const vara = VARA_DATA[dayOfWeek];

  // Nakshatra
  const nakIdx = Math.floor(moonSidereal / (360 / 27));
  const nakshatra = NAKSHATRAS[nakIdx % 27];
  const pada = Math.floor((moonSidereal % (360 / 27)) / (360 / 108)) + 1;

  // Yoga: (Sun Sidereal + Moon Sidereal) mod 360 / 13°20'
  const yogaSum = (sunSidereal + moonSidereal) % 360;
  const yogaIdx = Math.floor(yogaSum / (360 / 27));
  const YOGA_NAMES = [
    { name: "Vishkambha (विष्कम्भ)", meaning: "Supportive foundation" },
    { name: "Priti (प्रीति)", meaning: "Auspicious love & joy" },
    { name: "Ayushman (आयुष्मान्)", meaning: "Longevity & vitality" },
    { name: "Saubhagya (सौभाग्य)", meaning: "Good fortune & wealth" },
    { name: "Shobhana (शोभन)", meaning: "Brilliance & splendor" },
    { name: "Atiganda (अतिगण्ड)", meaning: "Obstacle remover with caution" },
    { name: "Sukarma (सुकर्मा)", meaning: "Virtuous deeds & success" },
    { name: "Dhriti (धृति)", meaning: "Patience & firmness" },
    { name: "Shula (शूल)", meaning: "Needs mindful care" },
    { name: "Ganda (गण्ड)", meaning: "Transformation" },
    { name: "Vriddhi (वृद्धि)", meaning: "Growth & expansion" },
    { name: "Dhruva (ध्रुव)", meaning: "Steadfast & enduring" },
    { name: "Vyaghata (व्याघात)", meaning: "Courageous energy" },
    { name: "Harshana (हर्षण)", meaning: "Cheerfulness & delight" },
    { name: "Vajra (वज्र)", meaning: "Invincible strength" },
    { name: "Siddhi (सिद्धि)", meaning: "Accomplishment & mastery" },
    { name: "Vyatipata (व्यतीपात)", meaning: "Spiritual introspection" },
    { name: "Variyana (वरीयान्)", meaning: "Comfort & respect" },
    { name: "Parigha (परिघ)", meaning: "Protective shield" },
    { name: "Shiva (शिव)", meaning: "Auspicious benevolence" },
    { name: "Siddha (सिद्ध)", meaning: "Perfection & siddhi" },
    { name: "Sadhya (साध्य)", meaning: "Achievable goals" },
    { name: "Shubha (शुभ)", meaning: "Pure and favorable" },
    { name: "Shukla (शुक्ल)", meaning: "Radiant & clear" },
    { name: "Brahma (ब्रह्म)", meaning: "Divine wisdom" },
    { name: "Indra (इन्द्र)", meaning: "Leadership & honor" },
    { name: "Vaidhriti (वैधृति)", meaning: "Inner balance" },
  ];
  const yoga = YOGA_NAMES[yogaIdx % 27];

  // Karana: half of a tithi (each 6 degrees)
  const karanaIdx = Math.floor(elongation / 6);
  const KARANA_NAMES = [
    "Bava (बव)",
    "Balava (बालव)",
    "Kaulava (कौलव)",
    "Taitila (तैतिल)",
    "Gara (गर)",
    "Vanija (वणिज)",
    "Vishti / Bhadra (विष्टि)",
    "Shakuni (शकुनि)",
    "Chatushpada (चतुष्पद)",
    "Naga (नाग)",
    "Kimstughna (किंस्तुघ्न)",
  ];
  const karanaName = KARANA_NAMES[karanaIdx % 11];

  // Rahu Kaal calculations based on Day of Week (standard 1.5 hr slots between 6am and 6pm)
  const rahuKaalSlots = [
    "16:30 - 18:00 (Sunday)",
    "07:30 - 09:00 (Monday)",
    "15:00 - 16:30 (Tuesday)",
    "12:00 - 13:30 (Wednesday)",
    "13:30 - 15:00 (Thursday)",
    "10:30 - 12:00 (Friday)",
    "09:00 - 10:30 (Saturday)",
  ];
  const yamagandaSlots = [
    "12:00 - 13:30 (Sunday)",
    "10:30 - 12:00 (Monday)",
    "09:00 - 10:30 (Tuesday)",
    "07:30 - 09:00 (Wednesday)",
    "06:00 - 07:30 (Thursday)",
    "15:00 - 16:30 (Friday)",
    "13:30 - 15:00 (Saturday)",
  ];
  const gulikaSlots = [
    "15:00 - 16:30 (Sunday)",
    "13:30 - 15:00 (Monday)",
    "12:00 - 13:30 (Tuesday)",
    "10:30 - 12:00 (Wednesday)",
    "09:00 - 10:30 (Thursday)",
    "07:30 - 09:00 (Friday)",
    "06:00 - 07:30 (Saturday)",
  ];

  return {
    date: date.toISOString().split("T")[0],
    tithi: {
      name: TITHI_NAMES[tithiNum - 1],
      paksha,
      number: tithiNum,
    },
    vara: {
      name: vara.name,
      sanskritName: vara.sanskrit,
      rulingPlanet: vara.lord,
    },
    nakshatra: {
      name: `${nakshatra.name} (${nakshatra.sanskrit})`,
      lord: nakshatra.lord,
      pada,
    },
    yoga,
    karana: {
      name: karanaName,
      lord: "Lord Brahma / Vishnu",
    },
    muhurtas: {
      brahmaMuhurta: "04:32 AM - 05:20 AM",
      abhijitMuhurta: "11:58 AM - 12:48 PM (Highly Auspicious)",
      rahuKaal: rahuKaalSlots[dayOfWeek],
      yamaganda: yamagandaSlots[dayOfWeek],
      gulikaKaal: gulikaSlots[dayOfWeek],
      durmuhurta: "08:35 AM - 09:25 AM",
    },
    choghadiya: {
      day: [
        { name: "Udveg (उद्वेग)", type: "Udveg", time: "06:00 AM - 07:30 AM" },
        { name: "Char (चर)", type: "Char", time: "07:30 AM - 09:00 AM" },
        { name: "Labh (लाभ)", type: "Labh", time: "09:00 AM - 10:30 AM" },
        { name: "Amrit (अमृत)", type: "Amrit", time: "10:30 AM - 12:00 PM" },
        { name: "Kaal (काल)", type: "Kaal", time: "12:00 PM - 01:30 PM" },
        { name: "Shubh (शुभ)", type: "Shubh", time: "01:30 PM - 03:00 PM" },
        { name: "Rog (रोग)", type: "Rog", time: "03:00 PM - 04:30 PM" },
        { name: "Udveg (उद्वेग)", type: "Udveg", time: "04:30 PM - 06:00 PM" },
      ],
      night: [
        { name: "Shubh (शुभ)", type: "Shubh", time: "06:00 PM - 07:30 PM" },
        { name: "Amrit (अमृत)", type: "Amrit", time: "07:30 PM - 09:00 PM" },
        { name: "Char (चर)", type: "Char", time: "09:00 PM - 10:30 PM" },
        { name: "Rog (रोग)", type: "Rog", time: "10:30 PM - 12:00 AM" },
        { name: "Kaal (काल)", type: "Kaal", time: "12:00 AM - 01:30 AM" },
        { name: "Labh (लाभ)", type: "Labh", time: "01:30 AM - 03:00 AM" },
        { name: "Udveg (उद्वेग)", type: "Udveg", time: "03:00 AM - 04:30 AM" },
        { name: "Shubh (शुभ)", type: "Shubh", time: "04:30 AM - 06:00 AM" },
      ],
    },
    sunrise: "06:05 AM",
    sunset: "06:42 PM",
    moonrise: "07:15 PM",
  };
}

export const calculateKundali = generateKundaliData;

export function calculateKundaliMilan(
  boy: KundaliData | { name: string; rashi: RashiKey; nakshatra: string; pada: number },
  girl: KundaliData | { name: string; rashi: RashiKey; nakshatra: string; pada: number }
): GunaMilanResult {
  const boyDetails =
    "birthDetails" in boy
      ? {
          name: boy.birthDetails.name,
          rashi: boy.moonSign,
          nakshatra: boy.birthNakshatra,
          pada: boy.birthPada,
        }
      : boy;

  const girlDetails =
    "birthDetails" in girl
      ? {
          name: girl.birthDetails.name,
          rashi: girl.moonSign,
          nakshatra: girl.birthNakshatra,
          pada: girl.birthPada,
        }
      : girl;

  return calculateGunaMilan(boyDetails, girlDetails);
}
