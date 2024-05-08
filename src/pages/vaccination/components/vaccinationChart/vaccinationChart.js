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

const VaccinationChart = ({ vaccinesData }) => {
  return (
    <>
      {[vaccinesData?.slice(0, 14), vaccinesData?.slice(14)]?.map((ds) => (
        <div className="d-flex flex-column align-items-center print-template">
          <div className="header">Vaccination Chart</div>
          <div className="details">
            <img
              src={require("../../../../assets/images/babyImage.png")}
              alt="Baby"
              width={32}
              height={32}
            />
            <div style={{ height: "36px" }}>
              <div style={{ fontWeight: 600 }}>Baby Janvi</div>
              <div>Age : 12 Years, Female</div>
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

export default VaccinationChart;
