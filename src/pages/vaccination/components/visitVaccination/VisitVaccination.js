import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Button, Spin } from "antd";
import "./VisitVaccination.scss";

import Vaccination from "../../../../assets/images/Vaccination.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { getNotGivenVaccines, getOverridenDueDate } from "../../service";
import {
  getVaccinesDetails,
  mergeDataPatientDetails,
} from "../../VaccinationHelper";

function VisitVaccination() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data } = state;

  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [pendingVaccines, setPendingVaccines] = useState([]);

  const overDueVaccines = async () => {
    const notGivenVaccines = await getNotGivenVaccines(
      patient_data?.patient_unique_id,
      patient_data?.pm_pid
    );
    const overridenVaccines = await getOverridenDueDate(
      patient_data?.patient_unique_id,
      patient_data?.pm_pid
    );

    const combinedData = mergeDataPatientDetails(
      notGivenVaccines,
      [],
      overridenVaccines,
      [],
      patient_data?.DOB || patient_data?.vac_dob
    );
    const vaccineDetails = getVaccinesDetails(
      notGivenVaccines,
      patient_data?.DOB || patient_data?.vac_dob
    );
    setUpcomingVaccines(vaccineDetails.upcomingVaccines);
    setPendingVaccines(vaccineDetails.pendingVaccines);
  };

  useEffect(() => {
    overDueVaccines();
  }, []);

  const vaccinesDetails = (vaccinesData) => {
    return (
      <>
        {vaccinesData.map((vaccine, index) => {
          return (
            <div key={index} className="detailContainer">
              <div className="d-flex justify-content-between">
                <div>{vaccine?.tvac_name}</div>
                <div className={vaccine.isOverDue ? "overDue" : "due"}>
                  <span
                    className={`warningDot ${vaccine.isOverDue ? "" : "due"} `}
                  />{" "}
                  Over due
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div>Update due date : 25th Oct 2024</div>
                <div>This Week</div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="appointment-wrap PatientDetailswrap m-0">
      <Card>
        <Card.Header className="bg-white py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <img src={Vaccination} alt="Medical History" className="me-3" />
              Vaccination
            </div>
            <Button
              className="btn btn-input d-flex align-items-center gap-1"
              onClick={() =>
                navigate("/vaccination", {
                  state: { patient_data: patient_data },
                })
              }
            >
              <span>See Chart</span>
              <i
                className="icon-right iconrotatehistory90"
                style={{ display: "block", transform: `rotate(180deg)` }}
              />
            </Button>
          </div>
        </Card.Header>
        <div className="p-3">
          <div className={"overflow-auto"} style={{ height: 458 }}>
            {!pendingVaccines.length && !upcomingVaccines.length ? (
              <div className="align-items-center text-center">
                <Spin />
              </div>
            ) : (
              <div className="visitVaccineContainer">
                <div className="title">
                  <div>Pending Vaccines</div>
                  <div className="subTitle">{"Birth's"}</div>
                </div>
                {vaccinesDetails(pendingVaccines)}
                <div className="title">
                  <div>Upcoming Vaccines</div>
                  <div className="subTitle">{"6th Weeks's"}</div>
                </div>
                {vaccinesDetails(upcomingVaccines)}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default React.memo(VisitVaccination);
