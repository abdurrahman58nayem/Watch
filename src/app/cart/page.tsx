import { CartClient } from "@/components/cart/CartClient";

export const metadata = { title: "Cart — TIMEORA" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="font-display text-[32px] font-semibold tracking-tight mb-8 text-navy">Shopping Cart</h1>
      <CartClient />
    </div>
  );
}
