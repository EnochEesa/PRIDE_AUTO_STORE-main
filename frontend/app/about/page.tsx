import { Shield, Award, Users, Clock } from "lucide-react";
import Link from "next/link";

const MILESTONES = [
  { year: "2010", event: "Founded in Chennai with 500 SKUs" },
  { year: "2014", event: "Expanded to pan-India delivery network" },
  { year: "2018", event: "Crossed 25,000 happy customers" },
  { year: "2022", event: "Launched online catalogue with 10,000+ parts" },
  { year: "2024", event: "Opened 3 new regional warehouses" },
];

const VALUES = [
  { icon: Shield, title: "Quality First", desc: "Every part is tested and certified before it reaches you." },
  { icon: Award, title: "Trusted Brand", desc: "15+ years of serving workshops and car owners across India." },
  { icon: Users, title: "Customer Focus", desc: "Dedicated support team to help you find the right part." },
  { icon: Clock, title: "Fast Delivery", desc: "Same-day dispatch for orders placed before 2 PM." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Hero */}
      <div className="relative bg-dark-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1632823471565-1ecdf5c6da1e?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-800/50 to-dark-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="section-label mb-3">Our Story</p>
          <h1
            className="font-display text-6xl md:text-8xl text-white tracking-wider mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ABOUT PRIDE AUTO
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            Born from a passion for automobiles and a frustration with low-quality parts,
            Pride Auto Store has been India's trusted spare parts destination since 2010.
          </p>
        </div>
      </div>

      {/* Story section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-4">Who We Are</p>
            <h2
              className="font-display text-4xl md:text-5xl text-white tracking-wider mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DRIVEN BY QUALITY,<br />POWERED BY TRUST
            </h2>
            <div className="space-y-4 text-white/50 leading-relaxed">
              <p>
                Pride Auto Store started as a small workshop supplies vendor in Chennai.
                Over the years, we grew into one of South India's largest online
                catalogues for genuine and aftermarket automobile spare parts.
              </p>
              <p>
                Today, we serve over 50,000 customers — from individual car owners to
                large fleet operators — with a catalogue of 10,000+ SKUs spanning
                engine components, brake systems, electrical parts, and more.
              </p>
              <p>
                Every product we stock is quality-checked, properly catalogued with
                fitment data, and backed by our warranty promise.
              </p>
            </div>
            <Link href="/products" className="btn-primary inline-flex mt-8">
              Shop Now
            </Link>
          </div>

          {/* Milestones */}
          <div>
            <p className="section-label mb-8">Our Journey</p>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-brand-500/20" />
              <div className="space-y-8">
                {MILESTONES.map((m) => (
                  <div key={m.year} className="flex gap-6 items-start pl-12 relative">
                    <div className="absolute left-0 w-8 h-8 bg-dark-800 border border-brand-500/40 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-brand-500 rounded-full" />
                    </div>
                    <div>
                      <span
                        className="font-display text-2xl text-brand-400 tracking-wider"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {m.year}
                      </span>
                      <p className="text-white/50 text-sm mt-1">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-dark-800 border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label mb-3">What We Stand For</p>
            <h2
              className="font-display text-4xl md:text-5xl text-white tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              OUR VALUES
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-dark-700 border border-white/5 hover:border-brand-500/30 p-6 group transition-all duration-300 card-hover"
              >
                <div className="w-12 h-12 bg-brand-500/10 group-hover:bg-brand-500/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
