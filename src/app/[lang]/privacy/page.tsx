import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { PageHero, Section } from "@/components/sections/Sections";
import styles from "./privacy.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "privacy", getDictionary(lang).meta.privacy);
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const lang = (await params).lang as Locale;
  const { privacy: t } = getDictionary(lang);

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
              {"links" in section && section.links && (
                <ul className={styles.links}>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="link link-arrow" target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
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
