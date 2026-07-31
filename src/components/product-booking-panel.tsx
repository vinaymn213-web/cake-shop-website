"use client";

import { useState } from "react";

import BookNowButton from "@/components/book-now-button";
import type { Product } from "@/db/schema";
import { formatINR, type ShopConfig } from "@/lib/shop";

export default function ProductBookingPanel({
  product,
  config,
}: {
  product: Product;
  config: ShopConfig;
}) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");

  const total = product.price * quantity;

  return (
    <div className="card p-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-cocoa-400">
            {product.priceOnRequest ? "Pricing" : "Price"}
          </p>
          <p className="font-display text-3xl font-bold text-cocoa-900">
            {product.priceOnRequest ? "On Request" : formatINR(product.price)}
          </p>
          <p className="text-xs text-cocoa-500">{product.unit}</p>
        </div>
        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
          ★ {product.rating.toFixed(1)} ({product.reviews})
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <div>
          <label>Quantity</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-full border border-cocoa-200 text-lg font-bold text-cocoa-700"
            >
              −
            </button>
            <span className="w-10 text-center font-display text-xl font-bold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(50, q + 1))}
              className="h-10 w-10 rounded-full border border-cocoa-200 text-lg font-bold text-cocoa-700"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="name">Your name (optional)</label>
          <input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Priya"
          />
        </div>

        <div>
          <label htmlFor="date">Needed on (optional)</label>
          <input
            id="date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="notes">Message / customisation</label>
          <textarea
            id="notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Less sweet, write 'Happy Birthday Amma'"
          />
        </div>
      </div>

      {!product.priceOnRequest ? (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-cocoa-50 px-4 py-3">
          <span className="text-sm font-semibold text-cocoa-700">
            Estimated total
          </span>
          <span className="font-display text-2xl font-bold text-cocoa-900">
            {formatINR(total)}
          </span>
        </div>
      ) : null}

      <div className="mt-4">
        <BookNowButton
          config={config}
          fullWidth
          label="Book Now on WhatsApp"
          item={{
            productId: product.id,
            name: product.name,
            image: product.image,
            slug: product.slug,
            category: product.category,
            unit: product.unit,
            price: product.price,
            priceOnRequest: product.priceOnRequest,
            quantity,
            customerName,
            eventDate,
            notes,
          }}
        />
      </div>

      <p className="mt-3 text-center text-[11px] text-cocoa-400">
        No advance payment on the website — you confirm everything directly with
        Vani on WhatsApp. Pickup only.
      </p>
    </div>
  );
}
