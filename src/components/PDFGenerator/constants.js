/**
 * PDF Generator Constants
 * Centralized configuration for PDF generation
 */

// Unit conversion
export const PX_TO_PT = 0.75;
export const INCH_TO_PT = 72;
export const CM_TO_PT = 28.35;

// Page sizes (in points)
export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
};

// View modes
export const VIEW_MODES = {
  INLINE: 0,
  LIST: 1,
  TABLE: 2,
};

// Letterhead formats
export const LETTERHEAD_FORMATS = {
  NO_HEADER: "3",
  LOGO_LEFT_INFO_RIGHT: "1",
  LOGO_CENTER: "2",
  CUSTOM: "3",
};

// Signature positions
export const SIGNATURE_POSITIONS = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};

// Font families
export const FONT_FAMILIES = {
  ARIAL: "Arial",
  ROBOTO: "Roboto",
  TIMES: "Times-Roman",
  HELVETICA: "Helvetica",
};

// Default spacing
export const SPACING = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  XL: 16,
};

// Rich text node types
export const RICH_TEXT_NODE_TYPES = {
  PARAGRAPH: "paragraph",
  HEADING: "heading",
  BULLETED_LIST: "bulleted-list",
  NUMBERED_LIST: "numbered-list",
  LIST_ITEM: "list-item",
};

// Colors
export const COLORS = {
  PRIMARY: "#1890ff",
  SECONDARY: "#52c41a",
  TEXT: "#000000",
  TEXT_LIGHT: "#595959",
  BORDER: "#d9d9d9",
  BACKGROUND: "#ffffff",
  HEADER_BG: "#f5f5f5",
};
