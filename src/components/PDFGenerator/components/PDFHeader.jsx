/**
 * PDF Header Component

 */

import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { LETTERHEAD_FORMATS } from "../constants";

// Default Zydus logo (PNG format - SVG not supported in react-pdf)
const DEFAULT_LOGO = require("../../../assets/images/zydus.png");

const styles = StyleSheet.create({
  // Header container
  headerContainer: {
    position: "relative",
    height: 80,
    marginBottom: 0,
  },

  // Logo positioned on left
  logoContainer: {
    position: "absolute",
    left: 20.72,
    top: 11.38,
    width: 89,
    height: 57.244,
  },

  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  // Title positioned center-right
  title: {
    position: "absolute",
    left: 198.13,
    top: 22.367,
    fontSize: 24,
    fontWeight: 900,
    color: "#454551",
    letterSpacing: 0.2,
    lineHeight: 1.75,
    textTransform: "uppercase",
  },

  // Simple centered header (no logo) - Fallback
  centeredHeader: {
    paddingVertical: 20,
    alignItems: "center",
  },

  centeredTitle: {
    fontSize: 24,
    fontWeight: 900,
    textAlign: "center",
    color: "#454551",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
});

/**
 * PDFHeader Component
 * @param {Object} props - Component props
 * @param {Object} props.headerSettings - Header configuration
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} PDF Header
 */
const PDFHeader = ({
  headerSettings,
  fontFamily = "Roboto",
  letterHeadFormat,
}) => {
  if (!headerSettings) return null;

  const {
    title = "Discharge Summary",
    logo = "",
    headerImg = "",
  } = headerSettings;

  // Use default Zydus logo if no logo provided
  const logoSrc = logo || DEFAULT_LOGO;

  // No header format
  if (letterHeadFormat === LETTERHEAD_FORMATS.OWN) {
    return null;
  }

  if (letterHeadFormat === LETTERHEAD_FORMATS.UPLOAD && headerImg) {
    return (
      <View style={styles.headerContainer} fixed>
        <Image src={headerImg} />
      </View>
    );
  }

  // Logo with title
  return (
    <View style={styles.headerContainer} fixed>
      {/* Logo on left */}
      <View style={styles.logoContainer}>
        <Image src={logoSrc} style={styles.logo} />
      </View>

      {/* Title center-right */}
      {title && <Text style={[styles.title, { fontFamily }]}>{title}</Text>}
    </View>
  );
};

export default PDFHeader;
