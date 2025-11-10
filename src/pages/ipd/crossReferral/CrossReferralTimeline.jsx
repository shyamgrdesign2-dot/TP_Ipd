import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as newIcons } from "../../../assets/images/indices";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setCurrentCrossReferralId,
  setSelectedConsultantNoteId,
  setSingleCrossReferralData,
} from "../../../redux/ipd/crossReferralSlice.js";
import DateRangeFilter from "../components/DateRangeFilter.js";
import { getCustomization } from "../../../redux/ipd/ipdSlice.js";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import { getTokenData, isEmptyRichText } from "../../../utils/utils.js";
import ReferralInformationView from "./ReferralInformationView.jsx";
import { IPD } from "../../../utils/locale.js";
// import { MetricsList } from "../otNotes/IntraOperativeNotes.jsx";

const RichTextEditor = createRemoteComponent("RichTextEditor");
const GenericCard = createRemoteComponent("GenericCard");
const ReusableStepper = createRemoteComponent("ReusableStepper");

const CrossReferralTimeline = () => {
  const dateFormat = "YYYY-MM-DD";
  const showDateFormat = "DD-MM-YYYY";
  const dispatch = useDispatch();
  const crossReferralState = useSelector((state) => state.crossReferral);
  const { customization = {} } = useSelector((state) => state.ipd);
  const [dateStatus, setDateStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const { crossReferral = [] } = customization;

  useEffect(() => {
    dispatch(getCustomization());
  }, []);

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
    const crossReferralData = data?.crossReferral;
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

    return (
      <>
        <div className="ipdot-readonly-ot-header-container">
          <div className="ipdot-readonly-ot-header-left-section-top-container">
            <div className="ipdot-readonly-ot-header-left-section">
              <img
                className="ipdot-readonly-ot-header-icon"
                alt="Cross Referral"
                src={newIcons.postOperativeNotesDark}
              />
              <div className="ipdot-readonly-ot-header-left-mid-section">
                <div className="ipdot-readonly-ot-header-title">
                  Referred To:{" "}
                  {crossReferralData?.referralInformation?.referringTo?.name}
                </div>
                <div className="irohb-section">
                  <div className="irohb-section-left">
                    <img
                      src={defaultIcons.calendarDarkOutlineIcon}
                      alt="Clock"
                    />
                    <span>
                      {crossReferralData?.referralInformation?.referralDate}
                    </span>
                  </div>
                  <div className="irohb-section-right">
                    <img src={defaultIcons.clockDarkOutlineIcon} alt="Clock" />
                    <span>
                      {
                        crossReferralData?.referralInformation
                          ?.relativesInformed?.informedOnTime
                      }
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
              title="Download this date's cross referral"
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
              title="Print this date's cross referral"
            />
          </div>
        </div>
      </>
    );
  };
  const handleAddConsultantNotesClick = (
    data,
    id,
    existingConsultantNotesLength,
    fullData
  ) => {
    dispatch(setCurrentCrossReferralId(id));
    dispatch(setSingleCrossReferralData({ _id: id }));
    dispatch(setSelectedConsultantNoteId(existingConsultantNotesLength));
    navigate("/ipd/patient-details/cross-referral/consultant-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        fullData: {
          referralInformationData: fullData?.referralInformation,
          id,
        },
      },
    });
  };

  const renderConsultantNotes = (
    consultantNotes,
    _id,
    consultantNoteIndex,
    fullData,
    isCurrentDoctorReferee
  ) => {
    return (
      <div className="ipdcrt-section-container">
        <div className="heading">
          <div className="left-section">
            <img src={newIcons.consultantNotesDataDark} alt="x" />
            <span>Consultant Notes</span>
          </div>
          {isCurrentDoctorReferee ? (
            <div className="right-section">
              <img
                className="medical-progress__content-calendar-icon"
                style={{ fill: "#581C87", cursor: "pointer" }}
                src={defaultIcons.editDarkIcon}
                alt="Edit"
                onClick={() =>
                  handleAddConsultantNotesClick(
                    consultantNotes,
                    _id,
                    consultantNoteIndex,
                    fullData
                  )
                }
                title="Edit this date's cross referral"
              />
            </div>
          ) : null}
        </div>
        <ul className="">
          {IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE_VIEW_DETAILS?.find(
            (item) => item.id !== "referralInformation" && item.enabled
          )?.children?.map((item) => {
            if (
              item.id !== "additionalRemarksAndFollowUp" &&
              isEmptyRichText(consultantNotes[item.id]) &&
              item.enabled
            ) {
              return null;
            }
            const value =
              item.id === "additionalRemarksAndFollowUp"
                ? consultantNotes["additionalRemarks"]
                : consultantNotes[item.id];
            if (item.id === "additionalRemarksAndFollowUp") {
              return (
                <>
                  {item.children.map((child) => {
                    if (child.id === "followUp" && consultantNotes[child.id]) {
                      return (
                        <div className="surgery-card__item__padding">
                          <div className="d-flex align-items-center gap-1">
                            <img src={newIcons[`${item.id}Pc`]} alt="notepad" />
                            <div className="surgery-card__label">
                              {child.title}
                            </div>
                          </div>
                          {/* <img className src={defaultIcons.}> */}
                          <div className="">
                            <span className="surgery-card__label">
                              {consultantNotes[child.id]}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    if (isEmptyRichText(consultantNotes[child.id])) return null;
                    return (
                      <div className="surgery-card__item__padding">
                        <div>
                          <div className="d-flex align-items-center gap-1">
                            <img
                              src={newIcons.additionalRemarksAndFollowUpPc}
                              alt="notepad"
                            />
                            <div className="surgery-card__label">
                              {child.title}
                            </div>{" "}
                          </div>
                          <RichTextEditor
                            showActionBtns={false}
                            showAutoFill={false}
                            showMagicPenGif={false}
                            showMicrophone={false}
                            showToolbar={false}
                            readOnly={true}
                            className={"rich-text-editor-container-readonly"}
                            initialValue={consultantNotes[child.id]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            }
            if (isEmptyRichText(value)) return null;
            return (
              <div className="surgery-card__item__padding">
                <div>
                  <div className="d-flex align-items-center gap-1">
                    <img src={newIcons[`${item.id}Pc`]} alt="notepad" />
                    <div className="surgery-card__label">{item.title}</div>{" "}
                  </div>
                  <RichTextEditor
                    showActionBtns={false}
                    showAutoFill={false}
                    showMagicPenGif={false}
                    showMicrophone={false}
                    showToolbar={false}
                    readOnly={true}
                    className={"rich-text-editor-container-readonly"}
                    initialValue={value}
                  />
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    );
  };

  const handleGroupHeaderAction = (action, groupKey, groupData) => {
    console.log("Action:", action, groupKey, groupData);
  };

  const handleReusableItemEvent = (eventName, payload) => {
    console.log("Event:", eventName, payload);
  };

  const mappedData = useMemo(() => {
    const { user_id } = getTokenData();
    if (!Array.isArray(crossReferralState.crossReferralData)) return [];
    return crossReferralState?.crossReferralData?.map((entry, index) => {
      const dateIso = entry?.createdAt ? new Date(entry?.createdAt) : null;
      return {
        date: dateIso?.toISOString(),
        originalEntry: entry,
        renderStepItem: () => {
          const CollapsibleContent = () => {
            const [isExpanded, setIsExpanded] = useState(true);
            const {
              relativesInformed: { informedByDoctor } = {},
              referringTo,
            } = entry?.crossReferral["referralInformation"] || {};
            const isCurrentDoctorReferee = user_id === referringTo?.id;
            return (
              <div className="collapsible-wrapper">
                <div
                  className={`cross-referral-content ${
                    isExpanded ? "expanded" : "collapsed"
                  }`}
                >
                  {Object.keys(entry?.crossReferral)?.map(
                    (crossReferralEntry) => {
                      switch (crossReferralEntry) {
                        case "referralInformation":
                          return (
                            <ReferralInformationView
                              isCurrentDoctorReferee={isCurrentDoctorReferee}
                              data={entry?.crossReferral[crossReferralEntry]}
                              uniqueId={entry?._id}
                              isEditable={
                                !entry?.crossReferral["consultantNotes"]
                                  ?.length > 0
                              }
                            />
                          );
                        case "consultantNotes":
                          return (
                            <div className="ipdf-all-consultant-notes-container">
                              {entry?.crossReferral[crossReferralEntry]?.map(
                                (consultantNote, consultantNoteIndex) => {
                                  return (
                                    <div className="ipdf-consultant-note-container">
                                      {renderConsultantNotes(
                                        consultantNote,
                                        entry?._id,
                                        consultantNoteIndex,
                                        entry?.crossReferral,
                                        isCurrentDoctorReferee
                                      )}
                                    </div>
                                  );
                                }
                              )}
                              {isCurrentDoctorReferee && (
                                // {true && (
                                <div
                                  onClick={() =>
                                    handleAddConsultantNotesClick(
                                      entry?.crossReferral[
                                        "referralInformation"
                                      ],
                                      entry?._id,
                                      entry?.crossReferral[crossReferralEntry]
                                        ?.length,
                                      entry?.crossReferral
                                    )
                                  }
                                >
                                  <GenericCard
                                    icon={defaultIcons.plusIconColoured}
                                    title={"Add Consultant Notes"}
                                  ></GenericCard>
                                </div>
                              )}
                            </div>
                          );
                        default:
                          return null;
                      }
                    }
                  )}
                  {!isCurrentDoctorReferee && (
                    <div className="empty-consultant-notes-section">
                      <div className="dot">
                        <div></div>
                      </div>
                      <span>
                        Referred Doctor's Consultation Notes yet to be filled
                      </span>
                    </div>
                  )}
                  {isCurrentDoctorReferee &&
                    !entry?.crossReferral["consultantNotes"] && (
                      <div
                        onClick={() =>
                          handleAddConsultantNotesClick(
                            entry?.crossReferral["referralInformation"],
                            entry?._id,
                            0,
                            entry?.crossReferral
                          )
                        }
                      >
                        <GenericCard
                          icon={defaultIcons.plusIconColoured}
                          title={"Add Consultant Notes"}
                        ></GenericCard>
                      </div>
                    )}
                </div>
              </div>
            );
          };

          return <CollapsibleContent key={index} />;
        },
      };
    });
  }, [crossReferralState.crossReferralData, crossReferral]);

  const filteredMappedData = useMemo(() => {
    if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
      return mappedData;
    }

    const startDate = moment(dateRange.startDate).startOf("day");
    const endDate = moment(dateRange.endDate).endOf("day");

    return mappedData.filter((item) => {
      const surgeryDate =
        item.originalEntry?.crossReferral?.referralInformation?.referralDate;
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

  return (
    <div className="cross-referral-timeline-container">
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
    </div>
  );
};

export default CrossReferralTimeline;
