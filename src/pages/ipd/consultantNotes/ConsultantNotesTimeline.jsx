import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import {
  setCurrentConsultantNote,
  setClinicalAssessmentPlan,
  setVitals,
  setLabInvestigation,
  setAdditionalRemarks,
  getConsultantNotes,
  clearFilteredConsultantNotes,
} from "../../../redux/ipd/consultantNotesSlice";
import { setMedicationData } from "../../../redux/prescriptionSlice";
import "./styles.scss";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import DateRangeFilter from "../components/DateRangeFilter.js";
import ConsultantNotesPreview from "./ConsultantNotesPreview.jsx";
import ConsultantNotesPreviewHeader from "./components/ConsultantNotesPreviewHeader.jsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { downloadModule, printModule } from "../utils/printDownload.js";
import EmptyState from "../labResults/EmptyState.jsx";
dayjs.extend(customParseFormat);

const ReusableStepper = createRemoteComponent("ReusableStepper");

const ConsultantNotesTimeline = () => {
  const { consultantNotes, filteredConsultantNotes } = useSelector(
    (state) => state.consultantNotes
  );
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;
  const [dateRange, setDateRange] = useState(null);
  const [dateStatus, setDateStatus] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);
  const { printSettings } = useSelector((state) => state.printSettings);
  const { frequencyList, timingList } = useSelector((state) => state.doctors);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (dateRange)
      dispatch(
        getConsultantNotes({
          patientId: patientId,
          admissionId: admissionId,
          filterStartDate: dateRange?.startDate,
          filterEndDate: dateRange?.endDate,
        })
      );
  }, [dateRange, dispatch, patientId, admissionId]);

  const onDateRangeChange = useCallback((dates, dateStrings) => {
    if (dates) {
      // Determine date status based on selected dates
      const today = moment().format("YYYY-MM-DD");
      const startDate = moment(dateStrings[0], "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      const endDate = moment(dateStrings[1], "DD-MM-YYYY").format("YYYY-MM-DD");

      if (startDate === today && endDate === today) {
        setDateStatus(1);
      } else if (
        startDate === moment().add(-1, "d").format("YYYY-MM-DD") &&
        endDate === today
      ) {
        setDateStatus(2);
      } else if (
        startDate === moment().add(-7, "d").format("YYYY-MM-DD") &&
        endDate === today
      ) {
        setDateStatus(3);
      } else if (
        startDate === moment().add(-1, "M").format("YYYY-MM-DD") &&
        endDate === today
      ) {
        setDateStatus(4);
      } else {
        setDateStatus(null);
      }

      setDateRange({
        startDate: startDate,
        endDate: endDate,
      });
    } else {
      setDateStatus(null);
      setDateRange(null);
    }
  }, []);

  const onDatePickerToggle = useCallback(() => {
    setPickerModal(!pickerModal);
  }, [pickerModal]);

  const onDateCancel = useCallback(() => {
    setDateStatus(null);
    setDateRange(null);
    setPickerModal(false);
    dispatch(clearFilteredConsultantNotes());
  }, [dispatch]);

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  // Handle edit button click
  const handleEditNote = (note) => {
    // Set the current consultant note
    dispatch(setCurrentConsultantNote(note));

    // Populate all Redux states with the note's data
    const consultationData = note.consultationNotes || {};

    // Set clinical assessment plan
    if (consultationData.clinicalAssessmentPlan) {
      dispatch(
        setClinicalAssessmentPlan(consultationData.clinicalAssessmentPlan)
      );
    }

    // Set vitals
    if (consultationData.vitals) {
      dispatch(setVitals(consultationData.vitals));
    }

    // Set medication
    if (consultationData.medication) {
      dispatch(setMedicationData(consultationData.medication));
    }

    // Set lab investigation
    if (consultationData.labInvestigation) {
      dispatch(setLabInvestigation(consultationData.labInvestigation));
    }

    // Set additional remarks
    if (consultationData.additionalRemarks) {
      dispatch(setAdditionalRemarks(consultationData.additionalRemarks));
    }

    // Navigate to the consultant notes page
    navigate("/ipd/patient-details/consultant-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const handlePrint = async (groupData) => {
    await printModule(
      "consultationNotes",
      printSettings,
      patientDetails,
      groupData?.[0]?.originalEntry,
      frequencyList,
      timingList
    );
  };

  const handleDownload = async (groupData) => {
    await downloadModule(
      "consultationNotes",
      printSettings,
      patientDetails,
      groupData?.[0]?.originalEntry,
      frequencyList,
      timingList
    );
  };

  // Custom render functions for ReusableStepper
  const renderCustomGroupHeader = (groupKey, groupData, emit) => {
    const date = new Date(
      groupData?.[0]?.originalEntry?.consultationNotes?.date
    );
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}, ${date.getFullYear()}`;
    const time = groupData?.[0]?.originalEntry?.consultationNotes?.time;
    const formattedTime = dayjs(time, "HH:mm:ss").format("hh:mm A");

    return (
      <ConsultantNotesPreviewHeader
        dateText={formattedDate}
        timeText={formattedTime}
        onDownload={(e) => {
          handleDownload(groupData);
        }}
        onPrint={(e) => {
          handlePrint(groupData);
        }}
        onEdit={(e) => {
          handleEditNote(groupData?.[0]?.raw);
        }}
      />
    );
  };

  const mappedData = useMemo(() => {
    // Use filteredConsultantNotes when date range is active, otherwise use consultantNotes
    const notesToUse = dateRange ? filteredConsultantNotes : consultantNotes;
    if (!Array.isArray(notesToUse)) return [];
    return notesToUse.map((entry) => {
      const pn = entry?.consultationNotes || {};
      const dateIso = pn?.date ? new Date(pn.date) : null;
      const timeIso = pn?.time ? new Date(pn.time) : null;
      const formattedDate = dateIso
        ? `${dateIso.getFullYear()}-${String(dateIso.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(dateIso.getDate()).padStart(2, "0")}`
        : undefined;
      return {
        // identifiers and raw source to support edit flow
        _id: entry?._id,
        raw: entry,
        date: formattedDate,
        period: pn?.period,
        time: timeIso ? timeIso.toLocaleTimeString() : undefined,
        timestamp: pn?.time,
        clinicalAssessmentPlan: pn?.clinicalAssessmentPlan,
        vitals: pn?.vitals,
        currentMedication: pn?.currentMedication,
        labInvestigation: pn?.labInvestigation,
        additionalRemarks: pn?.additionalRemarks,
        filledBy: entry?.createdByName ? `${entry.createdByName}` : undefined,
        role: entry?.createdByRole ? `${entry.createdByRole}` : undefined,
        originalEntry: entry,
        renderStepItem: (data) => {
          return <ConsultantNotesPreview entry={entry} />;
        },
      };
    });
  }, [consultantNotes, filteredConsultantNotes, dateRange]);

  return (
    <div className="consultant-notes-timeline">
      <div className="timeline-filter">
        <div className="timeline-filter-left">
          <DateRangeFilter
            dateRange={dateRange}
            dateStatus={dateStatus}
            isOpen={pickerModal}
            onRangeChange={onDateRangeChange}
            onToggleModal={onDatePickerToggle}
            onCancel={onDateCancel}
            disabledDate={disabledDate}
            placeholder="Filter by Date"
          />
        </div>
      </div>

      {!!mappedData.length ? (
        <ReusableStepper
          data={mappedData}
          groupBy={(item) =>
            item._id || item.timestamp?.split(" ")[0] || "Unknown"
          }
          sortGroups={(a, b) => new Date(b) - new Date(a)}
          renderGroupHeader={renderCustomGroupHeader}
          layout={{
            stepDirection: "vertical",
            currentStep: -1,
          }}
          showShadow={true}
          toolbar={{
            show: true,
            label: dateRange
              ? `Filtered: ${moment(dateRange.startDate).format(
                  "DD-MM-YYYY"
                )} - ${moment(dateRange.endDate).format("DD-MM-YYYY")}`
              : "All dates",
          }}
        />
      ) : (
        <div className="no-data-container">
          <EmptyState label="No Consultant Notes available for the selected date range" />
        </div>
      )}
    </div>
  );
};

export default ConsultantNotesTimeline;
