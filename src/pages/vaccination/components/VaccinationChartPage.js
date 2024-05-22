import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import VaccineTable from "./vaccineTable/VaccineTable";
import "../components/vaccinationChart/vaccinationChart.scss";
import config from "../../../config";

const columns = [
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: "8%",
  },
  {
    title: "Vaccine",
    dataIndex: "vaccine",
    key: "vaccine",
    width: "18%",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    width: "18%",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    width: "18%",
  },
  {
    title: "Given Date",
    dataIndex: "givenDate",
    key: "givenDate",
    width: "18%",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    width: "20%",
  },
];

const VaccinationChartPage = () => {
  const { state } = useLocation();
  const { vaccinesData, patientDetails } = state;

  window.onafterprint = function () {
    window.location = config.app_vaccination_deep_link;
  };

  useEffect(() => {
    window.print();
  }, []);

  function divideArray(array) {
    const subarrays = [];
    for (let i = 0; i < array.length; i += 13) {
      const subarray = array.slice(i, i + 13);
      subarrays.push(subarray);
    }
    return subarrays;
  }

  return (
    <>
      {divideArray(vaccinesData)?.map((ds, i) => (
        <div
          key={i}
          className="d-flex flex-column align-items-center print-template"
        >
          <div className="header">Vaccination Chart</div>
          <div className="details">
            <img
              src={require("../../../assets/images/babyImage.png")}
              alt="Baby"
              width={32}
              height={32}
            />
            <div style={{ height: "36px" }}>
              <div style={{ fontWeight: 600 }}>
                {patientDetails?.vac_first_name} {patientDetails?.vac_last_name}
              </div>
              <div>
                Age :{" "}
                {moment().diff(
                  moment(patientDetails?.vac_dob, "DD-MMM-YYYY"),
                  "years"
                )}{" "}
                Years, DOB : {patientDetails?.vac_dob},{" "}
                {patientDetails?.vac_gender}
              </div>
            </div>
          </div>
          <div className="vaccine-table-wrapper">
            <VaccineTable dataSource={ds} columns={columns} />
            <p
              style={{
                color: "#A2A2A8 !important",
                fontSize: "10px",
                marginTop: 20,
              }}
            >
              *Not needed if Rv1 is used **Not needed if live vaccine is used
              for first dose
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default VaccinationChartPage;
