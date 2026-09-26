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
    <section className="py-14 lg:py-20 bg-cream">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="rounded-[28px] bg-navy p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute left-20 bottom-0 w-40 h-40 rounded-full bg-rose/10 blur-3xl" />
          <div className="max-w-[420px] relative">
            <h3 className="font-display text-[28px] lg:text-[34px] font-semibold tracking-tight text-cream">Stay in the circle</h3>
            <p className="text-sm leading-6 text-gold-light/80 mt-3">Get new collection drops and exclusive offers. No spam — only premium watch news.</p>
          </div>
          <form onSubmit={onSubmit} className="w-full lg:w-auto flex gap-3 relative">
            <div className="flex-1 lg:w-[320px] relative">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 rounded-full bg-white/10 border border-gold/30 text-cream placeholder:text-cream/35 px-6 outline-none focus:border-gold focus:bg-white/15 transition-colors text-sm"
              />
            </div>
            <button type="submit" className="btn btn-gold btn-md h-12 px-7">
              {done ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>
        {done && <p className="mt-4 text-center text-sm text-emerald">Thanks! You&apos;re subscribed — demo only, no real email sent.</p>}
      </div>
    </section>
  );
}
