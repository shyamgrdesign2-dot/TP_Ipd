/**
 * PDF Footer Component
 */

import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { LETTERHEAD_FORMATS } from "../constants";

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
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

  pageNumber: {
    position: "absolute",
    fontSize: 10,
    fontWeight: 400,
    bottom: 10,
    right: 10,
    textAlign: "center",
    color: "#454551",
  },
});

const PageNumber = () => (
  <Text
    fixed
    style={styles.pageNumber}
    render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`}
  />
);

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
        {showPageNumbers && <PageNumber />}
      </View>
    );
  }

  return (
    <View style={styles.footer} fixed>
      <Text style={[styles.footerText, { fontFamily, fontSize }]}>{title}</Text>

      {showPageNumbers && <PageNumber />}
    </View>
  );
};

export default PDFFooter;
