import Link from "next/link";

import { prettyPhone, waLink, type ShopConfig } from "@/lib/shop";

export default function SiteFooter({ config }: { config: ShopConfig }) {
  const hello = waLink(
    config.whatsappNumber,
    `🎂 Hello ${config.shopName}!\n\nI would like to book a cake.\n\nPlease let me know the availability.\n\nThank you! 💛`,
  );

  return (
    <footer className="mt-20 bg-cocoa-900 text-cocoa-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-white">
            {config.shopName}
          </h3>
          <p className="mt-3 text-sm text-cocoa-200">
            {config.tagline} 💙 Authentic tiramisu, premium desserts and
            customised cakes — freshly prepared only after your order is
            confirmed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-white/10 px-3 py-1">Eggless</span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              Freshly Baked
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              Premium Ingredients
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-cocoa-200">
            <li>
              <Link href="/menu">Full Menu</Link>
            </li>
            <li>
              <Link href="/menu?category=tiramisu">Tiramisu Collection</Link>
            </li>
            <li>
              <Link href="/menu?category=brownies">Fudgy Brownies</Link>
            </li>
            <li>
              <Link href="/custom-cake">Customised Cakes</Link>
            </li>
            <li>
              <Link href="/about">Our Story</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Pickup Information
          </h4>
          <p className="mt-4 text-sm text-cocoa-200">{config.pickupNote}</p>
          <p className="mt-2 text-sm text-cocoa-200">
            Please collect your order at the confirmed time.
          </p>
          <p className="mt-2 text-sm text-cocoa-200">📍 {config.city}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Order &amp; Follow
          </h4>
          <a
            href={hello}
            target="_blank"
            rel="noreferrer"
            className="btn-wa mt-4"
          >
            Book Now · {prettyPhone(config.whatsappNumber)}
          </a>
          <a
            href={`https://instagram.com/${config.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-sm text-cocoa-200 hover:text-white"
          >
            📸 @{config.instagram}
          </a>
          <a
            href={`tel:+${config.whatsappNumber}`}
            className="mt-2 block text-sm text-cocoa-200 hover:text-white"
          >
            📞 {prettyPhone(config.whatsappNumber)}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cocoa-300">
        © {new Date().getFullYear()} {config.shopName} · Davanagere · Made with
        love 💛 ·{" "}
        <Link href="/admin" className="underline hover:text-white">
          Owner Dashboard
        </Link>
      </div>
    </footer>
  );
}
