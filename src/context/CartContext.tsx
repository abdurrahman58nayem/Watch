"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("timeora-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("timeora-cart", JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedColor === color);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedColor === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => (i.product.id === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
