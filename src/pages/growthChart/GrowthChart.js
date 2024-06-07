import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./GrowthChart.scss";
import WeightChart from "./components/growthGraph/GrowthGraph";
import SubHeader from "./components/subHeader/SubHeader";
import UpdateDetails from "./updateDetails/UpdateDetails";
import { useState } from "react";
import AddDOB from "../vaccination/components/addDOB/AddDOB";
import { getAllGrowthChartParams } from "./service";
import { useLocation } from "react-router-dom";

const GrowthChart = ({ handleDrawerVaccination, handleDrawerVital }) => {
  const growthData = [1, 1, 1, 1, 1];
  const [showDob, setShowDob] = useState(true);
  const { state } = useLocation();
  let { patient_data } = state;
  const [loading, setLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        <Row
          xs={1}
          sm={isFullscreen ? 1 : 2}
          md={isFullscreen ? 1 : 2}
          lg={isFullscreen ? 1 : 2}
          className="gy-4"
        >
          {growthData.map((item, index) => (
            <Col key={index} className="gx-4">
              <div
                className={`graphContainer ${
                  isFullscreen ? "fullScreenStyle" : ""
                }`}
              >
                <WeightChart
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
      {showUpdate && (
        <UpdateDetails show={showUpdate} setShow={setShowUpdate} />
      )}
      {showDob && (
        <AddDOB
          show={showDob}
          setShowDob={setShowDob}
          patientDetails={patient_data}
          handleDrawerVaccination={() => null}
          getVaccineDetails={() => null}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default GrowthChart;
