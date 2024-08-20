import { Collapse, Divider } from "antd";
import React, { useEffect, useState } from "react";
import ReadMore from "../../../../common/ReadMore";
import { useSelector } from "react-redux";
import moment from "moment";
import { isPrimigravida } from "../../utils/helper";

const ObstetricList = ({ isPatientSummary = false }) => {
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const { examinationHistory } = obstetricDetails;
  const [accordionItems, setAccordionItems] = useState([]);
  const [infoAccordionItems, setInfoAccordionItems] = useState([]);

  useEffect(() => {
    const accordionItemsData = examinationHistory?.map((visitItem, i) => ({
      key: i,
      label: (
        <div className="fw-semibold">
          {`Visit ${examinationHistory.length - i}`}
        </div>
      ),
      content: (
        <div>
          <div
            className="cardbody-data mt-2 border visitItem"
            style={{ borderRadius: "8px", padding: "5px 15px" }}
          >
            <div className="my-2">
              {typeof visitItem.pallor === "boolean" ? (
                <>
                  <span>Polar : </span>
                  <label>{`${visitItem.pallor ? " Yes " : " No "}`}</label>
                  {typeof visitItem.oedema === "boolean" || visitItem.mothersBMI
                    ? " | "
                    : ""}
                </>
              ) : null}
              {typeof visitItem.oedema === "boolean" ? (
                <>
                  <span>Oedema : </span>
                  <label>{`${visitItem.oedema ? " Yes " : " No "}`}</label>
                  {visitItem.mothersBMI ? " | " : ""}
                </>
              ) : null}
              {visitItem.mothersBMI ? (
                <>
                  <span>BMI : </span>
                  <label>{visitItem.mothersBMI} kg/m2</label>
                </>
              ) : null}
            </div>
            <div className="my-2">
              {visitItem.systolic ? (
                <>
                  <span>Systolic : </span>
                  <label>{visitItem.systolic} mmHg</label>
                  {visitItem.diastolic ? " | " : ""}
                </>
              ) : null}
              {visitItem.diastolic ? (
                <>
                  <span>Diastolic : </span>
                  <label>{visitItem.diastolic} mmHg</label>
                </>
              ) : null}
            </div>
            <div className="my-2">
              {visitItem.heightOfFundus ? (
                <>
                  <span>Fundus : </span>
                  <label>
                    {visitItem.heightOfFundus}{" "}
                    {visitItem.heightOfFundusUnit ?? ""}
                  </label>
                  {visitItem.presentation ? " | " : ""}
                </>
              ) : null}
              {visitItem.presentation ? (
                <>
                  <span>Presentation : </span>
                  <label>{visitItem.presentation}</label>
                </>
              ) : null}
            </div>
            <div className="my-2">
              {visitItem.liquor ? (
                <>
                  <span>Liquor : </span>
                  <label>{visitItem.liquor}</label>
                  {visitItem.foetalHeartRate ? " | " : ""}
                </>
              ) : null}
              {visitItem.foetalHeartRate ? (
                <>
                  <span>FHR : </span>
                  <label>{visitItem.foetalHeartRate} BPM</label>
                </>
              ) : null}
            </div>
          </div>
          {visitItem?.notes?.length ? (
            <div
              className="cardbody-data mt-2 border visitItem"
              style={{ borderRadius: "8px", padding: "5px 15px" }}
            >
              <ReadMore text={visitItem.notes} textLimit={100} />
            </div>
          ) : null}
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
          {(obstetricDetails?.gravidity ||
            obstetricDetails?.parity ||
            obstetricDetails?.livingChildren ||
            obstetricDetails?.abortion ||
            obstetricDetails?.ectopicPregnancies) && (
            <div className="my-2">
              <span>GPLAE</span>{" "}
              {obstetricDetails.gravidity >= 0 && (
                <>
                  {isprimigravida ? (
                    <span>(Primigravida</span>
                  ) : (
                    <>
                      <span>(G</span> :{" "}
                      <label>{obstetricDetails.gravidity}</label>
                    </>
                  )}
                  {(obstetricDetails.parity ||
                    obstetricDetails.livingChildren ||
                    obstetricDetails.abortion ||
                    obstetricDetails.ectopicPregnancies ||
                    obstetricDetails.diagnosisNotes) &&
                    " | "}
                </>
              )}
              {!isprimigravida && obstetricDetails.parity >= 0 && (
                <>
                  <span>P</span> : <label>{obstetricDetails.parity}</label>
                  {(obstetricDetails.livingChildren ||
                    obstetricDetails.abortion ||
                    obstetricDetails.ectopicPregnancies ||
                    obstetricDetails.diagnosisNotes) &&
                    " | "}
                </>
              )}
              {!isprimigravida && obstetricDetails.livingChildren >= 0 && (
                <>
                  <span>L</span> :{" "}
                  <label>{obstetricDetails.livingChildren}</label>
                  {(obstetricDetails.abortion ||
                    obstetricDetails.ectopicPregnancies ||
                    obstetricDetails.diagnosisNotes) &&
                    " | "}
                </>
              )}
              {!isprimigravida && obstetricDetails.abortion >= 0 && (
                <>
                  <span>A</span> : <label>{obstetricDetails.abortion}</label>
                  {(obstetricDetails.ectopicPregnancies ||
                    obstetricDetails.diagnosisNotes) &&
                    " | "}
                </>
              )}
              {!isprimigravida && obstetricDetails.ectopicPregnancies >= 0 && (
                <>
                  <span>E</span> :{" "}
                  <label>{obstetricDetails.ectopicPregnancies}</label>
                  {obstetricDetails.diagnosisNotes && " | "}
                </>
              )}
              {obstetricDetails?.diagnosisNotes?.length ? (
                <>
                  <span>Notes</span> :{" "}
                  <ReadMore
                    text={obstetricDetails?.diagnosisNotes}
                    textLimit={100}
                    labelSize={14}
                    isInfo
                  />
                </>
              ) : (
                <span>)</span>
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
    <div
      className={isPatientSummary ? "" : "overflow-y-auto"}
      style={{ maxHeight: "300px", padding: "10px 10px 0px" }}
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
      {!isPatientSummary && (
        <Collapse
          defaultActiveKey={[0]}
          className="prescriptiontab-accordian history-sider-box history-sider-box-white"
          expandIconPosition={"end"}
        >
          {accordionItems?.map((item, index) => (
            <React.Fragment key={index}>
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
      )}
    </div>
  );
};

export default ObstetricList;
