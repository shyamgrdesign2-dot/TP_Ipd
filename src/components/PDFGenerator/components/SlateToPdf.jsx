/**
 * SlateToPdf Component
 * A reusable component for rendering Slate.js-like data structures in PDF format
 *
 * Example usage:
 * ```jsx
 * const slateData = [
 *   {
 *     "type": "numbered-list",
 *     "children": [
 *       {
 *         "type": "list-item",
 *         "children": [{"text": "cold"}]
 *       },
 *       {
 *         "type": "list-item",
 *         "children": [{"text": "fever"}]
 *       }
 *     ]
 *   },
 *   {
 *     "type": "paragraph",
 *     "children": [{"text": "Additional notes here"}]
 *   }
 * ];
 *
 * <SlateToPdf
 *   nodes={slateData}
 *   customStyles={{
 *     paragraph: { fontSize: 12 },
 *     numberedText: { color: "#333" }
 *   }}
 * />
 * ```
 */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // Paragraph styles
  paragraph: {
    marginBottom: 6,
    color: "#454551",
    lineHeight: 1.8,
  },

  // List styles
  bulletList: {
    marginBottom: 6,
  },

  numberedList: {
    marginBottom: 6,
  },

  // List item styles
  bulletItem: {
    flexDirection: "row",
    marginBottom: 3,
  },

  numberedItem: {
    flexDirection: "row",
    marginBottom: 3,
  },

  // Symbol styles
  bulletSymbol: {
    width: 12,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  numberedSymbol: {
    width: 15,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  // Text styles
  bulletText: {
    flex: 1,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  numberedText: {
    flex: 1,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  // Text formatting
  bold: {
    fontWeight: 600,
  },

  italic: {
    fontStyle: "italic",
  },
});

/**
 * Render a single leaf node with formatting
 */
const renderLeaf = (leaf, index, customStyles = {}) => {
  if (!leaf) return null;

  let style = { ...customStyles };
  if (leaf.bold) style = { ...style, ...styles.bold };
  if (leaf.italic) style = { ...style, ...styles.italic };

  return (
    <Text key={index} style={style}>
      {leaf.text || ""}
    </Text>
  );
};

/**
 * Render a single node (paragraph, list, list-item, etc.)
 */
const renderNode = (node, index, customStyles = {}, listIndex = null) => {
  if (!node) return null;

  switch (node.type) {
    case "paragraph":
      // Skip empty paragraphs
      if (
        !node.children ||
        node.children.every((child) => !child.text || child.text.trim() === "")
      ) {
        return null;
      }
      return (
        <Text key={index} style={[styles.paragraph, customStyles.paragraph]}>
          {node.children?.map((child, i) =>
            renderLeaf(child, i, customStyles.text)
          )}
        </Text>
      );

    case "bulleted-list":
      return (
        <View key={index} style={[styles.bulletList, customStyles.bulletList]}>
          {node.children?.map((listItem, i) =>
            renderNode(listItem, i, customStyles)
          )}
        </View>
      );

    case "numbered-list":
      return (
        <View
          key={index}
          style={[styles.numberedList, customStyles.numberedList]}
        >
          {node.children?.map((listItem, i) =>
            renderNode(
              { ...listItem, listType: "numbered" },
              i,
              customStyles,
              i + 1
            )
          )}
        </View>
      );

    case "list-item":
      const isNumbered = node.listType === "numbered";
      return (
        <View
          key={index}
          style={
            isNumbered
              ? [styles.numberedItem, customStyles.numberedItem]
              : [styles.bulletItem, customStyles.bulletItem]
          }
        >
          <Text
            style={
              isNumbered
                ? [styles.numberedSymbol, customStyles.numberedSymbol]
                : [styles.bulletSymbol, customStyles.bulletSymbol]
            }
          >
            {isNumbered ? `${listIndex}.` : "•"}
          </Text>
          <Text
            style={
              isNumbered
                ? [styles.numberedText, customStyles.numberedText]
                : [styles.bulletText, customStyles.bulletText]
            }
          >
            {node.children?.map((child, i) =>
              renderLeaf(child, i, customStyles.text)
            )}
          </Text>
        </View>
      );

    default:
      // Fallback to paragraph for unknown types
      return (
        <Text key={index} style={[styles.paragraph, customStyles.paragraph]}>
          {node.children?.map((child, i) =>
            renderLeaf(child, i, customStyles.text)
          )}
        </Text>
      );
  }
};

/**
 * SlateToPdf Component
 * @param {Object} props - Component props
 * @param {Array} props.nodes - Array of Slate.js-like nodes to render
 * @param {Object} props.customStyles - Custom styles to override defaults
 * @returns {JSX.Element} Rendered PDF content
 */
const SlateToPdf = ({ nodes, customStyles = {} }) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return null;
  }

  return (
    <View>
      {nodes.map((node, index) => renderNode(node, index, customStyles))}
    </View>
  );
};

export default SlateToPdf;
