import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import LogoutButton from "@/components/admin/logout-button";
import { isAdmin } from "@/lib/auth";
import { getShopConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Bookings", icon: "🧾" },
  { href: "/admin/products", label: "Menu Items", icon: "🍰" },
  { href: "/admin/settings", label: "Shop Settings", icon: "⚙️" },
  { href: "/", label: "View Website", icon: "🌐" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const config = await getShopConfig();

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-cocoa-100 bg-cocoa-900 text-cocoa-100 lg:min-h-screen lg:w-64 lg:border-b-0">
        <div className="flex items-center gap-3 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-gold-400 text-[7px] font-bold uppercase leading-[1.05] text-gold-400">
            Vani&apos;s
            <br />
            Heavenly
            <br />
            Cakes
          </span>
          <div>
            <p className="font-display text-sm font-bold text-white">
              {config.shopName}
            </p>
            <p className="text-[10px] text-cocoa-300">Owner Dashboard</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium text-cocoa-200 transition hover:bg-white/10 hover:text-white"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="px-1 pt-2">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      <main className="flex-1 bg-[#fffaf5] p-4 lg:p-8">{children}</main>
    </div>
  );
}
