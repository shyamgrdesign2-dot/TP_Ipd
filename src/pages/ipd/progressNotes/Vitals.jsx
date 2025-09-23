import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index";
import { useSelector, useDispatch } from "react-redux";
import { setVitals } from "../../../redux/ipd/progressNotesSlice";

const UnitInput = createRemoteComponent("UnitInput");

const Vitals = (props) => {
  const { isEditable = true, onAutofill, sectionData } = props || {};
  const { vitals = {} } = useSelector((state) => state.progressNotes);
  const dispatch = useDispatch();

  const handleAutofill = () => {
    if (onAutofill) {
      onAutofill();
    }
  };

  // Check if at least one vital value exists
  const hasAnyVitalValue = Object.values(vitals).some(
    (value) => value !== null && value !== undefined && value !== ""
  );

  const handleVitalsValue = (value, key) => {
    dispatch(setVitals({ ...vitals, [key]: value }));
  };

  const VitalDisplay = ({ label, value, unit, suffix }) => (
    <span>
      <span className="vital-label">{label}:</span> {value}
      {suffix || unit}
    </span>
  );

  const renderReadOnlyVitals = () => {
    const vitalComponents = sectionData?.children
      ?.filter((config) => vitals?.[config.id] && config.enabled)
      ?.map((config) => (
        <VitalDisplay
          label={config?.label || config?.title || config?.id}
          value={vitals[config.id]}
          unit={config?.unit}
          suffix={config?.suffix}
        />
      ));

    return (
      <div className="ipdaf-vitals-readonly">
        {vitalComponents?.map((component, i) => (
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
      <div className="ipdcn-vitals-container">
        {sectionData?.children
          ?.filter((config) => config.enabled)
          ?.map((config) => {
            const {
              children: _omitChildren,
              dangerouslySetInnerHTML: _omitDsi,
              ...configProps
            } = config || {};
            return (
              <div className="input-container" key={config.id}>
                <UnitInput
                  key={config.id}
                  containerStyle={{ marginBottom: "20px" }}
                  onChange={(e) => handleVitalsValue(e, config.id)}
                  value={vitals?.[config.id]}
                  type="text"
                  inputMode="decimal"
                  label={config.label}
                  unit={config.unit}
                  {...configProps}
                />
              </div>
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
    <div className={`ipdcn-vitals-main-container ${!isEditable ? 'ipdaf-vitals-main-container-readonly' : ''}`}>
      <div className="ipdaf-vitals-header">
        <img src={defaultIcons[`${sectionData?.id}Pc`]} alt="vitals" />
        <div>{sectionData?.title || "Vitals"}</div>
      </div>
      {isEditable ? renderEditableVitals() : renderReadOnlyVitals()}
    </div>
  );
};

export default Vitals;
