/**
 * Data Mapper for Progress Notes
 * Transforms API data structure to the format expected by ProgressNotesRenderer
 */

/**
 * Extract text content from rich text format
 * @param {Array} richTextArray - Rich text array from API
 * @returns {string} Plain text content
 */
const extractTextFromRichText = (richTextArray) => {
  if (!Array.isArray(richTextArray)) return "";
  
  return richTextArray
    .map(item => {
      if (item.children && Array.isArray(item.children)) {
        return item.children.map(child => child.text || "").join("");
      }
      return item.text || "";
    })
    .join(" ");
};

/**
 * Format vitals data into a readable string
 * @param {Object} vitals - Vitals object from API
 * @returns {string} Formatted vitals string
 */
const formatVitals = (vitals) => {
  if (!vitals) return "";
  
  const vitalsArray = [];
  
  if (vitals.bloodPressure) vitalsArray.push(`BP: ${vitals.bloodPressure}`);
  if (vitals.pulse) vitalsArray.push(`HR: ${vitals.pulse}`);
  if (vitals.temperature) vitalsArray.push(`Temp: ${vitals.temperature}°F`);
  if (vitals.respiratoryRate) vitalsArray.push(`RR: ${vitals.respiratoryRate}`);
  if (vitals.spo2) vitalsArray.push(`SpO2: ${vitals.spo2}%`);
  if (vitals.generalRbs) vitalsArray.push(`RBS: ${vitals.generalRbs}`);
  if (vitals.height) vitalsArray.push(`Height: ${vitals.height} cm`);
  if (vitals.weight) vitalsArray.push(`Weight: ${vitals.weight} kg`);
  
  return vitalsArray.join(", ");
};

/**
 * Map period to time of day
 * @param {string} period - Period from API (morning, evening, night)
 * @returns {string} Formatted time of day
 */
const mapPeriodToTimeOfDay = (period) => {
  if (!period) return "Morning";
  
  const periodMap = {
    morning: "Morning",
    evening: "Evening", 
    night: "Night",
    afternoon: "Afternoon"
  };
  
  return periodMap[period.toLowerCase()] || "Morning";
};

/**
 * Transform API progress notes data to renderer format
 * @param {Object} apiData - Raw data from API
 * @param {Object} patientData - Patient information (optional)
 * @returns {Object} Transformed data for ProgressNotesRenderer
 */
export const transformProgressNotesData = (apiData, patientData = {}) => {
  console.log("transformProgressNotesData called with:", apiData);
  
  if (!apiData) {
    console.log("No API data provided");
    return null;
  }

  // Handle different possible data structures
  let progressNotesData = null;
  
  // Case 1: Direct progress notes object (your current structure)
  if (apiData.progressNotes) {
    progressNotesData = apiData.progressNotes;
    console.log("Found progressNotes in API data");
  }
  // Case 2: Array of progress notes
  else if (Array.isArray(apiData) && apiData.length > 0) {
    console.log("API data is an array, using first entry");
    progressNotesData = apiData[0].progressNotes || apiData[0];
  }
  // Case 3: Direct progress notes data (if the whole object is progress notes)
  else if (apiData.vitals || apiData.chiefComplaint || apiData.findings) {
    console.log("API data appears to be direct progress notes data");
    progressNotesData = apiData;
  }
  else {
    console.log("No recognizable progress notes structure found in API data");
    return null;
  }

  console.log("Extracted progressNotesData:", progressNotesData);
  
  // Transform single progress note entry
  const transformedEntry = {
    timeOfDay: mapPeriodToTimeOfDay(progressNotesData.period),
    dateTime: progressNotesData.date || progressNotesData.time || apiData.createdAt || new Date().toISOString(),
    filledBy: apiData.createdByName || "Unknown Doctor",
    chiefComplaint: extractTextFromRichText(progressNotesData.chiefComplaint),
    findings: extractTextFromRichText(progressNotesData.findings),
    vitals: formatVitals(progressNotesData.vitals),
    additionalRemarks: extractTextFromRichText(progressNotesData.additionalRemarks)
  };
  
  console.log("Transformed entry:", transformedEntry);

  // Build the complete data structure expected by the renderer
  const transformedData = {
    patientInformation: {
      name: patientData.patientName || patientData.name || apiData.patientName || "Unknown Patient",
      patientId: apiData.patientId || patientData.patientId || "N/A",
      age: patientData.age || apiData.age || "N/A",
      gender: patientData.gender || apiData.gender || "N/A",
      admissionDate: patientData.admissionDate || apiData.admissionDate || "N/A",
      roomBed: patientData.roomBed || patientData.room || apiData.roomBed || "N/A",
      ward: patientData.ward || apiData.ward || "N/A",
      admissionDiagnosis: patientData.admissionDiagnosis || apiData.admissionDiagnosis || "N/A"
    },
    
    attendingPhysician: {
      name: apiData.createdByName || patientData.doctorName || "Unknown Doctor",
      specialty: patientData.doctorSpecialty || apiData.doctorSpecialty || "General Medicine",
      department: patientData.department || apiData.department || "General",
      contact: patientData.doctorContact || apiData.doctorContact || "N/A",
      email: patientData.doctorEmail || apiData.doctorEmail || "N/A",
      licenseNumber: patientData.doctorLicense || apiData.doctorLicense || "N/A"
    },
    
    progressNotesSummary: {
      summary: `Progress notes for ${transformedEntry.timeOfDay} shift on ${new Date(transformedEntry.dateTime).toLocaleDateString()}.`,
      keyFindings: transformedEntry.findings || "No specific findings recorded.",
      recommendations: transformedEntry.additionalRemarks || "Continue current treatment plan."
    },
    
    progressNotes: [transformedEntry]
  };

  console.log("Final transformed data:", transformedData);
  return transformedData;
};

/**
 * Transform multiple progress notes entries (if API returns array)
 * @param {Array} apiDataArray - Array of progress notes from API
 * @param {Object} patientData - Patient information
 * @returns {Object} Transformed data for ProgressNotesRenderer
 */
export const transformMultipleProgressNotesData = (apiDataArray, patientData = {}) => {
  if (!Array.isArray(apiDataArray) || apiDataArray.length === 0) {
    return null;
  }

  // Use the first entry for patient and physician info
  const firstEntry = apiDataArray[0];
  
  // Transform all entries
  const transformedEntries = apiDataArray.map(entry => {
    const progressNotesData = entry.progressNotes || {};
    
    return {
      timeOfDay: mapPeriodToTimeOfDay(progressNotesData.period),
      dateTime: progressNotesData.date || progressNotesData.time || entry.createdAt,
      filledBy: entry.createdByName || "Unknown Doctor",
      chiefComplaint: extractTextFromRichText(progressNotesData.chiefComplaint),
      findings: extractTextFromRichText(progressNotesData.findings),
      vitals: formatVitals(progressNotesData.vitals),
      additionalRemarks: extractTextFromRichText(progressNotesData.additionalRemarks)
    };
  });

  // Sort entries by date/time
  transformedEntries.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  // Build the complete data structure
  const transformedData = {
    patientInformation: {
      name: patientData.patientName || patientData.name || "Unknown Patient",
      patientId: firstEntry.patientId || patientData.patientId || "N/A",
      age: patientData.age || "N/A",
      gender: patientData.gender || "N/A",
      admissionDate: patientData.admissionDate || "N/A",
      roomBed: patientData.roomBed || patientData.room || "N/A",
      ward: patientData.ward || "N/A",
      admissionDiagnosis: patientData.admissionDiagnosis || "N/A"
    },
    
    attendingPhysician: {
      name: firstEntry.createdByName || "Unknown Doctor",
      specialty: patientData.doctorSpecialty || "General Medicine",
      department: patientData.department || "General",
      contact: patientData.doctorContact || "N/A",
      email: patientData.doctorEmail || "N/A",
      licenseNumber: patientData.doctorLicense || "N/A"
    },
    
    progressNotesSummary: {
      summary: `Progress notes covering ${transformedEntries.length} entries from ${new Date(transformedEntries[0].dateTime).toLocaleDateString()} to ${new Date(transformedEntries[transformedEntries.length - 1].dateTime).toLocaleDateString()}.`,
      keyFindings: "See individual entries for detailed findings.",
      recommendations: "Continue monitoring and follow treatment plan."
    },
    
    progressNotes: transformedEntries
  };

  return transformedData;
};
