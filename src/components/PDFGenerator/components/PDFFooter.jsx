/**
 * PDF Footer Component
 */

import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { LETTERHEAD_FORMATS } from "../constants";

const styles = StyleSheet.create({
  footer: {
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    fontSize: 9,
    color: "#000000",
  },

  logo: {
    objectFit: "cover",
  },
});

/**
 * PDFFooter Component
 * @param {Object} props - Component props
 * @param {Object} props.footerSettings - Footer configuration
 * @param {string} props.fontFamily - Font family
 * @param {boolean} props.showPageNumbers - Show page numbers
 * @returns {JSX.Element} PDF Footer
 */
const PDFFooter = ({
  footerSettings,
  fontFamily,
  letterHeadFormat,
  showPageNumbers = true,
}) => {
  if (!footerSettings) return null;

  const { title = "", fontSize = 9, footerImg = "" } = footerSettings;

  if (letterHeadFormat === LETTERHEAD_FORMATS.OWN) {
    return null;
  }

  if (letterHeadFormat === LETTERHEAD_FORMATS.UPLOAD && footerImg) {
    return (
      <View style={styles.footer} fixed>
        <Image src={footerImg} style={styles.logo} />
      </View>
    );
  }

  return (
    <View
      style={[styles.footer, { borderTopWidth: 1, borderTopColor: "#000000" }]}
      fixed
    >
      <Text style={[styles.footerText, { fontFamily, fontSize }]}>{title}</Text>
    </View>
  );
};

export default PDFFooter;
