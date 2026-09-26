"use client";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

type Props = {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
};

export function MobileMenu({ open, onClose, links }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[86%] max-w-[360px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[64px] border-b border-black/5">
          <span className="font-logo text-[18px] font-bold tracking-[0.2em] text-navy">TIMEORA</span>
          <button onClick={onClose} className="p-2 -mr-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-auto py-6 px-6">
          <div className="space-y-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 text-[15px] font-medium text-black/80 border-b border-black/[0.04] last:border-0"
              >
                {l.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/20">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-[#F8F8F6] rounded-xl">
              <p className="text-xs uppercase tracking-widest text-black/40 font-medium mb-2">Need Help?</p>
              <p className="text-sm text-black/70">Cash on Delivery available across Bangladesh. Fast home delivery.</p>
              <div className="mt-3 flex gap-2">
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="btn btn-navy btn-sm">WhatsApp</a>
                <Link href="/contact" onClick={onClose} className="btn btn-outline btn-sm">Contact</Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="p-6 border-t border-black/5">
          <p className="text-[11px] text-black/30 leading-relaxed">{siteConfig.footer.demoNote}</p>
          <p className="mt-2 text-[11px] font-medium tracking-widest uppercase text-black/40">{siteConfig.footer.demoBy}</p>
        </div>
      </div>
    </div>
  );
}
