import { getProductsByCategory } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "Premium Collection — TIMEORA" };

export default function PremiumPage() {
  const products = getProductsByCategory("premium");
  return (
    <CategoryPageClient
      products={products}
      category="premium"
      title="The Signature Collection"
      description="Designed for moments that matter. 316L steel, sapphire-coated glass, automatic movement and premium finishing."
    />
  );
}
