import { apiUrl } from "./api";

/**
 * Timezone and Geocoding resolution utility
 * Accurately determines UTC timezone offset from coordinates and country codes
 */

export interface GeocodedLocation {
  displayName: string;
  shortName: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours (e.g. +5.5 for IST)
  timezoneName?: string;
}

/**
 * Calculates standard or country-specific UTC timezone offset from coordinates & country code
 */
export function estimateTimezoneOffset(
  lat: number,
  lon: number,
  countryCode?: string
): { offset: number; name: string } {
  const cCode = countryCode?.toLowerCase() || "";

  // India (IST = UTC +5.5)
  if (
    cCode === "in" ||
    (lat >= 6.5 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5)
  ) {
    return { offset: 5.5, name: "IST (Indian Standard Time)" };
  }

  // Nepal (NPT = UTC +5.75)
  if (
    cCode === "np" ||
    (lat >= 26.3 && lat <= 30.5 && lon >= 80.0 && lon <= 88.3)
  ) {
    return { offset: 5.75, name: "NPT (Nepal Time)" };
  }

  // Sri Lanka (SLST = UTC +5.5)
  if (
    cCode === "lk" ||
    (lat >= 5.8 && lat <= 9.9 && lon >= 79.5 && lon <= 82.0)
  ) {
    return { offset: 5.5, name: "SLST (Sri Lanka Time)" };
  }

  // Bangladesh (BST = UTC +6.0)
  if (
    cCode === "bd" ||
    (lat >= 20.5 && lat <= 26.7 && lon >= 88.0 && lon <= 92.7)
  ) {
    return { offset: 6.0, name: "BST (Bangladesh Time)" };
  }

  // Pakistan (PKT = UTC +5.0)
  if (
    cCode === "pk" ||
    (lat >= 23.5 && lat <= 37.0 && lon >= 60.5 && lon <= 78.0)
  ) {
    return { offset: 5.0, name: "PKT (Pakistan Standard Time)" };
  }

  // United Arab Emirates / Oman (GST = UTC +4.0)
  if (cCode === "ae" || cCode === "om") {
    return { offset: 4.0, name: "GST (Gulf Standard Time)" };
  }

  // Saudi Arabia / Qatar / Kuwait / Bahrain (AST = UTC +3.0)
  if (
    cCode === "sa" ||
    cCode === "qa" ||
    cCode === "kw" ||
    cCode === "bh"
  ) {
    return { offset: 3.0, name: "AST (Arabia Standard Time)" };
  }

  // United Kingdom (GMT/BST = UTC 0.0 standard)
  if (cCode === "gb" || cCode === "uk") {
    return { offset: 0.0, name: "GMT (Greenwich Mean Time)" };
  }

  // Singapore / Malaysia / China / Hong Kong / Taiwan / Western Australia (UTC +8.0)
  if (
    cCode === "sg" ||
    cCode === "my" ||
    cCode === "cn" ||
    cCode === "hk" ||
    cCode === "tw"
  ) {
    return { offset: 8.0, name: "SGT/CST (UTC+8)" };
  }

  // Japan / South Korea (UTC +9.0)
  if (cCode === "jp" || cCode === "kr") {
    return { offset: 9.0, name: "JST/KST (UTC+9)" };
  }

  // Australia Eastern (Sydney, Melbourne = UTC +10.0 standard)
  if (cCode === "au") {
    if (lon > 140) return { offset: 10.0, name: "AEST (UTC+10)" };
    if (lon > 129) return { offset: 9.5, name: "ACST (UTC+9.5)" };
    return { offset: 8.0, name: "AWST (UTC+8)" };
  }

  // New Zealand (UTC +12.0 standard)
  if (cCode === "nz") {
    return { offset: 12.0, name: "NZST (UTC+12)" };
  }

  // Germany / France / Italy / Spain / Western & Central Europe (CET = UTC +1.0)
  if (
    [
      "de",
      "fr",
      "it",
      "es",
      "nl",
      "be",
      "at",
      "ch",
      "se",
      "no",
      "dk",
      "pl",
    ].includes(cCode)
  ) {
    return { offset: 1.0, name: "CET (Central European Time UTC+1)" };
  }

  // United States & Canada
  if (cCode === "us" || cCode === "ca") {
    // US Eastern (Approx Lon -85 to -65)
    if (lon >= -85) return { offset: -5.0, name: "EST (Eastern Time UTC-5)" };
    // US Central (Approx Lon -100 to -85)
    if (lon >= -100) return { offset: -6.0, name: "CST (Central Time UTC-6)" };
    // US Mountain (Approx Lon -114 to -100)
    if (lon >= -114) return { offset: -7.0, name: "MST (Mountain Time UTC-7)" };
    // US Pacific (Approx Lon < -114)
    if (lat > 50 && lon < -130) return { offset: -9.0, name: "AKST (Alaska UTC-9)" };
    if (lat < 25 && lon < -150) return { offset: -10.0, name: "HST (Hawaii UTC-10)" };
    return { offset: -8.0, name: "PST (Pacific Time UTC-8)" };
  }

  // General longitude-based mathematical estimation for other worldwide places
  const rawOffset = Math.round((lon / 15) * 2) / 2;
  const sign = rawOffset >= 0 ? "+" : "";
  return {
    offset: rawOffset,
    name: `UTC${sign}${rawOffset}`,
  };
}

/**
 * Searches locations using local backend proxy or direct Nominatim fallback
 */
export async function searchLocations(query: string): Promise<GeocodedLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();

  // Try backend proxy first
  try {
    const res = await fetch(
      apiUrl(`/api/geocode?q=${encodeURIComponent(cleanQuery)}`)
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback to direct client-side Nominatim fetch
  }

  // Direct OpenStreetMap Nominatim fetch fallback
  try {
    const directUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cleanQuery
    )}&limit=8&addressdetails=1`;
    const res = await fetch(directUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return [];
    const items = await res.json();

    return items.map((item: any) => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      const addr = item.address || {};
      const countryCode = addr.country_code || "";
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        item.name ||
        "";
      const state = addr.state || addr.province || addr.region || "";
      const country = addr.country || "";

      const shortParts = [city, state, country].filter(Boolean);
      const shortName = shortParts.join(", ") || item.display_name.split(",").slice(0, 3).join(",");

      const tzInfo = estimateTimezoneOffset(lat, lon, countryCode);

      return {
        displayName: item.display_name,
        shortName,
        city,
        state,
        country,
        countryCode,
        latitude: parseFloat(lat.toFixed(4)),
        longitude: parseFloat(lon.toFixed(4)),
        timezone: tzInfo.offset,
        timezoneName: tzInfo.name,
      };
    });
  } catch (err) {
    console.error("Geocoding fetch error:", err);
    return [];
  }
}
