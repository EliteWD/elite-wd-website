import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary } from "@/content/dictionaries";
import { images } from "@/content/images";
import { site, allCities } from "@/content/site";
import { AreaChecker } from "@/components/interactive/AreaChecker";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand, MediaHero, Section, ServiceAreas } from "@/components/sections/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]/service-areas">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "areas", getDictionary(lang).meta.areas);
}

export default async function AreasPage({ params }: PageProps<"/[lang]/service-areas">) {
  const lang = (await params).lang as Locale;
  const { areas: t, home, common, alt } = getDictionary(lang);

  return (
    <>
      <MediaHero
        compact
        label={t.hero.label}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        media={<Image src={images.aerial} alt={alt.aerial} fill priority sizes="(max-width: 733px) 180vw, 100vw" placeholder="blur" />}
      />

      <Section surface="obsidian" tight>
        <AreaChecker
          t={t.checker}
          cities={allCities}
          contactHref={href(lang, "contact")}
          phone={site.contact.phone}
          phoneHref={site.contact.phoneHref}
        />
        <div style={{ height: "clamp(48px, 6vw, 72px)" }} aria-hidden="true" />
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

      <Section surface="carbon">
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
