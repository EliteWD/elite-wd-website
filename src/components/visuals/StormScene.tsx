/**
 * Interior view through impact glass during a storm: cold, rain-streaked sky
 * outside, a warm, calm room inside. Stand-in until real footage is supplied.
 */
const rain = Array.from({ length: 70 }, (_, i) => {
  // Deterministic pseudo-random so server and client render identically.
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 1600, y: r(2) * 700, len: 30 + r(3) * 60, o: 0.08 + r(4) * 0.18 };
});

export function StormScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ss-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1119" />
          <stop offset="55%" stopColor="#1a2634" />
          <stop offset="100%" stopColor="#2a3643" />
        </linearGradient>
        <radialGradient id="ss-flash" cx="72%" cy="18%" r="40%">
          <stop offset="0%" stopColor="#8fa7c4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8fa7c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ss-room" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="70%" stopColor="#120c07" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <linearGradient id="ss-mullion" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#050505" />
          <stop offset="50%" stopColor="#1b1c1f" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#ss-sky)" />
      <rect width="1600" height="900" fill="url(#ss-flash)" />

      {/* Distant horizon + palms */}
      <path d="M0 640 Q400 610 800 632 T1600 620 V900 H0Z" fill="#0a0f15" />
      <g fill="#05080c">
        <path d="M300 640 C302 560 306 500 318 430 L324 430 C314 500 312 560 312 640Z" />
        <path d="M321 432 c-40 -20 -90 -10 -120 20 c40 -16 80 -18 118 -12Z M321 432 c30 -30 80 -40 120 -26 c-40 2 -80 12 -116 32Z M321 432 c-10 -40 -40 -70 -80 -80 c30 20 56 48 74 84Z M321 432 c20 -36 56 -60 96 -62 c-36 14 -66 38 -90 66Z" />
        <path d="M1180 636 C1182 580 1186 530 1196 480 L1201 480 C1193 530 1191 580 1191 636Z" />
        <path d="M1199 482 c-34 -16 -76 -8 -100 16 c34 -12 66 -14 98 -10Z M1199 482 c26 -26 68 -34 100 -22 c-34 2 -66 10 -96 28Z M1199 482 c-8 -34 -34 -58 -66 -66 c24 16 46 40 60 70Z" />
      </g>

      {/* Rain on the glass */}
      <g stroke="#c9d6e6" strokeLinecap="round" transform="rotate(12 800 450)">
        {rain.map((d, i) => (
          <line key={i} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.len} strokeOpacity={d.o} strokeWidth="1.2" />
        ))}
      </g>

      {/* Warm room falloff + window mullions */}
      <rect width="1600" height="900" fill="url(#ss-room)" />
      <rect x="0" y="0" width="1600" height="36" fill="#050505" />
      <rect x="784" y="0" width="32" height="900" fill="url(#ss-mullion)" />
      <rect x="0" y="0" width="36" height="900" fill="#050505" />
      <rect x="1564" y="0" width="36" height="900" fill="#050505" />
    </svg>
  );
}
