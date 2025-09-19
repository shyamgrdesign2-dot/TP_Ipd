import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker, Card } from "antd";

import dayjs from "dayjs";
import {
  setCurrentConsultantNote,
  setClinicalAssessmentPlan,
  setVitals,
  setLabInvestigation,
  setAdditionalRemarks,
} from "../../../redux/ipd/consultantNotesSlice";
import { setMedicationData } from "../../../redux/prescriptionSlice";
import "./styles.scss";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import {
  MedicineTable,
  LabInvestigationTable,
} from "../../../components/ReusableTable";

const ReusableProgressCard = createRemoteComponent("ReusableProgressCard");
const ReusableStepper = createRemoteComponent("ReusableStepper");
const RichTextEditor = createRemoteComponent("RichTextEditor");

const ConsultantNotesTimeline = () => {
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const [filterDate, setFilterDate] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filter notes by date if filter is applied
  const filteredNotes = useMemo(() => {
    if (!filterDate) return consultantNotes || [];

    return (consultantNotes || []).filter((note) => {
      const noteDate = dayjs(note.createdAt);
      const filterDateValue = dayjs(filterDate);
      return noteDate.isSame(filterDateValue, "day");
    });
  }, [consultantNotes, filterDate]);

  // Sort notes by date (newest first)
  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredNotes]);

  // Handle edit button click
  const handleEditNote = (note) => {
    console.log("Editing note:", note);

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

  const handleReusableItemEvent = (eventName, payload) => {
    if (eventName === "edit") {
      const note = payload?.data;
    }
  };

  // Event handlers for group header actions (download, print)
  const handleGroupHeaderAction = (action, groupKey, groupData) => {
    console.log(`Group Header ${action}:`, { groupKey, groupData });
    addEvent(`Group Header - ${action}`, { groupKey, groupData });
  };

  // Custom render functions for ReusableStepper
  const renderCustomGroupHeader = (groupKey, groupData, emit) => {
    const date = new Date(groupKey);
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}, ${date.getFullYear()}`;

    return (
      <Card className="medical-progress__date-header-card">
        <div className="medical-progress__content-date">
          <img
            className="medical-progress__content-calendar-icon"
            style={{ fill: "#581C87" }}
            src={defaultIcons.calendarIcon}
            alt=""
          />
          <span className="medical-progress__content-date-text">
            {formattedDate}
          </span>
          <img
            className="medical-progress__content-download-icon"
            style={{ fill: "#581C87", cursor: "pointer" }}
            src={defaultIcons.downloadIcon}
            alt="Download"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleGroupHeaderAction("Download", groupKey, groupData);
              // Also emit the event for the stepper
              if (emit) {
                emit("groupHeaderAction", {
                  action: "download",
                  groupKey,
                  groupData,
                });
              }
            }}
            title="Download this date's consultant notes"
          />
          <img
            className="medical-progress__content-print-icon"
            style={{ fill: "#581C87", cursor: "pointer" }}
            src={defaultIcons.printerIcon}
            alt="Print"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleGroupHeaderAction("Print", groupKey, groupData);
              // Also emit the event for the stepper
              if (emit) {
                emit("groupHeaderAction", {
                  action: "print",
                  groupKey,
                  groupData,
                });
              }
            }}
            title="Print this date's consultant notes"
          />
          <img
            className="medical-progress__content-calendar-icon"
            style={{ fill: "#581C87", cursor: "pointer" }}
            src={defaultIcons.editIcon}
            alt="Edit"
            onClick={() => handleEditNote(groupData?.[0]?.raw)}
            title="Edit this date's consultant notes"
          />
        </div>
      </Card>
    );
  };

  const renderCustomItem = (item, itemIndex, groupKey, items, emit) => {
    const value = item.period || item.timeOfDay || "";
    const formattedTimeOfDay = value.charAt(0).toUpperCase() + value.slice(1);

    return (
      <ReusableProgressCard
        record={{
          id: "1",
          sections: [
            {
              key: "clinicalAssessmentPlan",
              title: "Clinical Assessment & Plan",
              data: item.clinicalAssessmentPlan,
              type: "richtext",
            },
            {
              key: "vitals",
              title: "Vitals",
              data: item.vitals,
              type: "richtext",
            },
            {
              key: "currentMedication",
              title: "Medication(Rx)",
              data: item.currentMedication,
              type: "table",
            },
            {
              key: "labInvestigation",
              title: "Lab Investigation",
              data: item.labInvestigation,
              type: "lab-table",
            },
            {
              key: "additionalRemarks",
              title: "Additional Remarks",
              data: item.additionalRemarks,
              type: "richtext",
            },
          ],
          filledBy: item.filledBy,
          role: "Consultant",
        }}
        components={{
          RichTextEditor,
          MedicineTable,
          LabInvestigationTable,
        }}
        icons={{
          timeIcons: {
            morning: defaultIcons.clockIcon,
            afternoon: defaultIcons.clockIcon,
            evening: defaultIcons.clockIcon,
            night: defaultIcons.clockIcon,
          },
          sectionIcons: {
            clinicalAssessmentPlan: defaultIcons.basicInfoBg,
            vitals: defaultIcons.physicalExam,
            currentMedication: defaultIcons.funcAssess,
            labInvestigation: defaultIcons.treatment,
            additionalRemarks: defaultIcons.noteColoured,
          },
          actionIcons: {
            download: defaultIcons.downloadIcon,
            print: defaultIcons.printerIcon,
            edit: defaultIcons.editIcon,
          },
        }}
        showHeader={false} // No time header
        className="detailed-medical-card"
        onAction={(eventName, payload) =>
          emit(eventName, { ...payload, data: item })
        }
      />
    );
  };

  // Helper function to add events to the log
  const addEvent = (eventType, data) => {
    const newEvent = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type: eventType,
      data: data,
    };
    // setEvents((prev) => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const mappedData = useMemo(() => {
    if (!Array.isArray(consultantNotes)) return [];
    return consultantNotes.map((entry) => {
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
        filledBy: entry?.createdBy ? `Dr. ${entry.createdBy}` : undefined,
        role: undefined,
      };
    });
  }, [consultantNotes]);

  return (
    <div className="consultant-notes-timeline">
      {/* Filter Section */}
      {/* <div className="timeline-filter">
        <div className="timeline-filter-left">
          <DatePicker
            placeholder="Filter by Date"
            value={filterDate}
            onChange={setFilterDate}
            allowClear
            format="DD MMM YYYY"
            className="timeline-date-filter"
          />
        </div>
      </div> */}

      <ReusableStepper
        data={mappedData}
        groupBy={(item) =>
          item.date || item.timestamp?.split(" ")[0] || "Unknown"
        }
        sortGroups={(a, b) => new Date(b) - new Date(a)}
        renderGroupHeader={renderCustomGroupHeader}
        renderItem={renderCustomItem}
        onItemEvent={handleReusableItemEvent}
        layout={{
          gridGutter: [16, 16],
          colProps: { xs: 24, sm: 12, lg: 8 },
          stepDirection: "vertical",
          currentStep: -1,
        }}
        toolbar={{ show: false }}
      />
    </div>
  );
};

export default ConsultantNotesTimeline;
