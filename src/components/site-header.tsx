"use client";

import Link from "next/link";
import { useState } from "react";

import { prettyPhone, waLink, type ShopConfig } from "@/lib/shop";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Our Menu" },
  { href: "/menu?category=tiramisu", label: "Tiramisu" },
  { href: "/custom-cake", label: "Custom Cakes" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ config }: { config: ShopConfig }) {
  const [open, setOpen] = useState(false);
  const hello = waLink(
    config.whatsappNumber,
    `🎂 Hello ${config.shopName}!\n\nI would like to book a cake.\n\nPlease let me know the availability.\n\nThank you! 💛`,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-cocoa-100 bg-white/85 backdrop-blur-md">
      <div className="overflow-hidden bg-cocoa-900 py-1.5">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-[11px] font-medium tracking-wide text-cocoa-100">
          {[0, 1].map((i) => (
            <span key={i} className="flex gap-10">
              <span>🍰 {config.announcement}</span>
              <span>📞 Book on WhatsApp: +{config.whatsappNumber}</span>
              <span>✨ Customised cakes — {config.advanceDays} days advance</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-cocoa-700 text-center text-[8px] font-bold uppercase leading-[1.05] text-cocoa-800">
            Cake
            <br />
            Delight
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-cocoa-900 sm:text-xl">
              {config.shopName}
            </span>
            <span className="block text-[11px] font-medium text-cocoa-500">
              {config.tagline} 💙 · {config.city}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-cocoa-700 transition hover:text-cocoa-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={hello} target="_blank" rel="noreferrer" className="btn-wa">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4A3.4 3.4 0 0 0 5 9c0 1.5 1.1 3 1.2 3.2a12 12 0 0 0 4.6 4.1 15 15 0 0 0 1.6.6 3.7 3.7 0 0 0 1.7.1 2.8 2.8 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2m0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.2.3.8 2.9-3-.8-.3.2A8.2 8.2 0 1 1 12 3.8" />
            </svg>
            <span className="hidden leading-tight sm:block">
              Book Now
              <span className="block text-[10px] font-medium opacity-90">
                {prettyPhone(config.whatsappNumber)}
              </span>
            </span>
            <span className="sm:hidden">Book</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-cocoa-200 text-cocoa-800 lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-cocoa-100 bg-white px-4 py-3 lg:hidden">
          <div className="grid gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-cocoa-700 hover:bg-cocoa-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-cocoa-400 hover:bg-cocoa-50"
            >
              Owner Dashboard
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
