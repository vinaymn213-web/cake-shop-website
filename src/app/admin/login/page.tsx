"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password. Try again.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-cocoa-700 text-[9px] font-bold uppercase leading-tight text-cocoa-800">
            Vani&apos;s
            <br />
            Heavenly
            <br />
            Cakes
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-cocoa-900">
            Owner Dashboard
          </h1>
          <p className="mt-1 text-xs text-cocoa-500">
            Manage bookings, menu &amp; WhatsApp settings.
          </p>
        </div>

        <label htmlFor="pw">Password</label>
        <input
          id="pw"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
        />

        {error ? (
          <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
        ) : null}

        <button type="submit" disabled={busy} className="btn-primary mt-5 w-full">
          {busy ? "Checking…" : "Login"}
        </button>

        <p className="mt-4 rounded-xl bg-cocoa-50 p-3 text-center text-[11px] text-cocoa-500">
          Demo password: <strong>vani123</strong> (change it with the
          ADMIN_PASSWORD environment variable)
        </p>
      </form>
    </main>
  );
}
