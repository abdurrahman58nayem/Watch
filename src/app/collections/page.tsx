import { products } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPageClient";

export const metadata = { title: "All Collections — TIMEORA" };

export default function CollectionsPage() {
  return (
    <CategoryPageClient
      products={products}
      title="All Watches"
      description="Browse all TIMEORA collections — Men's, Women's, Couple, Smart, Casual and Premium. Filter by price, color, strap and movement."
    />
  );
}
