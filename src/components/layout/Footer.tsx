import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white mt-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="py-14 lg:py-20 grid grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="col-span-2 lg:col-span-4">
            <h3 className="text-[24px] font-black tracking-[0.18em]">TIMEORA</h3>
            <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-white/30 font-medium">Time. Style. Presence.</p>
            <p className="mt-6 text-sm leading-6 text-white/60 max-w-[320px]">
              Premium watches designed for everyday confidence, modern style and timeless presence. Bangladesh-focused, quality-checked, COD available.
            </p>
            <div className="mt-8 flex gap-3">
              <a href={siteConfig.social.facebook} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-xs font-medium">Fb</span>
              </a>
              <a href={siteConfig.social.instagram} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-xs font-medium">Ig</span>
              </a>
              <a href={siteConfig.social.tiktok} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-xs font-medium">Tk</span>
              </a>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-medium text-white/40 mb-5">Shop</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/mens" className="hover:text-white transition-colors">Men&apos;s Watches</Link></li>
              <li><Link href="/womens" className="hover:text-white transition-colors">Women&apos;s Watches</Link></li>
              <li><Link href="/couple" className="hover:text-white transition-colors">Couple Watches</Link></li>
              <li><Link href="/smart" className="hover:text-white transition-colors">Smart Watches</Link></li>
              <li><Link href="/casual" className="hover:text-white transition-colors">Casual Watches</Link></li>
              <li><Link href="/premium" className="hover:text-white transition-colors">Premium Collection</Link></li>
              <li><Link href="/sale" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-medium text-white/40 mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-4">
            <h4 className="text-xs uppercase tracking-widest font-medium text-white/40 mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex gap-3">
                <span className="text-white/30">WhatsApp</span>
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="hover:text-white transition-colors">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex gap-3">
                <span className="text-white/30">Email</span>
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/30">Location</span>
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
            <div className="mt-8 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-2">Delivery Info</p>
              <p className="text-sm text-white/70">Inside Dhaka: ৳70 • Outside Dhaka: ৳130 • Cash on Delivery available across Bangladesh.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p className="text-xs text-white/30">© {new Date().getFullYear()} TIMEORA. All rights reserved.</p>
            <span className="hidden sm:block w-px h-3 bg-white/10" />
            <p className="text-xs text-white/30">{siteConfig.footer.demoNote}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-widest uppercase text-white/20 font-medium">{siteConfig.footer.demoBy}</span>
            <span className="w-1 h-1 rounded-full bg-[#C9A86A]" />
            <span className="text-[11px] text-white/30">Built for Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
