/**
 * Discharge Advice Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { isEmptyRichText } from "../../../utils/pdfUtils";
import { renderRichText } from "../../../utils/richTextRenderer";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    marginBottom: 8,
  },

  // Subsection container
  subsectionContainer: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },

  // Content container
  contentContainer: {
    gap: 2,
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 2,
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
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
    lineHeight: 1.8,
    textTransform: "capitalize",
  },
});

/**
 * Render Diet subsection
 */
const renderDiet = (diet, fontFamily) => {
  if (!diet || diet.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>Diet:</Text>
        <View style={styles.bulletList}>
          {diet.map((item, index) => (
            <View key={`diet-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletContent, { fontFamily }]}>
                {item.name}
                {item.note ? ` (Notes: ${item.note})` : ""}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Physical Activity subsection
 */
const renderPhysicalActivity = (activities, fontFamily) => {
  if (!activities || activities.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Physical Activity:
        </Text>
        <View style={styles.bulletList}>
          {activities.map((item, index) => (
            <View key={`activity-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletContent, { fontFamily }]}>
                {item.name}
                {item.note ? ` (Notes: ${item.note})` : ""}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Other Advice subsection
 */
const renderOtherAdvice = (otherAdvice, fontFamily) => {
  if (!otherAdvice || isEmptyRichText(otherAdvice)) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Other Advice:
        </Text>
        <View style={styles.bulletList}>
          {renderRichText(otherAdvice, {
            text: {
              fontSize: 10,
              fontFamily,
              color: "#454551",
              lineHeight: 1.8,
            },
            paragraph: { marginBottom: 0 },
          })}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Warning Signs subsection
 */
const renderWarningSigns = (warningSigns, fontFamily) => {
  if (!warningSigns) return null;

  // Handle both rich text and array formats
  let items = [];
  if (Array.isArray(warningSigns) && !isEmptyRichText(warningSigns)) {
    // Extract text from rich text format
    const text = warningSigns
      .map((node) => node.children?.map((child) => child.text).join(""))
      .join(" ");
    items = text.split(",").map((item) => item.trim());
  } else if (typeof warningSigns === "string") {
    items = warningSigns.split(",").map((item) => item.trim());
  }

  if (items.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          When to Obtain Urgent Care:
        </Text>
        <View style={styles.bulletList}>
          {items.map((item, index) => (
            <View key={`warning-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletContent, { fontFamily }]}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Emergency Contact subsection
 */
const renderEmergencyContact = (emergencyContact, fontFamily) => {
  if (!emergencyContact) return null;

  // Handle both rich text and array formats
  let contacts = [];
  if (Array.isArray(emergencyContact) && !isEmptyRichText(emergencyContact)) {
    // Extract text from rich text format
    const text = emergencyContact
      .map((node) => node.children?.map((child) => child.text).join(""))
      .join(" ");
    contacts = text.split(",").map((item) => item.trim());
  } else if (typeof emergencyContact === "string") {
    contacts = emergencyContact.split(",").map((item) => item.trim());
  }

  if (contacts.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Emergency Contact:
        </Text>
        <View style={styles.bulletList}>
          {contacts.map((contact, index) => (
            <View key={`contact-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletContent, { fontFamily }]}>
                {contact}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * DischargeAdvice Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Discharge advice data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Discharge Advice Section
 */
const DischargeAdvice = ({ data, fontFamily = "Poppins" }) => {
  if (!data?.dischargeAdvice) return null;

  const advice = data.dischargeAdvice;

  return (
    <View style={styles.mainContainer}>
      {/* Diet */}
      {advice.diet && renderDiet(advice.diet, fontFamily)}

      {/* Physical Activity */}
      {advice.physicalActivities &&
        renderPhysicalActivity(advice.physicalActivities, fontFamily)}

      {/* Other Advice */}
      {advice.otherAdvice && renderOtherAdvice(advice.otherAdvice, fontFamily)}

      {/* Warning Signs */}
      {advice.warningSigns &&
        renderWarningSigns(advice.warningSigns, fontFamily)}

      {/* Emergency Contact */}
      {advice.emergencyContact &&
        renderEmergencyContact(advice.emergencyContact, fontFamily)}
    </View>
  );
};

export default DischargeAdvice;
