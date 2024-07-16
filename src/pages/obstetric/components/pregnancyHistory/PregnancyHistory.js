import { Button } from "antd";
import { useState } from "react";
import "./PregnancyHistory.scss";
import arrow from "../../../../assets/images/arrow.svg";
import pregnancyHistoryImg from "../../../../assets/images/pregnancy-history.svg";

const PregnancyHistory = () => {
  const [pregnancyHistoryData, setPregnancyHistoryData] = useState([]);

  return (
    <div>
      {pregnancyHistoryData.length ? (
        <div>pregnancyHistoryData</div>
      ) : (
        <div className="emptyDataContainer">
          <img src={pregnancyHistoryImg} alt="examination" />
          <div className="shortDescription">
            Add previous pregnancy details such as Type of birth, DOB, Sex,
            Weight, Type of delivery, Mode of delivery.
          </div>
          <Button
            type="button"
            className="btn-41 btn ant-btn-text btn-input addBtn"
            style={{
              width: "255px",
            }}
          >
            <i className="icon-Add" />
            <span>Add past pregnancy details</span>
          </Button>
          <div className="shortDescription">Or</div>

          <div className="continueBtn">
            <div className="continueText">Continue to Examination</div>
            <img src={arrow} alt="arrow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PregnancyHistory;
