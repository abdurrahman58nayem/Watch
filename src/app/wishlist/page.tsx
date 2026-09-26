"use client";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const items = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8 lg:py-12">
      <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-rose">Saved</p>
      <h1 className="font-display text-[36px] font-semibold tracking-tight mb-2 text-navy">Wishlist</h1>
      <p className="text-sm text-navy/50 mb-8">{items.length} items saved</p>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl text-navy/40">Your wishlist is empty</p>
          <Link href="/collections" className="mt-4 btn btn-navy btn-md">Browse Watches</Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
