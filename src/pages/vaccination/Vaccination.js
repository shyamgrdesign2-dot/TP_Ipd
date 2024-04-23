import React, { useState } from "react";
import "./Vaccination.scss";

import { Checkbox } from "antd";
import HeaderVaccine from "./components/HeaderVaccine";
import VaccineCard from "./components/vaccineCard/VaccineCard";
import VaccineFilter from "./vaccineFilter/VaccineFilter";
import { Flex } from "antd";

function Vaccination() {
  const [isFixed, setIsFixed] = useState(false);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop > 147) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  return (
    <div className="vaccinationWrapper">
      <HeaderVaccine />
      <div
        id="wrap"
        onScroll={handleScroll}
        style={{ overflowY: "auto", position: "relative" }}
        className="vaccinationContainer position-relative"
      >
        <div className="vaccinationTitle bg-welcome d-flex justify-content-between align-items-center">
          <div>
            <h2>Vaccination</h2>
            <p>
              Immunisation schedule recommended by <b>IAP</b>
            </p>
          </div>
          <img
            src={require("../../assets/images/vaccine.png")}
            className="vaccineImg d-inline-block align-top ms-4"
            alt="Vaccine"
          />
        </div>
        <div className={isFixed ? "fix-search" : ""}>
          <VaccineFilter />
        </div>
        <div className="selectAllContainer scrollable-content">
          <Checkbox className="checkboxStyle" />
          <span className="selectAll">Select All</span>
        </div>

        <Flex justify="space-between" gap={24} wrap={"wrap"}>
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
        </Flex>
      </div>
    </div>
  );
}
export default React.memo(Vaccination);
