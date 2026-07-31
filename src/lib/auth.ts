import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "vhc_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "vani123";
}

export function tokenFor(password: string): string {
  return createHash("sha256")
    .update(`vhc::${password}::heavenly`)
    .digest("hex");
}

export function validToken(): string {
  return tokenFor(adminPassword());
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === validToken();
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
