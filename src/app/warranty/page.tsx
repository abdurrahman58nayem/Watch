export const metadata = { title: "Warranty — TIMEORA" };

export default function WarrantyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark">Assurance</p>
      <h1 className="font-display text-[36px] font-semibold tracking-tight text-navy mt-2">Warranty</h1>
      <div className="mt-8 text-navy/70 leading-7">
        <div className="p-6 rounded-2xl bg-navy text-cream mb-6">
          <p className="text-[11px] uppercase tracking-widest text-gold font-semibold">Coverage</p>
          <p className="font-display text-[28px] font-semibold mt-2">1 Year Machine Warranty</p>
        </div>
        <p>All TIMEORA watches come with a 1-year machine warranty covering manufacturing defects in movement and internal mechanism. This is demo information and warranty terms may vary by product.</p>
        <ul className="mt-6 space-y-2">
          {["Warranty covers movement and internal defects", "Physical damage, water damage beyond rated resistance, and unauthorized repair not covered", "Keep your order ID and purchase proof for warranty claims", "Demo website — real warranty process will be defined by client"].map(item => (
            <li key={item} className="flex gap-2"><span className="text-gold">✦</span>{item}</li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-navy/40">This is a demonstration website created by CodePixel Web.</p>
      </div>
    </div>
  );
}
