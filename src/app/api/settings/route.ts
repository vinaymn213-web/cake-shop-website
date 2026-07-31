import { eq } from "drizzle-orm";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { isAdmin, unauthorized } from "@/lib/auth";
import { ensureSeeded, getShopConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ settings: await getShopConfig() });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  await ensureSeeded();
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  [
    "shopName",
    "tagline",
    "whatsappNumber",
    "instagram",
    "city",
    "pickupNote",
    "announcement",
  ].forEach((key) => {
    if (typeof body[key] === "string") patch[key] = body[key];
  });
  if (body.advanceDays !== undefined) {
    patch.advanceDays = Number(body.advanceDays) || 3;
  }

  const [row] = await db
    .update(settings)
    .set(patch)
    .where(eq(settings.id, 1))
    .returning();

  return Response.json({ ok: true, settings: row });
}
