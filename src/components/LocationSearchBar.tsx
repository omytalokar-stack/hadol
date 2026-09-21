import React, { useState, useEffect, useRef } from "react";
import { searchLocations, GeocodedLocation } from "../utils/timezoneHelper";

interface LocationSearchBarProps {
  currentLocationName?: string;
  currentLat?: number;
  currentLon?: number;
  currentTimezone?: number;
  onSelectLocation: (loc: {
    locationName: string;
    latitude: number;
    longitude: number;
    timezone: number;
    city?: string;
    country?: string;
  }) => void;
  label?: string;
  placeholder?: string;
  showQuickChips?: boolean;
}

const QUICK_SACRED_CITIES = [
  { name: "Akola, Maharashtra, India", query: "Akola, India", label: "Akola" },
  { name: "Ayodhya, Uttar Pradesh, India", query: "Ayodhya, India", label: "Ayodhya" },
  { name: "Varanasi, Uttar Pradesh, India", query: "Varanasi, India", label: "Varanasi (Kashi)" },
  { name: "Ujjain, Madhya Pradesh, India", query: "Ujjain, India", label: "Ujjain (Mahakal)" },
  { name: "Haridwar, Uttarakhand, India", query: "Haridwar, India", label: "Haridwar" },
  { name: "New Delhi, India", query: "New Delhi, India", label: "New Delhi" },
  { name: "Mumbai, Maharashtra, India", query: "Mumbai, India", label: "Mumbai" },
  { name: "Bengaluru, Karnataka, India", query: "Bengaluru, India", label: "Bengaluru" },
  { name: "Pune, Maharashtra, India", query: "Pune, India", label: "Pune" },
  { name: "London, United Kingdom", query: "London, UK", label: "London" },
  { name: "New York, USA", query: "New York, USA", label: "New York" },
];

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  currentLocationName,
  currentLat,
  currentLon,
  currentTimezone,
  onSelectLocation,
  label = "Birth City / Place (जन्म स्थान खोजें)",
  placeholder = "Search any city, town, or village globally (e.g., Akola, Ujjain, London)...",
  showQuickChips = true,
}) => {
  const [query, setQuery] = useState(currentLocationName || "");
  const [suggestions, setSuggestions] = useState<GeocodedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external name changes
  useEffect(() => {
    if (currentLocationName && currentLocationName !== query && !isOpen) {
      setQuery(currentLocationName);
    }
  }, [currentLocationName]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced geocoding search
  useEffect(() => {
    if (!query || query.trim().length < 2 || !isOpen) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Location search failed:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (loc: GeocodedLocation) => {
    const displayName = loc.shortName || loc.displayName.split(",").slice(0, 3).join(",");
    setQuery(displayName);
    setIsOpen(false);
    setSuggestions([]);
    onSelectLocation({
      locationName: displayName,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone,
      city: loc.city,
      country: loc.country,
    });
  };

  const handleQuickChip = async (chipQuery: string) => {
    setQuery(chipQuery);
    setIsLoading(true);
    setIsOpen(true);
    try {
      const results = await searchLocations(chipQuery);
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        setSuggestions(results);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <span className="text-amber-400">📍</span>
            <span>{label}</span>
          </label>
          {currentLat !== undefined && currentLon !== undefined && (
            <span className="text-[10px] text-amber-300/80 font-mono bg-slate-950 px-2 py-0.5 rounded border border-amber-900/30">
              {currentLat > 0 ? `${currentLat.toFixed(2)}°N` : `${(-currentLat).toFixed(2)}°S`},{" "}
              {currentLon > 0 ? `${currentLon.toFixed(2)}°E` : `${(-currentLon).toFixed(2)}°W`}{" "}
              • UTC{currentTimezone !== undefined && (currentTimezone >= 0 ? `+${currentTimezone}` : currentTimezone)}
            </span>
          )}
        </div>
      )}

      {/* Search Input Box */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl pl-9 pr-16 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
        />

        {/* Search Icon */}
        <span className="absolute left-3 top-2.5 text-slate-400 text-xs pointer-events-none">
          🔍
        </span>

        {/* Loading spinner / Clear button */}
        <div className="absolute right-2.5 top-2 flex items-center gap-1.5">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-200 text-xs p-1 rounded-full hover:bg-slate-800"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Auto-suggest Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-800">
          {isLoading && suggestions.length === 0 && (
            <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <span>Searching OpenStreetMap global database...</span>
            </div>
          )}

          {!isLoading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="p-3 text-center text-xs text-slate-400">
              No matching cities found for "<span className="text-amber-300 font-semibold">{query}</span>". Try another spelling or use the manual Lat/Lon toggle below.
            </div>
          )}

          {suggestions.map((loc, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(loc)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left p-2.5 transition-colors flex items-start gap-2.5 cursor-pointer ${
                  isSelected ? "bg-amber-500/20 text-amber-100" : "hover:bg-slate-800/80 text-slate-200"
                }`}
              >
                <span className="text-amber-400 text-sm mt-0.5 shrink-0">📍</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-amber-200 truncate">
                      {loc.shortName || loc.city || loc.displayName.split(",")[0]}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300 shrink-0">
                      UTC{loc.timezone >= 0 ? `+${loc.timezone}` : loc.timezone}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {loc.displayName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Coordinates: {loc.latitude > 0 ? `${loc.latitude}°N` : `${-loc.latitude}°S`}, {loc.longitude > 0 ? `${loc.longitude}°E` : `${-loc.longitude}°W`}
                  </p>
                </div>
              </button>
            );
          })}

          <div className="p-2 bg-slate-950/80 text-[10px] text-slate-500 flex items-center justify-between px-3">
            <span>Powered by OpenStreetMap / Nominatim</span>
            <span className="italic">Accurate Vedic Nirayana Coordinates</span>
          </div>
        </div>
      )}

      {/* Quick Suggested Sacred Cities Chips */}
      {showQuickChips && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-medium mr-1">
              Popular / Sacred Hubs:
            </span>
            {QUICK_SACRED_CITIES.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickChip(chip.query)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/40 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
