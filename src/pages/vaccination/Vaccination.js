import React, { useEffect, useState } from "react";
import "./Vaccination.scss";
import { Checkbox, Drawer } from "antd";
import VaccineHeader from "./components/vaccineHeader/VaccineHeader";
import VaccineCard from "./components/vaccineCard/VaccineCard";
import VaccineFilter from "./components/vaccineFilter/VaccineFilter";
import SelectionPopup from "./components/selectionPopup/SelectionPopup";
import closeFill from "../../assets/images/closeFill.svg";
import { Row, Col } from "react-bootstrap";
import { getPaientDetails, getVaccineTemplates } from "./service";
import { getDistinctAges } from "./VaccinationHelper";

function Vaccination() {
  const [isFixed, setIsFixed] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [warningMsg, setWarningMsg] = useState("");
  const [activeDate, setActiveDate] = useState(0);
  const [vaccinesData, setVaccinesData] = useState([]);
  const [completeData, setCompleteData] = useState({});

  const [ageFilters, setAgeFilters] = useState([]);

  const getVaccineDetails = async () => {
    const vaccineTemplate = await getVaccineTemplates();
    const result = getDistinctAges(vaccineTemplate);

    setAgeFilters(result.distinctIds);
    setCompleteData(result.idMap);
    setVaccinesData(result.idMap.get("Birth"));
    const data2 = await getPaientDetails();
  };

  useEffect(() => {
    getVaccineDetails();
  }, []);

  useEffect(() => {
    const activeValue = ageFilters?.[activeDate];
    setVaccinesData(completeData?.get?.(activeValue));
  }, [activeDate]);

  const handleSelectAll = (event) => {
    const checked = event?.target?.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedCards(
        vaccinesData.map((vaccineData) => vaccineData.vaccineId)
      );
    } else {
      setSelectedCards([]);
      setWarningMsg("");
    }
  };

  const handleCardCheckboxChange = (id) => {
    let newSelectedCards = [...selectedCards];
    if (newSelectedCards.includes(id)) {
      newSelectedCards = newSelectedCards.filter((cardId) => cardId !== id);
    } else {
      if (newSelectedCards.length) {
        const currentIdData = vaccinesData.find(
          (vaccineData) => vaccineData.vaccineId === id
        );
        if (
          vaccinesData[selectedCards[0] - 1].isVaccineGiven ===
          currentIdData.isVaccineGiven
        ) {
          if (
            vaccinesData[selectedCards[0] - 1].givenDate ===
            currentIdData.givenDate
          ) {
            newSelectedCards.push(id);
          } else {
            setWarningMsg(
              "Vaccine given on different dates can't be selected together!"
            );
            newSelectedCards = [id];
          }
        } else {
          setWarningMsg(
            "Given vaccine and Due Vaccines cannot be selected togather!"
          );
          newSelectedCards = [id];
        }
      } else {
        newSelectedCards.push(id);
      }
    }
    setSelectedCards(newSelectedCards);
    setSelectAll(newSelectedCards.length === vaccinesData.length);
  };

  const warningMsgHandler = () => {
    setWarningMsg("");
  };

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
      <VaccineHeader />
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
        <div className={isFixed ? "fixFilter" : ""}>
          <VaccineFilter
            dateOptions={ageFilters}
            activeDate={activeDate}
            setActiveDate={setActiveDate}
          />
        </div>
        <div className="selectAllContainer scrollable-content">
          <Checkbox
            className="checkboxStyle"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span className="selectAll">Select All</span>
        </div>

        <Row xs={1} sm={2} md={2} lg={3} className="gy-4">
          {vaccinesData?.map((vaccineData) => (
            <Col key={vaccineData.vaccineId} className="gx-4">
              <VaccineCard
                vaccineData={vaccineData}
                selectedCards={selectedCards}
                handleCardCheckboxChange={handleCardCheckboxChange}
                setSelectedCards={setSelectedCards}
              />
            </Col>
          ))}
        </Row>
      </div>
      {warningMsg ? (
        <Drawer
          placement="bottom"
          closable={false}
          open={!!warningMsg}
          height={44}
          mask={false} // Prevents blurring of background
          style={{
            width: "513px",
            bottom: "110px",
            position: "absolute",
          }}
        >
          <div className="warningStyle">
            {warningMsg}
            <img
              src={closeFill}
              alt="close"
              className="closeImg"
              onClick={warningMsgHandler}
            />
          </div>
        </Drawer>
      ) : null}
      {selectedCards.length ? (
        <SelectionPopup
          visible={!!selectedCards.length}
          onClose={handleSelectAll}
          selectedValue={selectedCards.length}
          setSelectedCards={setSelectedCards}
        />
      ) : null}
    </div>
  );
}
export default React.memo(Vaccination);
