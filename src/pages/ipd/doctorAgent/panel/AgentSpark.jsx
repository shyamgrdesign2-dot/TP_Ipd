/**
 * The Dr. Agent brand spark - a 4-point concave-star sparkle with the AI gradient
 * D565EA -> 8B5CF6 -> 673AAC. Inline SVG so it renders offline.
 *   variant "white"    solid white fill (on the gradient FAB / dark surfaces)
 *   variant "gradient" AI signature gradient fill (on light surfaces)
 */
const SPARK_PATH =
  "M290.387 195.649C240.198 200.476 200.481 240.165 195.649 290.32L187.497 375L179.351 290.326C174.521 240.179 134.803 200.478 84.6131 195.642L0 187.503L84.6199 179.358C134.807 174.53 174.519 134.834 179.351 84.6805L187.503 0L195.649 84.6737C200.479 134.821 240.197 174.522 290.387 179.358L375 187.497L290.387 195.649Z";

let _uid = 0;

export function AgentSpark({ size = 16, variant = "gradient", className, style }) {
  const gid = `da-spark-grad-${(_uid += 1)}`;
  const fill = variant === "white" ? "#ffffff" : `url(#${gid})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 375 375"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {variant !== "white" && (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="375" y2="375" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D565EA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#673AAC" />
          </linearGradient>
        </defs>
      )}
      <path d={SPARK_PATH} fill={fill} />
    </svg>
  );
}
