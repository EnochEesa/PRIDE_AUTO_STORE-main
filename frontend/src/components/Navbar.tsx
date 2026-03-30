"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, Search, Zap, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { state: cart } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-dark-900/95 backdrop-blur-md border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 bg-brand-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span
                className="text-2xl tracking-[0.15em] text-white group-hover:text-brand-400 transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                PRIDE AUTO STORE
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href="/cart" className="relative text-white/60 hover:text-white transition-colors p-2">
                <ShoppingCart className="w-5 h-5" />
                {cart.count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cart.count > 9 ? "9+" : cart.count}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-3 py-2"
                  >
                    <div className="w-7 h-7 bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 text-xs font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate">{user.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-dark-800 border border-white/10 shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-white/40 text-xs truncate">{user.email}</p>
                      </div>
                      <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        My Orders
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="btn-primary text-xs">Sign In</Link>
              )}
            </div>

            {/* Mobile icons */}
            <div className="md:hidden flex items-center gap-2">
              <Link href="/cart" className="relative text-white p-2">
                <ShoppingCart className="w-5 h-5" />
                {cart.count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cart.count}
                  </span>
                )}
              </Link>
              <button className="text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search dropdown */}
        <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-20 border-b border-white/5" : "max-h-0"} bg-dark-900/95 backdrop-blur-md`}>
          <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for parts, categories, brands..."
                className="w-full bg-dark-700 border border-white/10 pl-12 pr-20 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition-colors text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-300 text-xs font-semibold tracking-wider uppercase">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-dark-900 border-t border-white/5 transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 py-6 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parts..."
                className="w-full bg-dark-700 border border-white/10 pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-brand-500 text-sm"
              />
            </form>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="block text-white/70 hover:text-white text-base font-medium py-3 border-b border-white/5 transition-colors" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 text-sm font-bold uppercase">{user.name.charAt(0)}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/orders" className="block py-3 border-b border-white/5 text-white/70 text-sm font-medium transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                    My Orders
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2 border border-red-500/30 text-red-400 text-sm">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-primary block text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link href="/auth/signup" className="block text-center py-3 border border-white/20 text-white/70 text-sm tracking-wider uppercase" onClick={() => setMobileOpen(false)}>Create Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
