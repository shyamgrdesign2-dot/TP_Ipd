import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/consultantNotesIcons";
import { useSelector, useDispatch } from "react-redux";
import { setVitals } from "../../../redux/ipd/consultantNotesSlice";

const UnitInput = createRemoteComponent("UnitInput");

const Vitals = (props) => {
  const { sectionData } = props || {};
  const { vitals = {} } = useSelector((state) => state.consultantNotes);
  const dispatch = useDispatch();

  const handleVitalsValue = (value, key) => {
    dispatch(setVitals({ ...vitals, [key]: value }));
  };

  const renderVitals = () => {
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
                  placeholder={config.placeholder}
                />
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className={`ipdcn-vitals-main-container`}>
      <div className="ipdcn-vitals-header">
        <img src={defaultIcons[`${sectionData?.id}Pc`]} alt="vitals" />
        <div>{sectionData?.title || "Vitals"}</div>
      </div>
      {renderVitals()}
    </div>
  );
};

export default Vitals;
