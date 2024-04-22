import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Vaccination.scss";

import { Button, Checkbox, Col } from "antd";
import HeaderVaccine from "./components/HeaderVaccine";
import VaccineCard from "./components/vaccineCard/VaccineCard";

function Vaccination() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [dateOptions, setDateOptions] = useState([
    { value: "Birth", unit: "day", label: "Birth" },
    { value: "6 Weeks", unit: "week", label: "6 Weeks" },
    { value: "10 Weeks", unit: "week", label: "10 Weeks" },
    { value: "14 Weeks", unit: "month", label: "14 Weeks" },
    { value: "6 Months", unit: "month", label: "6 Months" },
    { value: "7 Months", unit: "month", label: "7 Months" },
    { value: "6-9 Months", unit: "month", label: "6-9 Months" },
    { value: "9 Months", unit: "month", label: "9 Months" },
    { value: "9 Months", unit: "month", label: "12 Months" },
    { value: "9 Months", unit: "month", label: "12-15 Months" },
  ]);

  return (
    <div className="vaccinationWrapper">
      <HeaderVaccine />
      <div className="vaccinationContainer position-relative">
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
        <div className="datesContainer">
          {dateOptions.length > 0 &&
            dateOptions.map((item, i) => {
              return (
                <Button
                  key={i}
                  type="text"
                  className="btnStyle btn px-5-16 btn-fw-bold fs-12 mb-12 me-12"
                  onClick={() => window.alert(item.value + " clicked")}
                >
                  {item.label}
                </Button>
              );
            })}
        </div>
        <div className="selectAllContainer">
          <Checkbox className="checkboxStyle" />
          <span className="selectAll">Select All</span>
        </div>

        <div className="d-flex gap-4">
          <VaccineCard />
          <VaccineCard />
          <VaccineCard />
        </div>
      </div>
    </div>
  );
}
export default React.memo(Vaccination);
