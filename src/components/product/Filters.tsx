"use client";
import { useState } from "react";
import { ProductCategory } from "@/lib/products";

export type FilterState = {
  categories: ProductCategory[];
  priceRange: [number, number];
  colors: string[];
  straps: string[];
  movements: string[];
  inStockOnly: boolean;
};

type Props = {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  onClose?: () => void;
};

const priceOptions = [
  { label: "Under ৳3,000", min: 0, max: 3000 },
  { label: "৳3,000 - ৳5,000", min: 3000, max: 5000 },
  { label: "৳5,000 - ৳7,000", min: 5000, max: 7000 },
  { label: "৳7,000 - ৳10,000", min: 7000, max: 10000 },
  { label: "Premium Above ৳8,000", min: 8000, max: 20000 },
];

const categories: { id: ProductCategory; label: string }[] = [
  { id: "mens", label: "Men's" },
  { id: "womens", label: "Women's" },
  { id: "couple", label: "Couple" },
  { id: "smart", label: "Smart" },
  { id: "casual", label: "Casual" },
  { id: "premium", label: "Premium" },
];

const colorOptions = ["Black", "Silver", "Gold", "Rose Gold", "Blue", "Brown"];
const strapOptions = ["Stainless Steel", "Leather", "Mesh", "Silicone"];
const movementOptions = ["Quartz", "Automatic", "Digital Smart"];

export function Filters({ filters, setFilters, onClose }: Props) {
  const toggleCategory = (cat: ProductCategory) => {
    setFilters({
      ...filters,
      categories: filters.categories.includes(cat) ? filters.categories.filter(c => c !== cat) : [...filters.categories, cat],
    });
  };

  const setPrice = (min: number, max: number) => {
    setFilters({ ...filters, priceRange: [min, max] });
  };

  const toggleArray = (key: "colors" | "straps" | "movements", value: string) => {
    const arr = filters[key] as string[];
    setFilters({
      ...filters,
      [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
    });
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between p-6 border-b border-black/5 lg:hidden">
        <h3 className="font-semibold">Filters</h3>
        <button onClick={onClose} className="p-2 -mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-8 overflow-auto">
        {/* Categories */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium text-black/40 mb-4">Category</h4>
          <div className="space-y-2.5">
            {categories.map(c => (
              <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                  className="w-4 h-4 rounded border-black/15 accent-black"
                />
                <span className="text-sm text-black/70 group-hover:text-black">{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium text-black/40 mb-4">Price Range</h4>
          <div className="space-y-2">
            {priceOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => setPrice(opt.min, opt.max)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-colors ${filters.priceRange[0] === opt.min && filters.priceRange[1] === opt.max ? "bg-navy text-gold-light border-navy" : "bg-ivory border-gold/20 hover:border-gold/40 text-navy/70"}`}
              >
                {opt.label}
              </button>
            ))}
            <button onClick={() => setPrice(0, 20000)} className="text-xs text-black/40 hover:text-black mt-2">
              Clear price filter
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium text-black/40 mb-4">Color</h4>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(color => (
              <button
                key={color}
                onClick={() => toggleArray("colors", color)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filters.colors.includes(color) ? "bg-navy text-gold-light border-navy" : "bg-white border-gold/25 hover:border-gold text-navy/60"}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Strap */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium text-black/40 mb-4">Strap Material</h4>
          <div className="space-y-2.5">
            {strapOptions.map(s => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={filters.straps.includes(s)} onChange={() => toggleArray("straps", s)} className="w-4 h-4 rounded border-black/15 accent-black" />
                <span className="text-sm text-black/70 group-hover:text-black">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Movement */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium text-black/40 mb-4">Movement</h4>
          <div className="space-y-2.5">
            {movementOptions.map(m => (
              <label key={m} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={filters.movements.includes(m)} onChange={() => toggleArray("movements", m)} className="w-4 h-4 rounded border-black/15 accent-black" />
                <span className="text-sm text-black/70 group-hover:text-black">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={filters.inStockOnly} onChange={e => setFilters({ ...filters, inStockOnly: e.target.checked })} className="w-4 h-4 rounded border-black/15 accent-black" />
            <span className="text-sm font-medium">In Stock Only</span>
          </label>
        </div>

        <button
          onClick={() => setFilters({ categories: [], priceRange: [0, 20000], colors: [], straps: [], movements: [], inStockOnly: false })}
          className="w-full btn btn-outline btn-md"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
