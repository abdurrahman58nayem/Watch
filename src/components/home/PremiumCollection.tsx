import Image from "next/image";
import Link from "next/link";

export function PremiumCollection() {
  return (
    <section className="py-6 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden bg-[#0A0A0A] min-h-[480px] lg:min-h-[520px] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000&auto=format&fit=crop"
              alt="Signature Collection"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-8 lg:p-16 max-w-[560px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
              <span className="text-[11px] tracking-[0.14em] uppercase font-medium text-white/80">Premium Edition</span>
            </div>
            <h2 className="text-[32px] lg:text-[44px] font-bold leading-[0.95] tracking-tight text-white">
              The Signature
              <span className="block font-light text-white/60">Collection</span>
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-white/60">Designed for moments that matter. Automatic movement, sapphire-coated glass and 316L steel — crafted for collectors.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/premium" className="h-12 px-8 rounded-full bg-white text-black text-sm font-medium flex items-center hover:bg-white/90 transition-colors">
                Explore Collection
              </Link>
              <div className="h-12 px-5 rounded-full border border-white/15 bg-white/5 backdrop-blur text-white/70 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C9A86A] flex items-center justify-center text-black text-[10px] font-bold">✓</span>
                1 Year Warranty • COD • Fast Delivery
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 max-w-[380px]">
              <div>
                <p className="text-[22px] font-semibold text-white">316L</p>
                <p className="text-[11px] uppercase tracking-wide text-white/40 mt-1">Steel</p>
              </div>
              <div>
                <p className="text-[22px] font-semibold text-white">10 ATM</p>
                <p className="text-[11px] uppercase tracking-wide text-white/40 mt-1">Water Resistant</p>
              </div>
              <div>
                <p className="text-[22px] font-semibold text-white">Auto</p>
                <p className="text-[11px] uppercase tracking-wide text-white/40 mt-1">Movement</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 rounded-full bg-[#C9A86A] border-2 border-black" />
              <div className="w-6 h-6 rounded-full bg-white border-2 border-black" />
              <div className="w-6 h-6 rounded-full bg-black border-2 border-white/20" />
            </div>
            <span className="text-xs text-white/70">3 Finishes Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
