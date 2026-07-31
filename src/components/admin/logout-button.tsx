"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="w-full rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-cocoa-200 transition hover:bg-white/10 hover:text-white"
    >
      Log out
    </button>
  );
}
