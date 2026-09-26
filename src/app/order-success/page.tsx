"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import Image from "next/image";

type OrderData = {
  orderId: string;
  form: { name: string; phone: string; address: string; area: string; district: string };
  items: { product: { name: string; price: number; images: string[] }; quantity: number; selectedColor?: string }[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  deliveryArea: string;
};

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "TMR-10245";
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("timeora-last-order");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOrder(parsed);
      } catch {}
    }
  }, []);

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12 lg:py-20">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-[28px] lg:text-[32px] font-bold tracking-tight">অর্ডার সফলভাবে গ্রহণ করা হয়েছে!</h1>
        <p className="mt-3 text-sm text-black/60">আপনার অর্ডারের জন্য ধন্যবাদ।</p>

        <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0A0A0A] text-white">
          <span className="text-xs uppercase tracking-widest text-white/40">Order ID</span>
          <span className="font-mono font-semibold">#{orderId}</span>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-[20px] border border-black/5 p-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        {order ? (
          <>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-[#F8F8F6] relative overflow-hidden flex-shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-black/40">Qty {item.quantity} • {item.selectedColor}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-black/5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-black/50">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Delivery ({order.deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"})</span><span>{formatPrice(order.deliveryCharge)}</span></div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-black/5"><span>Total (COD)</span><span>{formatPrice(order.total)}</span></div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-[#F8F8F6] border border-black/5">
              <p className="text-xs uppercase tracking-widest font-medium text-black/40 mb-2">Delivery Details</p>
              <p className="text-sm font-medium">{order.form.name} • {order.form.phone}</p>
              <p className="text-sm text-black/60 mt-1">{order.form.address}, {order.form.area}, {order.form.district}</p>
              <p className="text-xs text-black/40 mt-3">Cash on Delivery • Pay when delivered • Delivery available across Bangladesh.</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-black/50">Order ID: #{orderId}</p>
            <p className="text-xs text-black/30 mt-2">Demo order — no real backend. This is a demonstration of the checkout flow.</p>
            <div className="mt-4 p-3 rounded-xl bg-[#F8F8F6] text-xs text-black/60">Inside Dhaka: ৳70 • Outside Dhaka: ৳130 • Cash on Delivery available across Bangladesh.</div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link href="/collections" className="h-11 rounded-full border border-black/10 flex items-center justify-center text-sm font-medium hover:bg-black/[0.02]">Continue Shopping</Link>
          <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="h-11 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">Contact Support</a>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-black/30">This is a demo website created by CodePixel Web. No real order was placed. COD flow is for demonstration.</p>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
