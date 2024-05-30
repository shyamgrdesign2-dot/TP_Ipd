import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import SubHeader from "./subHeader/SubHeader";

const GrowthChart = ({ handleDrawerVaccination, handleDrawerVital }) => {
  return (
    <div className="vaccinationWrapper">
      <VaccineHeader handleDrawerVaccination={handleDrawerVaccination} />
      <SubHeader handleDrawerVital={handleDrawerVital} />
    </div>
  );
};

export default GrowthChart;
