import React, { useState, useMemo, useCallback, useEffect } from "react";
import moment from "moment";
import { Card, Button, Divider, Space, Typography, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { RemoteComponents } from "../../../../shared/remoteComponents";
import { defaultIcons } from "../../../../assets/images/icons/index.js";
import "./progressNotesView.scss";
import DateRangeFilter from "../../components/DateRangeFilter.js";
import { useDispatch, useSelector } from "react-redux";
import { downloadModule, printModule } from "../../utils/printDownload";
import {
  filterProgressNotesByDateRange,
  clearDateFilter,
} from "../../../../redux/ipd/progressNotesSlice";
import useOnlyViewMode from "../../../../hooks/useOnlyViewMode";

const { Title, Text } = Typography;
const { ReusableStepper, ReusableProgressCard, RichTextEditor } =
  RemoteComponents;

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD-MM-YYYY";

function ProgressNotesView({
  progressNotes,
  filteredProgressNotes,
  patientDetails,
  isProgressNotesSummary = false,
}) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { printSettings } = useSelector((state) => state.printSettings);

  // Local state
  const [dateStatus, setDateStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);
  const isOnlyViewMode = useOnlyViewMode();
  const disabledDate = useCallback((current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  }, []);

  const onRangeChange = useCallback((dates, dateStrings) => {
    if (dates) {
      // Determine date status based on selected dates
      const today = moment().format(dateFormat);
      const startDate = moment(dateStrings[0], showDateFormat).format(
        dateFormat
      );
      const endDate = moment(dateStrings[1], showDateFormat).format(dateFormat);

      if (startDate === today && endDate === today) {
        setDateStatus(1);
      } else if (
        startDate === moment().add(-1, "d").format(dateFormat) &&
        endDate === today
      ) {
        setDateStatus(2);
      } else if (
        startDate === moment().add(-7, "d").format(dateFormat) &&
        endDate === today
      ) {
        setDateStatus(3);
      } else if (
        startDate === moment().add(-1, "M").format(dateFormat) &&
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

  const handleDateRangeChange = useCallback(
    async (dates, dateStrings) => {
      // Call the existing onRangeChange to update local state
      onRangeChange(dates, dateStrings);
      
      // Call API with date range if dates are selected
      if (dates && dateStrings && dateStrings.length === 2) {
        const startDate = moment(dateStrings[0], showDateFormat).format(
          dateFormat
        );
        const endDate = moment(dateStrings[1], showDateFormat).format(
          dateFormat
        );

        // Call API to fetch filtered progress notes
        try {
          await dispatch(filterProgressNotesByDateRange({
            patientId: patientDetails?.details?.id,
            admissionId: patientDetails?.admissionId || patientDetails?.admission_id,
            filterStartDate: startDate,
            filterEndDate: endDate,
          }));
        } catch (error) {
          console.error("Error fetching filtered progress notes:", error);
        }
      } else {
        // Clear filter if no dates selected
        dispatch(clearDateFilter());
      }
    },
    [onRangeChange, dispatch, patientDetails]
  );

  const handlePickerModal = useCallback(() => {
    setPickerModal(!pickerModal);
  }, [pickerModal]);

  const handleDateCancel = useCallback(() => {
    setDateStatus(null);
    setDateRange(null);
    setPickerModal(false);
    // Clear the filter when canceling
    dispatch(clearDateFilter());
  }, [dispatch]);

  // Use filtered data if available, otherwise use original data
  const dataToMap =
  dateRange && dateRange.startDate && dateRange.endDate ? filteredProgressNotes : progressNotes;

  const mappedData = useMemo(() => {
    if (!Array.isArray(dataToMap)) return [];
    return dataToMap.map((entry) => {
      const pn = entry?.progressNotes || {};
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
        chiefComplaint: pn?.chiefComplaint,
        findings: pn?.findings,
        vitals: pn?.vitals,
        additionalRemarks: pn?.additionalRemarks,
        filledBy: entry?.createdByName ? `${entry.createdByName}` : "",
        role: entry?.createdByRole,
      };
    });
  }, [dataToMap]);

  // Event handlers for ReusableStepper + ReusableProgressCard
  const handleReusableItemEvent = (eventName, payload) => {
    if (eventName === "edit") {
      const progressNotes = payload?.data;
      navigate("/ipd/patient-details/progress-notes", {
        state: {
          progressNotesData: progressNotes,
          patientDetails,
          isEditable: true,
        },
      });
    }
    addEvent(`ReusableStepper - ${eventName}`, payload);
  };

  const handleReusableAllDatesClick = () => {
    addEvent("ReusableStepper - All Dates Click", {});
  };

  // Event handlers for group header actions (download, print)
  const handleGroupHeaderAction = async (action, groupKey, groupData) => {
    addEvent(`Group Header - ${action}`, { groupKey, groupData });

    const normalizedAction = typeof action === "string" ? action.toLowerCase() : "";
    const entries = Array.isArray(groupData)
      ? groupData
          .map((item) => item?.raw)
          .filter((item) => item && typeof item === "object")
      : [];

    if (!entries.length) {
      console.warn("No progress notes found for the selected date", {
        action,
        groupKey,
        groupData,
      });
      return;
    }

    try {
      if (normalizedAction === "download") {
        await downloadModule("progressNotes", printSettings, patientDetails, entries);
        addEvent("Group Header - download success", { groupKey, count: entries.length });
      } else if (normalizedAction === "print") {
        await printModule("progressNotes", printSettings, patientDetails, entries);
        addEvent("Group Header - print success", { groupKey, count: entries.length });
      }
    } catch (error) {
      console.error(`Error handling ${action} for progress notes`, error);
      addEvent("Group Header - action error", {
        action,
        groupKey,
        error: error?.message || error,
      });
    }
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
            style={{ fill: "#581C87" }}
            src={defaultIcons.calendarDarkIcon}
            alt=""
          />
          <span className="medical-progress__content-date-text">
            {formattedDate}
          </span>
          {!isProgressNotesSummary && (
            <>
              {" "}
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
                title="Download this date's progress notes"
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
                title="Print this date's progress notes"
              />
            </>
          )}
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
              key: "chiefComplaint",
              title: "Chief Complaint",
              data: item.chiefComplaint,
              type: "richtext",
            },
            {
              key: "findings",
              title: "Findings",
              data: item.findings,
              type: "richtext",
            },
            {
              key: "vitals",
              title: "Vitals",
              data: item.vitals,
              type: "richtext",
            },

            {
              key: "additionalRemarks",
              title: "Additional Remarks",
              data: item.additionalRemarks,
              type: "richtext",
            },
          ],
          filledBy: item.filledBy,
          role: item.role,
          timeOfDay: formattedTimeOfDay,
          timestamp: item.time,
        }}
        components={{
          RichTextEditor,
        }}
        actions={
          !isOnlyViewMode &&
          !isProgressNotesSummary &&
          new Date(item?.timestamp).toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0]
            ? [{ name: "edit", label: "Edit progress note" }]
            : []
        }
        onAction={(eventName, payload) =>
          emit(eventName, { ...payload, data: item })
        }
        className={isProgressNotesSummary ? "agent-alex-card" : undefined}
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
    setEvents((prev) => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div
      style={{
        padding: !isProgressNotesSummary ? "20px 0" : 0,
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div className="ms-3" style={{ width: "max-content", maxWidth: "260px" }}>
        {!isProgressNotesSummary && (
          <DateRangeFilter
            placeholder={"Filter by date"}
            dateRange={dateRange}
            dateStatus={dateStatus}
            isOpen={pickerModal}
            onRangeChange={handleDateRangeChange}
            onToggleModal={handlePickerModal}
            onCancel={handleDateCancel}
            disabledDate={disabledDate}
          />
        )}
      </div>
      { mappedData.length > 0 ? (
      <div>
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
            // colProps: { xs: 24, sm: 12, lg: 8 },
            stepDirection: "vertical",
            currentStep: -1,
          }}
          cardsDisplay={isProgressNotesSummary ? "column" : "row"}
          sidebarClassName={isProgressNotesSummary ? "agent-alex-sidebar" : ""}
          contentClassName={
            isProgressNotesSummary ? "agent-pn-step-content" : undefined
          }
        />
      </div>
      ) : (
        <div className="no-data-container">
          <Empty description="No progress notes found for the selected date range" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  );
}

export default ProgressNotesView;
