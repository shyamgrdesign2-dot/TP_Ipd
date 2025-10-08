import React from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons } from "../../../../assets/images/icons/index.js";
import "./styles.scss";
import { useSelector } from "react-redux";
import MemberChip from "../../components/MemberChip";
import { convertPatientDataToIpdFormat } from "../../../../utils/utils";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import {
  setDischargeDate,
  setDischargeSummaryData,
} from "../../../../redux/ipd/dischargeSummarySlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const PatientInformation = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { dischargeSummaryData = {} } = useSelector(
    (state) => state.dischargeSummary
  );
  const dispatch = useDispatch();

  const renderSection = () => {

    if (!sectionData?.children || !dischargeSummaryData?.patientInformation) {
      return <div>patient info</div>;
    }

    const patientInfo = convertPatientDataToIpdFormat(
      dischargeSummaryData.patientInformation
    );
    const dateDisplayFormat = "D MMM YYYY";

    return (
      <>
        <div className="patient-info-chips-container">
          {sectionData.children
            .filter((child) => child.enabled)
            .map((child) => {
              const value = patientInfo[child.id];
              if (!value) return null;

              return (
                <MemberChip
                  key={child.id}
                  icon={dischargeSummaryIcons[child.id]}
                  label={child.title}
                  value={value}
                />
              );
            })}
        </div>
        <div className="ipdpi-divider" />
        <div className="otNotes-label">Date of Discharge</div>
        <DatePicker
          className="w-25 popinput inputheight41 ipd-input"
          format={{
            format: dateDisplayFormat,
            type: "mask",
          }}
          value={
            patientInfo?.dateOfDischarge
              ? dayjs(patientInfo?.dateOfDischarge, dateDisplayFormat)
              : null
          }
          placeholder={"DD/MM/YYYY"}
          onChange={(date) =>
            dispatch(
              setDischargeDate(date ? date.format(dateDisplayFormat) : null)
            )
          }
          suffixIcon={<img src={defaultIcons.calendarPlainIcon} alt="x" />}
          prefix={null}
          allowClear
          inputReadOnly
        />
      </>
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
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderSection()}
      </CollapsibleWrapper>
    </>
  );
};

export default PatientInformation;
