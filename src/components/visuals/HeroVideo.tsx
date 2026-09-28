"use client";

import { getImageProps, type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./HeroVideo.module.css";

const FADE = 1.2; // seconds of crossfade between the two layers
const DESKTOP = "(min-width: 734px)";

/**
 * Hero media.
 * - Desktop: a push-in clip looped seamlessly — two stacked copies; as one
 *   nears its end the other restarts underneath and fades in.
 * - Phones: the high-resolution still only (sharper than a 720p crop, and
 *   saves the visitor's data). Reduced-motion visitors also get the still.
 */
export function HeroVideo({
  src,
  poster,
  mobilePoster,
  alt,
}: {
  src: string;
  poster: StaticImageData;
  mobilePoster: StaticImageData;
  alt: string;
}) {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<"a" | "b">("a");
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia(DESKTOP);
    const update = () => setMotion(!reduce.matches && desktop.matches);
    update();
    reduce.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      reduce.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!motion) return;
    const current = (front === "a" ? a : b).current;
    const next = (front === "a" ? b : a).current;
    if (!current || !next) return;

    current.play().catch(() => {});
    let handed = false;
    const onTime = () => {
      if (handed || !current.duration) return;
      if (current.currentTime >= current.duration - FADE) {
        handed = true;
        next.currentTime = 0;
        next.play().catch(() => {});
        setFront(front === "a" ? "b" : "a");
      }
    };
    current.addEventListener("timeupdate", onTime);
    return () => current.removeEventListener("timeupdate", onTime);
  }, [front, motion]);

  // Art direction: each viewport downloads only its own still.
  // On phones the 16:9 still is cropped into a 4:5 frame, so it renders
  // ~2.25x the viewport width — request a source that wide to stay sharp.
  const common = { alt, priority: true };
  const {
    props: { srcSet: desktopSet },
  } = getImageProps({ ...common, src: poster, sizes: "100vw" });
  const {
    props: { srcSet: mobileSet, ...img },
  } = getImageProps({ ...common, src: mobilePoster, sizes: "225vw", quality: 80 });

  return (
    <div className={styles.root}>
      <picture>
        <source media={DESKTOP} srcSet={desktopSet} />
        <img {...img} srcSet={mobileSet} alt={alt} className={styles.poster} />
      </picture>
      {motion &&
        (["a", "b"] as const).map((key) => (
          <video
            key={key}
            ref={key === "a" ? a : b}
            className={`${styles.video} ${front === key ? styles.visible : ""}`}
            src={src}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{ transitionDuration: `${FADE}s` }}
          />
        ))}
    </div>
  );
}
