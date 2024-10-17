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
        // Skip testNames like "Remarks"
        if (testName !== "Remarks") {
          if (!result[testName]) {
            result[testName] = [];
          }
          // Push all entries including duplicates
          result[testName].push({ date: entry.date, value, arrowDirection, units });
        }
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
            {dayjs(entry?.date).format("DD MMM, YYYY")}
          </th>
        ))}
      </tr>
    );
  };
  
  const renderTableData = () => {
    // Limit data to the two most recent entries (based on date)
    const recentLabParamsData = labParamsData
      ?.sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);
  
    // Flatten groupedData to create a list of all test entries, with duplicates
    const flattenedData = [];
  
    Object.keys(groupedData)?.forEach((testName) => {
      groupedData[testName]?.forEach((entry) => {
        flattenedData.push({ testName, ...entry });
      });
    });
  
    return (
      <>
        {flattenedData?.map((entry, index) => (
          <tr key={index} className="column-border">
            {/* First column for the test name and unit */}
            <td className="labParamsTcell" style={{ width: "50%", fontWeight: 500 }}>
              {entry.units ? `${entry.testName} (${entry.units})` : entry.testName}
            </td>
  
            {/* Render values for the two most recent dates */}
            {recentLabParamsData?.map((dateEntry, dataIndex) => {
              // Find the matching entry for the current date
              const dataForDate = entry.date === dateEntry.date ? entry : null;
  
              return (
                <td
                  key={dataIndex}
                  style={{ width: "25%", color: "#454551 !important" }}
                  className={`labParamsTcell ${
                    dataForDate?.arrowDirection !== ""
                      ? "lab-params-warning"
                      : ""
                  }`}
                >
                  {/* Render the value or '--' if undefined */}
                  {dataForDate ? (
                    <>
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
                    </>
                  ) : (
                    "--"
                  )}
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
