import * as React from "react";

/**
 * Sep - a thin VERTICAL DIVIDER used to separate two adjacent values in a row.
 * House rule: never use a "." middle-dot to separate two things; use this light
 * vertical divider instead (single source of truth for that separator).
 */
export function Sep({ tone = "default", className, style }) {
  return (
    <i
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width: 1,
        height: tone === "strong" ? "1em" : "0.85em",
        flex: "none",
        alignSelf: "center",
        margin: "0 8px",
        background:
          tone === "strong"
            ? "var(--tesseract-slate-300, #d0d5dd)"
            : "var(--tesseract-slate-200, #e4e4ea)",
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
}

export default Sep;
