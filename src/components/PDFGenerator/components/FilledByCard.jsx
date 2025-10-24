/**
 * Filled By Card Component
 * Displays date/time and filled by information in a card format
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

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
    fontSize: 10,
    fontWeight: 700,
    color: "#454551",
    marginRight: 4,
  },

  timeText: {
    fontSize: 10,
    fontWeight: 400,
    color: "#454551",
  },

  // Right side - Filled by
  filledByContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  filledByLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#454551",
    marginRight: 4,
  },

  filledByName: {
    fontSize: 10,
    fontWeight: 400,
    color: "#454551",
  },
});

/**
 * Filled By Card Component
 * @param {Object} props - Component props
 * @param {string} props.filledBy - Name of the person who filled the form
 * @param {string|Date} props.filledOn - Date when the form was filled
 * @param {string} props.fontFamily - Font family (default: "Poppins")
 * @returns {JSX.Element} Filled By Card
 */
const FilledByCard = ({ filledBy, filledOn, fontFamily = "Poppins" }) => {
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
    <View style={styles.container}>
      {/* Left side - Date and Time */}
      <View style={styles.dateTimeContainer}>
        <Text style={[styles.dateText, { fontFamily }]}>{dateStr}</Text>
        <Text style={[styles.timeText, { fontFamily }]}>({timeStr})</Text>
      </View>

      {/* Right side - Filled By */}
      <View style={styles.filledByContainer}>
        <Text style={[styles.filledByLabel, { fontFamily }]}>Filled By:</Text>
        <Text style={[styles.filledByName, { fontFamily }]}>{filledBy}</Text>
      </View>
    </View>
  );
};

export default FilledByCard;
