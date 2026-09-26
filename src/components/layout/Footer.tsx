import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-cream mt-16">
      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="py-14 lg:py-20 grid grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-navy">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="font-logo text-[22px] font-bold tracking-[0.2em] text-cream">TIMEORA</h3>
            </div>
            <p className="mt-1 text-[11px] tracking-[0.22em] uppercase text-gold font-medium">Time. Style. Presence.</p>
            <p className="mt-6 text-sm leading-6 text-cream/60 max-w-[320px]">
              Premium watches designed for everyday confidence, modern style and timeless presence. Bangladesh-focused, quality-checked, COD available.
            </p>
            <div className="mt-8 flex gap-3">
              {["Fb", "Ig", "Tk"].map(s => (
                <a key={s} href={siteConfig.social.facebook} className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center hover:bg-gold hover:text-navy transition-colors text-xs font-semibold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold mb-5">Shop</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li><Link href="/mens" className="hover:text-gold transition-colors">Men&apos;s Watches</Link></li>
              <li><Link href="/womens" className="hover:text-gold transition-colors">Women&apos;s Watches</Link></li>
              <li><Link href="/couple" className="hover:text-gold transition-colors">Couple Watches</Link></li>
              <li><Link href="/smart" className="hover:text-gold transition-colors">Smart Watches</Link></li>
              <li><Link href="/casual" className="hover:text-gold transition-colors">Casual Watches</Link></li>
              <li><Link href="/premium" className="hover:text-gold transition-colors">Premium Collection</Link></li>
              <li><Link href="/sale" className="hover:text-rose transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              <li><Link href="/delivery" className="hover:text-gold transition-colors">Delivery</Link></li>
              <li><Link href="/warranty" className="hover:text-gold transition-colors">Warranty</Link></li>
              <li><Link href="/return-policy" className="hover:text-gold transition-colors">Return Policy</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li className="flex gap-3">
                <span className="text-gold/70">WhatsApp</span>
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="hover:text-gold transition-colors">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex gap-3">
                <span className="text-gold/70">Email</span>
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold/70">Location</span>
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
            <div className="mt-8 p-4 rounded-xl bg-gold/10 border border-gold/20">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Delivery Info</p>
              <p className="text-sm text-cream/70">Inside Dhaka: ৳70 • Outside Dhaka: ৳130 • Cash on Delivery available across Bangladesh.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/15 py-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p className="text-xs text-cream/40">© {new Date().getFullYear()} TIMEORA. All rights reserved.</p>
            <span className="hidden sm:block w-px h-3 bg-gold/20" />
            <p className="text-xs text-cream/40">{siteConfig.footer.demoNote}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-widest uppercase text-gold/50 font-medium">{siteConfig.footer.demoBy}</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span className="text-[11px] text-cream/40">Built for Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
