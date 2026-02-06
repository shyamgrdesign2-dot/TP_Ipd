/**
 * Admission Details Renderer
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
  },
  subsectionContainer: {
    marginBottom: 12,
  },
  topBorder: {
    marginBottom: 10,
    marginTop: 10,
    height: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#A2A2A8",
  },
  subsectionTitle: {
    fontWeight: 700,
    color: "#171725",
    fontSize: 14,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: "#F1F1F5",
    padding: 6,
  },
  subsectionText: {
    color: "#171725",
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  twoColumnContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  leftColumn: {
    flex: 0.5,
  },
  rightColumn: {
    flex: 0.5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
  },
  rowWithWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    width: "100%",
  },
  label: {
    fontWeight: 600,
    color: "#000000",
    fontSize: 10,
    minWidth: 120,
  },
  value: {
    fontWeight: 400,
    color: "#171725",
    fontSize: 10,
  },
  wrappedValue: {
    fontWeight: 400,
    color: "#171725",
    fontSize: 10,
    flex: 1,
  },
  wrappedLabel: {
    fontWeight: 600,
    color: "#000000",
    fontSize: 10,
  },
  listContainer: {
    marginLeft: 8,
    marginBottom: 4,
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 10,
    color: "#171725",
  },
  bullet: {
    marginRight: 6,
    fontWeight: 600,
  },
  listText: {
    flex: 1,
    fontWeight: 400,
    color: "#171725",
    fontSize: 10,
  },
  listLabel: {
    fontWeight: 600,
    color: "#000000",
    fontSize: 10,
  },
  listValue: {
    fontWeight: 400,
    color: "#171725",
    fontSize: 10,
  },
});

const hasValue = (v) => v !== undefined && v !== null && v !== " " && v !== "-" && v !== "0";

/**
 * Format date and time
 */
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = moment(dateTimeString);
    return date.format("DD MMM YYYY, h:mm A");
  } catch (error) {
    return dateTimeString;
  }
};

/**
 * Format date only
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = moment(dateString);
    return date.format("DD MMM YYYY");
  } catch (error) {
    return dateString;
  }
};

/**
 * Render a single field row
 */
const renderFieldRow = (label, value) => {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.row} key={label}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
};

/**
 * Render a field row with wrapping (for long values like patient name)
 */
const renderWrappedFieldRow = (label, value) => {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.rowWithWrap} key={label}>
       <Text style={styles.wrappedLabel}>{label}:</Text>
       <Text style={styles.wrappedValue}> {String(value)}</Text>
    </View>
  );
};

/**
 * Patient Details Section
 */
const renderPatientDetails = (data) => {
  const patientInfo = data?.patientInformation || {};
  
  const patientName = patientInfo.prefix 
    ? `${patientInfo.prefix} ${patientInfo.name || ""}`.trim()
    : patientInfo.name || "";
  
  const ageGender = [
    patientInfo.age ? `${patientInfo.age} Years` : "",
    patientInfo.gender || ""
  ].filter(Boolean).join(", ");
  
  // Left column fields (excluding Patient Name which will be full width with wrap)
  const leftFields = [
    { label: "Patient Name", value: patientName || "-" },
    { label: "Age/Gender", value: ageGender || "-" },
    { label: "Contact No", value: patientInfo.contact || "-" },
  ];
  
  // Right column fields
  const rightFields = [
    { label: "Patient ID", value: patientInfo.pmPid || "-" },
    { label: "MRN No", value: patientInfo.mrno || "-" },
    // { label: "Address", value: patientInfo.address || "-" },
  ].filter((item) => hasValue(item.value));
  
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.topBorder} />
      <View style={styles.twoColumnContainer}>
        <View style={styles.leftColumn}>
          {leftFields.map((field) => renderWrappedFieldRow(field.label, field.value))}
        </View>
        <View style={styles.rightColumn}>
          {rightFields.map((field) => renderWrappedFieldRow(field.label, field.value))}
        </View>
      </View>
      <View style={styles.topBorder} />
    </View>
  );
};

/**
 * Admission Details Section
 */
const renderAdmissionDetailsSection = (data) => {
  const admissionInfo = data?.admissionDetails || {};
  // Collect all fields dynamically
  const allFields = [
    { label: "Admitting Doctor", value: admissionInfo.admittingDoctor || "-" },
    { label: "Admission ID", value: admissionInfo.admissionId || "-" },
    { label: "Admission No", value: admissionInfo.admissionNo || "-" },
    admissionInfo.referredBy && { label: "Referred By", value: admissionInfo.referredBy },
    admissionInfo.referralNotes && { label: "Referral Notes", value: admissionInfo.referralNotes },
    { 
      label: "Admission Date & Time", 
      value: admissionInfo.admissionDate ? formatDateTime(admissionInfo.admissionDate) : "-" 
    },
    { label: "Department", value: admissionInfo.department || "-" },
    { label: "Ward/Bed no", value: admissionInfo.wardBed || "-" },
    { label: "Patient Category", value: admissionInfo.patientCategory || "-" },
    { 
      label: "MLC Number", 
      value: admissionInfo.mlcNumber !== undefined && admissionInfo.mlcNumber !== null 
        ? String(admissionInfo.mlcNumber) 
        : "-" 
    },
  ].filter((item) => hasValue(item.value));
  
  // Split into two columns: first half on left, second half on right
  const midPoint = Math.ceil(allFields.length / 2);
  const leftFields = allFields.slice(0, midPoint);
  const rightFields = allFields.slice(midPoint);
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.subsectionTitle}>Admission Details</Text>
      
      <View style={styles.subsectionContainer}>
        <View style={styles.twoColumnContainer}>
          <View style={styles.leftColumn}>
            {leftFields.map((field) => renderWrappedFieldRow(field.label, field.value))}
          </View>
          <View style={styles.rightColumn}>
            {rightFields.map((field) => renderWrappedFieldRow(field.label, field.value))}
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * Care Taker Details Section
 */
const renderCareTakerDetails = (data) => {
  const careTakerInfo = data?.careTakerDetails || {};
  
  // Only render if at least one field has data
  if (!careTakerInfo.mobileNumber && !careTakerInfo.name && !careTakerInfo.relation) {
    return null;
  }
  
  // Build list items array with label and value
  const listItems = [];
  if (careTakerInfo.mobileNumber) {
    listItems.push({ label: "Care Taker Mobile number", value: careTakerInfo.mobileNumber });
  }
  if (careTakerInfo.name) {
    listItems.push({ label: "Care Taker Name", value: careTakerInfo.name });
  }
  if (careTakerInfo.relation) {
    listItems.push({ label: "Relation", value: careTakerInfo.relation });
  }
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.subsectionTitle}>Care Taker Details</Text>
      
      <View style={styles.subsectionContainer}>
        <View style={styles.listContainer}>
          {listItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listLabel}>{item.label}:</Text>
              <Text style={styles.listValue}> {item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Insurance Details Section
 */
const renderInsuranceDetails = (data) => {
  const insuranceInfo = data?.insuranceDetails || {};
  
  // Only render if at least one field has data
  if (
    !insuranceInfo.insuranceNumber &&
    !insuranceInfo.policyNumber &&
    !insuranceInfo.tpaNumber &&
    !insuranceInfo.preApprovalId
  ) {
    return null;
  }
  
  // Build list items array with label and value
  const listItems = [];
  if (insuranceInfo.insuranceNumber) {
    listItems.push({ label: "Insurance Number", value: insuranceInfo.insuranceNumber });
  }
  if (insuranceInfo.policyNumber) {
    listItems.push({ label: "Policy Number", value: insuranceInfo.policyNumber });
  }
  if (insuranceInfo.tpaNumber) {
    listItems.push({ label: "TPA Number", value: insuranceInfo.tpaNumber });
  }
  if (insuranceInfo.preApprovalId) {
    listItems.push({ label: "Pre-Approval ID", value: insuranceInfo.preApprovalId });
  }
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.subsectionTitle}>Insurance Details</Text>
      
      <View style={styles.subsectionContainer}>
        <View style={styles.listContainer}>
          {listItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listLabel}>{item.label}:</Text>
              <Text style={styles.listValue}> {item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Main renderer function
 */
export const renderAdmissionDetails = (data, formatSettings = [], fontSize = 10) => {
  const contentSections = [];

  // Patient Details
  contentSections.push(renderPatientDetails(data));

  // Admission Details
  contentSections.push(renderAdmissionDetailsSection(data));

  // Care Taker Details (only if data exists)
  const careTakerSection = renderCareTakerDetails(data);
  if (careTakerSection) {
    contentSections.push(careTakerSection);
  }

  // Insurance Details (only if data exists)
  const insuranceSection = renderInsuranceDetails(data);
  if (insuranceSection) {
    contentSections.push(insuranceSection);
  }

  return contentSections;
};

