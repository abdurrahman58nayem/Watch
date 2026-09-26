import Image from "next/image";
import Link from "next/link";
import { heroImage } from "@/lib/products";

export function Hero() {
  return (
    <section className="relative bg-[#F8F8F6] overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-0 items-center min-h-[560px] lg:min-h-[640px] py-12 lg:py-0">
          {/* Text */}
          <div className="lg:col-span-6 lg:pr-12 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
              <span className="text-[11px] tracking-[0.14em] uppercase font-medium text-black/60">New Collection 2026</span>
            </div>
            <h1 className="text-[40px] sm:text-[54px] lg:text-[64px] font-black tracking-[-0.02em] leading-[0.9] text-black">
              TIMEORA
              <span className="block text-[18px] sm:text-[22px] font-light tracking-[0.08em] mt-3 text-black/60">Time That Defines Your Style</span>
            </h1>
            <p className="mt-6 text-[15px] sm:text-[16px] leading-7 text-black/60 max-w-[440px]">
              Discover watches designed for everyday confidence, modern style and timeless presence. Premium finishing, quality-checked, COD across Bangladesh.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/mens" className="h-12 px-8 rounded-full bg-[#0A0A0A] text-white text-sm font-medium tracking-wide flex items-center justify-center hover:bg-black/90 transition-colors">
                SHOP MEN
              </Link>
              <Link href="/womens" className="h-12 px-8 rounded-full border border-black/15 bg-white text-black text-sm font-medium tracking-wide flex items-center justify-center hover:border-black/25 hover:bg-black/[0.02] transition-colors">
                SHOP WOMEN
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-[#E8E6E1] overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="customer" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#0A0A0A" className="opacity-80">
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17l-6.4 4.2 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-black/50 mt-1">Loved by 2,400+ customers in Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative aspect-[4/3] lg:aspect-[4/3.2] rounded-[28px] overflow-hidden bg-[#EDEBE6] lg:rounded-none lg:rounded-l-[32px]">
              <Image src={heroImage} alt="TIMEORA Premium Watch" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
              {/* Floating cards */}
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-auto flex gap-3">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20">
                  <p className="text-[11px] uppercase tracking-widest text-black/40 font-medium">Starting From</p>
                  <p className="text-[18px] font-semibold text-black mt-1">৳2,290</p>
                  <p className="text-[11px] text-black/40 mt-0.5">COD Available</p>
                </div>
                <div className="hidden sm:flex bg-[#0A0A0A] text-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-white/40 font-medium">Delivery</p>
                    <p className="text-[13px] font-medium mt-1 leading-tight">Across Bangladesh<br />৳70 Inside Dhaka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#C9A86A]/10 blur-2xl hidden lg:block" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-black/[0.04] blur-2xl hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
