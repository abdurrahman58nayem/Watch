export function TrustStrip() {
  const items = [
    { title: "Cash on Delivery", desc: "সারা বাংলাদেশে", color: "bg-emerald/15 text-emerald" },
    { title: "Fast Delivery", desc: "দেশজুড়ে Home Delivery", color: "bg-gold/20 text-gold-dark" },
    { title: "Quality Checked", desc: "প্রতিটি পণ্য যাচাই করে পাঠানো", color: "bg-navy/10 text-navy" },
    { title: "Customer Support", desc: "সহজে যোগাযোগ করুন", color: "bg-rose/15 text-rose" },
  ];

  return (
    <section className="border-y border-gold/20 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gold/15 divide-y lg:divide-y-0">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 p-5 lg:p-7">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {idx === 0 && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
                  {idx === 1 && <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />}
                  {idx === 2 && <><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>}
                  {idx === 3 && <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold tracking-wide text-navy">{item.title}</h4>
                <p className="text-[12px] text-navy/50 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
