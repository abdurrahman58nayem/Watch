import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";

export function PremiumCollection() {
  return (
    <section className="py-6 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="relative rounded-[24px] lg:rounded-[36px] overflow-hidden bg-navy min-h-[480px] lg:min-h-[540px] flex items-center">
          <div className="absolute inset-0">
            <ProductImage
              src="/watches/hero.jpg"
              alt="Signature Collection"
              fill
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/75 to-navy/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-8 lg:p-16 max-w-[560px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 backdrop-blur mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-gold-light">Premium Edition</span>
            </div>
            <h2 className="font-display text-[36px] lg:text-[52px] font-semibold leading-[0.95] tracking-tight text-cream">
              The Signature
              <span className="block italic font-normal text-gold">Collection</span>
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-cream/70">Designed for moments that matter. Automatic movement, sapphire-coated glass and 316L steel — crafted for collectors.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/premium" className="btn btn-gold btn-lg">
                Explore Collection
              </Link>
              <div className="h-[52px] px-5 rounded-full border border-gold/30 bg-white/5 backdrop-blur text-gold-light text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-navy text-[10px] font-bold">✓</span>
                1 Year Warranty • COD • Fast Delivery
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gold/20 pt-8 max-w-[380px]">
              <div>
                <p className="font-display text-[26px] font-semibold text-gold">316L</p>
                <p className="text-[11px] uppercase tracking-wide text-cream/40 mt-1">Steel</p>
              </div>
              <div>
                <p className="font-display text-[26px] font-semibold text-gold">10 ATM</p>
                <p className="text-[11px] uppercase tracking-wide text-cream/40 mt-1">Water Resistant</p>
              </div>
              <div>
                <p className="font-display text-[26px] font-semibold text-gold">Auto</p>
                <p className="text-[11px] uppercase tracking-wide text-cream/40 mt-1">Movement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
