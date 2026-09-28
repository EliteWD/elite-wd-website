import { site } from "@/content/site";

/** Placeholder lockup: a four-lite window mark + wordmark. Replace with the real logo SVG. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 1.8v14.4M1.8 9h14.4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.2px" }}>{site.shortName}</span>
    </span>
  );
}
