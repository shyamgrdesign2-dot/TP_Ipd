import React, { useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { defaultIcons } from "../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { setCrossReferralInformationDetails } from "../../../redux/ipd/crossReferralSlice";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";
import { isEmptyRichText } from "../../../utils/utils";
import { doctorDepartmentRoles } from "../../../redux/ipd/ipdSlice";
import { voiceRx } from "../../../redux/ipd/ipdSlice";
import { useLocation } from "react-router-dom";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

dayjs.extend(customParseFormat);

const ReferralInformation = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { crossReferralFormDetails } = useSelector(
    (state) => state.crossReferral
  );
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const { filters } = useSelector((state) => state.inPatients);
  const { doctorDepartmentRoles: departmentRolesData } = useSelector(
    (state) => state.ipd
  );
  const doctorsList = filters?.doctor || [];
  const initialValue = useMemo(
    () =>
      crossReferralFormDetails?.referralInformation || {
        relativesInformed: {},
      },
    [crossReferralFormDetails?.referralInformation]
  );
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    dispatch(fetchFilters({ field: "doctor" }));
    dispatch(doctorDepartmentRoles());
  }, [dispatch]);

  const handleAIRecordingComplete = async (payload, callback) => {
    if (!patientDetails?.details?.id || !patientDetails?.admissionId) {
      callback?.();
      return;
    }
    const response = await dispatch(
      voiceRx({
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        schemaKey: "CROSS_REFERRAL.referralInformation.reasonForReferral",
        audioFile: payload?.audioBlob,
        filename: payload?.filename,
        mimeType: payload?.mimeType,
        previousOutput: initialValue?.reasonForReferral,
      })
    );

    if (response.meta.requestStatus === "fulfilled") {
      let updatedData =
        response?.payload?.data?.rxDigitizationHistory?.[0]?.response || [];
      if (isEmptyRichText(updatedData)) {
        const transcription =
          response?.payload?.data?.rxDigitizationHistory?.[0]?.payload
            ?.transcription;
        if (transcription) {
          updatedData = [
            {
              type: "paragraph",
              children: [{ text: transcription }],
            },
          ];
        }
      }
      if (!isEmptyRichText(updatedData)) {
        dispatch(
          setCrossReferralInformationDetails({
            ...initialValue,
            reasonForReferral: updatedData,
          })
        );
        // setAutoFillTextToAppend(updatedData);
      }
      callback?.();
    } else {
      callback?.();
    }
  };

  const renderRelativesInformed = (role) => {
    let options = [];
    options = [
      {
        id: 1,
        role: "Father",
      },
      {
        id: 2,
        role: "Mother",
      },
      {
        id: 3,
        role: "Son",
      },
      {
        id: 4,
        role: "Daughter",
      },
      {
        id: 5,
        role: "Husband",
      },
      {
        id: 6,
        role: "Wife",
      },
    ].map((relative) => ({
      key: JSON.stringify(relative),
      value: relative.role,
      label: <div key={relative.id}>{relative.role}</div>,
    }));
    return (
      <div className="ipdot-st-section">
        <label className="otNotes-label">{role.title}</label>
        <Select
          showSearch
          optionLabelProp="label"
          options={options}
          value={initialValue?.relativesInformed?.informedTo || undefined}
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder={role?.placeholder || "Select Informed to"}
          allowClear
          onChange={(value, option) => {
            if (!value) {
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  relativesInformed: {
                    ...(initialValue?.relativesInformed || {}),
                    informedTo: null,
                  },
                })
              );
              return;
            }

            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  relativesInformed: {
                    ...(initialValue?.relativesInformed || {}),
                    informedTo: parsed?.role || value,
                  },
                })
              );
            } catch (e) {
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  relativesInformed: {
                    ...(initialValue?.relativesInformed || {}),
                    informedTo: value,
                  },
                })
              );
            }
          }}
        />
      </div>
    );
  };

  const renderSection = (role) => {
    let options = [];

    if (role.id === "referringTo" && selectedDepartment?.doctors) {
      options = selectedDepartment.doctors.map((doctor) => ({
        key: JSON.stringify({
          id: doctor.doctorId,
          name: doctor.doctorName,
          role: doctor.role,
          speciality: doctor.speciality,
        }),
        value: doctor.doctorName,
        label: <div key={doctor.doctorId}>{doctor.doctorName}</div>,
      }));
    } else {
      options = (doctorsList || []).map((item) => ({
        key: JSON.stringify(item),
        value: item.name,
        label: <div key={item.id}>{item.name}</div>,
      }));
    }

    // Handle referringTo as single selection
    if (role.id === "referringTo") {
      return (
        <div className="ipdot-st-section">
          <label className="otNotes-label">{role.title}</label>
          <Select
            showSearch
            optionLabelProp="label"
            options={options}
            value={initialValue?.referringTo?.name || undefined}
            className="autocomplete-custom w-100 popinput inputheight41"
            placeholder={
              selectedDepartment ? role?.placeholder : "Select Department"
            }
            allowClear
            disabled={!selectedDepartment}
            onChange={(value, option) => {
              if (!value) {
                dispatch(
                  setCrossReferralInformationDetails({
                    ...initialValue,
                    referringTo: null,
                  })
                );
                return;
              }

              try {
                const parsed = option?.key ? JSON.parse(option.key) : null;
                dispatch(
                  setCrossReferralInformationDetails({
                    ...initialValue,
                    referringTo: parsed,
                  })
                );
              } catch (e) {
                dispatch(
                  setCrossReferralInformationDetails({
                    ...initialValue,
                  })
                );
              }
            }}
          />
        </div>
      );
    }

    // Handle other fields with multiple selection
    return (
      <div className="ipdot-st-section">
        <label className="otNotes-label">{role.title}</label>
        <Select
          showSearch
          optionLabelProp="label"
          options={options}
          value={
            initialValue?.relativesInformed?.informedByDoctor?.name || undefined
          }
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder={role?.placeholder || "Select Doctor"}
          onSearch={(q) =>
            dispatch(fetchFilters({ field: "doctor", search: q }))
          }
          allowClear
          onChange={(value, option) => {
            if (!value) {
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  relativesInformed: {
                    ...(initialValue?.relativesInformed || {}),
                    informedByDoctor: null,
                  },
                })
              );
              return;
            }

            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  relativesInformed: {
                    ...(initialValue?.relativesInformed || {}),
                    informedByDoctor: parsed,
                  },
                })
              );
            } catch (e) {
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                })
              );
            }
          }}
        />
      </div>
    );
  };
  const renderReferringDepartment = (data) => {
    const options = (departmentRolesData || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.department,
      label: <div key={item.departmentId}>{item.department}</div>,
    }));
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <Select
          showSearch
          optionLabelProp="label"
          options={options}
          value={initialValue?.referringDepartment || undefined}
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder={data?.placeholder}
          allowClear
          onChange={(value, option) => {
            if (value === undefined || value === null) {
              setSelectedDepartment(null);
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  referringDepartment: "",
                  referringTo: "", // Clear doctor when department is cleared
                })
              );
              return;
            }
            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              setSelectedDepartment(parsed);
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  referringDepartment: parsed?.department || value,
                  referringTo: "", // Clear doctor when department changes
                })
              );
            } catch (e) {
              setSelectedDepartment(null);
              dispatch(
                setCrossReferralInformationDetails({
                  ...initialValue,
                  referringDepartment: value,
                  referringTo: "", // Clear doctor when department changes
                })
              );
            }
          }}
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
            initialValue?.relativesInformed?.informedOnTime
              ? dayjs(initialValue.relativesInformed.informedOnTime, timeFormat)
              : null
          }
          onChange={(time) =>
            dispatch(
              setCrossReferralInformationDetails({
                ...initialValue,
                relativesInformed: {
                  ...initialValue?.relativesInformed,
                  informedOnTime: time ? time.format(timeFormat) : "",
                },
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
  const renderReasonForReferral = (data) => {
    if (!isEditable && !initialValue?.diagnosis) return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showVoiceAI={
          isEditable &&
          patientDetails?.details?.id &&
          patientDetails?.admissionId
        }
        showMicrophone={true}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={handleAIRecordingComplete}
        title={data?.title}
        width="100%"
        icon={otNotesIcons[data?.id]}
        showAutoFill={false}
        containerClass={` ${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
        opdDate="11 Sep 2025"
        onChange={(data) =>
          dispatch(
            setCrossReferralInformationDetails({
              ...initialValue,
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
          data?.placeholder // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
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
    const normalizeDate = (value) => {
      if (!value) return "";
      const formats = [
        "D MMM YYYY",
        "Do MMM YYYY",
        "Do MMMM YYYY",
        "D MMMM YYYY",
        "YYYY-MM-DD",
      ];
      const parsed = dayjs(value, formats, true);
      if (parsed.isValid()) return parsed.format(dateDisplayFormat);
      const fallback = dayjs(value);
      return fallback.isValid() ? fallback.format(dateDisplayFormat) : "";
    };

    const normalizedReferralDate = normalizeDate(initialValue?.[data?.id]);
    const isRelative = data?.id === "informedOnDate";
    return (
      <div>
        <label className="otNotes-label">{data?.title}</label>
        <DatePicker
          className="w-100 popinput inputheight41"
          format={{ format: dateDisplayFormat, type: "mask" }}
          value={
            isRelative
              ? initialValue?.relativesInformed?.informedOnDate
                ? dayjs(
                    initialValue.relativesInformed.informedOnDate,
                    dateDisplayFormat
                  )
                : null
              : normalizedReferralDate
              ? dayjs(normalizedReferralDate, dateDisplayFormat)
              : null
          }
          onChange={(date) =>
            dispatch(
              setCrossReferralInformationDetails({
                ...initialValue,
                ...(isRelative
                  ? {
                      relativesInformed: {
                        ...initialValue?.relativesInformed,
                        informedOnDate: date
                          ? date.format(dateDisplayFormat)
                          : "",
                      },
                    }
                  : {
                      [data?.id]: date ? date.format(dateDisplayFormat) : "",
                    }),
              })
            )
          }
          suffixIcon={null}
          prefix={<img src={defaultIcons.calendarPlainIcon} />}
          allowClear
          inputReadOnly
          placement="bottomLeft"
        />
      </div>
    );
  };

  const renderFieldById = (fieldConfig) => {
    if (!fieldConfig.enabled) return null;

    switch (fieldConfig.id) {
      case "referringDepartment":
        return renderReferringDepartment(fieldConfig);

      case "referringTo":
        return renderSection(fieldConfig);

      case "referralDate":
        return renderSurgeryDate(fieldConfig);

      case "informedBy":
        return renderSection(fieldConfig);

      case "informedTo":
        return renderRelativesInformed(fieldConfig);

      case "informedOnDate":
        return renderSurgeryDate(fieldConfig);

      case "informedOnTime":
        return renderInformedTime(fieldConfig);

      case "reasonForReferral":
        return renderReasonForReferral(fieldConfig);

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
    const secondRowFields = ["relativesInformed"];
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
