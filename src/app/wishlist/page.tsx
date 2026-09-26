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
      <h1 className="text-[28px] font-bold tracking-tight mb-2">Wishlist</h1>
      <p className="text-sm text-black/50 mb-8">{items.length} items saved</p>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-black/40">Your wishlist is empty</p>
          <Link href="/collections" className="mt-4 btn btn-navy btn-md">Browse Watches</Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
