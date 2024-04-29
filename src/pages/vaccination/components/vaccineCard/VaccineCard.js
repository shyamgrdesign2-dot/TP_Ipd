import React from "react";
import { Card, Checkbox, Row, Col } from "antd";
import cardWave from "../../../../assets/images/cardWave.svg";
import "./VaccineCard.scss";

const VaccineCard = ({
  vaccineData,
  selectedCards,
  handleCardCheckboxChange,
}) => {
  const vaccineDetails = (details) => {
    return details?.map((item) => {
      return (
        <div key={item[0]} className="d-flex direction-column">
          <div className="vaccineDetailsKey">{item[0]}</div>
          <div className="vaccineDetailsValue">{item[1]}</div>
        </div>
      );
    });
  };

  const checkboxHandler = () => {
    handleCardCheckboxChange(vaccineData?.vaccineId);
  };

  return (
    <Card className="vaccineCardContainer" bodyStyle={{ height: "100%" }}>
      {/* Vaccine status Indicator */}
      {vaccineData?.isVaccineGiven || vaccineData?.dueDate ? (
        <div
          className={`vaccineStatus ${
            vaccineData?.isVaccineGiven ? "vaccineGiven" : ""
          }`}
        >
          <span
            className={`statusMessage ${
              vaccineData?.isVaccineGiven ? "vaccineGiven" : ""
            }`}
          >
            {vaccineData?.isVaccineGiven ? "Given" : "Due"}
          </span>
        </div>
      ) : null}
      <div className="cardDetails">
        {/* Main Content */}
        <Row gutter={16}>
          <Col span={16}>
            <div>
              <div className="vaccineName">{vaccineData.name}</div>
              {!vaccineData.brand ? <div>{vaccineData.fullName}</div> : null}
              {vaccineDetails(vaccineData.moreDetails)}
            </div>
          </Col>
          <Col span={8}>
            <div className="d-flex justify-content-end">
              <Checkbox
                onChange={checkboxHandler}
                checked={selectedCards.includes(vaccineData?.vaccineId)}
              />
            </div>
          </Col>
        </Row>

        {/* Due Date Info */}
        <Row
          className={`dueDetails ${
            vaccineData?.isDelayed
              ? "isDelayed"
              : vaccineData?.isVaccineGiven
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
