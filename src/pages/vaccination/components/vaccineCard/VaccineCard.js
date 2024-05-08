import React from "react";
import { Card, Checkbox, Row, Col } from "antd";
import cardWave from "../../../../assets/images/cardWave.svg";
import "./VaccineCard.scss";
import { dateFormatter } from "../../VaccinationHelper";

const VaccineCard = ({
  vaccineData,
  selectedCards,
  handleCardCheckboxChange,
  index,
}) => {
  const vaccineDetails = () => {
    return (
      <>
        {vaccineData.brandName && vaccineData.tvp_given_date ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Brand :</span>{" "}
            {vaccineData.brandName}
          </div>
        ) : null}

        {vaccineData.tvp_given_date ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Given Date : </span>
            {dateFormatter(new Date(vaccineData.tvp_given_date))}
          </div>
        ) : null}

        {vaccineData.tvd_due_date && !vaccineData.tvp_given_date ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Updated due date : </span>
            {dateFormatter(new Date(vaccineData.tvd_due_date))}
          </div>
        ) : null}

        {vaccineData.tvp_remarks ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Note : </span>{" "}
            {vaccineData.tvp_remarks || vaccineData.tvd_remarks}
          </div>
        ) : null}
      </>
    );
  };

  const checkboxHandler = () => {
    handleCardCheckboxChange(index);
  };

  return (
    <Card className="vaccineCardContainer" bodyStyle={{ height: "100%" }}>
      {/* Vaccine status Indicator */}
      {vaccineData?.tvp_given_date || vaccineData?.tvp_modify_date ? (
        <div
          className={`vaccineStatus ${
            vaccineData?.tvp_given_date ? "vaccineGiven" : ""
          }`}
        >
          <span
            className={`statusMessage ${
              vaccineData?.tvp_given_date ? "vaccineGiven" : ""
            }`}
          >
            {vaccineData?.tvp_given_date ? "Given" : "Due"}
          </span>
        </div>
      ) : null}
      <div className="cardDetails">
        {/* Main Content */}
        <Row gutter={16}>
          <Col span={16}>
            <div>
              <div className="vaccineName">{vaccineData.tvac_name}</div>
              {!vaccineData.brand ? <div>{vaccineData.fullName}</div> : null}
              {vaccineDetails()}
            </div>
          </Col>
          <Col span={8}>
            <div className="d-flex justify-content-end">
              <Checkbox
                onChange={checkboxHandler}
                checked={selectedCards.includes(index)}
              />
            </div>
          </Col>
        </Row>

        {/* Due Date Info */}
        <Row
          className={`dueDetails ${
            (!vaccineData.tvp_given_date &&
              new Date(vaccineData?.dueDate) < new Date()) ||
            vaccineData?.dueDate > vaccineData.tvp_given_date
              ? "isDelayed"
              : vaccineData?.tvp_given_date
              ? "isGiven"
              : ""
          }`}
        >
          <Col>
            <div className="d-flex flex-column dueMessage">
              <div>Due date : {vaccineData.dueDate}</div>
              <div>Based on DOB</div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -13,
          right: -11,
          width: 545,
          height: 195,
          backgroundImage: `url('${cardWave}')`,
          backgroundSize: "cover",
        }}
      />
    </Card>
  );
};

export default VaccineCard;
