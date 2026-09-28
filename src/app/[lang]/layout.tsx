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
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <GlobalNav lang={lang} common={dict.common} />
        <main id="main">{children}</main>
        <Footer lang={lang} common={dict.common} />
        <MobileActionBar lang={lang} common={dict.common} />
        <RevealObserver />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
