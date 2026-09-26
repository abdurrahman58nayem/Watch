import { getProductsByCategory } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "Couple Watches — TIMEORA" };

export default function CouplePage() {
  const products = getProductsByCategory("couple");
  return (
    <CategoryPageClient
      products={products}
      category="couple"
      title="Couple Watches"
      description="Matching timepieces for duos who value togetherness. Coordinated designs, tailored sizes, premium gift box included."
    />
  );
}
