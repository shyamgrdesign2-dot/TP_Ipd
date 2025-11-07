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
import { useSelector, useDispatch } from "react-redux";
import {
  formatDateToShortMonthYear,
  isEmptyRichText,
} from "../../../utils/utils.js";
import { setTopInformant } from "../../../redux/ipd/assessmentsFormSlice.js";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const AutoFillButton = createRemoteComponent("AutoFillButton");
const UnitInput = createRemoteComponent("UnitInput");

const BasicInfo = (props) => {
  const { isEditable = true, sectionData } = props;
  const {
    chiefComplaint,
    lastPrescriptionDate,
    historyOfPresentIllness,
    labResults,
    gynecHistoryData,
    obstetricHistory,
  } = useSelector((state) => state.assessment);
  const dispatch = useDispatch();
  const {medicationData} = useSelector((state) => state.prescription);
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const { pregnancyHistory = [] } = allObstetricDetails;
  let { medicalHistoryData } = useSelector((state) => state.prescription);
  const { topInformant } = useSelector((state) => state.assessment);
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

  const renderEditableTopInformant = (data) => {
    return (
      <div className="ipd-fas-refphy-container">
        <div className="refphy-label-container">
          <img src={defaultIcons[`${data?.id}Pc`]} alt="x" />
          <label className="refphy-label">{data.title}</label>
        </div>
        <UnitInput
          key={data?.id}
          containerStyle={{ marginBottom: "20px" }}
          onChange={(e) => {
            dispatch(setTopInformant(e));
          }}
          value={topInformant}
          type="string"
          inputMode="text"
          title={null}
          unit={null}
        />
      </div>
    );
  };

  const renderTopInformant = (data) => {
    if (!isEditable && !topInformant) return null;
    if (!isEditable) {
      return (
        <div className="ipd-fas-refphy-container rich-text-editor-wrapper wrapper-class ipd-wrapper-class-readonly">
          <div className="refphy-label-container">
            <img src={defaultIcons[`${data?.id}Pc`]} alt="x" />
            <label className="refphy-label rich-text-editor-wrapper-header-title">{data.title}</label>
          </div>
          <div className="referred-to-physiotherapy-name">
            {topInformant}
          </div>
        </div>
      );
    }
    return (
      <div className="referred-to-physiotherapy-container mb-4">
        {renderEditableTopInformant(data)}
      </div>
    );
  };

  const renderChildren = () => {
    return sectionData?.children?.map((item, index) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "topInformant":
              const key = `${item?.id || "unknown"}-${index}`;
                return (
                  <React.Fragment key={key}>
                    {renderTopInformant(item)}
                  </React.Fragment>
                );
              case "presentingComplaints":
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
    !topInformant &&
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
