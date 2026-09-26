"use client";
import { useState } from "react";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square rounded-[24px] overflow-hidden bg-ivory border border-gold/20 cursor-zoom-in"
        onClick={() => setZoom(!zoom)}
      >
        <ProductImage src={images[active]} alt={name} fill className={`object-cover transition-transform duration-700 ${zoom ? "scale-150" : "scale-100"}`} priority sizes="(max-width: 1024px) 100vw, 50vw" />
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-navy/85 text-gold-light backdrop-blur text-[11px] font-medium">
          {active + 1} / {images.length}
        </div>
        <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-cream/90 backdrop-blur flex items-center justify-center border border-gold/30 text-navy">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="6" />
            <path d="M21 21l-3.5-3.5M11 8v6M8 11h6" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-gold" : "border-transparent hover:border-gold/40"}`}
          >
            <ProductImage src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="100px" />
          </button>
        ))}
      </div>
    </div>
  );
}
