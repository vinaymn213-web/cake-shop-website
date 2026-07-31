"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Booking } from "@/db/schema";
import { formatINR, waLink } from "@/lib/shop";

const STATUSES = ["new", "confirmed", "completed", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersTable({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  const rows =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  async function setStatus(id: number, status: string) {
    setBusyId(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Delete this booking request?")) return;
    setBusyId(id);
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition ${
              filter === status
                ? "border-cocoa-800 bg-cocoa-800 text-white"
                : "border-cocoa-200 bg-white text-cocoa-700"
            }`}
          >
            {status}{" "}
            {status === "all"
              ? bookings.length
              : bookings.filter((b) => b.status === status).length}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-sm text-cocoa-400">
          Nothing here yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {rows.map((b) => (
            <article key={b.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-cocoa-900">
                      {b.productName}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        STATUS_STYLES[b.status] ?? "bg-cocoa-100"
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="chip">{b.type}</span>
                  </div>
                  <p className="mt-1 text-xs text-cocoa-400">
                    #{b.id} ·{" "}
                    {new Date(b.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-cocoa-900">
                    {b.amount ? formatINR(b.amount) : "Quote"}
                  </p>
                  <p className="text-[11px] text-cocoa-400">
                    Qty {b.quantity}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Customer", b.customerName],
                  ["Phone", b.customerPhone],
                  ["Occasion", b.occasion],
                  ["Servings", b.servings],
                  ["Flavour", b.flavor],
                  ["Theme", b.theme],
                  ["Needed on", b.eventDate],
                  ["Notes", b.notes],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-cocoa-400">
                        {label}
                      </dt>
                      <dd className="text-cocoa-700">{value}</dd>
                    </div>
                  ))}
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <select
                  value={b.status}
                  disabled={busyId === b.id}
                  onChange={(e) => setStatus(b.id, e.target.value)}
                  className="w-auto"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      Mark as {s}
                    </option>
                  ))}
                </select>

                {b.customerPhone ? (
                  <a
                    href={waLink(
                      b.customerPhone.replace(/\D/g, "").length === 10
                        ? `91${b.customerPhone.replace(/\D/g, "")}`
                        : b.customerPhone,
                      `Hello ${b.customerName || "there"}! 🎂 Thank you for your booking request for *${b.productName}*. We're confirming the details now.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-wa"
                  >
                    Reply on WhatsApp
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={() => remove(b.id)}
                  className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
