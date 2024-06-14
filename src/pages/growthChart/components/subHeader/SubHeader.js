import { Button } from "antd";
import "./subHeader.scss";
import { Switch } from "antd";

const SubHeader = ({
  handleDrawerMeasurements,
  setShowUpdate,
  showTableView,
  setShowTableView,
  showTimelineInYear,
  setShowTimelineInYear,
  parentalDetails,
}) => {
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
          <span className="separator" />
          <span>{value2}</span>
        </div>
      </div>
    );
  };

  const showTableViewBtn = () => {
    return (
      <div
        className="detailsContainer toggleContainer"
        onClick={() => setShowTableView(!showTableView)}
      >
        <div className="textStyle">
          <span>Show</span>
          <span>Table View</span>
        </div>
        <Switch checked={showTableView} />
      </div>
    );
  };

  const showTimelineInYearBtn = () => {
    return (
      <div
        className="detailsContainer toggleContainer"
        onClick={() => setShowTimelineInYear(!showTimelineInYear)}
      >
        <div className="textStyle">
          <span>Show Timeine</span>
          <span>in years</span>
        </div>
        <Switch checked={showTimelineInYear} />
      </div>
    );
  };

  return (
    <div className="growthSubHeader">
      <Button
        type="button"
        className="btn-41 btn ant-btn-text btn-input addMeasurementBtn"
        onClick={handleDrawerMeasurements}
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
          `Mid parental height: ${parentalDetails?.mid_parental_height ?? ""}`,
          `Mother: ${
            parentalDetails?.mother_height
              ? parentalDetails?.mother_height + " cms"
              : ""
          }`,
          `Father: ${
            parentalDetails?.father_height
              ? parentalDetails?.father_height + " cms"
              : ""
          }`
        )}
        {growthDetails(
          "Gestation period",
          `${
            parentalDetails?.gestation_period_weeks
              ? parentalDetails?.gestation_period_weeks + " weeks"
              : ""
          }`,
          `${
            parentalDetails?.gestation_period_days
              ? parentalDetails?.gestation_period_days + " days"
              : ""
          }`
        )}
        {showTableViewBtn()}
        {showTimelineInYearBtn()}
      </div>
    </div>
  );
};

export default SubHeader;
