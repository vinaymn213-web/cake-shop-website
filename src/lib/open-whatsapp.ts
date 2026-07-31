/**
 * Opens our same-origin /wa launcher (which then forwards to WhatsApp).
 *
 * IMPORTANT: `window.open(url, "_blank", "noopener")` returns null in Chrome
 * even when the popup succeeded, which previously made the code fall back to
 * `window.location.href` and navigate the iframe straight into WhatsApp —
 * producing "api.whatsapp.com refused to connect (ERR_BLOCKED_BY_RESPONSE)".
 * So we open without the noopener feature and null the opener afterwards.
 */
export function openWhatsApp(launchUrl: string): void {
  let popup: Window | null = null;

  try {
    popup = window.open(launchUrl, "_blank");
  } catch {
    popup = null;
  }

  if (popup) {
    try {
      popup.opener = null;
    } catch {
      /* ignore */
    }
    return;
  }

  // Popup blocked — navigating to our OWN page is always safe (no
  // X-Frame-Options), and that page handles the hand-off to WhatsApp.
  window.location.href = launchUrl;
}
