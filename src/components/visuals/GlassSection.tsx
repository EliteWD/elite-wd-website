/** Technical cross-section of laminated impact glass: glass / interlayer / glass. */
export function GlassSection({ labels, className }: { labels: [string, string, string]; className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label={labels.join(" · ")}>
      <defs>
        <linearGradient id="gs-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6f8aa6" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#bcd0e4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6f8aa6" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="gs-inter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2997ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0071e3" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <g transform="skewY(-8) translate(0 30)">
        <rect x="96" y="20" width="34" height="150" rx="2" fill="url(#gs-glass)" />
        <rect x="138" y="20" width="12" height="150" rx="1" fill="url(#gs-inter)" />
        <rect x="158" y="20" width="34" height="150" rx="2" fill="url(#gs-glass)" />
      </g>
      <g fill="#86868b" fontSize="13" fontFamily="inherit" letterSpacing="-0.1">
        <line x1="113" y1="40" x2="113" y2="18" stroke="#6e6e73" />
        <text x="113" y="12" textAnchor="middle">{labels[0]}</text>
        <line x1="144" y1="186" x2="144" y2="170" stroke="#6e6e73" />
        <text x="144" y="198" textAnchor="middle" fill="#f5f5f7">{labels[1]}</text>
        <line x1="175" y1="36" x2="230" y2="18" stroke="#6e6e73" />
        <text x="234" y="16">{labels[2]}</text>
      </g>
    </svg>
  );
}
