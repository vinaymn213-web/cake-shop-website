import Link from "next/link";

import { getBookings, getDashboardStats } from "@/lib/data";
import { categoryLabel, formatINR } from "@/lib/shop";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboard() {
  const [stats, bookings] = await Promise.all([
    getDashboardStats(),
    getBookings(8),
  ]);

  const maxWeekly = Math.max(1, ...stats.weekly.map((d) => d.count));

  const cards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: "🧾",
      tone: "from-amber-100 to-amber-50",
      sub: `${stats.newBookings} awaiting confirmation`,
    },
    {
      label: "Confirmed Orders",
      value: stats.confirmed,
      icon: "✅",
      tone: "from-blue-100 to-blue-50",
      sub: `${stats.completed} completed`,
    },
    {
      label: "Confirmed Revenue",
      value: formatINR(stats.revenue),
      icon: "💰",
      tone: "from-emerald-100 to-emerald-50",
      sub: `${formatINR(stats.potentialRevenue)} incl. pending`,
    },
    {
      label: "Menu Items Live",
      value: `${stats.availableProducts}/${stats.totalProducts}`,
      icon: "🍰",
      tone: "from-rose-100 to-rose-50",
      sub: "Toggle availability anytime",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-cocoa-900">
            Dashboard
          </h1>
          <p className="text-sm text-cocoa-500">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders" className="btn-outline py-2 text-xs">
            View all bookings
          </Link>
          <Link href="/admin/products" className="btn-primary py-2 text-xs">
            + Add menu item
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`card bg-gradient-to-br ${card.tone} p-5`}
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-cocoa-600">
                {card.label}
              </p>
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-cocoa-900">
              {card.value}
            </p>
            <p className="mt-1 text-[11px] text-cocoa-500">{card.sub}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold text-cocoa-900">
            Bookings this week
          </h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {stats.weekly.map((day, index) => (
              <div key={`${day.day}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-cocoa-600">
                  {day.count}
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-cocoa-700 to-gold-400 transition-all"
                  style={{
                    height: `${Math.max(6, (day.count / maxWeekly) * 100)}%`,
                  }}
                />
                <span className="text-[11px] text-cocoa-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-xl font-bold text-cocoa-900">
            Top desserts
          </h2>
          {stats.topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-cocoa-400">
              No bookings yet. Share your website link on Instagram 💛
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.topProducts.map((item, index) => (
                <li key={item.name} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cocoa-800 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-cocoa-800">
                      {item.name}
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-cocoa-100">
                      <div
                        className="h-full rounded-full bg-gold-500"
                        style={{
                          width: `${(item.count / stats.topProducts[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cocoa-600">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {stats.categorySplit.length ? (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-cocoa-500">
                By category
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {stats.categorySplit.map((c) => (
                  <span key={c.category} className="chip">
                    {categoryLabel(c.category)} · {c.count}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-cocoa-100 p-5">
          <h2 className="font-display text-xl font-bold text-cocoa-900">
            Latest booking requests
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-cocoa-600 underline"
          >
            Manage all →
          </Link>
        </div>
        {bookings.length === 0 ? (
          <p className="p-8 text-center text-sm text-cocoa-400">
            No bookings yet — every WhatsApp “Book Now” tap will appear here
            automatically.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-cocoa-50 text-[11px] uppercase tracking-wide text-cocoa-500">
                <tr>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Qty</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-cocoa-100">
                    <td className="px-5 py-3 font-semibold text-cocoa-800">
                      {b.productName}
                    </td>
                    <td className="px-5 py-3 text-cocoa-600">
                      {b.customerName || "—"}
                      {b.customerPhone ? (
                        <span className="block text-[11px] text-cocoa-400">
                          {b.customerPhone}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">{b.quantity}</td>
                    <td className="px-5 py-3 font-semibold">
                      {b.amount ? formatINR(b.amount) : "Quote"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                          STATUS_STYLES[b.status] ?? "bg-cocoa-100"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[11px] text-cocoa-400">
                      {new Date(b.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
