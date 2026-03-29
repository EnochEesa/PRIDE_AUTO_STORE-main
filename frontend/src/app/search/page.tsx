"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  stock?: number;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        const all: Product[] = Array.isArray(data) ? data : data.products || [];
        const q = query.toLowerCase();
        const filtered = all.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        );
        setResults(filtered);
      } catch {
        // Demo: filter from dummy data
        const demoProducts: Product[] = [
          { _id: "1", name: "High-Performance Piston Kit", price: 3499, category: "Engine Parts", description: "OEM-quality with 12-month warranty.", stock: 15 },
          { _id: "2", name: "Ceramic Brake Pads Set", price: 1299, category: "Brake System", description: "Low-dust ceramic compound.", stock: 8 },
          { _id: "3", name: "Premium Oil Filter", price: 349, category: "Filters", description: "High-flow synthetic media filter.", stock: 42 },
          { _id: "4", name: "Alternator Assembly", price: 5999, category: "Electrical", description: "100% remanufactured.", stock: 3 },
          { _id: "5", name: "Front Shock Absorber Pair", price: 4200, category: "Suspension", description: "Gas-charged monotube design.", stock: 6 },
          { _id: "6", name: "Clutch Plate Kit", price: 2750, category: "Transmission", description: "Heavy-duty organic friction material.", stock: 11 },
          { _id: "7", name: "Timing Chain Set", price: 1850, category: "Engine Parts", description: "Hardened steel rollers.", stock: 19 },
          { _id: "8", name: "Spark Plug Set (4pcs)", price: 680, category: "Electrical", description: "Iridium tip for maximum ignition.", stock: 55 },
          { _id: "9", name: "Fuel Injector Cleaner", price: 450, category: "Filters", description: "Removes carbon deposits.", stock: 30 },
          { _id: "10", name: "Power Steering Pump", price: 3200, category: "Suspension", description: "Direct-fit replacement.", stock: 7 },
        ];
        const q = query.toLowerCase();
        setResults(demoProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/products" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <p className="section-label mb-2">Search</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider mb-4" style={{ fontFamily: "var(--font-display)" }}>
            RESULTS
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search again..."
                className="w-full bg-dark-700 border border-white/10 pl-12 pr-24 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition-colors text-sm"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold tracking-wider uppercase transition-colors">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Query info */}
        {query && (
          <div className="mb-8">
            {loading ? (
              <p className="text-white/40 text-sm">Searching for <span className="text-white">"{query}"</span>...</p>
            ) : (
              <p className="text-white/40 text-sm">
                {results.length === 0 ? "No results for" : `${results.length} result${results.length !== 1 ? "s" : ""} for`}{" "}
                <span className="text-white font-semibold">"{query}"</span>
              </p>
            )}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-dark-800 border border-white/5">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-10 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white/70 mb-2">No parts found</h3>
            <p className="text-white/40 mb-8">Try a different search term or browse by category.</p>
            <Link href="/products" className="btn-primary">Browse All Products</Link>
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty query */}
        {!query && (
          <div className="text-center py-24">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">Enter a search term above to find parts.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
