import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { Text } from "./MultilingualText";

const styles = StyleSheet.create({
  labInvestigationTableContainer: {
    gap: 6,
  },

  table: {
    borderWidth: 0.607,
    borderColor: "#F1F1F5",
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#FAFAFB",
    minHeight: 30,
    borderBottomWidth: 0.607,
    borderBottomColor: "#F1F1F5",
  },

  tableRow: {
    flexDirection: "row",
    minHeight: 48,
    borderBottomWidth: 0.607,
    borderBottomColor: "#F1F1F5",
  },

  // Table cells
  cellBase: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 6.681,
    paddingVertical: 9.11,
    borderRightWidth: 0.607,
    borderRightColor: "#F1F1F5",
  },

  cellInvestigationName: {
    minWidth: 145.762,
    flexDirection: "column",
    gap: 2,
  },

  cellNote: {
    minWidth: 121.468,
  },

  // Header text
  headerText: {
    fontWeight: 600,
    color: "#171725",
    lineHeight: 1.286,
    letterSpacing: 0.0607,
    textTransform: "uppercase",
    flexWrap: "wrap",
  },

  investigationName: {
    fontWeight: 500,
    color: "#454551",
    lineHeight: 1.2754,
    letterSpacing: 0.0607,
    flexWrap: "wrap",
  },

  cellTextSmall: {
    fontSize: 8,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 2.14,
    opacity: 0.9,
    flexWrap: "wrap",
  },

  // Title
  title: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
  },

  // Container
  container: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
});

const LabInvestigationTable = ({
  investigations,
  title = "Lab Investigation",
  showContainer = true,
}) => {
  if (!investigations || investigations.length === 0) return null;

  const tableContent = (
    <View style={styles.labInvestigationTableContainer}>
      {title && <Text style={[styles.title]}>{title}:</Text>}

      <View style={styles.table}>
        {/* Table Header */}
        <View fixed style={styles.tableHeader}>
          <View style={[styles.cellBase, styles.cellInvestigationName]}>
            <Text style={[styles.headerText]}>NAME</Text>
          </View>
          <View
            style={[styles.cellBase, styles.cellNote, { borderRightWidth: 0 }]}
          >
            <Text style={[styles.headerText]}>NOTE</Text>
          </View>
        </View>

        {/* Table Rows */}
        {investigations.map((investigation, index) => (
          <View
            key={`investigation-${index}`}
            style={[
              styles.tableRow,
              index === investigations.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            {/* Medicine Name with Generic */}
            <View style={[styles.cellBase, styles.cellInvestigationName]}>
              <Text style={[styles.investigationName]}>
                {investigation.name || investigation.investigationName || "-"}
              </Text>
            </View>

            {/* Note */}
            <View
              style={[
                styles.cellBase,
                styles.cellNote,
                { borderRightWidth: 0 },
              ]}
            >
              <Text style={[styles.cellTextSmall]}>
                {investigation.note || investigation.remarks || "-"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Return with or without container padding
  return showContainer ? (
    <View style={styles.container}>{tableContent}</View>
  ) : (
    tableContent
  );
};

export default LabInvestigationTable;
