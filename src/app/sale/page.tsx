import { products } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "Sale — TIMEORA" };

export default function SalePage() {
  const saleProducts = products.filter(p => p.originalPrice > p.price);
  return (
    <CategoryPageClient
      products={saleProducts}
      title="Sale — Up to 30% OFF"
      description="Limited time offers on premium watches. Original price strikethrough with discount badge — COD available, fast delivery across Bangladesh."
    />
  );
}
