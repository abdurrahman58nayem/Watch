export const metadata = { title: "Return Policy — TIMEORA" };

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark">Policy</p>
      <h1 className="font-display text-[36px] font-semibold tracking-tight text-navy mt-2">Return Policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-navy/70">
        <p>We want you to be satisfied with your TIMEORA watch. This is demo return policy for client presentation.</p>
        <div className="grid gap-3">
          {["Check product at delivery time", "Return if manufacturing defect found within 48 hours", "Product must be unused with original packaging", "Demo policy — real policy will be defined by client"].map(item => (
            <div key={item} className="p-4 rounded-xl bg-white border border-gold/20 flex gap-3">
              <span className="text-gold">✦</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-navy/40 mt-6">This is a demonstration website created by CodePixel Web.</p>
      </div>
    </div>
  );
}
