"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/**
 * স্টোরের ক্রোম (হেডার/ফুটার)। /video রুটে এগুলো দেখানো হয় না —
 * ভিডিওটি পুরো স্ক্রিন জুড়ে চলবে, কোনো স্টোর UI ছাড়াই।
 */
export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVideo = pathname?.startsWith("/video");
  if (isVideo) return <>{children}</>;
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
