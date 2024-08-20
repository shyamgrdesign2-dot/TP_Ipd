import React, { useState, useEffect } from "react";
import { Button, Collapse, Divider } from "antd";
import ReadMore from "../../../../common/ReadMore";
import "./ObstetricList.scss";
import { useSelector } from "react-redux";
import { obstetricTabListColumns } from "../../utils/constants";
import { isPrimigravida } from "../../utils/helper";
import moment from "moment";

const TabObstetricList = ({ handleCollapsed, handleDrawerObstetric }) => {
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const { examinationHistory = [] } = obstetricDetails;
  const [accordionItems, setAccordionItems] = useState([]);
  const [infoAccordionItems, setInfoAccordionItems] = useState([]);

  const measurementDetails = (obsVisit) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", rowGap: "16px" }}>
        {obstetricTabListColumns.map((visitItem, index) => {
          let value =
            typeof obsVisit[visitItem.key] === "boolean"
              ? obsVisit[visitItem.key]
                ? "Yes"
                : "No"
              : obsVisit[visitItem.key];
          if (value) {
            value +=
              visitItem.key === "heightOfFundus"
                ? " " + obsVisit.heightOfFundusUnit ?? ""
                : visitItem.siUnit;
            return (
              <React.Fragment key={index}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                    flexDirection: visitItem.key === "notes" ? "column" : "",
                  }}
                >
                  <span className="key">{visitItem.title}</span>
                  <span style={{ position: "absolute", left: "49%" }}>
                    {visitItem.key !== "notes" ? ":" : ""}
                  </span>

                  {visitItem.key === "notes" ? (
                    <div
                      className="cardbody-data mt-2 border visitItem"
                      style={{
                        borderRadius: "8px",
                        padding: "5px 15px",
                      }}
                    >
                      <ReadMore text={value} textLimit={60} textSize={12} />
                    </div>
                  ) : (
                    <span style={{ fontWeight: "400" }}>{value}</span>
                  )}
                </div>
              </React.Fragment>
            );
          }
        })}
      </div>
    );
  };

  useEffect(() => {
    const accordionItemsData = examinationHistory?.map((obsVisit, i) => ({
      key: i,
      label: (
        <div className="fw-semibold obstetricAccordianTitle">
          {`Visit ${examinationHistory.length - i}`}
        </div>
      ),
      content: (
        <div
          className="cardbody-data mt-3"
          style={{
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            background: "#FAFAFB",
            paddingBottom: "0px",
          }}
        >
          {measurementDetails(obsVisit)}
        </div>
      ),
    }));

    const { gravidity, livingChildren, parity, abortion, ectopicPregnancies } =
      obstetricDetails || {};
    const isprimigravida = isPrimigravida([
      { key: "gravidity", value: gravidity },
      { key: "livingChildren", value: livingChildren },
      { key: "parity", value: parity },
      { key: "abortion", value: abortion },
      { key: "ectopicPregnancies", value: ectopicPregnancies },
    ]);
    const data = [];
    const updateData = {
      key: `${1}`,
      content: (
        <div className="cardbody-data border rounded px-2 my-2">
          <div className="my-2">
            {(obstetricDetails.lmp || obstetricDetails.edd) && (
              <>
                <span>Patient Info:</span>{" "}
                {obstetricDetails.lmp && (
                  <>
                    <span>LMP</span> :{" "}
                    <label>
                      {moment(obstetricDetails.lmp).format("DD MMM YYYY")}
                    </label>{" "}
                  </>
                )}
                {obstetricDetails.lmp && obstetricDetails.edd && " | "}
                {obstetricDetails.edd && (
                  <>
                    <span>EDD</span> :{" "}
                    <label>
                      {moment(obstetricDetails.edd).format("DD MMM YYYY")}
                    </label>{" "}
                  </>
                )}
              </>
            )}
          </div>
          {((obstetricDetails?.gravidity != null &&
            obstetricDetails?.gravidity >= 0) ||
            (obstetricDetails?.parity != null &&
              obstetricDetails?.parity >= 0) ||
            (obstetricDetails?.livingChildren != null &&
              obstetricDetails?.livingChildren >= 0) ||
            (obstetricDetails?.abortion != null &&
              obstetricDetails?.abortion >= 0) ||
            (obstetricDetails?.ectopicPregnancies != null &&
              obstetricDetails?.ectopicPregnancies >= 0) ||
            obstetricDetails.diagnosisNotes?.length > 0) && (
            <div className="my-2 d-flex align-items-center flex-wrap">
              {((obstetricDetails?.gravidity != null &&
                obstetricDetails?.gravidity >= 0) ||
                (obstetricDetails?.parity != null &&
                  obstetricDetails?.parity >= 0) ||
                (obstetricDetails?.livingChildren != null &&
                  obstetricDetails?.livingChildren >= 0) ||
                (obstetricDetails?.abortion != null &&
                  obstetricDetails?.abortion >= 0) ||
                (obstetricDetails?.ectopicPregnancies != null &&
                  obstetricDetails?.ectopicPregnancies >= 0)) && (
                <>
                  <span style={{ marginRight: 5 }}>GPLAE (</span>
                </>
              )}
              {obstetricDetails.gravidity != null &&
                obstetricDetails.gravidity >= 0 && (
                  <>
                    {isprimigravida ? (
                      <span style={{ marginRight: 5 }}>Primigravida</span>
                    ) : (
                      <div style={{ marginRight: 5 }}>
                        <span>G</span> :{" "}
                        <label>{obstetricDetails.gravidity}</label>
                      </div>
                    )}
                    {(obstetricDetails.parity ||
                      obstetricDetails.livingChildren ||
                      obstetricDetails.abortion ||
                      obstetricDetails.ectopicPregnancies ||
                      obstetricDetails.diagnosisNotes) &&
                      " | "}
                  </>
                )}
              {!isprimigravida &&
                obstetricDetails.parity != null &&
                obstetricDetails.parity >= 0 && (
                  <div className="mx-1">
                    <span>P</span> : <label>{obstetricDetails.parity}</label>
                    {(obstetricDetails.livingChildren ||
                      obstetricDetails.abortion ||
                      obstetricDetails.ectopicPregnancies ||
                      obstetricDetails.diagnosisNotes) &&
                      " | "}
                  </div>
                )}
              {!isprimigravida &&
                obstetricDetails.livingChildren != null &&
                obstetricDetails.livingChildren >= 0 && (
                  <div className="mx-1">
                    <span>L</span> :{" "}
                    <label>{obstetricDetails.livingChildren}</label>
                    {(obstetricDetails.abortion ||
                      obstetricDetails.ectopicPregnancies ||
                      obstetricDetails.diagnosisNotes) &&
                      " | "}
                  </div>
                )}
              {!isprimigravida &&
                obstetricDetails.abortion != null &&
                obstetricDetails.abortion >= 0 && (
                  <div className="mx-1">
                    <span>A</span> : <label>{obstetricDetails.abortion}</label>
                    {(obstetricDetails.ectopicPregnancies ||
                      obstetricDetails.diagnosisNotes) &&
                      " | "}
                  </div>
                )}
              {!isprimigravida &&
                obstetricDetails.ectopicPregnancies != null &&
                obstetricDetails.ectopicPregnancies >= 0 && (
                  <div className="mx-1">
                    <span>E</span> :{" "}
                    <label>{obstetricDetails.ectopicPregnancies}</label>
                    {obstetricDetails.diagnosisNotes && " | "}
                  </div>
                )}
              {obstetricDetails?.diagnosisNotes?.length ? (
                <>
                  <span className="mx-1">Notes :</span>{" "}
                  <ReadMore
                    text={obstetricDetails?.diagnosisNotes}
                    textLimit={100}
                    labelSize={14}
                    isInfo={
                      (obstetricDetails?.gravidity != null &&
                        obstetricDetails?.gravidity >= 0) ||
                      (obstetricDetails?.parity != null &&
                        obstetricDetails?.parity >= 0) ||
                      (obstetricDetails?.livingChildren != null &&
                        obstetricDetails?.livingChildren >= 0) ||
                      (obstetricDetails?.abortion != null &&
                        obstetricDetails?.abortion >= 0) ||
                      (obstetricDetails?.ectopicPregnancies != null &&
                        obstetricDetails?.ectopicPregnancies >= 0)
                    }
                  />
                </>
              ) : (
                (obstetricDetails?.gravidity ||
                  obstetricDetails?.parity ||
                  obstetricDetails?.livingChildren ||
                  obstetricDetails?.abortion ||
                  obstetricDetails?.ectopicPregnancies) && <span>)</span>
              )}
            </div>
          )}
        </div>
      ),
    };

    data.push(updateData);
    setInfoAccordionItems(data);

    setAccordionItems(accordionItemsData);
  }, [examinationHistory]);

  return (
    <>
      <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
        Obstetric History
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
            className="btn btn-input d-flex w-100 align-items-center btn-41"
            onClick={handleDrawerObstetric}
          >
            <i className="icon-Add me-2 fs-21"></i>
            Add or Edit History
          </Button>
          <div
            className="border rounded-3 bg-body mt-3"
            style={{ padding: "16px" }}
          >
            {infoAccordionItems?.map((item, index) => (
              <React.Fragment key={index}>
                {item.content}
                {index < infoAccordionItems?.length - 1 && (
                  <Divider
                    dashed
                    style={{
                      borderTop: "1px dotted #D0D5DD",
                      margin: "6px 0",
                      width: "100%",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
            <Collapse
              defaultActiveKey={[0]}
              className="prescriptiontab-accordian history-sider-box history-sider-box-white obstetricAccordian"
              expandIconPosition={"end"}
            >
              {accordionItems?.map((item, index) => (
                <React.Fragment key={item.key}>
                  <Collapse.Panel header={item.label} key={item.key}>
                    {item.content}
                  </Collapse.Panel>
                  {index < accordionItems.length - 1 && (
                    <Divider
                      dashed
                      style={{
                        borderTop: "1px dotted #D0D5DD",
                        margin: "6px 0",
                        width: "100%",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Collapse>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabObstetricList;
