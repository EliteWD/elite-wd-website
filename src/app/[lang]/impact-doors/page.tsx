import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { LocalNav } from "@/components/layout/LocalNav";
import { ButtonLink } from "@/components/ui/Button";
import {
  CtaBand,
  FeatureTiles,
  OptionGrid,
  Photo,
  Section,
  SectionHeader,
  Split,
  StageHero,
} from "@/components/sections/Sections";
import { images } from "@/content/images";

export async function generateMetadata({ params }: PageProps<"/[lang]/impact-doors">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "doors", getDictionary(lang).meta.doors);
}

export default async function DoorsPage({ params }: PageProps<"/[lang]/impact-doors">) {
  const lang = (await params).lang as Locale;
  const { doors: t, home, common, alt } = getDictionary(lang);

  return (
    <>
      <LocalNav
        title={common.nav.doors}
        links={[
          { id: "overview", label: t.localNav.overview },
          { id: "styles", label: t.localNav.styles },
          { id: "details", label: t.localNav.details },
        ]}
        cta={{ href: href(lang, "contact"), label: common.cta.estimateShort }}
      />

      <StageHero
        label={t.hero.label}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        visual={<Photo src={images.doorOpen} alt={alt.doorOpen} ratio="4 / 5" sizes="(max-width: 833px) 88vw, 480px" priority />}
        actions={
          <>
            <ButtonLink href={href(lang, "contact")}>{common.cta.estimate}</ButtonLink>
            <ButtonLink href={`tel:${site.contact.phoneHref}`} variant="outline">
              {common.cta.call} {site.contact.phone}
            </ButtonLink>
          </>
        }
      />

      <Section surface="carbon" id="overview" labelledBy="overview-title">
        <Split
          id="overview-title"
          title={t.overview.title}
          body={t.overview.body}
          visual={<Photo src={images.lockDetail} alt={alt.lockDetail} />}
        />
      </Section>

      <Section surface="obsidian" id="styles" labelledBy="styles-title">
        <SectionHeader id="styles-title" title={t.styles.title} />
        <OptionGrid items={t.styles.items} columns={2} numbered />
      </Section>

      <Section surface="carbon" id="details" labelledBy="details-title">
        <SectionHeader id="details-title" title={t.details.title} />
        <FeatureTiles items={t.details.items} />
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
