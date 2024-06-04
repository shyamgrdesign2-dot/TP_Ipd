import { Button } from "antd";
import "./subHeader.scss";
import { Switch } from "antd";

const SubHeader = ({ handleDrawerVital }) => {
  const growthDetails = (title, value1, value2) => {
    return (
      <div className="detailsContainer">
        <div className="details">
          <span className="titleStyle">{title}</span>
          <i className="icon-Edit iconStyle" />
        </div>
        <div className="details">
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
