import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WhatsAppFloat from "@/components/whatsapp-float";
import { getShopConfig } from "@/lib/data";
import { prettyPhone, waLink } from "@/lib/shop";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact & Pickup | Cake Delight",
  description:
    "Order on WhatsApp, follow on Instagram, and collect your freshly prepared dessert in Davanagere.",
};

export default async function ContactPage() {
  const config = await getShopConfig();
  const hello = waLink(
    config.whatsappNumber,
    `🎂 Hello ${config.shopName}!\n\nI would like to book a cake.\n\nPlease let me know the availability.\n\nThank you! 💛`,
  );

  return (
    <>
      <SiteHeader config={config} />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
          Say hello
        </p>
        <h1 className="section-title">Contact &amp; Pickup</h1>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <a
            href={hello}
            target="_blank"
            rel="noreferrer"
            className="card p-6 transition hover:-translate-y-1"
          >
            <span className="text-3xl">💬</span>
            <h2 className="mt-2 font-display text-xl font-bold text-cocoa-900">
              WhatsApp (fastest)
            </h2>
            <p className="mt-1 text-sm font-semibold text-cocoa-600">
              {prettyPhone(config.whatsappNumber)}
            </p>
            <p className="mt-2 text-xs text-cocoa-400">
              Tap to open a chat with your order details ready.
            </p>
          </a>

          <a
            href={`tel:+${config.whatsappNumber}`}
            className="card p-6 transition hover:-translate-y-1"
          >
            <span className="text-3xl">📞</span>
            <h2 className="mt-2 font-display text-xl font-bold text-cocoa-900">
              Call the shop
            </h2>
            <p className="mt-1 text-sm font-semibold text-cocoa-600">
              {prettyPhone(config.whatsappNumber)}
            </p>
            <p className="mt-2 text-xs text-cocoa-400">
              Available during baking hours.
            </p>
          </a>

          <a
            href={`https://instagram.com/${config.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="card p-6 transition hover:-translate-y-1"
          >
            <span className="text-3xl">📸</span>
            <h2 className="mt-2 font-display text-xl font-bold text-cocoa-900">
              Instagram
            </h2>
            <p className="mt-1 text-sm text-cocoa-600">@{config.instagram}</p>
            <p className="mt-2 text-xs text-cocoa-400">
              Daily fresh bakes, behind the scenes and new flavours.
            </p>
          </a>

          <div className="card p-6">
            <span className="text-3xl">📍</span>
            <h2 className="mt-2 font-display text-xl font-bold text-cocoa-900">
              Pickup point
            </h2>
            <p className="mt-1 text-sm text-cocoa-600">{config.city}</p>
            <p className="mt-2 text-xs text-cocoa-400">{config.pickupNote}</p>
          </div>
        </div>

        <div className="card mt-8 p-6">
          <h2 className="font-display text-2xl font-bold text-cocoa-900">
            Frequently asked
          </h2>
          <div className="mt-4 grid gap-3 text-sm">
            {[
              [
                "Do you deliver?",
                "We are pickup only right now. Fresh desserts are prepared after order confirmation — please collect at the confirmed time.",
              ],
              [
                "Are the desserts eggless?",
                "The entire tiramisu range, puddle cake, rasmalai tres leches and brownies are 100% eggless. Millet protein cakes and plum cakes are made with fresh eggs.",
              ],
              [
                "How early should I book a custom cake?",
                `At least ${config.advanceDays} days in advance so we can guarantee availability and quality.`,
              ],
              [
                "How do I pay?",
                "Everything is confirmed on WhatsApp — Vani will share UPI details after confirming your order.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="rounded-2xl bg-cocoa-50 p-4">
                <summary className="cursor-pointer font-semibold text-cocoa-800">
                  {q}
                </summary>
                <p className="mt-2 text-cocoa-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter config={config} />
      <WhatsAppFloat config={config} />
    </>
  );
}
