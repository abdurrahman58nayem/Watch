import { getProductsByCategory } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "Smart Watches — TIMEORA" };

export default function SmartPage() {
  const products = getProductsByCategory("smart");
  return (
    <CategoryPageClient
      products={products}
      category="smart"
      title="Smart Watches"
      description="TIMEORA Smart series with heart rate, AMOLED, Bluetooth calling and long battery life — smart features with premium design."
    />
  );
}
