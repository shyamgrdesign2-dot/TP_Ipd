import { Collapse, Divider } from "antd";
import React, { useEffect, useState } from "react";
import ReadMore from "../../../../common/ReadMore";

const ObstetricList = ({ obsVisitData }) => {
  const [accordionItems, setAccordionItems] = useState([]);

  useEffect(() => {
    const data = obsVisitData?.map((e, i) => ({
      key: `${i + 1}`,
      label: <div className="fw-semibold">{e?.title}</div>,
      content: (
        <div>
          <div
            className="cardbody-data mt-2 border visitItem"
            style={{ borderRadius: "8px", padding: "5px 15px" }}
          >
            <div className="my-2">
              <span>Polar</span> : <label>Yes</label>
              {" | "}
              <span>Oedema</span> : <label>No</label> {" | "}
              <span>BMI</span>: <label>22.2kg/2</label>
            </div>
            <div className="my-2">
              <span>Systolic</span> : <label>120mmHg</label> {" | "}
              <span>Diastolic</span> : <label>120mmHg</label>
            </div>
            <div className="my-2">
              <span>Fundus</span> : <label>80 cm</label>
              {" | "}
              <span>Presentation</span> : <label>Breech</label>
            </div>
            <div className="my-2">
              <span>Fluid index</span> : <label>23 cm</label>
              {" | "}
              <span>FHR</span> : <label>120 bpm</label>
            </div>
          </div>
          <div
            className="cardbody-data mt-2 border visitItem"
            style={{ borderRadius: "8px", padding: "5px 15px" }}
          >
            <ReadMore
              text={`TatvaCare is a digital system that empowers both  and individuals with chronic conditions to create
              healthy habits leading to positive health outcomes.`}
              textLimit={100}
            />
          </div>
        </div>
      ),
    }));

    setAccordionItems(data);
  }, [obsVisitData]);

  return (
    <div
      className="overflow-y-auto"
      style={{ maxHeight: "661px", padding: "10px 10px 0px" }}
    >
      <Collapse
        defaultActiveKey={["1"]}
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
