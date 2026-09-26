"use client";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <section className="py-14 lg:py-20 bg-white border-t border-black/5">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="rounded-[24px] bg-[#0A0A0A] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-[420px]">
            <h3 className="text-[24px] lg:text-[28px] font-bold tracking-tight text-white">Stay Updated</h3>
            <p className="text-sm leading-6 text-white/60 mt-3">Get new collection and special offer updates. No spam, only premium watch drops and exclusive sale alerts.</p>
          </div>
          <form onSubmit={onSubmit} className="w-full lg:w-auto flex gap-3">
            <div className="flex-1 lg:w-[320px] relative">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 px-6 outline-none focus:border-white/20 focus:bg-white/15 transition-colors text-sm"
              />
            </div>
            <button type="submit" className="h-12 px-7 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap">
              {done ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>
        {done && <p className="mt-4 text-center text-sm text-emerald-600">Thanks! You&apos;re subscribed — demo only, no real email sent.</p>}
      </div>
    </section>
  );
}
