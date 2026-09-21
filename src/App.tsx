import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  type FormEvent,
} from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "./context/AuthContext";
import { BirthData, KundaliData } from "./types/jyotish";
import { calculateKundali } from "./utils/vedicCalculations";
import { KundaliChart } from "./components/KundaliChart";
import { HouseInspector } from "./components/HouseInspector";
import { PlanetaryTable } from "./components/PlanetaryTable";
import { DashaTimeline } from "./components/DashaTimeline";
import { YogaDoshaSection } from "./components/YogaDoshaSection";
import { SattvikRemedies } from "./components/SattvikRemedies";
import { AIJyotishConsultation } from "./components/AIJyotishConsultation";
import { DailyPanchangView } from "./components/DailyPanchangView";
import { KundaliMilanView } from "./components/KundaliMilanView";
import { BirthDataForm } from "./components/BirthDataForm";
import { PrintKundaliReport } from "./components/PrintKundaliReport";
import { ExecutiveSummaryCard } from "./components/ExecutiveSummaryCard";
import { GlossaryTooltip } from "./components/GlossaryTooltip";
import { Settings } from "./components/Settings";
import { apiUrl } from "./utils/api";

type AdminRecord = {
  _id: string;
  name: string;
  dob?: string;
  tob?: string;
  pob?: string;
  birthData: {
    dateOfBirth?: string;
    timeOfBirth?: string;
    locationName?: string;
  };
  chartData?: unknown;
  createdAt: string;
};
type AdminUser = {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  role?: string;
  socialHandle?: string;
  createdAt: string;
};
type AdminSettings = {
  maintenanceMode?: boolean;
  announcementBanner?: string;
  activeGeminiModel?: string;
  rateLimitPerMinute?: number;
  welcomeMessage?: string;
  contactEmail?: string;
};

function CreditModal() {
  const { user, token, updateUser } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [message, setMessage] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("");
  const [dwellSeconds, setDwellSeconds] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const platformRef = useRef("");
  const socialLinks = [
    {
      key: "punfk-songe",
      label: "PUNFK Songs",
      url: "https://www.youtube.com/@eAGLehQ-d1m",
    },
    {
      key: "visvakarta-productions",
      label: "VISVAKARTA PRODUCTIONS",
      url: "https://www.youtube.com/@Hubby-h6o",
    },
  ];

  useEffect(() => {
    const handleBlur = () => {
      if (platformRef.current && startTimeRef.current === null)
        startTimeRef.current = Date.now();
    };
    const handleFocus = () => {
      if (startTimeRef.current === null) return;
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      startTimeRef.current = null;
      setDwellSeconds(seconds);
      setCountdown(Math.max(0, 15 - seconds));
      setMessage(
        seconds < 12
          ? "You came back too quickly! Please visit the channel and follow to qualify."
          : "",
      );
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(
      () => setCountdown((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [countdown]);

  if (!user || (user.credits >= 3 && !user.unlimitedQuestions) || user.unlimitedQuestions || dismissed) return null;

  const openSocial = (nextPlatform: string) => {
    platformRef.current = nextPlatform;
    setPlatform(nextPlatform);
    setDwellSeconds(0);
    setCountdown(15);
    setMessage(
      "Visit the profile, follow it, then return here to claim your credits.",
    );
  };

  const claimTask = async () => {
    if (!token || claiming || dwellSeconds < 12 || !handle.trim() || !platform)
      return;
    setClaiming(true);
    try {
      const response = await fetch(apiUrl("/api/user/claim-task"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ handle, platform, dwellSeconds }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to claim credits.");
      updateUser(data.user);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to claim credits.",
      );
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 text-slate-100 shadow-2xl">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close credit claim dialog"
          title="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          ×
        </button>
        <div className="text-center">
          <div className="text-3xl">⚡</div>
          <h2 className="mt-2 text-xl font-bold text-amber-100">
            Your credits are running low
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            You have {user.credits} / 15 credits remaining.
          </p>
        </div>
        {!user.hasFollowed ? (
          <>
            <p className="mt-5 text-center text-sm text-slate-300">
              Subscribe to one of these channels, then return here to claim 15 credits.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => openSocial(link.key)}
                  className="rounded-lg border border-red-500/40 px-2 py-3 text-center text-[11px] font-semibold text-red-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="Enter your YouTube Channel name / Social Username (e.g. @yourhandle)"
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500"
            />
            <p className="mt-2 text-center text-xs text-slate-400">
              {platform
                ? `${platform} visit: ${dwellSeconds}s`
                : "Choose a social profile to start verification."}
              {countdown > 0 ? ` | Timer: ${countdown}s` : ""}
            </p>
            <button
              type="button"
              onClick={() => void claimTask()}
              disabled={
                claiming || dwellSeconds < 12 || !handle.trim() || !platform
              }
              className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-60"
            >
              {claiming ? "Claiming..." : "Claim 15 Credits"}
            </button>
          </>
        ) : (
          <p className="mt-5 text-center text-sm text-amber-100">
            Credits are exhausted. You will get 15 credits again automatically after 24 hours.
          </p>
        )}
        <a
          href="https://wa.me/919309475946?text=Hi%2C%20I%20need%20more%20credits%20for%20Jyotish%20Veda%20AI"
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-500"
        >
          🟢 Need more credits instantly? Message us on WhatsApp
        </a>
        {message && (
          <p className="mt-3 text-center text-xs text-red-300">{message}</p>
        )}
      </div>
    </div>
  );
}

function RedeemCodeModal() {
  const { user, token, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const submitCode = async () => {
    if (!token || !code.trim() || submitting) return;
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch(apiUrl("/api/user/redeem-code"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid code.");
      updateUser({ ...user, ...data.user });
      setStatus("Code redeemed successfully. Unlimited questions unlocked.");
      setCode("");
      setTimeout(() => setOpen(false), 800);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to redeem code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20"
      >
        {user.unlimitedQuestions ? "Unlimited" : "Redeem Code"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-emerald-100">Redeem Access Code</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Enter the code to unlock unlimited questions for your account.
            </p>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter code"
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => void submitCode()}
              disabled={submitting || !code.trim()}
              className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-60"
            >
              {submitting ? "Redeeming..." : "Unlock Unlimited Questions"}
            </button>
            {status && (
              <p className="mt-3 text-center text-xs text-emerald-200">{status}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function AuthControls() {
  const { user, login, logout } = useAuth();
  const [error, setError] = useState("");
  if (!user)
    return (
      <div className="flex flex-col items-end gap-1">
        <GoogleLogin
          onSuccess={(response) =>
            void login(response).catch((reason) =>
              setError(
                reason instanceof Error ? reason.message : "Sign-in failed.",
              ),
            )
          }
          onError={() => setError("Google sign-in failed.")}
          theme="filled_black"
          size="medium"
          text="signin_with"
          shape="pill"
        />
        <span className="text-[10px] text-red-300">{error}</span>
      </div>
    );
  return (
    <div className="flex items-center gap-2 rounded-xl border border-amber-900/50 bg-slate-900 px-2 py-1">
      <img
        src={user.picture || "https://www.gravatar.com/avatar/?d=mp"}
        alt=""
        className="h-7 w-7 rounded-full border border-amber-500/50"
      />
      <span className="max-w-28 truncate text-xs font-semibold text-amber-100">
        {user.name}
      </span>
      <button
        type="button"
        onClick={logout}
        className="text-[10px] text-slate-400 hover:text-amber-200"
      >
        Logout
      </button>
    </div>
  );
}

function LegacyAdminPanel() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<"kundlis" | "users" | "settings">(
    "kundlis",
  );
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({});
  const [health, setHealth] = useState<{
    database?: string;
    gemini?: string;
    geminiKeyCount?: number;
    huggingface?: string;
    activeProvider?: string;
  }>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AdminRecord | null>(
    null,
  );
  const [message, setMessage] = useState("Loading admin data...");

  useEffect(() => {
    const load = async () => {
      try {
        const authHeaders = token
          ? new Headers({ Authorization: `Bearer ${token}` })
          : undefined;
        const [
          recordsResponse,
          usersResponse,
          settingsResponse,
          healthResponse,
        ] = await Promise.all([
          fetch(
            apiUrl(`/api/admin/kundlis?page=${page}&limit=20&search=${encodeURIComponent(search)}`),
            { headers: authHeaders },
          ),
          fetch(apiUrl("/api/admin/users"), { headers: authHeaders }),
          fetch(apiUrl("/api/admin/settings"), { headers: authHeaders }),
          fetch(apiUrl("/api/health")),
        ]);
        const recordsData = await recordsResponse.json();
        const usersData = await usersResponse.json();
        const settingsData = await settingsResponse.json();
        const healthData = await healthResponse.json();
        if (!recordsResponse.ok || !settingsResponse.ok)
          throw new Error(
            recordsData.error ||
              settingsData.error ||
              "Unable to load admin data.",
          );
        setRecords(recordsData.records || []);
        setUsers(usersData.users || []);
        setTotalPages(recordsData.pagination?.pages || 1);
        setSettings(settingsData.settings || {});
        setHealth(healthData);
        setMessage(
          `AI provider: ${healthData.activeProvider || "unknown"} | Gemini keys: ${healthData.geminiKeyCount ?? 0} | Hugging Face: ${healthData.huggingface || "missing"}`,
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Unable to load admin data.",
        );
      }
    };
    void load();
  }, [page, search, token]);

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("Saving settings...");
    try {
      const response = await fetch(apiUrl("/api/admin/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to save settings.");
      setSettings(data.settings || settings);
      setMessage("Settings saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save settings.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500">
              Jyotish Veda
            </p>
            <h1 className="text-3xl font-serif font-bold text-amber-100">
              Admin Panel
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Kundali records and application controls
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-amber-300 border border-amber-900/50 rounded-lg px-3 py-2"
          >
            Return to app
          </a>
        </header>
        <nav className="flex gap-2 border-b border-slate-800 pb-2">
          {(["kundlis", "settings"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${activeTab === tab ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"}`}
            >
              {tab === "kundlis" ? "Saved Kundlis" : "App Settings"}
            </button>
          ))}
        </nav>
        {message && (
          <p className="rounded-lg border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
            {message}
          </p>
        )}
        {activeTab === "kundlis" ? (
          <section className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between">
              <h2 className="text-lg font-semibold text-amber-100">
                Saved Kundali Logs
              </h2>
              <span className="text-xs text-slate-400">
                {records.length} records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/70 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Birth date</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td className="px-5 py-4 font-semibold text-amber-100">
                        {record.name}
                      </td>
                      <td className="px-5 py-4">
                        {record.birthData?.dateOfBirth || "-"}{" "}
                        {record.birthData?.timeOfBirth || ""}
                      </td>
                      <td className="px-5 py-4">
                        {record.birthData?.locationName || "-"}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {records.length === 0 && (
                <p className="p-8 text-center text-slate-500">
                  No kundli records have been saved yet.
                </p>
              )}
            </div>
          </section>
        ) : (
          <form
            onSubmit={saveSettings}
            className="max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-7 space-y-5"
          >
            <label className="flex items-center gap-3 text-sm font-semibold text-amber-100">
              <input
                type="checkbox"
                checked={Boolean(settings.maintenanceMode)}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    maintenanceMode: event.target.checked,
                  })
                }
                className="accent-amber-500"
              />
              Maintenance mode
            </label>
            <label className="block text-sm text-slate-300">
              Welcome message
              <textarea
                value={settings.welcomeMessage || ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    welcomeMessage: event.target.value,
                  })
                }
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Support email
              <input
                type="email"
                value={settings.contactEmail || ""}
                onChange={(event) =>
                  setSettings({ ...settings, contactEmail: event.target.value })
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950"
            >
              Save settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AdminPanel() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState<"kundlis" | "users" | "settings">("kundlis");
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({});
  const [message, setMessage] = useState("Loading admin data...");

  useEffect(() => {
    if (!token) {
      setMessage("Sign in with Google to access the Admin Panel.");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(apiUrl("/api/admin/kundlis?limit=100"), { headers }),
      fetch(apiUrl("/api/admin/users"), { headers }),
      fetch(apiUrl("/api/admin/settings"), { headers }),
    ])
      .then(async ([recordsResponse, usersResponse, settingsResponse]) => {
        const recordsData = await recordsResponse.json();
        const usersData = await usersResponse.json();
        const settingsData = await settingsResponse.json();
        if (!recordsResponse.ok)
          throw new Error(recordsData.error || "Unable to load saved Kundlis.");
        if (!usersResponse.ok)
          throw new Error(usersData.error || "Admin access required.");
        setRecords(recordsData.records || []);
        setUsers(usersData.users || []);
        setSettings(settingsData.settings || {});
        setMessage("");
      })
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Unable to load admin data.",
        ),
      );
  }, [token]);

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(apiUrl("/api/admin/settings"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? "Settings saved."
        : data.error || "Unable to save settings.",
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500">
              Jyotish Veda
            </p>
            <h1 className="font-serif text-3xl font-bold text-amber-100">
              Admin Panel
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Kundali records, registered users and application controls
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AuthControls />
            <a
              href="/"
              className="rounded-lg border border-amber-900/50 px-3 py-2 text-sm text-amber-300"
            >
              Return to app
            </a>
          </div>
        </header>
        <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {(["kundlis", "users", "settings"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === item ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"}`}
            >
              {item === "kundlis"
                ? "Saved Kundlis"
                : item === "users"
                  ? "Registered Users"
                  : "App Settings"}
            </button>
          ))}
        </nav>
        {message && (
          <p className="rounded-lg border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
            {message}
          </p>
        )}
        {tab === "users" ? (
          <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-5">
              <h2 className="text-lg font-semibold text-amber-100">
                Registered Users
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/70 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Avatar</th>
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Social Handle</th>
                    <th className="px-5 py-3">Registration Date</th>
                    <th className="px-5 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((registeredUser) => (
                    <tr key={registeredUser._id}>
                      <td className="px-5 py-4">
                        <img
                          src={
                            registeredUser.picture ||
                            "https://www.gravatar.com/avatar/?d=mp"
                          }
                          alt=""
                          className="h-8 w-8 rounded-full border border-amber-500/40"
                        />
                      </td>
                      <td className="px-5 py-4 font-semibold text-amber-100">
                        {registeredUser.name}
                      </td>
                      <td className="px-5 py-4">{registeredUser.email}</td>
                      <td className="px-5 py-4 text-amber-200">
                        {registeredUser.socialHandle || "-"}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(registeredUser.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-300">
                          {registeredUser.role || "user"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : tab === "kundlis" ? (
          <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-5">
              <h2 className="text-lg font-semibold text-amber-100">
                Saved Kundali Logs
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/70 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Birth Date</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td className="px-5 py-4 font-semibold text-amber-100">
                        {record.name}
                      </td>
                      <td className="px-5 py-4">
                        {record.birthData?.dateOfBirth || "-"}
                      </td>
                      <td className="px-5 py-4">
                        {record.birthData?.locationName || "-"}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <form
            onSubmit={saveSettings}
            className="max-w-2xl space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <label className="flex items-center gap-3 text-sm font-semibold text-amber-100">
              <input
                type="checkbox"
                checked={Boolean(settings.maintenanceMode)}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    maintenanceMode: event.target.checked,
                  })
                }
                className="accent-amber-500"
              />
              Maintenance mode
            </label>
            <label className="block text-sm text-slate-300">
              Welcome message
              <textarea
                value={settings.welcomeMessage || ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    welcomeMessage: event.target.value,
                  })
                }
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950"
            >
              Save settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AppShell() {
  const { token, user } = useAuth();
  // Active Birth Data State
  const [birthData, setBirthData] = useState<BirthData>({
    name: "Arjun Sharma",
    dateOfBirth: "1992-05-15",
    timeOfBirth: "08:30",
    locationName: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
    gender: "male",
  });

  // Calculate full Nirayana Sidereal Kundali
  const kundali: KundaliData = useMemo(() => {
    return calculateKundali(birthData);
  }, [birthData]);

  // UI State
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "kundali" | "consultation" | "remedies" | "panchang" | "milan"
  >("kundali");
  const [consultationPrompt, setConsultationPrompt] = useState<string>("");
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [chartType, setChartType] = useState<"D1" | "D9">("D1");
  const [showBirthModal, setShowBirthModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [savedKundliCount, setSavedKundliCount] = useState(0);

  useEffect(() => {
    if (!token) {
      setSavedKundliCount(0);
      return;
    }

    fetch(apiUrl("/api/kundlis"), { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load saved Kundlis.");
        return response.json() as Promise<{ records?: unknown[] }>;
      })
      .then((data) => setSavedKundliCount(data.records?.length || 0))
      .catch(() => setSavedKundliCount(0));
  }, [token]);

  // Selected Bhava data for inspector
  const currentHouseData = useMemo(() => {
    return (
      kundali.houses.find((h) => h.houseNumber === selectedHouse) ||
      kundali.houses[0]
    );
  }, [kundali, selectedHouse]);

  const handleUpdateBirthData = (newData: BirthData) => {
    setBirthData(newData);
    setShowBirthModal(false);
  };

  const handleAskAIFromSummary = (question: string) => {
    setConsultationPrompt(question);
    setActiveTab("consultation");
  };

  const handleSaveKundli = async () => {
    if (!token || !user) {
      setSaveStatus("Sign in with Google to save a Kundli.");
      return;
    }
    setSaveStatus("Saving...");
    try {
      const response = await fetch(apiUrl("/api/kundlis"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ birthData, kundaliData: kundali }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save kundli.");
      setSavedKundliCount((count) => count + 1);
      setSaveStatus("Saved");
    } catch (error) {
      setSaveStatus(
        error instanceof Error ? error.message : "Unable to save kundli.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Sacred Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-900/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-serif font-bold text-xl shadow-md border border-amber-300/40">
              ॐ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-amber-200 font-serif tracking-wide">
                  Jyotish Veda
                </h1>
                <span className="hidden sm:inline-block text-xs text-amber-400/80 font-serif">
                  (ज्योतिष वेद)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Parashari Sidereal Kundali & Authentic Sattvik Upay
              </p>
            </div>
          </div>

          {/* Simple / Expert Mode Switch & Action Controls */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Simple / Expert Mode Toggle */}
            <div className="flex items-center bg-slate-900 border border-amber-900/60 rounded-xl p-1 shadow-inner">
              <button
                id="mode-simple-btn"
                onClick={() => setIsSimpleMode(true)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSimpleMode
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md ring-1 ring-amber-300"
                    : "text-slate-400 hover:text-amber-200"
                }`}
                title="Simple Mode: Plain English/Hinglish summaries, clean cards, key takeaways, and tooltips"
              >
                <span>🌱</span>
                <span>Simple (सरल)</span>
              </button>

              <button
                id="mode-expert-btn"
                onClick={() => setIsSimpleMode(false)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !isSimpleMode
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md ring-1 ring-amber-300"
                    : "text-slate-400 hover:text-amber-200"
                }`}
                title="Expert Mode: Full astronomical degrees, complete Vimshottari tables, Shodashavarga, and classical Sanskrit Sutras"
              >
                <span>📜</span>
                <span>Expert (विस्तृत)</span>
              </button>
            </div>

            {/* Jataka Quick Profile Chip */}
            <button
              id="open-birth-modal-btn"
              onClick={() => setShowBirthModal(true)}
              className="bg-slate-900/90 hover:bg-slate-800 border border-amber-900/50 hover:border-amber-500/60 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
              title="Click to edit birth date, time or location"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="font-semibold text-amber-100 group-hover:text-amber-300 block max-w-[100px] truncate">
                  {birthData.name || "Jataka"}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {birthData.dateOfBirth} • {birthData.timeOfBirth}
                </span>
              </div>
              <span className="text-amber-400 text-xs ml-1">✏️</span>
            </button>

            {/* Download combined Kundali and AI report */}
            <button
              id="open-print-report-btn"
              onClick={() => setShowPrintModal(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Download Full PDF</span>
            </button>
            <button
              type="button"
              onClick={() => void handleSaveKundli()}
              className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Save Kundli
            </button>
            {user && (
              <span className="text-[10px] text-slate-400">
                Saved: {savedKundliCount}
              </span>
            )}
            {user && (
              <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-200">
                ⚡ {user.unlimitedQuestions ? "Unlimited" : `${user.credits} / 15 Credits`}
              </span>
            )}
            {user && <RedeemCodeModal />}
            <AuthControls />
            {user?.email.trim().toLowerCase() ===
              "hubby1creation@gmail.com" && (
              <a
                href="/admin"
                className="text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
              >
                Admin
              </a>
            )}
            <a
              href="/settings"
              className="text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            >
              Settings
            </a>
            {saveStatus && (
              <span
                className="text-[10px] text-slate-400 max-w-32 truncate"
                title={saveStatus}
              >
                {saveStatus}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "kundali", label: "Lagna & Bhavas (जन्म चक्र)", icon: "🔯" },
            {
              id: "consultation",
              label: "AI Astrologer Consultation",
              icon: "✨",
            },
            { id: "remedies", label: "Sattvik Upay Sanctuary", icon: "🌿" },
            { id: "panchang", label: "Dainik Panchang", icon: "🌞" },
            { id: "milan", label: "Kundali Milan (36 गुण)", icon: "💍" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold ring-1 ring-amber-300"
                    : "text-slate-300 hover:text-amber-200 hover:bg-slate-900/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* VIEW 1: KUNDALI & BHAVAS */}
        {activeTab === "kundali" && (
          <div className="space-y-6">
            {/* Top AI Executive Summary Card (3 Key Takeaways: Sign, Dasha, Remedies) */}
            <ExecutiveSummaryCard
              kundali={kundali}
              isSimpleMode={isSimpleMode}
              onAskAI={handleAskAIFromSummary}
            />

            {/* Quick Highlights Banner with Info Tooltips */}
            {(() => {
              const moonPlanet = kundali.planets.find((p) => p.name === "Moon");
              const sunPlanet = kundali.planets.find((p) => p.name === "Sun");
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 block text-[11px]">
                        Ascendant (Lagna):
                      </span>
                      <GlossaryTooltip term="Lagna" />
                    </div>
                    <strong className="text-amber-200 text-sm font-serif">
                      {kundali.ascendant.rashi}{" "}
                      {!isSimpleMode &&
                        `(${kundali.ascendant.formattedDegree})`}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Lord: {kundali.ascendant.rashiLord}
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 block text-[11px]">
                        Moon Sign (Chandra):
                      </span>
                      <GlossaryTooltip term="Chandra" />
                    </div>
                    <strong className="text-amber-200 text-sm font-serif">
                      {moonPlanet ? `${moonPlanet.rashi}` : kundali.moonSign}{" "}
                      {!isSimpleMode &&
                        moonPlanet &&
                        `(${moonPlanet.formattedDegree})`}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Nakshatra: {kundali.birthNakshatra} (P{kundali.birthPada})
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 block text-[11px]">
                        Sun Sign (Surya):
                      </span>
                      <GlossaryTooltip term="Surya" />
                    </div>
                    <strong className="text-amber-200 text-sm font-serif">
                      {sunPlanet ? `${sunPlanet.rashi}` : kundali.sunSign}{" "}
                      {!isSimpleMode &&
                        sunPlanet &&
                        `(${sunPlanet.formattedDegree})`}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      House {sunPlanet?.house || 1} •{" "}
                      {sunPlanet?.dignity || "Neutral"}
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-amber-900/30 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 block text-[11px]">
                        Current Mahadasha:
                      </span>
                      <GlossaryTooltip term="Mahadasha" />
                    </div>
                    <strong className="text-emerald-400 text-sm font-serif">
                      {kundali.currentDasha.mahadasha.planet} /{" "}
                      {kundali.currentDasha.antardasha.planet}
                    </strong>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Until {kundali.currentDasha.antardasha.endDate}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* D1/D9 Toggle & Kundali Chart Area with House Inspector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-amber-900/40 text-xs">
                <button
                  onClick={() => setChartType("D1")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    chartType === "D1"
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-amber-200"
                  }`}
                >
                  Lagna Chakra (D1 - जन्म चक्र)
                </button>
                <button
                  onClick={() => setChartType("D9")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    chartType === "D9"
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-amber-200"
                  }`}
                >
                  Navamsha Chakra (D9 - नवमांश)
                </button>
              </div>

              <span className="text-xs text-amber-300/80 italic hidden sm:inline">
                Click any house on the chakra to inspect Parashari Bhavaphala
              </span>
            </div>

            {/* Chart + Inspector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <KundaliChart
                  kundali={kundali}
                  chartType={chartType}
                  selectedHouse={selectedHouse}
                  onSelectHouse={(h) => setSelectedHouse(h)}
                />
              </div>

              <div className="lg:col-span-5">
                <HouseInspector
                  house={currentHouseData}
                  allPlanets={kundali.planets}
                />
              </div>
            </div>

            {/* Detailed Planetary Degrees & Nakshatra Table */}
            <PlanetaryTable
              planets={kundali.planets}
              ascendant={kundali.ascendant}
              isSimpleMode={isSimpleMode}
            />

            {/* Auspicious Yogas & Dosha Analysis */}
            <YogaDoshaSection yogas={kundali.yogas} doshas={kundali.doshas} />

            {/* Vimshottari Dasha Timeline */}
            <DashaTimeline
              allDashas={kundali.allDashas}
              currentDasha={kundali.currentDasha}
            />
          </div>
        )}

        {/* VIEW 2: AI JYOTISH CONSULTATION */}
        {activeTab === "consultation" && (
          <AIJyotishConsultation
            kundali={kundali}
            initialQuestion={consultationPrompt}
          />
        )}

        {/* VIEW 3: SATTVIK REMEDIES SANCTUARY */}
        {activeTab === "remedies" && <SattvikRemedies />}

        {/* VIEW 4: DAINIK PANCHANG */}
        {activeTab === "panchang" && <DailyPanchangView />}

        {/* VIEW 5: KUNDALI MILAN */}
        {activeTab === "milan" && <KundaliMilanView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-amber-900/30 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif text-amber-400/80">
            ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः
            शान्तिः।
          </p>
          <p>
            Jyotish Veda • Grounded in Brihat Parashara Hora Shastra, Saravali &
            Jaimini Sutras
          </p>
          <p className="text-[10px] text-slate-600 max-w-xl mx-auto">
            Astrological insights and safe Sattvik remedies are intended for
            philosophical, reflective, and spiritual growth. They do not
            constitute professional healthcare, financial, or legal counsel.
          </p>
        </div>
      </footer>

      {/* Birth Data Edit Modal */}
      {showBirthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full">
            <BirthDataForm
              initialData={birthData}
              onSubmit={handleUpdateBirthData}
              onClose={() => setShowBirthModal(false)}
            />
          </div>
        </div>
      )}

      {/* Printable Kundali Patrika Modal */}
      {showPrintModal && (
        <PrintKundaliReport
          kundali={kundali}
          onClose={() => setShowPrintModal(false)}
        />
      )}
      <CreditModal />
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (window.location.pathname === "/settings") return <Settings />;
  if (window.location.pathname !== "/admin") return <AppShell />;
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center text-slate-300">
        Checking access...
      </div>
    );
  if (user?.email.trim().toLowerCase() !== "hubby1creation@gmail.com") {
    window.location.replace("/");
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center text-red-300">
        Access Denied
      </div>
    );
  }
  return <AdminPanel />;
}
