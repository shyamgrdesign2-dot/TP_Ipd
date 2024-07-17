import React, { useState, useEffect } from "react";
import { Button, Collapse, Divider } from "antd";
import ReadMore from "../../../../common/ReadMore";

const TabObstetricList = ({
  obsVisitData,
  handleCollapsed,
  handleDrawerObstetric,
}) => {
  const [accordionItems, setAccordionItems] = useState([]);

  const measurementDetails = (obsVisit) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
        {Object.entries(obsVisit).map(([key, value]) => (
          <React.Fragment key={key}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <span>{key}</span>
              <span style={{ position: "absolute", left: "52%" }}>
                {key !== "Notes" ? ":" : ""}
              </span>
              <span style={{ fontWeight: "400" }}>{value}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const data = obsVisitData?.map((obsVisit, i) => ({
      key: `${i + 1}`,
      label: (
        <div className="fw-semibold" style={{ background: "#FAFAFB " }}>
          {`Visit ${i + 1}`}
        </div>
      ),
      content: (
        <div style={{ background: "#FAFAFB" }}>
          <div
            className="cardbody-data mt-2"
            style={{
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {measurementDetails(obsVisit)}
          </div>
          <div
            className="cardbody-data mt-2 border visitItem"
            style={{
              borderRadius: "8px",
              padding: "5px 15px",
            }}
          >
            <ReadMore
              text={`TatvaCare is a digital system that empowers both  and individuals with chronic conditions to create
              healthy habits leading to positive health outcomes.`}
              textLimit={60}
              textSize={12}
            />
          </div>
        </div>
      ),
    }));

    setAccordionItems(data);
  }, [obsVisitData]);

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
        </div>
      </div>
    </>
  );
};

export default TabObstetricList;
