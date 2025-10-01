import React, { useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import defaultIcons, {
  defaultIcons as dischargeSummaryIcons,
} from "../../../../assets/images/indices";
import "./styles.scss";
import DietPickerTable from "../../../../components/DynamicPickerTable/DietPickerTable";
import PhysicalActivitiesPickerTable from "../../../../components/DynamicPickerTable/PhysicalActivitiesPickerTable";
import { isEmptyRichText } from "../../../../utils/utils";
import { useSelector } from "react-redux";
import { setDischargeSummaryData } from "../../../../redux/ipd/dischargeSummarySlice";
import { useDispatch } from "react-redux";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const DischargeAdvice = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const [autoFillTextToAppendWarningSigns, setAutoFillTextToAppendWarningSigns] = useState([]);
  const [autoFillTextToAppendEmergencyContact, setAutoFillTextToAppendEmergencyContact] = useState([]);
  const dispatch = useDispatch();
  const [autoFillTextToAppendOtherAdvice, setAutoFillTextToAppendOtherAdvice] = useState([]);
  const handleOthersChange = (data, key) => {
    dispatch(setDischargeSummaryData({ ...dischargeSummaryData, [key]: data }));
  };

  const renderWarningSigns = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.warningSigns))
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
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "warningSigns")}
        initialValue={
          dischargeSummaryData?.warningSigns
            ? dischargeSummaryData?.warningSigns
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendWarningSigns(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendWarningSigns}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendWarningSigns}
      />
    );
  };
  const renderEmergencyContact = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.emergencyContact))
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
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "emergencyContact")}
        initialValue={
          dischargeSummaryData?.emergencyContact
            ? dischargeSummaryData?.emergencyContact
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendEmergencyContact(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendEmergencyContact}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendEmergencyContact}
      />
    );
  };
  const renderOtherAdvice = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.otherAdvice))
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
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "otherAdvice")}
        initialValue={
          dischargeSummaryData?.otherAdvice
            ? dischargeSummaryData?.otherAdvice
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendOtherAdvice(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendOtherAdvice}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendOtherAdvice}
      />
    );
  };


  const renderSection = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "diet":
                return (
                  <div key={item.id} className="discharge-advice-section">
                    <RichTextEditWrapper
                      readOnly={!isEditable}
                      showToolbar={isEditable}
                      showActionBtns={isEditable}
                      showOnlyClear={isEditable}
                      title={item?.title || "Diet"}
                      width="100%"
                      containerClass="wrapper-class ipd-pmh-wrapper-class"
                      icon={defaultIcons[`${item?.id}Pc`]}
                      showAutoFill={isEditable}
                      opdDate="15 Jun 2025"
                      onAutoFill={() => {
                        console.log("auto fill");
                      }}
                      onSave={() => {
                        console.log("save");
                      }}
                      renderBody={() => {
                        return <DietPickerTable isEditable={isEditable} />;
                      }}
                    />
                  </div>
                );
              case "physicalActivities":
                return (
                  <div key={item.id} className="discharge-advice-section">
                    <RichTextEditWrapper
                      readOnly={!isEditable}
                      showToolbar={isEditable}
                      showActionBtns={isEditable}
                      showOnlyClear={isEditable}
                      title={item?.title || "Physical Activities"}
                      width="100%"
                      containerClass="wrapper-class ipd-pmh-wrapper-class"
                      icon={defaultIcons[`${item?.id}Pc`]}
                      showAutoFill={isEditable}
                      opdDate="15 Jun 2025"
                      renderBody={() => {
                        return (
                          <PhysicalActivitiesPickerTable
                            isEditable={isEditable}
                          />
                        );
                      }}
                    />
                  </div>
                );
              case "otherAdvice":
                return renderOtherAdvice(item);
              case "warningSigns":
                return renderWarningSigns(item);
              case "emergencyContact":
                return renderEmergencyContact(item);
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

export default DischargeAdvice;
