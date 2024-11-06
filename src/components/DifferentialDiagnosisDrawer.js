import { Button, Card } from "antd";
import apexAI from "../assets/images/apexAI.svg";
import diagnoses from "../assets/images/diagnosis-white.svg";
import arrow from "../assets/images/shaded-arrow.svg";
import symptoms from "../assets/images/symptoms-white.svg";
import lab from "../assets/images/Lab.svg";
import tick from "../assets/images/mandatory-tick.svg";
import selectedTick from "../assets/images/tick.svg";

const WarningColor = {
  1: "rgba(194, 159, 0, 1)",
  2: "rgba(194, 159, 0, 1)",
  3: "rgba(239, 125, 25, 1)",
  4: "rgba(239, 25, 65, 1)",
};

const addedDiagnosis = ["Influenza Test"];
const addedSymptoms = ["Fever"];
const addedLabTest = ["Complete Blood Count (CBC)"];

// const generatedDDx = [
//   {
//     _id: "66867285cdbebbe52109f4d2",
//     testName: "Influenza Test",
//     rank: 1,
//     severity: "high",
//     likelihood: "most likely",
//     assocSymptoms: ["Fever", "Cold"],
//     treatmentOptions: ["Antiviral medication", "Rest", "Fluids"],
//     labTests: ["Complete Blood Count (CBC)"],
//     evidence:
//       "Patient has fever for 2 days, history of tobacco use which can increase susceptibility to respiratory infections.",
//     impression: "",
//   },
//   {
//     _id: "66867285cdbebbe52109f4d3",
//     testName: "COVID-19 Test",
//     rank: 2,
//     severity: "critical",
//     likelihood: "can't miss",
//     assocSymptoms: ["Fever"],
//     treatmentOptions: ["Isolation", "Supportive care", "Antiviral drugs"],
//     labTests: ["Arterial Blood Gases (ABG)"],
//     evidence:
//       "Fever lasting 2 days, with global pandemic considerations and patient's age.",
//     impression: "",
//   },
//   {
//     _id: "66867285cdbebbe52109f4d4",
//     testName: "Complete Blood Count (CBC)",
//     rank: 3,
//     severity: "medium",
//     likelihood: "extended",
//     assocSymptoms: ["Fever"],
//     treatmentOptions: [
//       "General monitoring",
//       "Antibiotics if bacterial infection detected",
//     ],
//     labTests: ["B-type Natriuretic Peptite (BNP)"],
//     evidence:
//       "Fever is often a sign of infection; tobacco use may increase risk of complications.",
//     impression: "",
//   },
// ];

const DifferentialDiagnosisDrawer = ({ handleDDxDrawer, generatedDDx }) => {
  return (
    <div className="upload-document">
      <Card bordered={false} className="search-modalCard">
        <div
          className="modalCard-header h-60 align-items-center justify-content-between d-flex"
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
          }}
        >
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={handleDDxDrawer}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Differential Diagnosis</div>
            <img className="me-3" src={apexAI} alt="apex-AI" />
          </div>
        </div>

        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ padding: "20px 40px" }}
        >
          <div
            className="evidence"
            style={{
              backgroundColor: "#F1F1F5",
              marginRight: "auto",
              padding: "4px 8px",
              borderRadius: "8px 8px 0 0",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Today’s Diagnosis
          </div>

          <div
            style={{
              borderBottom: "2px solid #E2E2EA",
              width: "100%",
              marginBottom: 40,
            }}
          />
          <div className="d-flex flex-column" style={{ rowGap: 44 }}>
            {generatedDDx.map((item, index) => {
              return (
                <div key={index} className="d-flex" style={{ columnGap: 24 }}>
                  <div
                    style={{
                      border: "2px solid rgba(34, 0, 60, 0.04)",
                      borderRadius: "4px",
                    }}
                  />
                  <div className="d-flex flex-column gap-4 w-100">
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        borderBottom: "1px solid #C8C8C8",
                        paddingBottom: 16,
                      }}
                    >
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex">
                          <img
                            className="me-3"
                            src={diagnoses}
                            alt="diagnosis"
                          />
                          <div>{item?.testName}</div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex" style={{ columnGap: 2 }}>
                            {Array.from({ length: item?.rank || 0 }).map(
                              (_, index) => (
                                <div
                                  key={index}
                                  style={{
                                    width: 13,
                                    height: 4,
                                    border: `2px solid ${
                                      WarningColor[item?.rank]
                                    }`,
                                    borderRadius: 2,
                                  }}
                                />
                              )
                            )}
                          </div>
                          <h6
                            style={{
                              color: WarningColor[item.rank],
                              fontSize: 12,
                              marginBottom: 0,
                            }}
                          >
                            {item?.likelihood}
                          </h6>
                        </div>
                      </div>
                      {item?.testName?.includes(addedDiagnosis) ? (
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={selectedTick}
                            alt="tick"
                            width={18}
                            height={18}
                          />
                          <div
                            className="document-date"
                            style={{ fontWeight: 600 }}
                          >
                            Added
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Button
                            type="primary"
                            className="btn d-flex w-100 align-items-center justify-content-center btn-41"
                          >
                            Add to Rx
                          </Button>
                        </div>
                      )}
                    </div>

                    <div
                      className="evidence"
                      style={{ color: "rgba(29, 29, 29, 0.65)" }}
                    >
                      {item?.evidence}
                    </div>
                    <div className="d-flex gap-4">
                      <div
                        className="d-flex flex-column gap-4 w-100 justify-content-between"
                        style={{
                          backgroundColor: "#FAF8F6",
                          padding: "11px 15px",
                          borderRadius: 16,
                        }}
                      >
                        <div>
                          <div className="d-flex mb-4">
                            <img
                              className="me-2"
                              src={symptoms}
                              alt="symptoms"
                            />
                            <div
                              className="modal-title"
                              style={{ fontSize: 16 }}
                            >
                              Associated Symptoms
                            </div>
                          </div>
                          <div
                            className="d-flex flex-column"
                            style={{ rowGap: 12 }}
                          >
                            {item?.assocSymptoms?.map((symptom) => (
                              <div
                                key={symptom}
                                className="d-flex align-items-center gap-1"
                              >
                                <span>{symptom}</span>
                                {symptom.includes(addedSymptoms) ? (
                                  <img
                                    src={tick}
                                    alt="tick"
                                    width={16}
                                    height={16}
                                  />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div
                          className="d-flex align-items-center"
                          style={{ columnGap: 8 }}
                        >
                          <div
                            className="text-primary"
                            style={{ fontWeight: 600 }}
                          >
                            Add To Rx/Edit
                          </div>
                          <img src={arrow} alt="arrow" />
                        </div>
                      </div>

                      <div
                        className="d-flex flex-column justify-content-between gap-4 w-100"
                        style={{
                          backgroundColor: "#FAF8F6",
                          padding: "11px 15px",
                          borderRadius: 16,
                        }}
                      >
                        <div>
                          <div className="d-flex mb-4">
                            <img className="me-2" src={lab} alt="lab" />
                            <div
                              className="modal-title"
                              style={{ fontSize: 16 }}
                            >
                              Suggested Lab Tests
                            </div>
                          </div>
                          <div
                            className="d-flex flex-column"
                            style={{ rowGap: 12 }}
                          >
                            {item?.labTests?.map((labTest) => (
                              <div
                                key={labTest}
                                className="d-flex align-items-center gap-1"
                              >
                                <span>{labTest}</span>
                                {labTest.includes(addedLabTest) ? (
                                  <img
                                    src={tick}
                                    alt="tick"
                                    width={16}
                                    height={16}
                                  />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div
                          className="d-flex align-items-center"
                          style={{ columnGap: 8 }}
                        >
                          <div
                            className="text-primary"
                            style={{ fontWeight: 600 }}
                          >
                            Add To Rx/Edit
                          </div>
                          <img src={arrow} alt="arrow" />
                        </div>
                      </div>
                    </div>
                    <div>Was this result useful?</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="disclaimer-txt"
            style={{ fontSize: 12, fontWeight: 500, margin: "44px 40px 30px" }}
          >
            <b>Disclaimer</b>: These results are generated by AI and should be
            used as a guide, not the final source for patient treatment
            decisions.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DifferentialDiagnosisDrawer;
