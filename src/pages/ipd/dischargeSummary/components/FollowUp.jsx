import React, { useState, useEffect } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons as defaultAssetIcons } from "../../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, Input, Button } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import {
  setDischargeSummaryData,
  setFollowUps,
  addFollowUp,
  updateFollowUp,
  removeFollowUp,
} from "../../../../redux/ipd/dischargeSummarySlice";
import { fetchFilters } from "../../../../redux/ipd/inPatientsSlice";
import {
  isEmptyRichText,
  onlyNumberFormat,
} from "../../../../utils/utils";
import { voiceRx } from "../../../../redux/ipd/ipdSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const dateDisplayFormat = "D MMM YYYY";

const FollowUp = (props) => {
  const {
    isEditable = true,
    sectionData,
    patientId: patientIdProp = null,
    admissionId: admissionIdProp = null,
  } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { filters } = useSelector((state) => state.inPatients);
  const doctorsList = filters?.doctor || [];
  const dispatch = useDispatch();
  const [
    autoFillTextToAppendAdditionalNotes,
    setAutoFillTextToAppendAdditionalNotes,
  ] = useState([]);
  const resolvedPatientId =
    patientIdProp ||
    dischargeSummaryData?.patientInformation?.patientId ||
    dischargeSummaryData?.patientInformation?.id ||
    null;
  const resolvedAdmissionId =
    admissionIdProp ||
    dischargeSummaryData?.patientInformation?.admissionId ||
    null;

  // Initialize with at least one follow-up row if none exist
  useEffect(() => {
    if (
      isEditable &&
      (!dischargeSummaryData?.followUps ||
        dischargeSummaryData?.followUps?.length === 0)
    ) {
      dispatch(
        setFollowUps([
          {
            id: uuidv4(),
            followUpInput: "",
            date: null,
            doctor: [],
            dateOptions: [
              { value: "2", unit: "day", label: "2 Days" },
              { value: "2", unit: "week", label: "2 Weeks" },
              { value: "2", unit: "month", label: "2 Months" },
            ],
          },
        ])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditable]);

  useEffect(() => {
    dispatch(fetchFilters({ field: "doctor" }));
  }, [dispatch]);

  const handleOthersChange = (data, key) => {
    dispatch(setDischargeSummaryData({ ...dischargeSummaryData, [key]: data }));
  };

  const handleAddFollowUp = () => {
    dispatch(
      addFollowUp({
        id: uuidv4(),
        followUpInput: "",
        date: null,
        doctor: [],
        dateOptions: [
          { value: "2", unit: "day", label: "2 Days" },
          { value: "2", unit: "week", label: "2 Weeks" },
          { value: "2", unit: "month", label: "2 Months" },
        ],
      })
    );
  };

  const handleRemoveFollowUp = (id) => {
    dispatch(removeFollowUp(id));
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const onChangeFollowUpInput = (id, e) => {
    const updateQuery = onlyNumberFormat(e.target.value);

    let newDateOptions = [];
    if (updateQuery.length > 0) {
      newDateOptions = [
        {
          value: `${updateQuery}`,
          unit: "day",
          label: `${updateQuery} ${updateQuery <= 1 ? "Day" : "Days"}`,
        },
        {
          value: `${updateQuery}`,
          unit: "week",
          label: `${updateQuery} ${updateQuery <= 1 ? "Week" : "Weeks"}`,
        },
        {
          value: `${updateQuery}`,
          unit: "month",
          label: `${updateQuery} ${updateQuery <= 1 ? "Month" : "Months"}`,
        },
      ];
    } else {
      newDateOptions = [
        { value: "2", unit: "day", label: "2 Days" },
        { value: "2", unit: "week", label: "2 Weeks" },
        { value: "2", unit: "month", label: "2 Months" },
      ];
    }

    dispatch(
      updateFollowUp({
        id,
        updates: {
          followUpInput: updateQuery,
          date: null,
          dateOptions: newDateOptions,
        },
      })
    );
  };

  const onDateChanged = (id, date, dateString) => {
    if (dateString) {
      const dateB = moment(dateString);
      const dateC = moment().startOf("day");

      const days = dateB.diff(dateC, "days");
      const weeks = dateB.diff(dateC, "weeks");
      const months = dateB.diff(dateC, "months");

      let displayText = "";
      if (months > 0) {
        displayText = `${months} ${months <= 1 ? "Month" : "Months"}`;
      } else if (weeks > 0) {
        displayText = `${weeks} ${weeks <= 1 ? "Week" : "Weeks"}`;
      } else {
        displayText = `${days} ${days <= 1 ? "Day" : "Days"}`;
      }

      dispatch(
        updateFollowUp({
          id,
          updates: {
            followUpInput: displayText,
            date: dateB.format(dateDisplayFormat),
            dateOptions: [],
          },
        })
      );
    }
  };

  const onOptionPress = (id, option) => {
    const calculatedDate = moment()
      .startOf("day")
      .add(parseInt(option.value), option.unit);

    dispatch(
      updateFollowUp({
        id,
        updates: {
          followUpInput: option.label,
          date: calculatedDate.format(dateDisplayFormat),
          dateOptions: [],
        },
      })
    );
  };

  const handleAIRecordingComplete = async (payload, callback) => {
    if (!resolvedPatientId || !resolvedAdmissionId) {
      callback?.();
      return;
    }
    const response = await dispatch(
      voiceRx({
        patientId: resolvedPatientId,
        admissionId: resolvedAdmissionId,
        schemaKey: "DISRCHARGED_SUMMARY.followUp.additionalNotes",
        audioFile: payload?.audioBlob,
        filename: payload?.filename,
        mimeType: payload?.mimeType,
        previousOutput: dischargeSummaryData?.additionalNotes,
      })
    );

    if (response.meta.requestStatus === "fulfilled") {
      const updatedData =
        response?.payload?.data?.rxDigitizationHistory?.[0]?.response
          ?.additionalNotes || [];
      if (!isEmptyRichText(updatedData)) {
        handleOthersChange(updatedData, "additionalNotes");
        // setAutoFillTextToAppendAdditionalNotes(updatedData);
      }
      callback?.();
    } else {
      callback?.();
    }
  };

  const handleDoctorChange = (id, values, options) => {
    const selectedDoctors = values.map((value, index) => {
      const option = Array.isArray(options) ? options[index] : options;
      try {
        const parsed = option?.key ? JSON.parse(option.key) : null;
        return parsed || { name: value };
      } catch (e) {
        return { name: value };
      }
    });

    dispatch(
      updateFollowUp({
        id,
        updates: {
          doctor: selectedDoctors,
        },
      })
    );
  };
  const renderAdditionalNotes = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.additionalNotes))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title || "Additional Notes"}
        width={isEditable ? "100%" : "fit-content"}
        icon={
          dischargeSummaryIcons[`${data?.id}Pc`] ||
          dischargeSummaryIcons.additionalNotesPc
        }
        showAutoFill={false}
        containerClass={`${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
        opdDate="15 Jun 2025"
        showVoiceAI={isEditable && resolvedPatientId && resolvedAdmissionId}
        showMicrophone={true}
        voiceAiIcon={defaultAssetIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={handleAIRecordingComplete}
        onChange={(data) => handleOthersChange(data, "additionalNotes")}
        initialValue={
          dischargeSummaryData?.additionalNotes
            ? dischargeSummaryData?.additionalNotes
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          data?.placeholder ||
          "Enter follow-up instructions, medication adjustments, or other important notes"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendAdditionalNotes(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendAdditionalNotes}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendAdditionalNotes}
      />
    );
  };

  const handleClearFollowUpInput = (id) => {
    dispatch(
      updateFollowUp({
        id,
        updates: {
          followUpInput: "",
          date: null,
          dateOptions: [
            { value: "2", unit: "day", label: "2 Days" },
            { value: "2", unit: "week", label: "2 Weeks" },
            { value: "2", unit: "month", label: "2 Months" },
          ],
        },
      })
    );
  };

  const renderFollowUpRow = (followUp, index) => {
    const { id, followUpInput, date, doctor, dateOptions } =
      followUp;

    const doctorOptions = (doctorsList || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: (
        <div key={item.id}>
          {item.name} {item?.speciality ? `(${item?.speciality})` : ""}
        </div>
      ),
    }));

    const selectedDoctorValues = (doctor || []).map((doc) => doc.name);

    return (
      <div key={id} className="followup-row-container">
        <div className="followup-row-fields">
          <div className="followup-input-group">
            <label className="followup-label">Follow-up</label>
            <div className="followup-date-input-wrapper">
              <div className="followup-input-with-clear">
                <Input
                  className="followup-input-field"
                  placeholder="e.g. 3 Days"
                  value={followUpInput}
                  inputMode="numeric"
                  onChange={(e) => onChangeFollowUpInput(id, e)}
                  suffix={
                    followUpInput ? (
                      <span
                        className="followup-clear-icon"
                        onClick={() => handleClearFollowUpInput(id)}
                      >
                        ×
                      </span>
                    ) : null
                  }
                />
              </div>
              <DatePicker
                className="followup-date-picker"
                inputReadOnly
                // disabledDate={disabledDate}
                onChange={(date, dateString) =>
                  onDateChanged(id, date, dateString)
                }
                value={date ? dayjs(date, dateDisplayFormat) : null}
                suffixIcon={
                  <img
                    src={defaultAssetIcons.calendarPlainIcon}
                    alt="calendar"
                  />
                }
                placeholder="YYYY MMM D"
              />
            </div>
            {date && (
              <div className="followup-calculated-date">
                {moment(date, dateDisplayFormat).format("dddd, Do MMMM YYYY")}
              </div>
            )}
            {dateOptions && dateOptions.length > 0 && (
              <div className="followup-date-options">
                {dateOptions.map((option, i) => (
                  <Button
                    key={i}
                    type="text"
                    className="followup-option-btn"
                    onClick={() => onOptionPress(id, option)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="followup-doctor-group">
            <label className="followup-label">Follow Up Doctor Name</label>
            <Select
              className="followup-doctor-select"
              placeholder="Select Follow Up Doctor"
              options={doctorOptions}
              mode="multiple"
              value={selectedDoctorValues}
              onChange={(values, options) =>
                handleDoctorChange(id, values, options)
              }
              onSearch={(q) =>
                dispatch(fetchFilters({ field: "doctor", search: q }))
              }
              showSearch
              allowClear
              optionLabelProp="label"
            />
          </div>

          {isEditable && (
            <div className="followup-action-group">
              {index === 0 && (
                <Button
                  type="primary"
                  shape="circle"
                  icon={<span className="icon-plus">+</span>}
                  onClick={handleAddFollowUp}
                  className="followup-add-btn"
                />
              )}
              {dischargeSummaryData?.followUps?.length > 1 && (
                <Button
                  type="text"
                  danger
                  shape="circle"
                  icon={<span className="icon-delete" />}
                  onClick={() => handleRemoveFollowUp(id)}
                  className="followup-remove-btn"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection = () => {
    const additionalNotesItem = sectionData?.children?.find(
      (item) => item.id === "additionalNotes"
    ) || { title: "Additional Notes", id: "additionalNotes" };

    const followUps = dischargeSummaryData?.followUps || [];

    return (
      <div className="followup-container">
        <div className="followup-rows-section">
          {followUps.map((followUp, index) =>
            renderFollowUpRow(followUp, index)
          )}
        </div>
        <div className="followup-additional-notes-section">
          {renderAdditionalNotes(additionalNotesItem)}
        </div>
      </div>
    );
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={
          sectionData?.id
            ? dischargeSummaryIcons[`${sectionData.id}Dark`]
            : null
        }
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ipdfollowup-ds-container ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderSection()}
      </CollapsibleWrapper>
    </>
  );
};

export default FollowUp;
