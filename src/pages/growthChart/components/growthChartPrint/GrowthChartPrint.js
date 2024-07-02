import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TableView from "../tableView/TableView";
import { Row } from "react-bootstrap";

export default function GrowthChartPrint({
  dataSource,
  getGraphs,
  isTableprint,
}) {
  const { state } = useLocation();
  const { patient_data } = state;
  const { profile } = useSelector((state) => state.doctors);

  const ageString = `${
    patient_data?.ageYears ? patient_data?.ageYears + " Years" : ""
  } ${patient_data?.ageMonths ? patient_data?.ageMonths + " Months" : ""}`;

  return (
    <div className="d-flex flex-column align-items-center">
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
        {isTableprint ? (
          <TableView dataSource={dataSource} />
        ) : (
          <div
            className="graphsWrapper"
            style={{ padding: "0", overflow: "hidden" }}
          >
            <Row sm={2} md={2} lg={2} className="gy-4">
              {getGraphs()}
            </Row>
          </div>
        )}
        <div className="nameStyle" style={{ padding: 0 }}>
          {profile?.um_name}
        </div>
      </div>
    </div>
  );
}
