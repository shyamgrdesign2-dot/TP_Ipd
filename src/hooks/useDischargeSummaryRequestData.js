import { useMemo } from "react";

const convertToRawFormat = (data = []) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const isAlreadyRaw = data.every(
    (item) => item.tmu_id !== undefined && item.tmu_title !== undefined
  );
  if (isAlreadyRaw) return data;

  return data.map((item) => {
    if (item.key) {
      try {
        return JSON.parse(item.key);
      } catch {
        return { tmu_id: item.value, tmu_title: item.label };
      }
    }

    return { tmu_id: item.value, tmu_title: item.label };
  });
};

const formatDischargeMedications = (medications) => {
  if (!Array.isArray(medications) || medications.length === 0) {
    return [];
  }

  return medications.map((medication) => {
    const formattedMedication = { ...medication };
    const formattedMedicineUnit = convertToRawFormat(formattedMedication.medicineUnit);

    if (
      formattedMedication.tmm_dosage_unit_name &&
      formattedMedication.tmm_dosage_unit_name.trim() !== ""
    ) {
      formattedMedication.tmm_dosage = formattedMedication.tmm_dosage_unit_name;
    } else {
      const dosage = formattedMedication.tmm_dosage
        ? formattedMedication.tmm_dosage
        : 1;
      const unitName = formattedMedication.tmm_unit_name
        ? formattedMedication.tmm_unit_name
        : formattedMedicineUnit?.find(
            (x) => x.tmu_id == formattedMedication.tmu_id
          )?.tmu_title || formattedMedicineUnit[0]?.tmu_title;

      formattedMedication.tmm_dosage_unit_name = `${dosage} ${unitName}`.trim();
    }

    return formattedMedication;
  });
};

export const useDischargeSummaryRequestData = ({
  dischargeSummaryState,
  otNotesData,
  assessmentData,
  prescriptionSlice,
  obstetricSlice,
  serializeCustomModules,
  customModuleContents,
}) => {
  return useMemo(() => {
    const formatSurgeriesPerformed = (otNotesData) => {
      if (!Array.isArray(otNotesData) || otNotesData.length === 0) {
        return [];
      }

      return otNotesData.map((otNote) => {
        const surgeryDetails = otNote?.otNotes?.surgeryDetails || {};
        return {
          procedureName: Array.isArray(surgeryDetails.procedureName)
            ? surgeryDetails.procedureName
            : surgeryDetails.procedureName
            ? [surgeryDetails.procedureName]
            : [],
          surgeryDate: surgeryDetails.surgeryDate || "",
          surgeryStartTime: surgeryDetails.surgeryStartTime || "",
          surgeryEndTime: surgeryDetails.surgeryEndTime || "",
        };
      });
    };

    const formatTreatmentGiven = (treatmentNotes) => {
      if (!Array.isArray(treatmentNotes) || treatmentNotes.length === 0) {
        return [];
      }

      return treatmentNotes.map((treatment) => ({
        name: treatment.name || "",
        givenDate: treatment.givenDate || "",
        duration: treatment.duration || "",
        notes: treatment.notes || "",
        module: treatment.module || "",
      }));
    };

    const formatChronologicalSummary = (chronologicalSummary, arr) => {
      return arr || chronologicalSummary;
    };

    const formatOtNotesSurgeries = (otNotesData) => {
      if (!Array.isArray(otNotesData) || otNotesData.length === 0) {
        return [];
      }

      return otNotesData.map((otNote) => {
        const surgeryDetails = otNote?.otNotes?.surgeryDetails || {};
        const surgeryTeam = otNote?.otNotes?.surgeryTeam || {};

        return {
          _id: otNote._id || "",
          procedureName: Array.isArray(surgeryDetails.procedureName)
            ? surgeryDetails.procedureName
            : surgeryDetails.procedureName
            ? [surgeryDetails.procedureName]
            : [],
          dateOfSurgery: surgeryDetails.surgeryDate || "",
          surgeon: surgeryTeam.primarySurgeon || [],
          secondarySurgeon: surgeryTeam.secondarySurgeon || [],
          assistant: surgeryTeam.assistant || [],
          anaesthetist: surgeryTeam.anaesthesiologist || [],
          scrubNurse: surgeryTeam.scrubNurse || [],
          floorCirculatingNurse: surgeryTeam.floorCirculatingNurse || [],
          anaesthetistType: surgeryDetails.anaesthesiaType || "",
          operativeFindings:
            otNote?.otNotes?.operativeNotes?.operativeFindings || [],
          procedure: otNote?.otNotes?.operativeNotes?.procedures || [],
          additionalNotes:
            otNote?.otNotes?.postOperativeNotes?.additionalNotes || [],
        };
      });
    };

    return {
      assessmentId:
        dischargeSummaryState?.dischargeSummaryData?.assessmentId !== "undefined"
          ? dischargeSummaryState?.dischargeSummaryData?.assessmentId
          : "",
      patientInformation: {
        ...dischargeSummaryState.dischargeSummaryData?.patientInformation,
      },
      diagnosisAndSurgery: {
        finalDiagnosis:
          dischargeSummaryState?.dischargeSummaryData?.diagnosisAndSurgery
            ?.finalDiagnosis || [],
        provisionalDiagnosis:
          dischargeSummaryState?.dischargeSummaryData?.diagnosisAndSurgery
            ?.provisionalDiagnosis || [],
        surgeriesPerformed: formatSurgeriesPerformed(otNotesData.otNotesData),
      },
      patientHistory: {
        presentingComplaints: assessmentData.chiefComplaint || [],
        pastMedicalHistory: prescriptionSlice.medicalHistoryData || [],
        gyneacHistory: assessmentData.gynecHistoryData || {},
        obstetricHistory: obstetricSlice.obstetricDetails || {},
      },
      physicalExamination: {
        vitals: assessmentData.vitalsData,
        generalExamination: assessmentData.physicalExaminationBasicData || {},
        others: assessmentData.physicalExaminationOthersData || [],
      },
      functionalAssessmentTimeOfAdmission: {
        assessment: (() => {
          const data = { ...assessmentData.functionalAssessmentData };
          delete data.others;
          return data;
        })(),
        others: assessmentData.functionalAssessmentData.others,
      },
      date:
        JSON.stringify(
          dischargeSummaryState.dischargeSummaryData?.courseInHospital
            ?.chronologicalSummary
        ) !== JSON.stringify(dischargeSummaryState?.chronologicalSummary) ||
        JSON.stringify(
          dischargeSummaryState.dischargeSummaryData?.courseInHospital
            ?.treatmentGiven
        ) !== JSON.stringify(dischargeSummaryState?.treatmentNotes)
          ? new Date()
          : null,
      courseInHospital: {
        chronologicalSummary: formatChronologicalSummary(
          dischargeSummaryState?.chronologicalSummary,
          dischargeSummaryState.dischargeSummaryData?.courseInHospital
            ?.chronologicalSummary
        ),
        treatmentGiven: formatTreatmentGiven(dischargeSummaryState.treatmentNotes),
      },
      otNotes: {
        surgeries: formatOtNotesSurgeries(otNotesData.otNotesData),
      },
      dischargeNotes: {
        dischargeVitals: {
          ...dischargeSummaryState.dischargeSummaryData?.vitalsData,
        },
        patientCondition: dischargeSummaryState.dischargeSummaryData?.patientCondition,
        dischargeMedications: formatDischargeMedications(
          prescriptionSlice.medicationData || []
        ),
      },
      crossReferral:
        dischargeSummaryState.dischargeSummaryData?.crossReferral || [],
      labResults: dischargeSummaryState.dischargeSummaryData?.labResults || [],
      dischargeAdvice: {
        diet: dischargeSummaryState.dischargeSummaryData?.diet || [],
        physicalActivities:
          dischargeSummaryState.dischargeSummaryData?.physicalActivities || [],
        otherAdvice:
          dischargeSummaryState.dischargeSummaryData?.otherAdvice || [],
        warningSigns:
          dischargeSummaryState.dischargeSummaryData?.warningSigns || [],
        preventiveMeasures:
          dischargeSummaryState.dischargeSummaryData?.preventiveMeasures || [],
        emergencyContact:
          dischargeSummaryState.dischargeSummaryData?.emergencyContact || [],
      },
      followUpAdditionalNotes:
        dischargeSummaryState.dischargeSummaryData?.additionalNotes || [],
      followUp: dischargeSummaryState.dischargeSummaryData?.followUps || [],
      preparedBy: dischargeSummaryState.dischargeSummaryData?.preparedBy || null,
      customModules: serializeCustomModules
        ? serializeCustomModules(customModuleContents)
        : [],
    };
  }, [
    assessmentData,
    customModuleContents,
    dischargeSummaryState,
    obstetricSlice,
    otNotesData,
    prescriptionSlice,
    serializeCustomModules,
  ]);
};

export default useDischargeSummaryRequestData;
