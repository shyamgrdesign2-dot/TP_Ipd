import React from "react";
import "./styles.scss";
import MedicationsBox from "../../../components/MedicationsBox";
import InteractionGate from "../components/InteractionGate/InteractionGate";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import TabMedicationBox from "../../../components/tab_design/TabMedicationBox";

const CurrentMedications = (props) => {
  const { isEditable = true } = props || {};
  let { medicationData } = useSelector((state) => state.prescription);

  if (!isEditable && !medicationData?.length) return null;

  return (
    <div
      className={`ipdaf-box-container ${
        !isEditable ? "ipdaf-box-container-readonly" : ""
      }`}
    >
      {isEditable ? (
        isMobile ? (
          <TabMedicationBox
            hideFrequentlyUsedMeds={true}
            isEditable={isEditable}
          />
        ) : (
          <MedicationsBox isEditable={isEditable} />
        )
      ) : (
        <InteractionGate disabled={true}>
          {isMobile ? (
            <TabMedicationBox
              hideFrequentlyUsedMeds={true}
              isEditable={isEditable}
            />
          ) : (
            <MedicationsBox isEditable={isEditable} />
          )}
        </InteractionGate>
      )}
    </div>
  );
};

export default CurrentMedications;
