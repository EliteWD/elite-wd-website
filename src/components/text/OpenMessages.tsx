"use client";

import { useEffect } from "react";

/** On phones, jump straight into the messages app; desktops stay on the page. */
export function OpenMessages({ href }: { href: string }) {
  useEffect(() => {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = href;
    }
  }, [href]);
  return null;
}
