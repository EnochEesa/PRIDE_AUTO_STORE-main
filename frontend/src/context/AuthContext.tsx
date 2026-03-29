"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pride_user");
      if (saved) setState({ user: JSON.parse(saved), loading: false });
      else setState((s) => ({ ...s, loading: false }));
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || "Login failed" };
      localStorage.setItem("pride_user", JSON.stringify(data));
      setState({ user: data, loading: false });
      return { success: true };
    } catch {
      // Demo fallback — remove when backend auth is ready
      if (email && password.length >= 6) {
        const demoUser: User = {
          _id: "demo_1",
          name: email.split("@")[0],
          email,
          token: "demo_token_" + Date.now(),
        };
        localStorage.setItem("pride_user", JSON.stringify(demoUser));
        setState({ user: demoUser, loading: false });
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || "Signup failed" };
      localStorage.setItem("pride_user", JSON.stringify(data));
      setState({ user: data, loading: false });
      return { success: true };
    } catch {
      // Demo fallback
      const demoUser: User = {
        _id: "demo_" + Date.now(),
        name,
        email,
        token: "demo_token_" + Date.now(),
      };
      localStorage.setItem("pride_user", JSON.stringify(demoUser));
      setState({ user: demoUser, loading: false });
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem("pride_user");
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
