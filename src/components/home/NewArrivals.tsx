import { getFeaturedProducts, getNewProducts } from "@/lib/products";
import { ProductGrid } from "../product/ProductGrid";
import Link from "next/link";

export function NewArrivals() {
  const fresh = getNewProducts();
  const products = fresh.length >= 8 ? fresh : getFeaturedProducts().slice(8, 20);

  return (
    <section className="py-14 lg:py-20 bg-gradient-to-b from-ivory to-cream">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-rose" />
              <span className="text-[11px] tracking-[0.22em] uppercase font-semibold text-rose">Just Landed</span>
            </div>
            <h2 className="font-display text-[32px] lg:text-[42px] font-semibold tracking-tight text-navy">New Arrivals</h2>
            <p className="text-sm text-navy/50 mt-2">Fresh designs added to the TIMEORA collection</p>
          </div>
          <Link href="/sale" className="hidden lg:inline-flex btn btn-gold btn-md">
            Shop Sale
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
