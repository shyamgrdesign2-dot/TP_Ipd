import VaccineTable from "../vaccineTable/VaccineTable";
import "./vaccinationChart.scss";

const dataSource = [
  {
    key: "1",
    name: "John Doe",
    age: 30,
    remarks: "New York",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "2",
    name: "Jane Smith",
    age: 25,
    remarks: "Los Angeles",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "3",
    name: "Alice Johnson",
    age: 35,
    remarks: "Chicago",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "4",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "5",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "6",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "7",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "8",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "9",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "10",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "11",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "12",
    name: "Bob Brown",
    age: 40,
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
    remarks:
      "Houston HoustonHoustonHoustonHouston HoustonHouston HoustonHouston HoustonHouston HoustonHoustonHouston HoustonHouston",
  },
  {
    key: "13",
    name: "Alice Smith",
    age: 35,
    vaccine: "vaccine 2",
    brand: "brand 2",
    dueDate: "15 April 2024",
    givenDate: "14 April 2024",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    key: "14",
    name: "Charlie Johnson",
    age: 45,
    vaccine: "vaccine 3",
    brand: "brand 3",
    dueDate: "18 April 2024",
    givenDate: "17 April 2024",
    remarks:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    key: "15",
    name: "David Williams",
    age: 50,
    vaccine: "vaccine 4",
    brand: "brand 4",
    dueDate: "21 April 2024",
    givenDate: "20 April 2024",
    remarks:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    key: "16",
    name: "Eva Martinez",
    age: 30,
    vaccine: "vaccine 5",
    brand: "brand 5",
    dueDate: "24 April 2024",
    givenDate: "23 April 2024",
    remarks:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    key: "17",
    name: "Fiona Anderson",
    age: 28,
    vaccine: "vaccine 6",
    brand: "brand 6",
    dueDate: "27 April 2024",
    givenDate: "26 April 2024",
    remarks:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    key: "18",
    name: "George Wilson",
    age: 55,
    vaccine: "vaccine 7",
    brand: "brand 7",
    dueDate: "30 April 2024",
    givenDate: "29 April 2024",
    remarks:
      "Enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    key: "19",
    name: "Hannah Garcia",
    age: 42,
    vaccine: "vaccine 8",
    brand: "brand 8",
    dueDate: "3 May 2024",
    givenDate: "2 May 2024",
    remarks:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    key: "20",
    name: "Ian Martinez",
    age: 33,
    vaccine: "vaccine 9",
    brand: "brand 9",
    dueDate: "6 May 2024",
    givenDate: "5 May 2024",
    remarks:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];
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

window.onbeforeprint = function () {
  var tableContainer = document.querySelector(".table-container");
  var headerHeight = document.querySelector(".header").offsetHeight;
  var availableHeight = window.innerHeight - headerHeight;
  var rows = tableContainer.querySelectorAll("tr");

  var totalHeight = 0;
  var pageIndex = 0;

  rows.forEach(function (row) {
    totalHeight += row.offsetHeight;

    if (totalHeight > availableHeight) {
      row.classList.add("page-break");
      totalHeight = row.offsetHeight;
      pageIndex++;
    }

    row.dataset.pageIndex = pageIndex;
  });
};

const VaccinationChart = ({ vaccineData }) => {
  return (
    <>
      {[dataSource.slice(0, 14), dataSource.slice(14)].map((ds) => (
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
