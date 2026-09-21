/**
 * Authentic Vedic Astrology TypeScript Definitions
 * Grounded in Brihat Parashara Hora Shastra (BPHS)
 */

export type PlanetKey =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu"
  | "Ascendant";

export type RashiKey =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export interface PlanetPosition {
  name: PlanetKey;
  sanskritName: string;
  symbol: string;
  longitude: number; // 0 to 360 degrees in sidereal nirayana
  rashi: RashiKey;
  rashiIndex: number; // 0 to 11 (0 = Aries)
  rashiSanskrit: string;
  rashiLord: PlanetKey;
  degreesInRashi: number; // 0 to 30
  formattedDegree: string; // e.g. "14° 23' 10\""
  house: number; // 1 to 12
  nakshatra: string;
  nakshatraLord: PlanetKey;
  nakshatraPada: number; // 1, 2, 3, 4
  isRetrograde: boolean;
  isCombust: boolean;
  dignity:
    | "Exalted"
    | "Moolatrikona"
    | "Own Sign"
    | "Great Friend"
    | "Friend"
    | "Neutral"
    | "Enemy"
    | "Great Enemy"
    | "Debilitated";
  dignitySanskrit: string; // Uccha, Moolatrikona, Swakshetra, Mitra, Sama, Shatru, Neecha
  navamshaRashi: RashiKey;
  navamshaHouse: number;
}

export interface BhavaData {
  houseNumber: number; // 1 to 12
  sanskritName: string; // Tanu, Dhana, Sahaja, Sukha, Putra, Ari, Yuvati, Randhra, Dharma, Karma, Labha, Vyaya
  meaning: string;
  significations: string[];
  rashi: RashiKey;
  rashiSanskrit: string;
  rashiIndex: number;
  lord: PlanetKey;
  planets: PlanetPosition[];
  isKendra: boolean; // 1, 4, 7, 10
  isTrikona: boolean; // 1, 5, 9
  isDusthana: boolean; // 6, 8, 12
  isUpachaya: boolean; // 3, 6, 10, 11
  aspectingPlanets: { planet: PlanetKey; aspectType: string }[];
}

export interface DashaPeriod {
  planet: PlanetKey;
  sanskritName: string;
  startDate: string;
  endDate: string;
  startAge: number;
  endAge: number;
  durationYears: number;
  isCurrent: boolean;
  antardashas?: DashaPeriod[];
}

export interface VedicYoga {
  name: string;
  sanskritName: string;
  category: "Raja Yoga" | "Dhana Yoga" | "Mahapurusha Yoga" | "Auspicious Yoga" | "Challenging Yoga";
  isAuspicious: boolean;
  description: string;
  scripturalBasis: string; // BPHS Chapter / Verse reference
  present: boolean;
  involvedPlanets: PlanetKey[];
  housesInvolved: number[];
  effect: string;
}

export interface DoshaAnalysis {
  name: string;
  present: boolean;
  severity: "None" | "Mild" | "Moderate" | "Strong";
  description: string;
  cancellationReasons: string[];
  isCancelled: boolean;
  safeRemedies: string[];
}

export interface BirthDetails {
  name: string;
  gender?: "Male" | "Female" | "Other" | "male" | "female" | "other";
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm (24hr)
  city?: string;
  country?: string;
  locationName?: string;
  latitude: number;
  longitude: number;
  timezoneOffset?: number; // Hours offset from UTC (e.g. +5.5 for IST)
  timezone?: number;
}

export type BirthData = BirthDetails;

export interface JyotishChatMessage {
  id: string;
  sender: "user" | "astrologer";
  text: string;
  timestamp: string;
  category?: string;
}

export type AshtakootaResult = GunaMilanResult;

export interface KundaliData {
  birthDetails: BirthDetails;
  ascendant: PlanetPosition;
  moonSign: RashiKey;
  sunSign: RashiKey;
  birthNakshatra: string;
  birthPada: number;
  planets: PlanetPosition[];
  houses: BhavaData[];
  yogas: VedicYoga[];
  doshas: {
    manglik: DoshaAnalysis;
    sadeSati: DoshaAnalysis;
    kaalSarp: DoshaAnalysis;
  };
  currentDasha: {
    mahadasha: DashaPeriod;
    antardasha: DashaPeriod;
    pratyantardasha?: DashaPeriod;
  };
  allDashas: DashaPeriod[];
  ayanamsha: string; // e.g. "Lahiri (Chitra Paksha) 24°01'44\""
  isDayBirth: boolean;
}

export interface PanchangData {
  date: string;
  tithi: { name: string; paksha: "Shukla" | "Krishna"; number: number; endTime?: string };
  vara: { name: string; sanskritName: string; rulingPlanet: PlanetKey };
  nakshatra: { name: string; lord: PlanetKey; pada: number };
  yoga: { name: string; meaning: string };
  karana: { name: string; lord: string };
  muhurtas: {
    brahmaMuhurta: string;
    abhijitMuhurta: string;
    rahuKaal: string;
    yamaganda: string;
    gulikaKaal: string;
    durmuhurta: string;
  };
  choghadiya: {
    day: { name: string; type: "Amrit" | "Shubh" | "Labh" | "Char" | "Rog" | "Kaal" | "Udveg"; time: string }[];
    night: { name: string; type: "Amrit" | "Shubh" | "Labh" | "Char" | "Rog" | "Kaal" | "Udveg"; time: string }[];
  };
  sunrise: string;
  sunset: string;
  moonrise: string;
}

export interface GunaMilanResult {
  boyDetails: { name: string; rashi: RashiKey; nakshatra: string; pada: number };
  girlDetails: { name: string; rashi: RashiKey; nakshatra: string; pada: number };
  totalScore: number;
  maxScore: number; // 36
  verdict: "Excellent" | "Good" | "Average" | "Requires Caution";
  kootas: {
    name: "Varna" | "Vashya" | "Tara" | "Yoni" | "Graha Maitri" | "Gana" | "Bhakoot" | "Nadi";
    sanskritName: string;
    obtainedPoints: number;
    maxPoints: number;
    description: string;
    boyAttribute: string;
    girlAttribute: string;
    hasDosha: boolean;
    mitigation?: string;
  }[];
  manglikBoy: boolean;
  manglikGirl: boolean;
  compatibilitySummary: string;
}

export interface SattvikRemedy {
  planet: PlanetKey;
  sanskritName: string;
  beejMantra: {
    sanskrit: string;
    transliteration: string;
    meaning: string;
    prescribedCount: number;
    bestTime: string;
  };
  vedicMantra: {
    sanskrit: string;
    transliteration: string;
  };
  daan: {
    items: string[];
    auspiciousDay: string;
    recipient: string;
    guideline: string;
  };
  pujaAndVrata: {
    deity: string;
    vratDay: string;
    pujaPractice: string;
    meditationFocus: string;
  };
  lifestyleAndKarma: string[];
  gemstone: {
    name: string;
    sanskritName: string;
    metal: string;
    finger: string;
    auspiciousDayTime: string;
    caution: string;
    contraindicatedGemstones: string[];
    safeAlternative: string; // e.g. Rudraksha or herbal root
  };
}
