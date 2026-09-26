import { Product } from "@/lib/products";
import { getRelatedProducts } from "@/lib/products";
import { ProductGrid } from "./ProductGrid";

export function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 4);
  if (related.length === 0) return null;
  return (
    <div className="mt-16 border-t border-black/5 pt-12">
      <h3 className="text-[20px] font-semibold tracking-tight mb-6">You May Also Like</h3>
      <ProductGrid products={related} />
    </div>
  );
}
