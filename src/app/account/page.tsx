import Link from "next/link";

export const metadata = { title: "Account — TIMEORA" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[600px] px-6 py-16 text-center">
      <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark">Member</p>
      <h1 className="font-display text-[36px] font-semibold tracking-tight text-navy mt-2">Account</h1>
      <p className="text-sm text-navy/50 mt-3">Demo website — no real authentication required. This is a placeholder for client demo.</p>
      <div className="mt-8 p-6 rounded-2xl bg-white border border-gold/20 text-left">
        <p className="text-sm font-semibold text-navy">Demo Features Included:</p>
        <ul className="mt-3 space-y-2 text-sm text-navy/60">
          {["Product browsing and search", "Add to Cart and Wishlist (localStorage)", "Checkout with COD", "Order confirmation demo", "Category filtering and sorting"].map(item => (
            <li key={item} className="flex gap-2"><span className="text-gold">✦</span>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-navy/30">Real authentication, order history and profile management can be added in production.</p>
      </div>
      <Link href="/collections" className="mt-8 btn btn-navy btn-md">Browse Watches</Link>
    </div>
  );
}
