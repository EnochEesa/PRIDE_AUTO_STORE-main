"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Star, Shield, Truck, RotateCcw, Plus, Minus, Check, Share2, Heart } from "lucide-react";
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

const FALLBACKS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
  "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?w=600&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
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
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data);
      } catch {
        // Demo fallback
        setProduct({
          _id: params.id,
          name: "High-Performance Piston Kit",
          price: 3499,
          category: "Engine Parts",
          description: "OEM-quality piston kit compatible with a wide range of vehicles. Features a precision-engineered design for optimal performance and longevity. Comes with piston rings, pin, and clips. 12-month warranty included.",
          stock: 12,
          brand: "AutoPrime",
          sku: `SKU-${params.id.toUpperCase()}`,
          image: FALLBACKS[parseInt(params.id) % FALLBACKS.length],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({ _id: product._id, name: product.name, price: product.price, image: imageUrl, category: product.category });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

  if (!product) return (
    <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-4xl text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>PRODUCT NOT FOUND</h2>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const imageUrl = imgError || !product.image ? (FALLBACKS[parseInt(product._id) % FALLBACKS.length]) : product.image;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Breadcrumb */}
      <div className="bg-dark-800 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            {product.category && <><span>/</span><Link href={`/products?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link></>}
            <span>/</span>
            <span className="text-white/60 truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/products" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div>
            <div className="relative bg-dark-800 border border-white/5 overflow-hidden aspect-square">
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
              {product.category && (
                <div className="absolute top-4 left-4">
                  <span className="bg-dark-900/80 backdrop-blur-sm text-white/60 text-xs font-semibold tracking-widest uppercase px-3 py-1.5">{product.category}</span>
                </div>
              )}
              <button onClick={() => setWishlisted(!wishlisted)} className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center border transition-all duration-200 ${wishlisted ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-dark-900/60 border-white/20 text-white/50 hover:text-white"}`}>
                <Heart className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            {product.brand && <p className="section-label mb-2">{product.brand}</p>}
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {product.name.toUpperCase()}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-brand-400 fill-brand-400" : "text-white/20"}`} />
                ))}
              </div>
              <span className="text-white/40 text-sm">4.0 (24 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-brand-400 font-bold text-4xl">₹{product.price?.toLocaleString("en-IN")}</span>
              <span className="text-white/30 text-sm">incl. GST</span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-white/50 leading-relaxed mb-6 text-sm">{product.description}</p>
            )}

            {/* SKU / Stock */}
            <div className="flex gap-6 mb-6 text-sm">
              {product.sku && <div><span className="text-white/30">SKU: </span><span className="text-white/60">{product.sku}</span></div>}
              <div>
                <span className="text-white/30">Stock: </span>
                <span className={isOutOfStock ? "text-red-400" : product.stock && product.stock < 5 ? "text-amber-400" : "text-green-400"}>
                  {isOutOfStock ? "Out of stock" : product.stock && product.stock < 5 ? `Only ${product.stock} left` : "In stock"}
                </span>
              </div>
            </div>

            {/* Qty + Add to Cart */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-white/10">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))} className="w-10 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm tracking-wider uppercase transition-all duration-200 ${added ? "bg-green-600 text-white" : "bg-brand-500 hover:bg-brand-600 text-white"}`}>
                  {added ? <><Check className="w-4 h-4" /> Added to Cart!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                </button>

                <button onClick={() => navigator?.share?.({ title: product.name, url: window.location.href }).catch(() => {})} className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm mb-6">
                This product is currently out of stock.
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
              {[
                { icon: Shield, text: "12-Month Warranty" },
                { icon: Truck, text: "Free Shipping ₹999+" },
                { icon: RotateCcw, text: "7-Day Returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="w-5 h-5 text-brand-500" />
                  <span className="text-white/40 text-xs">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related / You may also like */}
        <div className="border-t border-white/5 pt-12">
          <h2 className="font-display text-3xl text-white tracking-wider mb-2" style={{ fontFamily: "var(--font-display)" }}>
            YOU MAY ALSO LIKE
          </h2>
          <p className="text-white/40 text-sm mb-8">More parts from the same category</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Link key={i} href={`/products/${i}`} className="group bg-dark-800 border border-white/5 hover:border-brand-500/30 transition-all">
                <div className="aspect-square overflow-hidden bg-dark-700">
                  <img src={FALLBACKS[i % FALLBACKS.length]} alt="Related product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <p className="text-white/70 text-xs font-medium line-clamp-2 group-hover:text-white transition-colors">Related Auto Part {i}</p>
                  <p className="text-brand-400 text-sm font-bold mt-1">₹{(Math.floor(Math.random() * 3000) + 500).toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
