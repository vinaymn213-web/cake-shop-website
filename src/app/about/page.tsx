/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WhatsAppFloat from "@/components/whatsapp-float";
import { getShopConfig } from "@/lib/data";
import { waLink } from "@/lib/shop";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Story | Vani's Heavenly Cakes",
  description:
    "Why customers love Vani's Heavenly Cakes — freshly prepared eggless desserts made with premium ingredients in Davanagere.",
};

const WHY = [
  ["🧁", "Freshly prepared", "Nothing sits in a fridge waiting for a buyer."],
  ["🥚", "Eggless desserts", "Our whole tiramisu range is 100% eggless."],
  ["🧼", "Hygienically made", "Clean kitchen, careful handling, sealed boxes."],
  ["⭐", "Premium ingredients", "Real mascarpone, Amul chocolate, real coffee."],
  ["☕", "Authentic taste", "Classic Italian method, balanced sweetness."],
  ["🎨", "Customised to your liking", "Sweetness, size, message, design."],
];

const BULK = [
  ["🎂", "Birthday Parties"],
  ["💍", "Engagements"],
  ["🏢", "Office Events"],
  ["👨‍👩‍👧", "Family Celebrations"],
];

export default async function AboutPage() {
  const config = await getShopConfig();
  const bulkHref = waLink(
    config.whatsappNumber,
    `🎂 Hello ${config.shopName}!\n\nI would like to place a BULK ORDER.\n\n🎉 Occasion: \n👥 Servings: \n📅 Date: \n\nPlease let me know the price and availability.\n\nThank you! 💛`,
  );

  return (
    <>
      <SiteHeader config={config} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="card overflow-hidden">
          <img
            src="/images/hero-tiramisu.jpg"
            alt="Vani's Heavenly Cakes"
            className="h-64 w-full object-cover"
          />
          <div className="p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
              📖 Our Story
            </p>
            <h1 className="section-title mt-1">Why Customers Love Us</h1>
            <p className="mt-4 max-w-3xl text-cocoa-600">
              At {config.shopName}, every dessert is prepared fresh only after
              your order is confirmed. We use carefully selected premium
              ingredients to create rich, creamy and authentic desserts that
              make every celebration memorable.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="chip">Authentic Tiramisu</span>
              <span className="chip">Premium Desserts &amp; Cakes</span>
              <span className="chip">Eggless</span>
              <span className="chip">📍 {config.city}</span>
              <span className="chip">Order on WhatsApp</span>
              <span className="chip">Follow on Instagram</span>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="section-title">Why choose us?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([icon, title, text]) => (
              <div key={title} className="card p-5">
                <span className="text-2xl">{icon}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-cocoa-900">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-cocoa-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold text-cocoa-900">
              🎉 Bulk Orders
            </h2>
            <p className="mt-2 text-sm text-cocoa-600">
              We happily prepare desserts for:
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {BULK.map(([icon, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-cocoa-100 bg-cocoa-50 p-4 text-sm font-semibold text-cocoa-800"
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
            <a href={bulkHref} target="_blank" rel="noreferrer" className="btn-wa mt-5">
              Get bulk pricing on WhatsApp
            </a>
          </div>

          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold text-cocoa-900">
              📍 Pickup Information
            </h2>
            <p className="mt-3 text-sm font-semibold text-cocoa-800">
              Pickup only
            </p>
            <p className="mt-2 text-sm text-cocoa-600">{config.pickupNote}</p>
            <p className="mt-2 text-sm text-cocoa-600">
              Please collect your order at the confirmed time.
            </p>
            <p className="mt-4 text-sm text-cocoa-600">
              ⏳ Customised cakes: order at least {config.advanceDays} days in
              advance.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary">
                Browse the menu
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter config={config} />
      <WhatsAppFloat config={config} />
    </>
  );
}
