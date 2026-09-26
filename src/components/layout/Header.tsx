"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchModal } from "./SearchModal";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/mens", label: "Men's Watches" },
  { href: "/womens", label: "Women's Watches" },
  { href: "/couple", label: "Couple" },
  { href: "/smart", label: "Smart Watches" },
  { href: "/collections", label: "Collections" },
  { href: "/sale", label: "Sale" },
];

export function Header() {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] sm:h-[72px] items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-black"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[22px] sm:text-[26px] font-black tracking-[0.18em] text-black">TIMEORA</span>
              <span className="hidden sm:inline-block w-px h-5 bg-black/10 ml-1" />
              <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] uppercase text-black/40 font-medium mt-1">Premium</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] tracking-wide font-medium text-black/70 hover:text-black transition-colors uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-black/70 hover:text-black hover:bg-black/[0.04] rounded-full transition-colors"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M21 21l-3.5-3.5" />
                </svg>
              </button>

              <Link
                href="/wishlist"
                className="relative p-2.5 text-black/70 hover:text-black hover:bg-black/[0.04] rounded-full transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21s-6.5-4.35-9-8.5A5 5 0 0 1 12 7a5 5 0 0 1 9 5.5c-2.5 4.15-9 8.5-9 8.5z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 text-black/70 hover:text-black hover:bg-black/[0.04] rounded-full transition-colors"
                aria-label="Cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6h15l-1.5 9h-13z" />
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                  <path d="M6 6L5 2H2" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#0A0A0A] text-white text-[10px] flex items-center justify-center rounded-full font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hidden sm:flex p-2.5 text-black/70 hover:text-black hover:bg-black/[0.04] rounded-full transition-colors"
                aria-label="Account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </>
  );
}
