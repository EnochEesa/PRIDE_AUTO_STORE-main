import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative py-28 overflow-hidden bg-dark-900">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-dark-900/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/70 to-transparent" />

      {/* Diagonal brand strip */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(249,115,22,0.08) 100%)",
        }}
      />

      {/* Floating label */}
      <div className="absolute top-8 right-8 border border-brand-500/40 px-4 py-2 hidden md:block">
        <span className="text-brand-400 text-xs font-semibold tracking-widest uppercase">
          Special Offers
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-5 h-5 text-brand-500" />
            <span className="section-label">Limited Time</span>
          </div>

          <h2
            className="font-display text-6xl md:text-8xl text-white tracking-wider leading-none mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            UP TO
            <span className="text-gradient block">30% OFF</span>
            ENGINE PARTS
          </h2>

          <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg">
            Stock up on engine components, filters, and service kits at unbeatable
            prices. Offer valid for a limited period only. No coupon required.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/products?category=Engine+Parts" className="btn-primary flex items-center gap-2">
              Grab the Deal
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-sm font-semibold tracking-wider uppercase transition-all duration-200"
            >
              All Products
            </Link>
          </div>

          {/* Timer/badges */}
          <div className="mt-12 flex gap-8">
            {["Free Shipping over ₹999", "12-Month Warranty", "COD Available"].map(
              (badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  <span className="text-white/50 text-xs font-medium tracking-wide">
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
