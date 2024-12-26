import { ImmunisationColumns } from "../../utils/constants";
import "./../pregnancyHistory/PregnancyHistory.scss";
import "./../examination/Examination.scss";
import moment from "moment";
import { DatePicker, Input, Select, Switch } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const immunisationHistoryMock = [
  {
    vaccineName: "Pneumococcal",
    status: "Given",
    givenDate: "1/1/2022",
    remarks: "Remarks",
    printInRx: true,
  },
  {
    vaccineName: "Pneumococcal",
    status: "Due",
    givenDate: "1/1/2022",
    remarks: "Remarks",
    printInRx: false,
  },
  {
    vaccineName: "Pneumococcal",
    status: "",
    givenDate: "1/1/2022",
    remarks: "Remarks",
    printInRx: true,
  },
];

const ImmunisationHistory = () => {
  const [immunisationHistory, setImmunisationHistory] = useState(
    immunisationHistoryMock
  );
  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {ImmunisationColumns?.map((header, index) => (
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
      setImmunisationHistory((prev) => {
        [...prev][index][key] = value;
        return [...prev];
      });
    };

    return immunisationHistory.map((item, i) => {
      const { vaccineName, status, givenDate, remarks, printInRx } = item;
      return (
        <tr key={i}>
          <td className="obstetricTcell">{vaccineName}</td>
          <td className="obstetricTcell">
            <Select
              style={{ width: 136, height: 41 }}
              onChange={(value) => handleImmunisationChange("status", i, value)}
              options={[
                { value: "due", label: "Due" },
                { value: "given", label: "Given" },
              ]}
              placeholder="Select"
              className={`custom-immunisation-select ${
                status === "Given" ? "custom-immunisation-given-select" : ""
              }`}
              value={status || "due"}
              allowClear
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
              value={givenDate ? dayjs(moment(givenDate)) : ""}
              style={{ width: "136px", height: "41px" }}
              format={{
                format: "DD-MM-YYYY",
                type: "mask",
              }}
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

export default ImmunisationHistory;
