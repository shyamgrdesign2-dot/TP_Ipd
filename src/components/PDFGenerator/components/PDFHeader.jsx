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
    display: "flex",
    flexDirection: "row",
    paddingLeft: "20.717px",
    alignItems: "flex-start",
    gap: 48.938,
    alignSelf: "stretch",
    marginBottom: 16,
  },

  headerImgContainer: {
    width: "100%",
    objectFit: "contain",
  },

  // Logo positioned on left
  logoContainer: {
    width: 89.001,
    height: 57.244,
    aspectRatio: "89.00/57.24",
  },

  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  titlesContainer: {
    display: "flex",
    width: 305,
    height: 57.244,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: 900,
    color: "#454551",
    textAlign: "center",
    letterSpacing: 0.2,
    lineHeight: 1.75,
    textTransform: "uppercase",
  },

  subTitle: {
    color: "#454551",
    fontSize: 12,
    fontWeight: 400,
    textAlign: "center",
  },
});

/**
 * PDFHeader Component
 * @param {Object} props - Component props
 * @param {Object} props.headerSettings - Header configuration
 * @returns {JSX.Element} PDF Header
 */
const PDFHeader = ({ headerSettings, letterHeadFormat }) => {
  if (!headerSettings) return null;

  const {
    title = "",
    logo = "",
    headerImg = "",
    subTitle = "",
    informationAlignmentVisible,
    logoVisible,
    informationAlignment,
  } = headerSettings;

  // Use default Zydus logo if no logo provided
  const logoSrc = logo || DEFAULT_LOGO;

  // No header format
  if (letterHeadFormat === LETTERHEAD_FORMATS.OWN) {
    return null;
  }

  if (letterHeadFormat === LETTERHEAD_FORMATS.UPLOAD && headerImg) {
    return (
      <View
        style={[
          styles.headerImgContainer,
          { marginBottom: letterHeadFormat !== 0 ? 15 : 0 },
        ]}
        fixed
      >
        <Image src={headerImg} />
      </View>
    );
  }

  // Logo with title
  return (
    <View
      style={[
        styles.headerContainer,
        { justifyContent: !logoVisible ? "center" : "flex-start" },
      ]}
      fixed
    >
      {informationAlignmentVisible && informationAlignment === "right" && (
        <View style={styles.titlesContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        </View>
      )}

      {/* Logo on left */}
      {logoVisible && (
        <View style={styles.logoContainer}>
          <Image src={logoSrc} style={styles.logo} />
        </View>
      )}

      {/* Title center-right */}
      {informationAlignmentVisible && informationAlignment === "left" && (
        <View style={styles.titlesContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        </View>
      )}
    </View>
  );
};

export default PDFHeader;
