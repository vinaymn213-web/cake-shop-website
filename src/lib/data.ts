import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { seedProducts } from "@/db/seed-data";
import { bookings, products, settings, type Product } from "@/db/schema";
import { DEFAULT_SHOP, type ShopConfig } from "@/lib/shop";

let seedPromise: Promise<void> | null = null;

/** Idempotent: fills the menu + settings row the first time the app runs. */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products);
      if (!row || row.count === 0) {
        await db.insert(products).values(seedProducts).onConflictDoNothing();
      }
      await db
        .insert(settings)
        .values({ id: 1 })
        .onConflictDoNothing({ target: settings.id });
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

export async function getShopConfig(): Promise<ShopConfig> {
  try {
    await ensureSeeded();
    const [row] = await db.select().from(settings).where(eq(settings.id, 1));
    if (!row) return DEFAULT_SHOP;
    return {
      shopName: row.shopName,
      tagline: row.tagline,
      whatsappNumber: row.whatsappNumber,
      instagram: row.instagram,
      city: row.city,
      pickupNote: row.pickupNote,
      announcement: row.announcement,
      advanceDays: row.advanceDays,
    };
  } catch {
    return DEFAULT_SHOP;
  }
}

export async function getProducts(options?: {
  category?: string;
  onlyAvailable?: boolean;
}): Promise<Product[]> {
  try {
    await ensureSeeded();
    const filters = [];
    if (options?.category && options.category !== "all") {
      filters.push(eq(products.category, options.category));
    }
    if (options?.onlyAvailable) {
      filters.push(eq(products.isAvailable, true));
    }
    const query = db.select().from(products);
    const rows = filters.length
      ? await query.where(and(...filters)).orderBy(products.sortOrder)
      : await query.orderBy(products.sortOrder);
    return rows;
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await ensureSeeded();
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));
    return row ?? null;
  } catch {
    return null;
  }
}

export async function getBookings(limit = 100) {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export type DashboardStats = {
  totalBookings: number;
  newBookings: number;
  confirmed: number;
  completed: number;
  revenue: number;
  potentialRevenue: number;
  totalProducts: number;
  availableProducts: number;
  weekly: { day: string; count: number; amount: number }[];
  topProducts: { name: string; count: number; amount: number }[];
  categorySplit: { category: string; count: number }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalBookings: 0,
    newBookings: 0,
    confirmed: 0,
    completed: 0,
    revenue: 0,
    potentialRevenue: 0,
    totalProducts: 0,
    availableProducts: 0,
    weekly: [],
    topProducts: [],
    categorySplit: [],
  };

  try {
    await ensureSeeded();
    const allBookings = await db.select().from(bookings);
    const allProducts = await db.select().from(products);

    const weekly: DashboardStats["weekly"] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const dayRows = allBookings.filter(
        (b) => b.createdAt >= day && b.createdAt < next,
      );
      weekly.push({
        day: day.toLocaleDateString("en-IN", { weekday: "short" }),
        count: dayRows.length,
        amount: dayRows.reduce((sum, b) => sum + b.amount, 0),
      });
    }

    const byProduct = new Map<string, { count: number; amount: number }>();
    allBookings.forEach((b) => {
      const entry = byProduct.get(b.productName) ?? { count: 0, amount: 0 };
      entry.count += b.quantity || 1;
      entry.amount += b.amount;
      byProduct.set(b.productName, entry);
    });

    const byCategory = new Map<string, number>();
    allBookings.forEach((b) => {
      byCategory.set(b.category, (byCategory.get(b.category) ?? 0) + 1);
    });

    return {
      totalBookings: allBookings.length,
      newBookings: allBookings.filter((b) => b.status === "new").length,
      confirmed: allBookings.filter((b) => b.status === "confirmed").length,
      completed: allBookings.filter((b) => b.status === "completed").length,
      revenue: allBookings
        .filter((b) => b.status === "completed" || b.status === "confirmed")
        .reduce((sum, b) => sum + b.amount, 0),
      potentialRevenue: allBookings.reduce((sum, b) => sum + b.amount, 0),
      totalProducts: allProducts.length,
      availableProducts: allProducts.filter((p) => p.isAvailable).length,
      weekly,
      topProducts: [...byProduct.entries()]
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      categorySplit: [...byCategory.entries()]
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
    };
  } catch {
    return empty;
  }
}
