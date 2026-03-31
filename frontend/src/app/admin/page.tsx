"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Package,
  ShieldCheck,
  ShoppingBag,
  TriangleAlert,
  Users,
  WalletCards,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, type OrderRecord } from "@/lib/orders";

const INVENTORY_ALERTS = [
  { sku: "PAD-BRK-114", name: "Fiat Padmini Rear Brake Cylinder", remaining: 3 },
  { sku: "PAD-IGN-208", name: "Premier Ignition Condenser", remaining: 4 },
  { sku: "PAD-CLT-441", name: "Classic Clutch Release Bearing", remaining: 2 },
];

const priceFormatter = new Intl.NumberFormat("en-IN");
const formatCurrency = (value: number): string => `Rs. ${priceFormatter.format(value)}`;

export default function AdminPageClient() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (user?.role === "admin") {
      setOrders(getAllOrders());
    }
  }, [user?.role]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const activeOrders = orders.filter((order) => order.status !== "delivered").length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const customers = new Set(orders.map((order) => order.customerEmail.toLowerCase())).size;

    return { totalOrders, activeOrders, revenue, customers };
  }, [orders]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-dark-900 pt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center border border-brand-500/30 bg-brand-500/10">
            <LockKeyhole className="h-9 w-9 text-brand-400" />
          </div>
          <p className="section-label mb-3">Protected Access</p>
          <h1 className="mb-4 font-display text-5xl tracking-wider text-white">
            ADMIN DASHBOARD
          </h1>
          <p className="max-w-2xl text-white/45">
            This route is protected in the demo build and only unlocks for approved
            admin accounts. Sign in with <span className="text-white">admin@prideautostore.com</span> to view
            operations, orders, and inventory alerts.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/auth/login?redirect=/admin" className="btn-primary inline-flex items-center gap-2">
              Sign In as Admin <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/orders"
              className="border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              View Order Tracking
            </Link>
          </div>

          <div className="mt-10 max-w-2xl border border-white/5 bg-dark-800 p-5 text-left">
            <p className="mb-2 text-sm font-semibold text-white/70">Security note</p>
            <p className="text-sm leading-relaxed text-white/40">
              This dashboard is protected with a client-side admin gate for the demo
              environment. Before running production operations, replace it with backend
              session validation and role-based access control.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="section-label mb-3">Operations</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-5xl tracking-wider text-white md:text-6xl">
                CONTROL ROOM
              </h1>
              <p className="mt-3 max-w-2xl text-white/45">
                Monitor incoming orders, keep an eye on low-stock classics, and
                review the current security posture for the storefront.
              </p>
            </div>
            <div className="border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
              Signed in as <span className="font-semibold text-white">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Orders in motion",
              value: stats.activeOrders,
              icon: Package,
              accent: "text-brand-400",
            },
            {
              label: "Tracked customers",
              value: stats.customers,
              icon: Users,
              accent: "text-cyan-300",
            },
            {
              label: "Revenue tracked",
              value: formatCurrency(stats.revenue),
              icon: WalletCards,
              accent: "text-emerald-300",
            },
            {
              label: "Inventory alerts",
              value: INVENTORY_ALERTS.length,
              icon: TriangleAlert,
              accent: "text-amber-300",
            },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="border border-white/5 bg-dark-800 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-white/35">{label}</p>
                <Icon className={`h-5 w-5 ${accent}`} />
              </div>
              <p className="font-display text-4xl tracking-wide text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-white/5 bg-dark-800 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="section-label mb-2">Live Orders</p>
                <h2 className="font-display text-3xl tracking-wider text-white">
                  RECENT ACTIVITY
                </h2>
              </div>
              <Link
                href="/orders"
                className="text-sm font-semibold uppercase tracking-wider text-brand-400 transition-colors hover:text-brand-300"
              >
                Open tracker
              </Link>
            </div>

            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="grid gap-3 border border-white/5 bg-dark-700/70 p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]"
                >
                  <div>
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="mt-1 text-sm text-white/40">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/30">Status</p>
                    <p className="mt-1 text-sm text-brand-300">
                      {order.status.replaceAll("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/30">Total</p>
                    <p className="mt-1 text-sm text-white">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="border border-white/5 bg-dark-800 p-6">
              <p className="section-label mb-2">Inventory</p>
              <h2 className="mb-5 font-display text-3xl tracking-wider text-white">
                LOW-STOCK ALERTS
              </h2>
              <div className="space-y-4">
                {INVENTORY_ALERTS.map((alert) => (
                  <div key={alert.sku} className="border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{alert.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/30">
                          {alert.sku}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-amber-300">
                        {alert.remaining} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/5 bg-dark-800 p-6">
              <p className="section-label mb-2">Security</p>
              <h2 className="mb-5 font-display text-3xl tracking-wider text-white">
                STORE HARDENING
              </h2>
              <div className="space-y-4 text-sm text-white/45">
                {[
                  "Security headers and CSP are enabled in the Next.js config.",
                  "Admin access is limited to approved email addresses in the demo flow.",
                  "Route lookups and auth inputs are sanitized before client use.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                  Review Catalogue <ShoppingBag className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  Back to storefront
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
