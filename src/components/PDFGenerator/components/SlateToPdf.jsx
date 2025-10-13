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
 *   fontFamily="Poppins"
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
    fontSize: 10,
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
    fontSize: 10,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },
  
  numberedSymbol: {
    width: 15,
    fontSize: 10,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },
  
  // Text styles
  bulletText: {
    fontSize: 10,
    flex: 1,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
    textTransform: "capitalize",
  },
  
  numberedText: {
    fontSize: 10,
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
const renderLeaf = (leaf, index, fontFamily, customStyles = {}) => {
  if (!leaf) return null;
  
  let style = { fontFamily, ...customStyles };
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
const renderNode = (node, index, fontFamily, customStyles = {}, listIndex = null) => {
  if (!node) return null;

  switch (node.type) {
    case "paragraph":
      // Skip empty paragraphs
      if (!node.children || node.children.every(child => !child.text || child.text.trim() === "")) {
        return null;
      }
      return (
        <Text key={index} style={[styles.paragraph, { fontFamily }, customStyles.paragraph]}>
          {node.children?.map((child, i) => renderLeaf(child, i, fontFamily, customStyles.text))}
        </Text>
      );

    case "bulleted-list":
      return (
        <View key={index} style={[styles.bulletList, customStyles.bulletList]}>
          {node.children?.map((listItem, i) => renderNode(listItem, i, fontFamily, customStyles))}
        </View>
      );

    case "numbered-list":
      return (
        <View key={index} style={[styles.numberedList, customStyles.numberedList]}>
          {node.children?.map((listItem, i) =>
            renderNode({ ...listItem, listType: "numbered" }, i, fontFamily, customStyles, i + 1)
          )}
        </View>
      );

    case "list-item":
      const isNumbered = node.listType === "numbered";
      return (
        <View key={index} style={isNumbered ? 
          [styles.numberedItem, customStyles.numberedItem] : 
          [styles.bulletItem, customStyles.bulletItem]}>
          <Text style={isNumbered ? 
            [styles.numberedSymbol, { fontFamily }, customStyles.numberedSymbol] : 
            [styles.bulletSymbol, { fontFamily }, customStyles.bulletSymbol]}>
            {isNumbered ? `${listIndex}.` : "•"}
          </Text>
          <Text style={isNumbered ? 
            [styles.numberedText, { fontFamily }, customStyles.numberedText] : 
            [styles.bulletText, { fontFamily }, customStyles.bulletText]}>
            {node.children?.map((child, i) => renderLeaf(child, i, fontFamily, customStyles.text))}
          </Text>
        </View>
      );

    default:
      // Fallback to paragraph for unknown types
      return (
        <Text key={index} style={[styles.paragraph, { fontFamily }, customStyles.paragraph]}>
          {node.children?.map((child, i) => renderLeaf(child, i, fontFamily, customStyles.text))}
        </Text>
      );
  }
};

/**
 * SlateToPdf Component
 * @param {Object} props - Component props
 * @param {Array} props.nodes - Array of Slate.js-like nodes to render
 * @param {string} props.fontFamily - Font family to use (default: "Poppins")
 * @param {Object} props.customStyles - Custom styles to override defaults
 * @returns {JSX.Element} Rendered PDF content
 */
const SlateToPdf = ({ 
  nodes, 
  fontFamily = "Poppins", 
  customStyles = {} 
}) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return null;
  }

  return (
    <View>
      {nodes.map((node, index) => renderNode(node, index, fontFamily, customStyles))}
    </View>
  );
};

export default SlateToPdf;
