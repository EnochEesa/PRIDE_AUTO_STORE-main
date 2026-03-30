"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  stock?: number;
  description?: string;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80",
  "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?w=400&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80",
];

const priceFormatter = new Intl.NumberFormat("en-IN");

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const fallback =
    FALLBACK_IMAGES[Math.abs(Number.parseInt(product._id, 10) || 0) % FALLBACK_IMAGES.length] ||
    FALLBACK_IMAGES[0];
  const imageUrl = imgError || !product.image ? fallback : product.image;
  const isOutOfStock = product.stock === 0;
  const isLowStock = Boolean(product.stock && product.stock < 5 && product.stock > 0);

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="card-hover flex h-full flex-col border border-white/5 bg-dark-800 hover:border-brand-500/30">
      <div className="group relative aspect-square overflow-hidden bg-dark-700">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />

        {product.category && (
          <div className="absolute left-3 top-3">
            <span className="bg-dark-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/60 backdrop-blur-sm">
              {product.category}
            </span>
          </div>
        )}

        {isLowStock && (
          <div className="absolute right-3 top-3">
            <span className="bg-amber-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-dark-900">
              Low Stock
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute right-3 top-3">
            <span className="bg-red-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href={`/products/${product._id}`}
            className="border border-white/20 bg-white/10 p-3 text-white transition-all duration-200 hover:border-brand-500 hover:bg-brand-500"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-3 w-3 ${
                index < 4 ? "fill-brand-400 text-brand-400" : "text-white/20"
              }`}
            />
          ))}
        </div>

        <Link href={`/products/${product._id}`} className="flex-1">
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors hover:text-brand-300">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/40">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
          <div>
            <span className="text-lg font-bold text-brand-400">
              Rs. {priceFormatter.format(product.price)}
            </span>
            <span className="ml-1 text-xs text-white/20">incl. GST</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              isOutOfStock
                ? "cursor-not-allowed bg-white/5 text-white/20"
                : added
                  ? "bg-green-600 text-white"
                  : "bg-brand-500 text-white hover:bg-brand-600"
            }`}
          >
            {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
