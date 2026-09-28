/**
 * Photoreal-leaning SVG render of an impact window or sliding door, lit on a
 * black stage. Stand-in until real product photography is supplied.
 */
type Props = {
  variant?: "window" | "door";
  id: string;
  className?: string;
  title?: string;
};

export function OpeningRender({ variant = "window", id, className, title }: Props) {
  const isDoor = variant === "door";
  const w = isDoor ? 760 : 520;
  const h = 640;
  const frame = 26;
  const sash = 14;
  const x = (800 - w) / 2;
  const y = 40;
  const panes = isDoor
    ? [
        { x: x + frame, y: y + frame, w: (w - frame * 2) / 2, h: h - frame * 2 },
        { x: x + w / 2, y: y + frame, w: (w - frame * 2) / 2, h: h - frame * 2 },
      ]
    : [
        { x: x + frame, y: y + frame, w: w - frame * 2, h: (h - frame * 2) / 2 },
        { x: x + frame, y: y + h / 2, w: w - frame * 2, h: (h - frame * 2) / 2 },
      ];

  return (
    <svg
      viewBox="0 0 800 900"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-halo`} cx="50%" cy="42%" r="55%">
          {/* A light-only glow: never darker than the surface behind it. */}
          <stop offset="0%" stopColor="#2a3f57" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#2a3f57" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2a3f57" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5a5d63" />
          <stop offset="18%" stopColor="#2a2c30" />
          <stop offset="50%" stopColor="#17181b" />
          <stop offset="82%" stopColor="#2c2e33" />
          <stop offset="100%" stopColor="#6b6e75" />
        </linearGradient>
        <linearGradient id={`${id}-sash`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b3d42" />
          <stop offset="100%" stopColor="#1a1b1e" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#1f3348" />
          <stop offset="45%" stopColor="#0c1622" />
          <stop offset="100%" stopColor="#05080c" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="46%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#dfe9f5" stopOpacity="0.16" />
          <stop offset="56%" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9fb4cc" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#9fb4cc" stopOpacity="0" />
          <stop offset="100%" stopColor="#9fb4cc" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-reflect-mask`}>
          <rect x="0" y={y + h + 8} width="800" height="200" fill={`url(#${id}-fade)`} />
        </mask>
        <g id={`${id}-unit`}>
          <rect x={x} y={y} width={w} height={h} rx="6" fill={`url(#${id}-metal)`} />
          <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx="6" fill="none" stroke={`url(#${id}-rim)`} />
          {panes.map((p, i) => (
            <g key={i}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={`url(#${id}-sash)`} />
              <rect
                x={p.x + sash}
                y={p.y + sash}
                width={p.w - sash * 2}
                height={p.h - sash * 2}
                fill={`url(#${id}-glass)`}
              />
              <rect
                x={p.x + sash}
                y={p.y + sash}
                width={p.w - sash * 2}
                height={p.h - sash * 2}
                fill={`url(#${id}-sheen)`}
              />
              <rect
                x={p.x + sash + 0.5}
                y={p.y + sash + 0.5}
                width={p.w - sash * 2 - 1}
                height={p.h - sash * 2 - 1}
                fill="none"
                stroke="#000"
                strokeOpacity="0.7"
              />
            </g>
          ))}
          {isDoor ? (
            <rect x={x + w / 2 - 34} y={y + h / 2 - 40} width="6" height="80" rx="3" fill="#8b8f96" />
          ) : (
            <rect x={x + w / 2 - 30} y={y + h / 2 - 4} width="60" height="6" rx="3" fill="#8b8f96" />
          )}
        </g>
      </defs>

      <ellipse cx="400" cy={y + h / 2} rx="420" ry="400" fill={`url(#${id}-halo)`} />
      <use href={`#${id}-unit`} />
      {/* Floor reflection */}
      <g mask={`url(#${id}-reflect-mask)`}>
        <use href={`#${id}-unit`} transform={`translate(0 ${(y + h) * 2 + 16}) scale(1 -1)`} />
      </g>
    </svg>
  );
}
