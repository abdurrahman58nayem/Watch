"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { useState } from "react";

export function CartClient() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const deliveryCharge = deliveryArea === "inside" ? siteConfig.delivery.insideDhaka : siteConfig.delivery.outsideDhaka;
  const total = subtotal + (items.length > 0 ? deliveryCharge : 0);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F8F8F6] flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-black/20">
            <path d="M6 6h15l-1.5 9h-13z" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Your cart is empty</h3>
        <p className="text-sm text-black/40 mt-2">Add some premium watches to get started</p>
        <Link href="/collections" className="mt-6 inline-flex h-11 px-8 rounded-full bg-black text-white text-sm font-medium items-center">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">Cart Items ({items.length})</h2>
          <span className="text-xs text-black/40">Cash on Delivery Available</span>
        </div>
        <div className="space-y-3">
          {items.map(item => (
            <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-black/5">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F8F8F6] relative flex-shrink-0">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${item.product.slug}`} className="text-sm font-medium hover:underline line-clamp-1">{item.product.name}</Link>
                    <p className="text-xs text-black/40 mt-1">Color: {item.selectedColor || item.product.colors[0]?.name} • {item.product.strap}</p>
                    <p className="text-xs text-black/40">SKU: {item.product.sku}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-black/30 hover:text-black p-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-full border border-black/10 h-8">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-l-full">−</button>
                      <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-r-full">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                    <p className="text-xs text-black/30 line-through">{formatPrice(item.product.originalPrice * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white rounded-[20px] border border-black/5 p-6 sticky top-[88px]">
          <h3 className="font-semibold mb-6">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-black/50">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>

            <div className="pt-3 border-t border-black/5">
              <p className="text-xs uppercase tracking-widest font-medium text-black/40 mb-3">Delivery Area</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeliveryArea("inside")}
                  className={`p-3 rounded-xl border text-left transition-colors ${deliveryArea === "inside" ? "bg-black text-white border-black" : "bg-[#F8F8F6] border-black/5 hover:border-black/10"}`}
                >
                  <p className="text-xs font-medium">Inside Dhaka</p>
                  <p className={`text-xs mt-1 ${deliveryArea === "inside" ? "text-white/60" : "text-black/40"}`}>৳70</p>
                </button>
                <button
                  onClick={() => setDeliveryArea("outside")}
                  className={`p-3 rounded-xl border text-left transition-colors ${deliveryArea === "outside" ? "bg-black text-white border-black" : "bg-[#F8F8F6] border-black/5 hover:border-black/10"}`}
                >
                  <p className="text-xs font-medium">Outside Dhaka</p>
                  <p className={`text-xs mt-1 ${deliveryArea === "outside" ? "text-white/60" : "text-black/40"}`}>৳130</p>
                </button>
              </div>
            </div>

            <div className="flex justify-between"><span className="text-black/50">Delivery Charge</span><span className="font-medium">{formatPrice(deliveryCharge)}</span></div>
            <div className="flex justify-between text-[16px] font-semibold pt-3 border-t border-black/10"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <div className="mt-6 space-y-3">
            <Link href="/checkout" className="w-full h-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-sm font-medium hover:bg-black/90 transition-colors">
              Proceed to Checkout
            </Link>
            <Link href="/collections" className="w-full h-11 rounded-full border border-black/10 flex items-center justify-center text-sm font-medium hover:bg-black/[0.02] transition-colors">
              Continue Shopping
            </Link>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-[#F8F8F6] border border-black/5">
            <p className="text-xs font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Cash on Delivery</p>
            <p className="text-[11px] text-black/50 mt-1">Pay when your order is delivered. No advance needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
