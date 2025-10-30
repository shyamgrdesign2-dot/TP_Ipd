/**
 * Section Title Component
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // Main section header
  container: {
    padding: 6,
    alignSelf: "stretch",
    borderRadius: 4,
    backgroundColor: "#F1F1F5",
    marginBottom: 4,
  },

  // Main section title text
  title: {
    color: "#171725",
    fontWeight: 600,
    textTransform: "capitalize",
  },
});

/**
 * SectionTitle Component
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @returns {JSX.Element} Section Title
 */
const SectionTitle = ({ title }) => {
  if (!title) return null;

  return (
    <View wrap={false} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default SectionTitle;
