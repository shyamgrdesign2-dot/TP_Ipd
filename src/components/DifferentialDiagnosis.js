import { Button, Collapse, Divider } from "antd";
import apexAI from "../assets/images/apexAI.svg";
import arrow from "../assets/images/shaded-arrow.svg";
import ddxIcon from "../assets/images/ddxIcon.svg";
import loading from "../assets/images/loading.gif";
import { useSelector } from "react-redux";
import { IS_DDX_ACCORDIAN_OPEN } from "../utils/constants";
import { useState } from "react";

const DifferentialDiagnosis = ({
  handleDDxDrawer,
  ddxOptionsList,
  getGenerateDDx,
  isDDxLoading,
  onSelectParent,
  isDiagnosis,
  isSymptoms,
  handleDDxKnowMore,
}) => {
  const { isDDxReadyToGenerate } = useSelector((state) => state.ddx);

  const [isCollapseActive, setIsCollapseActive] = useState(
    localStorage.getItem(IS_DDX_ACCORDIAN_OPEN)
      ? JSON.parse(localStorage.getItem(IS_DDX_ACCORDIAN_OPEN))
      : false
  );

  const accordionItems = [
    {
      key: "1",
      label: (
        <div style={{ fontSize: 16, fontWeight: 500 }}>
          {ddxOptionsList?.length > 0
            ? isDiagnosis
              ? "Most Likely Differential Diagnosis"
              : isSymptoms
              ? "Associated Symptoms"
              : "Suggested Lab Test"
            : "Differential Diagnosis"}
        </div>
      ),
      children:
        ddxOptionsList?.length > 0 ? (
          <>
            <span className="ddx-ready-txt">
              {isDiagnosis
                ? "Tap diagnosis to add to Rx"
                : isSymptoms
                ? "These are symptoms associated with added diagnosis. Tap to add to Rx"
                : "Test suggestions are based on added diagnosis. Tap to add to Rx"}
            </span>
            <div
              className="d-flex align-items-center"
              style={{ padding: "15px 8px 0 0px", gap: 16, flexWrap: "wrap" }}
            >
              {ddxOptionsList.map((item, index) => (
                <Button
                  key={index}
                  type="button"
                  className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between test-name-btn"
                  onClick={() => onSelectParent({ ...item })}
                >
                  <span style={{ textTransform: "capitalize" }}>
                    {item?.tds_name ||
                      item?.symptom_name ||
                      item?.investigation_name}
                  </span>
                </Button>
              ))}
            </div>
            {isDiagnosis ? (
              <>
                <Divider />
                <div
                  className="d-flex align-items-center"
                  style={{ padding: "0 8px", columnGap: 16 }}
                >
                  <div style={{ width: "160px" }}>
                    <Button
                      className="btn btn-primary3 w-100 btn-41 px-4 me-20 d-flex align-items-center justify-content-center"
                      style={{ gap: 10 }}
                      disabled={!isDDxReadyToGenerate}
                      onClick={getGenerateDDx}
                    >
                      <img src={ddxIcon} alt="ddx-icon" />
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
                    style={{ columnGap: 8, cursor: "pointer" }}
                    onClick={handleDDxKnowMore}
                  >
                    <div className="text-primary" style={{ fontWeight: 600 }}>
                      Know More About DDx
                    </div>
                    <img src={arrow} alt="arrow" />
                  </div>
                </div>
              </>
            ) : (
              <div
                className="text-primary"
                style={{
                  fontWeight: 600,
                  textDecoration: "underline",
                  cursor: "pointer",
                  paddingTop: 16,
                }}
                onClick={handleDDxDrawer}
              >
                View Full Analysis
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              Enter key symptoms and patient history to generate a list of
              possible diagnoses and recommended tests for confirmation. Ensure
              accurate data for best results.
            </div>
            <div
              className="d-flex align-items-center"
              style={{
                padding: isDDxReadyToGenerate ? "0 8px" : "",
                marginTop: 16,
                columnGap: 16,
              }}
            >
              <div
                className="d-flex align-items-center"
                style={{
                  width: isDDxReadyToGenerate ? 268 : "",
                  height: 48,
                  backgroundColor: isDDxReadyToGenerate ? "white" : "",
                  padding: isDDxReadyToGenerate ? "4px 4px 4px 12px" : "",
                  borderRadius: 12,
                }}
              >
                {isDDxReadyToGenerate && (
                  <div className="ddx-ready-txt" style={{ fontSize: 12 }}>
                    DDx ready to generate!
                  </div>
                )}
                <div style={{ width: "160px" }}>
                  <Button
                    type="primary"
                    className="btn btn-primary3 btn-41 px-4 me-20 w-100 d-flex align-items-center justify-content-center"
                    style={{ gap: 10 }}
                    onClick={getGenerateDDx}
                    disabled={!isDDxReadyToGenerate}
                  >
                    <img src={ddxIcon} alt="ddx-icon" />
                    Generate DDx
                  </Button>
                </div>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ columnGap: 8, cursor: "pointer" }}
                onClick={handleDDxKnowMore}
              >
                <div className="text-primary" style={{ fontWeight: 600 }}>
                  Know More About DDx
                </div>
                <img src={arrow} alt="arrow" />
              </div>
            </div>
          </>
        ),
    },
  ];

  const handlePanelChange = () => {
    setIsCollapseActive((prev) => !prev);
    localStorage.setItem(IS_DDX_ACCORDIAN_OPEN, !isCollapseActive);
  };

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
      {isDDxLoading ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            background: "rgba(119, 66, 254, 0.08)",
            borderRadius: 12,
            padding: "17px 20px",
            width: "100%",
          }}
        >
          <img width={105} height={105} src={loading} alt="loading" />
          <span className="title-common">Generating AI powered diagnosis</span>
        </div>
      ) : (
        <div
          className="d-flex flex-column"
          style={{
            width: "100%",
          }}
        >
          <Collapse
            items={accordionItems}
            defaultActiveKey={isCollapseActive ? ["1"] : null}
            onChange={handlePanelChange}
            className="prescriptiontab-accordian ddx-collapse"
            expandIconPosition={"end"}
          />
        </div>
      )}
    </div>
  );
};

export default DifferentialDiagnosis;
