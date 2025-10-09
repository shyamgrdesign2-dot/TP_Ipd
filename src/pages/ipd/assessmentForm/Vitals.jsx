import React from "react";
import { IPD } from "../../../utils/locale";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { setVitalsData } from "../../../redux/ipd/assessmentsFormSlice";
import { setVitalsData as setDischargeVitalData } from "../../../redux/ipd/dischargeSummarySlice";
import { useSelector, useDispatch } from "react-redux";
import defaultIcons from "../../../assets/images/indices";

const UnitInput = createRemoteComponent("UnitInput");

const Vitals = (props) => {
  const {
    isEditable = true,
    sectionData,
    formName = "assessment",
  } = props || {};
  const assessmentStateData = useSelector((state) => state.assessment);
  const dischargeSummaryStateData = useSelector((state) => state.dischargeSummary);
  const vitalsData = formName === 'assessment' ? assessmentStateData?.vitalsData : dischargeSummaryStateData?.dischargeSummaryData?.vitalsData;
  console.log('INTEL ==> vitalsData', vitalsData, formName)
  const dispatch = useDispatch();

  // Check if at least one vital value exists
  const hasAnyVitalValue = !!vitalsData && Object.values(vitalsData).some(
    (value) => value !== null && value !== undefined && value !== ""
  );
  const handleVitalsValue = (e, key) => {
    if (formName === "assessment") {
      dispatch(setVitalsData({ ...vitalsData, [key]: e }));
    } else if (formName === "dischargeSummary") {
      dispatch(setDischargeVitalData({ ...vitalsData, [key]: e }));
    }
  };

  const VitalDisplay = ({ label, value, unit, suffix }) => (
    <span>
      <span className="vital-label">{label}:</span> {value}
      {suffix || unit}
    </span>
  );

  const renderReadOnlyVitals = () => {
    const vitalComponents = sectionData?.children
      ?.filter((config) => vitalsData?.[config.id] && config.enabled)
      .map((config) => (
        <VitalDisplay
          label={config?.label || config?.title || config?.id}
          value={vitalsData[config.id]}
          unit={config?.unit}
          suffix={config?.suffix}
        />
      ));

    return (
      <div className="ipdaf-vitals-readonly">
        {vitalComponents.map((component, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="separator">|</span>}
            {component}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderEditableVitals = () => {
    return (
      <div className="ipdaf-vitals-container">
        {sectionData.children
          ?.filter((config) => config.enabled)
          ?.map((config) => {
            return (
              <React.Fragment key={config.id}>
                <UnitInput
                  key={config.id}
                  containerStyle={{ marginBottom: "20px" }}
                  onChange={(e) => handleVitalsValue(e, config.id)}
                  value={vitalsData?.[config.id]}
                  type="text"
                  inputMode="decimal"
                  label={config.label}
                  unit={config.unit}
                  {...config}
                />
              </React.Fragment>
            );
          })}
      </div>
    );
  };

  // Return null if no vital values exist and component is not in edit mode
  if (!isEditable && !hasAnyVitalValue) {
    return null;
  }

  return (
    <div
      className={`ipdaf-vitals-main-container ${
        !isEditable ? "ipdaf-vitals-main-container-readonly" : ""
      }`}
    >
      <div className="ipdaf-vitals-header">
        <img src={defaultIcons[`${sectionData?.id}Pc`]} alt="vitals" />
        <div>{sectionData?.title}</div>
      </div>
      {isEditable ? renderEditableVitals() : renderReadOnlyVitals()}
    </div>
  );
};

export default Vitals;
