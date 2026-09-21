import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import mongoose, { Schema } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({ origin: true, credentials: true }));

const { model, models } = mongoose;
const User: any = models.User || model("User", new Schema({
  googleId: { type: String, unique: true, sparse: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  picture: { type: String, default: "" },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  credits: { type: Number, default: 10, max: 15 },
  hasFollowed: { type: Boolean, default: false },
  unlimitedQuestions: { type: Boolean, default: false },
  socialHandle: { type: String, trim: true, lowercase: true, unique: true, sparse: true, index: true },
  lastCreditRefill: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true }));
const KundliRecord: any = models.KundliRecord || model("KundliRecord", new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  name: { type: String, trim: true, required: true }, dob: { type: String, required: true }, tob: { type: String, required: true }, pob: { type: String, required: true },
  latitude: { type: Number, required: true }, longitude: { type: Number, required: true }, birthData: { type: Schema.Types.Mixed, required: true },
  planetaryPositions: { type: Schema.Types.Mixed, default: {} }, dasha: { type: Schema.Types.Mixed, default: {} }, chartData: { type: Schema.Types.Mixed, default: {} }, aiPredictions: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true }));
const AppSettings: any = models.AppSettings || model("AppSettings", new Schema({
  key: { type: String, unique: true, default: "global" }, maintenanceMode: { type: Boolean, default: false }, announcementBanner: { type: String, default: "" }, welcomeMessage: { type: String, default: "" }, contactEmail: { type: String, default: "" }, activeGeminiModel: { type: String, default: "gemini-3.1-flash-lite" }, rateLimitPerMinute: { type: Number, default: 30, min: 1 },
}, { timestamps: true }));
const AdminLog: any = models.AdminLog || model("AdminLog", new Schema({ action: String, message: String, level: { type: String, enum: ["info", "error"], default: "info" }, metadata: Schema.Types.Mixed }, { timestamps: true }));

type MongoCache = { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const mongoCache = (globalThis as typeof globalThis & { __jyotishMongo?: MongoCache }).__jyotishMongo || { connection: null, promise: null };
(globalThis as typeof globalThis & { __jyotishMongo?: MongoCache }).__jyotishMongo = mongoCache;

async function connectToMongo() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
  if (mongoCache.connection) return mongoCache.connection;
  if (!mongoCache.promise) {
    mongoCache.promise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 }).then((connection) => {
      mongoCache.connection = connection;
      console.log("MongoDB connected");
      return connection;
    }).catch((error) => {
      mongoCache.promise = null;
      console.error("MongoDB connection failed:", error instanceof Error ? error.message : error);
      throw error;
    });
  }
  return mongoCache.promise;
}

function getMongoStatus() {
  return ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown";
}

async function requireMongo(res: express.Response) {
  if (!process.env.MONGODB_URI) {
    res.status(503).json({ error: "MongoDB is not configured. Set MONGODB_URI to enable persistence." });
    return false;
  }

  try {
    await connectToMongo();
    return true;
  } catch {
    res.status(503).json({ error: "MongoDB is unavailable." });
    return false;
  }
}

app.use(express.json({ limit: "10mb" }));

type AuthRequest = express.Request & { user?: { id: string; role: string; email: string } };
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "hubby1creation@gmail.com").trim().toLowerCase();
const CREDIT_COST = 3;
const MAX_CREDITS = 15;
const REFILL_INTERVAL_MS = 86_400_000;

function signUserToken(user: { _id: unknown; role?: string; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ sub: String(user._id), role: user.role || "user", email: user.email }, secret, { expiresIn: "7d" });
}

async function ensureAdminRole(user: any) {
  const expectedRole = user.email?.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "user";
  if (user.role !== expectedRole) {
    const updatedUser = await User.findByIdAndUpdate(user._id, { $set: { role: expectedRole } }, { new: true }).lean();
    return updatedUser || { ...user, role: expectedRole };
  }

  return user;
}

async function checkAndRefillCredits(user: any) {
  const now = Date.now();
  const lastRefill = user.lastCreditRefill ? new Date(user.lastCreditRefill).getTime() : now;
  const normalizedCredits = typeof user.credits === "number" ? Math.min(user.credits, MAX_CREDITS) : MAX_CREDITS;

  if (now - lastRefill >= REFILL_INTERVAL_MS) {
    const updated = await User.findByIdAndUpdate(
      user._id,
      { $set: { credits: MAX_CREDITS, lastCreditRefill: new Date(), hasFollowed: false } },
      { new: true }
    ).lean();
    return updated || { ...user, credits: MAX_CREDITS, lastCreditRefill: new Date(), hasFollowed: false };
  }

  if (normalizedCredits <= 0 && user.hasFollowed === true) {
    const updated = await User.findByIdAndUpdate(
      user._id,
      { $set: { hasFollowed: false } },
      { new: true }
    ).lean();
    return updated || { ...user, hasFollowed: false };
  }

  if (user.credits !== normalizedCredits || !user.lastCreditRefill) {
    const updated = await User.findByIdAndUpdate(
      user._id,
      { $set: { credits: normalizedCredits, lastCreditRefill: user.lastCreditRefill || new Date(), hasFollowed: user.hasFollowed === true } },
      { new: true }
    ).lean();
    return updated || { ...user, credits: normalizedCredits, lastCreditRefill: user.lastCreditRefill || new Date(), hasFollowed: user.hasFollowed === true };
  }

  return user;
}

function publicUser(user: any) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
    credits: user.credits ?? 10,
    hasFollowed: user.hasFollowed === true,
    unlimitedQuestions: user.unlimitedQuestions === true,
    socialHandle: user.socialHandle,
    lastCreditRefill: user.lastCreditRefill,
  };
}

async function adminMiddleware(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  if (req.user?.email.trim().toLowerCase() !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Admin access required." });
  }

  if (!(await requireMongo(res))) return;
  const currentUser = await User.findById(req.user.id).lean();
  if (!currentUser) return res.status(403).json({ error: "Admin access required." });
  const authorizedUser = await ensureAdminRole(currentUser);
  if (authorizedUser.role !== "admin") return res.status(403).json({ error: "Admin access required." });
  return next();
}

function authMiddleware(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "";
  if (!token || !process.env.JWT_SECRET) return res.status(401).json({ error: "Authentication required." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as { sub?: string; role?: string; email?: string };
    if (!payload.sub || !payload.email) throw new Error("Invalid token payload.");
    req.user = { id: payload.sub, role: payload.role || "user", email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}

app.post("/api/auth/google", async (req, res) => {
  if (!(await requireMongo(res))) return;
  const credential = typeof req.body?.credential === "string" ? req.body.credential : req.body?.token;
  if (!credential) return res.status(400).json({ error: "Google credential is required." });
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) return res.status(503).json({ error: "Google authentication is not configured." });
  try {
    let payload: { sub?: string; email?: string; name?: string; picture?: string } | undefined;
    if (credential.split(".").length === 3) {
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } else {
      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${credential}` } });
      if (!profileResponse.ok) throw new Error(`Google userinfo HTTP ${profileResponse.status}`);
      payload = await profileResponse.json() as typeof payload;
    }
    if (!payload?.sub || !payload.email) return res.status(401).json({ error: "Google account did not provide a valid identity." });
    const email = payload.email.trim().toLowerCase();
    let user = await User.findOneAndUpdate(
      { $or: [{ googleId: payload.sub }, { email }] },
      { $set: { googleId: payload.sub, name: payload.name || email.split("@")[0], email, picture: payload.picture || "", role: email === ADMIN_EMAIL ? "admin" : "user" }, $setOnInsert: { createdAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    user = await ensureAdminRole(user);
    user = await checkAndRefillCredits(user);
    return res.json({ token: signUserToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("Google authentication failed:", error instanceof Error ? error.message : error);
    return res.status(401).json({ error: "Unable to verify Google account." });
  }
});

app.get("/api/admin/users", authMiddleware, adminMiddleware, async (_req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }).select("name email picture role socialHandle createdAt").lean();
  return res.json({ users });
});

app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
  if (!(await requireMongo(res))) return;
  const user = await User.findById(req.user!.id).lean();
  if (!user) return res.status(401).json({ error: "User account not found." });
  const authorizedUser = await ensureAdminRole(user);
  const refreshedUser = await checkAndRefillCredits(authorizedUser);
  return res.json({ user: publicUser(refreshedUser) });
});

app.post("/api/user/redeem-code", authMiddleware, async (req: AuthRequest, res) => {
  if (!(await requireMongo(res))) return;
  const rawCode = typeof req.body?.code === "string" ? req.body.code.trim() : "";
  const normalizedCode = rawCode.replace(/[^0-9]/g, "");

  if (!rawCode || !normalizedCode) {
    return res.status(400).json({ error: "Redeem code is required." });
  }

  if (normalizedCode !== "142006") {
    return res.status(400).json({ error: "Invalid redeem code." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user!.id },
      {
        $set: {
          unlimitedQuestions: true,
          hasFollowed: false,
          credits: MAX_CREDITS,
          lastCreditRefill: new Date(),
        },
      },
      { new: true }
    ).lean();

    if (!user) return res.status(404).json({ error: "User account not found." });
    return res.json({ message: "Redeem code applied successfully.", user: publicUser(user) });
  } catch (error) {
    console.error("Redeem code error:", error);
    return res.status(500).json({ error: "Failed to redeem code." });
  }
});

app.post("/api/user/claim-task", authMiddleware, async (req: AuthRequest, res) => {
  if (!(await requireMongo(res))) return;
  const currentUser = await User.findById(req.user!.id).lean();
  if (!currentUser) return res.status(404).json({ error: "User account not found." });
  if (currentUser.hasFollowed === true) return res.status(400).json({ error: "Credits already claimed" });

  const handle = typeof req.body?.handle === "string" ? req.body.handle.trim().toLowerCase() : "";
  const platform = typeof req.body?.platform === "string" ? req.body.platform.trim().toLowerCase() : "";
  const dwellSeconds = Number(req.body?.dwellSeconds);
  if (!handle) return res.status(400).json({ error: "Social handle is required" });
  if (!platform) return res.status(400).json({ error: "Social platform is required" });
  if (!Number.isFinite(dwellSeconds) || dwellSeconds < 12) return res.status(400).json({ error: "Visit duration too short" });

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user!.id, hasFollowed: { $ne: true } },
      { $set: { hasFollowed: true, credits: MAX_CREDITS, socialHandle: handle, lastCreditRefill: new Date() } },
      { new: true }
    ).lean();
    if (!user) return res.status(400).json({ error: "Credits already claimed" });
    return res.json({ user: publicUser(user) });
  } catch (error: any) {
    if (error?.code === 11000) return res.status(409).json({ error: "This handle has already been used to claim credits" });
    throw error;
  }
});

// Server-side Gemini client
function getGeminiKeys() {
  const numberedKeys = Object.entries(process.env)
    .filter(([name, value]) => /^GEMINI_KEY_.+$/i.test(name) && value?.trim())
    .sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }))
    .map(([, value]) => value!.trim());
  const listKeys = (process.env.GEMINI_API_KEYS || "").split(",").map((key) => key.trim()).filter(Boolean);
  const legacyKey = process.env.GEMINI_API_KEY?.trim();
  return [...new Set([...numberedKeys, ...listKeys, ...(legacyKey ? [legacyKey] : [])])];
}

const geminiKeys = getGeminiKeys();
let activeGeminiKeyIndex = 0;
let activeAIProvider = geminiKeys.length > 0 ? "gemini" : process.env.HUGGINGFACE_API_KEY ? "huggingface" : "internal";
const huggingFaceModel = process.env.HUGGINGFACE_MODEL || "Qwen/Qwen2.5-72B-Instruct";

function getGeminiClient(key: string) {
  return new GoogleGenAI({ apiKey: key, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
}

function getAIHealth() {
  return {
    gemini: geminiKeys.length > 0 ? "configured" : "missing",
    geminiKeyCount: geminiKeys.length,
    huggingface: process.env.HUGGINGFACE_API_KEY ? "configured" : "missing",
    huggingFaceModel,
    activeProvider: activeAIProvider,
  };
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    server: "ok",
    service: "Jyotish Veda Vedic Astrology Engine",
    database: getMongoStatus(),
    ...getAIHealth(),
  });
});

async function saveKundli(req: AuthRequest, res: express.Response) {
  if (!(await requireMongo(res))) return;

  const { birthData, kundaliData, aiPredictions, aiReading } = req.body;
  if (!birthData || !kundaliData || typeof birthData.name !== "string") {
    return res.status(400).json({ error: "birthData and kundaliData are required." });
  }

  try {
    const record = await KundliRecord.create({
      name: birthData.name.trim() || "Jataka",
      userId: req.user!.id,
      dob: birthData.dateOfBirth,
      tob: birthData.timeOfBirth,
      pob: birthData.locationName || birthData.city || "Unknown",
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      birthData,
      planetaryPositions: kundaliData.planets,
      dasha: kundaliData.currentDasha,
      chartData: kundaliData,
      aiPredictions: aiPredictions || aiReading || {},
    });
    return res.status(201).json({ record });
  } catch (error) {
    console.error("Kundli save error:", error);
    await AdminLog.create({ action: "kundli.save", message: "Failed to save kundli record", level: "error" }).catch(() => undefined);
    return res.status(500).json({ error: "Failed to save kundli record." });
  }
}

app.post("/api/kundli/save", authMiddleware, saveKundli);
app.post("/api/kundlis", authMiddleware, saveKundli);

app.get("/api/kundlis", authMiddleware, async (req: AuthRequest, res) => {
  if (!(await requireMongo(res))) return;

  try {
    const records = await KundliRecord.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("name dob tob pob birthData chartData createdAt")
      .lean();
    return res.json({ records });
  } catch (error) {
    console.error("User kundli fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch your kundli records." });
  }
});

app.get("/api/admin/kundlis", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const search = String(req.query.search || "").trim();
    const from = String(req.query.from || "").trim();
    const to = String(req.query.to || "").trim();
    const query: Record<string, unknown> = {};
    if (req.user?.role !== "admin") query.userId = req.user!.id;
    if (search) query.$text = { $search: search };
    if (from || to) query.createdAt = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(`${to}T23:59:59.999Z`) } : {}) };
    const [records, total] = await Promise.all([
      KundliRecord.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      KundliRecord.countDocuments(query),
    ]);
    return res.json({ records, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("Kundli log fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch kundli records." });
  }
});

app.get("/api/admin/settings", authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const settings = await AppSettings.findOne({ key: "global" }).lean();
    return res.json({ settings: settings || {} });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch admin settings." });
  }
});

app.put("/api/admin/settings", authMiddleware, adminMiddleware, async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "Settings must be a JSON object." });
  }

  try {
    const settings = await AppSettings.findOneAndUpdate(
      { key: "global" },
      { $set: req.body, $setOnInsert: { key: "global" } },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    await AdminLog.create({ action: "settings.update", message: "Application settings updated", metadata: req.body });
    return res.json({ settings });
  } catch (error) {
    console.error("Settings update error:", error);
    return res.status(500).json({ error: "Failed to update admin settings." });
  }
});

// Helper for timezone offset estimation on server
function getServerTimezoneOffset(lat: number, lon: number, countryCode: string = "") {
  const cCode = countryCode.toLowerCase();
  if (cCode === "in" || (lat >= 6.5 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5)) {
    return { offset: 5.5, name: "IST (Indian Standard Time)" };
  }
  if (cCode === "np" || (lat >= 26.3 && lat <= 30.5 && lon >= 80.0 && lon <= 88.3)) {
    return { offset: 5.75, name: "NPT (Nepal Time)" };
  }
  if (cCode === "lk") return { offset: 5.5, name: "SLST (Sri Lanka Time)" };
  if (cCode === "bd") return { offset: 6.0, name: "BST (Bangladesh Time)" };
  if (cCode === "pk") return { offset: 5.0, name: "PKT (Pakistan Time)" };
  if (cCode === "ae" || cCode === "om") return { offset: 4.0, name: "GST (Gulf Time)" };
  if (cCode === "sa" || cCode === "qa" || cCode === "kw") return { offset: 3.0, name: "AST (Arabia Time)" };
  if (cCode === "gb" || cCode === "uk") return { offset: 0.0, name: "GMT (UK Time)" };
  if (cCode === "sg" || cCode === "my" || cCode === "cn" || cCode === "hk") return { offset: 8.0, name: "SGT/CST (UTC+8)" };
  if (cCode === "jp" || cCode === "kr") return { offset: 9.0, name: "JST/KST (UTC+9)" };
  if (cCode === "au") {
    if (lon > 140) return { offset: 10.0, name: "AEST (UTC+10)" };
    if (lon > 129) return { offset: 9.5, name: "ACST (UTC+9.5)" };
    return { offset: 8.0, name: "AWST (UTC+8)" };
  }
  if (["de", "fr", "it", "es", "nl", "be", "at", "ch", "se", "no", "pl"].includes(cCode)) {
    return { offset: 1.0, name: "CET (UTC+1)" };
  }
  if (cCode === "us" || cCode === "ca") {
    if (lon >= -85) return { offset: -5.0, name: "EST (Eastern UTC-5)" };
    if (lon >= -100) return { offset: -6.0, name: "CST (Central UTC-6)" };
    if (lon >= -114) return { offset: -7.0, name: "MST (Mountain UTC-7)" };
    return { offset: -8.0, name: "PST (Pacific UTC-8)" };
  }
  const rawOffset = Math.round((lon / 15) * 2) / 2;
  return { offset: rawOffset, name: `UTC${rawOffset >= 0 ? "+" : ""}${rawOffset}` };
}

// In-memory cache for fast search responses
const geocodeCache = new Map<string, any>();

// API: Geocode / City Search (OpenStreetMap Nominatim proxy)
app.get("/api/geocode", async (req, res) => {
  const query = (req.query.q as string || "").trim();
  if (!query || query.length < 2) {
    return res.json([]);
  }

  const cacheKey = query.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return res.json(geocodeCache.get(cacheKey));
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=10&addressdetails=1`;

    const fetchResponse = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "JyotishVeda-AstrologyApp/1.0 (contact: support@jyotishveda.app)",
        Accept: "application/json",
      },
    });

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).json({ error: "Geocoding service unavailable" });
    }

    const items = await fetchResponse.json();
    const formatted = (items || []).map((item: any) => {
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
      const tzInfo = getServerTimezoneOffset(lat, lon, countryCode);

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

    geocodeCache.set(cacheKey, formatted);
    // Limit cache size to 200 items
    if (geocodeCache.size > 200) {
      const firstKey = geocodeCache.keys().next().value;
      if (firstKey) geocodeCache.delete(firstKey);
    }

    res.json(formatted);
  } catch (error: any) {
    console.error("Geocoding proxy error:", error);
    res.status(500).json({ error: "Failed to fetch location coordinates" });
  }
});

// Timeout helper for promises
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

// Call Gemini models using each configured key before moving to the next provider.
async function callGeminiWithRetry(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.7,
  chatHistory: Array<{ sender: string; text: string }> = []
): Promise<string> {
  // Supported valid models per Gemini API guidelines: gemini-3.1-flash-lite, gemini-3.7-flash, gemini-flash-latest
  const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-flash-latest"];
  let lastError: any = null;

  // Build conversational contents if chat history exists
  const formattedContents: any[] = [];
  if (chatHistory && chatHistory.length > 0) {
    const recentHistory = chatHistory.slice(-4);
    for (const msg of recentHistory) {
      formattedContents.push({
        role: msg.sender === "astrologer" ? "model" : "user",
        parts: [{ text: msg.text }],
      });
    }
  }
  formattedContents.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  for (let keyAttempt = 0; keyAttempt < geminiKeys.length; keyAttempt += 1) {
    const keyIndex = (activeGeminiKeyIndex + keyAttempt) % geminiKeys.length;
    const ai = getGeminiClient(geminiKeys[keyIndex]);
    for (const model of candidateModels) {
      try {
        console.log(`[Gemini Consultation] Attempting key ${keyIndex + 1}/${geminiKeys.length}, model: ${model}`);
        const config: any = { systemInstruction, temperature };
        if (model === "gemini-3.7-flash") config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        const response = await withTimeout(ai.models.generateContent({ model, contents: formattedContents, config }), 12000, `Model ${model} timed out after 12s`);
        if (response.text && response.text.trim().length > 0) {
          activeGeminiKeyIndex = keyIndex;
          activeAIProvider = "gemini";
          console.log(`[Gemini Consultation] Success with key ${keyIndex + 1}, model: ${model}`);
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini API] Key ${keyIndex + 1}, model ${model} failed: ${String(err?.message || err)}`);
      }
    }
    if (geminiKeys.length > 1 && keyAttempt < geminiKeys.length - 1) {
      const nextKeyIndex = (keyIndex + 1) % geminiKeys.length;
      console.warn(`[Gemini Key Rotation] Switching from key ${keyIndex + 1} to key ${nextKeyIndex + 1} after provider failure.`);
    }
  }

  throw lastError || new Error("All Gemini model attempts exhausted.");
}

async function callHuggingFace(prompt: string, systemInstruction?: string, temperature = 0.7, chatHistory: Array<{ sender: string; text: string }> = []) {
  const apiKey = process.env.HUGGINGFACE_API_KEY?.trim();
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is not configured.");
  const messages = [
    ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
    ...chatHistory.slice(-4).map((message) => ({ role: message.sender === "astrologer" ? "assistant" : "user", content: message.text })),
    { role: "user", content: prompt },
  ];
  const response = await withTimeout(fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: huggingFaceModel, messages, temperature, max_tokens: 1800 }),
  }), 15000, "Hugging Face request timed out");
  if (!response.ok) throw new Error(`Hugging Face HTTP ${response.status}: ${await response.text()}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Hugging Face returned an empty response.");
  activeAIProvider = "huggingface";
  console.log(`[Hugging Face] Success with model: ${huggingFaceModel}`);
  return text;
}

async function callAIWithFallback(prompt: string, systemInstruction: string, temperature: number, chatHistory: Array<{ sender: string; text: string }>, localFallback: () => string) {
  try {
    return { text: await callGeminiWithRetry(prompt, systemInstruction, temperature, chatHistory), isFallback: false };
  } catch (geminiError: any) {
    console.warn(`[AI Failover] All Gemini keys exhausted: ${geminiError?.message || geminiError}`);
  }
  try {
    return { text: await callHuggingFace(prompt, systemInstruction, temperature, chatHistory), isFallback: false };
  } catch (huggingFaceError: any) {
    console.warn(`[AI Failover] Hugging Face unavailable: ${huggingFaceError?.message || huggingFaceError}`);
  }
  activeAIProvider = "internal";
  return { text: localFallback(), isFallback: true };
}

// Deep, truthful, scripture-grounded Parashari calculation analyzer
function generateScripturalFallbackReading(
  chartContext: any,
  userQuestion: string,
  category: string,
  language: string
): string {
  let parsedChart: any = null;
  if (typeof chartContext === "object" && chartContext !== null) {
    parsedChart = chartContext;
  } else if (typeof chartContext === "string") {
    try {
      parsedChart = JSON.parse(chartContext);
    } catch {
      parsedChart = null;
    }
  }

  // Extract from dynamic JSON payload
  const name =
    parsedChart?.jatakaName ||
    parsedChart?.name ||
    parsedChart?.birthDetails?.name ||
    "Jataka (जातक)";

  const dob = parsedChart?.birthDetails?.dateOfBirth || "";
  let age = 0;
  if (dob) {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    age = isNaN(birthYear) ? 0 : Math.max(0, currentYear - birthYear);
  }

  const asc =
    parsedChart?.ascendantLagna?.rashi
      ? `${parsedChart.ascendantLagna.rashi} (${parsedChart.ascendantLagna.formattedDegree || ""})`
      : typeof parsedChart?.ascendant === "object"
      ? `${parsedChart.ascendant.rashi || "Ascendant"} (${parsedChart.ascendant.formattedDegree || ""})`
      : parsedChart?.ascendant || "Calculated Ascendant";

  const ascLord = parsedChart?.ascendantLagna?.rashiLord || "Lagna Lord";

  const moon =
    parsedChart?.moonSignChandra?.rashi
      ? `${parsedChart.moonSignChandra.rashi} (${parsedChart.moonSignChandra.formattedDegree || ""})`
      : typeof parsedChart?.moonSign === "object"
      ? `${parsedChart.moonSign.rashi || "Moon"}`
      : parsedChart?.moonSign || "Calculated Moon Sign";

  const nakshatra =
    parsedChart?.moonSignChandra?.nakshatra ||
    parsedChart?.birthNakshatra ||
    "Natal Nakshatra";

  const pada =
    parsedChart?.moonSignChandra?.nakshatraPada ||
    parsedChart?.birthPada ||
    "";

  const sun =
    parsedChart?.sunSignSurya?.rashi
      ? `${parsedChart.sunSignSurya.rashi} (भाव ${parsedChart.sunSignSurya.house || 1}, ${parsedChart.sunSignSurya.formattedDegree || ""})`
      : typeof parsedChart?.sunSign === "object"
      ? `${parsedChart.sunSign.rashi || "Sun"}`
      : parsedChart?.sunSign || "Calculated Sun Sign";

  const dasha =
    parsedChart?.currentVimshottariDasha?.dashaSummary ||
    (parsedChart?.currentDasha?.mahadasha?.planet
      ? `${parsedChart.currentDasha.mahadasha.planet} महादशा / ${parsedChart.currentDasha.antardasha?.planet || ""} अंतर्दशा (सक्रिय)`
      : parsedChart?.currentDasha || "सक्रिय विंशोत्तरी दशा");

  const yogas = Array.isArray(parsedChart?.yogasDetected)
    ? parsedChart.yogasDetected
    : Array.isArray(parsedChart?.yogas)
    ? parsedChart.yogas
    : [];

  const doshas = parsedChart?.doshaAnalysis || parsedChart?.doshas || {};
  const planets: any[] = Array.isArray(parsedChart?.planetaryPositions)
    ? parsedChart.planetaryPositions
    : Array.isArray(parsedChart?.planets)
    ? parsedChart.planets
    : [];

  const houses: any[] = Array.isArray(parsedChart?.bhavasHousesSummary)
    ? parsedChart.bhavasHousesSummary
    : Array.isArray(parsedChart?.houses)
    ? parsedChart.houses
    : [];

  // Extract House 7 (Marriage / Relationships)
  const h7 = houses.find((h: any) => h.houseNumber === 7) || {};
  const h7Rashi = h7.rashi || "सप्तम भाव";
  const h7Lord = h7.rashiLord || h7.lord || "सप्तमेश";
  const h7Planets = Array.isArray(h7.occupyingPlanets) ? h7.occupyingPlanets : [];

  // Extract House 10 (Career / Karma)
  const h10 = houses.find((h: any) => h.houseNumber === 10) || {};
  const h10Rashi = h10.rashi || "दशम भाव";
  const h10Lord = h10.rashiLord || h10.lord || "दशमेश";
  const h10Planets = Array.isArray(h10.occupyingPlanets) ? h10.occupyingPlanets : [];

  // Extract House 2 & 11 (Wealth / Dhana)
  const h2 = houses.find((h: any) => h.houseNumber === 2) || {};
  const h2Lord = h2.rashiLord || h2.lord || "द्वितीयेश";
  const h11 = houses.find((h: any) => h.houseNumber === 11) || {};
  const h11Lord = h11.rashiLord || h11.lord || "एकादशेश";

  // Key planets
  const venusP = planets.find((p: any) => p.planet === "Venus" || p.name === "Venus");
  const jupiterP = planets.find((p: any) => p.planet === "Jupiter" || p.name === "Jupiter");
  const saturnP = planets.find((p: any) => p.planet === "Saturn" || p.name === "Saturn");
  const marsP = planets.find((p: any) => p.planet === "Mars" || p.name === "Mars");
  const mercuryP = planets.find((p: any) => p.planet === "Mercury" || p.name === "Mercury");

  const lowerQ = (userQuestion + " " + category).toLowerCase();
  const isEnglish = language.toLowerCase() === "english";

  // Determine query focus
  const isCareer = lowerQ.includes("career") || lowerQ.includes("job") || lowerQ.includes("naukri") || lowerQ.includes("business") || lowerQ.includes("vyapar") || lowerQ.includes("profession") || lowerQ.includes("karm") || lowerQ.includes("kam");
  const isMarriage = lowerQ.includes("marriage") || lowerQ.includes("shadi") || lowerQ.includes("shaadi") || lowerQ.includes("vivah") || lowerQ.includes("love") || lowerQ.includes("relationship") || lowerQ.includes("spouse") || lowerQ.includes("patni") || lowerQ.includes("pati") || lowerQ.includes("dulha") || lowerQ.includes("dulhan");
  const isHealth = lowerQ.includes("health") || lowerQ.includes("swasthya") || lowerQ.includes("bimari") || lowerQ.includes("disease") || lowerQ.includes("sehat") || lowerQ.includes("ayush");
  const isFinance = lowerQ.includes("money") || lowerQ.includes("wealth") || lowerQ.includes("paisa") || lowerQ.includes("dhan") || lowerQ.includes("finance") || lowerQ.includes("debt") || lowerQ.includes("karz") || lowerQ.includes("labh");
  const isDasha = lowerQ.includes("dasha") || lowerQ.includes("mahadasha") || lowerQ.includes("antardasha") || lowerQ.includes("samay") || lowerQ.includes("timing");

  // Format planetary summary for reading
  const planetsSummaryHindi = planets.length > 0 
    ? planets.slice(0, 8).map((p: any) => `${p.sanskritName || p.planet || p.name} (${p.rashi} राशि, भाव ${p.house || 1}${p.dignity ? ', ' + p.dignity : ''})`).join("; ")
    : "कुंडली के ग्रह विन्यास का सत्यापन पूर्ण हुआ";

  const yogaSummaryHindi = yogas.length > 0
    ? yogas.slice(0, 3).map((y: any) => typeof y === "string" ? y : `**${y.name}** (${y.category || 'शुभ योग'}): ${y.effect || 'कुंडली के आधार को शक्ति प्रदान करता है।'}`).join("\n* ")
    : "गजलक्ष्मी एवं केंद्र-त्रिकोण संरेखण (शुभ एवं रक्षात्मक आधार)";

  if (!isEnglish) {
    let focusAnalysisHindi = "";
    if (isMarriage) {
      const ageContext = age > 0 && age < 18
        ? `\n* **जातक की आयु स्थिति:** जन्म तिथि **${dob}** के अनुसार जातक की वर्तमान आयु लगभग **${age} वर्ष** है (बाल्यकाल/विद्या अर्जन काल)। प्राथमिक ध्यान शिक्षा और संस्कार पर केंद्रित रहना चाहिए। विवाह का शास्त्रसम्मत समय वयस्क होने के पश्चात् ही आएगा।`
        : "";

      focusAnalysisHindi = `#### ३. वैवाहिक एवं संबंध स्थिति (7th House Vivah Analysis)${ageContext}
* **सप्तम भाव (कलत्र भाव) की स्थिति:** आपकी कुंडली में लग्न **${asc}** होने से सप्तम भाव में **${h7Rashi}** राशि स्थित है, जिसका स्वामी ग्रह **${h7Lord}** है।
* **ग्रह स्थिति एवं कारक:** 
  • सप्तमेश **${h7Lord}** तथा विवाह कारक **शुक्र** (${venusP ? `${venusP.rashi} राशि, भाव ${venusP.house || 1}` : 'शुभ स्थिति'}) में स्थित हैं।
  • ${h7Planets.length > 0 ? `सप्तम भाव में **${h7Planets.join(', ')}** ग्रह की उपस्थिति है।` : 'सप्तम भाव पर शुभ ग्रहों का दृष्टि प्रभाव बना हुआ है।'}
* **मांगलिक स्थिति:** ${doshas.manglik?.present ? (doshas.manglik.isCancelled ? 'मांगलिक प्रभाव कुंडली में उपस्थित है परंतु शास्त्रसम्मत नियमों से **निरस्त (Cancelled)** है।' : `मांगलिक प्रभाव: ${doshas.manglik.severity}।`) : 'कुंडली में कोई बाधक मांगलिक दोष नहीं है।'}
* **विवाह का अनुकूल समय (Marriage Timing):** वर्तमान में **${dasha}** चल रही है। ${age > 0 && age < 18 ? `वयस्क होने पर लगभग **२४ से २८ वर्ष की आयु** में जब सप्तमेश/शुक्र/गुरु की अनुकूल अंतर्दशा आएगी, तब वैवाहिक संबंध का परिपक्व योग बनेगा।` : `सप्तमेश व कारक ग्रह की शुभ अंतर्दशा एवं देवगुरु बृहस्पति के शुभ गोचर में विवाह का अनुकूल मार्ग प्रशस्त होगा।`}
* **जीवनसाथी का स्वभाव:** सप्तम भाव में **${h7Rashi}** एवं **${h7Lord}** के प्रभाव से जीवनसाथी समझदार, संस्कारी, स्वाभिमानी एवं पारिवारिक मूल्यों का सम्मान करने वाला होगा।`;
    } else if (isCareer) {
      focusAnalysisHindi = `#### ३. कर्मक्षेत्र, व्यवसाय एवं आजीविका (10th House Karma Analysis)
* **दशम भाव (कर्म भाव) का विश्लेषण:** आपकी कुंडली में लग्न **${asc}** के अनुसार दशम भाव में **${h10Rashi}** राशि स्थित है, जिसके स्वामी ग्रह **${h10Lord}** हैं।
* **कर्म कारक ग्रह:** ${h10Planets.length > 0 ? `दशम भाव में **${h10Planets.join(', ')}** की स्थिति कर्मक्षेत्र में सक्रियता दर्शाती है।` : `दशमेश **${h10Lord}** की स्थिति से कार्यक्षेत्र में प्रतिष्ठा का योग बनता है।`}
* **अनुकूल क्षेत्र:** लग्न **${asc}** और चंद्र **${moon}** के अनुसार आपके लिए विश्लेषणात्मक, परामर्श, तकनीकी, प्रबंधन अथवा शासकीय/संगठनात्मक क्षेत्रों में विशेष उन्नति के योग हैं।
* **वर्तमान दशा का फल:** सक्रिय **${dasha}** आपको कौशल वृद्धि और सतत प्रयास से पदोन्नति की ओर अग्रसर करेगी।`;
    } else if (isFinance) {
      focusAnalysisHindi = `#### ३. धन, संपत्ति एवं आर्थिक संचय (2nd & 11th House Wealth Analysis)
* **द्वितीय (धन) एवं एकादश (लाभ) भाव:** द्वितीय भाव के स्वामी **${h2Lord}** और लाभ भाव के स्वामी **${h11Lord}** आर्थिक स्थिरता के मुख्य आधार हैं।
* **धन योग:** आपकी कुंडली में स्थिर संचय के योग हैं। अनियोजित जोखिम या सट्टेबाजी से बचकर सुरक्षित निवेश से दीर्घकालिक समृद्धि प्राप्त होगी।
* **वर्तमान दशा संदेश:** **${dasha}** के अंतर्गत वित्तीय अनुशासन बनाए रखें।`;
    } else if (isHealth) {
      focusAnalysisHindi = `#### ३. स्वास्थ्य एवं जीवनी शक्ति (1st & 6th House Health Analysis)
* **लग्न बल (Vitality):** लग्न **${asc}** (स्वामी: ${ascLord}) आपकी शारीरिक ऊर्जा का केंद्र है।
* **रोग प्रतिरोधक क्षमता:** नियमित दिनचर्या, पर्याप्त निद्रा और संतुलित सात्विक आहार से जीवनी शक्ति सुदृढ़ रहेगी।
* **सावधानी:** मानसिक तनाव से बचें और प्रातःकाल सूर्य नमस्कार का अभ्यास करें।`;
    } else {
      focusAnalysisHindi = `#### ३. आपके प्रश्न का शास्त्रसम्मत विश्लेषण (Contextual Vedic Analysis)
* **कुंडली की आधारशिला:** लग्न **${asc}** और चंद्र राशि **${moon}** (${nakshatra}) आपके स्वभाव, विचार और कर्म को दिशा प्रदान करते हैं।
* **सक्रिय दशा प्रभाव:** वर्तमान में **${dasha}** का प्रभाव है, जो आपको धैर्य और विवेक के साथ निर्णय लेने का मार्गदर्शन देती है।
* **ग्रह स्थिति:** ${planetsSummaryHindi}।`;
    }

    return `### ॐ श्री गणेशाय नमः | प्रामाणिक वैदिक ज्योतिष परामर्श

**सादर नमस्कार ${name} जी।**
बृहत् पराशर होरा शास्त्र एवं आपकी जन्म कुंडली की सटीक गणना के आधार पर शास्त्रसम्मत विश्लेषण:

#### १. आधारभूत कुंडली विन्यास (Natal Matrix)
* **लग्न (Ascendant):** **${asc}** (लग्न स्वामी: **${ascLord}**) — आपका आत्मबल, व्यक्तित्व और शारीरिक ऊर्जा।
* **चंद्र राशि एवं नक्षत्र (Moon):** **${moon}** (${nakshatra}${pada ? ', पद ' + pada : ''}) — मन की एकाग्रता, भावनाएं एवं मानसिक संतुलन।
* **सूर्य स्थिति (Surya Factor):** **${sun}** — आत्मा का कारक एवं यश-सम्मान।

#### २. सक्रिय विंशोत्तरी दशा (Current Dasha Period)
* **सक्रिय कालखण्ड:** **${dasha}**
* **दशा का प्रभाव:** यह कालखण्ड आपके जीवन में कर्म-शुद्धि, अनुशासन और सही दिशा में लिए गए निर्णयों का शुभ फल देने में सक्षम है।

${focusAnalysisHindi}

#### ४. कुंडली में उपस्थित शुभ योग
* ${yogaSummaryHindi}

#### ५. शास्त्रसम्मत सात्विक एवं कल्याणकारी उपाय (Sattvik Upay)
१. **दैनिक मंत्र जप:** प्रतिदिन प्रातः **"ॐ नमः शिवाय"** अथवा **"ॐ नमो भगवते वासुदेवाय"** का शांत मन से १०८ बार जप करें।
२. **सूर्य देव को अर्घ्य:** प्रातःकाल तांबे के पात्र में स्वच्छ जल लेकर उगते सूर्य को अर्घ्य दें और गायत्री मंत्र का स्मरण करें।
३. **सद्कर्म एवं दान:** बुधवार या गुरुवार को गाय को हरा चारा अथवा जरूरतमंद को भोजन/अन्न का दान करें।
४. **आचरण शुद्धि:** माता-पिता और गुरुजनों का आशीर्वाद लें और वाणी में सौम्यता बनाए रखें।

***
*Disclaimer: Astrological guidance offers traditional Vedic perspectives for spiritual insight and self-reflection. For medical, financial, or legal matters, please always consult certified professionals alongside Vedic remedies.*`;
  }

  // English / Global Reading
  let focusAnalysisEng = "";
  if (isMarriage) {
    const ageNote = age > 0 && age < 18 ? `\n* **Age Profile:** Based on DOB ${dob}, current age is ~${age} years. Education and personal growth are paramount at this stage; marriage timing applies in adulthood.` : "";
    focusAnalysisEng = `#### 3. Marriage & Relationships (7th Bhava Synthesis)${ageNote}
* **7th House Structure:** With ${asc} Ascendant, the 7th house sits in **${h7Rashi}**, governed by **${h7Lord}**.
* **Significators:** 7th lord **${h7Lord}** and Venus (${venusP ? `${venusP.rashi}, House ${venusP.house || 1}` : 'favorable'}) shape relationship foundations.
* **Manglik Assessment:** ${doshas.manglik?.present ? (doshas.manglik.isCancelled ? 'Manglik present but scripturally cancelled.' : doshas.manglik.severity) : 'No obstructive Manglik dosha.'}
* **Auspicious Timing:** ${age > 0 && age < 18 ? `In adulthood (ages 24-28), supportive sub-periods of 7th lord/Venus/Jupiter will unlock marriage prospects.` : `Supportive Dasha sub-periods of 7th lord or Jupiter transits open favorable marriage windows.`}`;
  } else if (isCareer) {
    focusAnalysisEng = `#### 3. Career & Profession (10th Bhava Synthesis)
* **Karma & Midheaven:** 10th house is **${h10Rashi}**, ruled by **${h10Lord}**.
* **Progress Trajectory:** Disciplined mastery under **${dasha}** activates steady professional growth.`;
  } else {
    focusAnalysisEng = `#### 3. Contextual Query Analysis (For: "${userQuestion}")
* **Natal Matrix:** ${asc} Lagna with ${moon} Moon (${nakshatra}).
* **Active Cycle:** Governed by **${dasha}**.`;
  }

  return `### ॐ Sri Ganeshay Namah | Authentic Vedic Astrological Reading

**Namaste ${name}.**
Grounded strictly in your calculated birth chart and classical *Brihat Parashara Hora Shastra (BPHS)*:

#### 1. Core Natal Matrix (Lagna & Chandra)
* **Ascendant (Lagna):** **${asc}** — Governs vitality, disposition, and outer manifestation.
* **Moon Sign & Nakshatra:** **${moon}** (${nakshatra}${pada ? ', Pada ' + pada : ''}) — Governs emotional equilibrium and mental clarity.
* **Sun Position:** **${sun}** — Governs willpower and core vitality.

#### 2. Active Planetary Period (Vimshottari Dasha)
* **Active Period:** **${dasha}**
* **Parashari Impact:** Directs primary focus toward deliberate karma, learning, and steady progression.

${focusAnalysisEng}

#### 4. Active Yogas & Alignments
* ${yogaSummaryHindi}

#### 5. Safe & Sattvik Vedic Remedies (Upay)
1. **Sacred Mantra:** Chant **"Om Namah Shivaya"** or **"Om Namo Bhagavate Vasudevaya"** 108 times daily in the morning.
2. **Surya Arghya:** Offer water to the rising morning Sun in a copper vessel with quiet gratitude.
3. **Sattvik Daan:** Offer grains to birds or cows on Wednesdays/Thursdays.
4. **Behavioral Dharma:** Respect parents and teachers; maintain truthful, harmonious speech.

***
*Disclaimer: Astrological guidance offers traditional Vedic perspectives for spiritual insight and self-reflection. For medical, financial, or legal matters, please always consult certified professionals alongside Vedic remedies.*`;
}

// API: AI Vedic Astrologer Consultation
app.post("/api/jyotish/consult", authMiddleware, async (req: AuthRequest, res) => {
  if (!(await requireMongo(res))) return;
  const loadedUser = await User.findById(req.user!.id).lean();
  if (!loadedUser) return res.status(401).json({ error: "User account not found." });
  const user = await checkAndRefillCredits(loadedUser);
  const hasUnlimitedAccess = user.unlimitedQuestions === true;

  if (!hasUnlimitedAccess && (user?.credits ?? 0) < CREDIT_COST) {
    return res.status(403).json({ error: "You need at least 3 credits to ask a question.", credits: user?.credits ?? 0, hasFollowed: user?.hasFollowed === true, unlimitedQuestions: false });
  }

  const chargedUser = hasUnlimitedAccess
    ? user
    : await User.findOneAndUpdate({ _id: user._id, credits: { $gte: CREDIT_COST } }, { $inc: { credits: -CREDIT_COST } }, { new: true }).lean();

  if (!chargedUser) return res.status(403).json({ error: "You need at least 3 credits to ask a question." });

  const resetForFollowRequirement = !hasUnlimitedAccess && chargedUser.credits <= 0
    ? await User.findByIdAndUpdate(chargedUser._id, { $set: { hasFollowed: false } }, { new: true }).lean()
    : chargedUser;

  const rawQuestion =
    req.body.userQuestion ||
    req.body.userQuery ||
    req.body.query ||
    req.body.question ||
    req.body.message;
  const rawChart =
    req.body.chartContext ||
    req.body.chartSummary ||
    req.body.chartDetails ||
    req.body.chart;
  const language = req.body.language || "Hindi";
  const category = req.body.category || "General";
  const chatHistory = Array.isArray(req.body.chatHistory) ? req.body.chatHistory : [];

  if (!rawQuestion || typeof rawQuestion !== "string" || !rawQuestion.trim()) {
    return res.status(400).json({ error: "User question is required." });
  }

  const userQuestion = rawQuestion.trim();
  const chartContext =
    typeof rawChart === "object"
      ? JSON.stringify(rawChart, null, 2)
      : typeof rawChart === "string"
      ? rawChart
      : "No chart provided.";

  const isHindiPreferred = language.toLowerCase().includes("hindi") || language.toLowerCase().includes("hinglish") || language.toLowerCase() !== "english";
  const preferredLanguage = isHindiPreferred ? "Hindi (Devanagari)" : "English";
  const systemInstruction = `You are an authentic, highly expert Vedic Astrologer consulting a client. Provide a highly structured, accurate, and scripturally backed analysis. DO NOT output a raw data dump. Use clean, professional ${preferredLanguage} based on the user's input.
Strictly follow this 5-point structure for every response, using Markdown bolding for the headers:

1. **जन्म कुंडली का स्वरूप (Basic Chart Analysis):** A brief, human-toned overview of their Lagna and Moon sign.
2. **मुख्य प्रश्न का उत्तर (Direct Answer to Query):** Answer the user's specific question directly and clearly in this section.
3. **ग्रह एवं दशा प्रभाव (Planetary & Dasha Impact):** Explain the astrological reasons (current Mahadasha/Antardasha and planetary placements) affecting their situation.
4. **भविष्य के लिए महत्वपूर्ण संकेत (Future Indications):** Brief positive predictions or warnings.
5. **सात्विक उपाय (Sattvik Remedies):** 1 or 2 specific, actionable, scripturally-backed remedies relevant to their issue.
End with the standard disclaimer in italics.`;

  const contextPrompt = `======================================================================
EXACT USER CALCULATED KUNDALI & ASTROLOGICAL JSON CONTEXT:
======================================================================
${chartContext}
======================================================================

USER INQUIRY:
Category: ${category}
Language Preference: ${language}
Question: "${userQuestion}"

INSTRUCTIONS FOR ACHARYA:
1. Strictly reference and align with the exact Ascendant, Moon Sign, Sun Sign, Planetary House placements, and active Vimshottari Dasha from the JSON above.
2. Answer the user's specific question with precision, truthfulness, and depth.
3. Provide safe, Sattvik Parashari remedies tailored to this specific chart.`;

  const result = await callAIWithFallback(
    contextPrompt,
    systemInstruction,
    0.7,
    chatHistory,
    () => generateScripturalFallbackReading(rawChart, userQuestion, category, language)
  );
  return res.json({
    reply: result.text,
    response: result.text,
    credits: hasUnlimitedAccess ? MAX_CREDITS : resetForFollowRequirement.credits,
    hasFollowed: resetForFollowRequirement.hasFollowed === true,
    unlimitedQuestions: hasUnlimitedAccess,
    ...(result.isFallback ? { isFallback: true, note: "Generated using classical Parashari rule synthesis." } : {}),
  });
});

// API: Detailed Vedic Chart Deep Analysis
app.post("/api/jyotish/deep-analysis", async (req, res) => {
  try {
    const { chartDetails, focusArea = "Comprehensive", language = "English" } = req.body;
    const prompt = `Please generate an exhaustive, authentic Parashari Vedic Kundali Analysis for this birth chart.

CHART DATA:
${JSON.stringify(chartDetails, null, 2)}

FOCUS AREA: ${focusArea}
LANGUAGE: ${language}

STRUCTURE YOUR RESPONSE INTO THE FOLLOWING CLEAR SECTIONS:
1. **Lagna & Atmakaraka Overview**: Analysis of Ascendant sign, Lagna lord placement, temperament, and core life path.
2. **Planetary Strengths & Dignities (Shadbala & Avasthas)**: Strongest benefic planets, challenging placements (Dusthanas 6th, 8th, 12th), exaltations & combustions.
3. **Major Yogas & Combinations**: Raja Yogas, Dhana Yogas, Gajakesari, Budhaditya, or Pancha Mahapurusha yogas present.
4. **Current Vimshottari Dasha Analysis**: Effects of the ongoing Mahadasha and Antardasha periods.
5. **Key Life Spheres**:
   - Career & Karma (10th & 2nd/6th/11th Bhavas)
   - Wealth & Prosperity (2nd & 11th Bhavas)
   - Relationships & Marriage (7th Bhava & Venus/Jupiter)
   - Health & Vitality (1st, 6th, 8th Bhavas)
6. **Sattvik Upay (Scriptural Remedies)**:
   - Primary Vedic/Beej Mantra with count
   - Sattvik Daan (charitable acts)
   - Daily lifestyle & spiritual alignment
7. **Gemstone Guidance (with mandatory precautions)**

Include the standard respectful Vedic disclaimer at the end.`;

    const systemInstruction = "You are a master Vedic Astrologer providing authentic, structured, scripture-grounded BPHS Kundali reports.";
    const result = await callAIWithFallback(
      prompt,
      systemInstruction,
      0.6,
      [],
      () => generateScripturalFallbackReading(
        chartDetails,
        `Comprehensive deep analysis for ${focusArea}`,
        focusArea,
        language
      )
    );
    res.json({ analysis: result.text, ...(result.isFallback ? { isFallback: true } : {}) });
  } catch (error: any) {
    console.error("Deep analysis error:", error);
    // If external call exhausted, construct classical overview
    const fallback = generateScripturalFallbackReading(
      req.body.chartDetails,
      `Comprehensive deep analysis for ${req.body.focusArea || "all life spheres"}`,
      req.body.focusArea || "General",
      req.body.language || "English"
    );
    res.json({ analysis: fallback, isFallback: true });
  }
});

// Setup Vite / Static server
async function startServer() {
  if (process.env.MONGODB_URI) {
    void connectToMongo().catch(() => undefined);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      configLoader: "runner",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jyotish Veda Server running on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
} else if (process.env.MONGODB_URI) {
  void connectToMongo().catch(() => undefined);
}

export default app;
