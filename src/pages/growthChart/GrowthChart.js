import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import WeightChart from "./growthGraph/GrowthGraph";
import SubHeader from "./subHeader/SubHeader";
import "./GrowthChart.scss";

const GrowthChart = ({ handleDrawerVaccination, handleDrawerVital }) => {
  return (
    <div className="vaccinationWrapper">
      <VaccineHeader handleDrawerVaccination={handleDrawerVaccination} />
      <SubHeader handleDrawerVital={handleDrawerVital} />
      <div className="graphsContainer">
        <div className="graphItem">
          <WeightChart />
        </div>
        <div className="graphItem">
          <WeightChart />
        </div>
        <div className="graphItem">
          <WeightChart />
        </div>
        <div className="graphItem">
          <WeightChart />
        </div>
      </div>
    </div>
  );
};

export default GrowthChart;
