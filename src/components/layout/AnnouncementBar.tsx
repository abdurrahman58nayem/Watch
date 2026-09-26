import { siteConfig } from "@/lib/config";

export function AnnouncementBar() {
  const items = [
    siteConfig.delivery.announcement,
    "Fast Delivery Across Bangladesh",
    "Inside Dhaka ৳70 • Outside ৳130",
    "1 Year Machine Warranty",
    "New Collection 2026",
  ];

  return (
    <div className="w-full bg-navy text-gold-light text-[11px] sm:text-xs tracking-[0.14em] uppercase font-medium overflow-hidden">
      <div className="marquee-track py-2.5">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-6">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold pulse-gold" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
