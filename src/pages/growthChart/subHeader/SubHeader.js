import { Button } from "antd";
import "./subHeader.scss";
import { Switch } from "antd";

const SubHeader = ({ handleDrawerVital, setShowUpdate }) => {
  const growthDetails = (title, value1, value2) => {
    return (
      <div className="detailsContainer">
        <div className="details">
          <div className="titleStyle">{title}</div>
          <i
            className="icon-Edit iconStyle"
            onClick={() => setShowUpdate(true)}
          />
        </div>
        <div className="details">
          <div>{value1}</div>
          <span className="breakStyle" />
          <div>{value2}</div>
        </div>
      </div>
    );
  };

  const toggleGrowthDetails = () => {
    return (
      <div className="detailsContainer toggleContainer">
        <div className="textStyle">
          <span>Show</span>
          <span>Table View</span>
        </div>
        <Switch
        // onChange={(checked) => onChangeRight(checked)}
        />
      </div>
    );
  };

  const toggleTimeline = () => {
    return (
      <div className="detailsContainer toggleContainer">
        <div className="textStyle">
          <span>Graph timeline</span>
          <span>in years</span>
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
        {toggleGrowthDetails()}
        {toggleTimeline()}
      </div>
    </div>
  );
};

export default SubHeader;
