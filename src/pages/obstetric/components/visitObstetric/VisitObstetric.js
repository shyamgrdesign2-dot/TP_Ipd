import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import obstetricImg from "../../../../assets/images/obstetric-dark.svg";
import { Card } from "react-bootstrap";
import { Button } from "antd";
import "./VisitObstetric.scss";

export default function VisitObstetric() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data } = state;

  const [obstetricData, setObstetricData] = useState({
    date: "1 Jul 2024",
    pallor: "Yes",
    oedema: "No",
    mothersWeight: 70,
    systolic: 80,
    diastolic: 120,
    heightOfFundus: 80,
    presentation: "Breech",
    foetalHeartRate: "120 bpm",
  });

  const measurementDetails = () => {
    return (
      <div className="detailContainer">
        {Object.entries(obstetricData).map(([key, value], index) => (
          <React.Fragment key={key}>
            <div className="measurementItem">
              <span className="key">{key}</span>
              <span className="colon">:</span>
              <span className="value">{value}</span>
            </div>
            {index !== Object.entries(obstetricData).length - 1 && (
              <div className="dottedLineStyle" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <>
      {!Object.keys(obstetricData)?.length ? null : (
        <div className="appointment-wrap PatientDetailswrap m-0">
          <Card>
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <img
                    src={obstetricImg}
                    alt="Medical History"
                    className="me-3"
                  />
                  Obstetric History
                </div>
                <Button
                  className="btn btn-input d-flex align-items-center gap-1"
                  onClick={() =>
                    navigate("/prescription", {
                      state: {
                        patient_data: patient_data,
                        chartType: "obstetric",
                      },
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
            <div className="visitBody overflow-auto visitObstetricContainer">
              <div className="rowContainer">
                <span className="previousText">Previous visit</span>
                <span className="updatedText">Updated on : 20 May 2024</span>
              </div>
              <div>5 years</div>
              {measurementDetails()}
            </div>
            <Card.Footer className="bg-white py-3 viewLessOrMore">
              View less
            </Card.Footer>
          </Card>
        </div>
      )}
    </>
  );
}
