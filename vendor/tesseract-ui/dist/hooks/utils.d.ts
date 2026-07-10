export function cn(...inputs: any[]): string;
/**
 * resolveRadius — shared corner-radius prop resolver for components.
 *   number      → `${n}px`        (e.g. 8  → "8px")
 *   "pill"      → fully rounded
 *   "sharp"     → square corners
 *   string      → used as-is       (e.g. "12px", "var(--tesseract-radius-12)")
 *   null/undef  → undefined        (keep the component's default token radius)
 */
export function resolveRadius(radius: any): string | undefined;
export function safeClipboardWrite(text: any): void;
