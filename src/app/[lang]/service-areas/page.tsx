import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand, PageHero, Section, ServiceAreas } from "@/components/sections/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]/service-areas">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "areas", getDictionary(lang).meta.areas);
}

export default async function AreasPage({ params }: PageProps<"/[lang]/service-areas">) {
  const lang = (await params).lang as Locale;
  const { areas: t, home, common } = getDictionary(lang);

  return (
    <>
      <PageHero label={t.hero.label} title={t.hero.title} subtitle={t.hero.subtitle} />

      <Section surface="carbon" tight>
        <ServiceAreas
          areas={site.serviceAreas}
          footer={
            <p className="t-body">
              {t.note}{" "}
              <a href={`tel:${site.contact.phoneHref}`} className="link">
                {site.contact.phone}
              </a>
            </p>
          }
        />
      </Section>

      <Section surface="obsidian">
        <CtaBand
          title={home.cta.title}
          body={home.cta.body}
          actions={
            <ButtonLink href={href(lang, "contact")} size="large">
              {common.cta.estimate}
            </ButtonLink>
          }
        />
      </Section>
    </>
  );
}
