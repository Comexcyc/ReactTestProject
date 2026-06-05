function HeroBackground() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual-glow hero-visual-glow-a" />
      <div className="hero-visual-glow hero-visual-glow-b" />
      <div className="hero-visual-mesh" />

      <svg
        className="hero-visual-art"
        viewBox="0 0 720 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0071e3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#5ac8fa" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="heroHorizon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0071e3" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0071e3" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        <g opacity="0.55">
          <circle cx="88" cy="72" r="1.4" fill="#0071e3" />
          <circle cx="142" cy="118" r="1" fill="#86868b" />
          <circle cx="210" cy="54" r="1.2" fill="#0071e3" />
          <circle cx="520" cy="86" r="1.5" fill="#0071e3" />
          <circle cx="610" cy="132" r="1" fill="#86868b" />
          <circle cx="660" cy="68" r="1.3" fill="#0071e3" />
        </g>

        <ellipse
          cx="430"
          cy="250"
          rx="250"
          ry="110"
          stroke="url(#heroOrbit)"
          strokeWidth="1.2"
          transform="rotate(-18 430 250)"
        />
        <ellipse
          cx="430"
          cy="250"
          rx="190"
          ry="78"
          stroke="rgba(0, 113, 227, 0.18)"
          strokeWidth="1"
          strokeDasharray="5 7"
          transform="rotate(12 430 250)"
        />
        <path
          d="M120 360 C 250 300, 420 285, 620 310"
          stroke="rgba(0, 113, 227, 0.22)"
          strokeWidth="1.2"
          strokeDasharray="6 8"
        />

        <path
          d="M80 410 C 220 360, 380 340, 680 360 L 720 380 L 720 520 L 0 520 L 0 430 C 20 420, 45 415, 80 410 Z"
          fill="url(#heroHorizon)"
        />
        <path
          d="M80 410 C 220 360, 380 340, 680 360"
          stroke="rgba(0, 113, 227, 0.24)"
          strokeWidth="1.5"
        />

        <g transform="translate(500 118)">
          <rect x="-18" y="-8" width="36" height="16" rx="4" fill="#ffffff" stroke="#0071e3" strokeWidth="1.2" />
          <rect x="-34" y="-4" width="14" height="8" rx="2" fill="rgba(0, 113, 227, 0.12)" stroke="#0071e3" strokeWidth="0.8" />
          <rect x="20" y="-4" width="14" height="8" rx="2" fill="rgba(0, 113, 227, 0.12)" stroke="#0071e3" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.5" fill="#0071e3" />
        </g>

        <path
          d="M170 250 L 250 228 L 330 236 L 410 220 L 470 208"
          stroke="rgba(134, 134, 139, 0.35)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M470 208 L 520 198 L 560 188 L 590 182"
          stroke="rgba(0, 113, 227, 0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M560 188 L 575 176 L 592 168 L 608 160"
          stroke="rgba(0, 113, 227, 0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <g transform="translate(608 160) rotate(-12)">
          <path
            d="M0 0 C 18 -10, 42 -12, 68 -8 C 92 -4, 108 6, 118 16 C 98 10, 72 8, 46 10 C 22 12, 8 8, 0 0 Z"
            fill="rgba(255,255,255,0.82)"
            stroke="rgba(0, 113, 227, 0.35)"
            strokeWidth="1.2"
          />
          <path
            d="M22 4 L 34 -14 L 38 -2 Z"
            fill="rgba(0, 113, 227, 0.12)"
            stroke="rgba(0, 113, 227, 0.28)"
            strokeWidth="0.8"
          />
        </g>
      </svg>

      <div className="hero-visual-fade" />
    </div>
  );
}

export default HeroBackground;
