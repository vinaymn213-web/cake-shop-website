"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { prettyPhone, waLink, type ShopConfig } from "@/lib/shop";

export default function SettingsForm({ config }: { config: ShopConfig }) {
  const router = useRouter();
  const [form, setForm] = useState<ShopConfig>(config);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  function update<K extends keyof ShopConfig>(key: K, value: ShopConfig[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="card grid gap-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="s-name">Shop name</label>
            <input
              id="s-name"
              value={form.shopName}
              onChange={(e) => update("shopName", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-tag">Tagline</label>
            <input
              id="s-tag"
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-wa">WhatsApp number (with country code)</label>
            <input
              id="s-wa"
              value={form.whatsappNumber}
              onChange={(e) => update("whatsappNumber", e.target.value)}
              placeholder="918660345846"
            />
          </div>
          <div>
            <label htmlFor="s-ig">Instagram handle</label>
            <input
              id="s-ig"
              value={form.instagram}
              onChange={(e) => update("instagram", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-city">City / pickup area</label>
            <input
              id="s-city"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-days">Custom cake advance notice (days)</label>
            <input
              id="s-days"
              type="number"
              value={form.advanceDays}
              onChange={(e) => update("advanceDays", Number(e.target.value) || 3)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="s-pickup">Pickup note</label>
          <textarea
            id="s-pickup"
            rows={2}
            value={form.pickupNote}
            onChange={(e) => update("pickupNote", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="s-ann">Top announcement bar</label>
          <textarea
            id="s-ann"
            rows={2}
            value={form.announcement}
            onChange={(e) => update("announcement", e.target.value)}
          />
        </div>

        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Saving…" : "Save settings"}
        </button>
        {saved ? (
          <p className="text-center text-xs font-semibold text-emerald-700">
            ✅ Saved. The whole website now uses these details.
          </p>
        ) : null}
      </div>

      <div className="card h-fit p-6">
        <h2 className="font-display text-xl font-bold text-cocoa-900">
          WhatsApp preview
        </h2>
        <p className="mt-2 text-xs text-cocoa-500">
          This is what a customer sends when they tap <strong>Book Now</strong>.
        </p>
        <div className="mt-4 whitespace-pre-line rounded-2xl bg-[#dcf8c6] p-4 text-[13px] leading-relaxed text-cocoa-900">
          {`🎂 Hello ${form.shopName}!

I would like to book the following cake.

🍰 Cake Name: Classic Tiramisu
💰 Price: ₹150
⚖️ Weight: 250 ml Takeaway Box
🖼️ Cake Image: …/images/classic-tiramisu.jpg

Please let me know the availability.

Thank you! 💛`}
        </div>
        <p className="mt-2 text-center text-[11px] font-semibold text-cocoa-500">
          Sent to {prettyPhone(form.whatsappNumber)}
        </p>
        <a
          href={waLink(
            form.whatsappNumber,
            `Test message from the ${form.shopName} dashboard ✅`,
          )}
          target="_blank"
          rel="noreferrer"
          className="btn-wa mt-4 w-full"
        >
          Send test message
        </a>
      </div>
    </form>
  );
}
