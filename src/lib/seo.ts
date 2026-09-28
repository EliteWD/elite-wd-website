import type { Metadata } from "next";
import { site, allCities } from "@/content/site";
import { href, locales, ogLocale, type Locale, type RouteKey } from "./i18n";

type PageMeta = { title: string; description: string };

/** Per-page metadata with canonical + hreflang alternates for both languages. */
export function pageMetadata(
  lang: Locale,
  route: RouteKey,
  meta: PageMeta,
): Metadata {
  const languages = Object.fromEntries(
    locales.map((l) => [l === "en" ? "en-US" : "es-US", href(l, route)]),
  );

  return {
    title: route === "home" ? { absolute: `${meta.title} | ${site.name}` } : meta.title,
    description: meta.description,
    alternates: {
      canonical: href(lang, route),
      languages: { ...languages, "x-default": href("en", route) },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      url: href(lang, route),
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

/** schema.org LocalBusiness data for search engines. Omits unknown fields. */
export function localBusinessJsonLd(lang: Locale, description: string) {
  const { address, contact, social } = site;
  const sameAs = Object.values(social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description,
    url: `${site.url}${href(lang, "home")}`,
    telephone: contact.phoneHref,
    email: contact.email,
    inLanguage: lang === "en" ? "en-US" : "es-US",
    address: {
      "@type": "PostalAddress",
      ...(address.street && { streetAddress: address.street }),
      addressLocality: address.city,
      addressRegion: address.region,
      ...(address.postalCode && { postalCode: address.postalCode }),
      addressCountry: address.country,
    },
    areaServed: allCities.map((city) => ({
      "@type": "City",
      name: `${city}, FL`,
    })),
    openingHours: site.hours.schema,
    ...(sameAs.length > 0 && { sameAs }),
  };
}
