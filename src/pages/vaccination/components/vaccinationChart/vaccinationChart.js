import moment from "moment";
import VaccineTable from "../vaccineTable/VaccineTable";
import "./vaccinationChart.scss";

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

const VaccinationChart = ({ vaccinesData, patientDetails, profile }) => {
  function divideArray(array) {
    const subarrays = [];
    for (let i = 0; i < array.length; i += 12) {
      const subarray = array.slice(i, i + 12);
      subarrays.push(subarray);
    }
    return subarrays;
  }

  const vaccinePrintData = divideArray(vaccinesData);
  return (
    <>
      {vaccinesData?.length ? (
        vaccinePrintData?.map((ds, i) => (
          <div
            key={i}
            className="d-flex flex-column align-items-center print-template"
          >
            <div className="header">Vaccination Chart</div>
            <div className="details">
              <img
                src={require("../../../../assets/images/babyImage.png")}
                alt="Baby"
                width={32}
                height={32}
              />
              <div style={{ height: "36px" }}>
                <div style={{ fontWeight: 600 }}>
                  {patientDetails?.vac_first_name}{" "}
                  {patientDetails?.vac_last_name}
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
            {i === vaccinePrintData?.length - 1 && (
              <div className="nameStyle">{profile?.um_name}</div>
            )}
          </div>
        ))
      ) : (
        <div className="d-flex flex-column align-items-center print-template">
          <div className="noVaccineData">
            No vaccination has been given to this user
          </div>
        </div>
      )}
    </>
  );
};

export default VaccinationChart;
