/*
 * Doctor Agent brand + gradient constants (ported from the HIMS Doctor Agent).
 *
 * Colors for text/surfaces/borders come from Tesseract tokens (--tesseract-*).
 * The AI "signature" gradient (pink -> violet -> indigo) is a BRAND-LOCKED
 * constant, not a theme token.
 */

// AI signature stops.
export const AI_PINK = "#D565EA";
export const AI_VIOLET = "#673AAC";
export const AI_INDIGO = "#1A1994";

// Primary AI gradient (text fill, FAB shell, active accents).
export const AI_GRADIENT =
  "linear-gradient(91deg, #D565EA 3.04%, #673AAC 66.74%, #1A1994 130.45%)";

// Soft fills for pill / chip backgrounds.
export const AI_GRADIENT_SOFT =
  "linear-gradient(135deg, rgba(213,101,234,0.08) 0%, rgba(103,58,172,0.08) 50%, rgba(26,25,148,0.08) 100%)";
export const AI_GRADIENT_SOFT_HOVER =
  "linear-gradient(135deg, rgba(213,101,234,0.14) 0%, rgba(103,58,172,0.14) 50%, rgba(26,25,148,0.14) 100%)";
export const AI_GRADIENT_BORDER =
  "linear-gradient(135deg, rgba(213,101,234,0.30) 0%, rgba(103,58,172,0.30) 50%, rgba(26,25,148,0.30) 100%)";

// Panel geometry (docked companion).
export const PANEL = {
  widthDesktop: 400,
  widthTablet: 380,
  headerHeight: 52,
  radius: 14,
};

// Alert tiers (spec section 6). Paired with icons + text, never color alone.
export const ALERT_TIER = {
  critical: { key: "critical", label: "Critical", color: "#C8102E", bg: "#FEE2E2" },
  warning: { key: "warning", label: "Warning", color: "#D97706", bg: "#FEF3C7" },
  info: { key: "info", label: "Info", color: "#2563EB", bg: "#DBEAFE" },
  success: { key: "success", label: "OK", color: "#047857", bg: "#D1FAE5" },
  neutral: { key: "neutral", label: "", color: "#475467", bg: "#F1F5F9" },
};

// The IPD path prefix the doctor-facing agent is scoped to (whole IPD module).
export const IPD_PATH_PREFIX = "/ipd";

// Standalone dev backend (gen-mock-backend). Repointing to UAT later is config.
export const AGENT_API_BASE = "http://localhost:4000";
export const AGENT_DEV_LOGIN = { userName: "doctor1", password: "doctor123" };
export const AGENT_TOKEN_KEY = "DOCTOR_AGENT_DEV_TOKEN";
