/**
 * @param {{ className?: string, style?: object,
 *   lineColor?: string,   // lattice stroke (default faint white for dark surfaces)
 *   cometColor?: string,  // travelling pulse color (default white)
 *   edgeFade?: number|boolean, // edge-fade strength 0..1 (true → 0.6, false → 0)
 *   speed?: number|"slow"|"normal"|"fast", // comet speed multiplier (default 1 / "normal")
 *   density?: number,     // 0..1 fraction of lanes that emit comets (default 1 = all)
 *   animated?: boolean,   // false → static lattice, no comets (default true).
 *                         //   prefers-reduced-motion is auto-honored regardless.
 * }} props
 */
export function AnimatedGrid({ className, style, lineColor, cometColor, edgeFade, speed, density, animated, }: {
    className?: string;
    style?: object;
    lineColor?: string;
    cometColor?: string;
    edgeFade?: number | boolean;
    speed?: number | "slow" | "normal" | "fast";
    density?: number;
    animated?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export default AnimatedGrid;
