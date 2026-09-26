import { Product } from "@/lib/products";

export function Specifications({ product }: { product: Product }) {
  const specs = [
    { label: "Movement", value: product.movement },
    { label: "Case Material", value: product.caseMaterial },
    { label: "Strap", value: product.strap },
    { label: "Dial Color", value: product.dialColor },
    { label: "Case Size", value: product.caseSize },
    { label: "Strap Size", value: product.strapSize },
    { label: "Water Resistance", value: product.waterResistance },
    { label: "Warranty", value: product.warranty },
    { label: "SKU", value: product.sku },
  ];

  return (
    <div className="mt-12">
      <h3 className="text-[18px] font-semibold tracking-tight mb-6">Product Specifications</h3>
      <div className="rounded-2xl border border-black/5 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {specs.map((s, i) => (
            <div key={s.label} className={`flex justify-between p-4 text-sm border-b border-black/5 sm:border-r ${i % 2 === 1 ? "sm:border-r-0" : ""} ${i >= specs.length - 2 ? "border-b-0 sm:border-b-0" : ""} bg-white even:bg-[#FCFCFA]`}>
              <span className="text-black/40">{s.label}</span>
              <span className="font-medium text-black text-right">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-medium mb-3">Description</h4>
        <p className="text-sm leading-7 text-black/60">{product.description}</p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-2">
          {product.features.map(f => (
            <li key={f} className="flex items-center gap-2 text-sm text-black/60">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#F8F8F6] border border-black/5">
          <p className="text-xs uppercase tracking-widest text-black/40 font-medium">Delivery</p>
          <p className="text-sm font-medium mt-2">Inside Dhaka: ৳70<br />Outside Dhaka: ৳130</p>
          <p className="text-xs text-black/40 mt-2">Delivery available across Bangladesh.</p>
        </div>
        <div className="p-4 rounded-xl bg-[#F8F8F6] border border-black/5">
          <p className="text-xs uppercase tracking-widest text-black/40 font-medium">Payment</p>
          <p className="text-sm font-medium mt-2">Cash on Delivery</p>
          <p className="text-xs text-black/40 mt-2">Pay when your order is delivered.</p>
        </div>
        <div className="p-4 rounded-xl bg-[#F8F8F6] border border-black/5">
          <p className="text-xs uppercase tracking-widest text-black/40 font-medium">Warranty</p>
          <p className="text-sm font-medium mt-2">{product.warranty}</p>
          <p className="text-xs text-black/40 mt-2">Warranty terms may vary by product.</p>
        </div>
      </div>
    </div>
  );
}
