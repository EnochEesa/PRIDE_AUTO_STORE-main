"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80";

export default function CartPage() {
  const { state, removeItem, updateQty, clearCart } = useCart();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const discount = couponApplied ? Math.floor(state.total * 0.1) : 0;
  const shipping = state.total > 999 ? 0 : 99;
  const finalTotal = state.total - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "PRIDE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-dark-800 border border-white/5 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="font-display text-4xl text-white tracking-wider mb-3" style={{ fontFamily: "var(--font-display)" }}>
            YOUR CART IS EMPTY
          </h2>
          <p className="text-white/40 mb-8">Add some parts to get started.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="bg-dark-800 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="section-label mb-2">Review</p>
          <h1 className="font-display text-5xl text-white tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
            YOUR CART
          </h1>
          <p className="text-white/40 mt-1">{state.count} item{state.count !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 pb-2 border-b border-white/5">
              <span className="col-span-6 text-white/30 text-xs tracking-widest uppercase">Product</span>
              <span className="col-span-2 text-white/30 text-xs tracking-widest uppercase text-center">Price</span>
              <span className="col-span-2 text-white/30 text-xs tracking-widest uppercase text-center">Qty</span>
              <span className="col-span-2 text-white/30 text-xs tracking-widest uppercase text-right">Total</span>
            </div>

            {state.items.map((item) => (
              <div key={item._id} className="bg-dark-800 border border-white/5 p-4 grid grid-cols-12 gap-4 items-center group hover:border-white/10 transition-colors">
                {/* Image + name */}
                <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-dark-700 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || FALLBACK}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item._id}`} className="text-white text-sm font-semibold line-clamp-2 hover:text-brand-300 transition-colors">
                      {item.name}
                    </Link>
                    {item.category && <p className="text-white/30 text-xs mt-0.5">{item.category}</p>}
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 sm:col-span-2 text-center">
                  <span className="text-white/60 text-sm">₹{item.price.toLocaleString("en-IN")}</span>
                </div>

                {/* Qty controls */}
                <div className="col-span-5 sm:col-span-2 flex items-center justify-center gap-2">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-7 h-7 bg-dark-700 border border-white/10 hover:border-brand-500/50 text-white flex items-center justify-center transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-white text-sm w-6 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-7 h-7 bg-dark-700 border border-white/10 hover:border-brand-500/50 text-white flex items-center justify-center transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal + remove */}
                <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-3">
                  <span className="text-brand-400 font-bold text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  <button onClick={() => removeItem(item._id)} className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Link href="/products" className="text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-red-400/60 hover:text-red-400 text-xs tracking-wider uppercase transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 border border-white/5 p-6 sticky top-24">
              <h3 className="font-display text-xl text-white tracking-wider mb-6" style={{ fontFamily: "var(--font-display)" }}>
                ORDER SUMMARY
              </h3>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                      placeholder="PRIDE10"
                      className="w-full bg-dark-700 border border-white/10 pl-9 pr-3 py-2 text-white placeholder-white/20 text-xs focus:outline-none focus:border-brand-500 transition-colors uppercase"
                    />
                  </div>
                  <button onClick={applyCoupon} className="px-3 py-2 bg-dark-700 border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-xs transition-colors">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                {couponApplied && <p className="text-green-400 text-xs mt-1">10% discount applied!</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 border-t border-white/5 pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white">₹{state.total.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount (10%)</span>
                    <span className="text-green-400">−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-green-400/60 text-xs">Free shipping on orders over ₹999</p>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-6">
                <span className="text-white font-semibold">Total</span>
                <span className="text-brand-400 font-bold text-xl">₹{finalTotal.toLocaleString("en-IN")}</span>
              </div>

              {user ? (
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-3">
                  <Link href="/auth/login?redirect=/cart" className="btn-primary w-full flex items-center justify-center gap-2">
                    Sign In to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-white/30 text-xs text-center">
                    New customer?{" "}
                    <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300">Create account</Link>
                  </p>
                </div>
              )}

              <p className="text-white/20 text-xs text-center mt-4">
                Secure checkout · COD available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
