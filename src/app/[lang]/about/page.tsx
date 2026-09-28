import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import {
  CtaBand,
  OptionGrid,
  PageHero,
  ProcessSteps,
  Section,
  SectionHeader,
  TrustBar,
} from "@/components/sections/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "about", getDictionary(lang).meta.about);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const lang = (await params).lang as Locale;
  const { about: t, home, common } = getDictionary(lang);

  return (
    <>
      <PageHero label={t.hero.label} title={t.hero.title} subtitle={t.hero.subtitle} />

      <Section surface="carbon" labelledBy="story-title">
        <SectionHeader id="story-title" title={t.story.title} />
        <div style={{ maxWidth: 760, display: "grid", gap: 24 }}>
          {t.story.paragraphs.map((paragraph) => (
            <p key={paragraph} className="t-lead muted">
              {paragraph}
            </p>
          ))}
        </div>
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
        <SectionHeader id="process-title" title={home.process.title} />
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
