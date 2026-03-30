"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
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

const DEMO_PRODUCTS: Product[] = [
  {
    _id: "1",
    name: "High-Performance Piston Kit",
    price: 3499,
    category: "Engine Parts",
    description: "OEM-quality with 12-month warranty.",
    stock: 15,
  },
  {
    _id: "2",
    name: "Ceramic Brake Pads Set",
    price: 1299,
    category: "Brake System",
    description: "Low-dust ceramic compound for smooth braking.",
    stock: 8,
  },
  {
    _id: "3",
    name: "Premium Oil Filter",
    price: 349,
    category: "Filters",
    description: "High-flow synthetic media filter.",
    stock: 42,
  },
  {
    _id: "4",
    name: "Alternator Assembly",
    price: 5999,
    category: "Electrical",
    description: "100% remanufactured with new brushes.",
    stock: 3,
  },
];

const normalizeProducts = (payload: unknown): Product[] => {
  if (Array.isArray(payload)) return payload as Product[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as { data?: unknown; products?: unknown };
  if (Array.isArray(record.data)) return record.data as Product[];
  if (Array.isArray(record.products)) return record.products as Product[];
  return [];
};

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const lookup = async () => {
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const payload = await response.json();
        const productList = normalizeProducts(payload);
        const normalizedQuery = query.toLowerCase();

        setResults(
          productList.filter(
            (product) =>
              product.name?.toLowerCase().includes(normalizedQuery) ||
              product.category?.toLowerCase().includes(normalizedQuery) ||
              product.description?.toLowerCase().includes(normalizedQuery)
          )
        );
      } catch {
        const normalizedQuery = query.toLowerCase();
        setResults(
          DEMO_PRODUCTS.filter(
            (product) =>
              product.name.toLowerCase().includes(normalizedQuery) ||
              product.category.toLowerCase().includes(normalizedQuery) ||
              product.description?.toLowerCase().includes(normalizedQuery)
          )
        );
      } finally {
        setLoading(false);
      }
    };

    lookup();
  }, [query]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="mb-6 flex w-fit items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
          <p className="section-label mb-2">Search</p>
          <h1 className="mb-4 font-display text-5xl tracking-wider text-white md:text-6xl">
            RESULTS
          </h1>

          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search again..."
                className="w-full border border-white/10 bg-dark-700 py-3 pl-12 pr-24 text-sm text-white placeholder-white/30 transition-colors focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute bottom-0 right-0 top-0 bg-brand-500 px-5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-600"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {query && (
          <div className="mb-8 text-sm text-white/40">
            {loading ? (
              <p>
                Searching for <span className="text-white">"{query}"</span>...
              </p>
            ) : (
              <p>
                {results.length === 0
                  ? "No results for"
                  : `${results.length} result${results.length !== 1 ? "s" : ""} for`}{" "}
                <span className="font-semibold text-white">"{query}"</span>
              </p>
            )}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border border-white/5 bg-dark-800">
                <div className="skeleton aspect-square" />
                <div className="space-y-3 p-4">
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-10 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="py-24 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <h3 className="mb-2 text-xl font-semibold text-white/70">No parts found</h3>
            <p className="mb-8 text-white/40">
              Try a different search term or browse by category.
            </p>
            <Link href="/products" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!query && (
          <div className="py-24 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <p className="text-white/40">Enter a search term above to find parts.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-dark-900 pt-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
