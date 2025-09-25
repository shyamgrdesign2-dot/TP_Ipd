import React, { useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { defaultIcons } from "../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import {
  setReferringDepartment,
  setReferringTo,
  setSurgeryDate,
  setSurgeryStartTime,
  setSurgeryEndTime,
  setDiagnosis,
  //   searchReferringDepartments,
  //   searchReferringTo,
} from "../../../redux/ipd/crossReferralSlice";
import { setCrossReferralFormDetails } from "../../../redux/ipd/crossReferralSlice";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ReferralInformation = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { referralInformation, referralInformationOptions } = useSelector(
    (state) => state.crossReferral
  );
  const { filters } = useSelector((state) => state.inPatients);
  const doctorsList = filters?.doctor || [];
  const initialValue = useMemo(
    () => referralInformation || {},
    [referralInformation]
  );
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  useEffect(() => {
    // dispatch(searchSurgeryProcedures(""));
    // TODO: INTEL FETCH DEPT AND DOCTORS AND RELATIVES FOR REFERRAL INFORMATION
  }, []);

  const renderSection = (role) => {
    const options = (doctorsList || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id}>{item.name}</div>,
    }));
    return (
      <div className="ipdot-st-section">
        <label className="otNotes-label">{role.title}</label>
        <Select
          showSearch
          optionLabelProp="label"
          mode="multiple"
          options={options}
          value={
            Array.isArray(initialValue?.[role.id])
              ? initialValue[role.id].map((item) => item.name || item)
              : undefined
          }
          className="multiple-select-custom autocomplete-custom w-100 popinput inputheight41"
          placeholder={role?.placeholder}
          onSearch={(q) =>
            dispatch(fetchFilters({ field: "doctor", search: q }))
          }
          allowClear
          onChange={(values, options) => {
            if (!values || values.length === 0) {
              //   dispatch(setSurgeryTeam({ roleId: role.id, value: [] }));
              return;
            }

            const parsedValues = [];

            if (Array.isArray(options)) {
              // Handle multiple selections
              options.forEach((option, index) => {
                try {
                  const parsed = option?.key ? JSON.parse(option.key) : null;
                  if (parsed) {
                    parsedValues.push(parsed);
                  } else {
                    parsedValues.push({ name: values[index] });
                  }
                } catch (e) {
                  parsedValues.push({ name: values[index] });
                }
              });
            } else {
              // Handle single selection (fallback)
              try {
                const parsed = options?.key ? JSON.parse(options.key) : null;
                if (parsed) {
                  parsedValues.push(parsed);
                } else {
                  parsedValues.push({ name: values });
                }
              } catch (e) {
                parsedValues.push({ name: values });
              }
            }

            // dispatch(setSurgeryTeam({ roleId: role.id, value: parsedValues }));
          }}
        />
      </div>
    );
  };
  const renderSurgeryProcedureName = (data) => {
    const options = (referralInformationOptions || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id || item.masterId}>{item.name}</div>,
    }));
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <Select
          showSearch
          optionLabelProp="label"
          mode="multiple"
          options={options}
          value={initialValue?.referringDepartment || undefined}
          className="multiple-select-custom autocomplete-custom w-100 popinput inputheight41"
          placeholder={data?.placeholder}
          //   onSearch={(q) => dispatch(searchReferringTo(q))}
          allowClear
          onChange={(value, option) => {
            if (value === undefined || value === null) {
              dispatch(
                setCrossReferralFormDetails({
                  ...referralInformation,
                  referringDepartment: "",
                })
              );
              return;
            }
            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              dispatch(
                setCrossReferralFormDetails({
                  ...referralInformation,
                  referringDepartment: parsed?.name || value,
                })
              );
            } catch (e) {
              dispatch(
                setCrossReferralFormDetails({
                  ...referralInformation,
                  referringDepartment: value,
                })
              );
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
          placeholder="Select Doctor"
          options={options}
          value={initialValue?.referringTo || undefined}
          onChange={(val) =>
            dispatch(
              setCrossReferralFormDetails({
                ...referralInformation,
                referringTo: val,
              })
            )
          }
        />
      </div>
    );
  };
  const renderInformedTime = (data) => {
    const timeFormat = "h:mm A";
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <TimePicker
          use12Hours
          className="w-100 popinput inputheight41"
          format={timeFormat}
          value={
            initialValue?.referralEndTime
              ? dayjs(initialValue.referralEndTime, timeFormat)
              : null
          }
          onChange={(time) =>
            dispatch(
              setCrossReferralFormDetails({
                ...referralInformation,
                referralEndTime: time ? time.format(timeFormat) : "",
              })
            )
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
        containerClass={` ${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
        opdDate="11 Sep 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) =>
          dispatch(
            setCrossReferralFormDetails({
              ...referralInformation,
              reasonForReferral: data,
            })
          )
        }
        initialValue={
          initialValue?.reasonForReferral
            ? initialValue?.reasonForReferral
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter reason for referral" // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
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
          //   onChange={(date) =>
          //     // dispatch(setSurgeryDate(date ? date.format(dateDisplayFormat) : ""))
          //   }
          suffixIcon={null}
          prefix={<img src={defaultIcons.calendarPlainIcon} />}
          allowClear
          inputReadOnly
        />
      </div>
    );
  };

  // Dynamic render method using switch based on locale children
  const renderFieldById = (fieldConfig) => {
    console.log("INTEL ==> asdf", fieldConfig);
    if (!fieldConfig.enabled) return null;

    switch (fieldConfig.id) {
      case "referringDepartment":
        return renderSurgeryProcedureName(fieldConfig);

      case "referringTo":
        return renderSection(fieldConfig);

      case "referralDate":
        return renderSurgeryDate(fieldConfig);

      case "informedBy":
        return renderSection(fieldConfig);
      // return renderSurgeryStartTime(fieldConfig);

      case "informedTo":
        return renderSection(fieldConfig);

      case "informedOnDate":
        return renderSurgeryDate(fieldConfig);

      case "informedOnTime":
        return renderInformedTime(fieldConfig);

      case "reasonForReferral":
        return renderDiagnosis(fieldConfig);

      default:
        return null;
    }
  };

  const renderDynamicFields = () => {
    const firstRowFields = [
      "referringDepartment",
      "referringTo",
      "referralDate",
    ];
    const secondRowFields = [
      "relativesInformed",
    ];
    const fullWidthFields = ["reasonForReferral"];
    return (
      <>
        <div className="surgery-details-first-row">
          {sectionData?.children
            ?.filter(
              (field) => field.enabled && firstRowFields.includes(field.id)
            )
            .map((field) => (
              <div key={field.id}>{renderFieldById(field)}</div>
            ))}
        </div>

        {sectionData?.children
          ?.filter(
            (field) => field.enabled && fullWidthFields.includes(field.id)
          )
          .map((field) => (
            <div key={field.id}>{renderFieldById(field)}</div>
          ))}

        <div className="surgery-details-second-row-container">
          
          {sectionData?.children
            ?.filter(
              (field) => field.enabled && secondRowFields.includes(field.id)
            )
            .map((field) => {
              console.log("INTEL ==> WAITT", field);
              if (!field.children) return null;
              return (
                <>
                  <div className="surgery-details-second-row-title">
                    {field.title}
                  </div>
                  <div className="surgery-details-second-row">
                    {field.children.map((child) => (
                      <div key={child.id}>{renderFieldById(child)}</div>
                    ))}
                  </div>
                </>
              );
            })}
        </div>

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

export default ReferralInformation;
