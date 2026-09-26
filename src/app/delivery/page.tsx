export const metadata = { title: "Delivery — TIMEORA" };

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="text-[28px] font-bold tracking-tight">Delivery Information</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-black/70">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-black/5">
            <p className="text-xs uppercase tracking-widest text-black/40 font-medium">Inside Dhaka</p>
            <p className="text-[22px] font-bold mt-2">৳70</p>
            <p className="text-xs text-black/40 mt-2">2-3 days delivery • Cash on Delivery</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-black/5">
            <p className="text-xs uppercase tracking-widest text-black/40 font-medium">Outside Dhaka</p>
            <p className="text-[22px] font-bold mt-2">৳130</p>
            <p className="text-xs text-black/40 mt-2">3-5 days delivery • Cash on Delivery</p>
          </div>
        </div>
        <p>Delivery available across Bangladesh. All products are quality-checked before dispatch. You will receive order confirmation via phone call.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cash on Delivery available across Bangladesh</li>
          <li>Fast home delivery</li>
          <li>Quality checked before shipping</li>
          <li>Demo information — real courier integration in production</li>
        </ul>
      </div>
    </div>
  );
}
