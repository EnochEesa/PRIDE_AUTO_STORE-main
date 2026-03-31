import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  stock?: number;
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:5000/api/products", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const products = Array.isArray(data) ? data : data.products || [];
    return products.slice(0, 8);
  } catch {
    // Return demo data if API not available
    return [
      { _id: "1", name: "High-Performance Piston Kit", price: 3499, category: "Engine Parts", description: "OEM-quality fit and finish for reliable rebuilds.", stock: 15 },
      { _id: "2", name: "Ceramic Brake Pads Set", price: 1299, category: "Brake System", description: "Low-dust ceramic compound for smooth braking.", stock: 8 },
      { _id: "3", name: "Premium Oil Filter", price: 349, category: "Filters", description: "High-flow synthetic media filter.", stock: 42 },
      { _id: "4", name: "Alternator Assembly", price: 5999, category: "Electrical", description: "100% remanufactured with new brushes.", stock: 3 },
      { _id: "5", name: "Front Shock Absorber Pair", price: 4200, category: "Suspension", description: "Gas-charged monotube design.", stock: 6 },
      { _id: "6", name: "Clutch Plate Kit", price: 2750, category: "Transmission", description: "Heavy-duty organic friction material.", stock: 11 },
      { _id: "7", name: "Timing Chain Set", price: 1850, category: "Engine Parts", description: "Hardened steel rollers, OEM spec.", stock: 19 },
      { _id: "8", name: "Spark Plug Set (4pcs)", price: 680, category: "Electrical", description: "Iridium tip for maximum ignition.", stock: 55 },
    ];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="section-label mb-3">Top Picks</p>
            <h2
              className="font-display text-5xl md:text-6xl text-white tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FEATURED PARTS
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-semibold tracking-wider uppercase group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Accent line */}
        <div className="flex gap-2 mb-12">
          <div className="h-px flex-1 bg-white/5" />
          <div className="h-px w-24 bg-brand-500" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
