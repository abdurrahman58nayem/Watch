"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type WishlistContextType = {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("timeora-wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("timeora-wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
