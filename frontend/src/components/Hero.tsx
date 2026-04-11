import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-900">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://motorwagon.co/wp-content/uploads/2025/01/DSC06319-scaled.jpeg')`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/85 to-dark-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-noise" />

      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-500 to-transparent" />

      <div className="absolute top-32 right-8 md:right-16 lg:right-32 hidden md:block">
        <div className="border border-brand-500/30 bg-brand-500/5 backdrop-blur-sm px-4 py-2 text-xs text-brand-400 font-semibold tracking-widest uppercase animate-pulse">
          Trusted Since 2000
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6 animate-on-load stagger-1">
            <div className="w-8 h-px bg-brand-500" />
            <span className="section-label">1995 Fiat Premier Padmini S1 Petrol</span>
          </div>

          <h1
            className="font-display text-7xl sm:text-8xl md:text-[10rem] leading-none tracking-wider mb-6 animate-on-load stagger-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block text-white">PREMIER</span>
            <span className="block text-gradient">PADMINI</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl mb-10 animate-on-load stagger-3">
            Impeccably maintained in its original Green finish, TN registered. Experience the legacy of a true classic. Available now for 8.49 Lakhs.
          </p>

          <div className="flex flex-wrap gap-4 animate-on-load stagger-4">
            <Link href="/products" className="btn-primary flex items-center gap-2">
              Browse Catalogue
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-semibold tracking-wider uppercase transition-all duration-200"
            >
              Our Story
            </Link>
          </div>

          <div className="mt-16 flex gap-12 animate-on-load stagger-5">
            {[
              { value: "10K+", label: "Parts Available" },
              { value: "25+", label: "Years Experience" },
              { value: "50K+", label: "Happy Customers" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-3xl font-display text-brand-400"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs tracking-wider uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
