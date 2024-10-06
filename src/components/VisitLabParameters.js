import { Button } from "antd";
import { useState } from "react";
import LabParametersList from "./LabParametersList";
import labParamsImg from "../assets/images/Lab.svg";
import { Card } from "react-bootstrap";

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
        arrowDirection: "down",
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

const VisitLabParameters = () => {
  const [labParamsData, setLabParamsData] = useState(mockData?.slice(0, 2));
  return (
    <div>
      {labParamsData?.length > 0 ? (
        <div className="appointment-wrap PatientDetailswrap m-0">
          <Card
            style={{
              overflow: "hidden",
            }}
          >
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={labParamsImg}
                    alt="lab-parameters"
                    className="me-3"
                  />
                  Lab Results
                </div>
                <Button
                  className="btn btn-input d-flex align-items-center gap-1"
                  // onClick={obstetricNavigate}
                >
                  <span style={{ textDecoration: "underline" }}>View All</span>
                  <i
                    className="icon-right iconrotatehistory90"
                    style={{
                      display: "block",
                      transform: `rotate(180deg)`,
                      marginTop: "-1px",
                    }}
                  />
                </Button>
              </div>
            </Card.Header>
            <LabParametersList />
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default VisitLabParameters;
