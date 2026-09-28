"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `is-revealed` to every [data-reveal] element as it scrolls into view.
 * Content is only hidden when `html.js` is set (see layout), so pages stay
 * fully visible without JavaScript and for reduced-motion visitors (CSS).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
