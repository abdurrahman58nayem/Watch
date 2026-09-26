import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-black/40">No watches found matching your filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
