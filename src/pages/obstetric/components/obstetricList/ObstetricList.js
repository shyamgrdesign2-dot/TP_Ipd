import { Collapse, Divider } from "antd";
import React, { useEffect, useState } from "react";
import ReadMore from "../../../../common/ReadMore";
import { useSelector } from "react-redux";

const ObstetricList = () => {
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const { examinationHistory } = obstetricDetails;
  const [accordionItems, setAccordionItems] = useState([]);

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
                  {visitItem.oedema || visitItem.mothersBMI ? " | " : ""}
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
                  <label>{visitItem.heightOfFundus} cm</label>
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
              {visitItem.fluidIndex ? (
                <>
                  <span>Fluid index : </span>
                  <label>{visitItem.fluidIndex} cm</label>
                  {visitItem.foetalHeartRate ? " | " : ""}
                </>
              ) : null}
              {visitItem.foetalHeartRate ? (
                <>
                  <span>FHR : </span>
                  <label>{visitItem.foetalHeartRate} bpm</label>
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

    setAccordionItems(accordionItemsData);
  }, [examinationHistory]);

  return (
    <div
      className="overflow-y-auto"
      style={{ maxHeight: "661px", padding: "10px 10px 0px" }}
    >
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
    </div>
  );
};

export default ObstetricList;
