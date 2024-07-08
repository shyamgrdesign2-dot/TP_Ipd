import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./Obstetric.scss";

const Obstetric = ({ handleDrawerObstetric }) => {
  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerObstetric}
        isObstetric={true}
      />
    </div>
  );
};

export default Obstetric;
