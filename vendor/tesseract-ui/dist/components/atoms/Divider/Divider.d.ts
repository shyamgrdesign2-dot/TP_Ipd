/**
 * Divider — visual separator atom.
 *
 * variant "solid"    — flat single-color line (default)
 * variant "gradient" — fades to transparent at both ends; colour in the middle.
 *                      Works horizontally and vertically.
 *
 * lineStyle "solid" (default) | "dashed" | "dotted" — switches the rule rendering.
 *   For solid + variant="solid" the line is a filled bar (backgroundColor); for
 *   dashed/dotted it becomes a CSS border so the gaps show through.
 *
 * label + labelPosition "center" (default) | "start" | "end" — horizontal only:
 *   renders the label between two line segments. No label = a plain line (default).
 *
 * inset (number | {start,end}) — indents the line from its ends (px). Default 0.
 */
export const Divider: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
export default Divider;
