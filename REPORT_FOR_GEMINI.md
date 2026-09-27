# Jyotish Veda: Gemini Handoff Report

यह दस्तावेज़ `Jyotish Veda` प्रोजेक्ट का technical handoff है। इसे Gemini AI को देकर project समझाया जा सकता है, ताकि आगे debugging, नए feature, deployment और code changes में वह सही context के साथ मदद कर सके।

## 1. Project का उद्देश्य

Jyotish Veda एक React + TypeScript आधारित Authentic Vedic Astrology और Kundali application है। उपयोगकर्ता जन्म-तिथि, जन्म-समय और जन्म-स्थान देकर local calculation engine से कुंडली बनाता है। इसके बाद app chart, ग्रह स्थिति, भाव, नक्षत्र, दशा, योग, दोष, remedies, AI consultation, Panchang और Kundali Milan दिखाता है।

मुख्य design idea यह है कि मूल ज्योतिष गणना browser में होती है, जबकि authentication, saved Kundlis, admin management और AI responses server/API के माध्यम से होते हैं।

## 2. Technology stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose
- Authentication: Google OAuth credential verification + JWT session token
- AI: Google Gemini API; फिर Hugging Face fallback; फिर internal deterministic fallback
- Charts and UI: React components, `lucide-react`, `motion`, React Markdown
- Report export: `html2canvas` और `jspdf`
- PWA: `vite-plugin-pwa`
- Deployment: Vercel support through `api/index.ts` और `vercel.json`
- Local development server: `server.ts` through `tsx`

## 3. Important folder structure

```text
src/
  App.tsx                         Main UI, pathname routing और application shell
  main.tsx                        React root, OAuth provider और AuthProvider
  index.css                       Global styling
  components/
    BirthDataForm.tsx             जन्म जानकारी input और validation
    LocationSearchBar.tsx         स्थान खोज और coordinates
    KundaliChart.tsx              D1/Rashi chart और D9/Navamsha chart
    HouseInspector.tsx            चुने हुए भाव की जानकारी
    PlanetaryTable.tsx            ग्रहों की detailed table
    DashaTimeline.tsx             Vimshottari Mahadasha/Antardasha timeline
    YogaDoshaSection.tsx           योग और दोष analysis
    SattvikRemedies.tsx            मंत्र, दान, पूजा, lifestyle और gemstone guidance
    AIJyotishConsultation.tsx      AI chat consultation और speech support
    DailyPanchangView.tsx          Panchang और muhurta
    KundaliMilanView.tsx           Ashtakoota/Guna Milan
    PrintKundaliReport.tsx         PDF/report generation
    ExecutiveSummaryCard.tsx       chart का summary view
    Settings.tsx                   user settings
  context/
    AuthContext.tsx                login, JWT और current user state
  hooks/
    useInstallPrompt.ts            PWA install prompt
  types/
    jyotish.ts                     सभी मुख्य TypeScript interfaces
  utils/
    vedicCalculations.ts           local Vedic calculation engine
    api.ts                         API base URL helper
    timezoneHelper.ts              timezone/location helpers
  data/
    vedicData.ts                   static Vedic reference data

server.ts                          Express server, models, routes और AI orchestration
api/index.ts                        Vercel पर Express app export
vite.config.ts                      Vite, Tailwind और PWA configuration
vercel.json                         Vercel API और SPA rewrites
```

## 4. User workflow: app कैसे काम करता है

1. `src/main.tsx` React app को mount करता है और Google OAuth तथा `AuthProvider` wrap करता है।
2. `src/App.tsx` current pathname के आधार पर main app, settings या admin panel दिखाता है।
3. User Birth Data Form में नाम, gender, date, time, city/location, latitude, longitude और timezone देता है।
4. Location search server के `/api/geocode` proxy से coordinates खोज सकता है।
5. App `calculateKundali(birthDetails)` call करता है। यह calculation browser में synchronous रूप से local चलती है; chart बनाने के लिए astrology API की आवश्यकता नहीं है।
6. Generated `KundaliData` में ascendant, planets, houses, signs, nakshatra, pada, navamsha, dignity, retrograde/combustion flags, yogas, doshas, dashas और ayanamsha शामिल होते हैं।
7. UI अलग-अलग tabs/sections में chart, planets, houses, dashas, yoga-dosha, remedies, AI, Panchang और Milan दिखाती है।
8. Login के बाद user Kundli save कर सकता है। Frontend local `birthData` और calculated `kundaliData` को authenticated API request में server को भेजता है।
9. Server MongoDB में record को user ID के साथ save करता है। User अपने अधिकतम recent 50 saved records देख सकता है।
10. AI consultation में chart context, user question, category, language और recent chat history server को भेजी जाती है। Server credit check करके AI provider को call करता है।

## 5. Local Vedic calculation engine

मुख्य file: `src/utils/vedicCalculations.ts`

Engine में ये functions मौजूद हैं:

- `calculateJulianDay`
- `calculateLahiriAyanamsha`
- `calculateGMST`
- `calculateLagna`
- `calculatePlanetPositions`
- `calculateNavamshaRashi`
- `evaluateDignity`
- `buildBhavas`
- `calculateVimshottariDashas`
- `detectVedicYogas`
- `detectDoshas`
- `generateKundaliData` / `calculateKundali`
- `calculateGunaMilan` / `calculateKundaliMilan`
- `calculatePanchang`

Supported ग्रह: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu और Ascendant। Output में sidereal/nirayana longitude, Lahiri ayanamsha, Rashi, house, nakshatra, nakshatra lord, pada, Navamsha, dignity और अन्य flags आते हैं।

### Calculation accuracy के बारे में महत्वपूर्ण बात

यह engine hand-written approximate orbital formulas पर आधारित है, professional Swiss Ephemeris या किसी external validated ephemeris service पर नहीं। Timezone और Panchang calculations भी simplified हैं। इसलिए app को educational/practical guidance tool की तरह describe करना चाहिए; exact astronomical या legal-grade result का दावा नहीं करना चाहिए। Gemini को calculation बदलते समय इस limitation को बनाए रखना है।

विशेष सावधानियाँ:

- timezone calculation में DST और सभी historical timezone changes पूरी तरह model नहीं हैं;
- UTC date conversion boundary month/year पर सुधार मांग सकती है;
- Panchang में sunrise, sunset, muhurta और choghadiya values simplified/fixed हो सकती हैं;
- Guna Milan scoring simplified है;
- result में Manglik flags का implementation दोबारा verify किए बिना authoritative नहीं मानना चाहिए।

## 6. Main frontend features

### Kundali और analysis

- North Indian style D1/Rashi chart
- D9/Navamsha chart
- 12 houses और house inspector
- ग्रहों के degrees, signs, nakshatra, pada, lords
- retrograde, combust और dignity status
- Bhava significations, Kendra, Trikona, Dusthana और Upachaya classification
- Vimshottari Mahadasha, Antardasha और current period
- detected Vedic Yogas और Doshas
- executive summary और glossary tooltips

### Guidance और utilities

- Sattvik remedies: mantra, daan, puja/vrata, meditation, lifestyle और gemstone caution
- Daily Panchang: tithi, paksha, vara, nakshatra, yoga, karana, muhurta, choghadiya और sunrise/sunset
- Kundali Milan: 8 Ashtakoota, 36-point score, verdict, Bhakoot/Nadi आदि और Manglik comparison
- AI Jyotish consultation with category/language context
- browser speech synthesis से response सुनने का option
- PDF Kundali report export
- PWA install support

### Account और business flow

- Google sign-in
- JWT token browser `localStorage` में `jyotish_auth_token` key से रखा जाता है
- AI question की सामान्य cost 3 credits है
- default user credits 10 हैं और maximum 15 हैं
- daily refill mechanism 24 घंटे के बाद credits reset करता है
- social task या redeem code से credits claim करने का flow
- saved Kundlis user account से scoped हैं

## 7. Backend और database

मुख्य backend file `server.ts` है। `api/index.ts` इसे Vercel function के रूप में export करता है।

### Mongoose models

- `User`: Google identity, name, email, role, credits, social handle और refill information
- `KundliRecord`: user ID, birth details, coordinates, planetary positions, dasha, complete chart और AI predictions
- `AppSettings`: maintenance mode, announcement, welcome message, contact, active model और rate limit settings
- `AdminLog`: admin actions और errors

### Authentication flow

1. Google frontend credential `/api/auth/google` को भेजता है।
2. Backend Google ID token/userinfo verify करता है।
3. User MongoDB में upsert होता है। `ADMIN_EMAIL` match होने पर role admin होता है।
4. Backend 7-day JWT बनाकर frontend को देता है।
5. Protected requests `Authorization: Bearer <token>` header भेजती हैं।
6. `authMiddleware` JWT verify करता है; admin routes में `adminMiddleware` भी लगता है।

## 8. API reference

### Public या basic routes

- `GET /api/health`: server, database और AI provider status
- `GET /api/geocode`: Nominatim geocoding proxy
- `POST /api/auth/google`: Google login और JWT creation
- `POST /api/jyotish/deep-analysis`: chart data लेकर deep AI analysis; current implementation में auth/credit protection नहीं है

### Authenticated user routes

- `GET /api/auth/me`: current user और refreshed credits
- `POST /api/user/redeem-code`: access code से credits/access update
- `POST /api/user/claim-task`: social task verification के बाद credits
- `POST /api/jyotish/consult`: AI consultation; सामान्यतः 3 credits खर्च
- `POST /api/kundli/save` और `POST /api/kundlis`: Kundli save
- `GET /api/kundlis`: current user के saved records, maximum 50

### Admin routes

- `GET /api/admin/users`: users list
- `GET /api/admin/kundlis`: paginated/searchable Kundli records
- `GET /api/admin/settings`: global settings
- `PUT /api/admin/settings`: global settings update

## 9. AI system कैसे काम करता है

`server.ts` में provider order यह है:

1. Gemini: configured keys को `GEMINI_KEY_*`, `GEMINI_API_KEYS` या `GEMINI_API_KEY` से collect किया जाता है। तीन candidate models try होते हैं: `gemini-3.1-flash-lite`, `gemini-3.7-flash`, `gemini-flash-latest`। हर request पर timeout और key rotation है।
2. Hugging Face: Gemini पूरी तरह fail होने पर configured `HUGGINGFACE_MODEL` को OpenAI-compatible chat endpoint से call किया जाता है।
3. Internal fallback: दोनों provider unavailable होने पर deterministic scriptural fallback response generate होता है।

AI prompt में chart context, question, category, language और recent चार chat messages जा सकते हैं। Gemini response markdown के रूप में frontend में render होता है। AI consultation authenticated है और credits काटती है; deep-analysis endpoint अभी अलग public path है और उसे production में rate limit/auth से सुरक्षित करना उचित होगा।

## 10. Environment variables

`.env` को कभी commit या Gemini को secret values के साथ share नहीं करना है। केवल variable names और purpose share करें:

```text
GEMINI_API_KEY          Primary Gemini key
GEMINI_KEY_*            Multiple Gemini keys for rotation
GEMINI_API_KEYS         Comma-separated Gemini keys
HUGGINGFACE_API_KEY     Optional AI fallback key
HUGGINGFACE_MODEL       Optional fallback model
GOOGLE_CLIENT_ID        Backend Google OAuth client
VITE_GOOGLE_CLIENT_ID   Frontend Google OAuth client
GOOGLE_CLIENT_SECRET    OAuth configuration, if required
JWT_SECRET              JWT signing secret
MONGODB_URI             MongoDB connection string
ADMIN_EMAIL             Admin account email
PORT                    Local/server port, default 3000
APP_URL                 Hosted app URL
VITE_API_BASE_URL       Optional frontend API base URL
VITE_API_URL            Alternate frontend API base URL
NODE_ENV                Runtime mode
VERCEL                  Vercel runtime flag
DISABLE_HMR             Disable Vite HMR when true
VITE_INSTAGRAM_URL      Optional social profile URL
```

## 11. Local setup और commands

Prerequisite: Node.js और MongoDB connection।

```bash
npm install
copy .env.example .env
# .env में real values भरें; secrets public न करें
npm run dev
```

Useful commands:

```bash
npm run lint    # TypeScript no-emit check
npm run build   # Vite frontend build + esbuild server bundle
npm start       # dist/server.mjs चलाना
```

Local app सामान्यतः `http://localhost:3000` पर चलेगा। Admin path `/admin` है। Production में Vercel `/api/*` को `api/index.ts` और बाकी routes को `index.html` पर rewrite करता है।

## 12. Known risks और future improvement priorities

इन बातों को future changes में ध्यान में रखें:

- planetary और Panchang accuracy बढ़ाने के लिए validated ephemeris/timezone libraries जोड़नी चाहिए;
- `/api/jyotish/deep-analysis` पर authentication, rate limiting और abuse protection जोड़ना चाहिए;
- CORS अभी permissive है (`origin: true`); production में allowed origins सीमित करने चाहिए;
- admin frontend email check और backend `ADMIN_EMAIL` एक ही source से नियंत्रित होने चाहिए;
- redeem access code को source code में रखने के बजाय environment/database में रखना चाहिए;
- admin settings update में allowed fields whitelist करनी चाहिए;
- AI prompts और chart data में personal birth information जाती है, इसलिए privacy policy और data retention स्पष्ट करनी चाहिए;
- chat history browser `localStorage` में रहती है, server-side encrypted persistence नहीं है;
- AI astrology response को medical, legal या financial certainty की तरह प्रस्तुत नहीं करना चाहिए।

## 13. Gemini को मदद मांगने का सही तरीका

Gemini को हर task में ये context देना चाहिए:

1. समस्या क्या है और user को expected behavior क्या चाहिए।
2. कौन-सी file/component में बदलाव चाहिए।
3. क्या यह local calculation, frontend UI, authenticated API, AI prompt या database task है।
4. Existing public interfaces और TypeScript types न तोड़ने की शर्त।
5. `.env` values, JWT secrets और API keys कभी share न करना।
6. Change के बाद `npm run lint`, संबंधित test/build और manual flow check करना।

### Ready prompt for Gemini

```text
यह Jyotish Veda नाम का React 19 + TypeScript + Vite frontend और Express + MongoDB backend project है। मूल Vedic calculations src/utils/vedicCalculations.ts में local चलती हैं। server.ts में Google OAuth/JWT auth, MongoDB saved Kundli, admin routes और Gemini -> Hugging Face -> internal fallback AI orchestration है।

कृपया पहले संबंधित file और nearby types पढ़ो, फिर root cause बताओ। Existing architecture और public APIs के साथ compatible छोटा change दो। .env के secrets न मांगो और hard-coded credentials न जोड़ो। Calculation accuracy को validated ephemeris मानकर दावा मत करो। बदलाव के बाद npm run lint और जरूरत के अनुसार npm run build चलाकर errors बताओ।

मेरा task: [यहाँ exact समस्या लिखें]
Expected behavior: [यहाँ expected result लिखें]
Relevant file/error: [यहाँ path या error लिखें]
```

## 14. Short summary

Jyotish Veda एक full-stack Vedic astrology platform है जिसमें local chart engine, rich analysis UI, AI consultation, account credits, Google authentication, MongoDB persistence, PDF export, Panchang, Kundali Milan और admin panel हैं। Frontend calculation और presentation संभालता है; Express backend auth, persistence, geocoding, AI provider failover और admin APIs संभालता है। Future work में सबसे महत्वपूर्ण क्षेत्र astronomical accuracy, security hardening, privacy, rate limiting और consistent admin configuration हैं।