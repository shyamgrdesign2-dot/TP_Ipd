import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Button, Spin } from "antd";
import "./VisitVaccination.scss";

import Vaccination from "../../../../assets/images/Vaccination.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { getNotGivenVaccines, getOverridenDueDate } from "../../service";
import {
  dateFormatter,
  getVaccinesDetails,
  mergeDataPatientDetails,
} from "../../VaccinationHelper";
import moment from "moment";

function VisitVaccination() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data } = state;

  const [upcomingVaccines, setUpcomingVaccines] = useState(null);
  const [pendingVaccines, setPendingVaccines] = useState(null);

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
      combinedData,
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
          const currentDate = moment();
          const vaccineDueDate = vaccine.tvd_due_date
            ? moment(dateFormatter(new Date(vaccine.tvd_due_date)))
            : moment(vaccine.dueDate, "Do MMM YYYY");
          const isOverDue = currentDate.isSameOrAfter(vaccineDueDate, "day");

          // Difference in days
          const diffInDays = currentDate.diff(vaccineDueDate, "days");

          // Difference in weeks
          const diffInWeeks = currentDate.diff(vaccineDueDate, "weeks");

          // Difference in months
          const diffInMonths = currentDate.diff(vaccineDueDate, "months");

          // Difference in months
          const diffInYears = currentDate.diff(vaccineDueDate, "years");

          let lateText = "";
          if (diffInYears >= 1) {
            lateText = "Last Year";
          } else if (diffInMonths >= 1) {
            lateText = "Last month";
          } else if (diffInWeeks >= 1) {
            lateText = "Last week";
          } else if (diffInDays >= 1) {
            lateText = "Last day";
          } else if (diffInDays === 0) {
            lateText = "Today";
          } else if (diffInYears < 0) {
            lateText = "Next year";
          } else if (diffInMonths < 0) {
            lateText = "Next month";
          } else if (diffInWeeks < 0) {
            lateText = "This month";
          } else if (diffInDays < 0) {
            lateText = "This week";
          }
          return (
            <div key={index} className="detailContainer">
              <div className="d-flex justify-content-between">
                <div className="vaccineName">{vaccine?.tvac_name}</div>
                <div className={isOverDue ? "overDue" : "due"}>
                  <span className={`warningDot ${isOverDue ? "" : "due"} `} />{" "}
                  {isOverDue ? "Over due" : "Due"}
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  {vaccine.tvd_due_date
                    ? `Update due date : ${moment(vaccine.tvd_due_date).format(
                        "DD-MMM-YYYY"
                      )}`
                    : vaccine.dueDate
                    ? `Due Date : ${vaccine.dueDate} (Based on DOB)`
                    : ""}
                </div>
                <div>{lateText}</div>
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
            {pendingVaccines === null ? (
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
                  <div className="subTitle">{upcomingVaccines[0]?.tvt_age}</div>
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
