import { prettyPhone, waLink, type ShopConfig } from "@/lib/shop";

export default function WhatsAppFloat({ config }: { config: ShopConfig }) {
  const href = waLink(
    config.whatsappNumber,
    `🎂 Hello ${config.shopName}!\n\nI would like to book a cake.\n\nPlease let me know the availability.\n\nThank you! 💛`,
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Book on WhatsApp ${prettyPhone(config.whatsappNumber)}`}
      className="floaty fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-emerald-700/30"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4A3.4 3.4 0 0 0 5 9c0 1.5 1.1 3 1.2 3.2a12 12 0 0 0 4.6 4.1 15 15 0 0 0 1.6.6 3.7 3.7 0 0 0 1.7.1 2.8 2.8 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2m0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.2.3.8 2.9-3-.8-.3.2A8.2 8.2 0 1 1 12 3.8" />
      </svg>
      <span className="hidden leading-tight sm:block">
        Book Now on WhatsApp
        <span className="block text-[11px] font-medium opacity-90">
          {prettyPhone(config.whatsappNumber)}
        </span>
      </span>
    </a>
  );
}
