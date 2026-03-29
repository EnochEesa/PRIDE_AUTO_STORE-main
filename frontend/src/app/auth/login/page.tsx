"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Zap, ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-dark-900/75" />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl tracking-[0.15em] text-white" style={{ fontFamily: "var(--font-display)" }}>
              PRIDE AUTO
            </span>
          </Link>
          <div>
            <h2 className="font-display text-6xl text-white tracking-wider leading-none mb-4" style={{ fontFamily: "var(--font-display)" }}>
              WELCOME<br />BACK
            </h2>
            <p className="text-white/40 text-lg max-w-sm">
              Sign in to access your orders, saved parts, and exclusive deals.
            </p>
          </div>
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} Pride Auto Store</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-20">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-brand-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl tracking-[0.15em] text-white" style={{ fontFamily: "var(--font-display)" }}>PRIDE AUTO</span>
          </Link>

          <p className="section-label mb-3">Welcome back</p>
          <h1 className="font-display text-4xl text-white tracking-wider mb-2" style={{ fontFamily: "var(--font-display)" }}>
            SIGN IN
          </h1>
          <p className="text-white/40 text-sm mb-8">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300 transition-colors">
              Create one
            </Link>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-dark-700 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-700 border border-white/10 pl-12 pr-12 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-white/40 hover:text-white text-xs transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-dark-800 border border-white/5 text-xs text-white/30">
            <p className="font-semibold text-white/50 mb-1">Demo credentials</p>
            <p>Any email + password (min 6 chars) works while backend auth is being set up.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
