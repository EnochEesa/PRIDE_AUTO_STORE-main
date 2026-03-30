"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Mail,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  findOrder,
  getAllOrders,
  getOrdersForUser,
  getStatusIndex,
  statusFlow,
  type OrderRecord,
} from "@/lib/orders";

const priceFormatter = new Intl.NumberFormat("en-IN");
const formatCurrency = (value: number): string =>
  `Rs. ${priceFormatter.format(value)}`;

const formatDate = (value: string): string =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

function OrdersContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [reference, setReference] = useState(searchParams.get("order") || "");
  const [contact, setContact] = useState(user?.email || "");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [error, setError] = useState("");

  const placedNow = searchParams.get("placed") === "1";

  useEffect(() => {
    setContact((current) => current || user?.email || "");
    setRecentOrders(user?.email ? getOrdersForUser(user.email) : getAllOrders().slice(0, 2));
  }, [user?.email]);

  useEffect(() => {
    const prefilledReference = searchParams.get("order");
    if (!prefilledReference) return;

    const match =
      findOrder(prefilledReference, user?.email || contact) ||
      findOrder(prefilledReference);

    if (match) {
      setSelectedOrder(match);
      setError("");
      setReference(prefilledReference);
      return;
    }

    setSelectedOrder(null);
    setError("We could not find that order yet. Please verify the reference and email.");
  }, [contact, searchParams, user?.email]);

  const handleLookup = (event: React.FormEvent) => {
    event.preventDefault();

    const match = findOrder(reference, contact) || findOrder(reference);
    if (!match) {
      setSelectedOrder(null);
      setError("No order matched that reference. Try the order ID and checkout email.");
      return;
    }

    setSelectedOrder(match);
    setError("");
  };

  const highlightedOrders = useMemo(
    () => (recentOrders.length > 0 ? recentOrders : getAllOrders().slice(0, 2)),
    [recentOrders]
  );

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="section-label mb-3">Support</p>
          <h1 className="mb-4 font-display text-5xl tracking-wider text-white md:text-6xl">
            TRACK YOUR ORDER
          </h1>
          <p className="max-w-2xl text-white/50">
            Enter your order reference to see the latest status, estimated delivery,
            and every fulfilment milestone in one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {placedNow && selectedOrder && (
          <div className="mb-8 flex items-start gap-3 border border-green-500/30 bg-green-500/10 px-4 py-4 text-sm text-green-300">
            <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Your demo order is confirmed.</p>
              <p>
                Reference: <span className="text-white">{selectedOrder.id}</span>. You can
                revisit this page anytime to track it.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-white/5 bg-dark-800 p-6">
            <h2 className="mb-4 font-display text-2xl tracking-wider text-white">
              FIND AN ORDER
            </h2>
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-white/40">
                  Order ID or Tracking Code
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={reference}
                    onChange={(event) => setReference(event.target.value.toUpperCase())}
                    placeholder="Example: PAS-240731 or PRIDE-TRACK-731"
                    className="w-full border border-white/10 bg-dark-700 py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 transition-colors focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-white/40">
                  Email or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="Use the checkout email for a precise match"
                    className="w-full border border-white/10 bg-dark-700 py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 transition-colors focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                className="btn-primary inline-flex items-center gap-2"
              >
                Track Order <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 border-t border-white/5 pt-6 text-sm text-white/40">
              <p className="mb-2 font-semibold text-white/60">Quick demo references</p>
              <p>
                <code className="text-white">PAS-240731</code> with{" "}
                <code className="text-white">demo@prideauto.in</code>
              </p>
              <p>
                <code className="text-white">PAS-240612</code> with{" "}
                <code className="text-white">demo@prideauto.in</code>
              </p>
            </div>
          </div>

          <div className="border border-white/5 bg-dark-800 p-6">
            <h2 className="mb-4 font-display text-2xl tracking-wider text-white">
              YOUR RECENT ORDERS
            </h2>
            {user ? (
              <p className="mb-5 text-sm text-white/40">
                Signed in as <span className="text-white">{user.email}</span>
              </p>
            ) : (
              <p className="mb-5 text-sm text-white/40">
                Sign in to keep your latest orders handy, or track any order manually.
              </p>
            )}

            <div className="space-y-3">
              {highlightedOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => {
                    setReference(order.id);
                    setContact(user?.email || order.customerEmail);
                    setSelectedOrder(order);
                    setError("");
                  }}
                  className="w-full border border-white/10 bg-dark-700 p-4 text-left transition-colors hover:border-brand-500/40"
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">{order.id}</span>
                    <span className="text-xs uppercase tracking-widest text-brand-400">
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-white/40">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
                    {formatCurrency(order.total)}
                  </p>
                </button>
              ))}
            </div>

            {!user && (
              <div className="mt-6 border-t border-white/5 pt-6">
                <Link
                  href="/auth/login?redirect=/orders"
                  className="text-sm text-brand-400 transition-colors hover:text-brand-300"
                >
                  Sign in to save and revisit your orders
                </Link>
              </div>
            )}
          </div>
        </div>

        {selectedOrder && (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-white/5 bg-dark-800 p-6">
              <div className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="section-label mb-2">Order Summary</p>
                  <h2 className="font-display text-3xl tracking-wider text-white">
                    {selectedOrder.id}
                  </h2>
                  <p className="mt-2 text-sm text-white/40">
                    Tracking code:{" "}
                    <span className="text-white">{selectedOrder.trackingCode}</span>
                  </p>
                </div>
                <div className="space-y-2 text-sm text-white/50">
                  <p className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-brand-400" />
                    Placed {formatDate(selectedOrder.placedAt)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-brand-400" />
                    ETA {formatDate(selectedOrder.estimatedDelivery)}
                  </p>
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-400" />
                    Status {selectedOrder.status.replaceAll("_", " ")}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {statusFlow.map((status, index) => {
                  const step = selectedOrder.timeline.find((entry) => entry.key === status);
                  const isComplete =
                    index <= getStatusIndex(selectedOrder.status) && Boolean(step?.completedAt);

                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`mt-1 h-3 w-3 rounded-full ${
                            isComplete ? "bg-brand-500" : "bg-white/15"
                          }`}
                        />
                        {index < statusFlow.length - 1 && (
                          <div
                            className={`mt-2 h-14 w-px ${
                              index < getStatusIndex(selectedOrder.status)
                                ? "bg-brand-500/60"
                                : "bg-white/10"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-white">{step?.label}</p>
                        <p className="mt-1 text-sm text-white/40">{step?.description}</p>
                        <p className="mt-1 text-xs text-white/25">
                          {step?.completedAt
                            ? formatDate(step.completedAt)
                            : "Pending update"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-8">
              <div className="border border-white/5 bg-dark-800 p-6">
                <h3 className="mb-4 font-display text-xl tracking-wider text-white">
                  ITEMS IN THIS ORDER
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={`${selectedOrder.id}-${item._id}`}
                      className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-white/30">
                          {item.category || "Auto Part"}
                        </p>
                        <p className="mt-1 text-sm text-white/40">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-brand-400">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/5 bg-dark-800 p-6">
                <h3 className="mb-4 font-display text-xl tracking-wider text-white">
                  PAYMENT BREAKDOWN
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white">
                      {formatCurrency(selectedOrder.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Shipping</span>
                    <span className="text-white">
                      {selectedOrder.shipping === 0
                        ? "FREE"
                        : formatCurrency(selectedOrder.shipping)}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-400">Discount</span>
                      <span className="text-green-400">
                        - {formatCurrency(selectedOrder.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-brand-400">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-white/5 bg-dark-800 p-6">
                <h3 className="mb-4 font-display text-xl tracking-wider text-white">
                  NEED HELP?
                </h3>
                <p className="mb-4 text-sm text-white/40">
                  Share your order ID with our team and we will help with delivery,
                  invoice, or replacement questions.
                </p>
                <div className="space-y-3 text-sm text-white/60">
                  <p className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-brand-400" />
                    prideautostore2000@gmail.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-brand-400" />
                    +91 99441 40272
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-dark-900 pt-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
