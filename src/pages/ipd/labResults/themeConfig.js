// Ant Design Theme Configuration based on Figma Design Tokens
export const labResultsTheme = {
  token: {
    // Primary Colors
    colorPrimary: "#4b4ad5", // P-CTA-100
    colorSuccess: "#3d8c40", // Green-Dark
    colorWarning: "#ed8a00", // Orange for fluctuating/newly abnormal
    colorError: "#e54848", // Red-60
    colorInfo: "#4b4ad5", // Primary blue

    // Text Colors
    colorText: "#454551", // T-Text-80
    colorTextSecondary: "#a2a2a8", // T-Text-40
    colorTextTertiary: "#e2e2ea", // T-Text-10
    colorTextQuaternary: "#171725", // color/blue/12

    // Background Colors
    colorBgContainer: "#ffffff", // T-White-100
    colorBgElevated: "#f1f1f5", // T-BG-10
    colorBgLayout: "#ffffff",
    colorBgMask: "rgba(0, 0, 0, 0.45)",

    // Border Colors
    colorBorder: "#e2e2ea", // T-Text-10
    colorBorderSecondary: "#f1f1f5", // T-BG-10

    // Font Family
    fontFamily:
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontFamilyCode:
      'Roboto, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',

    // Font Sizes
    fontSize: 14, // Body - Roboto R 14
    fontSizeSM: 12, // Subheading 3 - Poppins SB 12
    fontSizeLG: 16, // H4 - Poppins M 16
    fontSizeXL: 18,

    // Font Weights
    fontWeightStrong: 600, // Poppins SemiBold
    fontWeightNormal: 400, // Roboto Regular
    fontWeightMedium: 500, // Poppins Medium

    // Line Heights
    lineHeight: 1.5714285714285714, // 22px for 14px font
    lineHeightSM: 1.5, // 18px for 12px font
    lineHeightLG: 1.5, // 24px for 16px font

    // Spacing
    padding: 16,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    margin: 16,
    marginSM: 8,
    marginLG: 24,
    marginXL: 32,

    // Border Radius
    borderRadius: 10, // Default border radius
    borderRadiusSM: 6,
    borderRadiusLG: 12,
    borderRadiusXL: 20,

    // Box Shadow
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    boxShadowSecondary: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",

    // Control Heights
    controlHeight: 44, // Search input height
    controlHeightSM: 32,
    controlHeightLG: 48,

    // Z-Index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
    zIndexModal: 1000,
    zIndexDrawer: 1000,
    zIndexMessage: 1010,
    zIndexNotification: 1010,
    zIndexPopover: 1030,
    zIndexTooltip: 1070,
  },

  components: {
    // Card Component
    Card: {
      borderRadius: 20,
      paddingLG: 24,
      colorBorderSecondary: "#e2e2ea",
      colorBgContainer: "#ffffff",
    },

    // Tabs Component
    Tabs: {
      colorPrimary: "#4b4ad5",
      colorText: "#454551",
      colorTextDisabled: "#a2a2a8",
      colorBorderSecondary: "#f1f1f5",
      fontSize: 14,
      fontWeightStrong: 600,
      padding: "24px 8px",
      margin: "0 34px 0 0",
    },

    // Input Component
    Input: {
      borderRadius: 10,
      colorBorder: "#e2e2ea",
      colorPrimary: "#4b4ad5",
      colorText: "#454551",
      colorTextPlaceholder: "#a2a2a8",
      fontSize: 14,
      lineHeight: 1.8571428571428572, // 26px for 14px font
      paddingInline: 16,
      paddingBlock: 12,
      controlHeight: 44,
    },

    // Button Component
    Button: {
      borderRadius: 10,
      colorPrimary: "#4b4ad5",
      colorText: "#454551",
      colorTextDisabled: "#a2a2a8",
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.5714285714285714, // 22px for 14px font
      controlHeight: 44,
      paddingInline: 16,
      paddingBlock: 12,
    },

    // Table Component
    Table: {
      colorBorderSecondary: "#e2e2ea",
      colorText: "#454551",
      colorTextHeading: "#454551",
      fontSize: 14,
      fontWeightStrong: 600,
      padding: 14,
      paddingSM: 8,
      paddingLG: 18,
      borderRadius: 12,
    },

    // Checkbox Component
    Checkbox: {
      colorPrimary: "#4b4ad5",
      colorText: "#454551",
      fontSize: 14,
      borderRadius: 4,
    },

    // Tag Component
    Tag: {
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.5, // 18px for 12px font
      paddingInline: 12,
      paddingBlock: 6,
    },

    // Typography Component
    Typography: {
      colorText: "#454551",
      colorTextSecondary: "#a2a2a8",
      colorTextTertiary: "#e2e2ea",
      colorTextQuaternary: "#171725",
      fontSize: 14,
      fontSizeSM: 12,
      fontSizeLG: 16,
      lineHeight: 1.8571428571428572, // 26px for 14px font
      lineHeightSM: 1.5, // 18px for 12px font
      lineHeightLG: 1.5, // 24px for 16px font
      fontWeightStrong: 600,
      fontWeightNormal: 400,
      fontWeightMedium: 500,
    },

    // Collapse Component
    Collapse: {
      borderRadius: 12,
      colorBorder: "#e2e2ea",
      colorBgContainer: "#ffffff",
      colorText: "#454551",
      fontSize: 16,
      fontWeight: 500,
      lineHeight: 1.5, // 24px for 16px font
      padding: 14,
      paddingLG: 18,
    },

    // Dropdown Component
    Dropdown: {
      borderRadius: 10,
      colorBgElevated: "#ffffff",
      colorBorder: "#e2e2ea",
      colorText: "#454551",
      fontSize: 14,
      lineHeight: 1.5714285714285714, // 22px for 14px font
      padding: 8,
    },

    // Menu Component
    Menu: {
      borderRadius: 10,
      colorBgElevated: "#ffffff",
      colorBorder: "#e2e2ea",
      colorText: "#454551",
      colorTextSelected: "#4b4ad5",
      fontSize: 14,
      lineHeight: 1.5714285714285714, // 22px for 14px font
      padding: 8,
    },

    // Tooltip Component
    Tooltip: {
      borderRadius: 8,
      colorBgSpotlight: "#171725",
      colorTextLightSolid: "#ffffff",
      fontSize: 12,
      lineHeight: 1.5, // 18px for 12px font
      padding: 8,
    },
  },
};

// Custom CSS variables for easy theming
export const labResultsCSSVariables = {
  "--lab-primary-color": "#4b4ad5",
  "--lab-success-color": "#3d8c40",
  "--lab-warning-color": "#ed8a00",
  "--lab-error-color": "#e54848",
  "--lab-text-primary": "#454551",
  "--lab-text-secondary": "#a2a2a8",
  "--lab-text-tertiary": "#e2e2ea",
  "--lab-text-quaternary": "#171725",
  "--lab-bg-primary": "#ffffff",
  "--lab-bg-secondary": "#f1f1f5",
  "--lab-border-color": "#e2e2ea",
  "--lab-border-radius": "10px",
  "--lab-border-radius-lg": "12px",
  "--lab-border-radius-xl": "20px",
  "--lab-font-family-primary": "Roboto, sans-serif",
  "--lab-font-family-heading": "Poppins, sans-serif",
  "--lab-font-size-sm": "12px",
  "--lab-font-size-base": "14px",
  "--lab-font-size-lg": "16px",
  "--lab-line-height-sm": "18px",
  "--lab-line-height-base": "26px",
  "--lab-line-height-lg": "24px",
  "--lab-spacing-sm": "8px",
  "--lab-spacing-base": "16px",
  "--lab-spacing-lg": "24px",
  "--lab-spacing-xl": "32px",
};

export default labResultsTheme;
