import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./otNotesTimeline.scss";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import SurgeryTeam from "./components/SurgeryTeam";
import SurgeryDetails from "./components/SurgeryDetails";
import IntraOperativeNotes from "./IntraOperativeNotes.jsx";
import OperativeNotes from "./OperativeNotes.jsx";
import PostOperativeNotes from "./PostOperativeNotes.jsx";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setCurrentOtNoteId,
  setSingleOtNotesData,
} from "../../../redux/ipd/otNotesSlice.js";
import DateRangeFilter from "../components/DateRangeFilter.js";
import { getCustomization } from "../../../redux/ipd/ipdSlice.js";

const ReusableStepper = createRemoteComponent("ReusableStepper");

const OtNotesTimeline = () => {
  const dateFormat = "YYYY-MM-DD";
  const showDateFormat = "DD-MM-YYYY";
  const dispatch = useDispatch();
  const otNotesState = useSelector((state) => state.otNotes);
  const { customization = {} } = useSelector((state) => state.ipd);
  const [dateStatus, setDateStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const { otNotes = [] } = customization;

  useEffect(() => {
    dispatch(getCustomization());
  }, []);

  const handleEditOtNotes = (id) => {
    dispatch(setCurrentOtNoteId(id));
    dispatch(setSingleOtNotesData({ _id: id }));
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        activeOtNoteId: id,
      },
    });
  };

  const handlePickerModal = useCallback(() => {
    setPickerModal(!pickerModal);
  }, [pickerModal]);
  const handleDateCancel = useCallback(() => {
    setDateStatus(null);
    setDateRange(null);
    setPickerModal(false);
  }, []);

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

  console.log("INTEL ==> dates", dateRange, dateStatus);

  const renderCustomGroupHeader = (groupKey, groupData, emit) => {
    const data = groupData?.[0]?.originalEntry;
    const otNotesData = data?.otNotes;
    const calculateSurgeryDuration = (startTime, endTime) => {
      if (!startTime || !endTime) return 0;

      const startMoment = moment(startTime, "HH:mm");
      let endMoment = moment(endTime, "HH:mm");

      if (endMoment.isBefore(startMoment)) {
        endMoment.add(1, "day");
      }

      return endMoment.diff(startMoment, "minutes");
    };

    const formatSurgeryTime = (minutes) => {
      if (minutes <= 0) return "";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0 && mins > 0) {
        return `${hours}hr ${mins}min`;
      } else if (hours > 0) {
        return `${hours}hr`;
      } else {
        return `${mins}min`;
      }
    };

    const surgeryTimeDiff = calculateSurgeryDuration(
      otNotesData?.surgeryDetails?.surgeryStartTime,
      otNotesData?.surgeryDetails?.surgeryEndTime
    );
    const surgeryTime = formatSurgeryTime(surgeryTimeDiff);
    return (
      <>
        <div className="ipdot-readonly-ot-header-container">
          <div className="ipdot-readonly-ot-header-left-section-top-container">
            <div className="ipdot-readonly-ot-header-left-section">
              <img
                className="ipdot-readonly-ot-header-icon"
                alt="OT Notes"
                src={defaultIcons.otSurgeryIcon}
              />
              <div className="ipdot-readonly-ot-header-left-mid-section">
                <div className="ipdot-readonly-ot-header-title">
                  {otNotesData?.surgeryDetails?.procedureName?.map(
                    (item, index) => {
                      return (
                        <span>
                          {item}
                          {index <
                            otNotesData?.surgeryDetails?.procedureName.length -
                              1 && ", "}
                        </span>
                      );
                    }
                  )}
                </div>
                <div className="irohb-section">
                  <div className="irohb-section-left">
                    <img
                      src={defaultIcons.calendarDarkOutlineIcon}
                      alt="Clock"
                    />
                    <span>{otNotesData?.surgeryDetails?.surgeryDate}</span>
                  </div>
                  <div className="irohb-section-right">
                    <img
                      src={defaultIcons.clockDarkOutlineIcon}
                      alt="Calendar"
                    />
                    <span>
                      {otNotesData?.surgeryDetails?.surgeryStartTime} -{" "}
                      {otNotesData?.surgeryDetails?.surgeryEndTime} (
                      {surgeryTime})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ipdot-readonly-ot-header-right-section">
            <img
              className="medical-progress__content-download-icon"
              style={{ fill: "#581C87", cursor: "pointer" }}
              src={defaultIcons.downloadIcon}
              alt="Download"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Download this date's OT notes"
            />
            <img
              className="medical-progress__content-print-icon"
              style={{ fill: "#581C87", cursor: "pointer" }}
              src={defaultIcons.printerIcon}
              alt="Print"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Print this date's OT notes"
            />
            <img
              className="medical-progress__content-calendar-icon"
              style={{ fill: "#581C87", cursor: "pointer" }}
              src={defaultIcons.editIcon}
              alt="Edit"
              onClick={() =>
                handleEditOtNotes(groupData?.[0]?.originalEntry?._id)
              }
              title="Edit this date's OT notes"
            />
          </div>
        </div>
      </>
    );
  };

  const handleGroupHeaderAction = (action, groupKey, groupData) => {
    console.log("Action:", action, groupKey, groupData);
  };

  const handleReusableItemEvent = (eventName, payload) => {
    console.log("Event:", eventName, payload);
  };

  const mappedData = useMemo(() => {
    if (!Array.isArray(otNotesState.otNotesData)) return [];
    return otNotesState?.otNotesData?.map((entry, index) => {
      const dateIso = entry?.createdAt ? new Date(entry?.createdAt) : null;
      return {
        date: dateIso?.toISOString(),
        originalEntry: entry,
        renderStepItem: () => {
          const CollapsibleContent = () => {
            const [isExpanded, setIsExpanded] = useState(false);

            return (
              <div className="collapsible-wrapper">
                <div
                  className={`ot-notes-content ${
                    isExpanded ? "expanded" : "collapsed"
                  }`}
                >
                  {Object.keys(entry?.otNotes)?.map((otEntry) => {
                    switch (otEntry) {
                      case "surgeryDetails":
                        return (
                          <SurgeryDetails
                            key={otEntry}
                            id={otEntry}
                            surgeryDetails={entry?.otNotes?.[otEntry]}
                          />
                        );
                      case "surgeryTeam":
                        return (
                          <SurgeryTeam
                            key={otEntry}
                            id={otEntry}
                            surgeryTeam={entry?.otNotes?.[otEntry]}
                          />
                        );
                      case "operativeNotes":
                        return (
                          <OperativeNotes
                            key={otEntry}
                            isEditable={false}
                            sectionData={otNotes?.find(
                              (item) => item.id === otEntry
                            )}
                            operativeNotes={entry?.otNotes?.[otEntry]}
                          />
                        );
                      case "intraOperativeNotes":
                        return (
                          <IntraOperativeNotes
                            key={otEntry}
                            isEditable={false}
                            id={otEntry}
                            sectionData={otNotes?.find(
                              (item) => item.id === otEntry
                            )}
                            intraOperativeNotes={entry?.otNotes?.[otEntry]}
                          />
                        );
                      case "postOperativeNotes":
                        return (
                          <PostOperativeNotes
                            key={otEntry}
                            isEditable={false}
                            id={otEntry}
                            sectionData={otNotes?.find(
                              (item) => item.id === otEntry
                            )}
                            postOperativeNotes={entry?.otNotes?.[otEntry]}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
                {!isExpanded && (
                  <div className="gradient-overlay">
                    <button
                      className="view-more-btn"
                      onClick={() => setIsExpanded(true)}
                    >
                      View more
                      <img
                        src={defaultIcons.downArrowPcIcon}
                        alt="arrow down"
                        className="arrow-down"
                      />
                    </button>
                  </div>
                )}
                {isExpanded && (
                  <button
                    className="view-less-btn"
                    onClick={() => setIsExpanded(false)}
                  >
                    View less
                    <img
                      src={defaultIcons.downArrowPcIcon}
                      alt="arrow up"
                      className="arrow-up"
                    />
                  </button>
                )}
              </div>
            );
          };

          return <CollapsibleContent key={index} />;
        },
      };
    });
  }, [otNotesState.otNotesData, otNotes]);

  return (
    <div className="ot-notes-timeline-container">
      <div className="ipdot-date-range-filter-container">
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
      <ReusableStepper
        data={mappedData}
        groupBy={(item) =>
          item.date || item.timestamp?.split(" ")[0] || "Unknown"
        }
        sortGroups={(a, b) => new Date(b) - new Date(a)}
        renderGroupHeader={renderCustomGroupHeader}
        onGroupHeaderAction={handleGroupHeaderAction}
        onItemEvent={handleReusableItemEvent}
        layout={{
          stepDirection: "vertical",
          currentStep: -1,
        }}
        showShadow={true}
        toolbar={{ show: true, label: "All dates" }}
      />
    </div>
  );
};

export default OtNotesTimeline;
