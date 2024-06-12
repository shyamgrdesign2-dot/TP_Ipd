import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./GrowthChart.scss";
import WeightChart from "./components/growthGraph/GrowthGraph";
import SubHeader from "./components/subHeader/SubHeader";
import UpdateDetails from "./updateDetails/UpdateDetails";
import { useState } from "react";
import AddDOB from "../growthChart/components/addDOB/AddDOB";
import { getAllGrowthChartParams, getParentalDetails } from "./service";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPatientDetails } from "../vaccination/service";
import moment from "moment";
import TableView from "./components/tableView/TableView";

const GrowthChart = ({ handleDrawerVaccination, handleDrawerVital }) => {
  const growthData = [1, 1, 1, 1, 1];
  const [showDob, setShowDob] = useState(false);
  const { state } = useLocation();
  const { patient_data } = state;
  const [loading, setLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [gcPatientDetails, setGcPatientDetails] = useState();
  const { profile } = useSelector((state) => state.doctors);
  const [parentalDetails, setParentalDetails] = useState();
  const [showTableView, setShowTableView] = useState(false);

  useEffect(() => {
    getPatientDetail();
    getAllGrowthChartParams({
      pm_id: patient_data?.pm_id || 0,
      pm_pid: patient_data?.pm_pid || 0,
    });
    getPatientParentalDetails();
  }, []);

  const getPatientParentalDetails = async () => {
    const getParentalDetailsRes = await getParentalDetails(
      patient_data?.pm_id,
      patient_data?.pm_pid
    );
    console.log({ getParentalDetailsRes });
    if (getParentalDetailsRes) {
      setParentalDetails({
        ...getParentalDetailsRes,
        gestation_period_weeks: getParentalDetailsRes?.gestation_period
          ? Math.floor(getParentalDetailsRes?.gestation_period / 7)
          : "",
        gestation_period_days: getParentalDetailsRes?.gestation_period
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
    if (
      !patientDetails?.vac_id ||
      (patientDetails?.vac_id && !patientDetails?.vac_dob)
    ) {
      setShowDob(true);
    } else {
      patientDetails.vac_dob = moment(patientDetails.vac_dob).format(
        "DD-MMM-YYYY"
      );
    }
    setGcPatientDetails({ ...patient_data, ...patientDetails });
    setLoading(false);
  };

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerVaccination}
        patientDetails={gcPatientDetails}
      />
      <SubHeader
        handleDrawerVital={handleDrawerVital}
        setShowUpdate={setShowUpdate}
        setShowTableView={setShowTableView}
      />

      {showUpdate && (
        <UpdateDetails
          show={showUpdate}
          setShow={setShowUpdate}
          parentalDetails={parentalDetails}
          setParentalDetails={setParentalDetails}
        />
      )}
      {showDob && (
        <AddDOB
          show={showDob}
          setShowDob={setShowDob}
          patientDetails={gcPatientDetails}
          handleDrawerVaccination={() => null}
          getVaccineDetails={() => null}
          setLoading={setLoading}
        />
      )}
      {showTableView ? (
        <TableView onEdit={handleDrawerVital} />
      ) : (
        <div className="scrollable-container">
          <Row xs={1} sm={2} md={2} lg={2} className="gy-4">
            {growthData.map((item, index) => (
              <Col key={index} className="gx-4">
                <WeightChart />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default GrowthChart;
