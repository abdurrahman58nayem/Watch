export const metadata = { title: "Account — TIMEORA" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[600px] px-6 py-16 text-center">
      <h1 className="text-[28px] font-bold tracking-tight">Account</h1>
      <p className="text-sm text-black/50 mt-3">Demo website — no real authentication required. This is a placeholder for client demo.</p>
      <div className="mt-8 p-6 rounded-2xl bg-white border border-black/5 text-left">
        <p className="text-sm font-medium">Demo Features Included:</p>
        <ul className="mt-3 space-y-2 text-sm text-black/60 list-disc pl-5">
          <li>Product browsing and search</li>
          <li>Add to Cart and Wishlist (localStorage)</li>
          <li>Checkout with COD</li>
          <li>Order confirmation demo</li>
          <li>Category filtering and sorting</li>
        </ul>
        <p className="mt-4 text-xs text-black/30">Real authentication, order history and profile management can be added in production.</p>
      </div>
    </div>
  );
}
