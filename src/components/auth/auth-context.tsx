"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState } from "@/lib/use-persistent-state";
import { validateEmail, validateName, validatePassword } from "@/lib/validation";

// ============================================================
// AUTH (DEMO)
// ------------------------------------------------------------
// Everything the pages need from "login" goes through useAuth(): { user, signIn, register, signOut }.
// This file is the ONLY place that knows how sign-in works. Today it is a browser-only demo: any
// valid email + 8-character password signs in, and the "session" is saved in localStorage.
//
// To connect a real back end, replace the bodies of signIn / register / signOut with API calls
// (e.g. POST /api/auth/login, POST /api/auth/register, POST /api/auth/logout using secure,
// HTTP-only cookie sessions) and load the current user from the server. No page or component changes.
// ============================================================

export type AuthUser = { id: string; name: string; email: string; phone?: string };
export type AuthResult = { ok: true } | { ok: false; error: string };
export type RegisterInput = { name: string; email: string; password: string; phone?: string };

type AuthContextType = {
  user: AuthUser | null;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  signOut: () => void;
};

type DemoAccount = { name: string; phone?: string };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const nameFromEmail = (email: string) => {
  const local = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  return local.replace(/\b\w/g, (c) => c.toUpperCase()) || "Customer";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, isHydrated] = usePersistentState<AuthUser | null>("generalstore-session", null);
  // Demo-only registry so a person who registered keeps their name next time they sign in.
  const [accounts, setAccounts] = usePersistentState<Record<string, DemoAccount>>("generalstore-demo-accounts", {});

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const emailError = validateEmail(email);
      if (emailError) return { ok: false, error: emailError };
      if (!password) return { ok: false, error: "Password is required." };
      const key = email.trim().toLowerCase();
      const known = accounts[key];
      setUser({ id: `demo-${key}`, name: known?.name ?? nameFromEmail(key), email: key, phone: known?.phone });
      return { ok: true };
    },
    [accounts, setUser]
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResult> => {
      const error = validateName(input.name) ?? validateEmail(input.email) ?? validatePassword(input.password);
      if (error) return { ok: false, error };
      const key = input.email.trim().toLowerCase();
      const phone = input.phone?.trim() || undefined;
      setAccounts((prev) => ({ ...prev, [key]: { name: input.name.trim(), phone } }));
      setUser({ id: `demo-${key}`, name: input.name.trim(), email: key, phone });
      return { ok: true };
    },
    [setAccounts, setUser]
  );

  const signOut = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(() => ({ user, isHydrated, signIn, register, signOut }), [user, isHydrated, signIn, register, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
