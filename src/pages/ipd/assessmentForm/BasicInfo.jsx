import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import ChiefComplaint from "./ChiefComplaint.jsx";
import HistoryOfPresentIllness from "./HistoryOfPresentIllness.jsx";
import CurrentMedications from "./CurrentMedications.jsx";
import LabResults from "./LabResults.jsx";
import PastMedicalHistory from "./PastMedicalHistory.jsx";
import ObstetricHistory from "./ObstetricHistory.jsx";
import { defaultIcons } from "../../../assets/images/icons/assessments";
import GynecHistory from "./GynecHistory.jsx";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const AutoFillButton = createRemoteComponent("AutoFillButton");

const BasicInfo = (props) => {
  const { isEditable = true, sectionData } = props;

  const renderAutoFillButton = () => {
    return (
      <AutoFillButton
        onClick={() => {}}
        title={`Autofill Basic Info Details From OPD (15 Jun 2025)`}
      />
    );
  };

  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      switch (item?.id) {
        case "chiefComplaint":
          return <ChiefComplaint {...props} sectionData={item} />;
        case "historyPresentIllness":
          return <HistoryOfPresentIllness {...props} sectionData={item} />;
        case "currentMedications":
          return <CurrentMedications {...props} sectionData={item} />;
        case "investigations":
          return <LabResults {...props} sectionData={item} />;
        case "pastMedicalHistory":
          return <PastMedicalHistory {...props} sectionData={item} />;
        case "gynecHistory":
            return <GynecHistory {...props} sectionData={item} />;
        case "obstetricHistory":
          return <ObstetricHistory {...props} sectionData={item} />;
        default:
          return null;
      }
    });
  };

  return (
    <CollapsibleWrapper
      title={sectionData?.title}
      icon={defaultIcons[sectionData?.icon]}
      collapsible={isEditable} // TODO: INTEL - TO BE USED for view details screen
      width={"100%"}
      className={`collapsible-wrapper-class ${isEditable ? "" : "collapsible-wrapper-class-readonly"}`}
      defaultOpen
    //   renderRightHeaderSection={isEditable ? renderAutoFillButton : null} // TODO: INTEL - UNCOMMENT IT ONCE READY
    >
      {renderChildren()}
    </CollapsibleWrapper>
  );
};

export default BasicInfo;
