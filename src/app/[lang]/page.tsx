import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/content/dictionaries";
import { site, allCities } from "@/content/site";
import { ProjectPlanner } from "@/components/interactive/ProjectPlanner";
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
  MediaHero,
  Photo,
  ProcessSteps,
  ProductCards,
  Section,
  SectionHeader,
  ServiceAreas,
  TrustBar,
} from "@/components/sections/Sections";
import { HeroVideo } from "@/components/visuals/HeroVideo";
import { heroVideo, images } from "@/content/images";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "home", getDictionary(lang).meta.home);
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  const { home, common, alt, contact } = getDictionary(lang);

  return (
    <>
      <AnnouncementStrip lang={lang} text={common.announcement} />

      <MediaHero
        label={home.hero.label}
        title={home.hero.title}
        subtitle={home.hero.subtitle}
        media={<HeroVideo src={heroVideo} poster={images.heroPoster} mobilePoster={images.homeExterior} alt={alt.homeExterior} />}
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
        <TrustBar items={home.trust} />
        <div style={{ height: "clamp(48px, 7vw, 90px)" }} aria-hidden="true" />
        <MediaFrame
          eyebrow={home.highlight.eyebrow}
          title={home.highlight.title}
          body={home.highlight.body}
          tagline={home.highlight.tagline}
          visual={<Image src={images.stormInterior} alt={alt.stormInterior} fill sizes="(max-width: 733px) 240vw, 100vw" placeholder="blur" />}
        />
      </Section>

      <Section surface="carbon" labelledBy="features-title">
        <SectionHeader id="features-title" title={home.features.title} />
        <FeatureTiles items={home.features.items} />
      </Section>

      <Section surface="obsidian" labelledBy="products-title">
        <SectionHeader id="products-title" title={home.products.title} body={home.products.body} center />
        <ProductCards
          items={[
            {
              ...home.products.windows,
              href: href(lang, "windows"),
              visual: <Photo src={images.windowProduct} alt={alt.windowProduct} ratio="4 / 5" sizes="(max-width: 833px) 90vw, 40vw" />,
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
              visual: <Photo src={images.doorOpen} alt={alt.doorOpen} ratio="4 / 5" sizes="(max-width: 833px) 90vw, 40vw" />,
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

      <Section surface="obsidian" id="planner" labelledBy="planner-title">
        <SectionHeader id="planner-title" title={home.planner.title} body={home.planner.body} center />
        <ProjectPlanner
          t={home.planner}
          projectOptions={contact.form.projectOptions}
          cities={allCities}
          contactHref={href(lang, "contact")}
        />
      </Section>

      <Section surface="carbon" labelledBy="areas-title">
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

      <Section surface="obsidian" labelledBy="faq-title">
        <SectionHeader id="faq-title" title={home.faq.title} center />
        <Faq items={home.faq.items} />
      </Section>

      <Section surface="carbon">
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
