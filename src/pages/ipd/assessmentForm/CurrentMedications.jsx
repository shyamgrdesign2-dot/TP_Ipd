import React from "react";
import "./styles.scss";
import MedicationsBox from "../../../components/MedicationsBox";
import InteractionGate from "../components/InteractionGate/InteractionGate";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import TabMedicationBox from "../../../components/tab_design/TabMedicationBox";
// import IpdMedicationBox from "../../../components/ipdMedicationBox";
import MedicationBoxIpd from "../../../components/medicationBoxIpd";

const CurrentMedications = (props) => {
  const { isEditable = true, isDischargeSummary = false } = props || {};
  let { medicationData } = useSelector((state) => state.prescription);

  if (!isEditable && !medicationData?.length) return null;

  return (
    <div
      className={`ipdaf-medication-box-container ${
        !isEditable ? "ipdaf-medication-box-container-readonly" : ""
      }`}
    >
      {isEditable ? (
        isMobile ? (
          <MedicationBoxIpd isEditable={isEditable} />
        ) : (
          <MedicationsBox isEditable={isEditable} isDischargeSummary={isDischargeSummary} />
        )
      ) : (
        <InteractionGate disabled={true}>
          {isMobile ? (
            <MedicationBoxIpd isEditable={isEditable} />
          ) : (
            <MedicationsBox isEditable={isEditable} isDischargeSummary={isDischargeSummary} />
          )}
        </InteractionGate>
      )}
    </div>
  );
};

export default CurrentMedications;
