import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CredentialResponse } from "@react-oauth/google";
import { apiUrl } from "../utils/api";

export type AuthUser = { id: string; name: string; email: string; picture?: string; role?: string; credits: number; hasFollowed: boolean; unlimitedQuestions?: boolean; socialHandle?: string; lastCreditRefill?: string };
type AuthContextValue = { user: AuthUser | null; token: string | null; loading: boolean; login: (response: CredentialResponse) => Promise<void>; refreshUser: () => Promise<void>; updateUser: (user: AuthUser) => void; logout: () => void };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const tokenKey = "jyotish_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(apiUrl("/api/auth/me"), { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => { if (!response.ok) throw new Error("Session expired"); return response.json(); })
      .then((data) => setUser(data.user))
      .catch(() => { localStorage.removeItem(tokenKey); setToken(null); setUser(null); })
      .finally(() => setLoading(false));
  }, [token]);

  const refreshUser = async () => {
    if (!token) return;
    const response = await fetch(apiUrl("/api/auth/me"), { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Session expired");
    const data = await response.json();
    setUser(data.user);
  };

  const login = async (response: CredentialResponse) => {
    if (!response.credential) throw new Error("Google sign-in did not return a credential.");
    const authResponse = await fetch(apiUrl("/api/auth/google"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential: response.credential }) });
    const data = await authResponse.json();
    if (!authResponse.ok) throw new Error(data.error || "Google sign-in failed.");
    localStorage.setItem(tokenKey, data.token); setToken(data.token); setUser(data.user);
  };

  const logout = () => { localStorage.removeItem(tokenKey); setToken(null); setUser(null); };
  const updateUser = (nextUser: AuthUser) => setUser(nextUser);
  return <AuthContext.Provider value={{ user, token, loading, login, refreshUser, updateUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
