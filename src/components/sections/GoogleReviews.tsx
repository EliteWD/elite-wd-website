import type { Locale } from "@/lib/i18n";
import { getGoogleReviews, googleReviewUrl } from "@/lib/googleReviews";
import type { Dictionary } from "@/content/dictionaries";
import { Section, SectionHeader } from "./Sections";
import s from "./reviews.module.css";

type T = Dictionary["home"]["reviews"];

function Stars({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className={s.stars} role="img" aria-label={label}>
      <span className={s.starsBase} aria-hidden="true">★★★★★</span>
      <span className={s.starsFill} style={{ width: `${pct}%` }} aria-hidden="true">★★★★★</span>
    </span>
  );
}

/**
 * Real Google reviews, fetched on the server. Renders nothing until the
 * Google Business Profile has at least one review and the API is configured.
 */
export async function GoogleReviews({ lang, t }: { lang: Locale; t: T }) {
  const data = await getGoogleReviews(lang);
  if (!data) return null;

  const rating = data.rating.toFixed(1);
  const starsLabel = (n: number | string) => t.starsLabel.replace("{n}", String(n));

  return (
    <Section surface="obsidian" id="reviews" labelledBy="reviews-title">
      <SectionHeader id="reviews-title" title={t.title} center />

      <div className={s.summary} data-reveal>
        <span className={`t-feature-stat ${s.score}`}>{rating}</span>
        <Stars value={data.rating} label={starsLabel(rating)} />
        <a href={data.mapsUri} target="_blank" rel="noopener" className="link t-small">
          {t.basedOn.replace("{n}", String(data.total))}
        </a>
        {data.sample && <span className={`t-small ${s.sample}`}>DEV SAMPLE — not shown in production</span>}
      </div>

      <ul className={s.grid}>
        {data.reviews.map((r, i) => (
          <li key={`${r.author}-${i}`} className={s.card} data-reveal>
            <Stars value={r.rating} label={starsLabel(r.rating)} />
            {r.text && <p className={`t-body ${s.text}`}>{r.text}</p>}
            <div className={s.author}>
              {r.authorPhoto ? (
                // Google-hosted profile photo; plain <img> keeps it off the image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.authorPhoto} alt="" width={36} height={36} className={s.avatar} referrerPolicy="no-referrer" loading="lazy" />
              ) : (
                <span className={s.avatar} aria-hidden="true">{r.author.charAt(0)}</span>
              )}
              <span>
                {r.authorUri ? (
                  <a href={r.authorUri} target="_blank" rel="noopener" className={s.name}>
                    {r.author}
                  </a>
                ) : (
                  <span className={s.name}>{r.author}</span>
                )}
                <span className={`t-small ${s.time}`}>{r.relativeTime}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className={s.footer} data-reveal>
        <a href={googleReviewUrl} target="_blank" rel="noopener" className="link link-arrow">
          {t.write}
        </a>
        <a href={data.mapsUri} target="_blank" rel="noopener" className="link link-arrow">
          {t.seeAll}
        </a>
        <span className={`t-small ${s.attribution}`}>{t.attribution}</span>
      </div>
    </Section>
  );
}
