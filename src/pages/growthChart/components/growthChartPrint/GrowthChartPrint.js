import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TableView from "../tableView/TableView";
import { Row } from "react-bootstrap";
import moment from "moment";

export default function GrowthChartPrint({
  dataSource,
  getGraphs,
  isTableprint,
}) {
  const { state } = useLocation();
  const { patient_data } = state;
  const { profile } = useSelector((state) => state.doctors);
  const { patients_details } = useSelector((state) => state.records);
  const pageData = [getGraphs().slice(0, 4), getGraphs().slice(4)];
  const ageString = `${
    patient_data?.ageYears ? patient_data?.ageYears + " Years" : ""
  } ${patient_data?.ageMonths ? patient_data?.ageMonths + " Months" : ""}`;

  return (
    <>
      {pageData.map(
        (data, index) =>
          !!data?.length && (
            <div
              key={index}
              className="d-flex flex-column align-items-center print-template"
            >
              <div className="header">Growth Chart</div>
              <div className="details">
                <img
                  src={require("../../../../assets/images/babyImage.png")}
                  alt="Baby"
                  width={32}
                  height={32}
                />
                <div style={{ height: "36px" }}>
                  <div style={{ fontWeight: 600 }}>
                    {patient_data?.pm_fullname}
                  </div>
                  <div>
                    {ageString ? `Age : ${ageString},` : ""}
                    {patients_details?.pm_dob
                      ? `DOB : ${moment(patients_details.pm_dob).format(
                          "DD-MM-YYYY"
                        )}`
                      : ""}
                    ,{patient_data?.pm_gender}
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
                      {data}
                    </Row>
                  </div>
                )}
                {index === pageData?.length - 1 && (
                  <div className="nameStyle" style={{ padding: 0 }}>
                    {profile?.um_name}
                  </div>
                )}
              </div>
            </div>
          )
      )}
    </>
  );
}
