import React, { useCallback, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./GrowthChart.scss";
import WeightChart from "./components/growthGraph/GrowthGraph";
import SubHeader from "./components/subHeader/SubHeader";
import UpdateDetails from "./updateDetails/UpdateDetails";
import { useState } from "react";
import { getAllGrowthChartParams, getParentalDetails } from "./service";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPatientDetails } from "../vaccination/service";
import moment from "moment";
import TableView from "./components/tableView/TableView";
import Measurements from "./components/measurements/Measurements";
import { Drawer } from "antd";
import {
  dummyData,
  getGrowthChartData,
  getMidParentalHeight,
} from "./growthChartHelper";
import { staticData } from "./GrowthChartStaticData";

const GrowthChart = ({ handleDrawerVaccination }) => {
  const { state } = useLocation();
  const { patient_data } = state;
  const gender = patient_data?.pm_gender;

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
        const objectName = staticData[gender][key];
        const chartData = dummyData.datasets?.map((item) => {
          const labelName = item.label;
          return {
            ...item,
            data: showTimelineInYear
              ? objectName[labelName]?.filter((_, index) => index % 12 === 0)
              : objectName[labelName],
          };
        });

        const patientData = {
          data: growthChartData[key],
          label: "",
          borderColor: growthChartData[key].map((item) =>
            item.isMalnutrition ? "#FF0000" : "#19BB7A"
          ),
          backgroundColor: growthChartData[key].map((item) =>
            item.isMalnutrition ? "#FF0000" : "#19BB7A"
          ),
          borderDash: [5, 5], // Make the line dotted
          pointRadius: 5, // Show points
          pointHoverRadius: 7, // Show points on hover
          hidden: false,
        };

        chartData.push(patientData);

        const graphData = {
          labels: showTimelineInYear
            ? Array.from({ length: 6 }, (_, i) => i)
            : Array.from({ length: 63 }, (_, i) => i),
          datasets: chartData,
        };

        return (
          <Col key={key} className="gx-4">
            <div
              className={`graphContainer ${
                isFullscreen ? "fullScreenStyle" : ""
              }`}
            >
              <WeightChart
                data={graphData}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                handleDrawerVital={(data) => {
                  handleEditMeasurements(data);
                  handleDrawerMeasurements();
                }}
                graphName={key}
                showTimelineInYear={showTimelineInYear}
              />
            </div>
          </Col>
        );
      }
      return null;
    });
  };
  const [gcPatientDetails, setGcPatientDetails] = useState();
  const { profile } = useSelector((state) => state.doctors);
  const [parentalDetails, setParentalDetails] = useState();
  const [showTableView, setShowTableView] = useState(false);
  const [showTimelineInYear, setShowTimelineInYear] = useState(false);
  const [allGrowthChartParams, setAllGrowthChartParams] = useState([]);
  const [measurementsDrawer, setMeasurementsDrawer] = useState(false);
  const [measurementsData, setMeasurementsData] = useState([]);

  useEffect(() => {
    getPatientDetail();
    getGrowthChartParams();
    getPatientParentalDetails();
  }, []);

  const getGrowthChartParams = async () => {
    const growthChartParamsRes = await getAllGrowthChartParams({
      pm_id: patient_data?.pm_id || 0,
      pm_pid: patient_data?.pm_pid || 0,
    });
    console.log({ growthChartParamsRes });
    setAllGrowthChartParams(growthChartParamsRes);
  };

  const getPatientParentalDetails = async () => {
    const getParentalDetailsRes = await getParentalDetails(
      patient_data?.pm_id,
      patient_data?.pm_pid
    );
    if (getParentalDetailsRes) {
      const { father_height, mother_height, gestation_period } =
        getParentalDetailsRes;
      const { maleChildHeight, femaleChildHeight } = getMidParentalHeight(
        father_height,
        mother_height
      );
      setParentalDetails({
        ...getParentalDetailsRes,
        ...(father_height &&
          mother_height && {
            mid_parental_height:
              gcPatientDetails?.vac_gender === "Male"
                ? maleChildHeight
                : femaleChildHeight,
          }),
        gestation_period_weeks: gestation_period
          ? Math.floor(getParentalDetailsRes?.gestation_period / 7)
          : "",
        gestation_period_days: gestation_period
          ? getParentalDetailsRes?.gestation_period % 7
          : "",
      });
    }
  };

  const getPatientDetail = async () => {
    const patientDetails = await getPatientDetails({
      hospital_bid:
        patient_data?.hm_business_id || patient_data?.hospital_business_id,
      patient_uid: patient_data?.patient_unique_id,
      hospital_id: patient_data?.hm_id || profile?.hospital_data?.[0]?.hm_id,
    });
    if (patientDetails?.vac_dob) {
      patientDetails.vac_dob = moment(patientDetails.vac_dob).format(
        "DD-MMM-YYYY"
      );
    }
    setGcPatientDetails({ ...patient_data, ...patientDetails });
    setLoading(false);
  };

  const handleDrawerMeasurements = useCallback(() => {
    setMeasurementsDrawer(!measurementsDrawer);
  }, [measurementsDrawer]);

  const handleEditMeasurements = (i) => {
    setMeasurementsData(i);
  };

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerVaccination}
        patientDetails={gcPatientDetails}
      />
      <SubHeader
        handleDrawerMeasurements={handleDrawerMeasurements}
        setShowUpdate={setShowUpdate}
        showTableView={showTableView}
        setShowTableView={setShowTableView}
        showTimelineInYear={showTimelineInYear}
        setShowTimelineInYear={setShowTimelineInYear}
        parentalDetails={parentalDetails}
      />
      {measurementsDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerMeasurements}
          open={measurementsDrawer}
          className="modalWidth-700"
          width="auto"
        >
          <Measurements
            measurementsToEdit={measurementsData}
            handleDrawerMeasurements={handleDrawerMeasurements}
            getGrowthChartParams={getGrowthChartParams}
            setMeasurementsToEdit={setMeasurementsData}
          />
        </Drawer>
      )}

      {showUpdate && (
        <UpdateDetails
          show={showUpdate}
          setShow={setShowUpdate}
          parentalDetails={parentalDetails}
          setParentalDetails={setParentalDetails}
        />
      )}
      {showTableView ? (
        <TableView
          onEdit={(i) => {
            handleEditMeasurements(i);
            handleDrawerMeasurements();
          }}
          dataSource={allGrowthChartParams}
        />
      ) : (
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
      )}
    </div>
  );
};

export default GrowthChart;
