import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { LocalNav } from "@/components/layout/LocalNav";
import { ButtonLink } from "@/components/ui/Button";
import {
  CtaBand,
  Note,
  OptionGrid,
  Section,
  SectionHeader,
  Photo,
  Split,
  StageHero,
} from "@/components/sections/Sections";
import { images } from "@/content/images";
import { GlassSimulator } from "@/components/interactive/GlassSimulator";

export async function generateMetadata({ params }: PageProps<"/[lang]/impact-windows">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return pageMetadata(lang, "windows", getDictionary(lang).meta.windows);
}

export default async function WindowsPage({ params }: PageProps<"/[lang]/impact-windows">) {
  const lang = (await params).lang as Locale;
  const { windows: t, home, common, alt } = getDictionary(lang);

  return (
    <>
      <LocalNav
        title={common.nav.windows}
        links={[
          { id: "overview", label: t.localNav.overview },
          { id: "styles", label: t.localNav.styles },
          { id: "glass", label: t.localNav.glass },
          { id: "frames", label: t.localNav.frames },
        ]}
        cta={{ href: href(lang, "contact"), label: common.cta.estimateShort }}
      />

      <StageHero
        label={t.hero.label}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        visual={<Photo src={images.windowProduct} alt={alt.windowProduct} ratio="4 / 5" sizes="(max-width: 833px) 88vw, 480px" priority />}
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
          visual={<Photo src={images.glassMacro} alt={alt.glassMacro} />}
        />
      </Section>

      <Section surface="obsidian" id="styles" labelledBy="styles-title">
        <SectionHeader id="styles-title" title={t.styles.title} />
        {/* Photos follow the dictionary order: single-hung, horizontal roller, picture, custom shapes. */}
        <OptionGrid
          items={t.styles.items.map((item, i) => ({
            ...item,
            image: [
              { src: images.styleSingleHung, alt: alt.styleSingleHung },
              { src: images.styleHorizontalRoller, alt: alt.styleHorizontalRoller },
              { src: images.stylePicture, alt: alt.stylePicture },
              { src: images.styleCustomShape, alt: alt.styleCustomShape },
            ][i],
          }))}
          columns={2}
          numbered
        />
      </Section>

      <Section surface="carbon" id="glass" labelledBy="glass-title">
        <SectionHeader id="glass-title" title={t.glass.title} body={t.glass.body} />
        <GlassSimulator
          photo={images.windowProduct}
          alt={alt.windowProduct}
          options={t.glass.items}
          label={t.glass.simulator.label}
          note={t.glass.simulator.note}
        />
      </Section>

      <Section surface="obsidian" id="frames" labelledBy="frames-title">
        <SectionHeader id="frames-title" title={t.frames.title} />
        <OptionGrid items={t.frames.items} columns={2} />
        <Note>{t.frames.note}</Note>
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
