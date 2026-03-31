import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-dark-900 py-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-dark-900/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/70 to-transparent" />

      <div
        className="absolute right-0 top-0 bottom-0 hidden w-1/3 lg:block"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(249,115,22,0.08) 100%)",
        }}
      />

      <div className="absolute top-8 right-8 hidden border border-brand-500/40 px-4 py-2 md:block">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">
          Classic Collection
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <Wrench className="h-5 w-5 text-brand-500" />
            <span className="section-label">Curated for the Classics</span>
          </div>

          <h2
            className="mb-6 font-display text-6xl leading-none tracking-wider text-white md:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FIAT & PREMIER
            <span className="text-gradient block">ESSENTIALS</span>
          </h2>

          <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/50">
            Explore workshop-ready service kits, ignition parts, and trim details
            curated for Fiat Padmini and Premier classics from our Coimbatore shelves.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/search?q=fiat%20padmini" className="btn-primary flex items-center gap-2">
              Explore Padmini Parts
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white"
            >
              All Products
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 md:gap-8">
            {["Fiat & Premier specialists", "Curated fitment support", "Dispatch from Coimbatore"].map(
              (badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span className="text-xs font-medium tracking-wide text-white/50">
                    {badge}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
