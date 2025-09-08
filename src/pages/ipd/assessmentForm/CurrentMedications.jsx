import React from "react";
import "./styles.scss";
import MedicationsBox from "../../../components/MedicationsBox";
import InteractionGate from "../components/InteractionGate/InteractionGate";
import { useSelector } from "react-redux";

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
        <MedicationsBox isEditable={isEditable} />
      ) : (
        <InteractionGate disabled={true}>
          <MedicationsBox isEditable={isEditable} />
        </InteractionGate>
      )}
    </div>
  );
};

export default CurrentMedications;
