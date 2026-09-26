import { siteConfig } from "@/lib/config";

export const metadata = { title: "Contact — TIMEORA" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="text-[28px] font-bold tracking-tight">Contact</h1>
      <p className="text-sm text-black/50 mt-2">Demo contact page — real client contact will be configured.</p>

      <div className="mt-8 grid gap-4">
        <div className="p-6 rounded-2xl bg-white border border-black/5">
          <p className="text-xs uppercase tracking-widest text-black/40 font-medium">WhatsApp</p>
          <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="text-[16px] font-medium mt-2 inline-block hover:underline">{siteConfig.contact.phone}</a>
          <p className="text-xs text-black/40 mt-2">Fastest response • 10AM - 10PM</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-black/5">
          <p className="text-xs uppercase tracking-widest text-black/40 font-medium">Email</p>
          <p className="text-[16px] font-medium mt-2">{siteConfig.contact.email}</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0A0A0A] text-white">
          <p className="text-xs uppercase tracking-widest text-white/40 font-medium">For Business Owners</p>
          <p className="text-sm mt-3 leading-6 text-white/70">This demo website is created by CodePixel Web to showcase what we can build for your watch business in Bangladesh. Contact us via WhatsApp to discuss your project.</p>
          <a href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`} className="mt-4 btn btn-gold btn-md">Message on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
