import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-900 px-4 pt-20 text-center">
      <div className="max-w-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-brand-500/30 bg-brand-500/10">
          <Search className="h-9 w-9 text-brand-400" />
        </div>
        <p className="section-label mb-3">Page Missing</p>
        <h1 className="mb-4 font-display text-5xl tracking-wider text-white">
          NOTHING HERE YET
        </h1>
        <p className="mb-8 text-white/45">
          The page you tried to open does not exist or has moved. Head back to the
          storefront, browse parts, or open the order tracker.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back Home
          </Link>
          <Link
            href="/products"
            className="border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
