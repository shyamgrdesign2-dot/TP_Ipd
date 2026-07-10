/**
 * InputOTP — one-time-code / PIN input. Renders `length` separate single-char
 * boxes with auto-advance, backspace-to-previous, arrow-key nav, and
 * paste-to-fill across all boxes. Built for 2FA and e-prescription sign-off.
 *
 * Controlled/uncontrolled parity: pass `value` + `onChange`, or `defaultValue`.
 * `onComplete(code)` fires once every box is filled.
 *
 * Props:
 *   length      number — number of boxes                              default 6
 *   value       string — controlled value (≤ length chars)
 *   defaultValue string — initial value (uncontrolled)               default ""
 *   onChange    (code: string) => void
 *   onComplete  (code: string) => void — fires when all boxes filled
 *   allow       "numeric" | "alphanumeric" | "any"                    default "numeric"
 *   size        "sm" | "md" | "lg"                                    default "md"
 *   status      "default" | "error" | "success"                      default "default"
 *   mask        boolean — render as password dots                     default false
 *   separator   ReactNode — rendered between groups when `groupSize` set
 *   groupSize   number — insert a separator every N boxes (e.g. 3 → "123 456")
 *   radius      number | "pill" | "sharp" — per-box corner radius
 *   disabled    boolean
 *   autoFocus   boolean — focus the first box on mount
 *   inputMode   string — keyboard hint; defaults from `allow`
 *   ariaLabel   string — group label for assistive tech     default "Verification code"
 */
export const InputOTP: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
export default InputOTP;
