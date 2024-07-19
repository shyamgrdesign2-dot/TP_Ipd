import { Collapse, Divider } from "antd";
import React, { useEffect, useState } from "react";
import ReadMore from "../../../../common/ReadMore";

const ObstetricList = ({ examinationHistory }) => {
  const [accordionItems, setAccordionItems] = useState([]);

  useEffect(() => {
    const data = examinationHistory?.map((visitItem, i) => ({
      key: `${i}`,
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
              <span>Polar</span> :{" "}
              <label>{visitItem.pallor ? "Yes" : "No"}</label>
              {" | "}
              <span>Oedema</span> :{" "}
              <label>{visitItem.oedma ? "Yes" : "No"}</label> {" | "}
              <span>BMI</span>: <label>{visitItem.mothersBMI} kg/m2</label>
            </div>
            <div className="my-2">
              <span>Systolic</span> : <label>{visitItem.systolic} mmHg</label>{" "}
              {" | "}
              <span>Diastolic</span> : <label>{visitItem.diastolic} mmHg</label>
            </div>
            <div className="my-2">
              <span>Fundus</span> : <label>{visitItem.heightOfFundus} cm</label>
              {" | "}
              <span>Presentation</span> :{" "}
              <label>{visitItem.presentation}</label>
            </div>
            <div className="my-2">
              <span>Fluid index</span> :{" "}
              <label>{visitItem.fluidIndex} cm</label>
              {" | "}
              <span>FHR</span> : <label>{visitItem.foetalHeartRate} bpm</label>
            </div>
          </div>
          <div
            className="cardbody-data mt-2 border visitItem"
            style={{ borderRadius: "8px", padding: "5px 15px" }}
          >
            <ReadMore text={visitItem.notes} textLimit={100} />
          </div>
        </div>
      ),
    }));

    setAccordionItems(data);
  }, [examinationHistory]);

  return (
    <div
      className="overflow-y-auto"
      style={{ maxHeight: "661px", padding: "10px 10px 0px" }}
    >
      <Collapse
        defaultActiveKey={["0"]}
        className="prescriptiontab-accordian history-sider-box history-sider-box-white"
        expandIconPosition={"end"}
      >
        {accordionItems.map((item, index) => (
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
  );
};

export default ObstetricList;
