/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Product } from "@/db/schema";
import { CATEGORIES, formatINR } from "@/lib/shop";

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.key !== "all");

const EMPTY = {
  name: "",
  category: "tiramisu",
  shortDesc: "",
  description: "",
  price: "",
  unit: "250 ml Takeaway Box",
  image: "/images/custom-cake.jpg",
  tags: "Eggless",
  priceOnRequest: false,
  isBestseller: false,
  isEggless: true,
};

export default function ProductsManager({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY });
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");

  async function createProduct(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) || 0 }),
    });
    setBusy(false);
    setForm({ ...EMPTY });
    setShowForm(false);
    router.refresh();
  }

  async function patch(id: number, body: Record<string, unknown>) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Remove this item from the menu?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cocoa-500">
          {products.length} items · {products.filter((p) => p.isAvailable).length}{" "}
          currently live on the website
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary py-2 text-xs"
        >
          {showForm ? "Close" : "+ Add new item"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={createProduct} className="card grid gap-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="p-name">Name *</label>
              <input
                id="p-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Butterscotch Tiramisu"
              />
            </div>
            <div>
              <label htmlFor="p-cat">Category</label>
              <select
                id="p-cat"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="p-price">Price (₹)</label>
              <input
                id="p-price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="150"
              />
            </div>
            <div>
              <label htmlFor="p-unit">Unit / size</label>
              <input
                id="p-unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="p-image">Image URL or /images/file.jpg</label>
              <input
                id="p-image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="p-tags">Tags (comma separated)</label>
              <input
                id="p-tags"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="p-short">Short description</label>
            <input
              id="p-short"
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="p-desc">Full description</label>
            <textarea
              id="p-desc"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-cocoa-700">
            {[
              ["priceOnRequest", "Price on request"],
              ["isBestseller", "Mark as bestseller"],
              ["isEggless", "Eggless"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 normal-case tracking-normal">
                <input
                  type="checkbox"
                  checked={Boolean(form[key as keyof typeof form])}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.checked })
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Save menu item"}
          </button>
        </form>
      ) : null}

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="card flex flex-wrap items-center gap-4 p-4">
            <img
              src={p.image}
              alt={p.name}
              className="h-16 w-16 rounded-2xl object-cover"
            />
            <div className="min-w-[180px] flex-1">
              <p className="font-semibold text-cocoa-900">{p.name}</p>
              <p className="text-[11px] text-cocoa-400">
                {p.unit} · {p.category} · ★ {p.rating.toFixed(1)}
              </p>
            </div>

            <div className="w-28">
              {editing === p.id ? (
                <div className="flex gap-1">
                  <input
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await patch(p.id, { price: Number(editPrice) || 0 });
                      setEditing(null);
                    }}
                    className="rounded-lg bg-cocoa-800 px-2 text-xs text-white"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(p.id);
                    setEditPrice(String(p.price));
                  }}
                  className="font-display text-lg font-bold text-cocoa-900 underline decoration-dotted"
                >
                  {p.priceOnRequest ? "Quote" : formatINR(p.price)}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => patch(p.id, { isBestseller: !p.isBestseller })}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                p.isBestseller
                  ? "bg-gold-500 text-white"
                  : "bg-cocoa-100 text-cocoa-500"
              }`}
            >
              ★ Bestseller
            </button>

            <button
              type="button"
              onClick={() => patch(p.id, { isAvailable: !p.isAvailable })}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                p.isAvailable
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {p.isAvailable ? "Available" : "Sold out"}
            </button>

            <button
              type="button"
              onClick={() => remove(p.id)}
              className="rounded-full border border-red-200 px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
