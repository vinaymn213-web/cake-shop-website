"use client";

import { useMemo, useState } from "react";

import ProductCard from "@/components/product-card";
import type { Product } from "@/db/schema";
import { CATEGORIES, type ShopConfig } from "@/lib/shop";

type SortKey = "popular" | "low" | "high" | "name";

export default function MenuBrowser({
  products,
  config,
  initialCategory = "all",
}: {
  products: Product[];
  config: ShopConfig;
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [egglessOnly, setEgglessOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isAvailable);
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (egglessOnly) list = list.filter((p) => p.isEggless);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.tags.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "popular")
      sorted.sort(
        (a, b) =>
          Number(b.isBestseller) - Number(a.isBestseller) ||
          a.sortOrder - b.sortOrder,
      );
    return sorted;
  }, [products, category, query, sort, egglessOnly]);

  return (
    <div>
      <div className="card mb-6 flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                category === cat.key
                  ? "border-cocoa-800 bg-cocoa-800 text-white"
                  : "border-cocoa-200 bg-white text-cocoa-700 hover:border-cocoa-400"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tiramisu, brownie, plum cake…"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="popular">Sort: Popularity</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A → Z</option>
          </select>
          <label className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-cocoa-200 bg-white px-3 py-2 text-xs font-semibold normal-case tracking-normal text-cocoa-700">
            <input
              type="checkbox"
              checked={egglessOnly}
              onChange={(e) => setEgglessOnly(e.target.checked)}
            />
            Eggless only
          </label>
        </div>
      </div>

      <p className="mb-4 text-sm text-cocoa-500">
        Showing <strong>{filtered.length}</strong> desserts
      </p>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-sm text-cocoa-500">
          No desserts match that search. Try “tiramisu” or “brownie”.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} config={config} />
          ))}
        </div>
      )}
    </div>
  );
}
