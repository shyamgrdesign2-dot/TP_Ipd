import React, { useState, useEffect } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons } from "../../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  setFollowUpDate,
  setFollowUpDoctor,
  setDischargeSummaryData,
} from "../../../../redux/ipd/dischargeSummarySlice";
import { fetchFilters } from "../../../../redux/ipd/inPatientsSlice";
import { isEmptyRichText } from "../../../../utils/utils";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const FollowUp = (props) => {
  const { isEditable = true, sectionData } = props || {};
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

  useEffect(() => {
    dispatch(fetchFilters({ field: "doctor" }));
  }, [dispatch]);

  const handleOthersChange = (data, key) => {
    dispatch(setDischargeSummaryData({ ...dischargeSummaryData, [key]: data }));
  };

  const renderFollowUpDate = (data) => {
    const dateDisplayFormat = "D MMM YYYY";
    return (
      <div>
        <label className="followup-label">
          {data?.title || "Follow Up Date"}
        </label>
        <DatePicker
          className="w-100 popinput inputheight41"
          format={{ format: dateDisplayFormat, type: "mask" }}
          value={
            dischargeSummaryData?.followUpDate
              ? dayjs(dischargeSummaryData.followUpDate, dateDisplayFormat)
              : null
          }
          onChange={(date) =>
            dispatch(
              setFollowUpDate(date ? date.format(dateDisplayFormat) : "")
            )
          }
          suffixIcon={
            <img src={defaultIcons.calendarPlainIcon} alt="calendar" />
          }
          prefix={null}
          allowClear
          inputReadOnly
          placeholder="dd/mm/yyyy"
        />
      </div>
    );
  };

  const renderFollowUpDoctor = (data) => {
    const options = (doctorsList || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id}>{item.name} {item?.role ? `(${item?.role})` : ""}</div>,
    }));
    return (
      <div>
        <label className="followup-label">
          {data?.title || "Follow Up Doctor Name"}
        </label>
        <Select
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder="Select Follow Up Doctor"
          options={options}
          value={dischargeSummaryData?.followUpDoctor?.name || undefined}
          onChange={(value, option) => {
            if (!value) {
              dispatch(setFollowUpDoctor(null));
              return;
            }
            
            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              if (parsed) {
                dispatch(setFollowUpDoctor(parsed));
              } else {
                dispatch(setFollowUpDoctor({ name: value }));
              }
            } catch (e) {
              dispatch(setFollowUpDoctor({ name: value }));
            }
          }}
          onSearch={(q) =>
            dispatch(fetchFilters({ field: "doctor", search: q }))
          }
          showSearch
          allowClear
          optionLabelProp="label"
        />
      </div>
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
        containerClass={`${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
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

  const renderSection = () => {
    const followUpDateItem = sectionData?.children?.find(
      (item) => item.id === "followUpDate"
    ) || { title: "Follow Up Date" };
    const followUpDoctorItem = sectionData?.children?.find(
      (item) => item.id === "followUpDoctor"
    ) || { title: "Follow Up Doctor Name" };
    const additionalNotesItem = sectionData?.children?.find(
      (item) => item.id === "additionalNotes"
    ) || { title: "Additional Notes", id: "additionalNotes" };

    return (
      <div className="followup-container">
        <div className="followup-fields-row">
          <div className="followup-date-section">
            {renderFollowUpDate(followUpDateItem)}
          </div>
          <div className="followup-doctor-section">
            {renderFollowUpDoctor(followUpDoctorItem)}
          </div>
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
