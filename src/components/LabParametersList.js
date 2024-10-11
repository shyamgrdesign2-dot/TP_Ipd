import { useEffect, useState } from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import axios from 'axios';

const LabParametersList = ({patient_unique_id,doc_id}) => {
  const [labParamsData, setLabParamsData] = useState([]);
  const [token, setToken] = useState(null);

  const getLabParams = async () => {
    try {
        const cleanedToken = token.replace(/['"]+/g, '');
        const response = await axios.get(`https://pm-patient-docs-uat.tatvacare.in/api/v1/lab-parameters/results/${doc_id}/${patient_unique_id}`, {
            headers: {
                'Authorization': `Bearer ${cleanedToken}`,
            },
        });
        setLabParamsData(response.data?.results || []);
    } catch (error) {
        console.error("Error fetching lab params:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if(token){
      getLabParams()
    }
  },[token])

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
