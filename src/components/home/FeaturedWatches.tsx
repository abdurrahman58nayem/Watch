import { getBestSellers, getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "../product/ProductGrid";
import Link from "next/link";

export function FeaturedWatches() {
  const bestsellers = getBestSellers();
  const products = bestsellers.length >= 4 ? bestsellers : getFeaturedProducts().slice(0, 8);

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-gold" />
              <span className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark">Best Sellers</span>
            </div>
            <h2 className="font-display text-[32px] lg:text-[42px] font-semibold tracking-tight text-navy">Featured Watches</h2>
            <p className="text-sm text-navy/50 mt-2">Handpicked premium timepieces loved by our customers</p>
          </div>
          <Link href="/collections" className="hidden lg:inline-flex btn btn-outline btn-md">
            View All Watches
          </Link>
        </div>

        <ProductGrid products={products} />

        <div className="mt-8 lg:hidden text-center">
          <Link href="/collections" className="btn btn-navy btn-md">
            View All Watches
          </Link>
        </div>
      </div>
    </section>
  );
}
