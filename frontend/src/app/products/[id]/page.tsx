"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  stock?: number;
  description?: string;
  brand?: string;
  sku?: string;
}

interface ProductApiResponse {
  data?: unknown;
}

const FALLBACKS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
  "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?w=600&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
];

const priceFormatter = new Intl.NumberFormat("en-IN");

const sanitizeText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const sanitizeNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const normalizeProduct = (value: unknown): Product | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const id = sanitizeText(record._id);
  const name = sanitizeText(record.name);
  const price = sanitizeNumber(record.price);
  if (!id || !name || price === undefined) return null;

  return {
    _id: id,
    name,
    price,
    category: sanitizeText(record.category),
    image: sanitizeText(record.image),
    stock: sanitizeNumber(record.stock),
    description: sanitizeText(record.description),
    brand: sanitizeText(record.brand),
    sku: sanitizeText(record.sku),
  };
};

const getFallbackImage = (seed: string): string =>
  FALLBACKS[Math.abs(Number.parseInt(seed, 10) || 0) % FALLBACKS.length];

const getSafeImageUrl = (value?: string) => {
  if (!value) return null;

  try {
    if (value.startsWith("/")) return value;

    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
};

export default function ProductDetailPage({ params }: { readonly params: Promise<{ readonly id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("Not found");

        const data: ProductApiResponse = await res.json();
        const normalized = normalizeProduct(data.data);
        if (!normalized) throw new Error("Invalid product response");
        setProduct(normalized);
      } catch {
        setProduct({
          _id: id,
          name: "High-Performance Piston Kit",
          price: 3499,
          category: "Engine Parts",
          description:
            "OEM-quality piston kit compatible with a wide range of vehicles. Features a precision-engineered design for optimal performance and longevity. Comes with piston rings, pin, and clips for a dependable rebuild.",
          stock: 12,
          brand: "AutoPrime",
          sku: `SKU-${id.toUpperCase()}`,
          image: getFallbackImage(id),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  let imageUrl = getFallbackImage(product?._id ?? id);
  if (product && !imgError && product.image) {
    const safeUrl = getSafeImageUrl(product.image);
    if (safeUrl) {
      imageUrl = safeUrl;
    }
  }

  const isOutOfStock = product?.stock === 0;

  let stockClassName = "text-green-400";
  let stockLabel = "In stock";
  if (isOutOfStock) {
    stockClassName = "text-red-400";
    stockLabel = "Out of stock";
  } else if (product?.stock && product.stock < 5) {
    stockClassName = "text-amber-400";
    stockLabel = `Only ${product.stock} left`;
  }

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < qty; i += 1) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: imageUrl,
        category: product.category,
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleShare = async () => {
    if (!product || !globalThis.navigator?.share || globalThis.window === undefined) return;

    try {
      await globalThis.navigator.share({ title: product.name, url: globalThis.window.location.href });
    } catch {
      // User dismissal is expected for share dialogs.
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="skeleton aspect-square" />
            <div className="space-y-4">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-8 w-1/3 rounded" />
              <div className="skeleton h-24 w-full rounded" />
              <div className="skeleton h-12 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-900 pt-20">
        <div className="text-center">
          <h2 className="mb-4 font-display text-4xl text-white">PRODUCT NOT FOUND</h2>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="transition-colors hover:text-white"
                >
                  {product.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="max-w-xs truncate text-white/60">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="mb-8 flex w-fit items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden border border-white/5 bg-dark-800">
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
              {product.category && (
                <div className="absolute left-4 top-4">
                  <span className="bg-dark-900/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/60 backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setWishlisted(!wishlisted)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center border transition-all duration-200 ${wishlisted ? "border-red-500/40 bg-red-500/20 text-red-400" : "border-white/20 bg-dark-900/60 text-white/50 hover:text-white"}`}
              >
                <Heart className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div>
            {product.brand && <p className="section-label mb-2">{product.brand}</p>}
            <h1 className="mb-4 font-display text-4xl tracking-wider text-white md:text-5xl">
              {product.name.toUpperCase()}
            </h1>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    className={`h-4 w-4 ${num <= 4 ? "fill-brand-400 text-brand-400" : "text-white/20"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-white/40">4.0 (24 reviews)</span>
            </div>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-brand-400">
                Rs. {priceFormatter.format(product.price)}
              </span>
              <span className="text-sm text-white/30">incl. GST</span>
            </div>

            {product.description && (
              <p className="mb-6 text-sm leading-relaxed text-white/50">{product.description}</p>
            )}

            <div className="mb-6 flex gap-6 text-sm">
              {product.sku && (
                <div>
                  <span className="text-white/30">SKU: </span>
                  <span className="text-white/60">{product.sku}</span>
                </div>
              )}
              <div>
                <span className="text-white/30">Stock: </span>
                <span className={stockClassName}>
                  {stockLabel}
                </span>
              </div>
            </div>

            {!isOutOfStock && (
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center border border-white/10">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                    title="Decrease quantity"
                    className="flex h-12 w-10 items-center justify-center text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-white">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                    aria-label="Increase quantity"
                    title="Increase quantity"
                    className="flex h-12 w-10 items-center justify-center text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${added ? "bg-green-600 text-white" : "bg-brand-500 text-white hover:bg-brand-600"}`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  title="Share product"
                  className="flex h-12 w-12 items-center justify-center border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="mb-6 border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                This product is currently out of stock.
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
              {[
                { icon: Shield, text: "Quality Checked" },
                { icon: Truck, text: "Dispatch Support" },
                { icon: RotateCcw, text: "7-Day Returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="h-5 w-5 text-brand-500" />
                  <span className="text-xs text-white/40">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12">
          <h2 className="mb-2 font-display text-3xl tracking-wider text-white">
            YOU MAY ALSO LIKE
          </h2>
          <p className="mb-8 text-sm text-white/40">More parts from the same category</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                href={`/products/${i}`}
                className="group border border-white/5 bg-dark-800 transition-all hover:border-brand-500/30"
              >
                <div className="aspect-square overflow-hidden bg-dark-700">
                  <img
                    src={FALLBACKS[i % FALLBACKS.length]}
                    alt={`Related product ${i}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-medium text-white/70 transition-colors group-hover:text-white">
                    Related Auto Part {i}
                  </p>
                  <p className="mt-1 text-sm font-bold text-brand-400">
                    Rs. {priceFormatter.format(Math.floor(Math.random() * 3000) + 500)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
