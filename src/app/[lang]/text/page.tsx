import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { PageHero, Section } from "@/components/sections/Sections";
import { ButtonLink } from "@/components/ui/Button";
import { OpenMessages } from "@/components/text/OpenMessages";

/**
 * Bridge page for the welcome email's "Text me" button. Email apps and
 * GoHighLevel's click tracking break sms: links, so the email links here and
 * this page opens the messages app. Not in the menu or sitemap; not indexed.
 */
export async function generateMetadata({ params }: PageProps<"/[lang]/text">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return { title: getDictionary(lang).textUs.metaTitle, robots: { index: false, follow: false } };
}

export default async function TextPage({ params }: PageProps<"/[lang]/text">) {
  const lang = (await params).lang as Locale;
  const { textUs: t } = getDictionary(lang);
  // "?&body=" is the form both iOS and Android accept for a prefilled message.
  const smsHref = `sms:${site.contact.smsHref}?&body=${encodeURIComponent(t.message)}`;

  return (
    <>
      <OpenMessages href={smsHref} />
      <PageHero
        label={t.label}
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <>
            <ButtonLink href={smsHref} size="large">
              {t.send}
            </ButtonLink>
            <ButtonLink href={`tel:${site.contact.phoneHref}`} variant="outline" size="large">
              {t.call} {site.contact.phone}
            </ButtonLink>
          </>
        }
      />
      <Section surface="carbon" tight>
        <p className="t-body" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          {t.body}
          <br />
          <br />
          {t.desktop} <strong>{site.contact.sms}</strong>
        </p>
      </Section>
    </>
  );
}
