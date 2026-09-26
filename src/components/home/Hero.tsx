import Link from "next/link";
import { heroImage } from "@/lib/products";
import { ProductImage } from "@/components/product/ProductImage";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-ivory via-cream to-blush overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-rose/10 blur-3xl" />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-0 items-center min-h-[580px] lg:min-h-[680px] py-12 lg:py-0">
          <div className="lg:col-span-6 lg:pr-12 order-2 lg:order-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy text-gold-light border border-gold/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold pulse-gold" />
              <span className="text-[11px] tracking-[0.18em] uppercase font-semibold">New Collection 2026</span>
            </div>
            <h1 className="font-logo text-[42px] sm:text-[56px] lg:text-[68px] font-bold tracking-[0.16em] leading-[0.95] text-navy">
              TIMEORA
            </h1>
            <p className="font-display italic text-[22px] sm:text-[28px] text-gold-dark mt-3 leading-tight">
              Time that defines your style
            </p>
            <p className="mt-6 text-[15px] sm:text-[16px] leading-7 text-navy/65 max-w-[460px]">
              Discover 36 premium watches designed for everyday confidence. Gold finishing, quality-checked, Cash on Delivery across Bangladesh.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/mens" className="btn btn-navy btn-lg">
                Shop Men
              </Link>
              <Link href="/womens" className="btn btn-gold btn-lg">
                Shop Women
              </Link>
              <Link href="/collections" className="btn btn-outline btn-lg">
                All Watches
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="font-display text-[28px] font-semibold text-navy leading-none">36+</p>
                <p className="text-[11px] uppercase tracking-widest text-navy/45 mt-1">Designs</p>
              </div>
              <div className="w-px h-10 bg-gold/40" />
              <div>
                <p className="font-display text-[28px] font-semibold text-navy leading-none">4.8</p>
                <p className="text-[11px] uppercase tracking-widest text-navy/45 mt-1">Rating</p>
              </div>
              <div className="w-px h-10 bg-gold/40" />
              <div>
                <p className="font-display text-[28px] font-semibold text-navy leading-none">COD</p>
                <p className="text-[11px] uppercase tracking-widest text-navy/45 mt-1">All Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative aspect-[4/3] lg:aspect-[4/3.1] rounded-[28px] overflow-hidden bg-navy lg:rounded-none lg:rounded-l-[40px] shadow-[0_30px_80px_rgba(14,22,48,0.22)]">
              <ProductImage src={heroImage} alt="TIMEORA Premium Watch" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-auto flex gap-3">
                <div className="bg-cream/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gold/30">
                  <p className="text-[11px] uppercase tracking-widest text-gold-dark font-semibold">Starting From</p>
                  <p className="font-display text-[26px] font-semibold text-navy mt-0.5">৳2,290</p>
                  <p className="text-[11px] text-emerald mt-0.5 font-medium">COD Available</p>
                </div>
                <div className="hidden sm:flex bg-navy text-gold-light rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-gold/20">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-gold font-semibold">Delivery</p>
                    <p className="text-[13px] font-medium mt-1 leading-tight text-cream">Across Bangladesh<br />৳70 Inside Dhaka</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gold/25 blur-2xl hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
