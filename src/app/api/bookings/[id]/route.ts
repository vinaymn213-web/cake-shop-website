import { eq } from "drizzle-orm";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { isAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as {
    status?: string;
    notes?: string;
  };
  const [row] = await db
    .update(bookings)
    .set({
      ...(body.status ? { status: body.status } : {}),
      ...(typeof body.notes === "string" ? { notes: body.notes } : {}),
    })
    .where(eq(bookings.id, Number(id)))
    .returning();
  return Response.json({ ok: true, booking: row });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await ctx.params;
  await db.delete(bookings).where(eq(bookings.id, Number(id)));
  return Response.json({ ok: true });
}
