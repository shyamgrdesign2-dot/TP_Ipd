/**
 * List View Renderer
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { renderRichText } from "../utils/richTextRenderer";
import { isEmptyRichText } from "../utils/pdfUtils";

const styles = StyleSheet.create({
  // Simple text item (like Admitting Consultant)
  simpleText: {
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
    textTransform: "capitalize",
    paddingLeft: 6,
  },

  // List item with label and value side by side
  listItemRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  label: {
    fontWeight: 700,
    color: "#000000",
    minWidth: 120,
    paddingRight: 8,
  },

  colon: {
    fontWeight: 700,
    color: "#000000",
    marginRight: 8,
  },

  value: {
    color: "#000000",
    flex: 1,
    lineHeight: 1.5,
  },

  // Full width list items
  listItemFullWidth: {
    marginBottom: 8,
  },

  labelFullWidth: {
    fontWeight: 700,
    color: "#000000",
    marginBottom: 4,
  },

  valueFullWidth: {
    color: "#000000",
    lineHeight: 1.5,
  },

  // Nested/bullet lists (like Diagnosis items)
  bulletListContainer: {
    marginBottom: 8,
  },

  bulletListTitle: {
    fontWeight: 700,
    color: "#000000",
    marginBottom: 6,
  },

  bulletListItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },

  bulletMarker: {
    width: 12,
    color: "#000000",
  },

  bulletContent: {
    flex: 1,
    color: "#000000",
    lineHeight: 1.5,
  },

  nestedList: {
    marginLeft: 16,
  },

  valueContainer: {
    flex: 1,
  },
});

/**
 * Render a simple text (no label)
 * @param {string} text - Text to render
 * @returns {JSX.Element} Simple text
 */
export const renderSimpleText = (text) => {
  if (!text) return null;

  return (
    <Text key={Math.random()} style={styles.simpleText}>
      {text}
    </Text>
  );
};

/**
 * Render a simple list item
 * @param {string} label - Item label
 * @param {*} value - Item value
 * @param {boolean} fullWidthLabel - Use full width for label
 * @returns {JSX.Element} List item
 */
export const renderListItem = (label, value, fullWidthLabel = false) => {
  if (!value && value !== 0 && value !== false) return null;

  // Handle rich text content
  if (Array.isArray(value) && !isEmptyRichText(value)) {
    if (fullWidthLabel) {
      return (
        <View key={`item-${label}`} style={styles.listItemFullWidth}>
          <Text style={styles.labelFullWidth}>{label}:</Text>
          {renderRichText(value)}
        </View>
      );
    }

    return (
      <View key={`item-${label}`} style={styles.listItemRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.colon}>:</Text>
        <View style={styles.valueContainer}>{renderRichText(value)}</View>
      </View>
    );
  }

  // Handle array of strings
  if (Array.isArray(value)) {
    return (
      <View key={`item-${label}`} style={styles.bulletListContainer}>
        <Text style={styles.bulletListTitle}>{label}:</Text>
        {value.map((item, index) => (
          <View key={`val-${index}`} style={styles.bulletListItem}>
            <Text style={styles.bulletMarker}>•</Text>
            <Text style={styles.bulletContent}>
              {typeof item === "object"
                ? item.title || item.name || JSON.stringify(item)
                : item}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  // Handle object
  if (typeof value === "object" && value !== null) {
    return (
      <View key={`item-${label}`} style={styles.listItemRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>
          {value.title || value.name || JSON.stringify(value)}
        </Text>
      </View>
    );
  }

  // Handle primitive values
  if (fullWidthLabel) {
    return (
      <View key={`item-${label}`} style={styles.listItemFullWidth}>
        <Text style={styles.labelFullWidth}>{label}:</Text>
        <Text style={styles.valueFullWidth}>{String(value)}</Text>
      </View>
    );
  }

  return (
    <View key={`item-${label}`} style={styles.listItemRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
};

/**
 * @param {string} title - List title
 * @param {Array} items - List items
 * @returns {JSX.Element} Nested list
 */
export const renderNestedList = (title, items) => {
  if (!items || items.length === 0) return null;

  return (
    <View key={`nested-${title}`} style={styles.bulletListContainer}>
      <Text style={styles.bulletListTitle}>{title}:</Text>
      <View style={styles.nestedList}>
        {items.map((item, index) => {
          if (typeof item === "object") {
            return (
              <View key={`nested-item-${index}`} style={styles.bulletListItem}>
                <Text style={styles.bulletMarker}>•</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.bulletContent}>
                    {item.title || item.name || JSON.stringify(item)}
                  </Text>
                  {item.notes && (
                    <Text style={[styles.bulletContent, { marginLeft: 12 }]}>
                      {item.notes}
                    </Text>
                  )}
                </View>
              </View>
            );
          }
          return (
            <View key={`nested-item-${index}`} style={styles.bulletListItem}>
              <Text style={styles.bulletMarker}>•</Text>
              <Text style={styles.bulletContent}>{String(item)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/**
 * ListViewRenderer Component
 * @param {Object} props - Component props
 * @param {Array} props.items - Items to render
 * @returns {JSX.Element} List view
 */
const ListViewRenderer = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <View>
      {items.map((item, index) => {
        if (item.type === "nested") {
          return renderNestedList(item.label, item.value);
        }
        return renderListItem(item.label, item.value, item.fullWidth);
      })}
    </View>
  );
};

export default ListViewRenderer;
