"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import { products } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(lower) ||
        p.category.some(c => c.includes(lower)) ||
        p.dialColor.toLowerCase().includes(lower) ||
        p.strap.toLowerCase().includes(lower) ||
        p.movement.toLowerCase().includes(lower)
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-display text-[36px] font-semibold tracking-tight text-navy">Search</h1>
        {q ? (
          <p className="text-sm text-navy/50 mt-2">
            {results.length} results for “{q}”
          </p>
        ) : (
          <p className="text-sm text-navy/50 mt-2">Enter a keyword to search watches</p>
        )}
      </div>

      {q && results.length > 0 ? (
        <ProductGrid products={results} />
      ) : q ? (
        <div className="py-20 text-center">
          <p className="text-black/40">No watches found for “{q}”</p>
          <p className="text-sm text-black/30 mt-2">Try Chronograph, Black, Silver, Smart, Couple</p>
          <Link href="/collections" className="mt-6 btn btn-navy btn-md">Browse All Watches</Link>
        </div>
      ) : (
        <div className="py-12">
          <p className="text-xs uppercase tracking-widest text-black/30 font-medium mb-4">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {["Chronograph", "Black Watch", "Men's", "Women's", "Smart", "Couple", "Rose Gold", "Leather"].map(term => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="px-4 py-2 rounded-full bg-white border border-black/10 text-sm hover:bg-black hover:text-white transition-colors">
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-black/40">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
