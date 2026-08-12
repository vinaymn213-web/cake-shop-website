import MenuBrowser from "@/components/menu-browser";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WhatsAppFloat from "@/components/whatsapp-float";
import { getProducts, getShopConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Menu | Cake Delight",
  description:
    "Tiramisu tubs, puddle cake, rasmalai tres leches, fudgy brownies, millet protein cakes and customised cakes. Book instantly on WhatsApp.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, config, products] = await Promise.all([
    searchParams,
    getShopConfig(),
    getProducts(),
  ]);

  return (
    <>
      <SiteHeader config={config} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
          🍰 Our Menu
        </p>
        <h1 className="section-title">Freshly Made with Love</h1>
        <p className="mt-2 max-w-2xl text-sm text-cocoa-600">
          Everything is prepared only after your order is confirmed. Tap{" "}
          <strong>Book Now</strong> on any dessert and WhatsApp opens with the
          photo, size and price already filled in.
        </p>

        <div className="mt-8">
          <MenuBrowser
            products={products}
            config={config}
            initialCategory={category ?? "all"}
          />
        </div>
      </main>
      <SiteFooter config={config} />
      <WhatsAppFloat config={config} />
    </>
  );
}
