import { products } from "@/lib/products";
import { ProductGrid } from "../product/ProductGrid";
import Link from "next/link";

export function AllWatches() {
  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-navy" />
              <span className="text-[11px] tracking-[0.22em] uppercase font-semibold text-navy/50">Full Catalogue</span>
            </div>
            <h2 className="font-display text-[32px] lg:text-[42px] font-semibold tracking-tight text-navy">All {products.length} Watches</h2>
            <p className="text-sm text-navy/50 mt-2">Every TIMEORA design — men, women, couple, smart, casual &amp; premium</p>
          </div>
          <Link href="/collections" className="hidden lg:inline-flex btn btn-navy btn-md">
            Filter &amp; Sort
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
