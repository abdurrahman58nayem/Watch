"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchModal } from "./SearchModal";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/mens", label: "Men's" },
  { href: "/womens", label: "Women's" },
  { href: "/couple", label: "Couple" },
  { href: "/smart", label: "Smart" },
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
      <header className="sticky top-0 z-40 w-full bg-cream/90 backdrop-blur-xl border-b border-gold/20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] sm:h-[76px] items-center justify-between">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-navy"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shadow-[0_4px_12px_rgba(14,22,48,0.25)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gold">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-logo text-[20px] sm:text-[24px] font-bold tracking-[0.22em] text-navy">TIMEORA</span>
              <span className="hidden sm:inline-block w-px h-5 bg-gold/40 ml-0.5" />
              <span className="hidden sm:inline-block text-[10px] tracking-[0.22em] uppercase text-gold-dark font-semibold mt-1">Premium</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[13px] tracking-[0.12em] font-medium uppercase transition-colors ${
                    link.label === "Sale" ? "text-burgundy hover:text-rose" : "text-navy/70 hover:text-navy"
                  } after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-gold hover:after:w-full after:transition-all`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-navy/70 hover:text-navy hover:bg-gold/15 rounded-full transition-colors"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M21 21l-3.5-3.5" />
                </svg>
              </button>

              <Link
                href="/wishlist"
                className="relative p-2.5 text-navy/70 hover:text-rose hover:bg-blush rounded-full transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21s-6.5-4.35-9-8.5A5 5 0 0 1 12 7a5 5 0 0 1 9 5.5c-2.5 4.15-9 8.5-9 8.5z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose text-white text-[10px] flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 text-navy/70 hover:text-navy hover:bg-gold/15 rounded-full transition-colors"
                aria-label="Cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6h15l-1.5 9h-13z" />
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                  <path d="M6 6L5 2H2" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-gold text-navy text-[10px] flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hidden sm:flex p-2.5 text-navy/70 hover:text-navy hover:bg-gold/15 rounded-full transition-colors"
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
