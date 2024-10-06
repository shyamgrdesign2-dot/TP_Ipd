import { Button, Divider } from "antd";
import React, { useState } from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const mockData = [
  {
    date: "2024-09-23",
    inputs: [
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Red blood cell count",
        value: "98.4",
        arrowDirection: "",
        unit: "Cells/L",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Hemoglobin",
        value: "98.4",
        arrowDirection: "",
        unit: "dl",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Platelet Count",
        value: "95",
        arrowDirection: "down",
        unit: "cmm",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Remarks",
        value: "some random string is input here",
        arrowDirection: "",
        unit: "",
      },
    ],
  },
  {
    date: "2024-09-24",
    inputs: [
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Red blood cell count",
        value: "98.4",
        arrowDirection: "down",
        unit: "Cells/L",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Platelet Count",
        value: "95",
        arrowDirection: "up",
        unit: "cmm",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85093",
        reportName: "Spot Urine Sodium",
        name: "Remarks",
        value: "some random string is input here",
        arrowDirection: "down",
        unit: "cmm",
      },
    ],
  },
];

const TabLabParametersList = ({ handleCollapsed }) => {
  const [labParamsData, setLabParamsData] = useState(mockData?.[0]);
  const measurementDetails = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", rowGap: "16px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600" }}>
          {dayjs(labParamsData?.date).format("DD MMM, YY")}
        </div>
        {labParamsData?.inputs?.map((labParamItem, index) => {
          return (
            <React.Fragment key={index}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "400" }}>{`${labParamItem?.name} ${
                  labParamItem?.unit ? `(${labParamItem?.unit})` : ""
                }`}</div>
                <div
                  className={`${
                    labParamItem?.arrowDirection === "up" ||
                    labParamItem?.arrowDirection === "down"
                      ? "lab-params-warning"
                      : ""
                  } ${labParamItem?.name === "Remarks" ? "remarks-style" : ""}`}
                  style={{ fontWeight: "400", width: "20%", textAlign: "end" }}
                >
                  {labParamItem?.arrowDirection === "up" ? (
                    <ArrowUpOutlined
                      className="lab-params-warning"
                      style={{ paddingLeft: 5 }}
                    />
                  ) : labParamItem?.arrowDirection === "down" ? (
                    <ArrowDownOutlined
                      className="lab-params-warning"
                      style={{ paddingLeft: 5 }}
                    />
                  ) : null}
                  {labParamItem?.value}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  return (
    <div>
      <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
        Lab Results
        <Button
          type="text"
          className="btn p-0 btn-outline"
          onClick={handleCollapsed}
        >
          <i className="icon-Contract fs-21 text-white p-0"></i>
        </Button>
      </div>
      <div
        className="overflow-y-auto"
        style={{ height: "calc(100vh - 108px)" }}
      >
        <div className="p-10">
          <Button
            className="btn btn-input d-flex w-100 align-items-center justify-content-center btn-41"
            // onClick={handleAddClick}
          >
            <i className="icon-Add me-2 fs-21"></i>
            Add or Edit
          </Button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "16px",
              padding: "16px 0",
            }}
          >
            {measurementDetails()}
          </div>
          <Divider dashed style={{ color: "#D0D5DD", margin: "0 0 16px" }} />
          <div
            className="d-flex align-items-center"
            // onClick={handleDrawerMedicalReport}
          >
            <span className="view-all-txt">View All</span>
            <i className="icon-right view-all-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabLabParametersList;
