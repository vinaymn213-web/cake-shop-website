import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cake Delight | Eggless Tiramisu & Custom Cakes in Davanagere",
  description:
    "Freshly made with love. Authentic eggless tiramisu, premium desserts, brownies, healthy millet cakes and customised cakes in Davanagere. Book instantly on WhatsApp.",
  keywords: [
    "tiramisu Davanagere",
    "eggless cake Davanagere",
    "custom cake booking",
    "Cake Delight",
    "brownies Davanagere",
  ],
  openGraph: {
    title: "Cake Delight",
    description:
      "Authentic eggless tiramisu, premium desserts & customised cakes. Book on WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-cocoa-800 antialiased">{children}</body>
    </html>
  );
}
