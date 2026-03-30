import Link from "next/link";

export default function ProductSlugPage() {
  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="section-label mb-3">Products</p>
        <h1 className="mb-4 font-display text-4xl tracking-wider text-white">
          PRODUCT PAGE MOVED
        </h1>
        <p className="text-white/50">
          This route is a placeholder in the legacy app directory. Use the active catalogue routes
          to view product details.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Go To Products
        </Link>
      </div>
    </div>
  );
}
