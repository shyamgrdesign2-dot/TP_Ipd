/**
 * Test Data Mapping
 * This file tests the data transformation with the actual API data structure
 */

import { transformProgressNotesData } from './dataMapper';

// Your actual API data
const actualApiData = {
  "_id": "68e7561ba5e3ac7a88b684dd",
  "doctorId": 524,
  "hospitalId": 390,
  "patientId": "6820243303",
  "admissionId": "82135",
  "progressNotes": {
    "vitals": {
      "pulse": "12",
      "bloodPressure": "12",
      "temperature": "12",
      "spo2": "21",
      "generalRbs": "21",
      "height": "21",
      "weight": "21",
      "respiratoryRate": "21"
    },
    "chiefComplaint": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "test 1"
          }
        ]
      }
    ],
    "findings": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "test"
          }
        ]
      }
    ],
    "additionalRemarks": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "12"
          }
        ]
      }
    ],
    "date": "2025-10-09T06:28:41.065Z",
    "time": "2025-10-09T06:28:41.065Z",
    "period": "morning"
  },
  "createdBy": 524,
  "createdAt": "2025-10-09T06:28:43.724Z",
  "updates": [],
  "createdByName": "Dr Sheela BR",
  "createdByRole": "Doctor / Owner"
};

// Test the transformation
export const testDataMapping = () => {
  console.log("=== Testing Progress Notes Data Mapping ===");
  console.log("Original API Data:", actualApiData);
  
  const transformedData = transformProgressNotesData(actualApiData);
  console.log("Transformed Data:", transformedData);
  
  // Verify the transformation
  if (transformedData) {
    console.log("✅ Transformation successful!");
    console.log("Patient Name:", transformedData.patientInformation.name);
    console.log("Patient ID:", transformedData.patientInformation.patientId);
    console.log("Doctor Name:", transformedData.attendingPhysician.name);
    console.log("Progress Notes Count:", transformedData.progressNotes.length);
    
    if (transformedData.progressNotes.length > 0) {
      const firstNote = transformedData.progressNotes[0];
      console.log("First Note Details:");
      console.log("- Time of Day:", firstNote.timeOfDay);
      console.log("- Date Time:", firstNote.dateTime);
      console.log("- Filled By:", firstNote.filledBy);
      console.log("- Chief Complaint:", firstNote.chiefComplaint);
      console.log("- Findings:", firstNote.findings);
      console.log("- Vitals:", firstNote.vitals);
      console.log("- Additional Remarks:", firstNote.additionalRemarks);
    }
  } else {
    console.log("❌ Transformation failed!");
  }
  
  return transformedData;
};

// Expected output structure
export const expectedOutput = {
  patientInformation: {
    name: "Unknown Patient", // Will be "Unknown Patient" since no patient data provided
    patientId: "6820243303",
    age: "N/A",
    gender: "N/A",
    admissionDate: "N/A",
    roomBed: "N/A",
    ward: "N/A",
    admissionDiagnosis: "N/A"
  },
  attendingPhysician: {
    name: "Dr Sheela BR",
    specialty: "General Medicine",
    department: "General",
    contact: "N/A",
    email: "N/A",
    licenseNumber: "N/A"
  },
  progressNotesSummary: {
    summary: "Progress notes for Morning shift on 10/9/2025.",
    keyFindings: "test",
    recommendations: "12"
  },
  progressNotes: [
    {
      timeOfDay: "Morning",
      dateTime: "2025-10-09T06:28:41.065Z",
      filledBy: "Dr Sheela BR",
      chiefComplaint: "test 1",
      findings: "test",
      vitals: "BP: 12, HR: 12, Temp: 12°F, RR: 21, SpO2: 21%, RBS: 21, Height: 21 cm, Weight: 21 kg",
      additionalRemarks: "12"
    }
  ]
};

// Run the test
if (typeof window !== 'undefined') {
  // Only run in browser environment
  window.testProgressNotesMapping = testDataMapping;
}

