# TIMEORA — Premium Watch E-commerce Demo (Bangladesh)

**Brand:** TIMEORA — *Time. Style. Presence.*  
**Purpose:** Demo website for **CodePixel Web** agency to showcase a modern, premium, conversion-focused watch e-commerce experience for Bangladesh market.

> This is a **demo website**. No real payment, courier API, or backend order processing. Frontend experience is production-like.

## 🎯 Market Research Insights (Bangladesh)

Before development, researched Bangladeshi watch stores & marketplaces (Daraz, WatchShop BD, TickBD, Curren Bangladesh etc.):

- **COD is king:** Cash on Delivery across Bangladesh is primary trust factor
- **Price presentation:** Original price strikethrough + discount badge (e.g., 20% OFF) is expected
- **Trust strip:** COD, Fast Delivery, Quality Checked, Customer Support
- **Mobile-first:** 80%+ traffic from Facebook/Instagram ads, thumb-friendly CTAs, 2-column product grid
- **Simple checkout:** Name, mobile (01XXXXXXXXX), address, area, district — no complex forms
- **Delivery info:** Inside Dhaka ৳70, Outside Dhaka ৳130 clearly visible
- **Categories:** Men's, Women's, Couple, Smart, Casual, Premium
- **Filters:** Category, Price, Color, Strap, Movement, Availability
- **Product page:** Gallery (front/side/wrist/close-up/box), color selection, specs table, warranty, delivery

No design, logo, text, or imagery was copied — only UX patterns.

## 🛠 Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **React 19**
- Reusable components, centralized mock data, Vercel-ready
- No unnecessary dependencies

## 📦 Project Structure

```
src/
  lib/
    config.ts      — Brand, contact, delivery, social, WhatsApp
    products.ts    — 24 realistic products, categories, helpers
    utils.ts       — formatPrice, generateOrderId
  context/
    CartContext.tsx
    WishlistContext.tsx
  components/
    layout/ — AnnouncementBar, Header, Footer, MobileMenu, SearchModal, WhatsAppButton
    home/ — Hero, TrustStrip, CategoryGrid, FeaturedWatches, PremiumCollection, SocialProof, Newsletter
    product/ — ProductCard, ProductGrid, Filters, Gallery, Info, Specifications, Related
    cart/ — CartClient
    checkout/ — CheckoutClient
  app/
    page.tsx — Homepage
    mens, womens, couple, smart, casual, premium, sale, collections
    product/[slug]
    search, cart, checkout, order-success
    warranty, delivery, return-policy, contact, faq, wishlist, account
```

## 🎨 Visual Direction

- **Luxury + Modern + Minimal + Trustworthy**
- Colors: Deep Black #0A0A0A, Charcoal, White, Soft Gray #F8F8F6, Subtle Gold #C9A86A (limited)
- Avoid: excessive gold, gradients, gaming style, glassmorphism
- Typography: System sans, bold tracking for TIMEORA logo
- Animations: subtle fade, scale, smooth transitions

## 💰 Pricing (Realistic BD Market)

Range ৳2,000 – ৳10,000 with points: ৳2,290, ৳2,790, ৳3,490, ৳4,290, ৳5,490, ৳6,990, ৳8,490, ৳9,990 — original + discounted shown.

## 🛒 Key Flows

```
Homepage → Category → Search → Product (color select) → Add to Cart → Cart → Checkout (COD) → Order Success (#TMR-xxxxx)
```

- Search supports: Chronograph, Black Watch, Men's, Women's, Smart, Couple, Rose Gold etc.
- Cart persisted in localStorage
- Checkout validation for BD mobile (01XXXXXXXXX)
- Order ID generated client-side, saved to localStorage

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Framework: Next.js — no env vars needed
4. Deploy — optimized images via `next.config.ts` remotePatterns (unsplash, pravatar)

```bash
npm install
npm run build
npm run dev
```

Build succeeds offline (no Google Fonts fetch) — uses system fonts.

## 📱 Mobile First Checklist

- 2-column product grid, compact cards
- Sticky header, accessible cart
- Filter drawer, large CTAs, no horizontal scroll
- Thumb-friendly checkout
- Fast loading, Next.js Image, lazy loading

## 🔧 Configuration

Edit `src/lib/config.ts` to change:

- Brand name, tagline
- WhatsApp number, phone, email
- Delivery charges
- Social links
- Footer info

All product data in `src/lib/products.ts` — single source of truth.

## 📄 Demo Note

Footer includes subtle:

- **Demo Website by CodePixel Web**
- **This is a demonstration website created by CodePixel Web.**

Branding does not break shopping experience.

## ✅ Final Testing Done

- Homepage, Category, Search, Product, Color, Add to Cart, Cart, Checkout, Order Confirmation
- Mobile, Tablet, Desktop
- Navigation, WhatsApp, Filters, Console errors, TypeScript, Build

```bash
npm run build
# ✓ Compiled successfully
# 47 static pages
```

## 👨‍💻 Agency

**CodePixel Web** — Web Development Agency  
Demo for Bangladeshi watch business owners to envision their own professional e-commerce store.

**Goal:** Trust + Product Presentation + Mobile Shopping Experience + Easy Order + Bangladesh-focused UX
