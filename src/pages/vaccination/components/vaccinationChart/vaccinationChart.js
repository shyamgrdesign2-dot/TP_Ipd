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
    width: "16%",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    width: "16%",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    width: "16%",
  },
  {
    title: "Given Date",
    dataIndex: "givenDate",
    key: "givenDate",
    width: "16%",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    width: "18%",
  },
];

const VaccinationChart = ({ vaccinesData, patientDetails, profile }) => {
  function divideArray(array) {
    const subarrays = [];
    const rows = 14;
    for (let i = 0; i < array.length; i += rows) {
      const subarray = array.slice(i, i + rows);
      subarrays.push(subarray);
    }
    return subarrays;
  }

  const vaccinePrintData = divideArray(vaccinesData);
  const dob = moment(patientDetails?.vac_dob, "DD-MMM-YYYY");
  const now = moment();

  // Calculate the difference in years
  const years = now.diff(dob, "years");
  dob.add(years, "years"); // Adjust DOB to account for the difference in years

  // Calculate the difference in months
  const months = now.diff(dob, "months");

  let ageString = "";

  if (years > 0 && months > 0) {
    ageString = `${years} Years ${months} Months`;
  } else if (years > 0 && months === 0) {
    ageString = `${years} Years`;
  } else if (months > 0) {
    ageString = `${months} Months`;
  }

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
                  {ageString ? `Age : ${ageString},` : ""} DOB :{" "}
                  {patientDetails?.vac_dob}, {patientDetails?.vac_gender}
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
