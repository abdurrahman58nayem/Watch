"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, generateOrderId } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const [form, setForm] = useState({ name: "", phone: "", address: "", area: "", district: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const deliveryCharge = deliveryArea === "inside" ? siteConfig.delivery.insideDhaka : siteConfig.delivery.outsideDhaka;
  const total = subtotal + deliveryCharge;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "নাম লিখুন";
    if (!form.phone.trim()) e.phone = "মোবাইল নম্বর লিখুন";
    else if (!/^01[0-9]{9}$/.test(form.phone.replace(/[^0-9]/g, ""))) e.phone = "সঠিক 11 ডিজিট নম্বর দিন";
    if (!form.address.trim()) e.address = "ঠিকানা লিখুন";
    if (!form.area.trim()) e.area = "এলাকা লিখুন";
    if (!form.district.trim()) e.district = "জেলা লিখুন";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;
    setLoading(true);
    const orderId = generateOrderId();
    // Simulate API
    setTimeout(() => {
      const orderData = { orderId, form, items, subtotal, deliveryCharge, total, deliveryArea };
      localStorage.setItem("timeora-last-order", JSON.stringify(orderData));
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-black/40">Your cart is empty. Add products first.</p>
        <Link href="/collections" className="mt-4 inline-flex h-11 px-8 rounded-full bg-black text-white text-sm items-center">Shop Now</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-[20px] border border-black/5 p-6">
          <h3 className="font-semibold text-[18px] mb-6">Customer Information</h3>
          <div className="grid gap-5">
            <div>
              <label className="text-xs uppercase tracking-widest font-medium text-black/40 mb-2 block">নাম *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="আপনার পুরো নাম" className="w-full h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black/30 bg-[#FCFCFA]" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-medium text-black/40 mb-2 block">মোবাইল নম্বর *</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" className="w-full h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black/30 bg-[#FCFCFA]" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-medium text-black/40 mb-2 block">সম্পূর্ণ ঠিকানা *</label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="বাসা/হোল্ডিং, রোড, এলাকা বিস্তারিত" rows={3} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30 bg-[#FCFCFA] resize-none" />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest font-medium text-black/40 mb-2 block">এলাকা *</label>
                <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="যেমন: Gulshan" className="w-full h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black/30 bg-[#FCFCFA]" />
                {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-medium text-black/40 mb-2 block">জেলা *</label>
                <input value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="যেমন: Dhaka" className="w-full h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black/30 bg-[#FCFCFA]" />
                {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-black/5 p-6">
          <h3 className="font-semibold text-[18px] mb-6">Delivery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => setDeliveryArea("inside")} className={`p-4 rounded-xl border text-left ${deliveryArea === "inside" ? "border-black bg-black text-white" : "border-black/10 bg-[#FCFCFA]"}`}>
              <p className="text-sm font-medium">Inside Dhaka — ৳70</p>
              <p className={`text-xs mt-1 ${deliveryArea === "inside" ? "text-white/60" : "text-black/40"}`}>2-3 days delivery</p>
            </button>
            <button type="button" onClick={() => setDeliveryArea("outside")} className={`p-4 rounded-xl border text-left ${deliveryArea === "outside" ? "border-black bg-black text-white" : "border-black/10 bg-[#FCFCFA]"}`}>
              <p className="text-sm font-medium">Outside Dhaka — ৳130</p>
              <p className={`text-xs mt-1 ${deliveryArea === "outside" ? "text-white/60" : "text-black/40"}`}>3-5 days delivery</p>
            </button>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-[#F8F8F6] border border-black/5 text-xs text-black/60">Delivery available across Bangladesh.</div>
        </div>

        <div className="bg-white rounded-[20px] border border-black/5 p-6">
          <h3 className="font-semibold text-[18px] mb-4">Payment</h3>
          <div className="p-4 rounded-xl border border-black bg-[#F8F8F6] flex gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Cash on Delivery</p>
              <p className="text-xs text-black/50 mt-1">Pay when your order is delivered. No advance payment needed.</p>
            </div>
            <div className="ml-auto">
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">✓</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-white rounded-[20px] border border-black/5 p-6 sticky top-[88px]">
          <h3 className="font-semibold mb-6">Order Summary</h3>
          <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
            {items.map(item => (
              <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F8F8F6] relative flex-shrink-0">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.product.name}</p>
                  <p className="text-[11px] text-black/40">Qty: {item.quantity} • {item.selectedColor}</p>
                </div>
                <span className="text-xs font-medium">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 text-sm border-t border-black/5 pt-4">
            <div className="flex justify-between"><span className="text-black/50">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-black/50">Delivery</span><span>{formatPrice(deliveryCharge)}</span></div>
            <div className="flex justify-between font-semibold text-[16px] pt-3 border-t border-black/10"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <button type="submit" disabled={loading} className="mt-6 w-full h-12 rounded-full bg-[#0A0A0A] text-white text-sm font-semibold tracking-wide hover:bg-black/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "অর্ডার নিশ্চিত করুন"
            )}
          </button>

          <p className="mt-3 text-[11px] text-center text-black/30">Demo checkout — no real payment will be charged. COD demo flow.</p>

          <div className="mt-6 flex items-center gap-2 text-[11px] text-black/40">
            <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">✓</span>
            Quality checked • Warranty • Fast delivery across Bangladesh
          </div>
        </div>
      </div>
    </form>
  );
}
