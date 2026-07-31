/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductBookingPanel from "@/components/product-booking-panel";
import ProductCard from "@/components/product-card";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WhatsAppFloat from "@/components/whatsapp-float";
import { getProductBySlug, getProducts, getShopConfig } from "@/lib/data";
import { categoryLabel } from "@/lib/shop";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [config, product, all] = await Promise.all([
    getShopConfig(),
    getProductBySlug(slug),
    getProducts({ onlyAvailable: true }),
  ]);

  if (!product) notFound();

  const tags = product.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const related = all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <>
      <SiteHeader config={config} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-5 text-xs text-cocoa-400">
          <Link href="/">Home</Link> / <Link href="/menu">Menu</Link> /{" "}
          <Link href={`/menu?category=${product.category}`}>
            {categoryLabel(product.category)}
          </Link>{" "}
          / <span className="text-cocoa-700">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="card overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-[340px] w-full object-cover sm:h-[460px]"
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["🧁", "Freshly prepared after order"],
                [product.isEggless ? "🥚" : "🍳", product.isEggless ? "100% Eggless" : "Made with fresh eggs"],
                ["📍", "Pickup only · Davanagere"],
              ].map(([icon, text]) => (
                <div
                  key={text}
                  className="rounded-2xl border border-cocoa-100 bg-white/70 p-3 text-center text-xs font-medium text-cocoa-600"
                >
                  <span className="block text-lg">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {product.isBestseller ? (
                <span className="rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase text-white">
                  ★ Bestseller
                </span>
              ) : null}
              {tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-3 font-display text-3xl font-extrabold text-cocoa-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-cocoa-600">{product.description}</p>

            <div className="mt-6">
              <ProductBookingPanel product={product} config={config} />
            </div>

            <details className="card mt-4 p-4 text-sm text-cocoa-600">
              <summary className="cursor-pointer font-semibold text-cocoa-800">
                Need a price quote for a bigger order?
              </summary>
              <p className="mt-3">Please share: occasion, number of servings, preferred flavour, theme or reference photo and delivery date.</p>
              <p className="mt-2">
                Customised cake orders should be placed at least{" "}
                {config.advanceDays} days in advance to ensure availability and
                the best quality.
              </p>
              <Link href="/custom-cake" className="btn-outline mt-3">
                Open quote form
              </Link>
            </details>
          </div>
        </div>

        {related.length ? (
          <section className="mt-16">
            <h2 className="section-title">You may also love</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} config={config} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter config={config} />
      <WhatsAppFloat config={config} />
    </>
  );
}
