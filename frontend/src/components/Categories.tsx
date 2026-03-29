import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Engine Parts",
    count: "240+ parts",
    description: "Pistons, gaskets, timing kits, valve trains",
    image: "https://images.unsplash.com/photo-1635784063388-1ff80f0f4a37?w=600&q=80",
    color: "from-orange-500/20",
  },
  {
    name: "Brake System",
    count: "180+ parts",
    description: "Pads, rotors, calipers, brake lines",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    color: "from-red-500/20",
  },
  {
    name: "Electrical",
    count: "320+ parts",
    description: "Alternators, starters, sensors, fuses",
    image: "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?w=600&q=80",
    color: "from-blue-500/20",
  },
  {
    name: "Suspension",
    count: "150+ parts",
    description: "Shocks, struts, control arms, ball joints",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
    color: "from-green-500/20",
  },
  {
    name: "Filters",
    count: "90+ parts",
    description: "Oil, air, fuel, cabin air filters",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
    color: "from-yellow-500/20",
  },
  {
    name: "Transmission",
    count: "110+ parts",
    description: "Clutch kits, gearbox parts, drive shafts",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80",
    color: "from-purple-500/20",
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-dark-800 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-label mb-3">Shop by Type</p>
          <h2
            className="font-display text-5xl md:text-6xl text-white tracking-wider mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BROWSE CATEGORIES
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-base">
            Find exactly what your vehicle needs from our comprehensive catalogue of
            genuine and aftermarket parts.
          </p>
        </div>

        {/* Grid — asymmetric 3-col layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group relative overflow-hidden border border-white/5 hover:border-brand-500/40 transition-all duration-300 ${
                i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
              }`}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-dark-800/80 to-dark-800/95`} />
              </div>

              {/* Content */}
              <div className={`relative p-6 flex flex-col justify-between ${i === 0 ? "min-h-80" : "min-h-44"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-brand-400/70 text-xs font-semibold tracking-widest uppercase">
                      {cat.count}
                    </span>
                    <h3
                      className="font-display text-3xl text-white tracking-wider mt-1 group-hover:text-brand-300 transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {cat.name.toUpperCase()}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-brand-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 mt-1" />
                </div>

                <p className="text-white/40 text-sm mt-3 group-hover:text-white/60 transition-colors">
                  {cat.description}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-500 group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
