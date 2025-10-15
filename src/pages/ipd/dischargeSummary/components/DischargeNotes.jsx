import React, { useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons } from "../../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import Vitals from "../../assessmentForm/Vitals";
import { isEmptyRichText } from "../../../../utils/utils";
import {
  setDischargeSummaryData,
  setPatientCondition,
} from "../../../../redux/ipd/dischargeSummarySlice";
import CurrentMedications from "../../assessmentForm/CurrentMedications";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const DischargeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeryDetails, surgeryProcedureOptions, dischargeSummaryData } =
    useSelector((state) => state.dischargeSummary);
  const initialValue = useMemo(() => surgeryDetails || {}, [surgeryDetails]);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const handlePatientConditionChange = (data) => {
    dispatch(setPatientCondition(data));
  };

  const renderPatientCondition = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.patientCondition))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={` ${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handlePatientConditionChange(data)}
        initialValue={
          dischargeSummaryData?.patientCondition?.length
            ? dischargeSummaryData?.patientCondition
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={data?.placeholder || "Enter Patient Condition"}
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

  const renderSection = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "dischargeVitals":
                return (
                  <Vitals
                    isEditable={true}
                    {...props}
                    formName="dischargeSummary"
                    sectionData={item}
                  />
                );
              case "patientCondition":
                return renderPatientCondition(item);
              case "dischargeMedications":
                return (
                  <CurrentMedications
                    isDischargeSummary={true}
                    {...props}
                    sectionData={item}
                  />
                );
              default:
                return null;
            }
          })()}
        </React.Fragment>
      );
    });
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

export default DischargeNotes;
