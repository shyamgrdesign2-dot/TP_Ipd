/* eslint-disable react-hooks/exhaustive-deps */
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
  getVaccineTemplates,
  getPatientDetails,
  getVaccineBrands,
  getPatientVaccineDetails,
  createPatient,
} from "./service";
import {
  getDates,
  getDefaultOption,
  getDistinctAges,
  mergeDataPatientDetails,
} from "./VaccinationHelper";
import CashManagerContext from "../../context/CashManagerContext";
import { useLocation } from "react-router-dom";

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
  const [activeDate, setActiveDate] = useState(0);
  const [vaccinesData, setVaccinesData] = useState([]);
  const [completeData, setCompleteData] = useState({});
  const [dateOptions, setDateOptions] = useState([]);
  const [ageFilters, setAgeFilters] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const { state } = useLocation();
  const { patient_data } = state;
  const [printType, setPrintType] = useState("");

  const contextApi = {
    patient_data,
  };

  useEffect(() => {
    getVaccineDetails();
    getVaccineBrand();
  }, []);

  useEffect(() => {
    const activeValue = ageFilters?.[activeDate];
    setVaccinesData(completeData?.get?.(activeValue));
  }, [activeDate]);

  useEffect(() => {
    if (printType) {
      handlePrint();
      setPrintType("");
    }
  }, [printType]);

  const getPatientDetail = async () => {
    const patientDetails = await getPatientDetails({
      hospital_bid:
        patient_data?.hm_business_id || patient_data?.hospital_business_id,
      patient_uid: patient_data?.patient_unique_id,
      hospital_id: patient_data?.hm_id || patient_data?.clinic_id,
    });

    if (!patientDetails?.vac_id) {
      const createPatientRes = await createPatient({
        patient_uid: patient_data?.patient_unique_id,
        patient_pid: patient_data?.pm_pid,
        hospital_bid:
          patient_data?.hm_business_id || patient_data?.hospital_business_id,
        hospital_id: patient_data?.hm_id || patient_data?.clinic_id,
        patient_first_name: patient_data?.pm_first_name || "",
        patient_middle_name: patient_data?.pm_middle_name || "",
        patient_last_name: patient_data?.pm_last_name || "",
        patient_gender: patient_data?.pm_gender,
        patient_dob: patient_data?.DOB,
        patient_contact_no: patient_data?.pm_contact_no,
      });
      if (createPatientRes?.patient_uid) getPatientDetail();
    }
    if (patientDetails?.vac_id && !patientDetails?.vac_dob) {
      setShowDob(true);
    } else {
      patientDetails.vac_dob = moment(patientDetails.vac_dob).format(
        "DD-MMM-YYYY"
      );
    }
    setPatientDetails(patientDetails);
    return patientDetails;
  };

  const getVaccineBrand = async () => {
    const details = await getVaccineBrands();
    setBrands(details);
  };

  const getVaccineDetails = async () => {
    const vaccineTemplate = await getVaccineTemplates();
    const patientDetail = await getPatientDetail();
    const patientDetailsRes = await getPatientVaccineDetails(
      patientDetail?.patient_unique_id,
      patientDetail?.vac_pid,
      patientDetail?.hm_business_id
    );

    const birthDate = new Date(patientDetail?.vac_dob);

    const defaultOption = getDefaultOption(birthDate);
    const combinedData = mergeDataPatientDetails(
      vaccineTemplate,
      patientDetailsRes,
      birthDate
    );
    setPreviewData(combinedData);
    const result = getDistinctAges(combinedData);
    setAgeFilters(result.distinctIds);
    setActiveDate(result.distinctIds?.indexOf(defaultOption));

    setCompleteData(result.idMap);
    setVaccinesData(result.idMap.get("Birth"));
    if (!dateOptions.length) setDateOptions(() => getDates(result.idMap));
  };

  const handleSelectAll = (event) => {
    const checked = event?.target?.checked;
    setSelectAll(checked);
    if (checked) {
      let indices = [...Array(vaccinesData.length).keys()];
      setSelectedCards(indices);
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
        if (
          vaccinesData[selectedCards[0]]?.tvp_given_date ===
          vaccinesData[id]?.tvp_given_date
        ) {
          if (
            vaccinesData[selectedCards[0]].tvp_given_date ===
            vaccinesData[id]?.tvp_given_date
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
    <CashManagerContext.Provider value={contextApi}>
      <div className="vaccinationWrapper">
        <VaccineHeader
          vaccinesData={previewData}
          patientDetails={patientDetails}
          setPrintType={setPrintType}
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
            {vaccinesData?.map((vaccineData, index) => (
              <Col key={index} className="gx-4">
                <VaccineCard
                  vaccineData={vaccineData}
                  selectedCards={selectedCards}
                  handleCardCheckboxChange={handleCardCheckboxChange}
                  setSelectedCards={setSelectedCards}
                  index={index}
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
            selectedVaccines={selectedCards?.map((id) => vaccinesData[id])}
            patientDetails={patientDetails}
            getVaccineDetails={getVaccineDetails}
            setSelectedCards={setSelectedCards}
          />
        )}
        {vaccinesData?.length && (
          <div style={{ display: "none" }}>
            <div ref={printableRef}>
              <VaccinationChart
                vaccinesData={
                  printType === "2"
                    ? previewData?.filter((data) => !!data?.tvp_given_date)
                    : previewData
                }
              />
            </div>
          </div>
        )}
        {showDob && (
          <AddDOB
            show={showDob}
            setShowDob={setShowDob}
            patientDetails={patient_data}
            getPatientDetail={getPatientDetail}
          />
        )}
      </div>
    </CashManagerContext.Provider>
  );
}
export default React.memo(Vaccination);
