import React from "react";
import { IPD } from "../../../utils/locale";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { setVitalsData } from "../../../redux/ipd/assessmentsFormSlice";
import { useSelector, useDispatch } from "react-redux";

const UnitInput = createRemoteComponent("UnitInput");

const Vitals = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { vitalsData = {} } = useSelector((state) => state.assessment);
  const dispatch = useDispatch();

  // Check if at least one vital value exists
  const hasAnyVitalValue = Object.values(vitalsData).some(value => value !== null && value !== undefined && value !== '');
  const handleVitalsValue = (e, key) => {
    dispatch(setVitalsData({ ...vitalsData, [key]: e }));
  };
  const VITAL_CONFIGS = [
    { key: 'pulse', label: 'Pulse', unit: 'T' },
    { key: 'bloodPressure', label: 'BP', suffix: '' },
    { key: 'temperature', label: 'Temperature', unit: 'Frh' },
    { key: 'spo2', label: 'Spo2', unit: '%' },
    { key: 'respiratoryRate', label: 'RR', unit: '/min' },
    { key: 'weight', label: 'Weight', unit: 'Kg' },
    { key: 'height', label: 'Height', unit: 'cms' },
    { key: 'generalRBS', label: 'General Rbs', unit: 'mg/dl' }
  ];

  const VitalDisplay = ({ label, value, unit, suffix }) => (
    <span>
      <span className="vital-label">{label}:</span>
      {' '}{value}{suffix || unit}
    </span>
  );

  const renderReadOnlyVitals = () => {
    const vitalComponents = VITAL_CONFIGS
      .filter(config => vitalsData?.[config.key])
      .map(config => (
        <VitalDisplay
          key={config.key}
          label={config.label}
          value={vitalsData[config.key]}
          unit={config.unit}
          suffix={config.suffix}
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
        {VITAL_CONFIGS.map((config) => {
          const vital = IPD.VITALS.find(v => v.name === config.key) || {};
          return (
            <UnitInput
              key={config.key}
              containerStyle={{ marginBottom: "20px" }}
              onChange={(e) => handleVitalsValue(e, config.key)}
              value={vitalsData?.[config.key]}
              type="text"
              inputMode="decimal"
              label={config.label}
              unit={config.unit}
              {...vital}
            />
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
    <div className="ipdaf-vitals-main-container">
      <div className="ipdaf-vitals-header">
        <img src={defaultIcons[sectionData?.icon]} alt="vitals" />
        <div>{sectionData?.title}</div>
      </div>
      {isEditable ? renderEditableVitals() : renderReadOnlyVitals()}
    </div>
  );
};

export default Vitals;
