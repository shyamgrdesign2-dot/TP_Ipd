import { Button, DatePicker, Input, Select, Switch } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useState } from "react";
import { AncSchedulerColumns } from "../../utils/constants";
import { splitByTrimester } from "../../utils/helper";

const AncSchedulerMock = [
  {
    testName: "Pneumococcal",
    weekStart: 1,
    weekEnd: 12,
    dueDate: "1/1/2022",
    status: "Completed",
    remarks: "Remarks",
    printInRx: true,
    isDefault: true,
  },
  {
    testName: "Anomaly Scan - Target Scan",
    weekStart: 4,
    weekEnd: 12,
    dueDate: "1/1/2022",
    status: "Completed",
    remarks: "Remarks",
    printInRx: true,
    isDefault: true,
  },
  {
    testName: "Pneumococcal",
    weekStart: 10,
    weekEnd: 24,
    dueDate: "1/1/2022",
    status: "Completed",
    remarks: "Remarks",
    printInRx: true,
    isDefault: true,
  },
  {
    testName: "Pneumococcal",
    weekStart: 13,
    weekEnd: 27,
    dueDate: "1/1/2022",
    status: "Completed",
    remarks: "Remarks",
    printInRx: false,
  },
  {
    testName: "Pneumococcal",
    weekStart: 28,
    weekEnd: 32,
    dueDate: "1/1/2022",
    status: "Due",
    remarks: "Remarks",
    printInRx: true,
  },
];

const AncScheduler = () => {
  const [AncSchedulerData, setAncSchedulerData] = useState(
    splitByTrimester(AncSchedulerMock)
  );
  const [activeCategory, setActiveCategory] = useState(0);

  const trimesterList = [
    "First Trimester",
    "Second Trimester",
    "Third Trimester",
  ];

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {AncSchedulerColumns?.map((header, index) => (
          <th
            key={index}
            className="obstetricTcell theaderCellStyle"
            style={{
              width: header.width,
              fontWeight: 600,
            }}
          >
            {header.title}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableData = () => {
    const handleImmunisationChange = (key, index, value) => {
      setAncSchedulerData((prev) => {
        [...prev][index][key] = value;
        return [...prev];
      });
    };

    return AncSchedulerData?.[activeCategory]?.map((item, i) => {
      const {
        testName,
        weekStart,
        weekEnd,
        status,
        dueDate,
        remarks,
        printInRx,
      } = item;
      return (
        <tr key={i}>
          <td className="obstetricTcell">{testName}</td>
          <td className="obstetricTcell weekRange">
            {`${weekStart} - ${weekEnd} weeks`}
            <i
              className="icon-Edit fs-6 d-flex justify-content-end"
              style={{ cursor: "pointer" }}
            />
          </td>
          <td className="obstetricTcell">
            <DatePicker
              key={"date"}
              onChange={(date) => {
                const formattedDate = date?.format("YYYY-MM-DD");
                handleImmunisationChange("givenDate", i, formattedDate);
              }}
              disabledDate={disabledDate}
              value={dueDate ? dayjs(moment(dueDate)) : ""}
              style={{ width: "136px", height: "41px" }}
              format={{
                format: "DD-MM-YYYY",
                type: "mask",
              }}
            />
          </td>
          <td className="obstetricTcell">
            <Select
              style={{ width: 136, height: 41 }}
              onChange={(value) => handleImmunisationChange("status", i, value)}
              options={[
                { value: "due", label: "Due" },
                { value: "completed", label: "Completed" },
              ]}
              placeholder="Select"
              className={`custom-immunisation-select ${
                status === "Completed" ? "custom-immunisation-given-select" : ""
              }`}
              value={status || "due"}
              allowClear
            />
          </td>

          <td className="obstetricTcell">
            <Input.TextArea
              placeholder="Notes"
              value={remarks}
              onChange={(e) =>
                handleImmunisationChange("remarks", i, e.target.value)
              }
              className="textareaPlaceholder immunisationRemarks"
              styles={{ border: "none" }}
            />
          </td>
          <td className="obstetricTcell">
            <Switch
              checked={printInRx}
              onChange={() =>
                handleImmunisationChange("printInRx", i, !printInRx)
              }
            />
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div
        className="d-flex justify-content-between"
        style={{ padding: "5px 40px" }}
      >
        <div className="medical-records d-flex" style={{ gap: 16 }}>
          {trimesterList.map((item, index) => (
            <Button
              type="text"
              key={index}
              className={`btnStyle btn px-5-16 fs-14 category-btn ${
                index === activeCategory ? "active-category-btn" : ""
              }`}
              onClick={() => setActiveCategory(index)}
              style={{ height: 42 }}
            >
              <span
                className={`btnText category-label ${
                  index === activeCategory ? "active-category-label" : ""
                }`}
              >
                {item}
              </span>
            </Button>
          ))}
        </div>
        <div>
          <Button
            type="button"
            className="btn-41 btn ant-btn-text btn-input anotherVisitBtn d-flex align-items-center"
          >
            <i className="icon-Print me-2" />
            <span>Print ANC Scheduler</span>
          </Button>
        </div>
      </div>
      <div className="examinationTableViewContainer">
        <div className="tableWrappwer">
          <table
            className="tableView"
            style={{
              tableLayout: "fixed",
              overflow: "hidden",
            }}
          >
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AncScheduler;
