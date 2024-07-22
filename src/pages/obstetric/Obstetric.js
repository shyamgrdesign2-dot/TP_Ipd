import { useState } from "react";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import Examination from "./components/Examination/Examination";
import PastPregnancy from "./components/PastPregnancy/PastPregnancy";
import "./Obstetric.scss";
import { Drawer } from "antd";

const Obstetric = ({ handleDrawerObstetric }) => {
  const [examinationDrawer, setExaminationDrawer] = useState(true);
  const [pastPregnancyDrawer, setPastPregancyDrawer] = useState(false);

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerObstetric}
        isObstetric={true}
      />
      {examinationDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={() => setExaminationDrawer(false)}
          open={examinationDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <Examination close={() => setExaminationDrawer(false)} />
        </Drawer>
      )}
      {pastPregnancyDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={() => setPastPregancyDrawer(false)}
          open={pastPregnancyDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <PastPregnancy close={() => setPastPregancyDrawer(false)} />
        </Drawer>
      )}
    </div>
  );
};

export default Obstetric;
