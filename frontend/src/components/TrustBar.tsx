import { Shield, Truck, RotateCcw, Headphones } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Genuine Parts",
    desc: "OEM & aftermarket certified",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    desc: "Ships in 24-48 hours",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-day hassle-free returns",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Mon-Sat, 9 AM - 9 PM",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-dark-800 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-4 px-6 py-6 group hover:bg-white/2 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                <Icon className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{title}</div>
                <div className="text-white/40 text-xs mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
