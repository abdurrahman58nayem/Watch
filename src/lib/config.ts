export const siteConfig = {
  name: "TIMEORA",
  tagline: "Time. Style. Presence.",
  description: "TIMEORA is a premium watch e-commerce demo website created by CodePixel Web for the Bangladesh market.",
  url: "https://timeora.vercel.app",
  brand: {
    name: "TIMEORA",
    logoText: "TIMEORA",
  },
  contact: {
    whatsapp: "8801700000000", // Demo number
    phone: "+880 1700-000000",
    email: "hello@timeora-demo.com",
    address: "Dhaka, Bangladesh",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
  },
  delivery: {
    insideDhaka: 70,
    outsideDhaka: 130,
    announcement: "Cash on Delivery Available Across Bangladesh",
    announcementAlt: "Fast Delivery Across Bangladesh",
  },
  warranty: {
    default: "1 Year Machine Warranty",
    note: "Warranty terms may vary by product.",
  },
  whatsappMessage: "আসসালামু আলাইকুম। আমি TIMEORA Watch Store Demo দেখে যোগাযোগ করছি। আমার Watch Business-এর জন্য এমন একটি Website তৈরি করতে চাই।",
  footer: {
    demoBy: "Demo Website by CodePixel Web",
    demoNote: "This is a demonstration website created by CodePixel Web.",
  },
  currency: "৳",
} as const;

export type SiteConfig = typeof siteConfig;
