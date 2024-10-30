import { Button, Divider, Spin } from "antd";
import apexAI from "../assets/images/apexAI.svg";
import arrow from "../assets/images/shaded-arrow.svg";
import { useState } from "react";

const DifferentialDiagnosis = ({ handleDDxDrawer }) => {
  const [generatedDDx, setGeneratedDDx] = useState([
    {
      _id: "66867285cdbebbe52109f4d2",
      testName: "Influenza Test",
      rank: 1,
      severity: "high",
      likelihood: "most likely",
      assocSymptoms: ["Fever", "Cold"],
      treatmentOptions: ["Antiviral medication", "Rest", "Fluids"],
      labTests: ["Complete Blood Count (CBC)"],
      evidence:
        "Patient has fever for 2 days, history of tobacco use which can increase susceptibility to respiratory infections.",
      impression: "",
    },
    {
      _id: "66867285cdbebbe52109f4d3",
      testName: "COVID-19 Test",
      rank: 2,
      severity: "critical",
      likelihood: "can't miss",
      assocSymptoms: ["Fever"],
      treatmentOptions: ["Isolation", "Supportive care", "Antiviral drugs"],
      labTests: ["Arterial Blood Gases (ABG)"],
      evidence:
        "Fever lasting 2 days, with global pandemic considerations and patient's age.",
      impression: "",
    },
    {
      _id: "66867285cdbebbe52109f4d4",
      testName: "Complete Blood Count (CBC)",
      rank: 3,
      severity: "medium",
      likelihood: "extended",
      assocSymptoms: ["Fever"],
      treatmentOptions: [
        "General monitoring",
        "Antibiotics if bacterial infection detected",
      ],
      labTests: ["B-type Natriuretic Peptite (BNP)"],
      evidence:
        "Fever is often a sign of infection; tobacco use may increase risk of complications.",
      impression: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="d-flex" style={{ padding: "20px 0" }}>
      <div>
        <img
          style={{ backgroundColor: "#22003C", borderRadius: "10px 10px 0px" }}
          className="me-3"
          src={apexAI}
          alt="apex-AI"
        />
      </div>
      {isLoading ? (
        <div
          className="d-flex flex-column"
          style={{
            background: "rgba(119, 66, 254, 0.08)",
            borderRadius: 12,
            padding: "17px 20px",
            width: "100%",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div
          className="d-flex flex-column"
          style={{
            background: "rgba(119, 66, 254, 0.08)",
            borderRadius: 12,
            padding: "17px 20px",
            width: "100%",
          }}
        >
          {generatedDDx?.length > 0 ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 500 }}>
                Most Likely Differential Diagnosis
              </div>
              <span className="ddx-ready-txt">Tap diagnosis to add to Rx</span>
              <div
                className="d-flex align-items-center"
                style={{ padding: "15px 8px 0 8px", columnGap: 16 }}
              >
                {generatedDDx.map((item) => (
                  <Button
                    type="button"
                    className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between test-name-btn"
                    // onClick={handleAnalysis}
                  >
                    <span>{item?.testName}</span>
                  </Button>
                ))}
              </div>
              <Divider />
              <div
                className="d-flex align-items-center"
                style={{ padding: "0 8px", columnGap: 16 }}
              >
                <div style={{ width: "160px" }}>
                  <Button
                    type="primary"
                    className="btn d-flex w-100 align-items-center justify-content-center btn-41"
                  >
                    <i className="icon-Add me-2 fs-21"></i>
                    Generate DDx
                  </Button>
                </div>
                <Button
                  type="button"
                  className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between"
                  style={{
                    background: "white",
                  }}
                  onClick={handleDDxDrawer}
                >
                  <span>View Full Analysis</span>
                </Button>
                <div
                  className="d-flex align-items-center"
                  style={{ columnGap: 8 }}
                >
                  <div className="text-primary" style={{ fontWeight: 600 }}>
                    Know More About DDx
                  </div>
                  <img src={arrow} alt="arrow" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 500 }}>
                Differential Diagnosis
              </div>
              <div>
                Enter key symptoms and patient history to generate a list of
                possible diagnoses and recommended tests for confirmation.
                Ensure accurate data for best results.
              </div>
              <div
                className="d-flex align-items-center"
                style={{ padding: "0 8px", marginTop: 16, columnGap: 16 }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{
                    width: 268,
                    height: 48,
                    backgroundColor: "white",
                    padding: "4px 4px 4px 12px",
                    borderRadius: 12,
                  }}
                >
                  <div className="ddx-ready-txt" style={{ fontSize: 12 }}>
                    DDx ready to generate!
                  </div>
                  <div style={{ width: "160px" }}>
                    <Button
                      type="primary"
                      className="btn d-flex w-100 align-items-center justify-content-center btn-41"
                    >
                      <i className="icon-Add me-2 fs-21"></i>
                      Generate DDx
                    </Button>
                  </div>
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ columnGap: 8 }}
                >
                  <div className="text-primary" style={{ fontWeight: 600 }}>
                    Know More About DDx
                  </div>
                  <img src={arrow} alt="arrow" />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DifferentialDiagnosis;
