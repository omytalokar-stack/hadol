import React, { useState } from "react";
import { BirthData } from "../types/jyotish";
import { LocationSearchBar } from "./LocationSearchBar";
import { GlossaryTooltip } from "./GlossaryTooltip";

interface BirthDataFormProps {
  initialData: BirthData;
  onSubmit: (data: BirthData) => void;
  onClose?: () => void;
}

const PRESET_CHARTS: { label: string; data: BirthData; desc: string }[] = [
  {
    label: "👑 Gajakesari & Raja Yoga Master",
    desc: "Jupiter & Moon in Kendra creating extraordinary Gajakesari Yoga",
    data: {
      name: "Arjun Sharma",
      dateOfBirth: "1992-05-15",
      timeOfBirth: "08:30",
      locationName: "New Delhi, India",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 5.5,
      gender: "male",
    },
  },
  {
    label: "🦁 Leo Leader Royal Chart",
    desc: "Exalted Sun & powerful 10th house governance",
    data: {
      name: "Vikramaditya",
      dateOfBirth: "1988-04-14",
      timeOfBirth: "06:15",
      locationName: "Varanasi, Uttar Pradesh, India",
      latitude: 25.3176,
      longitude: 82.9739,
      timezone: 5.5,
      gender: "male",
    },
  },
  {
    label: "🎨 Malavya Yoga Creative Chart",
    desc: "Exalted Venus in Pisces Kendra generating Pancha Mahapurusha Yoga",
    data: {
      name: "Ananya Iyer",
      dateOfBirth: "1996-03-25",
      timeOfBirth: "18:45",
      locationName: "Bengaluru, Karnataka, India",
      latitude: 12.9716,
      longitude: 77.5946,
      timezone: 5.5,
      gender: "female",
    },
  },
  {
    label: "🧘 Moksha & Ketu Spiritual Chart",
    desc: "12th house Ketu with Saturn in 9th house of Dharma",
    data: {
      name: "Swami Anand",
      dateOfBirth: "1985-11-08",
      timeOfBirth: "04:40",
      locationName: "Haridwar, Uttarakhand, India",
      latitude: 29.9457,
      longitude: 78.1642,
      timezone: 5.5,
      gender: "other",
    },
  },
];

export const BirthDataForm: React.FC<BirthDataFormProps> = ({
  initialData,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<BirthData>(initialData);
  const [useCustomCoords, setUseCustomCoords] = useState(false);

  const handleLocationSelect = (loc: {
    locationName: string;
    latitude: number;
    longitude: number;
    timezone: number;
    city?: string;
    country?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      locationName: loc.locationName,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone,
      city: loc.city,
      country: loc.country,
    }));
  };

  const handleApplyPreset = (preset: BirthData) => {
    setFormData(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-amber-400">📜</span>
            <h3 className="text-xl font-bold text-amber-100 font-serif">
              Kundali Birth Details (जन्म विवरण)
            </h3>
            <GlossaryTooltip term="Lagna" />
          </div>
          <p className="text-xs text-amber-300/70 mt-0.5">
            Accurate Date, Time, and Geographic Coordinates for Nirayana Sidereal Kundali
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-amber-200 text-lg p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Preset Quick Selectors */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Or Load Sample Classic Charts:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_CHARTS.map((preset, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => handleApplyPreset(preset.data)}
              className="text-left p-2.5 rounded-xl bg-slate-950/70 border border-amber-900/30 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all text-xs flex flex-col justify-between"
            >
              <strong className="text-amber-200 block">{preset.label}</strong>
              <span className="text-[11px] text-slate-400 mt-0.5">{preset.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Full Name / Jataka Name (जातक नाम)
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              placeholder="e.g., Arjun Sharma"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Gender (लिंग)
            </label>
            <select
              value={formData.gender || "male"}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            >
              <option value="male">Male (पुरुष)</option>
              <option value="female">Female (स्त्री)</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Date of Birth (जन्म तिथि)
            </label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Time of Birth (जन्म समय - 24hr / HH:MM)
            </label>
            <input
              type="time"
              required
              value={formData.timeOfBirth}
              onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic Location Search with OpenStreetMap Nominatim */}
        <div className="bg-slate-950/60 border border-amber-900/30 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-amber-200">
                Birth Location & Coordinates (जन्म स्थान)
              </span>
              <GlossaryTooltip term="Ayanamsha" customText="Exact latitude and longitude are required to compute the Lagna (Ascendant) and astrological Bhavas." />
            </div>
            <button
              type="button"
              onClick={() => setUseCustomCoords(!useCustomCoords)}
              className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
            >
              {useCustomCoords ? "Switch to Auto-Suggest Search" : "Manual Coordinates (Lat/Lon)"}
            </button>
          </div>

          {!useCustomCoords ? (
            <LocationSearchBar
              currentLocationName={formData.locationName || "New Delhi, India"}
              currentLat={formData.latitude}
              currentLon={formData.longitude}
              currentTimezone={formData.timezone}
              onSelectLocation={handleLocationSelect}
              placeholder="Type any global city or town (e.g. Akola, Varanasi, Pune, London)..."
            />
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Latitude (-90 to +90)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                    placeholder="20.7002"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Longitude (-180 to +180)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                    placeholder="77.0082"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">UTC Offset (e.g. 5.5 for IST)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                    placeholder="5.5"
                  />
                </div>
              </div>
              <input
                type="text"
                value={formData.locationName || ""}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                placeholder="Custom Location Label (e.g., Akola, Maharashtra)"
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg cursor-pointer flex items-center gap-2"
          >
            <span>✨</span>
            <span>Calculate Authentic Sidereal Kundali</span>
          </button>
        </div>
      </form>
    </div>
  );
};
