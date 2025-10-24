/**
 * PDF Footer Component
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

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

  pageNumber: {
    fontSize: 9,
    color: "#000000",
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
  showPageNumbers = true,
}) => {
  if (!footerSettings) return null;

  const { title = "", fontSize = 9 } = footerSettings;

  return (
    <View style={styles.footer} fixed>
      <Text style={[styles.footerText, { fontFamily, fontSize }]}>{title}</Text>

      {showPageNumbers && (
        <Text
          style={[styles.pageNumber, { fontFamily, fontSize }]}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      )}
    </View>
  );
};

export default PDFFooter;
