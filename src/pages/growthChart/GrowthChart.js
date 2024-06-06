import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./GrowthChart.scss";
import WeightChart from "./components/growthGraph/GrowthGraph";
import SubHeader from "./components/subHeader/SubHeader";
import { getAllGrowthChartParams } from "./service";
import { useLocation } from "react-router-dom";

const growthData = [1, 1, 1, 1, 1];

const GrowthChart = ({ handleDrawerVaccination, handleDrawerVital }) => {
  const { state } = useLocation();
  let { patient_data } = state;
  useEffect(() => {
    getAllGrowthChartParams({
      pm_id: patient_data?.pm_id || 0,
      pm_pid: patient_data?.pm_pid || 0,
    });
  }, []);
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
