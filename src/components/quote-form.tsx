"use client";

import { useState } from "react";

import { openWhatsApp } from "@/lib/open-whatsapp";
import { buildQuoteMessage, waLink, type ShopConfig } from "@/lib/shop";

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Baby Shower",
  "Engagement",
  "Office Event",
  "Bulk / Party Order",
  "Other",
];

const FLAVOURS = [
  "Classic Tiramisu",
  "Chocolate / Dark Chocolate",
  "Nutella",
  "Lotus Biscoff",
  "Ferrero Rocher",
  "Rasmalai Tres Leches",
  "Butterscotch",
  "Red Velvet",
  "Millet Protein (No maida, no sugar)",
  "Plum Cake",
  "Not sure — please suggest",
];

export default function QuoteForm({ config }: { config: ShopConfig }) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    occasion: "Birthday",
    servings: "",
    flavor: FLAVOURS[0],
    theme: "",
    eventDate: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);

    const message = buildQuoteMessage(form, config);
    openWhatsApp(waLink(config.whatsappNumber, message));

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: `Customised Cake — ${form.occasion}`,
          productImage: "/images/custom-cake.jpg",
          category: "custom",
          quantity: 1,
          amount: 0,
          type: "custom",
          ...form,
        }),
        keepalive: true,
      });
    } catch {
      /* ignore */
    }

    setSending(false);
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name">Your name *</label>
          <input
            id="q-name"
            required
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            placeholder="Priya S"
          />
        </div>
        <div>
          <label htmlFor="q-phone">WhatsApp number *</label>
          <input
            id="q-phone"
            required
            inputMode="tel"
            value={form.customerPhone}
            onChange={(e) => update("customerPhone", e.target.value)}
            placeholder="98XXXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="q-occasion">Occasion *</label>
          <select
            id="q-occasion"
            value={form.occasion}
            onChange={(e) => update("occasion", e.target.value)}
          >
            {OCCASIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-servings">Number of servings / weight *</label>
          <input
            id="q-servings"
            required
            value={form.servings}
            onChange={(e) => update("servings", e.target.value)}
            placeholder="e.g. 1.5 kg / 15 people"
          />
        </div>
        <div>
          <label htmlFor="q-flavor">Preferred flavour</label>
          <select
            id="q-flavor"
            value={form.flavor}
            onChange={(e) => update("flavor", e.target.value)}
          >
            {FLAVOURS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-date">Delivery / pickup date *</label>
          <input
            id="q-date"
            required
            type="date"
            value={form.eventDate}
            onChange={(e) => update("eventDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="q-theme">Theme or reference</label>
        <input
          id="q-theme"
          value={form.theme}
          onChange={(e) => update("theme", e.target.value)}
          placeholder="e.g. Pastel floral, jungle theme, Instagram reference"
        />
      </div>

      <div>
        <label htmlFor="q-notes">Anything else?</label>
        <textarea
          id="q-notes"
          rows={3}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Message on cake, allergies, eggless preference…"
        />
      </div>

      <p className="rounded-xl bg-rose-soft/60 p-3 text-xs font-medium text-cocoa-700">
        ⏳ Please place customised cake orders at least {config.advanceDays}{" "}
        days in advance to ensure availability and the best quality. You can
        send your reference photo directly in the WhatsApp chat.
      </p>

      <button type="submit" disabled={sending} className="btn-wa py-3 text-base">
        {sending ? "Opening WhatsApp…" : "Send my request on WhatsApp"}
      </button>

      {done ? (
        <p className="text-center text-xs font-semibold text-emerald-700">
          ✅ Request sent to the shop dashboard. If WhatsApp didn&apos;t open,
          please allow pop-ups and tap again.
        </p>
      ) : null}
    </form>
  );
}
