import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import SubHeader from "./subHeader/SubHeader";

const GrowthChart = ({ handleDrawerVaccination }) => {
  return (
    <div className="vaccinationWrapper">
      <VaccineHeader handleDrawerVaccination={handleDrawerVaccination} />
      <SubHeader />
    </div>
  );
};

export default GrowthChart;
