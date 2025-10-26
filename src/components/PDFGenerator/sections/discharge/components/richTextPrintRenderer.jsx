import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import SlateToPdf from "../../../components/SlateToPdf";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    marginBottom: 8,
  },

  // Subsection container
  subsectionContainer: {
    paddingVertical: 2,
    paddingHorizontal: 0,
  },

  // Inner content container
  contentContainer: {
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontSize: 10,
    fontWeight: 600,
    // lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },

  // Nested bullet list (second level)
  nestedBulletList: {
    paddingLeft: 30, // 15px additional from first level
  },

  // Bullet list item
  bulletItem: {
    flexDirection: "row",
    marginBottom: 0,
  },

  // Bullet marker
  bullet: {
    width: 12,
    fontSize: 10,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    fontSize: 10,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
  },

  paragraph: {
  },

  // Category name (Medium weight)
  categoryName: {
    fontSize: 10,
    fontWeight: 500, // Medium
    color: "#454551",
    lineHeight: 1.8,
  },

  // Item label (Medium weight for bold parts)
  itemLabel: {
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },

  // Separator pipe
  separator: {
    color: "#A2A2A8",
  },
});

const RichTextPrintRenderer = ({ data, fontFamily, title }) => {
  const isSlateFormat =
    Array.isArray(data) &&
    data.some((item) => item && typeof item === "object" && item.type);

  const customStyles = {
    bulletList: styles.bulletList,
    bulletItem: styles.bulletItem,
    bulletSymbol: styles.bullet,
    bulletText: styles.bulletContent,
    numberedList: {},
    numberedItem: {},
    numberedSymbol: {},
    numberedText: {},
    paragraph: styles.paragraph,
    text: {},
  };

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        {title && (
          <Text style={[styles.subsectionTitle, { fontFamily }]}>{title}</Text>
        )}
        {isSlateFormat ? (
          <View style={styles.bulletList}>
            <SlateToPdf
              nodes={data}
              fontFamily={fontFamily}
              customStyles={customStyles}
            />
          </View>
        ) : (
          // Fallback for old format
          <View style={styles.bulletList}>
            {Array.isArray(data) ? data.map((item, index) => (
              <View key={`item-${index}`} style={styles.bulletItem}>
                <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                <Text style={[styles.bulletContent, { fontFamily }]}>
                  {typeof item === "string" ? item : item.text}
                </Text>
              </View>
            )) : (
              <View style={styles.bulletItem}>
                <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                <Text style={[styles.bulletContent, { fontFamily }]}>
                  {typeof data === "string" ? data : data?.text || ""}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default RichTextPrintRenderer;