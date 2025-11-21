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
import { convertSurgeryDataToDisplayFormat } from "../../../utils/utils.js";
import { isEmptyRichText } from "../../../utils/utils.js";
import { dischargeSummaryIcons } from "../../../assets/images/indices/index.js";
import FilledByCards from "./components/FilledByCards.jsx";
import { useDischargeSummaryData } from "../dischargeSummary/utils/useDischargeSummaryData.js";
import useOnlyViewMode from "../../../hooks/useOnlyViewMode";
import { Empty } from "antd";
const ReusableStepper = createRemoteComponent("ReusableStepper");
const GenericCard = createRemoteComponent("GenericCard");
const RichTextEditor = createRemoteComponent("RichTextEditor");

const OtNotesTimeline = ({ isLiteMode = false }) => {
  const dateFormat = "YYYY-MM-DD";
  const showDateFormat = "DD-MM-YYYY";
  const dispatch = useDispatch();
  const otNotesState = useSelector((state) => state.otNotes);
  const isOnlyViewMode = useOnlyViewMode();
  const { showLastUpdatedAt } = useDischargeSummaryData(true, true);
  const { customization = {} } = useSelector((state) => state.ipd);
  const [dateStatus, setDateStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data, patientDetails, fromTab } = state || {};
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
        fromTab,
      },
    });
  };

  const handleAddEditOtNote = (section) => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    dispatch(setCurrentOtNoteId(section?._id));
    dispatch(setSingleOtNotesData({ _id: section?._id }));
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        activeOtNoteId: section?._id,
        fromDischargeSummary: true,
        fromTab,
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

  const renderCustomGroupHeader = (groupKey, groupData, emit) => {
    const data = groupData?.[0]?.originalEntry;
    const otNotesData = data?.otNotes;
    const calculateSurgeryDuration = (startTime, endTime) => {
      if (!startTime || !endTime) return 0;

      const startMoment = moment(startTime, "hh:mm A");
      let endMoment = moment(endTime, "hh:mm A");

      // If end < start → means next day
      if (endMoment.isBefore(startMoment)) {
        endMoment.add(1, "day");
      }

      return endMoment.diff(startMoment, "minutes");
    };

    const formatSurgeryTime = (totalMinutes) => {
      if (!totalMinutes || totalMinutes <= 0) return "";
    
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
    
      if (hours && mins) return `${hours}hr ${mins}min`;
      if (hours) return `${hours}hr`;
      return `${mins}min`;
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
            {/* <img
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
            /> */}
            {!isOnlyViewMode ? (
              <img
                className="medical-progress__content-calendar-icon"
                style={{ fill: "#581C87", cursor: "pointer" }}
                src={defaultIcons.editDarkIcon}
                alt="Edit"
                onClick={() =>
                  handleEditOtNotes(groupData?.[0]?.originalEntry?._id)
                }
                title="Edit this date's OT notes"
              />
            ) : null}
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
      const updates = entry?.updates;
      return {
        date: dateIso?.toISOString(),
        originalEntry: entry,
        renderStepItem: (data) => {
          const CollapsibleContent = () => {
            const [isExpanded, setIsExpanded] = useState(false);

            return (
              <div className="collapsible-wrapper">
                <div
                  className={`ot-notes-content ${
                    isExpanded || isLiteMode ? "expanded" : "collapsed"
                  }`}
                >
                  {isLiteMode ? (
                    <ul className="ot-notes-content-lite">
                      {convertSurgeryDataToDisplayFormat(entry?.otNotes)?.map(
                        (item) => {
                          if (typeof item.value === "string") {
                            return (
                              <li className="surgery-card__item">
                                <span className="surgery-card__label">
                                  {item.key}:
                                </span>{" "}
                                <span className="surgery-card__value">
                                  {item.value}
                                </span>
                              </li>
                            );
                          }
                          if (item.value?.[0]?.children) {
                            if (isEmptyRichText(item.value)) {
                              return null;
                            }
                            return (
                              <li className="surgery-card__item">
                                <div className="d-flex">
                                  <span className="surgery-card__label">
                                    {item.key}:
                                  </span>{" "}
                                  <RichTextEditor
                                    showActionBtns={false}
                                    showAutoFill={false}
                                    showMagicPenGif={false}
                                    width={"fit-content"}
                                    showMicrophone={false}
                                    showToolbar={false}
                                    readOnly={true}
                                    className={
                                      "rich-text-editor-container-readonly"
                                    }
                                    initialValue={item.value}
                                  />
                                </div>
                              </li>
                            );
                          }
                          return null;
                        }
                      )}
                    </ul>
                  ) : (
                    <>
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
                      <FilledByCards
                        updates={
                          !!updates.length ? [updates[updates.length - 1]] : []
                        }
                        createdByRole={entry?.createdByRole}
                        createdByName={entry?.createdByName}
                        createdAt={entry?.createdAt}
                      />
                    </>
                  )}
                </div>
                {!isLiteMode ? (
                  <>
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
                  </>
                ) : null}
              </div>
            );
          };

          return <CollapsibleContent key={index} />;
        },
      };
    });
  }, [otNotesState.otNotesData, otNotes, isLiteMode]);

  const filteredMappedData = useMemo(() => {
    if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
      return mappedData;
    }

    const startDate = moment(dateRange.startDate).startOf("day");
    const endDate = moment(dateRange.endDate).endOf("day");

    return mappedData.filter((item) => {
      const surgeryDate =
        item.originalEntry?.otNotes?.surgeryDetails?.surgeryDate;
      if (!surgeryDate) return false;

      let itemDate = moment(surgeryDate, "DD MMM YYYY");
      if (!itemDate.isValid()) {
        itemDate = moment(surgeryDate, showDateFormat);
      }

      if (!itemDate.isValid()) {
        return false;
      }

      return itemDate.isBetween(startDate, endDate, null, "[]");
    });
  }, [mappedData, dateRange]);

  if (isLiteMode) {
    return (
      <div
        className={`ot-notes-timeline-container no-margin-bottom flex-column-gap-16 ${
          isLiteMode ? "no-extra-margin-padding" : ""
        }`}
      >
        {filteredMappedData?.map((section, sectionIndex) => {
          return (
            <div className="otnotelite-section-container big-box-with-shadow flex-column-gap-16">
              <div className="d-flex-align-center-gap-8">
                <img
                  src={dischargeSummaryIcons.surgeryDetailsPc}
                  alt="Surgery"
                />
                <div className="fs16-bold">Surgery {sectionIndex + 1}</div>
                {showLastUpdatedAt(section?.originalEntry?._id)}
              </div>
              <div className="otnotelite-section-content box-with-padding padding-0">
                {section?.renderStepItem(true)}
              </div>
              <div onClick={() => handleAddEditOtNote(section?.originalEntry)}>
                <GenericCard
                  key={section?.id}
                  icon={defaultIcons.editIcon}
                  title={`Add/Edit Surgery ${sectionIndex + 1} Details`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

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

      {filteredMappedData.length > 0 ? (
        <ReusableStepper
          data={filteredMappedData}
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
          toolbar={{
            show: true,
            label: dateRange
              ? `Filtered: ${moment(dateRange.startDate).format(
                  showDateFormat
                )} - ${moment(dateRange.endDate).format(showDateFormat)}`
              : "All dates",
          }}
        />
      ) : (
        <div className="no-data-container">
          <Empty
            description="No OT notes found for the selected date range"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </div>
  );
};

export default OtNotesTimeline;
