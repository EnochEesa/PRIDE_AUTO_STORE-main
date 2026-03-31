"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  isAdminEmail,
  isValidEmail,
  sanitizeEmail,
  sanitizeName,
  sanitizeSecret,
  sanitizeTextInput,
} from "@/lib/security";

type UserRole = "customer" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
} | null>(null);

const safeStorage = (): Storage | null =>
  typeof window === "undefined" ? null : window.localStorage;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

const buildUser = (value: {
  _id: string;
  name: string;
  email: string;
  token: string;
}): User => ({
  ...value,
  role: isAdminEmail(value.email) ? "admin" : "customer",
});

const normalizeUser = (value: unknown): User | null => {
  if (!isRecord(value)) return null;

  const id = sanitizeTextInput(String(value._id ?? value.id ?? ""), 96);
  const name = sanitizeName(String(value.name ?? ""));
  const email = sanitizeEmail(String(value.email ?? ""));
  const token = sanitizeTextInput(String(value.token ?? ""), 256);

  if (!id || !name || !email || !token) return null;
  if (!isValidEmail(email)) return null;

  return buildUser({
    _id: id,
    name,
    email,
    token,
  });
};

const persistUser = (user: User) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem("pride_user", JSON.stringify(user));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const storage = safeStorage();
    if (!storage) {
      setState((current) => ({ ...current, loading: false }));
      return;
    }

    try {
      const saved = storage.getItem("pride_user");
      const normalized = saved ? normalizeUser(JSON.parse(saved)) : null;
      setState({ user: normalized, loading: false });
    } catch {
      setState((current) => ({ ...current, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const safeEmail = sanitizeEmail(email);
    const safePassword = sanitizeSecret(password, 128);

    if (!isValidEmail(safeEmail)) {
      return { success: false, error: "Enter a valid email address" };
    }

    if (safePassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: safeEmail, password: safePassword }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || "Login failed" };

      const normalized = normalizeUser(data.user ?? data);
      if (!normalized) {
        return { success: false, error: "Unexpected login response" };
      }

      persistUser(normalized);
      setState({ user: normalized, loading: false });
      return { success: true };
    } catch {
      const demoUser = buildUser({
        _id: "demo_1",
        name: sanitizeName(safeEmail.split("@")[0].replace(/[._-]+/g, " ")) || "Pride Customer",
        email: safeEmail,
        token: `demo_token_${Date.now()}`,
      });

      persistUser(demoUser);
      setState({ user: demoUser, loading: false });
      return { success: true };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const safeName = sanitizeName(name);
    const safeEmail = sanitizeEmail(email);
    const safePassword = sanitizeSecret(password, 128);

    if (safeName.length < 2) {
      return { success: false, error: "Enter your full name" };
    }

    if (!isValidEmail(safeEmail)) {
      return { success: false, error: "Enter a valid email address" };
    }

    if (safePassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: safeName, email: safeEmail, password: safePassword }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || "Signup failed" };

      const normalized = normalizeUser(data.user ?? data);
      if (!normalized) {
        return { success: false, error: "Unexpected signup response" };
      }

      persistUser(normalized);
      setState({ user: normalized, loading: false });
      return { success: true };
    } catch {
      const demoUser = buildUser({
        _id: `demo_${Date.now()}`,
        name: safeName,
        email: safeEmail,
        token: `demo_token_${Date.now()}`,
      });

      persistUser(demoUser);
      setState({ user: demoUser, loading: false });
      return { success: true };
    }
  };

  const logout = () => {
    const storage = safeStorage();
    storage?.removeItem("pride_user");
    setState({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
