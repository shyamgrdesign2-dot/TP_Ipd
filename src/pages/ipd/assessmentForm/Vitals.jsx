import React, { useState } from "react";
import { IPD } from "../../../utils/locale";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";

const UnitInput = createRemoteComponent("UnitInput");

const Vitals = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const [value, setValue] = useState({});

  const handleVitalsValue = (e, key) => {
    setValue({ ...value, [key]: e });
  };
  return (
    <div className="ipdaf-vitals-main-container">
      <div className="ipdaf-vitals-header">
        <img src={defaultIcons[sectionData?.icon]} alt="vitals" />
        <div>{sectionData?.title}</div>
      </div>
      <div className="ipdaf-vitals-container">
        {/* TODO: INTEL - CAN BE ADDED IN CUSTOMIZATION DATA TO MAKE IT DYNAMIC */}
        {IPD.VITALS?.map((vital) => {
          return (
            <UnitInput
              containerStyle={{ marginBottom: "20px" }}
              onChange={(e) => handleVitalsValue(e, vital.name)}
              value={value?.[vital?.name]}
              type="text"
              inputMode="decimal"
              {...vital}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Vitals;
