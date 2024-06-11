import closeFill from "../../../../assets/images/closeFill.svg";
import "./GrowthGraph.scss";

const TooltipContent = ({ handleDrawerVital, handleCloseTooltip }) => {
  return (
      <div className="tooltipStyle">
      <div className="measurementHeader">
        <div className="rowContainer">
          <div>
            <span className="measurementText">Measurements</span>
            <i className="icon-Edit iconStyle" onClick={handleDrawerVital} />
          </div>
          <img
            src={closeFill}
            alt="close"
            className="closeImg"
            onClick={handleCloseTooltip}
          />
        </div>
        <div className="rowContainer">
          <div>Age: 3 months</div>
          <div className="updateText">Updated: 06 Jun 2024</div>
        </div>
      </div>

      <div className="measurements">
        <div className="rowContainer">
          <div className="measurement">
            <span className="measurementKey">Height : </span>
            40 cms
          </div>
          <span className="breakStyle" />
          <div>
            <span>Weight : </span>
            08 kg
          </div>
        </div>
        <div className="rowContainer">
          <div>
            <span>BMI : </span>
            13 kg/m2
          </div>
          <span className="breakStyle" />
          <div>
            <span>OFC : </span>
            13 kg/m2
          </div>
        </div>
      </div>
      </div>
  );
};

export default TooltipContent;
