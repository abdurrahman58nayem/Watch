"use client";
import { useState } from "react";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

export function ProductInfo({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [qty, setQty] = useState(1);

  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-xs">
        <Link href="/" className="text-black/40 hover:text-black">Home</Link>
        <span className="text-black/20">/</span>
        <Link href={`/${product.category[0]}`} className="text-black/40 hover:text-black capitalize">{product.category[0]}</Link>
        <span className="text-black/20">/</span>
        <span className="text-black/60 truncate">{product.name}</span>
      </div>

      <h1 className="mt-4 text-[26px] lg:text-[32px] font-bold tracking-tight leading-[1.1] text-black">{product.name}</h1>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "#0A0A0A" : "none"} stroke="#0A0A0A" strokeWidth="1.2">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17l-6.4 4.2 2.4-7.2-6-4.8h7.6z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-medium">{product.rating}</span>
        <span className="text-sm text-black/40">({product.reviews} reviews)</span>
        <span className="w-px h-4 bg-black/10" />
        <span className={`text-xs px-2.5 py-1 rounded-full ${product.stock > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-[28px] font-bold tracking-tight">{formatPrice(product.price)}</span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-[16px] line-through text-black/30">{formatPrice(product.originalPrice)}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black text-white">{discount}% OFF</span>
          </>
        )}
      </div>

      <p className="mt-4 text-[14px] leading-6 text-black/60">{product.shortDescription}</p>

      {/* Color */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-widest font-medium text-black/40">Color: <span className="text-black normal-case tracking-normal font-medium">{selectedColor}</span></h4>
          <span className="text-xs text-black/30">{product.colors.length} options</span>
        </div>
        <div className="mt-3 flex gap-2.5">
          {product.colors.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.name)}
              className={`group relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === c.name ? "border-black scale-110" : "border-black/10 hover:border-black/20"}`}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
              title={c.name}
            >
              {selectedColor === c.name && <span className="w-1.5 h-1.5 rounded-full bg-white shadow" style={{ backgroundColor: c.hex === "#0A0A0A" || c.hex === "#111111" || c.hex === "#1F2937" ? "white" : c.hex === "#FFFFFF" ? "black" : "white" }} />}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {product.colors.map(c => (
            <span key={c.name} className={`text-[11px] px-2 py-1 rounded-full border ${selectedColor === c.name ? "bg-black text-white border-black" : "bg-white border-black/10 text-black/40"}`}>{c.name}</span>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-8">
        <h4 className="text-xs uppercase tracking-widest font-medium text-black/40 mb-3">Quantity</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-black/10 h-11">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-black/5 rounded-l-full">−</button>
            <span className="w-10 text-center text-sm font-medium">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-black/5 rounded-r-full">+</button>
          </div>
          <span className="text-xs text-black/40">SKU: {product.sku}</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8 grid grid-cols-12 gap-3">
        <button
          onClick={() => addToCart(product, qty, selectedColor)}
          disabled={product.stock === 0}
          className="col-span-7 lg:col-span-8 h-13 rounded-full border border-black/15 bg-white text-black text-sm font-semibold tracking-wide hover:bg-black hover:text-white hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6h15l-1.5 9h-13z" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
          </svg>
          Add to Cart
        </button>
        <Link
          href="/checkout"
          onClick={() => addToCart(product, qty, selectedColor)}
          className="col-span-5 lg:col-span-4 h-13 rounded-full bg-[#0A0A0A] text-white text-sm font-semibold tracking-wide flex items-center justify-center hover:bg-black/90 transition-colors"
        >
          Order Now
        </Link>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`col-span-12 h-11 rounded-full border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${isInWishlist(product.id) ? "bg-black text-white border-black" : "border-black/10 hover:border-black/20"}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21s-6.5-4.35-9-8.5A5 5 0 0 1 12 7a5 5 0 0 1 9 5.5c-2.5 4.15-9 8.5-9 8.5z" />
          </svg>
          {isInWishlist(product.id) ? "Added to Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {/* Trust */}
      <div className="mt-8 rounded-2xl bg-[#F8F8F6] border border-black/5 p-5 space-y-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Cash on Delivery Available</p>
            <p className="text-xs text-black/50 mt-1">Pay when your order is delivered. No advance payment needed.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Delivery Across Bangladesh</p>
            <p className="text-xs text-black/50 mt-1">Inside Dhaka: ৳70 • Outside Dhaka: ৳130 • 2-4 days delivery.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold">{product.warranty}</p>
            <p className="text-xs text-black/50 mt-1">Warranty terms may vary by product. {siteConfig.warranty.note}</p>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-black/5">
          <p className="text-black/40 uppercase tracking-wide text-[11px]">Inside Dhaka</p>
          <p className="font-semibold mt-1">৳70 Delivery</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-black/5">
          <p className="text-black/40 uppercase tracking-wide text-[11px]">Outside Dhaka</p>
          <p className="font-semibold mt-1">৳130 Delivery</p>
        </div>
      </div>
    </div>
  );
}
