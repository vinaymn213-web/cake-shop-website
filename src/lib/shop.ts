/**
 * Shared shop helpers. Safe for both client and server components
 * (no database imports in here).
 */

export type ShopConfig = {
  shopName: string;
  tagline: string;
  whatsappNumber: string;
  instagram: string;
  city: string;
  pickupNote: string;
  announcement: string;
  advanceDays: number;
};

export const DEFAULT_SHOP: ShopConfig = {
  shopName: "Vani's Heavenly Cakes",
  tagline: "Freshly Made with Love",
  whatsappNumber: "918660345846",
  instagram: "cake_delight_by_vani",
  city: "Davanagere, Karnataka",
  pickupNote:
    "Pickup only. Fresh desserts are prepared after order confirmation.",
  announcement:
    "100% Eggless Tiramisu & Premium Desserts • Freshly made after every order • Davanagere",
  advanceDays: 3,
};

export const CATEGORIES = [
  { key: "all", label: "All Desserts", emoji: "🍰" },
  { key: "tiramisu", label: "Tiramisu", emoji: "☕" },
  { key: "cakes", label: "Cakes & Tubs", emoji: "🎂" },
  { key: "brownies", label: "Brownies", emoji: "🍫" },
  { key: "healthy", label: "Healthy & Festive", emoji: "🌾" },
  { key: "custom", label: "Customised Cakes", emoji: "✨" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/** Turn "/images/x.jpg" into "https://site.com/images/x.jpg" for WhatsApp. */
export function absoluteUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function normalisePhone(phone: string): string {
  let digits = (phone || DEFAULT_SHOP.whatsappNumber).replace(/\D/g, "");
  // A plain 10-digit Indian number still needs the 91 country code for wa.me.
  if (digits.length === 10) digits = `91${digits}`;
  return digits;
}

/** The real WhatsApp deep link (used on the /wa launcher page). */
export function whatsappHref(phone: string, message: string): string {
  return `https://wa.me/${normalisePhone(phone)}?text=${encodeURIComponent(message)}`;
}

/**
 * Same-origin launcher link used by every button on the site.
 *
 * Why not link straight to wa.me?  WhatsApp sends `X-Frame-Options: DENY`, so
 * if the site is ever viewed inside an iframe (sandbox preview, Instagram
 * in-app browser, Notion embed…) the browser shows
 * "api.whatsapp.com refused to connect / ERR_BLOCKED_BY_RESPONSE".
 * `/wa` is our own page: it can never be blocked, and it forwards the visitor
 * to WhatsApp at the top level (or shows a QR + copy fallback).
 */
export function waLink(phone: string, message: string): string {
  const params = new URLSearchParams({
    to: normalisePhone(phone),
    text: message,
  });
  return `/wa?${params.toString()}`;
}

/** 918660345846 -> +91 86603 45846 */
export function prettyPhone(phone: string): string {
  const digits = (phone || DEFAULT_SHOP.whatsappNumber).replace(/\D/g, "");
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  const code = digits.length > 10 ? digits.slice(0, digits.length - 10) : "91";
  return `+${code} ${local.slice(0, 5)} ${local.slice(5)}`;
}

export type BookingPayload = {
  productId?: number;
  name: string;
  image: string;
  slug?: string;
  category?: string;
  unit: string;
  price: number;
  priceOnRequest?: boolean;
  quantity: number;
  customerName?: string;
  eventDate?: string;
  notes?: string;
};

/**
 * The message the customer sees pre-typed inside WhatsApp.
 *
 * 🎂 Hello Vani's Heavenly Cakes!
 *
 * I would like to book the following cake.
 *
 *  Cake Name: Chocolate Truffle
 *  Price: ₹799
 *  Weight: 1 KG
 *  Cake Image: https://…
 *
 * Please let me know the availability.
 *
 * Thank you! 🙏
 */
export function buildBookingMessage(
  item: BookingPayload,
  config: ShopConfig = DEFAULT_SHOP,
): string {
  const total = item.price * item.quantity;
  const lines: string[] = [];

  lines.push(`🎂 Hello ${config.shopName}!`);
  lines.push("");
  lines.push("I would like to book the following cake.");
  lines.push("");
  lines.push(`🍰 Cake Name: ${item.name}`);

  if (item.priceOnRequest || item.price <= 0) {
    lines.push("💰 Price: On Request (please share a quote)");
  } else {
    lines.push(`💰 Price: ${formatINR(item.price)}`);
  }

  lines.push(`⚖️ Weight: ${item.unit}`);

  if (item.quantity > 1) {
    lines.push(`🔢 Quantity: ${item.quantity}`);
    if (!item.priceOnRequest && item.price > 0) {
      lines.push(`🧾 Total Amount: ${formatINR(total)}`);
    }
  }

  const photo = absoluteUrl(item.image);
  if (photo) lines.push(`🖼️ Cake Image: ${photo}`);

  if (item.customerName) lines.push(`🙋 Name: ${item.customerName}`);
  if (item.eventDate) lines.push(`📅 Needed On: ${item.eventDate}`);
  if (item.notes) lines.push(`📝 Note: ${item.notes}`);

  lines.push("");
  lines.push("Please let me know the availability.");
  lines.push("");
  lines.push("Thank you! 💛");

  return lines.join("\n");
}

export type QuotePayload = {
  customerName: string;
  customerPhone: string;
  occasion: string;
  servings: string;
  flavor: string;
  theme: string;
  eventDate: string;
  notes: string;
};

/** Message used by the "Customised Cake / Price Quote" form. */
export function buildQuoteMessage(
  q: QuotePayload,
  config: ShopConfig = DEFAULT_SHOP,
): string {
  const lines: string[] = [];
  lines.push(`🎂 Hello ${config.shopName}!`);
  lines.push("");
  lines.push("I would like to book a customised cake.");
  lines.push("");
  if (q.customerName) lines.push(`🙋 Name: ${q.customerName}`);
  if (q.customerPhone) lines.push(`📞 Phone: ${q.customerPhone}`);
  if (q.occasion) lines.push(`🎉 Occasion: ${q.occasion}`);
  if (q.servings) lines.push(`⚖️ Servings / Weight: ${q.servings}`);
  if (q.flavor) lines.push(`🍫 Preferred Flavour: ${q.flavor}`);
  if (q.theme) lines.push(`🎨 Theme / Reference: ${q.theme}`);
  if (q.eventDate) lines.push(`📅 Delivery / Pickup Date: ${q.eventDate}`);
  if (q.notes) lines.push(`📝 Note: ${q.notes}`);
  lines.push("");
  lines.push("Please let me know the price and availability.");
  lines.push("");
  lines.push("Thank you! 💛");
  return lines.join("\n");
}
