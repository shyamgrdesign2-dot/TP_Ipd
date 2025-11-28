/**
 * PDF Utility Functions
 * Helper functions for PDF generation - Zydus Design Match
 */

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { PX_TO_PT, CM_TO_PT, INCH_TO_PT } from "../constants";
import SlateToPdf from "../components/SlateToPdf";

/**
 * Convert pixels to points
 * @param {number} px - Pixels
 * @returns {number} Points
 */
export const pxToPt = (px) => px * PX_TO_PT;

/**
 * Convert centimeters to points
 * @param {number} cm - Centimeters
 * @returns {number} Points
 */
export const cmToPt = (cm) => cm * CM_TO_PT;

/**
 * Convert inches to points
 * @param {number} inches - Inches
 * @returns {number} Points
 */
export const inchesToPt = (inches) => inches * INCH_TO_PT;

/**
 * Get margins object with converted units
 * @param {Object} margins - Margins in cm
 * @returns {Object} Margins in points
 */
export const getMargins = (margins = {}) => {
  const defaultMargins = { top: 1, right: 1, bottom: 1, left: 1 };
  const finalMargins = { ...defaultMargins, ...margins };

  return {
    top: cmToPt(+finalMargins.top || 1),
    right: cmToPt(+finalMargins.right || 1),
    bottom: cmToPt(+finalMargins.bottom || 1),
    left: cmToPt(+finalMargins.left || 1),
  };
};

/**
 * Sort sections by order property and handle nested subsections
 * formatStyle is now always an array
 * @param {Array} sections - Sections array
 * @returns {Array} Sorted sections array with processed subsections
 */
export const getSortedSections = (sections) => {
  if (!Array.isArray(sections)) return [];

  return sections
    .map((section) => ({
      key: section.id,
      ...section,
      // Recursively process subsections if they exist
      subSections:
        section.subSections && Array.isArray(section.subSections)
          ? getSortedSections(section.subSections)
          : section.subSections,
    }))
    .filter((section) => section.visible !== false);
};

/**
 * Get all visible sections as a flat array (including nested subsections)
 * Useful for renderers that need to process all sections at once
 * @param {Array} sections - Sections array
 * @returns {Array} Flat array of all visible sections
 */
export const getAllVisibleSections = (sections) => {
  if (!Array.isArray(sections)) return [];

  const result = [];

  const processSections = (sectionsArray) => {
    sectionsArray.forEach((section) => {
      if (section.visible !== false) {
        result.push({
          key: section.id,
          ...section,
        });

        // Recursively process subsections
        if (section.subSections && Array.isArray(section.subSections)) {
          processSections(section.subSections);
        }
      }
    });
  };

  processSections(sections);
  return result;
};

/**
 * Check if rich text content is empty
 * @param {Array} content - Rich text content array
 * @returns {boolean} Is empty
 */
export const isEmptyRichText = (content) => {
  if (!content || !Array.isArray(content)) return true;
  if (content.length === 0) return true;

  // Check if all paragraphs are empty
  return content.every((node) => {
    if (!node.children || node.children.length === 0) return true;
    return node.children.every((child) =>
      child.children && Array.isArray(child.children)
        ? child.children.every(
            (child) => !child.text || child.text.trim() === ""
          )
        : !child.text || child.text.trim() === ""
    );
  });
};

/**
 * Format date to display format (matching Zydus design)
 * @param {string|Date} date - Date to format
 * @param {string} format - Date format
 * @returns {string} Formatted date (e.g., "10 Aug 2025")
 */
export const formatDate = (date, format = "DD MMM YYYY") => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = d.getDate().toString().padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Get the value from patient data based on field key
 * @param {string} key - Field key
 * @param {Object} patientData - Patient data
 * @returns {string} Field value
 */
const getFieldValue = (key, patientData) => {
  const fieldValueMap = {
    patientName: () =>
      `${getSalutation(patientData)} ${patientData.patientName || ""}`,
    patientId: () => patientData.patientId || "",
    ageGender: () =>
      `${patientData.age || ""} Years, ${patientData.gender || ""}`,
    admissionId: () => patientData.admissionId || "",
    mobileNo: () => patientData.contactNumber || "",
    admissionDate: () => formatDate(patientData.admissionDate),
    wardBedNo: () => patientData.wardBedNo || "",
    preparedBy: () => patientData.preparedBy || "",
    preparedOn: () => formatDate(patientData.preparedOn),
    address: () => patientData.address || "",
    dischargeSummaryNo: () => patientData.dischargeSummaryNo || "",
    dischargeType: () => patientData.dischargeType || "",
    dischargeDate: () => formatDate(patientData.dischargedAt),
    bloodGroup: () => patientData.bloodGroup || "",
    heightWeight: () =>
      `${patientData.height || ""} cm / ${patientData.weight || ""} kg`,
    dob: () => formatDate(patientData.dob),
    mrnNo: () => patientData.mrnNo || "",
    primaryConsultant: () => patientData.doctorName || "",
    admissionNo: () => patientData.admissionNo || "",
  };

  const getter = fieldValueMap[key];
  return getter ? getter() : "";
};

/**
 * Get visible patient info fields - now uses settings fields directly
 * @param {Object} displayPatientInfo - Display patient info settings
 * @param {Object} patientData - Patient data
 * @returns {Array} Array of visible fields with labels and values (sorted by order)
 */
export const getVisiblePatientFields = (displayPatientInfo, patientData) => {
  if (!displayPatientInfo?.fields || !patientData) return [];

  const { fields } = displayPatientInfo;

  // Filter enabled fields and sort by order
  const sortedFields = fields
    .filter((field) => field.enabled !== false)
    .sort((a, b) => (a.order || 999) - (b.order || 999));

  // Map to include values from patient data
  const fieldsWithValues = sortedFields.map((field) => ({
    key: field.id,
    label: field.label,
    value: getFieldValue(field.id, patientData),
  }));

  return fieldsWithValues;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getSalutation = ({ gender = "", age = null }) => {
  if (age != null && age < 5) return "Baby";
  const g = gender.trim().toLowerCase();
  if (g === "male") return "Mr.";
  if (g === "female") return "Ms.";
  return "";
};

export const renderRichText = (data, title) => {
  const styles = StyleSheet.create({
    // Subsection container
    subsectionContainer: {
      paddingVertical: 6,
      paddingHorizontal: 0,
    },

    // Content container
    contentContainer: {
      gap: 4,
    },

    // Subsection title
    subsectionTitle: {
      color: "#171725",
      fontWeight: 600,
      lineHeight: 1.8,
      textTransform: "capitalize",
      marginBottom: 4,
    },

    // Bullet list container
    bulletList: {
      paddingLeft: 15,
    },
  });

  if (!data || isEmptyRichText(data)) return null;

  // Custom styles for SlateToPdf to match existing styling
  const customStyles = {
    text: {
      color: "#454551",
      lineHeight: 1.8,
    },
    paragraph: {
      marginBottom: 0,
    },
    bulletList: {
      paddingLeft: 0,
    },
    numberedList: {
      paddingLeft: 0,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 0,
    },
    numberedItem: {
      flexDirection: "row",
      marginBottom: 0,
    },
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
  };

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>{title}:</Text>
        <View style={styles.bulletList}>
          <SlateToPdf
            nodes={Array.isArray(data) ? data : [data]}
            customStyles={customStyles}
          />
        </View>
      </View>
    </View>
  );
};
