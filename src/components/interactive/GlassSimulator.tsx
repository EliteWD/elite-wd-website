"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import styles from "./interactive.module.css";

type Option = { name: string; body: string };

/**
 * Tints only the glass of the window photograph. Pane rectangles are measured
 * from public/images/window-product.jpg (1792x2240) — re-measure if the photo changes.
 */
const PANES = [
  { left: 33.48, top: 11.16, width: 33.2, height: 35.27 },
  { left: 33.48, top: 48.3, width: 33.2, height: 36.88 },
];

const pct = (n: number) => `${n}%`;

/**
 * Frosted glass without backdrop-filter (inconsistent across browsers):
 * a blurred copy of the photo, sized to the whole frame and offset so it
 * lines up exactly with the original behind this pane.
 */
function Frost({ src, pane }: { src: string; pane: (typeof PANES)[number] }) {
  return (
    <span
      className={styles.frost}
      aria-hidden="true"
      style={{
        backgroundImage: `url(${src})`,
        left: pct((-pane.left / pane.width) * 100),
        top: pct((-pane.top / pane.height) * 100),
        width: pct((100 / pane.width) * 100),
        height: pct((100 / pane.height) * 100),
      }}
    />
  );
}

/** One look per glass option, in the same order as the dictionary's glass.items. */
const LOOKS = ["clear", "gray", "bronze", "privacy", "insulated"] as const;

export function GlassSimulator({
  photo,
  alt,
  options,
  label,
  note,
}: {
  photo: StaticImageData;
  alt: string;
  options: Option[];
  label: string;
  note: string;
}) {
  const [active, setActive] = useState(0);
  const look = LOOKS[active] ?? "clear";

  return (
    <div className={styles.simulator} data-reveal>
      <div className={styles.simPhoto}>
        <Image src={photo} alt={alt} fill sizes="(max-width: 833px) 90vw, 460px" placeholder="blur" />
        {PANES.map((pane, i) => (
          <span
            key={i}
            className={`${styles.pane} ${styles[look]}`}
            style={{ left: pct(pane.left), top: pct(pane.top), width: pct(pane.width), height: pct(pane.height) }}
            data-testid="glass-pane"
            data-look={look}
          >
            {look === "privacy" && <Frost src={photo.src} pane={pane} />}
          </span>
        ))}
      </div>

      <div className={styles.simControls}>
        <p className={`t-product-label ${styles.simLabel}`} id="glass-sim-label">
          {label}
        </p>
        <div className={styles.segments} role="group" aria-labelledby="glass-sim-label">
          {options.map((option, i) => (
            <button
              key={option.name}
              type="button"
              className={styles.segment}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {option.name}
            </button>
          ))}
        </div>
        <p className={`t-lead ${styles.simBody}`} aria-live="polite">
          {options[active]?.body}
        </p>
        <p className={`t-caption ${styles.simNote}`}>{note}</p>
      </div>
    </div>
  );
}
