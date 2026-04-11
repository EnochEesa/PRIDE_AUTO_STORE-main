"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sanitizeEmail, sanitizeName, sanitizeSecret } from "@/lib/security";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const result = await signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) router.push("/");
    else setError(result.error || "Signup failed");
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (key === "name") {
      value = sanitizeName(value);
    } else if (key === "email") {
      value = sanitizeEmail(value);
    } else {
      value = sanitizeSecret(value, 128);
    }
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80')]" />
        <div className="absolute inset-0 bg-dark-900/75" />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <div>
            <h2 className="font-display text-6xl text-white tracking-wider leading-none mb-4">
              JOIN THE<br />COMMUNITY
            </h2>
            <p className="text-white/40 text-lg max-w-sm">Get access to exclusive deals, order tracking, and a curated list of parts for your vehicle.</p>
          </div>
          <p className="text-white/20 text-sm">Copyright {new Date().getFullYear()} Pride Auto Store</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-20">
        <div className="w-full max-w-md">

          <p className="section-label mb-3">Get started</p>
          <h1 className="font-display text-4xl text-white tracking-wider mb-2">CREATE ACCOUNT</h1>
          <p className="text-white/40 text-sm mb-8">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 transition-colors">Sign in</Link>
          </p>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="text-white/40 text-xs tracking-widest uppercase block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="John Doe"
                  autoComplete="name"
                  maxLength={60}
                  className="w-full bg-dark-700 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-white/40 text-xs tracking-widest uppercase block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={120}
                  className="w-full bg-dark-700 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-white/40 text-xs tracking-widest uppercase block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                  className="w-full bg-dark-700 border border-white/10 pl-12 pr-12 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="text-white/40 text-xs tracking-widest uppercase block mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="confirm"
                  type={showPass ? "text" : "password"}
                  required
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                  className="w-full bg-dark-700 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
