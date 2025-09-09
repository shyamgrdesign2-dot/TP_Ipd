import React from "react";
import './styles.scss';
import MedicationsBox from "../../../components/MedicationsBox";

const CurrentMedications = (props) => {
  const { isEditable = true, sectionData } = props || {};

  return (
    <div className="ipdaf-box-container">
        <MedicationsBox />
    </div>
  );
};

export default CurrentMedications;
