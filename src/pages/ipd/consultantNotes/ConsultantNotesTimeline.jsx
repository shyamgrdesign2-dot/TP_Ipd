import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "antd";
import moment from "moment";
import {
  setCurrentConsultantNote,
  setClinicalAssessmentPlan,
  setVitals,
  setLabInvestigation,
  setAdditionalRemarks,
  getConsultantNotes,
} from "../../../redux/ipd/consultantNotesSlice";
import { setMedicationData } from "../../../redux/prescriptionSlice";
import "./styles.scss";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import {
  MedicineTable,
  LabInvestigationTable,
} from "../../../components/ReusableTable";
import DateRangeFilter from "../components/DateRangeFilter.js";
import { defaultIcons as icons } from "../../../assets/images/icons/index.js";

const ReusableProgressCard = createRemoteComponent("ReusableProgressCard");
const ReusableStepper = createRemoteComponent("ReusableStepper");
const RichTextEditor = createRemoteComponent("RichTextEditor");

const ConsultantNotesTimeline = () => {
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;
  const [dateRange, setDateRange] = useState(null);
  const [dateStatus, setDateStatus] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);

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
        startDate === moment().add(-1, "M").format("YYYY-MM-DD") &&
        endDate === today
      ) {
        setDateStatus(3);
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
  }, []);

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

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
        <div className="d-flex justify-content-between align-items-center">
          <div className="medical-progress__content-date">
            <img
              className="medical-progress__content-calendar-icon"
              style={{ fill: "#581C87" }}
              src={icons.calendarIcon}
              alt=""
            />
            <span className="medical-progress__content-date-text">
              {formattedDate}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <img
              className="medical-progress__content-download-icon"
              style={{ fill: "#581C87", cursor: "pointer" }}
              src={icons.downloadIcon}
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
              src={icons.printerIcon}
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
              src={icons.editIcon}
              alt="Edit"
              onClick={() => handleEditNote(groupData?.[0]?.raw)}
              title="Edit this date's consultant notes"
            />
          </div>
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
              key: "medication",
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
        actions={[]}
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
