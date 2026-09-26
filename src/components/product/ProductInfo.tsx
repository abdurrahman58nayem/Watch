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
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAdd = () => {
    addToCart(product, qty, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-xs">
        <Link href="/" className="text-navy/40 hover:text-gold-dark">Home</Link>
        <span className="text-gold/40">/</span>
        <Link href={`/${product.category[0]}`} className="text-navy/40 hover:text-gold-dark capitalize">{product.category[0]}</Link>
        <span className="text-gold/40">/</span>
        <span className="text-navy/60 truncate">{product.name}</span>
      </div>

      <h1 className="mt-4 font-display text-[30px] lg:text-[38px] font-semibold tracking-tight leading-[1.1] text-navy">{product.name}</h1>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "#C9A24A" : "none"} stroke="#C9A24A" strokeWidth="1.2">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17l-6.4 4.2 2.4-7.2-6-4.8h7.6z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-medium text-navy">{product.rating}</span>
        <span className="text-sm text-navy/40">({product.reviews} reviews)</span>
        <span className="w-px h-4 bg-gold/30" />
        <span className={`text-xs px-2.5 py-1 rounded-full ${product.stock > 0 ? "bg-emerald/10 text-emerald border border-emerald/20" : "bg-rose/10 text-burgundy border border-rose/20"}`}>
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="font-display text-[34px] font-semibold tracking-tight text-navy">{formatPrice(product.price)}</span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-[16px] line-through text-navy/30">{formatPrice(product.originalPrice)}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-burgundy text-white">{discount}% OFF</span>
          </>
        )}
      </div>

      <p className="mt-4 text-[14px] leading-6 text-navy/60">{product.shortDescription}</p>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-navy/40">Color: <span className="text-navy normal-case tracking-normal font-medium">{selectedColor}</span></h4>
          <span className="text-xs text-navy/30">{product.colors.length} options</span>
        </div>
        <div className="mt-3 flex gap-2.5">
          {product.colors.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.name)}
              className={`group relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === c.name ? "border-gold scale-110" : "border-navy/10 hover:border-gold/40"}`}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
              title={c.name}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {product.colors.map(c => (
            <span key={c.name} className={`text-[11px] px-2 py-1 rounded-full border ${selectedColor === c.name ? "bg-navy text-gold-light border-navy" : "bg-white border-navy/10 text-navy/40"}`}>{c.name}</span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-xs uppercase tracking-widest font-semibold text-navy/40 mb-3">Quantity</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-gold/30 h-11 bg-white">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gold/15 rounded-l-full">−</button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-gold/15 rounded-r-full">+</button>
          </div>
          <span className="text-xs text-navy/40">SKU: {product.sku}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-12 gap-3">
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="col-span-7 lg:col-span-8 btn btn-outline h-[52px] text-sm"
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
        <Link
          href="/checkout"
          onClick={() => addToCart(product, qty, selectedColor)}
          className="col-span-5 lg:col-span-4 btn btn-gold h-[52px] text-sm"
        >
          Order Now
        </Link>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`col-span-12 btn h-11 text-sm ${isInWishlist(product.id) ? "btn-rose" : "btn-ghost"}`}
        >
          {isInWishlist(product.id) ? "Added to Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-ivory border border-gold/20 p-5 space-y-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald/15 text-emerald flex items-center justify-center flex-shrink-0">৳</div>
          <div>
            <p className="text-sm font-semibold text-navy">Cash on Delivery Available</p>
            <p className="text-xs text-navy/50 mt-1">Pay when your order is delivered. No advance payment needed.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center flex-shrink-0 text-sm">⚡</div>
          <div>
            <p className="text-sm font-semibold text-navy">Delivery Across Bangladesh</p>
            <p className="text-xs text-navy/50 mt-1">Inside Dhaka: ৳70 • Outside Dhaka: ৳130 • 2-4 days delivery.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center flex-shrink-0 text-sm">✓</div>
          <div>
            <p className="text-sm font-semibold text-navy">{product.warranty}</p>
            <p className="text-xs text-navy/50 mt-1">Warranty terms may vary by product. {siteConfig.warranty.note}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-gold/20">
          <p className="text-gold-dark uppercase tracking-wide text-[11px] font-semibold">Inside Dhaka</p>
          <p className="font-semibold mt-1 text-navy">৳70 Delivery</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-gold/20">
          <p className="text-gold-dark uppercase tracking-wide text-[11px] font-semibold">Outside Dhaka</p>
          <p className="font-semibold mt-1 text-navy">৳130 Delivery</p>
        </div>
      </div>
    </div>
  );
}
