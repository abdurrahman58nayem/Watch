import type { Metadata } from "next";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "TIMEORA — Premium Watches in Bangladesh",
  description: siteConfig.description,
  keywords: ["watch", "premium watch", "Bangladesh", "TIMEORA", "men's watch", "women's watch", "smart watch", "COD"],
  authors: [{ name: "CodePixel Web" }],
  openGraph: {
    title: "TIMEORA — Premium Watches in Bangladesh",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "TIMEORA Premium Watches",
      },
    ],
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TIMEORA — Premium Watches in Bangladesh",
    description: siteConfig.description,
    images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FCFCFA] font-sans">
        <WishlistProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
