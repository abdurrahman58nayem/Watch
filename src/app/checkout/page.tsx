import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = { title: "Checkout — TIMEORA" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="font-display text-[32px] font-semibold tracking-tight mb-2 text-navy">Checkout</h1>
      <p className="text-sm text-black/50 mb-8">Cash on Delivery available across Bangladesh • Fast home delivery</p>
      <CheckoutClient />
    </div>
  );
}
