import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { href, locales, routes, type RouteKey } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return (Object.keys(routes) as RouteKey[]).flatMap((route) =>
    locales.map((lang) => ({
      url: `${site.url}${href(lang, route)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "home" ? 1 : route === "contact" ? 0.9 : 0.8,
      alternates: {
        languages: {
          "en-US": `${site.url}${href("en", route)}`,
          "es-US": `${site.url}${href("es", route)}`,
        },
      },
    })),
  );
}
