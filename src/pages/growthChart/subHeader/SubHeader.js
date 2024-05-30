import { Button } from "antd";
import "./subHeader.scss";
import { Switch } from "antd";

const SubHeader = ({ handleDrawerVital }) => {
  const growthDetails = (text1, text2, text3) => {
    return (
      <div className="detailsContainer">
        <div className="details">
          <div className="titleStyle">{text1}</div>
          <div className="iconStyle">
            <i className="icon-Edit" />
          </div>
        </div>
        <div className="details">
          <div>{text2}</div>
          <span className="breakStyle" />
          <div>{text3}</div>
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
        {toggleGrowthDetails()}
      </div>
    </div>
  );
};

export default SubHeader;
