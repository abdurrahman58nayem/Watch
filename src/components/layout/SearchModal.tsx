"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void };

export function SearchModal({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<typeof products>([]);

  useEffect(() => {
    if (!open) {
      setQ("");
      setResults([]);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = products.filter(
      p =>
        p.name.toLowerCase().includes(lower) ||
        p.category.some(c => c.includes(lower)) ||
        p.dialColor.toLowerCase().includes(lower) ||
        p.strap.toLowerCase().includes(lower) ||
        p.movement.toLowerCase().includes(lower)
    );
    setResults(filtered.slice(0, 8));
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-white border-b border-black/5">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="flex items-center h-[72px] gap-4">
            <div className="flex-1 flex items-center gap-3 bg-[#F5F5F3] rounded-full px-5 h-12">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/40">
                <circle cx="11" cy="11" r="6" />
                <path d="M21 21l-3.5-3.5" />
              </svg>
              <input
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search Chronograph, Black Watch, Men's, Smart..."
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-black/30"
              />
              {q && (
                <button onClick={() => setQ("")} className="text-black/30 hover:text-black">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </div>
            <button onClick={onClose} className="text-sm font-medium px-5 h-12 rounded-full border border-black/10 hover:bg-black hover:text-white transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto bg-[#FCFCFA]">
        <div className="mx-auto max-w-[800px] px-6 py-8">
          {!q.trim() ? (
            <div>
              <p className="text-xs uppercase tracking-widest text-black/30 font-medium mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Chronograph", "Black Watch", "Men's", "Women's", "Smart", "Couple", "Rose Gold", "Leather"].map(term => (
                  <button
                    key={term}
                    onClick={() => setQ(term)}
                    className="px-4 py-2 rounded-full bg-white border border-black/10 text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="mt-10">
                <p className="text-xs uppercase tracking-widest text-black/30 font-medium mb-4">Shop by Category</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Men's Watches", href: "/mens" },
                    { label: "Women's Watches", href: "/womens" },
                    { label: "Couple Watches", href: "/couple" },
                    { label: "Smart Watches", href: "/smart" },
                    { label: "Premium Collection", href: "/premium" },
                    { label: "Sale", href: "/sale" },
                  ].map(c => (
                    <Link key={c.href} href={c.href} onClick={onClose} className="p-4 bg-white border border-black/5 rounded-xl hover:border-black/15 transition-colors">
                      <span className="text-sm font-medium">{c.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-black/40">No watches found for “{q}”</p>
              <p className="text-sm text-black/30 mt-2">Try different keywords like Chronograph, Black, Silver, Smart</p>
            </div>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-widest text-black/30 font-medium mb-4">{results.length} results for “{q}”</p>
              <div className="grid gap-3">
                {results.map(p => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="flex gap-4 p-3 bg-white border border-black/5 rounded-xl hover:border-black/15 hover:shadow-sm transition-all group"
                  >
                    <div className="w-20 h-20 bg-[#F8F8F6] rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-[14px] font-medium text-black truncate">{p.name}</h4>
                      <p className="text-xs text-black/40 mt-0.5 capitalize">{p.category[0]} • {p.strap}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-xs line-through text-black/30">{formatPrice(p.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                    <div className="self-center">
                      <span className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href={`/search?q=${encodeURIComponent(q)}`} onClick={onClose} className="inline-flex px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 transition-colors">
                  View all results
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
