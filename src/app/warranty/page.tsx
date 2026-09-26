export const metadata = { title: "Warranty — TIMEORA" };

export default function WarrantyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="text-[28px] font-bold tracking-tight">Warranty</h1>
      <div className="mt-8 prose prose-sm max-w-none text-black/70 leading-7">
        <p className="text-[15px] font-medium text-black">1 Year Machine Warranty</p>
        <p className="mt-4">All TIMEORA watches come with a 1-year machine warranty covering manufacturing defects in movement and internal mechanism. This is demo information and warranty terms may vary by product.</p>
        <ul className="mt-6 list-disc pl-5 space-y-2">
          <li>Warranty covers movement and internal defects</li>
          <li>Physical damage, water damage beyond rated resistance, and unauthorized repair not covered</li>
          <li>Keep your order ID and purchase proof for warranty claims</li>
          <li>Demo website — real warranty process will be defined by client</li>
        </ul>
        <p className="mt-6 text-xs text-black/40">This is a demonstration website created by CodePixel Web.</p>
      </div>
    </div>
  );
}
