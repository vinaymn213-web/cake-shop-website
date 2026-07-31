import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin, unauthorized } from "@/lib/auth";
import { ensureSeeded, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const rows = await getProducts({ category });
  return Response.json({ products: rows });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  await ensureSeeded();
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const name = String(body.name ?? "").trim();
  if (!name) return Response.json({ error: "Name is required" }, { status: 400 });

  const [row] = await db
    .insert(products)
    .values({
      name,
      slug: `${slugify(name)}-${Date.now().toString(36).slice(-4)}`,
      category: String(body.category ?? "tiramisu"),
      shortDesc: String(body.shortDesc ?? ""),
      description: String(body.description ?? ""),
      price: Number(body.price ?? 0) || 0,
      unit: String(body.unit ?? "250 ml Takeaway Box"),
      image: String(body.image ?? "/images/custom-cake.jpg"),
      tags: String(body.tags ?? ""),
      priceOnRequest: Boolean(body.priceOnRequest),
      isBestseller: Boolean(body.isBestseller),
      isEggless: body.isEggless === undefined ? true : Boolean(body.isEggless),
      isAvailable:
        body.isAvailable === undefined ? true : Boolean(body.isAvailable),
      sortOrder: Number(body.sortOrder ?? 99) || 99,
    })
    .returning();

  return Response.json({ ok: true, product: row }, { status: 201 });
}
