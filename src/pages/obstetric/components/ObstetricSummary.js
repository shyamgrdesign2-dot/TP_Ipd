import React from "react";
import { formatDateToShortMonthYear } from "../../../utils/utils";
import SectionedTable from "../../../components/SectionedTable";
// import { createRemoteComponent } from '../../../shared/remoteComponents';
// const SectionedTable = createRemoteComponent("SectionedTable");

const ObstetricSummary = ({ data, pastPregnancyData }) => {

  const patientInfoSection = {
    columns: [
      "LMP",
      "E.D.D",
      "C.E.E.D",
      "Gestation",
      "Blood",
      "Husband's blood",
      "Consang",
      "Marital status",
    ],
    values: [
      [
        formatDateToShortMonthYear(data?.lmp),
        formatDateToShortMonthYear(data?.edd),
        formatDateToShortMonthYear(data?.edd),
        data?.gestationWeeks || data?.gestationDays
          ? `${data?.gestationWeeks ? `${data?.gestationWeeks}W` : ""}${
              data?.gestationWeeks && data?.gestationDays ? ", " : ""
            }${data?.gestationDays ? `${data?.gestationDays}D` : ""}`
          : "-",
        data?.blood || "-",
        data?.husbandsBlood || "-",
        data?.consang === undefined ? "-" : data?.consang ? "Yes" : "No",
        data?.maritialStatus || "-",
      ],
    ],
  };

  const gplaeSection = {
    columns: ["Gravida", "Para", "Living", "Abortion", "Ectopic"],
    values: [
      [
        data?.gravidity || "0",
        data?.parity || "0",
        data?.livingChildren || "0",
        data?.abortion || "0",
        data?.ectopicPregnancies || "0",
      ],
    ],
  };

  const pregnancyHistorySection = {
    columns: [
      "Gravida no",
      "Outcome",
      "Term length",
      "Mode of delivery",
      "Delivery date",
      "Gender",
      "Baby weight",
      "Remarks", // Added remarks as a column
    ],
    values:
      pastPregnancyData?.map((pregnancy, index) => [
        (index + 1).toString(),
        pregnancy.outcome || "-",
        pregnancy.termLength || "-",
        pregnancy.deliveryMode || "-",
        formatDateToShortMonthYear(pregnancy.dateOfDelivery),
        pregnancy.gender || "-",
        pregnancy.babysWeight ? `${pregnancy.babysWeight}kgs` : "-",
        pregnancy.remarks || "-", // Added remarks in the last column
      ]) || [],
  };

  const examinationSection = {
    columns: [
      "Date",
      "Pallor",
      "Oedema",
      "BMI",
      "BP",
      "Fundus",
      "Presentation",
      "Fluid",
      "FHR",
    ],
    values:
      data?.examinationHistory?.map((exam) => [
        formatDateToShortMonthYear(exam.date),
        exam.pallor ? "Yes" : "No",
        exam.oedema ? "Yes" : "No",
        exam.mothersBMI ? `${exam.mothersBMI} Kg/m2` : "-",
        exam.systolic && exam.diastolic
          ? `${exam.systolic}/${exam.diastolic}mg`
          : "-",
        exam.heightOfFundus
          ? `${exam.heightOfFundus} ${exam.heightOfFundusUnit}`
          : "-",
        exam.presentation || "-",
        exam.liquor || "-",
        exam?.foetalHeartRate ? `${exam?.foetalHeartRate}bpm` : "-",
      ]) || [],
    remarks:
      data?.examinationHistory?.[0]?.notes || "No examination notes available",
  };

  const ancSchedulerSection = {
    columns: ["Test Name", "Due Date", "Status", "Remark"],
    values:
      data?.ancHistory
        ?.filter((test) => test.dueDate || test.status !== "Due")
        ?.map((test) => [
          test.master.name,
          formatDateToShortMonthYear(test.dueDate),
          test.status,
          test.notes || "-",
        ]) || [],
  };

  const immunisationSection = {
    columns: ["Vaccine Name", "Status", "Remark"],
    values:
      data?.immunisationHistory?.map((vaccine) => [
        vaccine.master.name,
        vaccine.givenDate
          ? `Given on ${formatDateToShortMonthYear(vaccine.givenDate)}`
          : vaccine.status,
        vaccine.notes || "-",
      ]) || [],
  };

  // Helper function to check if a section has valid data
  const hasValidData = (section) => {
    if (!section || !section.values) return false;

    // If values is empty array, no data
    if (section.values.length === 0) return false;

    // For sections with single row, check if all values are either '-' or '0'
    if (section.values.length === 1) {
      const hasNonEmptyValue = section.values[0].some(
        (value) => value !== "-" && value !== "0" && value !== ""
      );
      return hasNonEmptyValue;
    }

    return true;
  };

  // Filter out sections with no data
  const sectionsToShow = [
    hasValidData(patientInfoSection) && {
      ...patientInfoSection,
      title: "Patient Information",
    },
    (hasValidData(gplaeSection) || data?.diagnosisNotes) && {
      ...gplaeSection,
      diagnosisNotes: data?.diagnosisNotes || "",
      title: "GPLAE",
    },
    hasValidData(pregnancyHistorySection) && {
      ...pregnancyHistorySection,
      title: "Pregnancy history",
    },
    hasValidData(examinationSection) && {
      ...examinationSection,
      title: "Examination",
    },
    hasValidData(ancSchedulerSection) && {
      ...ancSchedulerSection,
      title: "ANC Scheduler",
    },
    hasValidData(immunisationSection) && {
      ...immunisationSection,
      title: "Immunisation Vaccine",
    },
  ].filter(Boolean);

  return (
    <div className="obstetric-summary">
      {sectionsToShow.length > 0 ? (
        <SectionedTable sections={sectionsToShow} />
      ) : null}
    </div>
  );
};

export default ObstetricSummary;
