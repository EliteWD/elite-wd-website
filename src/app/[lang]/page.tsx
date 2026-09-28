import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { AnnouncementStrip } from "@/components/layout/AnnouncementStrip";
import { ButtonLink, Capsule } from "@/components/ui/Button";
import {
  ComparisonPanel,
  CtaBand,
  Faq,
  FeatureTiles,
  MediaFrame,
  ProcessSteps,
  ProductCards,
  Section,
  SectionHeader,
  ServiceAreas,
  StageHero,
} from "@/components/sections/Sections";
import { OpeningRender } from "@/components/visuals/OpeningRender";
import { GlassSection } from "@/components/visuals/GlassSection";
import { StormScene } from "@/components/visuals/StormScene";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "home", getDictionary(lang).meta.home);
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  const { home, common } = getDictionary(lang);

  const tiles = home.features.items.map((item, i) =>
    i === 0 ? { ...item, visual: <GlassSection labels={home.glassLabels} /> } : item,
  );

  return (
    <>
      <AnnouncementStrip lang={lang} text={common.announcement} />

      <StageHero
        label={home.hero.label}
        title={home.hero.title}
        subtitle={home.hero.subtitle}
        visual={<OpeningRender id="hero-window" />}
        actions={
          <>
            <Capsule>{home.hero.capsule}</Capsule>
            <ButtonLink href={href(lang, "contact")}>{common.cta.estimate}</ButtonLink>
            <ButtonLink href={`tel:${site.contact.phoneHref}`} variant="outline">
              {common.cta.call} {site.contact.phone}
            </ButtonLink>
          </>
        }
      />

      <Section surface="obsidian" tight>
        <MediaFrame
          eyebrow={home.highlight.eyebrow}
          title={home.highlight.title}
          body={home.highlight.body}
          visual={<StormScene />}
        />
      </Section>

      <Section surface="carbon" labelledBy="features-title">
        <SectionHeader id="features-title" title={home.features.title} />
        <FeatureTiles items={tiles} />
      </Section>

      <Section surface="obsidian" labelledBy="products-title">
        <SectionHeader id="products-title" title={home.products.title} center />
        <ProductCards
          items={[
            {
              ...home.products.windows,
              href: href(lang, "windows"),
              visual: <OpeningRender id="card-window" />,
              actions: (
                <>
                  <ButtonLink href={href(lang, "windows")} size="compact">
                    {common.cta.learnMore}
                  </ButtonLink>
                  <ButtonLink href={href(lang, "contact")} size="compact" variant="outline">
                    {common.cta.estimateShort}
                  </ButtonLink>
                </>
              ),
            },
            {
              ...home.products.doors,
              href: href(lang, "doors"),
              visual: <OpeningRender id="card-door" variant="door" />,
              actions: (
                <>
                  <ButtonLink href={href(lang, "doors")} size="compact">
                    {common.cta.learnMore}
                  </ButtonLink>
                  <ButtonLink href={href(lang, "contact")} size="compact" variant="outline">
                    {common.cta.estimateShort}
                  </ButtonLink>
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section surface="obsidian" tight>
        <ComparisonPanel
          title={home.comparison.title}
          subtitle={home.comparison.subtitle}
          columns={[home.comparison.impact, home.comparison.shutters]}
          rows={home.comparison.rows}
        />
      </Section>

      <Section surface="carbon" labelledBy="process-title">
        <SectionHeader id="process-title" title={home.process.title} />
        <ProcessSteps steps={home.process.steps} />
      </Section>

      <Section surface="obsidian" labelledBy="areas-title">
        <SectionHeader id="areas-title" title={home.areas.title} body={home.areas.body} center />
        <ServiceAreas
          areas={site.serviceAreas}
          footer={
            <Link href={href(lang, "areas")} className="link link-arrow">
              {common.cta.viewAll}
            </Link>
          }
        />
      </Section>

      <Section surface="carbon" labelledBy="faq-title">
        <SectionHeader id="faq-title" title={home.faq.title} center />
        <Faq items={home.faq.items} />
      </Section>

      <Section surface="obsidian">
        <CtaBand
          title={home.cta.title}
          body={home.cta.body}
          actions={
            <>
              <ButtonLink href={href(lang, "contact")} size="large">
                {common.cta.estimate}
              </ButtonLink>
              <ButtonLink href={`tel:${site.contact.phoneHref}`} size="large" variant="outline">
                {common.cta.call} {site.contact.phone}
              </ButtonLink>
            </>
          }
        />
      </Section>
    </>
  );
}
