import { useEffect, useState } from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import axios from 'axios';
import { env } from "../EnvironmentConfig";

// Add custom parse format plugin
dayjs.extend(customParseFormat);

const ZydusLabParametersList = ({ labParamsData }) => {
  const transformData = (data) => {
    const result = {};

    data?.forEach((entry) => {
      entry.inputs?.forEach((input) => {
        const serviceName = input.serviceName;
        
        if (input.labResultParameters && input.labResultParameters.length > 0) {
          // Handle services with parameters
          input.labResultParameters.forEach(param => {
            const key = `${serviceName}_${param.parameterName}`;
            if (!result[key]) {
              result[key] = {
                serviceName,
                parameterName: param.parameterName,
                values: []
              };
            }
            result[key].values.push({
              date: entry.date,
              value: param.resultValue,
              referenceRange: param.referenceRange,
              sampleId: input.sampleId,
              certifiedDate: input.certifiedDate,
              labResultId: input.labResultId,
              labResultParameterId: param.labResultParameterId
            });
          });
        } else {
          // Handle services without parameters
          if (!result[serviceName]) {
            result[serviceName] = {
              serviceName,
              values: []
            };
          }
          result[serviceName].values.push({
            date: entry.date,
            value: input.resultvalue,
            referenceRange: input.referenceRange,
            sampleId: input.sampleId,
            certifiedDate: input.certifiedDate,
            labResultId: input.labResultId
          });
        }
      });
    });

    return result;
  };

  const groupedData = transformData(labParamsData);

  const renderTableHeader = () => {
    // Sort labParamsData by date (descending) and take the first two dates
    const recentLabParamsData = labParamsData?.sort((a, b) => {
      const dateA = dayjs(a.date, "DD-MM-YYYY");
      const dateB = dayjs(b.date, "DD-MM-YYYY");
      return dateB.valueOf() - dateA.valueOf();
    }).slice(0, 2);

    return (
      <tr>
        <th
          className="obstetricTcell"
          style={{
            width: "50%",
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
              width: "25%",
              fontWeight: 600,
              paddingRight: "18px",
              borderTop: "1px solid white",
              borderRight: index === recentLabParamsData.length - 1 ? "1px solid white" : "none",
            }}
          >
            {dayjs(entry?.date, "DD-MM-YYYY").format("DD MMM, YYYY")}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableData = () => {
    const recentLabParamsData = labParamsData
      ?.sort((a, b) => {
        const dateA = dayjs(a.date, "DD-MM-YYYY");
        const dateB = dayjs(b.date, "DD-MM-YYYY");
        return dateB.valueOf() - dateA.valueOf();
      })
      .slice(0, 2);

    return (
      <>
        {Object.keys(groupedData)?.map((key, index) => {
          const data = groupedData[key];
          const displayName = data.parameterName || data.serviceName;

          return (
            <tr 
              key={index} 
              className="column-border"
              style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
                borderBottom: '1px solid #e8e8e8'
              }}
            >
              <td 
                className="labParamsTcell" 
                style={{ 
                  width: "50%", 
                  fontWeight: 500,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  padding: "24px 8px",
                  borderRight: "1px solid #e8e8e8",
                  height: "60px",
                  verticalAlign: "middle"
                }}
              >
                {displayName}
              </td>

              {recentLabParamsData?.map((dateEntry, dataIndex) => {
                const dataForDate = data.values.find(
                  (entry) => entry.date === dateEntry.date
                );

                return (
                  <td
                    key={dataIndex}
                    style={{ 
                      width: "25%", 
                      color: "#454551 !important",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      padding: "24px 8px",
                      borderRight: dataIndex === recentLabParamsData.length - 1 ? "1px solid #e8e8e8" : "none",
                      height: "60px",
                      verticalAlign: "middle"
                    }}
                    className="labParamsTcell"
                  >
                    {dataForDate ? dataForDate.value || "--" : "--"}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <div>
      {labParamsData?.length > 0 && (
        <>
          <div style={{ overflow: "hidden", marginRight: "5px" }}>
            <table
              className="tableView"
              style={{
                tableLayout: "fixed",
                width: "100%",
                borderCollapse: "collapse",
                wordBreak: "break-word",
                border: "1px solid #e8e8e8"
              }}
            >
              <thead>{renderTableHeader()}</thead>
            </table>
          </div>

          <div
            style={{
              maxHeight: "200px",
              overflowY: "scroll",
              border: "1px solid #e8e8e8",
              borderTop: "none"
            }}
          >
            <table
              className="tableView"
              style={{
                tableLayout: "fixed",
                width: "100%",
                wordBreak: "break-word",
                borderCollapse: "collapse"
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

export default ZydusLabParametersList; 