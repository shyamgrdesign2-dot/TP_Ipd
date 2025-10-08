/**
 * Common PDF Styles
 * Shared styles for PDF components
 */

import { StyleSheet } from "@react-pdf/renderer";
import { COLORS, SPACING } from "../constants";

export const createCommonStyles = (fontSize = 9, fontFamily = "Arial") => {
  return StyleSheet.create({
    page: {
      backgroundColor: COLORS.BACKGROUND,
      fontFamily: fontFamily,
      fontSize: fontSize,
    },

    // Layout
    container: {
      flex: 1,
    },

    section: {
      marginBottom: SPACING.LARGE,
    },

    row: {
      flexDirection: "row",
    },

    column: {
      flexDirection: "column",
    },

    // Typography
    title: {
      fontSize: fontSize + 4,
      fontWeight: 700,
      marginBottom: SPACING.SMALL,
      color: COLORS.TEXT,
    },

    subtitle: {
      fontSize: fontSize + 2,
      fontWeight: 700,
      marginBottom: SPACING.SMALL,
      color: COLORS.TEXT,
    },

    heading: {
      fontSize: fontSize + 1,
      fontWeight: 700,
      marginBottom: SPACING.SMALL,
      color: COLORS.TEXT,
    },

    text: {
      fontSize: fontSize,
      color: COLORS.TEXT,
      lineHeight: 1.4,
    },

    textLight: {
      fontSize: fontSize,
      color: COLORS.TEXT_LIGHT,
      lineHeight: 1.4,
    },

    label: {
      fontSize: fontSize - 1,
      fontWeight: 700,
      color: COLORS.TEXT,
    },

    value: {
      fontSize: fontSize,
      color: COLORS.TEXT,
    },

    // Borders and backgrounds
    bordered: {
      borderWidth: 1,
      borderColor: COLORS.BORDER,
      borderStyle: "solid",
    },

    headerBg: {
      backgroundColor: COLORS.HEADER_BG,
    },

    // Spacing
    mb4: {
      marginBottom: SPACING.SMALL,
    },

    mb8: {
      marginBottom: SPACING.MEDIUM,
    },

    mb12: {
      marginBottom: SPACING.LARGE,
    },

    mt4: {
      marginTop: SPACING.SMALL,
    },

    mt8: {
      marginTop: SPACING.MEDIUM,
    },

    mt12: {
      marginTop: SPACING.LARGE,
    },

    p4: {
      padding: SPACING.SMALL,
    },

    p8: {
      padding: SPACING.MEDIUM,
    },

    // Table styles
    table: {
      display: "table",
      width: "auto",
      marginBottom: SPACING.MEDIUM,
    },

    tableRow: {
      flexDirection: "row",
    },

    tableHeader: {
      backgroundColor: COLORS.HEADER_BG,
      fontWeight: 700,
    },

    tableCell: {
      padding: SPACING.SMALL,
      borderWidth: 1,
      borderColor: COLORS.BORDER,
      fontSize: fontSize,
    },

    // List styles
    listItem: {
      flexDirection: "row",
      marginBottom: SPACING.SMALL,
    },

    listMarker: {
      width: 20,
      fontSize: fontSize,
      fontWeight: 700,
    },

    listContent: {
      flex: 1,
    },

    // Alignment
    alignLeft: {
      textAlign: "left",
    },

    alignCenter: {
      textAlign: "center",
    },

    alignRight: {
      textAlign: "right",
    },

    justifyBetween: {
      justifyContent: "space-between",
    },

    justifyCenter: {
      justifyContent: "center",
    },

    alignItemsCenter: {
      alignItems: "center",
    },
  });
};
