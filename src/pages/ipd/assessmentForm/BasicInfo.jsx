import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents.js";
import ChiefComplaint from "./ChiefComplaint.jsx";
import HistoryOfPresentIllness from "./HistoryOfPresentIllness.jsx";
import CurrentMedications from "./CurrentMedications.jsx";
import LabResults from "./LabResults.jsx";
import PastMedicalHistory from "./PastMedicalHistory.jsx";
import ObstetricHistory from "./ObstetricHistory.jsx";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index.js";
import GynecHistory from "./GynecHistory.jsx";
import { useSelector } from "react-redux";
import {
  formatDateToShortMonthYear,
  isEmptyRichText,
} from "../../../utils/utils.js";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const AutoFillButton = createRemoteComponent("AutoFillButton");

const BasicInfo = (props) => {
  const { isEditable = true, sectionData } = props;
  const {
    chiefComplaint,
    lastPrescriptionDate,
    historyOfPresentIllness,
    medicationData,
    labResults,
    gynecHistoryData,
    obstetricHistory,
  } = useSelector((state) => state.assessment);
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const { pregnancyHistory = [] } = allObstetricDetails;
  let { medicalHistoryData } = useSelector((state) => state.prescription);

  const { lastRxDate } = lastPrescriptionDate || {};

  const renderAutoFillButton = () => {
    return (
      <AutoFillButton
        onClick={() => {}}
        title={`Autofill Basic Info Details From OPD (${formatDateToShortMonthYear(
          lastRxDate
        )})`}
      />
    );
  };

  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "chiefComplaint":
                return <ChiefComplaint {...props} sectionData={item} />;
              case "historyPresentIllness":
                return (
                  <HistoryOfPresentIllness {...props} sectionData={item} />
                );
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
          })()}
        </React.Fragment>
      );
    });
  };
  const isGynecHistoryDataExists =
    gynecHistoryData && Object.keys(gynecHistoryData).length;

  if (
    !isEditable &&
    isEmptyRichText(chiefComplaint) &&
    isEmptyRichText(historyOfPresentIllness) &&
    !medicationData?.length &&
    !labResults?.length &&
    !medicalHistoryData?.length &&
    !isGynecHistoryDataExists &&
    !Object.keys(obstetricDetails)?.length &&
    !pregnancyHistory?.length
  )
    return null;

  return (
    <CollapsibleWrapper
      title={sectionData?.title}
      data-testid={sectionData?.id}
      icon={defaultIcons[`${sectionData?.id}PcDark`]}
      collapsible={isEditable} // TODO: INTEL - TO BE USED for view details screen
      width={"100%"}
      className={`collapsible-wrapper-class ${
        isEditable ? "" : "collapsible-wrapper-class-readonly"
      }`}
      defaultOpen
      // renderRightHeaderSection={isEditable ? renderAutoFillButton : null} // TODO: INTEL - UNCOMMENT IT ONCE READY
    >
      {renderChildren()}
    </CollapsibleWrapper>
  );
};

export default BasicInfo;
