// Bed status constants
export const BED_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  BLOCKED: "blocked",
};

// Tab constants
export const TABS = {
  MULTIPLE: "multiple",
  SINGLE: "single",
};

// Bed name format constants
export const BED_NAME_FORMAT = {
  PREFIX: "prefix",
  SUFFIX: "suffix",
  BOTH: "both",
  NONE: "none",
};

// Status configuration for display
export const STATUS_CONFIG = {
  [BED_STATUS.AVAILABLE]: {
    label: "Available",
  },
  [BED_STATUS.OCCUPIED]: {
    label: "Occupied",
  },
  [BED_STATUS.BLOCKED]: {
    label: "Blocked",
  },
};

// Status filter options for table
export const STATUS_FILTERS = [
  {
    text: "Available",
    value: BED_STATUS.AVAILABLE,
  },
  {
    text: "Occupied",
    value: BED_STATUS.OCCUPIED,
  },
  {
    text: "Blocked",
    value: BED_STATUS.BLOCKED,
  },
];
