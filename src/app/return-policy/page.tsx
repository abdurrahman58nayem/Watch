export const metadata = { title: "Return Policy — TIMEORA" };

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="text-[28px] font-bold tracking-tight">Return Policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-black/70">
        <p>We want you to be satisfied with your TIMEORA watch. This is demo return policy for client presentation.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check product at delivery time</li>
          <li>Return if manufacturing defect found within 48 hours</li>
          <li>Product must be unused with original packaging</li>
          <li>Demo policy — real policy will be defined by client</li>
        </ul>
        <p className="text-xs text-black/40 mt-6">This is a demonstration website created by CodePixel Web.</p>
      </div>
    </div>
  );
}
