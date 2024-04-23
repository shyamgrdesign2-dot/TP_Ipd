import React, { useState } from "react";
import "./Vaccination.scss";

import { Checkbox } from "antd";
import HeaderVaccine from "./components/HeaderVaccine";
import VaccineCard from "./components/vaccineCard/VaccineCard";
import VaccineFilter from "./vaccineFilter/VaccineFilter";
import { Flex } from "antd";

const vaccineData1 = {
  name: "Vaccine Name",
  fullName: "Hepatiis B",
  brand: "Vaccine Brand",
  moreDetails: [
    ["Brand: ", "Vaccine Brand"],
    ["Given Date: ", "20 April 2024"],
    ["Note: ", "Temperature is high"],
  ],
  dueDate: "20 April 2024",
  basedOn: "DOB",
  isDelayed: false,
  isVaccineGiven: true,
};

const vaccineData2 = {
  name: "Vaccine Name",
  fullName: "Hepatiis B",
  brand: "Vaccine Brand",
  moreDetails: [
    ["Brand: ", "Vaccine Brand"],
    ["Note: ", "Temperature is high"],
  ],
  dueDate: "20 April 2024",
  basedOn: "DOB",
  isDelayed: false,
  isVaccineGiven: false,
};
const vaccineData3 = {
  name: "Vaccine Name",
  fullName: "Hepatiis B",
  brand: "Vaccine Brand",
  moreDetails: [
    ["Brand: ", "Vaccine Brand"],
    ["Given Date: ", "20 April 2024"],
    ["Note: ", "Temperature is high"],
  ],
  dueDate: "20 April 2024",
  basedOn: "DOB",
  isDelayed: true,
  isVaccineGiven: true,
};
const vaccineData4 = {
  name: "Vaccine Name",
  fullName: "Hepatiis B",
  brand: "Vaccine Brand",
  moreDetails: [
    ["Brand: ", "Vaccine Brand"],
    ["Updated Due Date: ", "28 April 2024"],
    ["Note: ", "Temperature is high"],
  ],
  dueDate: "20 April 2024",
  basedOn: "DOB",
  isDelayed: true,
};

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
          <VaccineCard vaccineData={vaccineData1} />
          <VaccineCard vaccineData={vaccineData2} />
          <VaccineCard vaccineData={vaccineData3} />
          <VaccineCard vaccineData={vaccineData4} />
          <VaccineCard vaccineData={vaccineData1} />
          <VaccineCard vaccineData={vaccineData1} />
          <VaccineCard vaccineData={vaccineData1} />
          <VaccineCard vaccineData={vaccineData1} />
          <VaccineCard vaccineData={vaccineData1} />
        </Flex>
      </div>
    </div>
  );
}
export default React.memo(Vaccination);
