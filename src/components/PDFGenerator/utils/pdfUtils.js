/**
 * PDF Utility Functions
 * Helper functions for PDF generation - Zydus Design Match
 */

import { PX_TO_PT, CM_TO_PT, INCH_TO_PT } from "../constants";

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
  const defaultMargins = { top: 3, right: 2, bottom: 2.5, left: 2 };
  const finalMargins = { ...defaultMargins, ...margins };

  return {
    top: cmToPt(finalMargins.top),
    right: cmToPt(finalMargins.right),
    bottom: cmToPt(finalMargins.bottom),
    left: cmToPt(finalMargins.left),
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
    .filter((section) => section.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
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
  return result.sort((a, b) => (a.order || 0) - (b.order || 0));
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
 * Get visible patient info fields - Exact order matching Figma image
 * @param {Object} displayPatientInfo - Display patient info settings
 * @param {Object} patientData - Patient data
 * @returns {Array} Array of visible fields with labels and values (in exact order from image)
 */
export const getVisiblePatientFields = (displayPatientInfo, patientData) => {
  if (!displayPatientInfo?.fields || !patientData) return [];

  const { fields } = displayPatientInfo;

  // Define all fields in the exact order they appear in the image
  // Left column, Right column, Left column, Right column pattern
  const fieldOrder = [
    // Row 1
    {
      key: "patientName",
      label: "Patient Name",
      value: patientData.patientName || "",
      column: "left",
    },
    {
      key: "patientId",
      label: "Patient ID",
      value: patientData.patientId || "",
      column: "right",
    },
    // Row 2
    {
      key: "ageGender",
      label: "Age/Gender",
      value: `${patientData.age || ""} Years, ${patientData.gender || ""}`,
      column: "left",
    },
    {
      key: "admissionId",
      label: "Admission ID",
      value: patientData.admissionId || "",
      column: "right",
    },
    // Row 3
    {
      key: "mobileNo",
      label: "Contact No",
      value: patientData.contactNumber || "",
      column: "left",
    },
    {
      key: "admissionDate",
      label: "Admission Date",
      value: formatDate(patientData.admissionDate),
      column: "right",
    },
    // Row 4
    {
      key: "wardBedNo",
      label: "Ward/Bed no",
      value: patientData.wardBedNo || "",
      column: "left",
    },
    {
      key: "preparedBy",
      label: "Prepared by",
      value: patientData.preparedBy || "",
      column: "right",
    },
    {
      key: "preparedOn",
      label: "Prepared On",
      value: formatDate(patientData.preparedOn),
      column: "right",
    },
    // Row 5 - Address stays in left column, wraps if needed
    {
      key: "address",
      label: "Address",
      value: patientData.address || "",
      column: "left",
      leftOnly: true, // Special flag for left-only fields
    },
    {
      key: "dischargeSummaryNo",
      label: "Discharge Summary No",
      value: patientData.dischargeSummaryNo || "",
      column: "right",
    },
    // Row 6 (right column only)
    {
      key: "dischargeDate",
      label: "Discharge Date",
      value: formatDate(patientData.dischargeDate),
      column: "right",
    },
    // Additional fields (if enabled)
    {
      key: "bloodGroup",
      label: "Blood Group",
      value: patientData.bloodGroup || "",
      column: "right",
    },
    {
      key: "heightWeight",
      label: "Height/Weight",
      value: `${patientData.height || ""} cm / ${patientData.weight || ""} kg`,
    },
    {
      key: "dob",
      label: "DOB",
      value: formatDate(patientData.dob),
    },
    {
      key: "consultationType",
      label: "Consultation Type",
      value: patientData.consultationType || "",
    },
    {
      key: "email",
      label: "Email",
      value: patientData.email || "",
    },
    {
      key: "estimatedDateOfDelivery",
      label: "EDD",
      value: formatDate(patientData.estimatedDateOfDelivery),
    },
    {
      key: "refMrnId",
      label: "Ref MRN ID",
      value: patientData.refMrnId || "",
    },
    {
      key: "dateTime",
      label: "Date & Time",
      value: formatDate(new Date()),
    },
  ];

  // Helper function to check if a field is enabled
  const isFieldEnabled = (fieldKey) => {
    if (Array.isArray(fields)) {
      const field = fields.find((f) => f.id === fieldKey);
      return field?.enabled === true;
    } else if (fields && typeof fields === "object") {
      // Legacy object-based structure (backward compatibility)
      return fields[fieldKey] === true;
    }
    return false;
  };

  // Filter only visible fields with values, maintaining exact order
  const orderedFields = fieldOrder.filter((field) => {
    const isEnabled = isFieldEnabled(field.key);
    return isEnabled;
  });

  return orderedFields;
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
