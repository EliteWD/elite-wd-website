"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href, switchLocalePath, type Locale, type RouteKey } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import styles from "./GlobalNav.module.css";

type Props = {
  lang: Locale;
  common: Dictionary["common"];
};

const navRoutes: RouteKey[] = ["windows", "doors", "areas", "about", "contact"];

export function GlobalNav({ lang, common }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const otherLang: Locale = lang === "en" ? "es" : "en";

  // Close the mobile panel whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const labels: Record<RouteKey, string> = {
    home: site.shortName,
    windows: common.nav.windows,
    doors: common.nav.doors,
    areas: common.nav.areas,
    about: common.nav.about,
    contact: common.nav.contact,
  };

  const isCurrent = (route: RouteKey) => pathname === href(lang, route);

  return (
    <>
      <nav className={`${styles.nav} ${open ? styles.open : ""}`} aria-label="Main">
        <div className={`container ${styles.inner}`}>
          <Link href={href(lang, "home")} className={styles.logo} aria-label={site.name}>
            <Logo />
          </Link>

          <ul className={styles.links}>
            {navRoutes.map((route) => (
              <li key={route}>
                <Link
                  href={href(lang, route)}
                  className={styles.link}
                  aria-current={isCurrent(route) ? "page" : undefined}
                >
                  {labels[route]}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <span className={styles.desktopOnly}>
              <Link
                href={switchLocalePath(pathname, otherLang)}
                className={styles.lang}
                hrefLang={otherLang}
                lang={otherLang}
              >
                {common.language.switchTo}
              </Link>
            </span>
            <ButtonLink href={href(lang, "contact")} size="compact">
              {common.cta.estimateShort}
            </ButtonLink>
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? common.nav.close : common.nav.menu}
              onClick={() => setOpen((value) => !value)}
            >
              <span className={styles.bars} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <ul className={styles.panelLinks}>
          {(["home", ...navRoutes] as RouteKey[]).map((route) => (
            <li key={route}>
              <Link
                href={href(lang, route)}
                className={styles.panelLink}
                aria-current={isCurrent(route) ? "page" : undefined}
              >
                {route === "home" ? common.nav.home : labels[route]}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.panelMeta}>
          <div className={styles.panelRow}>
            <ButtonLink href={`tel:${site.contact.phoneHref}`} variant="outline">
              {common.cta.call} {site.contact.phone}
            </ButtonLink>
            <ButtonLink
              href={switchLocalePath(pathname, otherLang)}
              variant="outline"
              hrefLang={otherLang}
              lang={otherLang}
            >
              {common.language.switchTo}
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
