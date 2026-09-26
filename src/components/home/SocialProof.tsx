import Image from "next/image";

const reviews = [
  {
    name: "Arif H.",
    location: "Dhaka",
    text: "Designটা খুব সুন্দর, আর watch-এর finishing expected-এর চেয়েও ভালো। COD-এ নিয়েছি, delivery fast ছিল।",
    rating: 5,
    product: "Executive Steel Chronograph",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sadia R.",
    location: "Chittagong",
    text: "Elegant Rose Gold টা gift হিসেবে নিয়েছিলাম, quality premium লাগছে। Packaging ও সুন্দর ছিল।",
    rating: 5,
    product: "Elegant Rose Gold",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Tanvir M.",
    location: "Sylhet",
    text: "Smart X1 budget-এর মধ্যে best। Battery backup ভালো, notification ঠিকঠাক আসে। Recommended!",
    rating: 4,
    product: "TIMEORA Smart X1",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
];

export function SocialProof() {
  return (
    <section className="py-14 lg:py-20 bg-[#F8F8F6]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="text-center max-w-[560px] mx-auto mb-10">
          <h2 className="text-[28px] lg:text-[36px] font-bold tracking-tight text-black">Loved by Watch Enthusiasts</h2>
          <p className="text-sm text-black/50 mt-3">Real experiences from customers across Bangladesh — demo reviews for presentation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-[20px] p-6 border border-black/[0.06] hover:border-black/10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-[#F0EEEA]">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{r.name}</p>
                  <p className="text-xs text-black/40">{r.location} • {r.product}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg key={idx} width="12" height="12" viewBox="0 0 24 24" fill={idx < r.rating ? "#0A0A0A" : "none"} stroke="#0A0A0A" strokeWidth="1.2">
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17l-6.4 4.2 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-6 text-black/70">“{r.text}”</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8F8F6] border border-black/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-black/50">Verified Purchase — Demo</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-center border-t border-black/5 pt-10">
          <div>
            <p className="text-[28px] font-bold text-black">2,400+</p>
            <p className="text-xs uppercase tracking-widest text-black/40 mt-1">Happy Customers</p>
          </div>
          <div className="w-px h-12 bg-black/5 hidden sm:block" />
          <div>
            <p className="text-[28px] font-bold text-black">4.8/5</p>
            <p className="text-xs uppercase tracking-widest text-black/40 mt-1">Average Rating</p>
          </div>
          <div className="w-px h-12 bg-black/5 hidden sm:block" />
          <div>
            <p className="text-[28px] font-bold text-black">64+</p>
            <p className="text-xs uppercase tracking-widest text-black/40 mt-1">Districts Delivered</p>
          </div>
        </div>
      </div>
    </section>
  );
}
