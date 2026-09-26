"use client";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-[4/4] lg:aspect-[4/4] rounded-[20px] overflow-hidden bg-[#F8F8F6] border border-black/5 cursor-zoom-in"
        onClick={() => setZoom(!zoom)}
      >
        <Image src={images[active]} alt={name} fill className={`object-cover transition-transform duration-700 ${zoom ? "scale-150" : "scale-100"}`} priority sizes="(max-width: 1024px) 100vw, 50vw" />
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-medium border border-black/5">
          {active + 1} / {images.length}
        </div>
        <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center border border-black/5">
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
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-black" : "border-transparent hover:border-black/10"}`}
          >
            <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="100px" />
          </button>
        ))}
      </div>

      <div className="hidden lg:flex gap-2 text-[11px] text-black/40">
        <span>Front</span><span>•</span><span>Side</span><span>•</span><span>Wrist</span><span>•</span><span>Close-up</span><span>•</span><span>Packaging</span>
      </div>
    </div>
  );
}
