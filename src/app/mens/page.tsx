import { getProductsByCategory } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "Men's Watches — TIMEORA" };

export default function MensPage() {
  const products = getProductsByCategory("mens");
  return (
    <CategoryPageClient
      products={products}
      category="mens"
      title="Men's Watches"
      description="Executive, minimal, sport and heritage watches for everyday confidence. Premium finishing, quality-checked, COD across Bangladesh."
    />
  );
}
