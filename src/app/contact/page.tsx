import { siteConfig } from "@/lib/config";

export const metadata = { title: "Contact — TIMEORA" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark">Get in touch</p>
      <h1 className="font-display text-[36px] font-semibold tracking-tight text-navy mt-2">Contact</h1>
      <p className="text-sm text-navy/50 mt-2">Demo contact page — real client contact will be configured.</p>

      <div className="mt-8 grid gap-4">
        <div className="p-6 rounded-2xl bg-white border border-gold/20">
          <p className="text-xs uppercase tracking-widest text-gold-dark font-semibold">WhatsApp</p>
          <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="text-[18px] font-semibold mt-2 inline-block text-navy hover:text-gold-dark">{siteConfig.contact.phone}</a>
          <p className="text-xs text-navy/40 mt-2">Fastest response • 10AM - 10PM</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-gold/20">
          <p className="text-xs uppercase tracking-widest text-gold-dark font-semibold">Email</p>
          <p className="text-[18px] font-semibold mt-2 text-navy">{siteConfig.contact.email}</p>
        </div>
        <div className="p-6 rounded-2xl bg-navy text-cream">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold">For Business Owners</p>
          <p className="text-sm mt-3 leading-6 text-cream/70">This demo website is created by CodePixel Web to showcase what we can build for your watch business in Bangladesh. Contact us via WhatsApp to discuss your project.</p>
          <a href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`} className="mt-4 btn btn-gold btn-md">Message on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
