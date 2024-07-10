import { Button } from "antd";
import { useState } from "react";
import "./../pregnancyHistory/PregnancyHistory.scss";

const Examination = () => {
  const [examinationData, setExaminationData] = useState([]);
  return (
    <div>
      {examinationData.length ? (
        <div>pregnancyHistoryData</div>
      ) : (
        <div className="emptyDataContainer">
          <div className="shortDescription">
            Add details to track every details such as Fundus height, Fetus
            weight, Presentation and Fetus heart rate.
          </div>
          <Button
            type="button"
            className="btn-41 btn ant-btn-text btn-input"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "180px",
            }}
          >
            <i className="icon-Add" />
            <span>Add Examination</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Examination;
