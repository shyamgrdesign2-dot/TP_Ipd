import React, { useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { defaultIcons } from "../../../assets/images/icons";
import "./surgeryDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import {
  setSurgeryProcedureName,
  setAnaesthesiaType,
  setSurgeryDate,
  setSurgeryStartTime,
  setSurgeryEndTime,
  setDiagnosis,
  searchSurgeryProcedures,
} from "../../../redux/ipd/otNotesSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const SurgeryDetails = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeryDetails, surgeryProcedureOptions } = useSelector(
    (state) => state.otNotes
  );
  const initialValue = useMemo(() => surgeryDetails || {}, [surgeryDetails]);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  useEffect(() => {
    dispatch(searchSurgeryProcedures(""));
  }, []);

  const renderSurgeryProcedureName = () => {
    const options = (surgeryProcedureOptions || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id || item.masterId}>{item.name}</div>,
    }));
    return (
      <div>
        <label className="otNotes-label">Surgery/Procedure Name</label>
        <Select
          showSearch
          optionLabelProp="label"
          mode="multiple"
          options={options}
          value={initialValue?.procedureName || undefined}
          className="multiple-select-custom autocomplete-custom w-100 popinput inputheight41"
          placeholder="Search and select Surgery/Procedure"
          onSearch={(q) => dispatch(searchSurgeryProcedures(q))}
          allowClear
          onChange={(value, option) => {
            if (value === undefined || value === null) {
              dispatch(setSurgeryProcedureName(""));
              return;
            }
            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              dispatch(setSurgeryProcedureName(parsed?.name || value));
            } catch (e) {
              dispatch(setSurgeryProcedureName(value));
            }
          }}
        />
      </div>
    );
  };
  const renderAnaesthesiaType = (data) => {
    const options = [
      { value: "General", label: <div>General</div> },
      { value: "Spinal", label: <div>Spinal</div> },
      { value: "Epidural", label: <div>Epidural</div> },
      { value: "Local", label: <div>Local</div> },
      { value: "Sedation", label: <div>Sedation</div> },
    ];
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <Select
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder="Select Anaesthesia Type"
          options={options}
          value={initialValue?.anaesthesiaType || undefined}
          onChange={(val) => dispatch(setAnaesthesiaType(val))}
        />
      </div>
    );
  };
  const renderSurgeryDate = (data) => {
    const dateDisplayFormat = "D MMM YYYY";
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <DatePicker
          className="w-100 popinput inputheight41"
          format={{ format: dateDisplayFormat, type: "mask" }}
          value={
            initialValue?.surgeryDate
              ? dayjs(initialValue.surgeryDate, dateDisplayFormat)
              : null
          }
          onChange={(date) =>
            dispatch(setSurgeryDate(date ? date.format(dateDisplayFormat) : ""))
          }
          suffixIcon={null}
          prefix={<img src={defaultIcons.calendarPlainIcon} />}
          allowClear
          inputReadOnly
        />
      </div>
    );
  };
  const renderSurgeryStartTime = (data) => {
    const timeFormat = "h:mm A";
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <TimePicker
          className="w-100 popinput inputheight41"
          format={timeFormat}
          use12Hours
          value={
            initialValue?.surgeryStartTime
              ? dayjs(initialValue.surgeryStartTime, timeFormat)
              : null
          }
          onChange={(time) =>
            dispatch(setSurgeryStartTime(time ? time.format(timeFormat) : ""))
          }
          suffixIcon={null}
          prefix={<img src={defaultIcons.clockIcon} />}
          allowClear
          inputReadOnly
          defaultOpenValue={dayjs("00:00 AM", timeFormat)}
        />
      </div>
    );
  };
  const renderSurgeryEndTime = (data) => {
    const timeFormat = "h:mm A";
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <TimePicker
          use12Hours
          className="w-100 popinput inputheight41"
          format={timeFormat}
          value={
            initialValue?.surgeryEndTime
              ? dayjs(initialValue.surgeryEndTime, timeFormat)
              : null
          }
          onChange={(time) =>
            dispatch(setSurgeryEndTime(time ? time.format(timeFormat) : ""))
          }
          suffixIcon={null}
          prefix={<img src={defaultIcons.clockIcon} />}
          allowClear
          inputReadOnly
          defaultOpenValue={dayjs("00:00 AM", timeFormat)}
        />
      </div>
    );
  };
  const renderDiagnosis = (data) => {
    if (!isEditable && !initialValue?.diagnosis) return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={otNotesIcons[data?.id]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="11 Sep 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => dispatch(setDiagnosis(data))}
        initialValue={
          initialValue?.diagnosis
            ? initialValue?.diagnosis
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter pre-operative diagnosis (primary condition, comorbidities if relevant)" // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppend(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppend}
        setNewAutoFillTextToAppend={setAutoFillTextToAppend}
      />
    );
  };

  // Dynamic render method using switch based on locale children
  const renderFieldById = (fieldConfig) => {
    if (!fieldConfig.enabled) return null;

    switch (fieldConfig.id) {
      case "procedureName":
        return renderSurgeryProcedureName(fieldConfig);

      case "anaesthesiaType":
        return renderAnaesthesiaType(fieldConfig);

      case "surgeryDate":
        return renderSurgeryDate(fieldConfig);

      case "surgeryStartTime":
        return renderSurgeryStartTime(fieldConfig);

      case "surgeryEndTime":
        return renderSurgeryEndTime(fieldConfig);

      case "diagnosis":
        return renderDiagnosis(fieldConfig);

      default:
        return null;
    }
  };

  // Group fields for layout purposes
  const renderDynamicFields = () => {
    const firstRowFields = ["procedureName", "anaesthesiaType"];
    const secondRowFields = [
      "surgeryDate",
      "surgeryStartTime",
      "surgeryEndTime",
    ];
    const fullWidthFields = ["diagnosis"];

    return (
      <>
        {/* First row: Surgery Procedure Name and Anaesthesia Type */}
        <div className="surgery-details-first-row">
          {sectionData?.children
            ?.filter(
              (field) => field.enabled && firstRowFields.includes(field.id)
            )
            .map((field) => (
              <div key={field.id}>{renderFieldById(field)}</div>
            ))}
        </div>

        {/* Second row: Surgery Date, Start Time, End Time */}
        <div className="surgery-details-second-row mt-3">
          {sectionData?.children
            ?.filter(
              (field) => field.enabled && secondRowFields.includes(field.id)
            )
            .map((field) => (
              <div key={field.id}>{renderFieldById(field)}</div>
            ))}
        </div>

        {/* Full width fields: Diagnosis */}
        {sectionData?.children
          ?.filter(
            (field) => field.enabled && fullWidthFields.includes(field.id)
          )
          .map((field) => (
            <div key={field.id}>{renderFieldById(field)}</div>
          ))}
      </>
    );
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? otNotesIcons[`${sectionData.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderDynamicFields()}
      </CollapsibleWrapper>
    </>
  );
};

export default SurgeryDetails;
