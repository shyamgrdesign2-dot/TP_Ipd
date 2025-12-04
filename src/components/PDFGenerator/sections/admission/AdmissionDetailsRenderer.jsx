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
    fontSize: 12,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: "#F1F1F5",
    padding: 6,
  },
  subsectionText: {
    color: "#171725",
    fontWeight: 400,
    fontSize: 10,
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
});

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
  
  // Left column: 3 fields
  const leftFields = [
    { label: "Patient Name", value: patientName || "-" },
    { label: "Age/Gender", value: ageGender || "-" },

  ];
  
  // Right column: 2 fields
  const rightFields = [
    { label: "Contact No", value: patientInfo.contact || "-" },
    { label: "Patient ID", value: patientInfo.patientId || "-" },
    // { label: "Address", value: patientInfo.address || "-" },
  ];
  
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.topBorder} />
          <View style={styles.twoColumnContainer}>
            <View style={styles.leftColumn}>
              {leftFields.map((field) => renderFieldRow(field.label, field.value))}
            </View>
            <View style={styles.rightColumn}>
              {rightFields.map((field) => renderFieldRow(field.label, field.value))}
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
  
  const hasValue = (v) => v !== undefined && v !== null && v !== " " && v !== "-" && v !== "0";
  // Collect all fields dynamically
  const allFields = [
    { label: "Admitting Doctor", value: admissionInfo.admittingDoctor || "-" },
    { label: "Admission ID", value: admissionInfo.admissionId || "-" },
    { label: "Admission No", value: admissionInfo.admissionNo || "-" },
    { label: "MRN No", value: admissionInfo.mrno || "-" },
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
            {leftFields.map((field) => renderFieldRow(field.label, field.value))}
          </View>
          <View style={styles.rightColumn}>
            {rightFields.map((field) => renderFieldRow(field.label, field.value))}
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
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.subsectionTitle}>Care Taker Details</Text>
      
      <View style={styles.subsectionContainer}>
        {careTakerInfo.mobileNumber && (
          <View style={styles.row}>
            <Text style={styles.label}>Care Taker Mobile number:</Text>
            <Text style={styles.value}>{careTakerInfo.mobileNumber || "-"}</Text>
          </View>
        )}
        
        {careTakerInfo.name && (
          <View style={styles.row}>
            <Text style={styles.label}>Care Taker Name:</Text>
            <Text style={styles.value}>{careTakerInfo.name || "-"}</Text>
          </View>
        )}
        
        {careTakerInfo.relation && (
          <View style={styles.row}>
            <Text style={styles.label}>Relation:</Text>
            <Text style={styles.value}>{careTakerInfo.relation || "-"}</Text>
          </View>
        )}
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
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.subsectionTitle}>Insurance Details</Text>
      
      <View style={styles.subsectionContainer}>
        {insuranceInfo.insuranceNumber && (
          <View style={styles.row}>
            <Text style={styles.label}>Insurance Number:</Text>
            <Text style={styles.value}>{insuranceInfo.insuranceNumber || "-"}</Text>
          </View>
        )}
        
        {insuranceInfo.policyNumber && (
          <View style={styles.row}>
            <Text style={styles.label}>Policy Number:</Text>
            <Text style={styles.value}>{insuranceInfo.policyNumber || "-"}</Text>
          </View>
        )}
        
        {insuranceInfo.tpaNumber && (
          <View style={styles.row}>
            <Text style={styles.label}>TPA Number:</Text>
            <Text style={styles.value}>{insuranceInfo.tpaNumber || "-"}</Text>
          </View>
        )}
        
        {insuranceInfo.preApprovalId && (
          <View style={styles.row}>
            <Text style={styles.label}>Pre-Approval ID:</Text>
            <Text style={styles.value}>{insuranceInfo.preApprovalId || "-"}</Text>
          </View>
        )}
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

