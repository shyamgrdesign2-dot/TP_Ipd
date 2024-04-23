import React, { useState } from "react";
import { Card, Checkbox, Row, Col } from "antd";
import cardWave from "../../../../assets/images/cardWave.svg";
import "./VaccineCard.scss";
import SelectionPopup from "../selectionPopup/SelectionPopup";

const VaccineCard = () => {
  const [selectedCard, setSelectedCard] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const vaccineDetails = (details) => {
    return details.map((item) => {
      return (
        <div className="d-flex direction-column">
          <div className="vaccineDetails">{item[0]}</div>
          <div>{item[1]}</div>
        </div>
      );
    });
  };

  const details = [
    ["Brand: ", "Vaccine Brand"],
    ["Given Date: ", "20 April 2024"],
    ["Note: ", "Temperature is high"],
  ];

  const checkboxHandler = () => {
    const data = selectedValue?.length || 0 + 1;
    setSelectedCard(true);
    setSelectedValue(data);
  };

  const selectionPopupHandler = () => {
    setSelectedCard((prevState) => !prevState);
  };

  return (
    <>
      <Card className="vaccineCardContainer" bodyStyle={{ height: "100%" }}>
        {/* Vaccine status Indicator */}
        <div className="vaccineStatus">
          <span className="statusMessage">Given</span>
        </div>
        <div className="cardDetails">
          {/* Main Content */}
          <Row gutter={16}>
            <Col span={16}>
              <div>
                <div className="vaccineName">Vaccine Name</div>
                {vaccineDetails(details)}
              </div>
            </Col>
            <Col span={8}>
              <div className="d-flex justify-content-end">
                <Checkbox onChange={checkboxHandler} />
              </div>
            </Col>
          </Row>

          {/* Due Date Info */}
          <Row className="dueDetails">
            <Col>
              <div className="d-flex flex-column dueMessage">
                <div>Due date: 25 April 2024</div>
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
            width: 578,
            height: 208,
            backgroundImage: `url('${cardWave}')`,
            backgroundSize: "cover",
          }}
        />
      </Card>
      {selectedCard && (
        <SelectionPopup
          visible={selectedCard}
          onClose={selectionPopupHandler}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      )}
    </>
  );
};

export default VaccineCard;
