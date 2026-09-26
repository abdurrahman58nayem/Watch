"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="group relative bg-white rounded-[18px] border border-black/[0.06] overflow-hidden hover:border-black/10 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/4] bg-[#F8F8F6] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={e => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${inWishlist ? "bg-black text-white" : "bg-white/80 text-black/60 hover:bg-white hover:text-black"}`}
          aria-label="Wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21s-6.5-4.35-9-8.5A5 5 0 0 1 12 7a5 5 0 0 1 9 5.5c-2.5 4.15-9 8.5-9 8.5z" />
          </svg>
        </button>
        {product.stock <= 8 && product.stock > 0 && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-[11px] font-medium px-2.5 py-1 rounded-full border border-black/5">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-black text-white text-[11px] font-medium px-2.5 py-1 rounded-full">Out of Stock</span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.slug}`} className="flex-1">
            <h3 className="text-[14px] font-medium leading-[1.35] text-black line-clamp-2 group-hover:text-black/80 transition-colors">{product.name}</h3>
          </Link>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "#0A0A0A" : "none"} stroke="#0A0A0A" strokeWidth="1.2" className="opacity-80">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17l-6.4 4.2 2.4-7.2-6-4.8h7.6z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-black/40">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[16px] font-semibold tracking-tight text-black">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[12px] line-through text-black/30">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product, 1, product.colors[0]?.name)}
            className="h-9 rounded-full border border-black/10 text-[12px] font-medium tracking-wide hover:bg-black hover:text-white hover:border-black transition-colors"
          >
            Add to Cart
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="h-9 rounded-full bg-[#0A0A0A] text-white text-[12px] font-medium tracking-wide flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            Buy Now
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-black/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {product.stock > 0 ? "In Stock" : "Out of Stock"} • {product.warranty}
        </div>
      </div>
    </div>
  );
}
