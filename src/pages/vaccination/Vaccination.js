import React, { useState, useRef, useEffect } from "react";
import "./Vaccination.scss";
import { Checkbox, Drawer } from "antd";
import VaccineHeader from "./components/vaccineHeader/VaccineHeader";
import VaccineCard from "./components/vaccineCard/VaccineCard";
import VaccineFilter from "./components/vaccineFilter/VaccineFilter";
import SelectionPopup from "./components/selectionPopup/SelectionPopup";
import closeFill from "../../assets/images/closeFill.svg";
import { Row, Col } from "react-bootstrap";
import UpdateVaccine from "./components/updateVaccine/UpdateVaccine";
import VaccinationChart from "./components/vaccinationChart/vaccinationChart";
import { useReactToPrint } from "react-to-print";
import AddDOB from "./components/addDOB/AddDOB";
import moment from "moment";
import {
  getPaientDetails,
  getVaccineTemplates,
  getPatientDetails,
  getVaccineBrands,
} from "./service";
import {
  getDates,
  getDistinctAges,
  mergeDataPatientDetails,
} from "./VaccinationHelper";

function Vaccination() {
  const [isFixed, setIsFixed] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [warningMsg, setWarningMsg] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const printableRef = useRef(null);
  const [showDob, setShowDob] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getPatientDetail();
    getVaccineBrand();
  }, []);

  const getPatientDetail = async () => {
    const [details] = await getPatientDetails();
    if (!details?.vac_dob) {
      setShowDob(true);
    } else {
      details.vac_dob = moment(details.vac_dob).format("DD-MMM-YYYY");
    }
    setPatientDetails(details);
  };

  const getVaccineBrand = async () => {
    const details = await getVaccineBrands();
    setBrands(details);
  };
  const [activeDate, setActiveDate] = useState(0);
  const [vaccinesData, setVaccinesData] = useState([]);
  const [completeData, setCompleteData] = useState({});
  const [dateOptions, setDateOptions] = useState([]);
  const [ageFilters, setAgeFilters] = useState([]);

  const getVaccineDetails = async () => {
    const vaccineTemplate = await getVaccineTemplates();
    const patientDetails = await getPaientDetails();
    const combinedData = mergeDataPatientDetails(
      vaccineTemplate,
      patientDetails
    );
    const result = getDistinctAges(combinedData);
    setAgeFilters(result.distinctIds);

    setCompleteData(result.idMap);
    setVaccinesData(result.idMap.get("Birth"));

    const birthDate = new Date();
    // const priorDate = new Date(new Date().setDate(birthDate.getDate() - 60));
    console.log("priorDate", birthDate);

    if (!dateOptions.length) setDateOptions(getDates(result.idMap, birthDate));
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

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handlePrint={handlePrint}
        patientDetails={patientDetails}
      />
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
            dateOptions={dateOptions}
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
          setShowUpdate={setShowUpdate}
        />
      ) : null}
      {showUpdate && (
        <UpdateVaccine
          show={showUpdate}
          setShow={setShowUpdate}
          brands={brands}
          vaccines={selectedCards?.map((id) => vaccinesData[id])}
        />
      )}

      <div style={{ display: "none" }}>
        <div ref={printableRef}>
          <VaccinationChart vaccineData={[]} />
        </div>
      </div>
      {showDob && <AddDOB show={showDob} setShowDob={setShowDob} />}
    </div>
  );
}
export default React.memo(Vaccination);
