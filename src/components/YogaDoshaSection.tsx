import React, { useState } from "react";
import { VedicYoga, DoshaAnalysis } from "../types/jyotish";
import { GlossaryTooltip } from "./GlossaryTooltip";

interface YogaDoshaSectionProps {
  yogas: VedicYoga[];
  doshas: {
    manglik: DoshaAnalysis;
    sadeSati: DoshaAnalysis;
    kaalSarp: DoshaAnalysis;
  };
}

export const YogaDoshaSection: React.FC<YogaDoshaSectionProps> = ({
  yogas,
  doshas,
}) => {
  const [activeTab, setActiveTab] = useState<"Yogas" | "Doshas">("Yogas");

  return (
    <div id="yogas-and-doshas-card" className="bg-slate-900 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Header with Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-amber-200 font-serif">
              Yogas & Planetary Alignments (योग एवं दोष)
            </h3>
            <GlossaryTooltip term="Yoga" />
            <GlossaryTooltip term="Dosha" />
          </div>
          <p className="text-xs text-amber-300/70 mt-0.5">
            Scripture-backed evaluations from Brihat Parashara Hora Shastra & Saravali
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-amber-900/40 text-xs">
          <button
            onClick={() => setActiveTab("Yogas")}
            className={`px-3 py-1.5 rounded transition-colors font-medium ${
              activeTab === "Yogas"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-amber-300/80 hover:text-amber-100"
            }`}
          >
            Auspicious Yogas ({yogas.length})
          </button>
          <button
            onClick={() => setActiveTab("Doshas")}
            className={`px-3 py-1.5 rounded transition-colors font-medium ${
              activeTab === "Doshas"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-amber-300/80 hover:text-amber-100"
            }`}
          >
            Dosha Analysis & Upay
          </button>
        </div>
      </div>

      {/* Yogas Tab */}
      {activeTab === "Yogas" && (
        <div>
          {yogas.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
              <p className="text-sm">No classic major Raja Yogas detected under strict Parashari criteria.</p>
              <p className="text-xs text-slate-500 mt-1">
                Individual planetary strengths (Shadbala) and Mahadashas continue to unfold destiny.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yogas.map((yoga, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-amber-800/40 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-amber-200 font-serif">
                        {yoga.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        {yoga.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {yoga.description}
                    </p>

                    <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-2.5 mb-3">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                        Parashari Manifestation
                      </span>
                      <p className="text-xs text-amber-100/90 italic font-serif">
                        "{yoga.effect}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-slate-400">
                      Involved:{" "}
                      <strong className="text-amber-200">{yoga.involvedPlanets.join(", ")}</strong>
                    </span>
                    <span className="text-[10px] text-amber-400/70 font-mono">
                      Ref: {yoga.scripturalBasis.split("&")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Doshas Tab */}
      {activeTab === "Doshas" && (
        <div className="space-y-4">
          {[doshas.manglik, doshas.sadeSati, doshas.kaalSarp].map((dosha, dIdx) => {
            const isNone = dosha.severity === "None";
            return (
              <div
                key={dIdx}
                className={`border rounded-xl p-4 transition-all ${
                  isNone
                    ? "border-emerald-900/40 bg-emerald-950/10"
                    : dosha.isCancelled
                    ? "border-blue-900/50 bg-blue-950/10"
                    : "border-amber-800/60 bg-amber-950/10"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isNone ? "bg-emerald-400" : dosha.isCancelled ? "bg-blue-400" : "bg-amber-400"
                      }`}
                    />
                    <h4 className="text-sm font-bold text-amber-100 font-serif">
                      {dosha.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isNone
                          ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/50"
                          : dosha.isCancelled
                          ? "bg-blue-900/40 text-blue-300 border-blue-700/50"
                          : "bg-amber-900/40 text-amber-300 border-amber-700/50"
                      }`}
                    >
                      {isNone
                        ? "Dosha Free (दोष मुक्त)"
                        : dosha.isCancelled
                        ? "Cancelled / Bhanga (दोष भंग)"
                        : `Active (${dosha.severity})`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {dosha.description}
                </p>

                {/* Cancellation explanations if present */}
                {dosha.cancellationReasons.length > 0 && (
                  <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg p-2.5 mb-3">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">
                      Parashari Cancellation Clause (दोष भंग कारण)
                    </span>
                    <ul className="list-disc list-inside text-xs text-blue-100/90 space-y-0.5">
                      {dosha.cancellationReasons.map((reason, rIdx) => (
                        <li key={rIdx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safe Sattvik Upay */}
                {dosha.safeRemedies.length > 0 && (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                      Safe Sattvik Remedies (सात्त्विक उपाय)
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                      {dosha.safeRemedies.map((remedy, remIdx) => (
                        <li key={remIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold mt-0.5">•</span>
                          <span>{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
