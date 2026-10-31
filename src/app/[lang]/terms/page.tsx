import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { PageHero, Section } from "@/components/sections/Sections";
import styles from "../privacy/privacy.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "terms", getDictionary(lang).meta.terms);
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const lang = (await params).lang as Locale;
  const { terms: t } = getDictionary(lang);

  return (
    <>
      <PageHero label={t.label} title={t.title} subtitle={t.updated} />

      <Section surface="carbon" tight>
        <article className={styles.policy}>
          <p className="t-lead">{t.intro}</p>

          {t.sections.map((section) => (
            <section key={section.title}>
              <h2 className="t-title">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="t-body">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="t-title">{t.contact.title}</h2>
            <p className="t-body">{t.contact.body}</p>
            <ul className={styles.contact}>
              <li className="t-body">{site.name}, {site.region.name}</li>
              <li className="t-body">
                <a href={`mailto:${site.contact.email}`} className="link">{site.contact.email}</a>
              </li>
              <li className="t-body">
                <a href={`tel:${site.contact.phoneHref}`} className="link">{site.contact.phone}</a>
              </li>
            </ul>
          </section>
        </article>
      </Section>
    </>
  );
}
