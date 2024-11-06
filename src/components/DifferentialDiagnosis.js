import { Button, Divider, Spin } from "antd";
import apexAI from "../assets/images/apexAI.svg";
import arrow from "../assets/images/shaded-arrow.svg";
import { useState } from "react";

const DifferentialDiagnosis = ({
  handleDDxDrawer,
  ddxOptionsList,
  getGenerateDDx,
  isDDxLoading,
  onSelectParent,
}) => {
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
          {ddxOptionsList?.length > 0 ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 500 }}>
                Most Likely Differential Diagnosis
              </div>
              <span className="ddx-ready-txt">Tap diagnosis to add to Rx</span>
              <div
                className="d-flex align-items-center"
                style={{ padding: "15px 8px 0 8px", columnGap: 16 }}
              >
                {ddxOptionsList.map((item) => (
                  <Button
                    type="button"
                    className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between test-name-btn"
                    onClick={() => onSelectParent({ ...item })}
                  >
                    <span>{item?.tds_name}</span>
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
                      onClick={getGenerateDDx}
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
