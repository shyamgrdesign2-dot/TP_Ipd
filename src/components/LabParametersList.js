import { useEffect, useState } from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import axios from 'axios';
import { env } from "../EnvironmentConfig";

const LabParametersList = ({labParamsData}) => {

  const transformData = (data) => {
    const result = {};

    data?.forEach((entry) => {
      entry.inputs?.forEach(({ testName, value, arrowDirection, units }) => {
        if (!result[testName]) {
          result[testName] = [];
        }
        result[testName].push({ date: entry.date, value, arrowDirection, units });
      });
    });

    return result;
  };

  const groupedData = transformData(labParamsData);
  // const labParamsName = Object.keys(groupedData);

  const renderTableHeader = () => {
    // Sort labParamsData by date (descending) and take the first two dates
    const recentLabParamsData = labParamsData?.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2);
  
    return (
      <tr>
        <th
          className="obstetricTcell"
          style={{
            width: "50%", // Adjust width if needed
            fontWeight: 600,
            borderTop: "1px solid white",
          }}
        >
          NAME
        </th>
        {recentLabParamsData?.map((entry, index) => (
          <th
            key={index}
            className="obstetricTcell"
            style={{
              width: "25%", // Adjust width if needed
              fontWeight: 600,
              paddingRight: "18px",
              borderTop: "1px solid white",
              borderRight: index === recentLabParamsData.length - 1 ? "1px solid white" : "none",
            }}
            
          >
            {dayjs(entry?.date).format("DD MMM, YY")}
          </th>
        ))}
      </tr>
    );
  };
  
  const renderTableData = () => {
    // Limit data to the two most recent entries
    const recentLabParamsData = labParamsData?.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2);
  
    return (
      <>
        {Object.keys(groupedData)?.map((item, index) => (
          <tr key={index} className="column-border">
            {/* First column for the item name and unit */}
            <td className="labParamsTcell" style={{ width: "50%", fontWeight: 500,}}>
              {groupedData?.[item]?.[0]?.units 
                ? `${item} (${groupedData[item][0].units})` 
                : item}
            </td>

            {/* Render values for the two most recent dates */}
            {recentLabParamsData?.map((entry, dataIndex) => {
              const dataForDate = groupedData[item]?.find(
                (data) => data.date === entry.date
              );
              return (
                <td
                  key={dataIndex}
                  style={{ width: "25%",color: "#454551 !important" }}
                  className={`labParamsTcell ${
                    dataForDate?.arrowDirection === "up" ||
                    dataForDate?.arrowDirection === "down"
                      ? "lab-params-warning"
                      : ""
                  } ${item === "Remarks" ? "remarks-style" : ""}`}
                >
                  {/* Render value or '--' if undefined */}
                  {dataForDate?.value || "--"}

                  {/* Conditionally render arrow icons based on arrowDirection */}
                  {dataForDate?.arrowDirection === "up" ? (
                    <ArrowUpOutlined
                      className="lab-params-warning"
                      style={{ paddingLeft: 5 }}
                    />
                  ) : dataForDate?.arrowDirection === "down" ? (
                    <ArrowDownOutlined
                      className="lab-params-warning"
                      style={{ paddingLeft: 5 }}
                    />
                  ) : null}
                </td>
              );
            })}
          </tr>
        ))}
      </>
    );
  };

  return (
    <div>
      {labParamsData?.length > 0 && (
        <>
          <div style={{ overflow: "hidden", marginRight:"5px"}}>
            <table
              className="tableView"
              style={{
                tableLayout: "fixed",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>{renderTableHeader()}</thead>
            </table>
          </div>
  
          {/* Scrollable tbody */}
          <div
            style={{
              maxHeight: "200px", // Adjust this height as needed
              overflowY: "scroll",
            }}
          >
            <table
              className="tableView"
              style={{
                tableLayout: "fixed",
                width: "100%",
              }}
            >
              <tbody>{renderTableData()}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LabParametersList;
