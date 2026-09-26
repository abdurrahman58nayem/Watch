"use client";
import { siteConfig } from "@/lib/config";

export function WhatsAppButton() {
  const message = encodeURIComponent(siteConfig.whatsappMessage);
  const href = `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center justify-center hover:scale-105 transition-transform group"
      aria-label="Chat on WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[1px]">
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.78 9.78 0 0 0 4.76 1.22h.01c5.46 0 9.91-4.45 9.91-9.91a9.85 9.85 0 0 0-2.91-7.02zm-7.01 15.2h-.01a8.13 8.13 0 0 1-4.15-1.14l-.3-.18-3.13.82.83-3.05-.2-.31a8.22 8.22 0 0 1-1.27-4.34c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.82 2.41 8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.73-1.7-.81-.23-.09-.39-.12-.56.12-.17.25-.65.81-.8.97-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.12.17 1.75 2.68 4.25 3.76.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
      </svg>
      <span className="absolute right-[60px] top-1/2 -translate-y-1/2 bg-navy text-gold-light text-xs px-3 py-2 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
