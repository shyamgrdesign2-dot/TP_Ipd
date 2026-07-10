/**
 * HeroBanner — The page hero banner. Dark radial-gradient surface with an
 * animated geometric lattice accent (right side, partly off-canvas), an
 * optional back button, and a top-aligned title + subtitle. This is the
 * only banner.
 *
 * Props:
 *   size          "sm" | "md" | "lg"          banner height; default "md"
 *   height        number                       numeric height override (escape hatch); default undefined → use size
 *   bottomRadius  number                       overrides the size default (sm 20 / md 24 / lg 32); max 42
 *   tone          "violet" | "blue"            gradient tone (token-only); default "violet" = current look
 *   background    string                       full CSS background override (wins over tone); default undefined
 *   eyebrow       string | node                small kicker label above the title; default none
 *   align         "center" | "top"             vertical alignment of the content block; default "center" = current
 *   title         string                       required
 *   subtitle      string                       optional
 *   titleSize     "sm" (18px) | "md" (24px)    default "md"
 *   subtitleSize  "sm" | "md"                  default "sm"
 *   showBackButton boolean                     back button (centered on the heading)
 *   backIcon      string                       back glyph name; default "arrow-left3"
 *   backIconVariant "linear" | …               back glyph style; default "outline"
 *   backIconCorner "rounded" | "straight"       back glyph corner; default "straight"
 *   actions       ReactNode                    CTA slot (dark-surface Button: text / icon / split)
 *   rays          boolean                      default true — premium soft light-leak accent (bleeds from the top-left corner)
 *   pattern       boolean                      default true — animated lattice accent (finer; right side, opposite the leak)
 *   className     string
 */
export const HeroBanner: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from "react";
