/**
 * Rich Text Renderer Utility
 * Converts Slate.js-like rich text format to React-PDF components
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { RICH_TEXT_NODE_TYPES } from "../constants";
import { Text } from "../components/MultilingualText";

/**
 * Render text with formatting
 * @param {Object} textNode - Text node with formatting
 * @param {Object} styles - Styles object
 * @returns {JSX.Element} Rendered text
 */
const renderFormattedText = (textNode, styles = {}) => {
  if (!textNode || typeof textNode.text !== "string") return null;

  const textStyles = { ...styles };

  if (textNode.bold) textStyles.fontWeight = 700;
  if (textNode.italic) textStyles.fontStyle = "italic";
  if (textNode.underline) textStyles.textDecoration = "underline";

  return (
    <Text key={Math.random()} style={textStyles}>
      {textNode.text}
    </Text>
  );
};

/**
 * Render paragraph node
 * @param {Object} node - Paragraph node
 * @param {Object} styles - Styles object
 * @returns {JSX.Element} Rendered paragraph
 */
const renderParagraph = (node, styles) => {
  if (!node.children || node.children.length === 0) {
    return <View key={Math.random()} style={styles.paragraph} />;
  }

  return (
    <View key={Math.random()} style={styles.paragraph}>
      <Text style={styles.text}>
        {node.children.map((child, index) =>
          renderFormattedText(child, styles.text)
        )}
      </Text>
    </View>
  );
};

/**
 * Render list item node
 * @param {Object} node - List item node
 * @param {Object} styles - Styles object
 * @param {string} marker - List marker (bullet or number)
 * @returns {JSX.Element} Rendered list item
 */
const renderListItem = (node, styles, marker = "•") => {
  if (!node.children || node.children.length === 0) return null;

  return (
    <View key={Math.random()} style={styles.listItem}>
      <Text style={styles.listMarker}>{marker}</Text>
      <View style={styles.listContent}>
        {node.children.map((child) => {
          if (child.type === RICH_TEXT_NODE_TYPES.PARAGRAPH) {
            return (
              <Text key={Math.random()} style={styles.text}>
                {child.children?.map((textNode) =>
                  renderFormattedText(textNode, styles.text)
                )}
              </Text>
            );
          }
          return renderFormattedText(child, styles.text);
        })}
      </View>
    </View>
  );
};

/**
 * Render bulleted list node
 * @param {Object} node - Bulleted list node
 * @param {Object} styles - Styles object
 * @returns {JSX.Element} Rendered bulleted list
 */
const renderBulletedList = (node, styles) => {
  if (!node.children || node.children.length === 0) return null;

  return (
    <View key={Math.random()} style={styles.list}>
      {node.children.map((child) => renderListItem(child, styles, "•"))}
    </View>
  );
};

/**
 * Render numbered list node
 * @param {Object} node - Numbered list node
 * @param {Object} styles - Styles object
 * @returns {JSX.Element} Rendered numbered list
 */
const renderNumberedList = (node, styles) => {
  if (!node.children || node.children.length === 0) return null;

  return (
    <View key={Math.random()} style={styles.list}>
      {node.children.map((child, index) =>
        renderListItem(child, styles, `${index + 1}.`)
      )}
    </View>
  );
};

/**
 * Render rich text content
 * @param {Array} content - Rich text content array
 * @param {Object} styles - Styles object
 * @returns {JSX.Element} Rendered content
 */
export const renderRichText = (content, styles = {}) => {
  if (!content || !Array.isArray(content)) return null;

  const defaultStyles = {
    paragraph: {
      marginBottom: 0, // Changed from 4 to 0 for tighter spacing
    },
    text: {
      fontSize: 10, // Changed from 9 to 10 to match Figma
      lineHeight: 1.8, // Changed from 1.4 to 1.8 (18px)
      color: "#454551", // Added default color
      fontWeight: 400, // Regular
    },
    list: {
      marginBottom: 0, // Changed from 4 to 0
      paddingLeft: 15, // Added default bullet indent
    },
    listItem: {
      flexDirection: "row",
      marginBottom: 0, // Changed from 2 to 0 for tighter spacing
    },
    listMarker: {
      width: 12,
      fontSize: 10, // Changed from 9 to 10
      color: "#454551", // Added marker color
      fontWeight: 400,
    },
    listContent: {
      flex: 1,
    },
  };

  const mergedStyles = {
    ...defaultStyles,
    ...styles,
  };

  return content.map((node, index) => {
    switch (node.type) {
      case RICH_TEXT_NODE_TYPES.PARAGRAPH:
        return renderParagraph(node, mergedStyles);

      case RICH_TEXT_NODE_TYPES.BULLETED_LIST:
        return renderBulletedList(node, mergedStyles);

      case RICH_TEXT_NODE_TYPES.NUMBERED_LIST:
        return renderNumberedList(node, mergedStyles);

      case RICH_TEXT_NODE_TYPES.LIST_ITEM:
        return renderListItem(node, mergedStyles);

      default:
        // Handle plain text nodes
        if (node.children) {
          return renderParagraph(node, mergedStyles);
        }
        return null;
    }
  });
};

/**
 * Convert rich text to plain text
 * @param {Array} content - Rich text content array
 * @returns {string} Plain text
 */
export const richTextToPlainText = (content) => {
  if (!content || !Array.isArray(content)) return "";

  const extractText = (node) => {
    if (typeof node === "string") return node;
    if (node.text) return node.text;
    if (node.children) {
      return node.children.map(extractText).join("");
    }
    return "";
  };

  return content.map(extractText).join("\n");
};
