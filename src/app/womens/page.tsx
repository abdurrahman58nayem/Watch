import { getProductsByCategory } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "Women's Watches — TIMEORA" };

export default function WomensPage() {
  const products = getProductsByCategory("womens");
  return (
    <CategoryPageClient
      products={products}
      category="womens"
      title="Women's Watches"
      description="Elegant rose gold, petite, crystal and mesh watches designed for modern femininity and everyday grace."
    />
  );
}
