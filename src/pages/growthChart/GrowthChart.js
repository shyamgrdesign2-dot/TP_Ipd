import React from "react";
import { Col, Row } from "react-bootstrap";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import WeightChart from "./growthGraph/GrowthGraph";
import SubHeader from "./subHeader/SubHeader";
import "./GrowthChart.scss";

const growthData = [1, 1, 1, 1, 1];

const GrowthChart = ({ handleDrawerVaccination, handleDrawerVital }) => {
  return (
    <div className="vaccinationWrapper">
      <VaccineHeader handleDrawerVaccination={handleDrawerVaccination} />
      <SubHeader handleDrawerVital={handleDrawerVital} />
      <div className="scrollable-container">
        <Row xs={1} sm={2} md={2} lg={2} className="gy-4">
          {growthData.map((item, index) => (
            <Col key={index} className="gx-4">
              <WeightChart />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default GrowthChart;
