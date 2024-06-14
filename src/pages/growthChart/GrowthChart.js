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
import { dummyData, getGrowthChartData } from "./growthChartHelper";

const GrowthChart = ({ handleDrawerVaccination, handleDrawerVital }) => {
  const [showDob, setShowDob] = useState(true);
  const { state } = useLocation();
  let { patient_data } = state;
  const [loading, setLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [growthChartData, setGrowthChartData] = useState({
    Height: [],
    Weight: [],
    BMI: [],
    OFC: [],
  });

  useEffect(() => {
    getGrowthChartDetails();
  }, []);

  const getGrowthChartDetails = async () => {
    const allGrowthChartParams = await getAllGrowthChartParams({
      pm_id: patient_data?.pm_id || 0,
      pm_pid: patient_data?.pm_pid || 0,
    });
    if (allGrowthChartParams && patient_data?.DOB) {
      setGrowthChartData(
        getGrowthChartData(allGrowthChartParams, patient_data?.DOB)
      );
    }
  };

  const getData = () => {
    return Object.keys(growthChartData).map((key) => {
      if (growthChartData.hasOwnProperty(key)) {
        const chartData = { ...dummyData };
        // chartData.datasets[5] = {
        //   ...chartData.datasets[5],
        //   data: growthChartData[key],
        //   borderColor: growthChartData[key].map((item) =>
        //     item.isMalnutrition ? "#FF0000" : "#19BB7A"
        //   ),
        //   backgroundColor: growthChartData[key].map((item) =>
        //     item.isMalnutrition ? "#FF0000" : "#19BB7A"
        //   ),
        // };

        return (
          <Col key={key} className="gx-4">
            <div
              className={`graphContainer ${
                isFullscreen ? "fullScreenStyle" : ""
              }`}
            >
              <WeightChart
                data={chartData}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                handleDrawerVital={handleDrawerVital}
                graphName={key}
              />
            </div>
          </Col>
        );
      }
      return null;
    });
  };

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader handleDrawerVaccination={handleDrawerVaccination} />
      <SubHeader
        handleDrawerVital={handleDrawerVital}
        setShowUpdate={setShowUpdate}
      />
      <div className="scrollable-container">
        <Row
          xs={1}
          sm={isFullscreen ? 1 : 2}
          md={isFullscreen ? 1 : 2}
          lg={isFullscreen ? 1 : 2}
          className="gy-4"
        >
          {getData()}
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
