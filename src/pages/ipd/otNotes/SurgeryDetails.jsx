import React, { useEffect, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
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
  useEffect(() => {
    dispatch(searchSurgeryProcedures(""));
  }, []);

  const fields = [
    { id: "surgeryProcedureName", title: "Surgery/Procedure Name" },
    { id: "anaesthesiaType", title: "Anaesthesia Type" },
    { id: "surgeryDate", title: "Surgery Date" },
    { id: "surgeryStartTime", title: "Surgery Start Time" },
    { id: "surgeryEndTime", title: "Surgery End Time" },
    { id: "diagnosis", title: "Diagnosis" },
  ];

  const renderSurgeryProcedureName = () => {
    const options = (surgeryProcedureOptions || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id || item.masterId}>{item.name}</div>,
    }));
    return (
      <div>
        <label className="surgery-label">Surgery/Procedure Name</label>
        <Select
          showSearch
          optionLabelProp="label"
          options={options}
          value={initialValue?.surgeryProcedureName || undefined}
          className="autocomplete-custom w-100 popinput inputheight41"
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
  const renderAnaesthesiaType = () => {
    const options = [
      { value: "General", label: <div>General</div> },
      { value: "Spinal", label: <div>Spinal</div> },
      { value: "Epidural", label: <div>Epidural</div> },
      { value: "Local", label: <div>Local</div> },
      { value: "Sedation", label: <div>Sedation</div> },
    ];
    return (
      <div>
        <label className="surgery-label">Anaesthesia Type</label>
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
  const renderSurgeryDate = () => {
    const dateDisplayFormat = "D MMM YYYY";
    return (
      <div>
        <label className="surgery-label">Surgery Date</label>
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
  const renderSurgeryStartTime = () => {
    const timeFormat = "HH:mm";
    return (
      <div>
        <label className="surgery-label">Surgery Start Time</label>
        <TimePicker
          className="w-100 popinput inputheight41"
          format={timeFormat}
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
          defaultOpenValue={dayjs("00:00", timeFormat)}
        />
      </div>
    );
  };
  const renderSurgeryEndTime = () => {
    const timeFormat = "HH:mm";
    return (
      <div>
        <label className="surgery-label">Surgery End Time</label>
        <TimePicker
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
          defaultOpenValue={dayjs("00:00", timeFormat)}
        />
      </div>
    );
  };
  const renderDiagnosis = () => {
    if (!isEditable && !initialValue?.diagnosis) return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={"Diagnosis"}
        width="100%"
        icon={defaultIcons.ddx}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          isEditable ? "ipd-wrapper-class-readonly" : ""
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
          console.log("erase");
        }}
        onTemplate={() => {
          console.log("template");
        }}
        onVoiceDictatorClick={(callback) => {
          console.log("voice dictation");
          setTimeout(() => {
            callback();
          }, 3000);
        }}
      />
    );
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={assessmentsIcons[sectionData?.icon]}
        collapsible={isEditable}
        width={"100%"}
        className={"collapsible-wrapper-class"}
        data-testid={sectionData?.title}
        defaultOpen
      >
        <div className="surgery-details-first-row">
          {renderSurgeryProcedureName()}
          {renderAnaesthesiaType()}
        </div>
        <div className="surgery-details-second-row mt-3">
          {renderSurgeryDate()}
          {renderSurgeryStartTime()}
          {renderSurgeryEndTime()}
        </div>
        {renderDiagnosis()}
      </CollapsibleWrapper>
    </>
  );
};

export default SurgeryDetails;
