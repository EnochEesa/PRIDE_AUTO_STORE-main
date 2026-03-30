import ProductDetailPage from "@/app/products/[id]/page";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailPage params={{ id: slug }} />;
}
