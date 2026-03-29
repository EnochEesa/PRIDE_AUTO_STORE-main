"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Star, Check } from "lucide-react";
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

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const fallback = FALLBACK_IMAGES[parseInt(product._id) % FALLBACK_IMAGES.length] || FALLBACK_IMAGES[0];
  const imageUrl = imgError || !product.image ? fallback : product.image;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock && product.stock < 5 && product.stock > 0;

  const handleAddToCart = () => {
    addItem({ _id: product._id, name: product.name, price: product.price, image: imageUrl, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-dark-800 border border-white/5 hover:border-brand-500/30 card-hover flex flex-col h-full">
      <div className="relative overflow-hidden aspect-square bg-dark-700">
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setImgError(true)} />
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-dark-900/80 backdrop-blur-sm text-white/60 text-[10px] font-semibold tracking-widest uppercase px-2 py-1">{product.category}</span>
          </div>
        )}
        {isLowStock && <div className="absolute top-3 right-3"><span className="bg-amber-500/90 text-dark-900 text-[10px] font-bold tracking-wider uppercase px-2 py-1">Low Stock</span></div>}
        {isOutOfStock && <div className="absolute top-3 right-3"><span className="bg-red-500/90 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1">Out of Stock</span></div>}
        <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/products/${product._id}`} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 hover:bg-brand-500 hover:border-brand-500 transition-all duration-200">
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < 4 ? "text-brand-400 fill-brand-400" : "text-white/20"}`} />
          ))}
        </div>
        <Link href={`/products/${product._id}`} className="flex-1">
          <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 hover:text-brand-300 transition-colors">{product.name}</h3>
        </Link>
        {product.description && <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2">{product.description}</p>}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div>
            <span className="text-brand-400 font-bold text-lg">₹{product.price?.toLocaleString("en-IN")}</span>
            <span className="text-white/20 text-xs ml-1">incl. GST</span>
          </div>
          <button onClick={handleAddToCart} disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${isOutOfStock ? "bg-white/5 text-white/20 cursor-not-allowed" : added ? "bg-green-600 text-white" : "bg-brand-500 hover:bg-brand-600 text-white"}`}>
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
