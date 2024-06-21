import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TableView from "../tableView/TableView";

export default function TablePrint({ dataSource }) {
  const { state } = useLocation();
  const { patient_data } = state;
  const { profile } = useSelector((state) => state.doctors);
  const dob = moment(patient_data?.DOB, "Do MMM YYYY");
  const now = moment();

  // Calculate the difference in years
  const years = now.diff(dob, "years");
  dob.add(years, "years"); // Adjust DOB to account for the difference in years

  // Calculate the difference in months
  const months = now.diff(dob, "months");

  let ageString = "";

  if (years > 0 && months > 0) {
    ageString = `${years} Years ${months} Months`;
  } else if (years > 0 && months === 0) {
    ageString = `${years} Years`;
  } else if (months > 0) {
    ageString = `${months} Months`;
  }

  return (
    <div className="d-flex flex-column align-items-center print-template">
      <div className="header">Growth Chart</div>
      <div className="details">
        <img
          src={require("../../../../assets/images/babyImage.png")}
          alt="Baby"
          width={32}
          height={32}
        />
        <div style={{ height: "36px" }}>
          <div style={{ fontWeight: 600 }}>{patient_data?.pm_fullname}</div>
          <div>
            {ageString ? `Age : ${ageString},` : ""} DOB : {patient_data?.DOB},{" "}
            {patient_data?.pm_gender}
          </div>
        </div>
      </div>
      <div className="vaccine-table-wrapper">
        <TableView dataSource={dataSource} />
        <div className="nameStyle">{profile?.um_name}</div>
      </div>
    </div>
  );
}
