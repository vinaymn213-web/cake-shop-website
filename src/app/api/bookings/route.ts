import { desc } from "drizzle-orm";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { isAdmin, unauthorized } from "@/lib/auth";
import { ensureSeeded } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  await ensureSeeded();
  const rows = await db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(200);
  return Response.json({ bookings: rows });
}

/** Public: called the moment a customer taps "Book on WhatsApp". */
export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as Record<string, unknown>;
    const str = (key: string, fallback = "") =>
      typeof body[key] === "string" ? (body[key] as string).slice(0, 500) : fallback;
    const num = (key: string, fallback = 0) =>
      typeof body[key] === "number" && Number.isFinite(body[key] as number)
        ? Math.trunc(body[key] as number)
        : fallback;

    const [row] = await db
      .insert(bookings)
      .values({
        productId: num("productId") || null,
        productName: str("productName", "Custom enquiry"),
        productImage: str("productImage"),
        category: str("category", "custom"),
        quantity: Math.max(1, num("quantity", 1)),
        amount: Math.max(0, num("amount")),
        customerName: str("customerName"),
        customerPhone: str("customerPhone"),
        occasion: str("occasion"),
        servings: str("servings"),
        flavor: str("flavor"),
        theme: str("theme"),
        eventDate: str("eventDate"),
        notes: str("notes"),
        type: str("type", "quick"),
      })
      .returning();

    return Response.json({ ok: true, booking: row }, { status: 201 });
  } catch {
    // Never block the WhatsApp redirect because of a logging failure.
    return Response.json({ ok: false }, { status: 200 });
  }
}
