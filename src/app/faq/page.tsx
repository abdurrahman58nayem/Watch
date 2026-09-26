export const metadata = { title: "FAQ — TIMEORA" };

const faqs = [
  { q: "Cash on Delivery আছে কি?", a: "হ্যাঁ, সারা বাংলাদেশে Cash on Delivery available। Product হাতে পেয়ে টাকা পরিশোধ করতে পারবেন।" },
  { q: "Delivery charge কত?", a: "Inside Dhaka ৳70, Outside Dhaka ৳130। Delivery available across Bangladesh." },
  { q: "Warranty আছে কি?", a: "হ্যাঁ, প্রতিটি watch-এ 1 Year Machine Warranty থাকে। Warranty terms may vary by product." },
  { q: "কিভাবে অর্ডার করব?", a: "Product select করুন → Add to Cart → Checkout-এ নাম, মোবাইল, ঠিকানা দিন → Cash on Delivery select করে অর্ডার নিশ্চিত করুন।" },
  { q: "Quality check করা হয় কি?", a: "হ্যাঁ, প্রতিটি পণ্য quality-checked করে পাঠানো হয়।" },
  { q: "এটি কি real store?", a: "না, এটি CodePixel Web-এর তৈরি একটি Demo Website, Bangladesh-এর watch business-এর জন্য আমরা কী ধরনের website বানাতে পারি তা দেখানোর জন্য।" },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="text-[28px] font-bold tracking-tight">FAQ</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-black/5">
            <p className="text-sm font-semibold">{f.q}</p>
            <p className="text-sm text-black/60 mt-2 leading-6">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
