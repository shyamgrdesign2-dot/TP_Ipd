/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import "./Vaccination.scss";
import { Checkbox, Spin } from "antd";
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
  getOverridenDueDate,
} from "./service";
import {
  getDates,
  getDefaultOption,
  getDistinctAges,
  mergeDataPatientDetails,
} from "./VaccinationHelper";
import CashManagerContext from "../../context/CashManagerContext";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "./components/Loader.js";
import { getTokenData, handlePrintClick } from "../../utils/utils.js";
import { getDecodedToken } from "../../utils/localStorage.js";

function Vaccination({ handleDrawerVaccination }) {
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
  let { patient_data } = state;
  const [printType, setPrintType] = useState("");
  const [shouldShowSelectAll, setShouldShowSelectAll] = useState(false);
  const [isCardClicked, setCardClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vaccinePatientDetails, setVaccinePatientDetails] = useState();
  const [tabLoader, setTabLoader] = useState(false);

  const contextApi = {
    patient_data,
  };

  useEffect(() => {
    getVaccineDetails();
  }, []);

  useEffect(() => {
    if (warningMsg) {
      const timer = setTimeout(() => {
        setWarningMsg("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [warningMsg]);

  useEffect(() => {
    const activeValue = ageFilters?.[activeDate];
    setVaccinesData(completeData?.get?.(activeValue));
    setShouldShowSelectAll(false);
  }, [activeDate, completeData]);

  useEffect(() => {
    if (printType) {
      handlePrintClick(
        printableRef.current,
        setTabLoader,
        handlePrintWeb,
        "vaccinationChart"
      );
      setPrintType("");
    }
  }, [printType]);

  useEffect(() => {
    selectAllCheck();
  }, [vaccinesData]);

  const { profile } = useSelector((state) => state.doctors);

  const getPatientDetail = async () => {
    const decodedToken = getDecodedToken();
    const hospital_bid = decodedToken?.result?.hospital_business_id;
    const patientDetails = await getPatientDetails({
      hospital_bid:
        patient_data?.hm_business_id ||
        patient_data?.hospital_business_id ||
        hospital_bid,
      patient_uid: patient_data?.patient_unique_id,
      hospital_id: patient_data?.hm_id || profile?.hospital_data?.[0]?.hm_id,
    });
    setVaccinePatientDetails({ ...patient_data, ...patientDetails });
    if (
      !patientDetails?.vac_id ||
      (patientDetails?.vac_id && !patientDetails?.vac_dob)
    ) {
      setShowDob(true);
    } else {
      patientDetails.vac_dob = moment(patientDetails.vac_dob).format(
        "DD-MMM-YYYY"
      );
    }
    setPatientDetails(patientDetails);
    return patientDetails;
  };

  const getVaccineDetails = async (updatedVaccine) => {
    const vaccineTemplate = await getVaccineTemplates();
    const patientDetail = await getPatientDetail();
    const overridenVaccines = await getOverridenDueDate(
      patient_data?.patient_unique_id,
      patient_data?.pm_pid
    );
    const patientDetailsRes = await getPatientVaccineDetails(
      patientDetail?.patient_unique_id,
      patientDetail?.vac_pid,
      patientDetail?.hm_business_id
    );
    const details = await getVaccineBrands();
    setBrands(details);

    const birthDate = patientDetail?.vac_dob
      ? new Date(patientDetail?.vac_dob)
      : "";

    const combinedData = mergeDataPatientDetails(
      vaccineTemplate,
      patientDetailsRes,
      overridenVaccines,
      details,
      birthDate
    );
    setPreviewData(combinedData);
    const result = getDistinctAges(combinedData);
    setAgeFilters(result.distinctIds);

    setCompleteData(result.idMap);

    const options = getDates(result.idMap);
    setDateOptions(options);
    if (!updatedVaccine) {
      setActiveDate(getDefaultOption(options));
    }
    setLoading(false);
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

  const selectAllCheck = () => {
    // Needs to check for updated due date

    // checking for two different due dates vaccines
    const vaccineDue = vaccinesData?.[0]?.dueDate;
    const difference = vaccinesData?.filter(
      (vaccineData) => vaccineData.dueDate !== vaccineDue
    );
    const vaccineGiven = vaccinesData?.[0]?.tvp_given_date;

    // checking for two different given dates
    const givenDifference = vaccinesData?.filter(
      (vaccineData) => vaccineData.tvp_given_date !== vaccineGiven
    );
    if (!givenDifference?.length && !difference?.length) {
      setShouldShowSelectAll(true);
    }

    /**
     * checking for both vaccine given and not given were present or not
     * If both are present then we dont show the select all
     */
    const checkForGiven = vaccinesData?.find(
      (vaccineData) => vaccineData?.tvp_given_date
    );
    const checkForNotGiven = vaccinesData?.find(
      (vaccineData) => !vaccineData?.tvp_given_date
    );
    if (checkForGiven && checkForNotGiven) {
      setShouldShowSelectAll(false);
    }
  };

  const handleCardCheckboxChange = (id) => {
    setShowUpdate(false);
    let newSelectedCards = [...selectedCards];
    if (newSelectedCards.includes(id)) {
      newSelectedCards = newSelectedCards.filter((cardId) => cardId !== id);
    } else {
      if (newSelectedCards.length) {
        if (
          vaccinesData[selectedCards[0]]?.tvp_given_date &&
          vaccinesData[id]?.tvp_given_date
        ) {
          if (
            vaccinesData[selectedCards[0]]?.tvp_given_date ===
            vaccinesData[id]?.tvp_given_date
          ) {
            newSelectedCards.push(id);
          } else {
            setWarningMsg(
              "Vaccine given on different dates can't be selected together!"
            );
            newSelectedCards = [id];
          }
        } else if (
          vaccinesData[selectedCards[0]].tvp_given_date ===
          vaccinesData[id]?.tvp_given_date
        ) {
          newSelectedCards.push(id);
        } else {
          setWarningMsg(
            "Given vaccine and Due Vaccines cannot be selected together!"
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
    if (scrollTop > 160) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  const handlePrintWeb = useReactToPrint({
    content: () => printableRef.current,
  });

  const handleCardClick = (i) => {
    setCardClicked(true);
    setSelectedCards([i]);
    setShowUpdate(true);
  };

  return (
    <CashManagerContext.Provider value={contextApi}>
      <div className="vaccinationWrapper">
        {vaccinesData?.length && previewData?.length && (
          <VaccineHeader
            handleDrawerVaccination={handleDrawerVaccination}
            vaccinesData={previewData}
            setPrintType={setPrintType}
            isVaccination={true}
            printLoader={tabLoader}
          />
        )}
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
              width={220}
            />
          </div>
          {vaccinesData?.length && !loading ? (
            <>
              <div className={isFixed ? "fixFilter" : ""}>
                <VaccineFilter
                  dateOptions={dateOptions}
                  activeDate={activeDate}
                  setActiveDate={setActiveDate}
                  setSelectedCards={setSelectedCards}
                  setSelectAll={setSelectAll}
                />
              </div>
              <div style={{ marginTop: isFixed ? "100px" : "0px" }}>
                {shouldShowSelectAll ? (
                  <div className="selectAllContainer scrollable-content">
                    <Checkbox
                      className="vaccine-custom-checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="selectAll">Select All</span>
                  </div>
                ) : null}

                <Row xs={1} sm={2} md={2} lg={3} className="gy-4">
                  {vaccinesData?.map((vaccineData, index) => (
                    <Col key={index} className="gx-4">
                      <VaccineCard
                        vaccineData={vaccineData}
                        selectedCards={selectedCards}
                        handleCardCheckboxChange={handleCardCheckboxChange}
                        setSelectedCards={setSelectedCards}
                        index={index}
                        handleCardClick={handleCardClick}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          ) : (
            <div>
              <Spin
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                }}
                size="large"
              />
            </div>
          )}
        </div>
        {warningMsg ? (
          <div
            className={`customWarningDrawer ${
              !!warningMsg ? "open" : "closed"
            }`}
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
          </div>
        ) : null}
        {selectedCards.length && !isCardClicked ? (
          <SelectionPopup
            visible={!!selectedCards.length}
            onClose={handleSelectAll}
            selectedValue={selectedCards.length}
            setSelectedCards={setSelectedCards}
            setShowUpdate={setShowUpdate}
            setWarningMsg={setWarningMsg}
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
            setSelectAll={setSelectAll}
            setCardClicked={setCardClicked}
            setLoading={setLoading}
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
                patientDetails={patientDetails}
                profile={profile}
              />
            </div>
          </div>
        )}
        {showDob && (
          <AddDOB
            show={showDob}
            setShowDob={setShowDob}
            patientDetails={vaccinePatientDetails}
            handleDrawerVaccination={handleDrawerVaccination}
            getVaccineDetails={getVaccineDetails}
            setLoading={setLoading}
          />
        )}
      </div>
      {tabLoader && <FullPageLoader />}
    </CashManagerContext.Provider>
  );
}
export default React.memo(Vaccination);
