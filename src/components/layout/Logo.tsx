import Image from "next/image";
import { site } from "@/content/site";
import mark from "../../../public/brand/logo-mark.png";
import wordmarkWhite from "../../../public/brand/wordmark-white.png";
import stackedWhite from "../../../public/brand/logo-stacked-white.png";

/** Horizontal lockup for the 44px nav: gradient mark + white wordmark. */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Image src={mark} alt="" height={26} priority={priority} style={{ width: "auto", height: 26 }} />
      <Image
        src={wordmarkWhite}
        alt={site.name}
        height={22}
        priority={priority}
        style={{ width: "auto", height: 22 }}
      />
    </span>
  );
}

/** Stacked lockup (mark over wordmark) for the footer and large placements. */
export function LogoStacked({ width = 120, className }: { width?: number; className?: string }) {
  return (
    <Image
      src={stackedWhite}
      alt={site.name}
      width={width}
      className={className}
      style={{ width, height: "auto" }}
    />
  );
}
