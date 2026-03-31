"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, Search, ChevronDown } from "lucide-react";
import { sanitizeSearchQuery } from "@/lib/security";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  stock?: number;
}

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A–Z", value: "name_asc" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        // Extract unique categories
        const cats = ["All", ...new Set<string>(productList.map((p: Product) => p.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        // Fallback demo data
        const demo = generateDemoProducts();
        setProducts(demo);
        const cats = ["All", ...new Set<string>(demo.map((p) => p.category))];
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFiltered(result);
  }, [products, search, sortBy, activeCategory]);

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Page Header */}
      <div className="relative bg-dark-800 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">Catalogue</p>
          <h1
            className="font-display text-5xl md:text-7xl tracking-wider mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ALL PRODUCTS
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            Genuine and aftermarket parts for all major vehicle makes and models.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input
              type="text"
              placeholder="Search parts, categories..."
              value={search}
              onChange={(e) => setSearch(sanitizeSearchQuery(e.target.value))}
              maxLength={60}
              className="w-full bg-dark-700 border border-white/10 rounded-none pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition-colors text-sm"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-dark-700 border border-white/10 text-white px-4 py-3 pr-10 text-sm focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8 pb-4 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-brand-500 text-white"
                  : "bg-dark-700 text-white/50 hover:text-white hover:bg-dark-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">
            {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
          </p>
          <SlidersHorizontal className="w-4 h-4 text-white/30" />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-dark-800 border border-white/5">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-10 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-white/70 mb-2">No parts found</h3>
            <p className="text-white/40">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <div
                key={product._id}
                className="animate-on-load"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function generateDemoProducts(): Product[] {
  const categories = ["Engine Parts", "Brake System", "Filters", "Electrical", "Suspension", "Transmission"];
  const names = [
    "High-Performance Piston Kit",
    "Ceramic Brake Pads Set",
    "Premium Oil Filter",
    "Alternator Assembly",
    "Front Shock Absorber",
    "Clutch Plate Kit",
    "Timing Chain Set",
    "ABS Sensor Module",
    "Air Filter Element",
    "Spark Plug Set (4pcs)",
    "Radiator Coolant Hose",
    "Power Steering Pump",
  ];
  return names.map((name, i) => ({
    _id: String(i + 1),
    name,
    price: Math.floor(Math.random() * 8000) + 500,
    category: categories[i % categories.length],
    description: "OEM-quality replacement part with dependable fit and finish.",
    image: `https://picsum.photos/seed/${i + 10}/400/400`,
    stock: Math.floor(Math.random() * 50) + 1,
  }));
}
