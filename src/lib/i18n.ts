export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Site routes, shared by both languages. `""` is the home page. */
export const routes = {
  home: "",
  windows: "impact-windows",
  doors: "impact-doors",
  areas: "service-areas",
  about: "about",
  contact: "contact",
} as const;

export type RouteKey = keyof typeof routes;

export function href(lang: Locale, route: RouteKey, hash?: string) {
  const path = routes[route];
  const base = path ? `/${lang}/${path}` : `/${lang}`;
  return hash ? `${base}#${hash}` : base;
}

/** Swap the locale segment of a pathname, keeping the rest of the path. */
export function switchLocalePath(pathname: string, target: Locale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && hasLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}

export const htmlLang: Record<Locale, string> = { en: "en-US", es: "es-US" };
export const ogLocale: Record<Locale, string> = { en: "en_US", es: "es_US" };
