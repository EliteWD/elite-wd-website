import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site, allCities } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { PageHero, Section } from "@/components/sections/Sections";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./contact.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "contact", getDictionary(lang).meta.contact);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const lang = (await params).lang as Locale;
  const { contact: t, common } = getDictionary(lang);
  const counties = site.serviceAreas.map((area) => area.county).join(" · ");

  return (
    <>
      <PageHero label={t.hero.label} title={t.hero.title} subtitle={t.hero.subtitle} />

      <Section surface="obsidian" tight>
        <div className={styles.layout}>
          <div className={styles.formPanel}>
            <EstimateForm
              lang={lang}
              t={t.form}
              cities={allCities}
              endpoint={site.formEndpoint}
              phone={site.contact.phone}
              phoneHref={site.contact.phoneHref}
            />
          </div>

          <aside className={styles.info} aria-labelledby="info-title">
            <h2 id="info-title" className="t-product-name">
              {t.info.title}
            </h2>
            <dl className={styles.infoList}>
              <div>
                <dt>{t.info.phone}</dt>
                <dd><a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a></dd>
              </div>
              <div>
                <dt>{t.info.email}</dt>
                <dd><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></dd>
              </div>
              <div>
                <dt>{t.info.hours}</dt>
                <dd className="t-small">{site.hours[lang]}</dd>
              </div>
              <div>
                <dt>{t.info.area}</dt>
                <dd className="t-small">{counties}</dd>
              </div>
            </dl>
            <ButtonLink href={`tel:${site.contact.phoneHref}`} variant="outline" block>
              {common.cta.call} {site.contact.phone}
            </ButtonLink>
            {site.contact.whatsapp && (
              <ButtonLink
                href={`https://wa.me/${site.contact.whatsapp}`}
                variant="outline"
                block
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </ButtonLink>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
