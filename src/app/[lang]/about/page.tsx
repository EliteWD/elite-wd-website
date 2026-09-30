import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary } from "@/content/dictionaries";
import { images } from "@/content/images";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import {
  CtaBand,
  MediaHero,
  OptionGrid,
  Photo,
  ProcessSteps,
  Section,
  SectionHeader,
  Split,
  TrustBar,
} from "@/components/sections/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "about", getDictionary(lang).meta.about);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const lang = (await params).lang as Locale;
  const { about: t, home, common, alt } = getDictionary(lang);

  return (
    <>
      <MediaHero
        compact
        label={t.hero.label}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        media={<Image src={images.frontElevation} alt={alt.frontElevation} fill priority sizes="(max-width: 733px) 180vw, 100vw" placeholder="blur" />}
      />

      <Section surface="carbon" labelledBy="story-title">
        <Split
          id="story-title"
          title={t.story.title}
          body={t.story.paragraphs}
          visual={<Photo src={images.installHands} alt={alt.installHands} />}
        />
      </Section>

      <Section surface="obsidian" labelledBy="credentials-title">
        <SectionHeader id="credentials-title" title={t.credentials.title} body={t.credentials.body} />
        <TrustBar items={home.trust} />
      </Section>

      <Section surface="carbon" labelledBy="values-title">
        <SectionHeader id="values-title" title={t.values.title} />
        <OptionGrid items={t.values.items} />
      </Section>

      <Section surface="obsidian" labelledBy="process-title">
        <Split
          id="process-title"
          title={home.process.title}
          body={[]}
          visual={<Photo src={images.consultation} alt={alt.consultation} />}
        />
        <div style={{ height: "clamp(48px, 6vw, 72px)" }} aria-hidden="true" />
        <ProcessSteps steps={home.process.steps} />
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
