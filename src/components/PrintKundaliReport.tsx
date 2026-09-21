import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { JyotishChatMessage, KundaliData } from "../types/jyotish";
import { calculatePanchang } from "../utils/vedicCalculations";
import { KundaliChart } from "./KundaliChart";

interface PrintKundaliReportProps {
  kundali: KundaliData;
  onClose: () => void;
}

export const PrintKundaliReport: React.FC<PrintKundaliReportProps> = ({
  kundali,
  onClose,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const chatStorageKey = `jyotish-ai-chat:${kundali.birthDetails.name}_${kundali.birthDetails.dateOfBirth}_${kundali.birthDetails.timeOfBirth}_${kundali.birthDetails.latitude}_${kundali.birthDetails.longitude}`;
  let aiMessages: JyotishChatMessage[] = [];
  try {
    const storedMessages = localStorage.getItem(chatStorageKey);
    aiMessages = storedMessages ? JSON.parse(storedMessages) as JyotishChatMessage[] : [];
  } catch {
    aiMessages = [];
  }
  const birthPanchang = calculatePanchang(
    new Date(`${kundali.birthDetails.dateOfBirth}T${kundali.birthDetails.timeOfBirth}`),
    kundali.birthDetails.latitude,
    kundali.birthDetails.longitude,
  );
  const handleDownload = async () => {
    if (!reportRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        logging: false,
        scale: 2,
        useCORS: true,
        windowWidth: reportRef.current.scrollWidth,
        onclone: (clonedDocument) => {
          const colorProperties = [
            "color",
            "background-color",
            "border-top-color",
            "border-right-color",
            "border-bottom-color",
            "border-left-color",
            "outline-color",
            "text-decoration-color",
            "column-rule-color",
            "caret-color",
            "accent-color",
            "fill",
            "stroke",
          ];
          const colorCanvas = document.createElement("canvas");
          const colorContext = colorCanvas.getContext("2d");
          const normalizeColor = (value: string) => {
            if (!colorContext || !/(oklch|oklab|color\()/i.test(value)) return value;
            colorContext.fillStyle = value;
            return typeof colorContext.fillStyle === "string" && !/(oklch|oklab|color\()/i.test(colorContext.fillStyle)
              ? colorContext.fillStyle
              : "#64748b";
          };
          const replaceUnsupportedColors = (value: string) =>
            value
              .replace(/oklch\([^)]*\)/gi, "#64748b")
              .replace(/oklab\([^)]*\)/gi, "#64748b")
              .replace(/color\([^)]*\)/gi, "#64748b");

          clonedDocument.querySelectorAll("style").forEach((style) => {
            style.textContent = replaceUnsupportedColors(style.textContent || "");
          });
          clonedDocument.querySelectorAll("[style]").forEach((element) => {
            const inlineStyle = element.getAttribute("style");
            if (inlineStyle) element.setAttribute("style", replaceUnsupportedColors(inlineStyle));
          });

          const sourceElements = reportRef.current?.querySelectorAll("*") || [];
          const clonedElements = clonedDocument.querySelectorAll(".print-report-card *");
          clonedElements.forEach((element, index) => {
            const sourceElement = sourceElements[index];
            if (!sourceElement) return;
            const computedStyle = window.getComputedStyle(sourceElement);
            colorProperties.forEach((property) => {
              const value = computedStyle.getPropertyValue(property);
              if (value) (element as HTMLElement).style.setProperty(property, normalizeColor(value));
            });
          });
        },
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 8;
      const pageWidth = 210;
      const pageHeight = 297;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const sourcePageHeight = Math.floor(canvas.width * contentHeight / contentWidth);

      for (let sourceY = 0, page = 0; sourceY < canvas.height; sourceY += sourcePageHeight, page += 1) {
        const sliceHeight = Math.min(sourcePageHeight, canvas.height - sourceY);
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = sliceHeight;
        const context = slice.getContext("2d");
        if (!context) continue;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, slice.width, slice.height);
        context.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, slice.width, slice.height);
        if (page > 0) pdf.addPage();
        pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, contentWidth, sliceHeight * contentWidth / canvas.width);
      }

      const safeName = (kundali.birthDetails.name || "kundali").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
      pdf.save(`${safeName || "kundali"}-ai-report.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="print-report-overlay fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="print-report-card bg-slate-900 border border-amber-900/60 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-slate-100 shadow-2xl relative">
        {/* Action Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-900/40 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">🖨️</span>
            <div>
              <h3 className="text-lg font-bold text-amber-200 font-serif">
                Parashari Janam Kundali Patrika (जन्म पत्रिका)
              </h3>
              <p className="text-xs text-slate-400">Ready for high-resolution printing or PDF export</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void handleDownload()}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-400 transition-all shadow-md cursor-pointer"
            >
              {isDownloading ? "Preparing PDF..." : "Download Kundali + AI Chat PDF"}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div ref={reportRef} id="printable-kundali-content" className="space-y-6 print:text-black">
          {/* Header Cover */}
          <div className="text-center pb-4 border-b-2 border-amber-600">
            <span className="text-3xl font-serif text-amber-400 font-bold block mb-1">ॐ</span>
            <h1 className="text-2xl font-bold text-amber-200 font-serif tracking-wide">
              वैदिक जन्म पत्रिका (Vedic Janam Kundali Patrika)
            </h1>
            <p className="text-xs text-amber-400 font-mono mt-1">
              Brihat Parashara Hora Shastra Calculations • Lahiri (Chitra Paksha) Ayanamsha
            </p>
          </div>

          {/* Jataka Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-amber-900/30 text-xs">
            <div>
              <span className="text-slate-400 block">Jataka Name:</span>
              <strong className="text-amber-200 text-sm">{kundali.birthDetails.name || "Jataka"}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Date of Birth:</span>
              <strong className="text-slate-200">{kundali.birthDetails.dateOfBirth}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Time of Birth:</span>
              <strong className="text-slate-200">{kundali.birthDetails.timeOfBirth} (24hr)</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Birth City:</span>
              <strong className="text-slate-200">{kundali.birthDetails.locationName}</strong>
            </div>
          </div>

          {/* Birth Panchang & Astrological Signatures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-amber-950/20 p-4 rounded-xl border border-amber-800/30">
            <div>
              <span className="text-amber-400/80 block">Lagna (Ascendant):</span>
              <strong className="text-amber-100">{kundali.ascendant.rashi} ({kundali.ascendant.formattedDegree})</strong>
            </div>
            <div>
              <span className="text-amber-400/80 block">Moon Sign (Rashi):</span>
              <strong className="text-amber-100">{kundali.moonSign}</strong>
            </div>
            <div>
              <span className="text-amber-400/80 block">Janma Nakshatra:</span>
              <strong className="text-amber-100">{kundali.birthNakshatra} (Pada {kundali.birthPada})</strong>
            </div>
            <div>
              <span className="text-amber-400/80 block">Birth Tithi:</span>
              <strong className="text-amber-100">{birthPanchang.tithi.name} ({birthPanchang.tithi.paksha})</strong>
            </div>
          </div>

          {/* Charts Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-amber-200 font-serif mb-2 text-center">
                Lagna Chakra (लग्न चक्र - D1)
              </h4>
              <div className="max-w-[320px] mx-auto">
                <KundaliChart kundali={kundali} chartType="D1" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-amber-200 font-serif mb-2 text-center">
                Navamsha Chakra (नवमांश चक्र - D9)
              </h4>
              <div className="max-w-[320px] mx-auto">
                <KundaliChart kundali={kundali} chartType="D9" />
              </div>
            </div>
          </div>

          {/* Graha Positions Table */}
          <div className="text-xs">
            <h4 className="text-sm font-bold text-amber-200 font-serif mb-2">
              Planetary Longitudes & Dignities (ग्रह स्थिति)
            </h4>
            <div className="overflow-x-auto border border-amber-900/30 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400">
                  <tr>
                    <th className="p-2">Graha</th>
                    <th className="p-2">Rashi</th>
                    <th className="p-2">Degree</th>
                    <th className="p-2">House</th>
                    <th className="p-2">Nakshatra & Pada</th>
                    <th className="p-2">Dignity</th>
                    <th className="p-2">Navamsha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[kundali.ascendant, ...kundali.planets].map((p) => (
                    <tr key={p.name}>
                      <td className="p-2 font-bold text-amber-200">{p.name} ({p.sanskritName.split(" ")[0]})</td>
                      <td className="p-2">{p.rashi}</td>
                      <td className="p-2 font-mono">{p.formattedDegree}</td>
                      <td className="p-2">H{p.house}</td>
                      <td className="p-2">{p.nakshatra} (P{p.nakshatraPada})</td>
                      <td className="p-2 font-semibold text-emerald-300">{p.dignitySanskrit}</td>
                      <td className="p-2">{p.navamshaRashi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Yogas & Current Dasha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h5 className="font-bold text-amber-300 mb-2">Active Auspicious Yogas</h5>
              <ul className="space-y-1 text-slate-300">
                {kundali.yogas.map((y, idx) => (
                  <li key={idx}>
                    <strong>• {y.name}:</strong> {y.effect}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h5 className="font-bold text-amber-300 mb-2">Vimshottari Dasha Phase</h5>
              <p className="text-slate-300">
                <strong>Current:</strong> {kundali.currentDasha.mahadasha.planet} Mahadasha / {kundali.currentDasha.antardasha.planet} Antardasha
              </p>
              <p className="text-slate-400 mt-1">
                Active until: {kundali.currentDasha.antardasha.endDate}
              </p>
            </div>
          </div>

          <section className="border-t border-amber-900/30 pt-6">
            <h4 className="text-lg font-bold text-amber-200 font-serif mb-3">AI Jyotish Consultation</h4>
            {aiMessages.length > 0 ? (
              <div className="space-y-3 text-xs">
                {aiMessages.map((message) => (
                  <div key={message.id} className="rounded-lg border border-slate-700 bg-slate-950/60 p-3">
                    <div className="mb-1 font-bold text-amber-300">
                      {message.sender === "user" ? "You" : "AI Jyotish"} <span className="font-normal text-slate-500">{message.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-slate-300">{message.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No AI consultation messages were recorded for this Kundali.</p>
            )}
          </section>

          {/* Footer & Disclaimer */}
          <div className="pt-4 border-t border-amber-900/30 text-[10px] text-slate-500 text-center">
            <p>
              ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। May all beings be peaceful and enlightened.
            </p>
            <p className="mt-1">
              Astrological calculations are provided as a sacred guidance tool based on classical Parashari principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
