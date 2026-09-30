import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Per-item delay for the scroll reveal (see globals.css). */
const stagger = (i: number) => ({ "--i": i % 6 }) as CSSProperties;
import s from "./sections.module.css";

type Surface = "obsidian" | "carbon" | "carbonFlat" | "porcelain";

/** Full-width band on one of the four surfaces from the style reference. */
export function Section({
  surface = "obsidian",
  tight,
  id,
  labelledBy,
  children,
}: {
  surface?: Surface;
  tight?: boolean;
  id?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tight ? s.sectionTight : s.section} ${s[surface]}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeader({
  id,
  title,
  body,
  center,
}: {
  id?: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <header className={`${s.header} ${center ? s.headerCenter : ""}`} data-reveal>
      <h2 id={id} className="t-headline">
        {title}
      </h2>
      {body && <p className="t-lead">{body}</p>}
    </header>
  );
}

/** Hero Product Stage — photoreal subject on black, copy + actions along the lower edge. */
export function StageHero({
  label,
  title,
  subtitle,
  visual,
  wide,
  actions,
}: {
  label: string;
  title: string;
  subtitle?: string;
  visual: ReactNode;
  wide?: boolean;
  actions?: ReactNode;
}) {
  return (
    <section className={s.stage} aria-labelledby="hero-title">
      <div className={`${s.stageVisual} ${wide ? s.stageVisualWide : ""}`}>{visual}</div>
      <div className={`${s.stageCopy} ${s.stageCopyFramed}`}>
        <p className={`t-product-name ${s.stageLabel}`}>{label}</p>
        <h1 id="hero-title" className={`t-display ${s.stageTitle}`}>
          {title}
        </h1>
        {subtitle && <p className={`t-lead ${s.stageSubtitle}`}>{subtitle}</p>}
        {actions && <div className={s.actions}>{actions}</div>}
      </div>
    </section>
  );
}

/** Text-only hero for secondary pages. */
export function PageHero({
  label,
  title,
  subtitle,
  actions,
}: {
  label: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={`${s.pageHero} ${s.obsidian}`} aria-labelledby="hero-title">
      <div className="container">
        <p className={`t-product-name ${s.stageLabel}`}>{label}</p>
        <h1 id="hero-title" className={`t-display ${s.stageTitle}`}>
          {title}
        </h1>
        {subtitle && <p className={`t-lead ${s.stageSubtitle}`}>{subtitle}</p>}
        {actions && <div className={s.actions}>{actions}</div>}
      </div>
    </section>
  );
}

/**
 * Full-bleed media hero: video or photograph fills the stage, copy sits on
 * the lower edge over a gradient into Obsidian.
 */
export function MediaHero({
  label,
  title,
  subtitle,
  media,
  actions,
  compact,
}: {
  label: string;
  title: string;
  subtitle?: string;
  media: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`${s.mediaHero} ${compact ? s.mediaHeroCompact : ""}`} aria-labelledby="hero-title">
      <div className={s.mediaHeroMedia}>{media}</div>
      <div className={s.mediaHeroShade} aria-hidden="true" />
      <div className={`container ${s.mediaHeroCopy}`}>
        <p className={`t-product-name ${s.stageLabel}`}>{label}</p>
        <h1 id="hero-title" className={`t-display ${s.stageTitle}`}>
          {title}
        </h1>
        {subtitle && <p className={`t-lead ${s.mediaHeroSubtitle}`}>{subtitle}</p>}
        {actions && <div className={s.actions}>{actions}</div>}
      </div>
    </section>
  );
}

/** Photograph in a 28px media frame (no shadow, per the reference). */
export function Photo({
  src,
  alt,
  ratio = "4 / 3",
  sizes = "(max-width: 833px) 100vw, 50vw",
  priority,
  className,
}: {
  src: StaticImageData;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`${s.photo} ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" priority={priority} />
    </div>
  );
}

/** Row of credentials (experience, insurance, approvals). */
export function TrustBar({ items }: { items: { stat: string; label: string }[] }) {
  return (
    <ul className={s.trust} data-reveal>
      {items.map((item) => (
        <li key={item.stat} className={s.trustItem}>
          <span className={`t-feature-stat ${s.trustStat}`}>{item.stat}</span>
          <span className={`t-small ${s.trustLabel}`}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Highlights Media Frame — contained cinematic visual with copy overlaid. */
export function MediaFrame({
  eyebrow,
  title,
  body,
  tagline,
  visual,
}: {
  eyebrow: string;
  title: string;
  body: string;
  /** Optional emphasized closing line, kept inside the body paragraph so the frame's layout is unchanged. */
  tagline?: string;
  visual: ReactNode;
}) {
  return (
    <figure className={s.media} data-reveal>
      <div className={s.mediaVisual}>{visual}</div>
      <div className={s.mediaShade} aria-hidden="true" />
      <figcaption className={s.mediaCopy}>
        <p className="t-product-label">{eyebrow}</p>
        <p className="t-headline">{title}</p>
        <p className="t-body">
          {body}
          {tagline && (
            <>
              <br />
              <strong>{tagline}</strong>
            </>
          )}
        </p>
      </figcaption>
    </figure>
  );
}

export type Tile = { stat: string; label: string; body: string; visual?: ReactNode; wide?: boolean };

/** Grid of Feature Metric Tiles. */
export function FeatureTiles({ items }: { items: Tile[] }) {
  return (
    <ul className={s.tiles}>
      {items.map((item, i) => (
        <li key={item.stat} className={`${s.tile} ${item.wide ? s.tileWide : ""}`} data-reveal style={stagger(i)}>
          {item.visual && <div className={s.tileVisual}>{item.visual}</div>}
          <p className={`t-feature-stat ${s.tileStat}`}>{item.stat}</p>
          <p className={`t-body ${s.tileLabel}`}>{item.label}</p>
          <p className={`t-small ${s.tileBody}`}>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function ProductCards({
  items,
}: {
  items: { name: string; tagline: string; body: string; href: string; visual: ReactNode; actions: ReactNode }[];
}) {
  return (
    <div className={s.products}>
      {items.map((item, i) => (
        <article key={item.name} className={s.product} data-reveal style={stagger(i)}>
          <h3 className="t-product-name">
            <Link href={item.href}>{item.name}</Link>
          </h3>
          <p className={`t-lead ${s.productTagline}`}>{item.tagline}</p>
          <p className={`t-small ${s.productBody}`}>{item.body}</p>
          <div className={s.productActions}>{item.actions}</div>
          <div className={s.productVisual}>{item.visual}</div>
        </article>
      ))}
    </div>
  );
}

/** Upgrade Comparison Panel with a Pale Comparison Card table inside. */
export function ComparisonPanel({
  title,
  subtitle,
  columns,
  rows,
}: {
  title: string;
  subtitle: string;
  columns: [string, string];
  rows: { label: string; impact: string; shutters: string }[];
}) {
  return (
    <div className={s.panel} data-reveal>
      <SectionHeader title={title} body={subtitle} />
      <div className={s.paleCard}>
        <table className={s.table}>
          <thead>
            <tr>
              <td />
              <th scope="col">{columns[0]}</th>
              <th scope="col">{columns[1]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td className={s.yes}>
                  <svg className={s.check} viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {row.impact}
                </td>
                <td className={s.no}>{row.shutters}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProcessSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className={s.steps}>
      {steps.map((step, i) => (
        <li key={step.title} className={s.step} data-reveal style={stagger(i)}>
          <h3 className="t-product-label">{step.title}</h3>
          <p className="t-small">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function ServiceAreas({
  areas,
  footer,
}: {
  areas: { county: string; cities: string[] }[];
  footer?: ReactNode;
}) {
  return (
    <>
      <div className={s.counties}>
        {areas.map((area, i) => (
          <div key={area.county} className={s.county} data-reveal style={stagger(i)}>
            <h3 className="t-product-label">{area.county}</h3>
            <ul className={s.chips}>
              {area.cities.map((city) => (
                <li key={city} className={s.chip}>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {footer && <div className={s.areasFooter}>{footer}</div>}
    </>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className={s.faq} data-reveal>
      {items.map((item) => (
        <details key={item.q} className={s.faqItem}>
          <summary className="t-product-label">
            {item.q}
            <span className={s.faqIcon} aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="t-body">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ title, body, actions }: { title: string; body: string; actions: ReactNode }) {
  return (
    <div className={s.cta} data-reveal>
      <h2 className="t-headline">{title}</h2>
      <p className="t-lead">{body}</p>
      <div className={s.actions}>{actions}</div>
    </div>
  );
}

export function OptionGrid({
  items,
  columns = 3,
  numbered,
}: {
  items: { name: string; body: string; image?: { src: StaticImageData; alt: string } }[];
  columns?: 2 | 3 | 4;
  numbered?: boolean;
}) {
  const colClass = columns === 2 ? s.options2 : columns === 4 ? s.options4 : "";
  return (
    <ul className={`${s.options} ${colClass}`}>
      {items.map((item, i) => (
        <li key={item.name} className={s.option} data-reveal style={stagger(i)}>
          {item.image && (
            <Photo
              src={item.image.src}
              alt={item.image.alt}
              className={s.optionPhoto}
              sizes={columns === 2 ? "(max-width: 733px) 90vw, 45vw" : "(max-width: 733px) 90vw, 30vw"}
            />
          )}
          {numbered && <span className={`t-caption ${s.optionIndex}`}>{String(i + 1).padStart(2, "0")}</span>}
          <h3 className="t-product-label">{item.name}</h3>
          <p className="t-small">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={`t-small ${s.note}`}>{children}</p>;
}

export function Split({ title, body, visual, id }: { title: string; body: string | string[]; visual: ReactNode; id?: string }) {
  return (
    <div className={s.split} data-reveal>
      <div>
        <h2 id={id} className="t-headline">
          {title}
        </h2>
        {(Array.isArray(body) ? body : [body]).map((paragraph) => (
          <p key={paragraph} className="t-lead">
            {paragraph}
          </p>
        ))}
      </div>
      <div className={s.splitVisual}>{visual}</div>
    </div>
  );
}
