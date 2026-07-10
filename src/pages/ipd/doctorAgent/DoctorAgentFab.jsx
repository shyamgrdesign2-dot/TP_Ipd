import { openPanel } from "./stores/panelStore.js";

/**
 * Dr. Agent FAB - the scooped horizontal tab shape (exact FAB_PATH, gradient,
 * shadow filter, and the 230x66 -> rotate(90deg) geometry that hugs the right
 * viewport edge). Plain inline styles + a small CSS rule (no Tailwind dependency).
 */

/** Scooped horizontal "Dr. Agent" tab shape. Designed for a 430x115 viewBox. */
const FAB_PATH =
  "M395.24 23.6125C381.35 31.5666 366.81 41.5232 360.83 55.4195C352.63 74.3548 341.13 86.7689 319.47 86.769H110.53C88.87 86.7689 77.37 74.3548 69.17 55.4195C63.19 41.5232 48.62 31.5666 34.73 23.6125L28.43 20H401.32L395.24 23.6125Z";

/** The EXACT Dr. Agent spark (spark-icon.svg path), painted with the AI gradient
 *  so it pops on the white tab, with a gentle shimmer. */
function BrandSparkIcon({ size = 42 }) {
  return (
    // The shimmer transform lives on this WRAPPER, never on the <svg>. Animating
    // `transform` directly on an SVG that paints with a gradient makes the gradient
    // drop out in WebKit/Safari (the spark then renders with no fill). Keeping the
    // SVG static — and using a relative objectBoundingBox gradient — keeps the fill.
    <span
      aria-hidden="true"
      style={{ display: "inline-flex", animation: "sparkShimmer 4s ease-in-out infinite", transformOrigin: "center center" }}
    >
      <style>{`
        @keyframes sparkShimmer {
          0%, 100% { opacity: 0.88; transform: scale(1) rotate(0deg); }
          50%      { opacity: 1;    transform: scale(1.12) rotate(15deg); }
        }
        @media (prefers-reduced-motion: reduce) { span[style*="sparkShimmer"] { animation: none !important; } }
      `}</style>
      <svg width={size} height={size} viewBox="0 0 375 375" fill="none">
        <defs>
          {/* Relative (objectBoundingBox) gradient — top-left → bottom-right across
              the spark; survives CSS transforms where userSpaceOnUse can drop out. */}
          <linearGradient id="da-fab-spark-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D565EA" />
            <stop offset="0.5" stopColor="#673AAC" />
            <stop offset="1" stopColor="#1A1994" />
          </linearGradient>
        </defs>
        <path
          d="M290.387 195.649C240.198 200.476 200.481 240.165 195.649 290.32L187.497 375L179.351 290.326C174.521 240.179 134.803 200.478 84.6131 195.642L0 187.503L84.6199 179.358C134.807 174.53 174.519 134.834 179.351 84.6805L187.503 0L195.649 84.6737C200.479 134.821 240.197 174.522 290.387 179.358L375 187.497L290.387 195.649Z"
          fill="url(#da-fab-spark-grad)"
        />
      </svg>
    </span>
  );
}

export function DoctorAgentFab({ hidden }) {
  if (hidden) return null;
  const GRADIENT_ID = "da-fab-shell";
  const SHADOW_ID = "da-fab-shadow";

  return (
    <div
      className="da-fab-root"
      onClick={openPanel}
      role="button"
      tabIndex={0}
      aria-label="Open Dr. Agent"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openPanel();
      }}
      style={{ position: "fixed", right: 0, top: "50%", transform: "translateY(-50%)", width: 66, height: 230, zIndex: 5300, cursor: "pointer" }}
    >
      {/* Hover tooltip - appears left of the tab (shown via .da-fab-root:hover in css) */}
      <div
        className="da-fab-tooltip"
        style={{ position: "absolute", right: 72, top: "50%", transform: "translateY(-50%)", opacity: 0, transition: "opacity 0.2s ease", pointerEvents: "none" }}
      >
        <div style={{ position: "relative", whiteSpace: "nowrap", borderRadius: 6, padding: "4px 8px", fontSize: 12, fontWeight: 500, color: "#fff", background: "#101828", boxShadow: "0 4px 12px rgba(16,24,40,0.24)" }}>
          Open Dr. Agent
          <span style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", border: "4px solid transparent", borderLeftColor: "#101828" }} />
        </div>
      </div>

      {/* Rotated tab - flat 230x66 -> rotated 90deg so the scoop faces left. */}
      <div
        style={{ position: "absolute", left: "50%", top: "50%", width: 230, height: 66, transform: "translate(-50%, -50%) rotate(90deg)", transformOrigin: "center center" }}
      >
        {/* Gradient shape with soft drop shadow */}
        <svg
          width={230}
          height={66}
          viewBox="0 0 430 115"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", left: -7, top: -14, overflow: "visible", pointerEvents: "none", display: "block" }}
        >
          <defs>
            <filter id={SHADOW_ID} x="0" y="0" width="430" height="114.769" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="12" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.175838 0 0 0 0 0.173404 0 0 0 0 0.173404 0 0 0 0.42 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
            </filter>
            <linearGradient id={GRADIENT_ID} x1="28.43" x2="401.32" y1="53" y2="53" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#FBFBFD" />
              <stop offset="1" stopColor="#F3F3F8" />
            </linearGradient>
          </defs>
          <g filter={`url(#${SHADOW_ID})`}>
            <path d={FAB_PATH} fill={`url(#${GRADIENT_ID})`} />
          </g>
        </svg>

        {/* Content layer - spark + label, in the un-rotated 430x115 frame scaled down */}
        <div
          style={{ position: "absolute", left: -7, top: -11.75, width: 430, height: 115, transform: "scale(0.5349)", transformOrigin: "0 0", pointerEvents: "none" }}
        >
          <div style={{ width: 430, height: 115, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "17px 60px 26px" }}>
            <BrandSparkIcon size={42} />
            <span className="da-fab-label" style={{ color: "#673AAC", fontSize: 28, fontWeight: 700, letterSpacing: "0.3px", whiteSpace: "nowrap", lineHeight: 1 }}>
              Dr. Agent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
