import React from "react";
import { Card, Checkbox, Row, Col } from "antd";
import cardWave from "../../../../assets/images/cardWave.svg";
import "./VaccineCard.scss";
import { dateFormatter, getDueDate } from "../../VaccinationHelper";

const VaccineCard = ({
  vaccineData,
  selectedCards,
  handleCardCheckboxChange,
}) => {
  const birthDate = new Date(); //birthday

  const { tvt_due_day, tvt_due_month, tvt_due_year } = vaccineData;
  const dueDate = getDueDate(
    tvt_due_day,
    tvt_due_month,
    tvt_due_year,
    birthDate
  );

  const vaccineDetails = () => {
    return (
      <>
        {vaccineData.brand ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Brand :</span>{" "}
            {vaccineData.brand}
          </div>
        ) : null}

        {vaccineData.tvp_given_date ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Given Date : </span>
            {dateFormatter(new Date(vaccineData.tvp_given_date))}
          </div>
        ) : null}

        {vaccineData.tvac_modify_date ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Updated due date : </span>
            {dateFormatter(new Date(vaccineData.tvac_modify_date))}
          </div>
        ) : null}

        {vaccineData.tvp_remarks ? (
          <div className="vaccineDetailsValue">
            <span className="vaccineDetailsKey">Note : </span>{" "}
            {vaccineData.tvp_remarks}
          </div>
        ) : null}
      </>
    );
  };

  const checkboxHandler = () => {
    handleCardCheckboxChange(vaccineData?.vaccineId);
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
                checked={selectedCards.includes(vaccineData?.tvac_id)}
              />
            </div>
          </Col>
        </Row>

        {/* Due Date Info */}
        <Row
          className={`dueDetails ${
            vaccineData?.dueDate < vaccineData.tvp_given_date
              ? "isDelayed"
              : vaccineData?.tvp_given_date
              ? "isGiven"
              : ""
          }`}
        >
          <Col>
            <div className="d-flex flex-column dueMessage">
              <div>Due date : {dueDate}</div>
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
