import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { hasLocale, htmlLang, locales } from "@/lib/i18n";
import { localBusinessJsonLd } from "@/lib/seo";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { RevealObserver } from "@/components/interactive/RevealObserver";
import { MetaPixelEvents } from "@/components/analytics/MetaPixel";
import { pixelBaseCode } from "@/lib/metaPixel";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const jsonLd = localBusinessJsonLd(lang, dict.meta.home.description);

  return (
    // suppressHydrationWarning: the inline script below adds the `js` class before hydration.
    <html lang={htmlLang[lang]} className={inter.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {site.metaPixelId && (
          <>
            {/* Inline so `fbq` exists before hydration; events come from MetaPixelEvents. */}
            <script dangerouslySetInnerHTML={{ __html: pixelBaseCode(site.metaPixelId) }} />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${site.metaPixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <GlobalNav lang={lang} common={dict.common} />
        <main id="main">{children}</main>
        <Footer lang={lang} common={dict.common} />
        <MobileActionBar lang={lang} common={dict.common} />
        <RevealObserver />
        {site.metaPixelId && <MetaPixelEvents />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
