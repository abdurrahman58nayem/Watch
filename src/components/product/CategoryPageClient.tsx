"use client";
import { useState, useMemo } from "react";
import { Product, ProductCategory } from "@/lib/products";
import { ProductGrid } from "./ProductGrid";
import { Filters, FilterState } from "./Filters";
import { siteConfig } from "@/lib/config";

type Props = {
  products: Product[];
  title: string;
  description: string;
  category?: ProductCategory;
};

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "New Arrivals" },
  { id: "price-low", label: "Price Low to High" },
  { id: "price-high", label: "Price High to Low" },
  { id: "best", label: "Best Selling" },
];

export function CategoryPageClient({ products, title, description, category }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    categories: category ? [category] : [],
    priceRange: [0, 20000],
    colors: [],
    straps: [],
    movements: [],
    inStockOnly: false,
  });
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.categories.length > 0) {
      result = result.filter(p => p.category.some(c => filters.categories.includes(c)));
    }

    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    if (filters.colors.length > 0) {
      result = result.filter(p => p.colors.some(c => filters.colors.includes(c.name)) || filters.colors.some(col => p.dialColor.toLowerCase().includes(col.toLowerCase())));
    }

    if (filters.straps.length > 0) {
      result = result.filter(p => filters.straps.some(s => p.strap.toLowerCase().includes(s.toLowerCase())));
    }

    if (filters.movements.length > 0) {
      result = result.filter(p => filters.movements.some(m => p.movement.toLowerCase().includes(m.toLowerCase())));
    }

    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sort === "best") result.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "new") result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sort === "featured") result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

    return result;
  }, [products, filters, sort]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-display text-[32px] lg:text-[42px] font-semibold tracking-tight text-navy">{title}</h1>
        <p className="text-sm text-navy/50 mt-2 max-w-[560px]">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-navy/40">
          <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark font-semibold">{filtered.length} watches</span>
          <span>•</span>
          <span>Cash on Delivery • Fast Delivery • Warranty</span>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-[280px] flex-shrink-0">
          <div className="sticky top-[88px] rounded-[20px] border border-gold/20 overflow-hidden bg-white">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-6">
            <button onClick={() => setFilterOpen(true)} className="lg:hidden btn btn-outline btn-sm h-10 px-5">
              Filters
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <span className="hidden sm:block text-xs text-navy/40">Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="h-10 rounded-full border border-gold/30 bg-white px-4 text-sm outline-none focus:border-gold">
                {sortOptions.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid products={filtered} />

          {filtered.length > 0 && (
            <div className="mt-12 p-6 rounded-2xl bg-navy flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cream">Need help choosing?</p>
                <p className="text-xs text-gold-light/70 mt-1">Chat on WhatsApp for quick assistance — COD available across Bangladesh.</p>
              </div>
              <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="btn btn-gold btn-md">WhatsApp Us</a>
            </div>
          )}
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-white overflow-auto shadow-2xl">
            <Filters filters={filters} setFilters={setFilters} onClose={() => setFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
