"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
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
  { label: "Name A-Z", value: "name_asc" },
];

const normalizeProducts = (payload: unknown): Product[] => {
  if (Array.isArray(payload)) return payload as Product[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as { data?: unknown; products?: unknown };
  if (Array.isArray(record.data)) return record.data as Product[];
  if (Array.isArray(record.products)) return record.products as Product[];
  return [];
};

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
        const response = await fetch("/api/products");
        const payload = await response.json();
        const productList = normalizeProducts(payload);
        setProducts(productList);
        setCategories([
          "All",
          ...new Set(productList.map((product) => product.category).filter(Boolean)),
        ]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        const demoProducts = generateDemoProducts();
        setProducts(demoProducts);
        setCategories([
          "All",
          ...new Set(demoProducts.map((product) => product.category)),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let next = [...products];

    if (activeCategory !== "All") {
      next = next.filter((product) => product.category === activeCategory);
    }

    if (search.trim()) {
      const normalizedQuery = search.toLowerCase();
      next = next.filter(
        (product) =>
          product.name?.toLowerCase().includes(normalizedQuery) ||
          product.category?.toLowerCase().includes(normalizedQuery) ||
          product.description?.toLowerCase().includes(normalizedQuery)
      );
    }

    switch (sortBy) {
      case "price_asc":
        next.sort((left, right) => left.price - right.price);
        break;
      case "price_desc":
        next.sort((left, right) => right.price - left.price);
        break;
      case "name_asc":
        next.sort((left, right) => left.name.localeCompare(right.name));
        break;
      default:
        break;
    }

    setFiltered(next);
  }, [activeCategory, products, search, sortBy]);

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="relative overflow-hidden border-b border-white/5 bg-dark-800">
        <div className="absolute inset-0 bg-noise opacity-50" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="section-label mb-3">Catalogue</p>
          <h1 className="mb-4 font-display text-5xl tracking-wider md:text-7xl">
            ALL PRODUCTS
          </h1>
          <p className="max-w-xl text-lg text-white/50">
            Genuine and aftermarket parts for all major vehicle makes and models.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search parts, categories, brands..."
              value={search}
              onChange={(event) => setSearch(sanitizeSearchQuery(event.target.value))}
              maxLength={60}
              className="w-full rounded-none border border-white/10 bg-dark-700 py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 transition-colors focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="cursor-pointer appearance-none border border-white/10 bg-dark-700 px-4 py-3 pr-10 text-sm text-white transition-colors focus:border-brand-500 focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-white/5 pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                activeCategory === category
                  ? "bg-brand-500 text-white"
                  : "bg-dark-700 text-white/50 hover:bg-dark-600 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-white/40">
            {loading
              ? "Loading..."
              : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
          </p>
          <SlidersHorizontal className="h-4 w-4 text-white/30" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border border-white/5 bg-dark-800">
                <div className="skeleton aspect-square" />
                <div className="space-y-3 p-4">
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-10 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="mb-2 text-xl font-semibold text-white/70">No parts found</h3>
            <p className="text-white/40">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, index) => (
              <div
                key={product._id}
                className="animate-on-load"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
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
  const categories = [
    "Engine Parts",
    "Brake System",
    "Filters",
    "Electrical",
    "Suspension",
    "Transmission",
  ];
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

  return names.map((name, index) => ({
    _id: String(index + 1),
    name,
    price: Math.floor(Math.random() * 8000) + 500,
    category: categories[index % categories.length],
    description: "OEM-quality replacement part with dependable fit and finish.",
    image: `https://picsum.photos/seed/${index + 10}/400/400`,
    stock: Math.floor(Math.random() * 50) + 1,
  }));
}
