import { useState } from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const mockData = [
  {
    date: "2024-09-23",
    inputs: [
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Red blood cell count",
        value: "98.4",
        arrowDirection: "",
        unit: "Cells/L",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Hemoglobin",
        value: "98.4",
        arrowDirection: "",
        unit: "dl",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Platelet Count",
        value: "95",
        arrowDirection: "down",
        unit: "cmm",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Remarks",
        value: "some random string is input here",
        arrowDirection: "down",
        unit: "cmm",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85093",
        reportName: "Spot Urine Sodium",
        name: "Remarks",
        value: "some random string is input here",
        arrowDirection: "down",
        unit: "cmm",
      },
    ],
  },
  {
    date: "2024-09-24",
    inputs: [
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Red blood cell count",
        value: "98.4",
        arrowDirection: "down",
        unit: "Cells/L",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85090",
        reportName: "CBC",
        name: "Platelet Count",
        value: "95",
        arrowDirection: "up",
        unit: "cmm",
      },
      {
        labParametersMasterId: "66fb8f280f04df59a9d85093",
        reportName: "Spot Urine Sodium",
        name: "Remarks",
        value: "some random string is input here",
        arrowDirection: "down",
        unit: "cmm",
      },
    ],
  },
];

const LabParametersList = () => {
  const [labParamsData, setLabParamsData] = useState(mockData?.slice(0, 2));

  const transformData = (data) => {
    const result = {};

    data.forEach((entry) => {
      entry.inputs.forEach(({ name, value, arrowDirection, unit }) => {
        if (!result[name]) {
          result[name] = [];
        }
        result[name].push({ value, arrowDirection, unit });
      });
    });

    return result;
  };

  const groupedData = transformData(labParamsData);
  const labParamsName = Object.keys(groupedData);

  const renderTableHeader = () => {
    return (
      <tr>
        <th
          className="obstetricTcell"
          style={{
            width: 30,
            fontWeight: 600,
          }}
        >
          NAME
        </th>
        <th
          className="obstetricTcell"
          style={{
            width: 30,
            fontWeight: 600,
          }}
        >
          {dayjs(labParamsData?.[0]?.date).format("DD MMM, YY")}
        </th>
        <th
          className="obstetricTcell"
          style={{
            width: 30,
            fontWeight: 600,
          }}
        >
          {dayjs(labParamsData?.[1]?.date).format("DD MMM, YY")}
        </th>
      </tr>
    );
  };

  const renderTableData = () => {
    return labParamsName.map((item, index) => {
      return (
        <tr key={index}>
          <td className="obstetricTcell">{`${item} (${groupedData?.[item]?.[0]?.unit})`}</td>
          <td
            className={`obstetricTcell ${
              groupedData?.[item]?.[0]?.arrowDirection === "up" ||
              groupedData?.[item]?.[0]?.arrowDirection === "down"
                ? "lab-params-warning"
                : ""
            } ${item === "Remarks" ? "remarks-style" : ""}`}
          >
            {groupedData?.[item]?.[0]?.value || "--"}
            {groupedData?.[item]?.[0]?.arrowDirection === "up" ? (
              <ArrowUpOutlined
                className="lab-params-warning"
                style={{ paddingLeft: 5 }}
              />
            ) : groupedData?.[item]?.[0]?.arrowDirection === "down" ? (
              <ArrowDownOutlined
                className="lab-params-warning"
                style={{ paddingLeft: 5 }}
              />
            ) : null}
          </td>
          <td
            className={`obstetricTcell ${
              groupedData?.[item]?.[1]?.arrowDirection === "up" ||
              groupedData?.[item]?.[1]?.arrowDirection === "down"
                ? "lab-params-warning"
                : ""
            } ${item === "Remarks" ? "remarks-style" : ""}`}
          >
            {groupedData?.[item]?.[1]?.value || "--"}
            {groupedData?.[item]?.[0]?.arrowDirection === "up" ? (
              <ArrowUpOutlined
                className="lab-params-warning"
                style={{ paddingLeft: 5 }}
              />
            ) : groupedData?.[item]?.[0]?.arrowDirection === "down" ? (
              <ArrowDownOutlined
                className="lab-params-warning"
                style={{ paddingLeft: 5 }}
              />
            ) : null}
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
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
  );
};

export default LabParametersList;
