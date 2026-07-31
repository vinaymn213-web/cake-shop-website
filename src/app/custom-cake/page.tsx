/* eslint-disable @next/next/no-img-element */
import QuoteForm from "@/components/quote-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WhatsAppFloat from "@/components/whatsapp-float";
import { getShopConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customised Cakes | Vani's Heavenly Cakes",
  description:
    "Custom birthday, anniversary, wedding and baby shower cakes in Davanagere. Share your requirement and get a personalised quote on WhatsApp.",
};

export default async function CustomCakePage() {
  const config = await getShopConfig();

  return (
    <>
      <SiteHeader config={config} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
              ✨ Customised Cakes
            </p>
            <h1 className="section-title mt-1">
              Every cake, uniquely designed for you
            </h1>
            <p className="mt-4 text-cocoa-600">
              Every cake is uniquely designed to match your celebration, style
              and vision. From elegant birthdays and anniversaries to weddings,
              baby showers and special occasions, each cake is handcrafted with
              premium ingredients and exceptional attention to detail.
            </p>
            <p className="mt-3 text-cocoa-600">
              Because every order is personalised, pricing varies based on the
              cake size, flavour, design and level of customisation. Share your
              requirements and we&apos;ll be happy to create the perfect cake
              for your special day.
            </p>

            <div className="card mt-6 p-6">
              <h2 className="font-display text-xl font-bold text-cocoa-900">
                Need a price quote? Please provide:
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-cocoa-700">
                {[
                  "Occasion",
                  "Number of servings",
                  "Preferred flavour",
                  "Theme or reference photo",
                  "Delivery date",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-cocoa-800 text-[10px] text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <img
              src="/images/custom-cake.jpg"
              alt="Customised celebration cake"
              className="mt-6 h-64 w-full rounded-3xl object-cover shadow-lg"
            />
          </div>

          <div>
            <QuoteForm config={config} />
          </div>
        </div>
      </main>
      <SiteFooter config={config} />
      <WhatsAppFloat config={config} />
    </>
  );
}
