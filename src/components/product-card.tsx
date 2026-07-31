/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import BookNowButton from "@/components/book-now-button";
import type { Product } from "@/db/schema";
import { formatINR, type ShopConfig } from "@/lib/shop";

export default function ProductCard({
  product,
  config,
}: {
  product: Product;
  config: ShopConfig;
}) {
  const tags = product.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={`/cakes/${product.slug}`} className="relative block">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.isBestseller ? (
            <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              ★ Bestseller
            </span>
          ) : null}
          {product.isEggless ? (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              100% Eggless
            </span>
          ) : null}
        </div>
        {!product.isAvailable ? (
          <span className="absolute inset-0 grid place-items-center bg-white/70 text-sm font-bold uppercase tracking-wide text-cocoa-800">
            Sold out today
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight text-cocoa-900">
            <Link href={`/cakes/${product.slug}`}>{product.name}</Link>
          </h3>
          <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-cocoa-500">
          {product.shortDesc}
        </p>

        <div className="mt-2 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            {product.priceOnRequest ? (
              <span className="font-display text-xl font-bold text-cocoa-900">
                On Request
              </span>
            ) : (
              <>
                <span className="font-display text-2xl font-bold text-cocoa-900">
                  {formatINR(product.price)}
                </span>
                {product.oldPrice ? (
                  <span className="ml-2 text-sm text-cocoa-300 line-through">
                    {formatINR(product.oldPrice)}
                  </span>
                ) : null}
              </>
            )}
            <p className="text-[11px] text-cocoa-400">{product.unit}</p>
          </div>
          <span className="text-[11px] text-cocoa-400">
            {product.reviews} reviews
          </span>
        </div>

        <div className="mt-4 grid gap-2">
          <BookNowButton
            config={config}
            fullWidth
            label={product.priceOnRequest ? "Book & Get Quote" : "Book Now"}
            item={{
              productId: product.id,
              name: product.name,
              image: product.image,
              slug: product.slug,
              category: product.category,
              unit: product.unit,
              price: product.price,
              priceOnRequest: product.priceOnRequest,
              quantity: 1,
            }}
          />
          <Link
            href={`/cakes/${product.slug}`}
            className="rounded-full border border-cocoa-200 py-2 text-center text-xs font-semibold text-cocoa-700 transition hover:border-cocoa-400"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
