import { siteConfig } from "@/lib/config";

export function AnnouncementBar() {
  return (
    <div className="w-full bg-[#0A0A0A] text-white text-[11px] sm:text-xs tracking-[0.12em] uppercase font-medium">
      <div className="mx-auto max-w-[1400px] px-4 py-2.5 flex items-center justify-center gap-6">
        <span className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A86A] animate-pulse" />
          {siteConfig.delivery.announcement}
        </span>
        <span className="hidden sm:inline-flex items-center gap-2 text-white/60">
          <span className="w-px h-3 bg-white/20" />
          Fast Delivery Across Bangladesh
        </span>
      </div>
    </div>
  );
}
