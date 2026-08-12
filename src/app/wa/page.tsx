import QRCode from "qrcode";

import WhatsAppRedirect from "@/components/whatsapp-redirect";
import { getShopConfig } from "@/lib/data";
import { normalisePhone, prettyPhone, whatsappHref } from "@/lib/shop";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Opening WhatsApp… | Cake Delight",
  robots: { index: false, follow: false },
};

export default async function WhatsAppLauncherPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string; text?: string }>;
}) {
  const [{ to, text }, config] = await Promise.all([
    searchParams,
    getShopConfig(),
  ]);

  const phone = normalisePhone(to || config.whatsappNumber);
  const message =
    text ||
    `🎂 Hello ${config.shopName}!\n\nI would like to book a cake.\n\nPlease let me know the availability.\n\nThank you! 💛`;

  const direct = whatsappHref(phone, message);

  let qr = "";
  try {
    qr = await QRCode.toDataURL(direct, {
      width: 320,
      margin: 1,
      color: { dark: "#4a2a1b", light: "#ffffff" },
    });
  } catch {
    qr = "";
  }

  return (
    <WhatsAppRedirect
      direct={direct}
      message={message}
      phone={phone}
      pretty={prettyPhone(phone)}
      qr={qr}
      shopName={config.shopName}
    />
  );
}
