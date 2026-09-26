import { siteConfig } from "./config";

export function formatPrice(price: number): string {
  return `${siteConfig.currency}${price.toLocaleString("en-BD")}`;
}

export function calculateDiscountPercent(original: number, current: number): number {
  if (original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateOrderId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `TMR-${num}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
