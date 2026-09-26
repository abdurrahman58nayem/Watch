import { getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "../product/ProductGrid";
import Link from "next/link";

export function FeaturedWatches() {
  const products = getFeaturedProducts();

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-black" />
              <span className="text-[11px] tracking-[0.2em] uppercase font-medium text-black/40">Best Sellers</span>
            </div>
            <h2 className="text-[28px] lg:text-[36px] font-bold tracking-tight text-black">Featured Watches</h2>
            <p className="text-sm text-black/50 mt-2">Handpicked premium timepieces loved by our customers</p>
          </div>
          <Link href="/collections" className="hidden lg:inline-flex h-10 px-6 rounded-full border border-black/10 text-sm font-medium items-center hover:bg-black hover:text-white hover:border-black transition-colors">
            View All Watches
          </Link>
        </div>

        <ProductGrid products={products} />

        <div className="mt-8 lg:hidden text-center">
          <Link href="/collections" className="inline-flex h-11 px-8 rounded-full bg-black text-white text-sm font-medium items-center">
            View All Watches
          </Link>
        </div>
      </div>
    </section>
  );
}
