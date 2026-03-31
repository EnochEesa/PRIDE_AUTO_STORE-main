"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/orders";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80";
const priceFormatter = new Intl.NumberFormat("en-IN");

const formatCurrency = (value: number): string =>
  `Rs. ${priceFormatter.format(value)}`;

export default function CartPage() {
  const router = useRouter();
  const { state, removeItem, updateQty, clearCart } = useCart();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const discount = couponApplied ? Math.floor(state.total * 0.1) : 0;
  const shipping = state.total > 999 ? 0 : 99;
  const finalTotal = state.total - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "PRIDE10") {
      setCouponApplied(true);
      setCouponError("");
      return;
    }

    setCouponError("Invalid coupon code");
    setCouponApplied(false);
  };

  const handlePlaceOrder = () => {
    if (!user || state.items.length === 0) return;

    setPlacingOrder(true);
    const order = createOrder({
      items: state.items,
      user,
      shipping,
      discount,
      total: finalTotal,
    });
    clearCart();
    router.push(`/orders?order=${encodeURIComponent(order.id)}&placed=1`);
  };

  if (state.items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-900 pt-20">
        <div className="px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center border border-white/5 bg-dark-800">
            <ShoppingBag className="h-10 w-10 text-white/20" />
          </div>
          <h2 className="mb-3 font-display text-4xl tracking-wider text-white">
            YOUR CART IS EMPTY
          </h2>
          <p className="mb-8 text-white/40">Add a few parts to begin your order.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="section-label mb-2">Review</p>
          <h1 className="font-display text-5xl tracking-wider text-white">
            YOUR CART
          </h1>
          <p className="mt-1 text-white/40">
            {state.count} item{state.count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="hidden grid-cols-12 gap-4 border-b border-white/5 px-4 pb-2 sm:grid">
              <span className="col-span-6 text-xs uppercase tracking-widest text-white/30">
                Product
              </span>
              <span className="col-span-2 text-center text-xs uppercase tracking-widest text-white/30">
                Price
              </span>
              <span className="col-span-2 text-center text-xs uppercase tracking-widest text-white/30">
                Qty
              </span>
              <span className="col-span-2 text-right text-xs uppercase tracking-widest text-white/30">
                Total
              </span>
            </div>

            {state.items.map((item) => (
              <div
                key={item._id}
                className="group grid grid-cols-12 items-center gap-4 border border-white/5 bg-dark-800 p-4 transition-colors hover:border-white/10"
              >
                <div className="col-span-12 flex items-center gap-4 sm:col-span-6">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-dark-700">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        (event.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item._id}`}
                      className="line-clamp-2 text-sm font-semibold text-white transition-colors hover:text-brand-300"
                    >
                      {item.name}
                    </Link>
                    {item.category && (
                      <p className="mt-0.5 text-xs text-white/30">{item.category}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-4 text-center sm:col-span-2">
                  <span className="text-sm text-white/60">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                <div className="col-span-5 flex items-center justify-center gap-2 sm:col-span-2">
                  <button
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center border border-white/10 bg-dark-700 text-white transition-colors hover:border-brand-500/50"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center border border-white/10 bg-dark-700 text-white transition-colors hover:border-brand-500/50"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-3 sm:col-span-2">
                  <span className="text-sm font-bold text-brand-400">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-white/20 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-400"
                    aria-label={`Remove ${item.name}`}
                    title={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/products"
                className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
              >
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-wider text-red-400/60 transition-colors hover:text-red-400"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-white/5 bg-dark-800 p-6">
              <h3 className="mb-6 font-display text-xl tracking-wider text-white">
                ORDER SUMMARY
              </h3>

              <div className="mb-6">
                <label className="mb-2 block text-xs uppercase tracking-widest text-white/40">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(event) => {
                        setCoupon(event.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="PRIDE10"
                      className="w-full border border-white/10 bg-dark-700 py-2 pl-9 pr-3 text-xs uppercase text-white placeholder-white/20 transition-colors focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="border border-white/10 bg-dark-700 px-3 py-2 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="mt-1 text-xs text-red-400">{couponError}</p>}
                {couponApplied && (
                  <p className="mt-1 text-xs text-green-400">10% discount applied.</p>
                )}
              </div>

              <div className="mb-4 space-y-3 border-t border-white/5 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white">{formatCurrency(state.total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount (10%)</span>
                    <span className="text-green-400">- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                    {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-400/70">
                    Complimentary shipping is applied automatically when eligible.
                  </p>
                )}
              </div>

              <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-brand-400">
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              {user ? (
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {placingOrder ? "Creating Order..." : "Place Demo Order"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/login?redirect=/cart"
                    className="btn-primary flex w-full items-center justify-center gap-2"
                  >
                    Sign In to Checkout <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="text-center text-xs text-white/30">
                    New customer?{" "}
                    <Link
                      href="/auth/signup"
                      className="text-brand-400 transition-colors hover:text-brand-300"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-white/20">
                Demo checkout creates a trackable order instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
