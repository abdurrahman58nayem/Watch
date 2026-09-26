"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";

export function CartClient() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const deliveryCharge = deliveryArea === "inside" ? siteConfig.delivery.insideDhaka : siteConfig.delivery.outsideDhaka;
  const total = subtotal + (items.length > 0 ? deliveryCharge : 0);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-ivory border border-gold/20 flex items-center justify-center mb-6 text-gold">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 6h15l-1.5 9h-13z" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
          </svg>
        </div>
        <h3 className="font-display text-3xl font-semibold text-navy">Your cart is empty</h3>
        <p className="text-sm text-navy/40 mt-2">Add some premium watches to get started</p>
        <Link href="/collections" className="mt-6 btn btn-navy btn-md">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[22px] font-semibold text-navy">Cart Items ({items.length})</h2>
          <span className="text-xs text-emerald font-medium">Cash on Delivery Available</span>
        </div>
        <div className="space-y-3">
          {items.map(item => (
            <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-gold/20">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-ivory relative flex-shrink-0">
                <ProductImage src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${item.product.slug}`} className="text-sm font-medium hover:text-gold-dark line-clamp-1 text-navy">{item.product.name}</Link>
                    <p className="text-xs text-navy/40 mt-1">Color: {item.selectedColor || item.product.colors[0]?.name} • {item.product.strap}</p>
                    <p className="text-xs text-navy/40">SKU: {item.product.sku}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-navy/30 hover:text-burgundy p-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-gold/30 h-8 bg-ivory">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gold/15 rounded-l-full">−</button>
                    <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gold/15 rounded-r-full">+</button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-navy">{formatPrice(item.product.price * item.quantity)}</p>
                    <p className="text-xs text-navy/30 line-through">{formatPrice(item.product.originalPrice * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white rounded-[20px] border border-gold/20 p-6 sticky top-[88px]">
          <h3 className="font-display text-xl font-semibold mb-6 text-navy">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-navy/50">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>

            <div className="pt-3 border-t border-gold/20">
              <p className="text-xs uppercase tracking-widest font-semibold text-gold-dark mb-3">Delivery Area</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeliveryArea("inside")}
                  className={`p-3 rounded-xl border text-left transition-colors ${deliveryArea === "inside" ? "bg-navy text-gold-light border-navy" : "bg-ivory border-gold/20 hover:border-gold/40"}`}
                >
                  <p className="text-xs font-medium">Inside Dhaka</p>
                  <p className={`text-xs mt-1 ${deliveryArea === "inside" ? "text-gold-light/70" : "text-navy/40"}`}>৳70</p>
                </button>
                <button
                  onClick={() => setDeliveryArea("outside")}
                  className={`p-3 rounded-xl border text-left transition-colors ${deliveryArea === "outside" ? "bg-navy text-gold-light border-navy" : "bg-ivory border-gold/20 hover:border-gold/40"}`}
                >
                  <p className="text-xs font-medium">Outside Dhaka</p>
                  <p className={`text-xs mt-1 ${deliveryArea === "outside" ? "text-gold-light/70" : "text-navy/40"}`}>৳130</p>
                </button>
              </div>
            </div>

            <div className="flex justify-between"><span className="text-navy/50">Delivery Charge</span><span className="font-medium">{formatPrice(deliveryCharge)}</span></div>
            <div className="flex justify-between text-[16px] font-semibold pt-3 border-t border-gold/30 text-navy"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <div className="mt-6 space-y-3">
            <Link href="/checkout" className="w-full btn btn-gold btn-lg">
              Proceed to Checkout
            </Link>
            <Link href="/collections" className="w-full btn btn-outline btn-md">
              Continue Shopping
            </Link>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-emerald/10 border border-emerald/20">
            <p className="text-xs font-medium flex items-center gap-2 text-emerald"><span className="w-1.5 h-1.5 rounded-full bg-emerald" />Cash on Delivery</p>
            <p className="text-[11px] text-navy/50 mt-1">Pay when your order is delivered. No advance needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
