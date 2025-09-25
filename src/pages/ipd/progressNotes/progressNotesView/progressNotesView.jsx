import React, { useState, useMemo, useCallback, useEffect } from "react";
import moment from "moment";
import { Card, Button, Divider, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { RemoteComponents } from "../../../../shared/remoteComponents";
import { defaultIcons } from "../../../../assets/images/icons/index.js";
import "./progressNotesView.scss";
import DateRangeFilter from "../../components/DateRangeFilter.js";

const { Title, Text } = Typography;
const { ReusableStepper, ReusableProgressCard, RichTextEditor } =
  RemoteComponents;

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD-MM-YYYY";

function ProgressNotesView({ progressNotes, patientDetails }) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Local state
  const [dateStatus, setDateStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);

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
        startDate === moment().add(-1, "M").format(dateFormat) &&
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

  const handlePickerModal = useCallback(() => {
    setPickerModal(!pickerModal);
  }, [pickerModal]);

  const handleDateCancel = useCallback(() => {
    setDateStatus(null);
    setDateRange(null);
    setPickerModal(false);
  }, []);

  const mappedData = useMemo(() => {
    if (!Array.isArray(progressNotes)) return [];
    return progressNotes.map((entry) => {
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
  }, [progressNotes]);

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
          new Date(item?.timestamp).toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0]
            ? [{ name: "edit", label: "Edit progress note" }]
            : []
        }
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
    setEvents((prev) => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ width: "max-content", maxWidth: "260px" }}>
        <DateRangeFilter
          placeholder={"Filter by date"}
          dateRange={dateRange}
          dateStatus={dateStatus}
          isOpen={pickerModal}
          onRangeChange={onRangeChange}
          onToggleModal={handlePickerModal}
          onCancel={handleDateCancel}
          disabledDate={disabledDate}
        />
      </div>
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
            colProps: { xs: 24, sm: 12, lg: 8 },
            stepDirection: "vertical",
            currentStep: -1,
          }}
          // toolbar={{
          //   show: true,
          //   label: 'All Dates',
          //   icon: <span className="medical-progress__calendar-icon">📅</span>,
          //   onClick: handleReusableAllDatesClick,
          // }}
        />
      </div>
    </div>
  );
}

export default ProgressNotesView;
