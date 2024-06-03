import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import WeightChart from "./growthGraph/GrowthGraph";
import SubHeader from "./subHeader/SubHeader";
import "./GrowthChart.scss";
import UpdateDetails from "./updateDetails/UpdateDetails";
import { useState } from "react";
import { Drawer } from "antd";
import AddMeasurements from "./AddMeasurements";
import AddDOB from "../vaccination/components/addDOB/AddDOB";
import { useLocation, useNavigate } from "react-router-dom";

const GrowthChart = ({ handleDrawerVaccination }) => {
  const [measurementsDrawer, setMeasurementsDrawer] = useState(false);
  const [showDob, setShowDob] = useState(true);
  const { state } = useLocation();
  let { patient_data } = state;
  const [loading, setLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleMeasurementsDrawer = () => {
    setMeasurementsDrawer(!measurementsDrawer);
  };

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader handleDrawerVaccination={handleDrawerVaccination} />
      <SubHeader
        handleDrawerVital={handleMeasurementsDrawer}
        setShowUpdate={setShowUpdate}
      />
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
      {showUpdate && (
        <UpdateDetails show={showUpdate} setShow={setShowUpdate} />
      )}
      {showDob && (
        <AddDOB
          show={showDob}
          setShowDob={setShowDob}
          patientDetails={patient_data}
          handleDrawerVaccination={() => null}
          getVaccineDetails={() => null}
          setLoading={setLoading}
        />
      )}
      {measurementsDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleMeasurementsDrawer}
          open={measurementsDrawer}
          className="modalWidth-700"
          width="auto"
        >
          <AddMeasurements
            handleMeasurementsDrawer={handleMeasurementsDrawer}
            // handleCollapsed={(flag) => handleCollapsed(flag)}
          />
        </Drawer>
      )}
    </div>
  );
};

export default GrowthChart;
