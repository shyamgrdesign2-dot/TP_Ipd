/**
 * AiBrandSpark - verbatim port of the source Dr.Agent `AiBrandSparkIcon`
 * (components/doctor-agent/ai-brand.tsx). Uses the exact Figma SVG exports so the
 * mark is pixel-identical to the reference, offline.
 *
 *  - default (withBackground=false): the plain spark, /icons/dr-agent/spark-icon.svg
 *  - withBackground=true: the gradient tile (agent-bg.svg) + white spark overlay
 *    (agent-spark.svg), a rounded square icon.
 */
export function AiBrandSpark({ size = 24, className, style, withBackground = false }) {
  if (withBackground) {
    return (
      <span
        className={className}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          width: size,
          height: size,
          borderRadius: size * 0.3,
          ...style,
        }}
        aria-hidden="true"
      >
        <img
          src="/icons/dr-agent/agent-bg.svg"
          width={size}
          height={size}
          alt=""
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <img
          src="/icons/dr-agent/agent-spark.svg"
          width={size * 0.55}
          height={size * 0.55}
          alt=""
          draggable={false}
          style={{ position: "relative", zIndex: 10 }}
        />
      </span>
    );
  }

  return (
    <img
      src="/icons/dr-agent/spark-icon.svg"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
      style={{ pointerEvents: "none", userSelect: "none", ...style }}
    />
  );
}
