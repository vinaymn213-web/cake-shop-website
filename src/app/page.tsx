/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import ProductCard from "@/components/product-card";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WhatsAppFloat from "@/components/whatsapp-float";
import { getProducts, getShopConfig } from "@/lib/data";
import { CATEGORIES, prettyPhone, waLink } from "@/lib/shop";

export const dynamic = "force-dynamic";

const WHY_CHOOSE = [
  { icon: "🧁", title: "Freshly Prepared", text: "Baked only after your order is confirmed." },
  { icon: "🥚", title: "Eggless Desserts", text: "Our entire tiramisu range is 100% eggless." },
  { icon: "🧼", title: "Hygienically Made", text: "Clean home kitchen, careful handling." },
  { icon: "⭐", title: "Premium Ingredients", text: "Amul chocolate, real mascarpone, real coffee." },
  { icon: "☕", title: "Authentic Taste", text: "Classic Italian technique, Indian heart." },
  { icon: "🎨", title: "Customised For You", text: "Made exactly to the customer's liking." },
];

const BULK = [
  { icon: "🎂", label: "Birthday Parties" },
  { icon: "💍", label: "Engagements" },
  { icon: "🏢", label: "Office Events" },
  { icon: "👨‍👩‍👧", label: "Family Celebrations" },
];

const STEPS = [
  { n: "1", title: "Pick your dessert", text: "Browse tiramisu tubs, cakes, brownies or a fully customised cake." },
  { n: "2", title: "Tap Book Now", text: "WhatsApp opens instantly with the cake name, photo, size and price already typed." },
  { n: "3", title: "Confirm & pickup", text: "Vani confirms the time, prepares it fresh and you collect it in Davanagere." },
];

export default async function HomePage() {
  const [config, products] = await Promise.all([
    getShopConfig(),
    getProducts({ onlyAvailable: true }),
  ]);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 6);
  const tiramisu = products.filter((p) => p.category === "tiramisu").slice(0, 8);
  const custom = products.find((p) => p.category === "custom");

  const bulkHref = waLink(
    config.whatsappNumber,
    `🎂 Hello ${config.shopName}!\n\nI would like to place a BULK ORDER.\n\n🎉 Occasion: \n👥 Number of servings: \n📅 Date needed: \n🍫 Preferred desserts: \n\nPlease let me know the price and availability.\n\nThank you! 💛`,
  );

  return (
    <>
      <SiteHeader config={config} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="chip bg-white">
              📍 {config.city} · Pickup only
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-cocoa-900 sm:text-5xl lg:text-6xl">
              Freshly Made <span className="text-gold-500">with Love</span> 💙
            </h1>
            <p className="mt-4 max-w-xl text-base text-cocoa-600 sm:text-lg">
              Authentic Tiramisu, premium desserts and customised cakes from{" "}
              <strong>{config.shopName}</strong>. Every dessert is prepared
              fresh only after your order is confirmed — no shortcuts, no
              stale stock.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary">
                🍰 View Full Menu
              </Link>
              <a
                href={waLink(
                  config.whatsappNumber,
                  `🎂 Hello ${config.shopName}!\n\nI would like to book a cake.\n\nPlease let me know the availability.\n\nThank you! 💛`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-wa px-6 py-3"
              >
                Book Now on WhatsApp · {prettyPhone(config.whatsappNumber)}
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["100%", "Eggless Tiramisu"],
                ["500+", "Happy Customers"],
                ["4.9★", "Average Rating"],
                ["3 Days", "Custom Cake Notice"],
              ].map(([big, small]) => (
                <div
                  key={small}
                  className="rounded-2xl border border-cocoa-100 bg-white/70 p-3 text-center"
                >
                  <p className="font-display text-xl font-bold text-cocoa-900">
                    {big}
                  </p>
                  <p className="text-[11px] text-cocoa-500">{small}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl shadow-cocoa-900/20">
              <img
                src="/images/ferrero-tiramisu.jpg"
                alt="Classic tiramisu by Vani's Heavenly Cakes"
                className="h-[320px] w-full object-cover sm:h-[440px]"
              />
            </div>
            <div className="floaty absolute -bottom-5 -left-2 rounded-2xl border border-cocoa-100 bg-white px-4 py-3 shadow-xl sm:left-6">
              <p className="text-[11px] uppercase tracking-wide text-cocoa-400">
                Starting at
              </p>
              <p className="font-display text-2xl font-bold text-cocoa-900">
                ₹150
              </p>
              <p className="text-[11px] text-cocoa-500">250 ml takeaway box</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.key === "all" ? "/menu" : `/menu?category=${cat.key}`}
              className="card flex flex-col items-center gap-2 px-2 py-4 text-center transition hover:-translate-y-1"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[11px] font-semibold text-cocoa-700">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
              Most Loved
            </p>
            <h2 className="section-title">Bestselling Desserts</h2>
          </div>
          <Link href="/menu" className="text-sm font-semibold text-cocoa-700 underline">
            See all {products.length} items →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} config={config} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-cocoa-900 py-14 text-cocoa-50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-3xl font-bold text-white">
            Booking takes 10 seconds
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-cocoa-200">
            No payment gateway, no long forms. Everything is confirmed
            personally on WhatsApp.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-500 font-bold text-cocoa-900">
                  {step.n}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-cocoa-200">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIRAMISU COLLECTION */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
          Signature Range
        </p>
        <h2 className="section-title">The Tiramisu Collection ☕</h2>
        <p className="mt-2 max-w-2xl text-sm text-cocoa-600">
          Every tub is a 250 ml takeaway box, layered by hand with real
          mascarpone and freshly brewed coffee. 100% eggless.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiramisu.map((product) => (
            <ProductCard key={product.id} product={product} config={config} />
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="card grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
              📖 Our Story
            </p>
            <h2 className="section-title mt-1">Why Customers Love Us</h2>
            <p className="mt-4 text-cocoa-600">
              At {config.shopName}, every dessert is prepared fresh only after
              your order is confirmed. We use carefully selected premium
              ingredients to create rich, creamy and authentic desserts that
              make every celebration memorable.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {WHY_CHOOSE.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-cocoa-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-cocoa-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-cocoa-50 p-6">
            <h3 className="font-display text-2xl font-bold text-cocoa-900">
              📍 Pickup Information
            </h3>
            <p className="mt-3 text-sm font-semibold text-cocoa-700">
              Pickup only
            </p>
            <p className="mt-2 text-sm text-cocoa-600">{config.pickupNote}</p>
            <p className="mt-2 text-sm text-cocoa-600">
              Please collect your order at the confirmed time.
            </p>
            <hr className="my-5 border-cocoa-200" />
            <h3 className="font-display text-xl font-bold text-cocoa-900">
              🎉 Bulk Orders
            </h3>
            <p className="mt-2 text-sm text-cocoa-600">
              We happily prepare desserts for:
            </p>
            <ul className="mt-3 grid gap-2">
              {BULK.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-cocoa-700">
                  <span>{item.icon}</span> {item.label}
                </li>
              ))}
            </ul>
            <a href={bulkHref} target="_blank" rel="noreferrer" className="btn-wa mt-5 w-full">
              Enquire for Bulk Order
            </a>
          </div>
        </div>
      </section>

      {/* CUSTOM CAKE CTA */}
      {custom ? (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="card grid items-center gap-8 overflow-hidden lg:grid-cols-2">
            <img
              src={custom.image}
              alt="Customised cakes"
              className="h-full max-h-[420px] w-full object-cover"
            />
            <div className="p-8 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
                ✨ Customised Cakes
              </p>
              <h2 className="section-title mt-1">
                Designed for your celebration
              </h2>
              <p className="mt-3 text-sm text-cocoa-600">
                From elegant birthdays and anniversaries to weddings and baby
                showers — each cake is handcrafted with premium ingredients and
                exceptional attention to detail. Pricing varies by size,
                flavour, design and level of customisation.
              </p>
              <ul className="mt-4 grid gap-1 text-sm text-cocoa-700">
                {[
                  "Occasion",
                  "Number of servings",
                  "Preferred flavour",
                  "Theme or reference photo",
                  "Delivery / pickup date",
                ].map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <p className="mt-3 rounded-xl bg-rose-soft/60 p-3 text-xs font-medium text-cocoa-700">
                ⏳ Please place customised cake orders at least{" "}
                {config.advanceDays} days in advance to ensure availability and
                the best quality.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/custom-cake" className="btn-primary">
                  Get a Price Quote
                </Link>
                <Link href={`/cakes/${custom.slug}`} className="btn-outline">
                  See details
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter config={config} />
      <WhatsAppFloat config={config} />
    </>
  );
}
