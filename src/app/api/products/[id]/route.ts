import { eq } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  const patch: Record<string, unknown> = {};
  const strings = [
    "name",
    "category",
    "shortDesc",
    "description",
    "unit",
    "image",
    "tags",
  ];
  strings.forEach((key) => {
    if (typeof body[key] === "string") patch[key] = body[key];
  });
  ["price", "sortOrder", "reviews"].forEach((key) => {
    if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
      patch[key] = Number(body[key]) || 0;
    }
  });
  ["priceOnRequest", "isBestseller", "isEggless", "isAvailable"].forEach(
    (key) => {
      if (typeof body[key] === "boolean") patch[key] = body[key];
    },
  );

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [row] = await db
    .update(products)
    .set(patch)
    .where(eq(products.id, Number(id)))
    .returning();

  return Response.json({ ok: true, product: row });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await ctx.params;
  await db.delete(products).where(eq(products.id, Number(id)));
  return Response.json({ ok: true });
}
