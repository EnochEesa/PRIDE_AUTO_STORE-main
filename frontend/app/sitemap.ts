import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pride-auto-store.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/products", "/about", "/contact", "/orders", "/cart", "/gallery"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
