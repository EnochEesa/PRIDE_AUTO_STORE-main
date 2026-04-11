import Link from "next/link";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="section-label mb-3">Gallery</p>
        <h1 className="mb-4 font-display text-5xl tracking-wider text-white md:text-6xl">
          BUILD GALLERY
        </h1>
        <p className="max-w-2xl text-white/50">
          Product photography and workshop install shots will live here. For now, browse the
          live catalogue while we finish curating the gallery experience.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
