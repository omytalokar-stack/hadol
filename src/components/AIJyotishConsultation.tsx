import React, { useState, useEffect } from "react";
import { KundaliData, JyotishChatMessage } from "../types/jyotish";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../utils/api";

interface AIJyotishConsultationProps {
  kundali: KundaliData;
  initialQuestion?: string;
}

export const AIJyotishConsultation: React.FC<AIJyotishConsultationProps> = ({
  kundali,
  initialQuestion,
}) => {
  const { user, token, login, updateUser } = useAuth();
  const [inputQuery, setInputQuery] = useState("");
  const [language, setLanguage] = useState<"Hindi" | "Hinglish" | "English">("Hindi");
  const [category, setCategory] = useState<
    "General" | "Career" | "Marriage" | "Health" | "Dasha" | "Remedies" | "Spiritual"
  >("General");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("कुंडली व दशा विश्लेषण...");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Helper to format chart summary payload for API with comprehensive dynamic data
  const getChartSummaryPayload = () => {
    const moonPlanet = kundali.planets.find((p) => p.name === "Moon");
    const sunPlanet = kundali.planets.find((p) => p.name === "Sun");
    const venusPlanet = kundali.planets.find((p) => p.name === "Venus");
    const jupiterPlanet = kundali.planets.find((p) => p.name === "Jupiter");
    const marsPlanet = kundali.planets.find((p) => p.name === "Mars");
    const mercuryPlanet = kundali.planets.find((p) => p.name === "Mercury");
    const saturnPlanet = kundali.planets.find((p) => p.name === "Saturn");

    // Calculate approximate current age
    const dob = kundali.birthDetails.dateOfBirth;
    let currentAge = 0;
    if (dob) {
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      currentAge = isNaN(birthYear) ? 0 : Math.max(0, currentYear - birthYear);
    }

    const house7 = kundali.houses.find((h) => h.houseNumber === 7);
    const house10 = kundali.houses.find((h) => h.houseNumber === 10);
    const house2 = kundali.houses.find((h) => h.houseNumber === 2);
    const house11 = kundali.houses.find((h) => h.houseNumber === 11);

    return {
      jatakaName: kundali.birthDetails.name || "Jataka",
      currentAgeYears: currentAge,
      birthDetails: {
        dateOfBirth: kundali.birthDetails.dateOfBirth,
        timeOfBirth: kundali.birthDetails.timeOfBirth,
        location: kundali.birthDetails.locationName || kundali.birthDetails.city || "Coordinates Provided",
        latitude: kundali.birthDetails.latitude,
        longitude: kundali.birthDetails.longitude,
        gender: kundali.birthDetails.gender,
      },
      ascendantLagna: {
        rashi: kundali.ascendant.rashi,
        rashiSanskrit: kundali.ascendant.rashiSanskrit,
        rashiLord: kundali.ascendant.rashiLord,
        formattedDegree: kundali.ascendant.formattedDegree,
        nakshatra: kundali.ascendant.nakshatra,
        nakshatraPada: kundali.ascendant.nakshatraPada,
      },
      moonSignChandra: {
        rashi: kundali.moonSign,
        formattedDegree: moonPlanet?.formattedDegree || "N/A",
        nakshatra: kundali.birthNakshatra,
        nakshatraPada: kundali.birthPada,
        house: moonPlanet?.house || 1,
        dignity: moonPlanet?.dignity || "Neutral",
      },
      sunSignSurya: {
        rashi: kundali.sunSign,
        formattedDegree: sunPlanet?.formattedDegree || "N/A",
        house: sunPlanet?.house || 1,
        nakshatra: sunPlanet?.nakshatra || "N/A",
        dignity: sunPlanet?.dignity || "Neutral",
      },
      seventhHouseMarriage: {
        houseNumber: 7,
        rashi: house7?.rashi,
        rashiSanskrit: house7?.rashiSanskrit,
        lord: house7?.lord,
        occupyingPlanets: house7?.planets?.map((p) => p.name) || [],
        venusPlacement: {
          rashi: venusPlanet?.rashi,
          house: venusPlanet?.house,
          degree: venusPlanet?.formattedDegree,
          dignity: venusPlanet?.dignity,
        },
        jupiterPlacement: {
          rashi: jupiterPlanet?.rashi,
          house: jupiterPlanet?.house,
          degree: jupiterPlanet?.formattedDegree,
          dignity: jupiterPlanet?.dignity,
        },
      },
      tenthHouseCareer: {
        houseNumber: 10,
        rashi: house10?.rashi,
        rashiSanskrit: house10?.rashiSanskrit,
        lord: house10?.lord,
        occupyingPlanets: house10?.planets?.map((p) => p.name) || [],
        mercuryPlacement: {
          rashi: mercuryPlanet?.rashi,
          house: mercuryPlanet?.house,
          degree: mercuryPlanet?.formattedDegree,
        },
        saturnPlacement: {
          rashi: saturnPlanet?.rashi,
          house: saturnPlanet?.house,
          degree: saturnPlanet?.formattedDegree,
        },
      },
      dhanaBhavasWealth: {
        secondHouseLord: house2?.lord,
        secondHousePlanets: house2?.planets?.map((p) => p.name) || [],
        eleventhHouseLord: house11?.lord,
        eleventhHousePlanets: house11?.planets?.map((p) => p.name) || [],
      },
      currentVimshottariDasha: {
        mahadasha: kundali.currentDasha.mahadasha.planet,
        antardasha: kundali.currentDasha.antardasha.planet,
        pratyantardasha: kundali.currentDasha.pratyantardasha?.planet || "N/A",
        antardashaEndDate: kundali.currentDasha.antardasha.endDate,
        dashaSummary: `${kundali.currentDasha.mahadasha.planet} Mahadasha / ${kundali.currentDasha.antardasha.planet} Antardasha (until ${kundali.currentDasha.antardasha.endDate})`,
      },
      upcomingDashaPeriods: kundali.allDashas?.slice(0, 4).map((d) => ({
        planet: d.planet,
        startDate: d.startDate,
        endDate: d.endDate,
        startAge: d.startAge,
        endAge: d.endAge,
      })) || [],
      planetaryPositions: kundali.planets.map((p) => ({
        planet: p.name,
        sanskritName: p.sanskritName,
        rashi: p.rashi,
        rashiSanskrit: p.rashiSanskrit,
        house: p.house,
        degree: p.formattedDegree,
        nakshatra: `${p.nakshatra} (Pada ${p.nakshatraPada})`,
        dignity: p.dignity,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        navamshaRashi: p.navamshaRashi,
      })),
      bhavasHousesSummary: kundali.houses.map((h) => ({
        houseNumber: h.houseNumber,
        sanskritName: h.sanskritName,
        rashi: h.rashi,
        rashiLord: h.lord,
        occupyingPlanets: h.planets.map((p) => p.name),
        isKendra: h.isKendra,
        isTrikona: h.isTrikona,
        isDusthana: h.isDusthana,
      })),
      yogasDetected: kundali.yogas.map((y) => ({
        name: y.name,
        category: y.category,
        effect: y.effect,
        involvedPlanets: y.involvedPlanets,
        houses: y.housesInvolved,
      })),
      doshaAnalysis: {
        manglik: {
          present: kundali.doshas.manglik.present,
          severity: kundali.doshas.manglik.severity,
          isCancelled: kundali.doshas.manglik.isCancelled,
          reasons: kundali.doshas.manglik.cancellationReasons,
        },
        sadeSati: {
          present: kundali.doshas.sadeSati.present,
          severity: kundali.doshas.sadeSati.severity,
          description: kundali.doshas.sadeSati.description,
        },
        kaalSarp: {
          present: kundali.doshas.kaalSarp.present,
          severity: kundali.doshas.kaalSarp.severity,
        },
      },
    };
  };

  // Build tailored dynamic welcome message in pure Devanagari Hindi by default
  const createWelcomeMessage = (): JyotishChatMessage => {
    const jatakaName = kundali.birthDetails.name || "जातक";
    const sunPlanet = kundali.planets.find((p) => p.name === "Sun");
    const welcomeText =
      language === "English"
        ? `ॐ Namo Narayanaya. Greetings ${jatakaName}!\n\nI have loaded your exact calculated Vedic birth chart:\n• **Lagna (Ascendant):** ${kundali.ascendant.rashi} (${kundali.ascendant.formattedDegree})\n• **Moon Sign (Chandra):** ${kundali.moonSign} in ${kundali.birthNakshatra} (Pada ${kundali.birthPada})\n• **Sun Sign (Surya):** ${kundali.sunSign} (${sunPlanet?.formattedDegree || ""}) in House ${sunPlanet?.house || 1}\n• **Active Dasha:** ${kundali.currentDasha.mahadasha.planet} Mahadasha / ${kundali.currentDasha.antardasha.planet} Antardasha (until ${kundali.currentDasha.antardasha.endDate})\n\nFeel free to ask any specific question regarding your career, marriage timing, wealth, health, or safe Sattvik remedies based strictly on this calculated Kundali.`
        : `ॐ नमो नारायणाय। सादर प्रणाम ${jatakaName} जी।\n\nमैंने आपकी जन्म कुंडली का पूर्ण प्रामाणिक विवरण लोड कर लिया है:\n• **लग्न (Ascendant):** ${kundali.ascendant.rashi} (${kundali.ascendant.formattedDegree}) — लग्न स्वामी: ${kundali.ascendant.rashiLord}\n• **चंद्र राशि (Chandra):** ${kundali.moonSign} (${kundali.birthNakshatra} नक्षत्र, पद ${kundali.birthPada})\n• **सूर्य स्थिति (Surya):** ${kundali.sunSign} (${sunPlanet?.formattedDegree || ""}) - भाव ${sunPlanet?.house || 1}\n• **सक्रिय विंशोत्तरी दशा:** ${kundali.currentDasha.mahadasha.planet} महादशा / ${kundali.currentDasha.antardasha.planet} अंतर्दशा (सक्रिय: ${kundali.currentDasha.antardasha.endDate} तक)\n\nआप अपने विवाह समय, करियर, शिक्षा, धन संचय अथवा शास्त्रसम्मत सात्विक उपाय के बारे में जो भी जानना चाहते हैं, शुद्ध हिंदी में पूछें।`;

    return {
      id: `welcome-${Date.now()}`,
      sender: "astrologer",
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const [messages, setMessages] = useState<JyotishChatMessage[]>([createWelcomeMessage()]);

  // State Synchronization: Automatically clear and reload context when new birth details / Kundali are submitted
  const birthKey = `${kundali.birthDetails.name}_${kundali.birthDetails.dateOfBirth}_${kundali.birthDetails.timeOfBirth}_${kundali.birthDetails.latitude}_${kundali.birthDetails.longitude}`;

  useEffect(() => {
    localStorage.setItem(`jyotish-ai-chat:${birthKey}`, JSON.stringify(messages));
  }, [birthKey, messages]);

  useEffect(() => {
    // Reset conversation to fresh tailored welcome message for the new chart
    setMessages([createWelcomeMessage()]);
    setInputQuery("");

    // Stop active speech if speaking
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveSpeechId(null);
  }, [birthKey]);

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim().length > 0) {
      setInputQuery(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      const steps = [
        "कुंडली व ग्रह स्थिति का अवलोकन (Analyzing Chart)...",
        "विंशोत्तरी महादशा व अंतर्दशा गणना (Computing Dashas)...",
        "बृहत् पराशर होरा शास्त्र के अनुसार संश्लेषण (Consulting BPHS)...",
        "सात्विक एवं प्रामाणिक मार्गदर्शन निर्माण (Finalizing Sattvik Upay)...",
      ];
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingStep(steps[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const quickQuestions =
    language === "Hindi" || language === "Hinglish"
      ? [
          "मेरे करियर और नौकरी में सफलता के क्या योग हैं?",
          "मेरी शादी कब तक होगी और वैवाहिक जीवन कैसा रहेगा?",
          "वर्तमान महादशा का मेरे जीवन पर क्या प्रभाव है?",
          "मेरी कुंडली के अनुसार मुझे कौन सा सात्विक उपाय करना चाहिए?",
          "क्या मेरी कुंडली में कोई राजयोग या धन योग बन रहा है?",
        ]
      : [
          "What does my current Mahadasha indicate for my career growth?",
          "How is my 7th house and marital harmony aligned in this chart?",
          "Which safe Sattvik remedies and Mantras should I practice daily?",
          "Are there any major Raja Yogas or Dhana Yogas active in my Kundali?",
          "How does my Moon sign and Nakshatra influence my emotional mind?",
        ];

  const handleSendMessage = async (customQuery?: string) => {
    if (!user) return;
    const queryToSend = customQuery || inputQuery.trim();
    if (!queryToSend || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMsg: JyotishChatMessage = {
      id: userMsgId,
      sender: "user",
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInputQuery("");
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);

    try {
      const payload = getChartSummaryPayload();
      // Prepare chat history (last 4 messages)
      const historyPayload = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await fetch(apiUrl("/api/jyotish/consult"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        signal: controller.signal,
        body: JSON.stringify({
          chartContext: JSON.stringify(payload, null, 2),
          chartSummary: payload,
          userQuestion: queryToSend,
          userQuery: queryToSend,
          category,
          language,
          chatHistory: historyPayload,
        }),
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      if (!response.ok) {
        if (typeof data.credits === "number") updateUser({ ...user, credits: data.credits, hasFollowed: data.hasFollowed ?? user.hasFollowed });
        throw new Error(data.error || "Failed to generate consultation.");
      }
      if (typeof data.credits === "number") updateUser({ ...user, credits: data.credits });

      const botReply = data.response || data.reply || "ॐ Shanti. The reading was completed.";

      const botMsg: JyotishChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "astrologer",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === "AbortError";
      const errorMsgText = isAbort
        ? "ज्योतिष विश्लेषण में अधिक समय लगा। कृपया नीचे 'पुनः प्रयास करें' पर क्लिक करें।"
        : `ॐ Shanti. ${err.message || "An error occurred. Please try again."}`;

      const errorMsg: JyotishChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "astrologer",
        text: errorMsgText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-Speech handler (Pure Indian Hindi Voice prioritization)
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking && activeSpeechId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text for natural spiritual spoken flow
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/#{1,6}\s+/g, "")
      .replace(/[•\-_~`]/g, " ")
      .replace(/Disclaimer:.*$/gis, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Pick Indian Hindi or Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const isHindi = language === "Hindi" || language === "Hinglish";
      const hindiVoice = voices.find(
        (v) =>
          (isHindi && (v.lang === "hi-IN" || v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi"))) ||
          (!isHindi && (v.lang === "en-IN" || v.lang.includes("India")))
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    }

    utterance.lang = language === "English" ? "en-US" : "hi-IN";

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    };

    setActiveSpeechId(msgId);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!user) {
    return <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-950/80 to-slate-900 p-8 text-center shadow-xl"><div className="mx-auto max-w-xl"><p className="text-3xl text-amber-300">ॐ</p><h2 className="mt-2 text-xl font-semibold text-amber-100">Sign in with Google to consult the AI Astrologer</h2><p className="mt-3 text-sm text-slate-300">Your free Kundali, Lagna, Dashas and Panchang remain available without sign-in.</p><div className="mt-5 flex justify-center"><GoogleLogin onSuccess={(response) => void login(response)} onError={() => undefined} theme="filled_black" text="signin_with" shape="pill" /></div></div></div>;
  }

  return (
    <div id="ai-jyotish-consultation-section" className="bg-slate-900 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col h-[760px]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-serif text-xl font-bold shadow-md">
            ॐ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-amber-100 font-serif">
                Parashari Vedic Astrologer
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                Live & Accurate (सत्य व प्रामाणिक)
              </span>
            </div>
            <p className="text-xs text-amber-300/70">
              Grounded in Brihat Parashara Hora Shastra • Real Calculations • Safe Sattvik Upay
            </p>
          </div>
        </div>

        {/* Controls: Language Pills & Category */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Toggle Pills */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-amber-900/40">
            {(["Hindi", "Hinglish", "English"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === lang
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-amber-200"
                }`}
              >
                {lang === "Hindi" ? "हिंदी (Hindi)" : lang === "Hinglish" ? "Hinglish" : "English"}
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="bg-slate-800 text-amber-200 border border-amber-900/40 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="General">General / समग्र</option>
            <option value="Career">Career & Karma (10th Bhava)</option>
            <option value="Marriage">Marriage & Love (7th Bhava)</option>
            <option value="Health">Health & Vitality</option>
            <option value="Dasha">Dasha & Timing</option>
            <option value="Remedies">Sattvik Remedies (Upay)</option>
            <option value="Spiritual">Spiritual / अध्यात्म</option>
          </select>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-4 font-sans text-xs sm:text-sm">
        {messages.map((msg) => {
          const isBot = msg.sender === "astrologer";
          const isMsgSpeaking = isSpeaking && activeSpeechId === msg.id;
          const isErrorMsg = msg.text.includes("error occurred") || msg.text.includes("अधिक समय");

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                <span>{isBot ? "ज्योतिष आचार्य (Acharya)" : "आप (You)"}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {isBot && !isErrorMsg && (
                  <button
                    onClick={() => handleToggleSpeech(msg.id, msg.text)}
                    className="ml-1 text-amber-400 hover:text-amber-200 cursor-pointer flex items-center gap-1 text-[10px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 hover:border-amber-500/50"
                    title={isMsgSpeaking ? "आवाज़ रोकें (Stop voice narration)" : "हिंदी आवाज़ में सुनें (Listen to Indian voice narration)"}
                  >
                    <span>{isMsgSpeaking ? "⏹ रोकें (Stop)" : "🔊 सुनें (Audio)"}</span>
                  </button>
                )}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-2xl leading-relaxed whitespace-pre-wrap ${
                  isBot
                    ? isErrorMsg
                      ? "bg-rose-950/40 border border-rose-900/50 text-rose-200 shadow-md"
                      : "bg-slate-950/80 border border-amber-900/40 text-slate-200 shadow-md"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-semibold shadow-md"
                }`}
              >
                {msg.text}

                {isErrorMsg && (
                  <div className="mt-3 pt-2 border-t border-rose-900/40 flex items-center gap-2">
                    <button
                      onClick={() => handleSendMessage(messages[messages.length - 2]?.text || "मेरे ग्रह और दशा के बारे में बताएं")}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow"
                    >
                      🔄 पुनः प्रयास करें (Retry)
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-amber-400">
              <span>ज्योतिष आचार्य गणना कर रहे हैं...</span>
            </div>
            <div className="bg-slate-950/90 border border-amber-700/50 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs text-amber-200 font-medium italic">
                {loadingStep}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Selector */}
      <div className="mb-3 pt-2 border-t border-amber-900/20">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
          {language === "English" ? "Suggested Inquiries:" : "त्वरित प्रश्न (Click to Ask):"}
        </span>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-amber-500/20 text-amber-200/90 hover:text-amber-100 border border-slate-700/60 hover:border-amber-500/40 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div className="relative flex items-center gap-2">
        <input
          id="jyotish-question-input"
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            language === "English"
              ? "Ask about career, marriage timing, dasha results, or safe remedies..."
              : "करियर, शादी, धन लाभ, दशा या सात्विक उपाय के बारे में पूछें..."
          }
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-amber-900/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />

        <button
          id="jyotish-send-button"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputQuery.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <span>{language === "English" ? "Ask Acharya" : "पूछें"}</span>
          <span>→</span>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-500 text-center mt-2.5">
        ⚖️ <strong>Astrological Disclaimer:</strong> Vedic Astrology is a sacred guide for spiritual self-reflection and wisdom. It does not replace certified medical, legal, psychological, or financial counseling.
      </p>
    </div>
  );
};
