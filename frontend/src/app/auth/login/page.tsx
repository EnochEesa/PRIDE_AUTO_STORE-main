"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sanitizeEmail, sanitizeSecret } from "@/lib/security";

function LoginContent() {
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
    <div className="min-h-screen bg-dark-900 flex overflow-hidden">
      {/* Left side: Premium Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
          style={{ backgroundImage: "url('https://motorwagon.co/wp-content/uploads/2025/01/DSC06313-scaled.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-dark-900 via-dark-900/30 to-transparent" />
        <div className="absolute inset-0 bg-noise opacity-20" />
        
        <div className="relative flex flex-col justify-end p-16 w-full z-10">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            <div className="h-1 w-12 bg-brand-500 mb-8" />
            <h2 
              className="font-display text-7xl xl:text-8xl text-white tracking-widest leading-[0.9] mb-6 drop-shadow-2xl" 
              style={{ fontFamily: "var(--font-display)" }}
            >
              WELCOME<br />
              <span className="text-gradient">BACK</span>
            </h2>
            <p className="text-white/60 text-lg max-w-sm leading-relaxed border-l border-white/10 pl-6">
              Sign in to access your curated dashboard, service history, and exclusive heritage parts.
            </p>
          </div>
          
          <div className="flex items-center gap-6 animate-in fade-in duration-1000 delay-500">
            <p className="text-white/20 text-xs tracking-widest uppercase">© {new Date().getFullYear()} Pride Auto Store</p>
          </div>
        </div>
      </div>

      {/* Right side: Modern Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-20 py-20 bg-dark-900 relative">
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10">
            <p className="section-label mb-4 opacity-70">Secured Access</p>
            <h1 className="font-display text-5xl text-white tracking-wider mb-3" style={{ fontFamily: "var(--font-display)" }}>
              SIGN IN
            </h1>
            <p className="text-white/40 text-sm">
              New to the heritage community?{" "}
              <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300 transition-colors font-semibold underline underline-offset-4">
                Register here
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-xs px-4 py-3 mb-8 flex items-center gap-3 animate-in fade-in zoom-in-95">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] tracking-[0.2em] uppercase block font-bold">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={120}
                  className="w-full bg-dark-800/50 border border-white/5 pl-12 pr-4 py-3.5 text-white placeholder-white/10 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-dark-800 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/40 text-[10px] tracking-[0.2em] uppercase block font-bold">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(sanitizeSecret(e.target.value, 128))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength={6}
                  maxLength={128}
                  className="w-full bg-dark-800/50 border border-white/5 pl-12 pr-12 py-3.5 text-white placeholder-white/10 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-dark-800 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-dark-700 text-brand-500 focus:ring-brand-500/20" />
                <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">Remember me</span>
              </label>
            <Link href="/auth/forgot-password" className="text-white/40 hover:text-white text-xs transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold tracking-widest group"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  SIGN INTO ACCOUNT
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-dark-900 px-4 text-white/20 font-bold">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-12 border border-white/5 bg-dark-800/30 hover:bg-dark-800 text-white/70 hover:text-white flex items-center justify-center gap-3 transition-all text-xs font-bold tracking-widest"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <div className="mt-12 p-6 bg-brand-500/5 border border-brand-500/10 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10">
              <p className="font-bold text-brand-400 text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="h-1 w-3 bg-brand-500" />
                Demo Credentials
              </p>
              <div className="space-y-1.5 text-white/40 text-[11px] leading-relaxed">
                <p>User Access: Any valid email + 6+ chars</p>
                <p>Admin Access: <span className="text-white font-bold">admin@prideautostore.com</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-dark-900 pt-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
