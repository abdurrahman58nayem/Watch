const reviews = [
  {
    name: "Arif H.",
    location: "Dhaka",
    text: "Designটা খুব সুন্দর, আর watch-এর finishing expected-এর চেয়েও ভালো। COD-এ নিয়েছি, delivery fast ছিল।",
    rating: 5,
    product: "Executive Steel Chronograph",
    initial: "A",
    color: "bg-navy text-gold",
  },
  {
    name: "Sadia R.",
    location: "Chittagong",
    text: "Elegant Rose Gold টা gift হিসেবে নিয়েছিলাম, quality premium লাগছে। Packaging ও সুন্দর ছিল।",
    rating: 5,
    product: "Elegant Rose Gold",
    initial: "S",
    color: "bg-rose text-white",
  },
  {
    name: "Tanvir M.",
    location: "Sylhet",
    text: "Smart X1 budget-এর মধ্যে best। Battery backup ভালো, notification ঠিকঠাক আসে। Recommended!",
    rating: 4,
    product: "TIMEORA Smart X1",
    initial: "T",
    color: "bg-emerald text-white",
  },
];

export function SocialProof() {
  return (
    <section className="py-14 lg:py-20 bg-ivory">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="text-center max-w-[560px] mx-auto mb-10">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-dark mb-2">Reviews</p>
          <h2 className="font-display text-[32px] lg:text-[42px] font-semibold tracking-tight text-navy">Loved by Watch Enthusiasts</h2>
          <p className="text-sm text-navy/50 mt-3">Real experiences from customers across Bangladesh — demo reviews for presentation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-[22px] p-6 border border-gold/20 card-lift">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-display text-lg font-semibold ${r.color}`}>
                  {r.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{r.name}</p>
                  <p className="text-xs text-navy/40">{r.location} • {r.product}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg key={idx} width="12" height="12" viewBox="0 0 24 24" fill={idx < r.rating ? "#C9A24A" : "none"} stroke="#C9A24A" strokeWidth="1.2">
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17l-6.4 4.2 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-6 text-navy/70">“{r.text}”</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald/10 border border-emerald/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                <span className="text-[11px] text-emerald font-medium">Verified Purchase — Demo</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-center border-t border-gold/20 pt-10">
          <div>
            <p className="font-display text-[34px] font-semibold text-navy">2,400+</p>
            <p className="text-xs uppercase tracking-widest text-navy/40 mt-1">Happy Customers</p>
          </div>
          <div className="w-px h-12 bg-gold/30 hidden sm:block" />
          <div>
            <p className="font-display text-[34px] font-semibold text-navy">4.8/5</p>
            <p className="text-xs uppercase tracking-widest text-navy/40 mt-1">Average Rating</p>
          </div>
          <div className="w-px h-12 bg-gold/30 hidden sm:block" />
          <div>
            <p className="font-display text-[34px] font-semibold text-navy">64+</p>
            <p className="text-xs uppercase tracking-widest text-navy/40 mt-1">Districts Delivered</p>
          </div>
        </div>
      </div>
    </section>
  );
}
