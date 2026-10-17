/**
 * Meta Pixel helpers. The base snippet (MetaPixelScript) defines `fbq` with a
 * queue before hydration, so events fired from effects are never lost.
 *
 * Funnel split (see GoHighLevel Conversions API): the pixel reports what
 * happens on the site — PageView, ViewContent, Contact, Lead. GoHighLevel
 * reports what happens later in the CRM (Schedule, Purchase…), never Lead,
 * so Meta doesn't count a form submission twice.
 */

type Fbq = (command: "init" | "track" | "trackCustom", ...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export type PixelEvent = "PageView" | "ViewContent" | "Contact" | "Lead";

export function track(event: PixelEvent, params?: Record<string, string | number>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}

/** Official base code, minus its PageView — MetaPixelEvents sends that on every route. */
export const pixelBaseCode = (pixelId: string) =>
  `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
  `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;` +
  `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;` +
  `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}` +
  `(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
  `fbq('init','${pixelId}');`;
