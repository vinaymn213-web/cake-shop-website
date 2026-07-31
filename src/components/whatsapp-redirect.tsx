/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  direct: string;
  message: string;
  pretty: string;
  phone: string;
  qr: string;
  shopName: string;
};

type Phase = "opening" | "opened" | "manual";

export default function WhatsAppRedirect({
  direct,
  message,
  pretty,
  phone,
  qr,
  shopName,
}: Props) {
  const [phase, setPhase] = useState<Phase>("opening");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const framed = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

    // Normal case (real website, not embedded): jump straight to WhatsApp.
    if (!framed) {
      window.location.replace(direct);
      return;
    }

    // Embedded in an iframe — WhatsApp refuses to load inside frames, so we
    // must escape to a new tab. NOTE: never pass "noopener" as the third
    // argument, Chrome then returns null even when the popup succeeded.
    let popup: Window | null = null;
    try {
      popup = window.open(direct, "_blank");
    } catch {
      popup = null;
    }

    if (popup) {
      try {
        popup.opener = null;
      } catch {
        /* ignore */
      }
      setPhase("opened");
    } else {
      setPhase("manual");
    }
  }, [direct]);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const area = document.createElement("textarea");
      area.value = message;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="card w-full max-w-lg p-7 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#25d366]">
          <svg viewBox="0 0 24 24" className="h-9 w-9 fill-white" aria-hidden>
            <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4A3.4 3.4 0 0 0 5 9c0 1.5 1.1 3 1.2 3.2a12 12 0 0 0 4.6 4.1 15 15 0 0 0 1.6.6 3.7 3.7 0 0 0 1.7.1 2.8 2.8 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2m0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.2.3.8 2.9-3-.8-.3.2A8.2 8.2 0 1 1 12 3.8" />
          </svg>
        </span>

        <h1 className="mt-4 font-display text-2xl font-bold text-cocoa-900">
          {phase === "opening"
            ? "Opening WhatsApp…"
            : phase === "opened"
              ? "WhatsApp opened in a new tab ✅"
              : "Tap to open WhatsApp"}
        </h1>
        <p className="mt-1 text-sm text-cocoa-500">
          Your booking message for <strong>{shopName}</strong> is ready — just
          press send.
        </p>

        <a
          href={direct}
          target="_blank"
          rel="noreferrer"
          className="btn-wa mt-5 w-full py-3 text-base"
        >
          Open Chat · {pretty}
        </a>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={copyMessage} className="btn-outline py-2.5 text-xs">
            {copied ? "✅ Copied!" : "📋 Copy message"}
          </button>
          <a href={`tel:+${phone}`} className="btn-outline py-2.5 text-xs">
            📞 Call instead
          </a>
        </div>

        {qr ? (
          <div className="mt-6 rounded-2xl bg-cocoa-50 p-4">
            <img
              src={qr}
              alt="Scan to open this WhatsApp chat"
              className="mx-auto h-40 w-40 rounded-xl bg-white p-2"
            />
            <p className="mt-2 text-[11px] text-cocoa-500">
              On a computer? Scan this with your phone camera to open the same
              chat on WhatsApp.
            </p>
          </div>
        ) : null}

        <details className="mt-5 rounded-2xl bg-cocoa-50 p-4 text-left">
          <summary className="cursor-pointer text-xs font-semibold text-cocoa-700">
            Preview my message
          </summary>
          <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-[#dcf8c6] p-3 text-[12px] leading-relaxed text-cocoa-900">
            {message}
          </pre>
        </details>

        <Link
          href="/menu"
          className="mt-5 inline-block text-xs font-semibold text-cocoa-500 underline"
        >
          ← Back to the menu
        </Link>
      </div>
    </main>
  );
}
