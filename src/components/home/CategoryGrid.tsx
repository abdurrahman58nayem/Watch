import Link from "next/link";
import { categories } from "@/lib/products";
import { ProductImage } from "@/components/product/ProductImage";

export function CategoryGrid() {
  return (
    <section className="py-14 lg:py-20 bg-cream">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark mb-2">Collections</p>
            <h2 className="font-display text-[32px] lg:text-[42px] font-semibold tracking-tight text-navy">Shop by Category</h2>
            <p className="text-sm text-navy/50 mt-2">Find your perfect timepiece for every moment</p>
          </div>
          <Link href="/collections" className="hidden lg:inline-flex text-sm font-semibold text-navy border-b-2 border-gold pb-0.5 hover:text-gold-dark transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group relative rounded-[22px] overflow-hidden bg-white border border-gold/20 card-lift"
            >
              <div className="aspect-[4/3] relative bg-ivory overflow-hidden">
                <ProductImage src={cat.image} alt={cat.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cat.accent}cc 0%, transparent 55%)` }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                  <h3 className="text-white font-display text-[18px] lg:text-[22px] font-semibold tracking-wide">{cat.label}</h3>
                  <p className="text-gold-light text-xs mt-1 font-medium">{cat.count} Watches</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
