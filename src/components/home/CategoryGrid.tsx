import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/products";

export function CategoryGrid() {
  return (
    <section className="py-14 lg:py-20 bg-[#FCFCFA]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-[28px] lg:text-[36px] font-bold tracking-tight text-black">Shop by Category</h2>
            <p className="text-sm text-black/50 mt-2">Find your perfect timepiece for every moment</p>
          </div>
          <Link href="/collections" className="hidden lg:inline-flex text-sm font-medium border-b border-black/20 pb-0.5 hover:border-black transition-colors">View All</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group relative rounded-[20px] overflow-hidden bg-white border border-black/[0.06] hover:border-black/10 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div className="aspect-[4/3] relative bg-[#F8F8F6] overflow-hidden">
                <Image src={cat.image} alt={cat.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                  <h3 className="text-white text-[15px] lg:text-[18px] font-semibold tracking-wide">{cat.label}</h3>
                  <p className="text-white/70 text-xs mt-1">{cat.count} Watches</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
