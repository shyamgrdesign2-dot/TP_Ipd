import React from "react";
import RichTextPrintRenderer from "./richTextPrintRenderer";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import { camelToCapitalized } from "../../../../../utils/utils";
import { getAllVisibleSections } from "../../../utils/pdfUtils";
import SectionTitle from "../../SectionTitle";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    // marginBottom: 8,
  },

  sectionContainer: {
    marginBottom: 12,
  },

  // Subsection container
  subsectionContainer: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },

  // Inner content container
  contentContainer: {
    gap: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 0,
  },

  bullet: {
    width: 12,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
  },

  // Category name (Medium weight)
  categoryName: {
    fontWeight: 500, // Medium
    color: "#454551",
    lineHeight: 1.8,
  },

  // Item label (Medium weight for bold parts)
  itemLabel: {
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
    fontWeight: 500, // Medium
    color: "#171725",
  },

  // Regular text
  regularText: {
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
    paddingLeft: 5,
  },

  // Separator pipe
  separator: {
    color: "#A2A2A8",
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },
  subsectionTitle: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
  },
});

const RichTextPrintRendererSection = ({
  data,
  formatSettings,
  id = "treatmentPlan",
  title = null,
}) => {
  const mainSection = formatSettings?.find((section) => section?.id === id);
  const subsections = getAllVisibleSections(mainSection?.subSections || []);

  if (!mainSection) return null;

  return (
    <View style={styles.sectionContainer}>
      {title ? <SectionTitle title={title} />: null}
    <View style={styles.mainContainer}>
      {subsections.map((subsection) => {
        const key = subsection.id;
        if (
          data?.[id]?.[key] &&
          typeof data[id][key] === "object" &&
          !Array.isArray(data[id][key]) &&
          Object.keys(data[id][key]).length > 0
        ) {
          const finalData = data?.[id]?.[key];
          return (
            <View>
              <Text style={[styles.subsectionTitle]}>{subsection.label}</Text>
              {Object.entries(finalData).map(([key, value]) => (
                <View style={styles.bulletItem}>
                  <Text style={[styles.bullet]}>•</Text>
                  <Text style={[styles.itemLabel]}>
                    {camelToCapitalized(key)}:
                  </Text>
                  <Text style={[styles.regularText]}>
                    {Array.isArray(value)
                      ? value
                          .map((item) => item.name)
                          .filter(Boolean)
                          .join(", ")
                      : value}
                  </Text>
                </View>
              ))}
            </View>
          );
        } else if (data?.[id]?.[key]) {
          return (
            <RichTextPrintRenderer
              key={key}
              data={data?.[id]?.[key]}
              title={subsection.label}
            />
          );
        }
        return null;
      })}
    </View>
      </View>
  );
};

export default RichTextPrintRendererSection;
