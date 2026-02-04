/**
 * PDF Footer Component
 */

import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { LETTERHEAD_FORMATS } from "../constants";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    fontSize: 9,
    color: "#000000",
  },

  logo: {
    width: "100%",
    objectFit: "cover",
  },
});

/**
 * PDFFooter Component
 * @param {Object} props - Component props
 * @param {Object} props.footerSettings - Footer configuration
 * @returns {JSX.Element} PDF Footer
 */
const PDFFooter = ({ footerSettings, letterHeadFormat, fixed = true }) => {
  if (!footerSettings) return null;

  const {
    title = "",
    fontSize = 10,
    footerImg = "",
    renderedFooterImageHeight,
  } = footerSettings;

  if (letterHeadFormat === LETTERHEAD_FORMATS.OWN) {
    return null;
  }

  if (letterHeadFormat === LETTERHEAD_FORMATS.UPLOAD && footerImg) {
    return (
      <View style={styles.footer} fixed={fixed}>
        <Image
          src={footerImg}
          style={[
            styles.logo,
            renderedFooterImageHeight
              ? { height: renderedFooterImageHeight }
              : null,
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.footer, { borderTopWidth: 1, borderTopColor: "#000000" }]}
      fixed={fixed}
    >
      <Text style={[styles.footerText, { fontSize }]}>{title}</Text>
    </View>
  );
};

export default PDFFooter;
