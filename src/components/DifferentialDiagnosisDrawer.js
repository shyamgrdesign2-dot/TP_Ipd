import { Button, Card, Collapse, Tabs } from "antd";
import apexAI from "../assets/images/apexAI.svg";
import diagnoses from "../assets/images/diagnosis-white.svg";
import arrow from "../assets/images/shaded-arrow.svg";
import lab from "../assets/images/Lab.svg";
import selectedTick from "../assets/images/tick.svg";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { setIsDiagnosisBox, setIsLabTestBox } from "../redux/ddxSlice";
import { useDispatch } from "react-redux";
import { useContext, useState } from "react";
import CashManagerContext from "../context/CashManagerContext";
import { useLocation } from "react-router-dom";
import { addResultImpression } from "../api/services/ApiDDx";
import TabPane from "antd/es/tabs/TabPane";

export const WarningColor = {
  extended: "rgba(194, 159, 0, 1)",
  "can't miss": "rgba(239, 125, 25, 1)",
  "most likely": "rgba(239, 25, 65, 1)",
};

export const WarningRank = {
  extended: 3,
  "can't miss": 4,
  "most likely": 5,
};

const ImpressionType = {
  extended: "extended",
  "can't miss": "cantMiss",
  "most likely": "mostLikely",
};

const formatItem = (item) => {
  return item.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const DifferentialDiagnosisDrawer = ({
  handleDDxDrawer,
  generatedDDx,
  includeExcludeInput,
}) => {
  const dispatch = useDispatch();
  const { included, excluded } = includeExcludeInput || {};
  const {
    diagnosisData,
    setDiagnosisData,
    investigationData,
    setInvestigationData,
  } = useContext(CashManagerContext);

  const { state } = useLocation();
  const { patient_data } = state;

  const [shouldShowInputWarning, setShowInputWarning] = useState(true);

  const handleLikeAndDislike = async (resultId, impression) => {
    const payload = {
      patientId: patient_data?.patient_unique_id,
      resultId: resultId,
      impression: impression,
    };
    await addResultImpression(payload);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formattedIncludedData = included?.map(formatItem);
  const formattedExcludedData = excluded?.map(formatItem);

  return (
    <div className="drawer-container">
      <div className="drawer-header">
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

        <div className="drawer-tabs">
          <Tabs defaultActiveKey="1" onChange={(key) => scrollToSection(key)}>
            <TabPane tab="Most Likely" key="mostLikely" />
            <TabPane tab="Can’t Miss " key="cantMiss" />
            <TabPane tab="Extended" key="extended" />
          </Tabs>
        </div>
      </div>

      <div
        className="drawer-scrollable-content"
        style={{ backgroundColor: "white", paddingTop: 25 }}
      >
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ padding: "0px 40px" }}
        >
          {shouldShowInputWarning && (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                borderRadius: 16,
                padding: 18,
                marginBottom: 20,
                marginTop: 10,
                backgroundColor: "#FEFBEB",
              }}
            >
              <h6
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "22px",
                  color: "#938120",
                }}
              >
                <b style={{ fontWeight: 600 }}>Note:</b>
                {" The below results are generated based on the patient’s "}
                {formattedIncludedData?.map((item, index) => (
                  <span key={index} className="warning-txt-cdss">
                    <b
                      style={{
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {item}
                    </b>
                    {index < formattedIncludedData?.length - 2 && ", "}
                    {index === formattedIncludedData?.length - 2 ? " and " : ""}
                  </span>
                ))}
                .
                {formattedExcludedData?.length > 0 ? (
                  <>
                    {" Factors like "}
                    {formattedExcludedData?.map((item, index) => (
                      <span key={index} className="warning-txt-cdss">
                        <b
                          style={{
                            fontWeight: 600,
                            textTransform: "capitalize",
                            color: "#938120",
                          }}
                        >
                          {item}
                        </b>
                        {index < formattedExcludedData?.length - 2 && ", "}
                        {index === formattedExcludedData?.length - 2
                          ? " and "
                          : ""}
                      </span>
                    ))}
                    {" are not included, as they are not available."}
                  </>
                ) : null}
              </h6>
              <Button
                type="text"
                className="btn btn-delete-prescription focus-none h-100"
                style={{ padding: 5 }}
                onClick={() => setShowInputWarning(false)}
              >
                <i
                  className="icon-Cross"
                  style={{ color: "#938120", width: 12, height: 12 }}
                />
              </Button>
            </div>
          )}
          <div className="d-flex flex-column" style={{ rowGap: 44 }}>
            {generatedDDx.map((item, index) => {
              const accordionItems = [
                {
                  key: "1",
                  label: (
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        paddingBottom: 8,
                      }}
                    >
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex">
                          <img
                            className="me-3"
                            src={diagnoses}
                            alt="diagnosis"
                          />
                          <div style={{ textTransform: "capitalize" }}>
                            {item?.differentialDiagnosisName}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex" style={{ columnGap: 2 }}>
                            {Array.from({
                              length: WarningRank[item?.likelihood] || 0,
                            }).map((_, index) => (
                              <div
                                key={index}
                                style={{
                                  width: 13,
                                  height: 4,
                                  border: `2px solid ${
                                    WarningColor[item?.likelihood]
                                  }`,
                                  borderRadius: 2,
                                }}
                              />
                            ))}
                          </div>
                          <h6
                            style={{
                              color: WarningColor[item.likelihood],
                              fontSize: 12,
                              marginBottom: 0,
                            }}
                          >
                            {item?.likelihood}
                          </h6>
                        </div>
                      </div>
                      {diagnosisData
                        ?.map((item) => item?.tds_name)
                        ?.includes(item?.differentialDiagnosisName) ? (
                        <div
                          style={{ marginRight: 40 }}
                          className="d-flex align-items-center gap-2"
                        >
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
                        <div style={{ marginRight: 40 }}>
                          <Button
                            type="primary"
                            className="btn d-flex w-100 align-items-center justify-content-center btn-41"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setIsDiagnosisBox(true));
                              diagnosisData.push({
                                tds_id: item?._id,
                                unique_id: item?._id,
                                tds_name: item?.differentialDiagnosisName,
                                pms_default: 1,
                                usage_count: 0,
                                isDDx: true,
                                since: "",
                                status: "",
                                note: "",
                              });
                              setDiagnosisData((prev) => [...prev]);
                            }}
                          >
                            Add to Rx
                          </Button>
                        </div>
                      )}
                    </div>
                  ),
                  children: (
                    <>
                      <div
                        className="evidence"
                        style={{
                          color: "rgba(29, 29, 29, 0.65)",
                          padding: "15px 0",
                        }}
                      >
                        {item?.evidence}
                      </div>
                      <div className="d-flex gap-4">
                        <div
                          className="d-flex flex-column justify-content-between gap-4 w-75"
                          style={{
                            backgroundColor: "#FAF8F6",
                            padding: "11px 15px 21px",
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
                              style={{ gap: 18 }}
                            >
                              {item?.labTests?.map((labTest) => (
                                <div
                                  key={labTest}
                                  className="d-flex align-items-center justify-content-between"
                                >
                                  <span style={{ textTransform: "capitalize" }}>
                                    {labTest}
                                  </span>
                                  {investigationData
                                    ?.map((item) => item?.investigation_name)
                                    ?.includes(labTest) ? (
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
                                    <div
                                      className="d-flex align-items-center"
                                      style={{
                                        columnGap: 8,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <div
                                        className="text-primary"
                                        style={{ fontWeight: 600 }}
                                        onClick={() => {
                                          dispatch(setIsLabTestBox(true));
                                          investigationData.push({
                                            investigation_name: labTest,
                                            hm_type: 1,
                                            pms_default: 1,
                                            isDDx: true,
                                            notes: "",
                                          });
                                          setInvestigationData((prev) => [
                                            ...prev,
                                          ]);
                                        }}
                                      >
                                        Add To Rx
                                      </div>
                                      <img src={arrow} alt="arrow" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 10, marginTop: 10 }}
                      >
                        <span>Was this result useful?</span>
                        <DislikeOutlined
                          style={{ color: "red" }}
                          className="dislike-cdss"
                          onClick={() =>
                            handleLikeAndDislike(item?._id, "dislike")
                          }
                        />
                        <LikeOutlined
                          className="like-cdss"
                          onClick={() =>
                            handleLikeAndDislike(item?._id, "like")
                          }
                        />
                      </div>
                    </>
                  ),
                },
              ];
              return (
                <div
                  key={index}
                  id={ImpressionType[item?.likelihood]}
                  className="d-flex"
                  style={{ columnGap: 24 }}
                >
                  <div
                    style={{
                      border: "2px solid rgba(34, 0, 60, 0.04)",
                      borderRadius: "4px",
                    }}
                  />
                  <div className="d-flex flex-column gap-4 w-100">
                    <Collapse
                      items={accordionItems}
                      defaultActiveKey={["1"]}
                      className="prescriptiontab-accordian ddx-drawer-collapse"
                      expandIconPosition={"end"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="disclaimer-txt"
            style={{
              fontSize: 12,
              fontWeight: 500,
              margin: "44px 40px 0px",
            }}
          >
            <b>Disclaimer</b>: These results are generated by AI and should be
            used as a guide, not the final source for patient treatment
            decisions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifferentialDiagnosisDrawer;
