/**
 * Filled By Card Component
 * Displays date/time and filled by information in a card format
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { Text } from "./MultilingualText";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
    backgroundColor: "#F1F1F5",
    borderRadius: 4,
    marginBottom: 8,
  },

  // Left side - Date and time
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateText: {
    fontWeight: 700,
    color: "#454551",
    marginRight: 4,
  },

  timeText: {
    fontWeight: 400,
    color: "#454551",
  },

  // Right side - Filled by
  filledByContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  filledByLabel: {
    fontWeight: 700,
    color: "#454551",
    marginRight: 4,
  },

  filledByName: {
    fontWeight: 400,
    color: "#454551",
  },
});

/**
 * Filled By Card Component
 * @param {Object} props - Component props
 * @param {string} props.filledBy - Name of the person who filled the form
 * @param {string|Date} props.filledOn - Date when the form was filled
 * @returns {JSX.Element} Filled By Card
 */
const FilledByCard = ({ filledBy, filledOn }) => {
  if (!filledBy || !filledOn) return null;

  // Format the date and time
  const formatDateTime = (dateInput) => {
    try {
      const date = new Date(dateInput);

      // Format date as "24 Jun, 2025"
      const dateStr = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      // Format time as "(08:12 AM)"
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return { dateStr, timeStr };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { dateStr: "Invalid Date", timeStr: "" };
    }
  };

  const { dateStr, timeStr } = formatDateTime(filledOn);

  return (
    <View style={styles.container} wrap={false}>
      {/* Left side - Date and Time */}
      <View style={styles.dateTimeContainer}>
        <Text style={[styles.dateText]}>{dateStr}</Text>
        <Text style={[styles.timeText]}>({timeStr})</Text>
      </View>

      {/* Right side - Filled By */}
      <View style={styles.filledByContainer}>
        <Text style={[styles.filledByLabel]}>Filled By:</Text>
        <Text style={[styles.filledByName]}>{filledBy}</Text>
      </View>
    </View>
  );
};

export default FilledByCard;
