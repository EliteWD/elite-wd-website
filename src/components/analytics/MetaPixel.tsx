"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/i18n";
import { track } from "@/lib/metaPixel";

const products: Record<string, string> = {
  [routes.windows]: "Impact Windows",
  [routes.doors]: "Impact Doors",
};

/**
 * Fires PageView on every route (client-side navigations included),
 * ViewContent on the product pages, and Contact on any phone/WhatsApp tap.
 */
export function MetaPixelEvents() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    // Dev Strict Mode runs effects twice; only count real navigations.
    if (last.current === pathname) return;
    last.current = pathname;

    track("PageView");
    const product = products[pathname.split("/")[2] ?? ""];
    if (product) track("ViewContent", { content_name: product, content_category: "Product page" });
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) track("Contact", { method: "phone" });
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track("Contact", { method: "whatsapp" });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
