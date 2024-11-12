import { Button, Divider, Spin } from "antd";
import arrow from "../../assets/images/shaded-arrow.svg";
import selectedTick from "../../assets/images/tick.svg";
import loading from "../../assets/images/loading.gif";
import ddxIcon from "../../assets/images/ddxIcon.svg";
import { WarningColor } from "../DifferentialDiagnosisDrawer";
import { useContext } from "react";
import CashManagerContext from "../../context/CashManagerContext";
import { setIsDiagnosisBox } from "../../redux/ddxSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const TabDDxList = ({
  generatedDDx,
  handleDDxDrawer,
  isDDxLoading,
  handleDDxKnowMore,
  getGenerateDDx,
}) => {
  const dispatch = useDispatch();
  const { isDDxReadyToGenerate } = useSelector((state) => state.ddx);
  const { diagnosisData } = useContext(CashManagerContext);

  return (
    <div
      style={{
        height: "calc(-60px + 100vh)",
        overflow: "auto",
      }}
    >
      {isDDxLoading ? (
        <div
          className="d-flex align-items-center justify-content-center w-100 h-100"
          style={{ background: "rgba(119, 66, 254, 0.08)" }}
        >
          <img width={105} height={105} src={loading} alt="loading" />
        </div>
      ) : (
        <>
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{
              rowGap: "24px",
              padding: "24px 10px",
              background: "rgba(119, 66, 254, 0.08)",
              borderRadius: "0 0 20px 20px",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                lineHeight: "32px",
                textAlign: "center",
              }}
            >
              Differential Diagnosis
            </div>
            {generatedDDx?.length > 0 ? (
              <div className="d-flex justify-content-center">
                <Button
                  type="button"
                  className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between"
                  style={{
                    background: "white",
                    width: "156px",
                  }}
                  onClick={handleDDxDrawer}
                >
                  <span>View Full Analysis</span>
                </Button>
              </div>
            ) : (
              <span style={{ lineHeight: "26px", textAlign: "center" }}>
                Enter key symptoms and patient history to generate a list of
                possible diagnoses and recommended tests for confirmation.
                Ensure accurate data for best results.
              </span>
            )}
          </div>
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ padding: "0 10px", marginTop: 16, gap: 10 }}
          >
            {(isDDxReadyToGenerate || generatedDDx?.length === 0) && (
              <Button
                className="btn btn-primary3 btn-41 px-4 w-100 d-flex align-items-center"
                style={{ gap: 10 }}
                onClick={getGenerateDDx}
                disabled={!isDDxReadyToGenerate}
              >
                <img src={ddxIcon} alt="ddx-icon" />
                Generate DDx
              </Button>
            )}
            {isDDxReadyToGenerate && (
              <span className="disclaimer-txt" style={{ fontSize: 12 }}>
                {generatedDDx?.length === 0
                  ? "DDx ready to generate!"
                  : "Get updated diagnosis"}
              </span>
            )}
          </div>
          <div
            className="d-flex flex-column"
            style={{
              padding: generatedDDx?.length === 0 ? "" : "16px 10px 0px",
              gap: 16,
            }}
          >
            {generatedDDx.map((item) => {
              return (
                <div
                  className="d-flex flex-column"
                  style={{
                    padding: "11px 15px",
                    background: "#FAF8F6",
                    gap: 5,
                    borderRadius: 16,
                  }}
                >
                  <div className="patientName">
                    {item?.differentialDiagnosisName}
                  </div>
                  <div className="d-flex" style={{ columnGap: 2 }}>
                    {Array.from({ length: item?.rank || 0 }).map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: 13,
                          height: 4,
                          border: `2px solid ${WarningColor[item?.rank]}`,
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </div>
                  <h6
                    style={{
                      color: WarningColor[item?.rank],
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {item?.likelihood}
                  </h6>
                  <div
                    className="d-flex align-items-center"
                    style={{ columnGap: 8, marginTop: 10 }}
                  >
                    {diagnosisData
                      ?.map((item) => item?.tds_name)
                      ?.includes(item?.differentialDiagnosisName) ? (
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
                      <>
                        <div
                          className="text-primary"
                          style={{ fontWeight: 600 }}
                          onClick={() => dispatch(setIsDiagnosisBox(true))}
                        >
                          Add To Rx
                        </div>
                        <img src={arrow} alt="arrow" />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Divider />
          <div style={{ padding: "0px 12px" }}>
            <div
              className="d-flex align-items-center"
              style={{ paddingBottom: 10, columnGap: 8 }}
              onClick={handleDDxKnowMore}
            >
              <div className="text-primary" style={{ fontWeight: 600 }}>
                Know More About DDx
              </div>
              <img src={arrow} alt="arrow" />
            </div>
            <div
              className="disclaimer-txt"
              style={{
                color: "#A2A2A8",
                fontWeight: 500,
                fontSize: 12,
                paddingBottom: 20,
              }}
            >
              <b style={{ fontWeight: 700 }}>Disclaimer</b>: These results are
              generated by AI and should be used as a guide, not the final
              source for patient treatment decisions.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabDDxList;
