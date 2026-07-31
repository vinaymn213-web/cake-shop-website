"use client";

import { useState } from "react";

import { openWhatsApp } from "@/lib/open-whatsapp";
import {
  buildBookingMessage,
  waLink,
  type BookingPayload,
  type ShopConfig,
} from "@/lib/shop";

type Props = {
  item: BookingPayload;
  config: ShopConfig;
  label?: string;
  className?: string;
  fullWidth?: boolean;
};

/**
 * One tap => the booking is logged in the dashboard AND WhatsApp opens with
 * the cake name, size, quantity, price and photo already typed out.
 */
export default function BookNowButton({
  item,
  config,
  label = "Book Now on WhatsApp",
  className,
  fullWidth,
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    const message = buildBookingMessage(item, config);
    const href = waLink(config.whatsappNumber, message);

    // Open immediately (inside the click gesture) so mobile browsers and
    // in-app browsers don't block it.
    openWhatsApp(href);

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          productName: item.name,
          productImage: item.image,
          category: item.category ?? "tiramisu",
          quantity: item.quantity,
          amount: item.priceOnRequest ? 0 : item.price * item.quantity,
          customerName: item.customerName ?? "",
          eventDate: item.eventDate ?? "",
          notes: item.notes ?? "",
          type: "quick",
        }),
        keepalive: true,
      });
    } catch {
      /* the WhatsApp hand-off matters more than the log */
    }

    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={
        className ??
        `btn-wa ${fullWidth ? "w-full" : ""} ${busy ? "opacity-70" : ""}`
      }
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4A3.4 3.4 0 0 0 5 9c0 1.5 1.1 3 1.2 3.2a12 12 0 0 0 4.6 4.1 15 15 0 0 0 1.6.6 3.7 3.7 0 0 0 1.7.1 2.8 2.8 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2m0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.2.3.8 2.9-3-.8-.3.2A8.2 8.2 0 1 1 12 3.8" />
      </svg>
      {busy ? "Opening WhatsApp…" : label}
    </button>
  );
}
