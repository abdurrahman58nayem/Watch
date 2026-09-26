export const metadata = { title: "Delivery — TIMEORA" };

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark">Shipping</p>
      <h1 className="font-display text-[36px] font-semibold tracking-tight text-navy mt-2">Delivery Information</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-navy/70">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-gold/20">
            <p className="text-xs uppercase tracking-widest text-gold-dark font-semibold">Inside Dhaka</p>
            <p className="font-display text-[32px] font-semibold mt-2 text-navy">৳70</p>
            <p className="text-xs text-navy/40 mt-2">2-3 days delivery • Cash on Delivery</p>
          </div>
          <div className="p-5 rounded-2xl bg-navy text-cream">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold">Outside Dhaka</p>
            <p className="font-display text-[32px] font-semibold mt-2">৳130</p>
            <p className="text-xs text-cream/50 mt-2">3-5 days delivery • Cash on Delivery</p>
          </div>
        </div>
        <p>Delivery available across Bangladesh. All products are quality-checked before dispatch. You will receive order confirmation via phone call.</p>
        <ul className="space-y-2">
          {["Cash on Delivery available across Bangladesh", "Fast home delivery", "Quality checked before shipping", "Demo information — real courier integration in production"].map(item => (
            <li key={item} className="flex gap-2"><span className="text-gold">✦</span>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
