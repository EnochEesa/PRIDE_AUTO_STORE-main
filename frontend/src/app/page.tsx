import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import CTABanner from "@/components/CTABanner";
import TrustBar from "@/components/TrustBar";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedProducts />
      <Categories />
      <CTABanner />
    </>
  );
}
