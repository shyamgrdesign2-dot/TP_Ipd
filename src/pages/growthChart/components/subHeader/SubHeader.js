import { Button } from "antd";
import "./subHeader.scss";
import { Switch } from "antd";

export const dummyData = {
  labels: Array.from({ length: 24 }, (_, i) => i + 1), // Age in months from 1 to 24
  datasets: [
    {
      label: "P 1",
      data: [
        8.0, 8.5, 9.2, 9.9, 10.8, 11.6, 12.4, 13.0, 13.5, 13.9, 14.2, 14.5,
        14.8, 15.0, 15.2, 15.3, 15.5, 15.6, 15.7, 15.8, 15.9, 16.0, 16.1, 16.2,
      ],
      borderColor: "rgba(255, 99, 132, 0.5)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 2",
      data: [
        9.5, 10.0, 10.7, 11.4, 12.3, 13.1, 13.9, 14.5, 15.0, 15.4, 15.7, 16.0,
        16.3, 16.5, 16.7, 16.8, 17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7,
      ],
      borderColor: "rgba(54, 162, 235, 0.5)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 3",
      data: [
        11.0, 11.5, 12.2, 12.9, 13.8, 14.6, 15.4, 16.0, 16.5, 16.9, 17.2, 17.5,
        17.8, 18.0, 18.2, 18.3, 18.5, 18.6, 18.7, 18.8, 18.9, 19.0, 19.1, 19.2,
      ],
      borderColor: "rgba(75, 192, 192, 0.5)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 4",
      data: [
        13.0, 13.5, 14.2, 14.9, 15.8, 16.6, 17.4, 18.0, 18.5, 18.9, 19.2, 19.5,
        19.8, 20.0, 20.2, 20.3, 20.5, 20.6, 20.7, 20.8, 20.9, 21.0, 21.1, 21.2,
      ],
      borderColor: "rgba(153, 102, 255, 0.5)",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 5",
      data: [
        15.0, 15.5, 16.2, 16.9, 17.8, 18.6, 19.4, 20.0, 20.5, 20.9, 21.2, 21.5,
        21.8, 22.0, 22.2, 22.3, 22.5, 22.6, 22.7, 22.8, 22.9, 23.0, 23.1, 23.2,
      ],
      borderColor: "rgba(255, 159, 64, 0.5)",
      backgroundColor: "rgba(255, 159, 64, 0.2)",
      fill: true,
      pointRadius: 0, // Remove points
      pointHoverRadius: 0, // Remove points on hover
      hidden: false,
    },
    {
      label: "P 7",
      data: [
        { x: 1, y: 10 },
        { x: 6, y: 12 },
        { x: 12, y: 18 },
        { x: 18, y: 24 },
        { x: 24, y: 30 },
      ],
      borderColor: "#19BB7A",
      backgroundColor: "#19BB7A",
      borderDash: [5, 5], // Make the line dotted
      pointRadius: 5, // Show points
      pointHoverRadius: 7, // Show points on hover
      hidden: false,
    },
  ],
};

const SubHeader = ({ handleDrawerVital, setShowUpdate }) => {
  const growthDetails = (title, value1, value2) => {
    return (
      <div className="detailsContainer">
        <div className="detailsStyle">
          <span className="titleStyle">{title}</span>
          <i
            className="icon-Edit iconStyle"
            onClick={() => setShowUpdate(true)}
          />
        </div>
        <div className="detailsStyle">
          <span>{value1}</span>
          <span className="breakStyle" />
          <span>{value2}</span>
        </div>
      </div>
    );
  };

  const toggleGrowthDetails = (value1, value2) => {
    return (
      <div className="detailsContainer toggleContainer">
        <div className="textStyle">
          <span>{value1}</span>
          <span>{value2}</span>
        </div>
        <Switch
        // onChange={(checked) => onChangeRight(checked)}
        />
      </div>
    );
  };

  return (
    <div className="growthSubHeader">
      <Button
        type="button"
        className="btn-41 btn ant-btn-text btn-input addMeasurementBtn"
        onClick={handleDrawerVital}
      >
        <div className="addIconStyle">
          <i className="icon-Add" />
        </div>
        <div className="textStyle">
          <span>Add</span>
          <span>Measurements</span>
        </div>
      </Button>
      <div className="rightSubHeader">
        {growthDetails(
          "Mid parental height: 169cm",
          "Mother: 156cm",
          "Father: 170cm"
        )}
        {growthDetails("Gestation period", "37 weeks", "4 days")}
        {toggleGrowthDetails("Show", "Table View")}
        {toggleGrowthDetails("Show Timeine", "in years")}
      </div>
    </div>
  );
};

export default SubHeader;
