import { useState } from "react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export function Settings() {
  const { canInstall, isInstalled, install } = useInstallPrompt();
  const [message, setMessage] = useState("");

  const handleInstall = async () => {
    if (!canInstall) {
      setMessage(isInstalled ? "Jyotish Veda is already installed." : "Install is not available in this browser yet.");
      return;
    }
    const accepted = await install();
    setMessage(accepted ? "Jyotish Veda was added to your device." : "Installation was cancelled.");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between border-b border-amber-900/40 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500">Jyotish Veda</p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-amber-100">Settings</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your app experience.</p>
          </div>
          <a href="/" className="rounded-lg border border-amber-900/50 px-3 py-2 text-sm text-amber-300">
            Return to app
          </a>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-amber-100">Install Jyotish Veda</h2>
              <p className="mt-1 text-sm text-slate-400">Use the app like a native experience from your home screen.</p>
            </div>
            <button
              type="button"
              onClick={() => void handleInstall()}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
            >
              {isInstalled ? "App Installed" : "Install App"}
            </button>
          </div>
          {message && <p className="mt-4 text-sm text-amber-200">{message}</p>}
        </section>
      </div>
    </main>
  );
}
