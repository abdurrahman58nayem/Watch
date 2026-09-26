"use client";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductImage } from "./ProductImage";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    addToCart(product, 1, product.colors[0]?.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group relative bg-white rounded-[22px] border border-navy/8 overflow-hidden card-lift flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-ivory overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-gradient-to-r from-burgundy to-rose text-white text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-sm w-fit">
              {discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-navy text-gold-light text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full w-fit">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-gold text-navy text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full w-fit">
              BEST
            </span>
          )}
        </div>

        <button
          onClick={e => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${inWishlist ? "bg-rose text-white" : "bg-white/85 text-navy/60 hover:bg-white hover:text-rose"}`}
          aria-label="Wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21s-6.5-4.35-9-8.5A5 5 0 0 1 12 7a5 5 0 0 1 9 5.5c-2.5 4.15-9 8.5-9 8.5z" />
          </svg>
        </button>

        {product.stock <= 8 && product.stock > 0 && (
          <span className="absolute bottom-3 left-3 bg-white/92 backdrop-blur text-[11px] font-medium px-2.5 py-1 rounded-full border border-gold/30 text-burgundy">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-navy text-white text-[11px] font-medium px-2.5 py-1 rounded-full">Out of Stock</span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          {product.colors.slice(0, 4).map(c => (
            <span key={c.name} title={c.name} className="w-3 h-3 rounded-full border border-navy/10" style={{ backgroundColor: c.hex }} />
          ))}
        </div>

        <Link href={`/product/${product.slug}`} className="flex-1">
          <h3 className="font-display text-[17px] font-semibold leading-[1.25] text-navy line-clamp-2 group-hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "#C9A24A" : "none"} stroke="#C9A24A" strokeWidth="1.2">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17l-6.4 4.2 2.4-7.2-6-4.8h7.6z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-navy/40">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[17px] font-semibold tracking-tight text-navy">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[12px] line-through text-navy/30">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button onClick={onAdd} className="btn btn-outline btn-sm h-10">
            {added ? "Added ✓" : "Add to Cart"}
          </button>
          <Link href={`/product/${product.slug}`} className="btn btn-navy btn-sm h-10">
            Buy Now
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-navy/45">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
          {product.stock > 0 ? "In Stock" : "Out of Stock"} • COD
        </div>
      </div>
    </div>
  );
}
