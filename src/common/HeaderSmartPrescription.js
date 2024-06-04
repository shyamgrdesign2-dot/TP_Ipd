import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import {
  Button,
  Dropdown,
  Tooltip,
  Popover,
  Input,
  Spin,
  Tabs,
  Select,
  Drawer,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";

import CashManagerContext from "../context/CashManagerContext";
import ProfilePopover from "./ProfilePopover";
import CommonModal from "./CommonModal";
import alertIcon from "../assets/images/alertIcon.svg";
import reload from "../assets/images/ic_Reload.svg";
import tutorial from "../assets/images/tutorial.svg";

import { errorMessage, removeBeforeWhiteSpace } from "../utils/utils";

import { useSelector, useDispatch } from "react-redux";

import { addCaseManager, editCaseManager } from "../redux/caseManagerSlice";

function HeaderPrescription({ prescription, onClear, onSubmit, smartRxData }) {
  const { frequencyList, timingList } = useSelector((state) => state.doctors);

  const { templates, loading } = useSelector((state) => state.caseManager);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {
    patient_data,
    tcmId,
    consultationDate,
    symptomsData,
    setSymptomsData,
    examinationData,
    setExaminationData,
    diagnosisData,
    setDiagnosisData,
    adviceData,
    setAdviceData,
    investigationData,
    setInvestigationData,
    medicationData,
    setMedicationData,
    vitalsData,
    setVitalsData,
    medicalHistoryData,
    setMedicalHistoryData,
    followUpDate,
    setFollowUpDate,
    additionalNote,
    setAdditionalNote,
  } = useContext(CashManagerContext);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  // const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);

  const items = [
      {
          label: <div onClick={onResetClick}>Clear</div>,
          key: 'clear',
      },
  ];
  async function onResetClick() {
      setVitalsData([])
      setFollowUpDate(null)
  }

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  const showHideClearModal = useCallback(() => {
    setIsClearModalOpen(!isClearModalOpen);
  }, [isClearModalOpen]);

  const checkDataFillOrNot = () => {
    if (
      symptomsData.length > 0 ||
      examinationData.length > 0 ||
      diagnosisData.length > 0 ||
      medicationData.length > 0 ||
      adviceData.length > 0 ||
      investigationData.length > 0 ||
      vitalsData.length > 0 ||
      medicalHistoryData.length > 0
    ) {
      showHideBackModal();
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleClearClick = () => {
    setIsClearModalOpen(!isClearModalOpen);
    onClear(); // Call the parent's clear handler
  };

  const handleSubmitClick = async () => {
    onSubmit();
  };

  // Effect to handle updated data from parent
  useEffect(() => {
    if (smartRxData) {
    //   // Update payload with data from parent
    //   const updatedPayload = {
    //     ...smartRxData,
    //   };

    //   // Call API with updated payload
    //   callApi(updatedPayload);
      onEndVisitClick();
    }
  }, [smartRxData]);

  async function onEndVisitClick() {
    if (
      symptomsData.length > 0 &&
      symptomsData.filter((e) => e.symptom_name == "").length > 0
    ) {
      errorMessage("Please fillup symptom name");
    } else if (
      examinationData.length > 0 &&
      examinationData.filter((e) => e.examination_name == "").length > 0
    ) {
      errorMessage("Please fillup examination name");
    } else if (
      diagnosisData.length > 0 &&
      diagnosisData.filter((e) => e.tds_name == "").length > 0
    ) {
      errorMessage("Please fillup diagnosis name");
    } else if (
      medicationData.length > 0 &&
      medicationData.filter((e) => e.tmm_medicine_name == "").length > 0
    ) {
      errorMessage("Please fillup medication name");
    } else if (
      adviceData.length > 0 &&
      adviceData.filter((e) => e.advice_name == "").length > 0
    ) {
      errorMessage("Please fillup advice name");
    } else if (
      investigationData.length > 0 &&
      investigationData.filter((e) => e.investigation_name == "").length > 0
    ) {
      errorMessage("Please fillup investigation name");
    } else {
      var sendData = {
        action: tcmId == 0 ? "add" : "edit",
        tcm_id: tcmId,
        patient_unique_id:
          patient_data !== undefined ? patient_data.patient_unique_id : 0,
        pam_id:
          patient_data !== undefined
            ? patient_data.hasOwnProperty("pam_id")
              ? patient_data.pam_id
              : 0
            : 0,
        consultation_date: consultationDate,
        symptoms: symptomsData,
        examination: examinationData,
        diagnosis: diagnosisData,
        medicine: medicationData.map(({ medicineUnit, ...rest }) => rest),
        advice: adviceData,
        investigation: investigationData,
        vitals: vitalsData,
        follow_up_date: followUpDate,
        visit_advice: additionalNote,
        medical_history: medicalHistoryData,
        smart_prescription_filename:smartRxData,
      };

      // console.log(sendData,"send-data")
      const action =
        tcmId == 0
          ? await dispatch(addCaseManager(sendData))
          : await dispatch(editCaseManager(sendData));
      // console.log(action.meta.requestStatus,"action.meta.requestStatus")
      if (action.meta.requestStatus === "fulfilled") {
        // console.log("action.payload", { ...action.payload });
        // console.log("patient_data", patient_data);
        navigate('/print-smart-rx', { replace: true, state: { ...action.payload, patient_data: patient_data } })
      } else {
        errorMessage(action.error);
      }
    }
  }

  return (
    <Navbar className="justify-content-between headerprescription p-0">
      <Container fluid className="h-100 gx-0 w-100">
        <Row className="h-100 align-items-center w-100 justify-content-between">
          <Col lg="auto" className="h-100">
            <div className="align-items-center d-flex h-100">
              <div className="border-end h-100 text-center">
                <div
                  onClick={checkDataFillOrNot}
                  className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                >
                  <i className="icon-right"></i>
                </div>
                <CommonModal
                  isModalOpen={isBackModalOpen}
                  onCancel={showHideBackModal}
                  modalWidth={500}
                  title={"You may lose your data"}
                  modalBody={
                    <>
                      <div className="alert-warning rounded-10px p-2 patient-details">
                        <div className="d-flex align-items-center">
                          <img className="me-3" src={alertIcon} alt="Warning" />
                          <span>
                            Are you sure you want to leave? <br />
                            You will permanently lose your data.
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="d-flex align-items-center mt-2 justify-content-end">
                          <div
                            onClick={() => navigate("/", { replace: true })}
                            className="me-4 text-decoration-underline btn p-0 text-main"
                          >
                            Yes Leave
                          </div>
                          <Button
                            onClick={showHideBackModal}
                            className="lh-lg btn btn-primary3 btn-41 px-4"
                          >
                            <span>No, Stay</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  }
                />
              </div>
              <div className="p-4">Write Smart Prescription</div>
            </div>
          </Col>
          <Col lg="auto">
            <div className="align-items-center d-flex h-100">
              <div className="d-flex align-items-center">
                <button
                  className="btn d-flex align-items-center btn-play"
                  onClick={() => {}}
                >
                  <img
                    className="align-items-center d-flex"
                    src={tutorial}
                    alt="Warning"
                  />
                  <span>Tutorial</span>
                </button>
                {/* <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) ? "" : "Please enter some data to save a template"}>
                                    <button className='btn d-flex align-items-center btn-text' onClick={() => (symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) && handleDrawerSave()} > <i className="icon-save me-2"></i> <span>Save</span></button>
                                </Tooltip> */}
              </div>

              {/* <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0 || vitalsData.length > 0 || medicalHistoryData.length > 0 || followUpDate || additionalNote) ? "" : "Please fill your prescription to end visit."}> */}
              <Button
                type="button"
                className="btn align-items-center d-flex btn-41 btn-clear me-20"
                onClick={() => setIsClearModalOpen(!isClearModalOpen)}
                loading={loading}
                disabled={!prescription}
              >
                <img
                  className="align-items-center d-flex"
                  src={reload}
                  alt="Warning"
                />
                <span>Clear</span>
              </Button>
              {/* </Tooltip> */}

              <CommonModal
                isModalOpen={isClearModalOpen}
                onCancel={showHideClearModal}
                modalWidth={500}
                title={"You may lose your data"}
                modalBody={
                  <>
                    <div className="alert-warning rounded-10px p-2 patient-details">
                      <div className="d-flex align-items-center">
                        <img className="me-3" src={alertIcon} alt="Warning" />
                        <span>
                          Are you sure you want to clear this <br />
                          page data?
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="d-flex align-items-center mt-2 justify-content-end">
                        <div
                          onClick={() => handleClearClick()}
                          className="me-4 text-decoration-underline btn p-0 text-main"
                        >
                          Clear
                        </div>
                        <Button
                          onClick={showHideClearModal}
                          className="lh-lg btn btn-primary3 btn-41 px-4"
                        >
                          <span>No</span>
                        </Button>
                      </div>
                    </div>
                  </>
                }
              />

              {/* <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0 || vitalsData.length > 0 || medicalHistoryData.length > 0 || followUpDate || additionalNote) ? "" : "Please fill your prescription to end visit."}> */}
              <Button
                type="button"
                className="btn align-items-center d-flex btn-41 btn-primary3 me-20"
                onClick={handleSubmitClick}
                loading={loading}
                disabled={!prescription}
              >
                Submit
              </Button>
              {/* </Tooltip> */}
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default React.memo(HeaderPrescription);
