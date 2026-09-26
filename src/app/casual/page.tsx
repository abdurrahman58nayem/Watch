import { getProductsByCategory } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "Casual Watches — TIMEORA" };

export default function CasualPage() {
  const products = getProductsByCategory("casual");
  return (
    <CategoryPageClient
      products={products}
      category="casual"
      title="Casual Watches"
      description="Everyday versatile watches for street style, vintage charm and modern casual wear. Affordable luxury for daily use."
    />
  );
}
