import React, { useState, useEffect, useCallback, useContext } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

import CashManagerContext from "../../../context/CashManagerContext";
import ProfilePopover from "../../../common/ProfilePopover";
import CommonModal from "../../../common/CommonModal";
import alertIcon from "../../../assets/images/alertIcon.svg";

import { removeBeforeWhiteSpace } from "../../../utils/utils";

import { useSelector, useDispatch } from "react-redux";

import {
  oneClickAddTemplate,
  oneClickUpdateTemplate,
  oneClickTemplatesList,
} from "../../../redux/caseManagerSlice";

function HeaderVaccine() {
  const { templates, loading } = useSelector((state) => state.caseManager);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {
    patient_data,
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
    setFollowUpDate,
    setAdditionalNote,
  } = useContext(CashManagerContext);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  //PopOver1
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeTemplateId, setRemoveTemplateId] = useState(null);

  //PopOver2
  const [popOver2, setPopOver2] = useState(false);
  const [inputTemplateName, setInputTemplateName] = useState(null);
  const TAB_ADD_TEMPLATE = 1;
  const TAB_UPDATE_TEMPLATE = 2;
  const ADD_EDIT_TEMPLATE_TABS = [
    { key: TAB_ADD_TEMPLATE, label: "New Template" },
    { key: TAB_UPDATE_TEMPLATE, label: "Update Template" },
  ];
  const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);

  const [saveDrawer, setSaveDrawer] = useState(false);

  useEffect(() => {
    dispatch(oneClickTemplatesList());
  }, []);

  useEffect(() => {
    setMatchedTemplates(templates);
    setAllTemplates(templates);
  }, [templates]);

  async function onResetClick() {
    setSymptomsData([]);
    setExaminationData([]);
    setDiagnosisData([]);
    setAdviceData([]);
    setInvestigationData([]);
    setMedicationData([]);
    setVitalsData([]);
    setFollowUpDate(null);
    setAdditionalNote("");
  }

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  // Handle Save Drawer
  const handleDrawerSave = useCallback(() => {
    setInputTemplateName(null);
    setSaveDrawer(!saveDrawer);
  }, [saveDrawer]);

  //PopOver2 function
  const showHideSaveTemplatePopOver = useCallback(() => {
    setPopOver2(!popOver2);
  }, [popOver2]);

  const onTabChange = useCallback(
    (key) => {
      setInputTemplateName(null);
      setTabChange(key);
    },
    [tabChange]
  );

  const onChangeSaveTemplate = useCallback(
    (e) => {
      const updateQuery = removeBeforeWhiteSpace(e.target.value);
      setInputTemplateName(updateQuery);
    },
    [inputTemplateName]
  );

  const onAddTemplateClicked = async () => {
    let updatedMedication = [];
    if (!isMobile) {
      updatedMedication = [...medicationData];
    } else {
      updatedMedication = medicationData.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            tmu_id: JSON.parse(e1.key).tmu_id,
            tmu_title: JSON.parse(e1.key).tmu_title,
          };
        });

        return {
          ...e,
          medicineUnit: medicineUnit,
        };
      });
    }

    var sendData = {
      tmoc_template_name: inputTemplateName,
      data: {
        symptoms: symptomsData.map(({ symptom_name, change }) => ({
          symptom_name,
          ...(change !== undefined && { change }),
        })),
        examination: examinationData.map(({ examination_name, change }) => ({
          examination_name,
          ...(change !== undefined && { change }),
        })),
        diagnosis: diagnosisData.map(
          ({ tds_id, tds_name, status, pms_default }) => ({
            tds_id,
            tds_name,
            status,
            pms_default,
          })
        ),
        medicine: updatedMedication,
        advice: adviceData.map(({ advice_name, change }) => ({
          advice_name,
          ...(change !== undefined && { change }),
        })),
        investigation: investigationData.map(
          ({ investigation_name, change }) => ({
            investigation_name,
            ...(change !== undefined && { change }),
          })
        ),
      },
    };

    const action = await dispatch(oneClickAddTemplate(sendData));
    if (action.meta.requestStatus === "fulfilled") {
      // const updatedData = symptomsData.map(e => {
      //     const obj = { ...e };
      //     delete obj['change'];
      //     return obj;
      //     return { ...e, change: 0 }
      // })
      if (symptomsData.length > 0) {
        const updatedData = symptomsData.map((e) => {
          return { ...e, change: 0 };
        });
        setSymptomsData(updatedData);
      }

      if (examinationData.length > 0) {
        const updatedData = examinationData.map((e) => {
          return { ...e, change: 0 };
        });
        setExaminationData(updatedData);
      }

      if (diagnosisData.length > 0) {
        const fetchDiagnosisList = action.payload.diagnosis;
        const updatedData = diagnosisData.map((e, i) => {
          return { ...e, ...fetchDiagnosisList[i] };
        });
        setDiagnosisData(updatedData);
      }

      if (adviceData.length > 0) {
        const updatedData = adviceData.map((e) => {
          return { ...e, change: 0 };
        });
        setAdviceData(updatedData);
      }

      if (investigationData.length > 0) {
        const updatedData = investigationData.map((e) => {
          return { ...e, change: 0 };
        });
        setInvestigationData(updatedData);
      }

      setInputTemplateName(null);
      !isMobile ? showHideSaveTemplatePopOver() : handleDrawerSave();
    }
  };

  const onSearchTemplate = useCallback(() => {
    setInputTemplateName(null);
  }, [inputTemplateName]);

  const onSelectTemplate = useCallback(
    (data, e) => {
      setInputTemplateName(e.key);
    },
    [inputTemplateName]
  );

  const onUpdateTemplateClicked = async () => {
    let updatedMedication = [];
    if (!isMobile) {
      updatedMedication = [...medicationData];
    } else {
      updatedMedication = medicationData.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            tmu_id: JSON.parse(e1.key).tmu_id,
            tmu_title: JSON.parse(e1.key).tmu_title,
          };
        });

        return {
          ...e,
          medicineUnit: medicineUnit,
        };
      });
    }

    var data = JSON.parse(inputTemplateName);
    var sendData = {
      tmoc_id: data.tmoc_id,
      tmoc_template_name: data.tmoc_template_name,
      data: {
        symptoms: symptomsData.map(({ symptom_name, change }) => ({
          symptom_name,
          ...(change !== undefined && { change }),
        })),
        examination: examinationData.map(({ examination_name, change }) => ({
          examination_name,
          ...(change !== undefined && { change }),
        })),
        diagnosis: diagnosisData.map(
          ({ tds_id, tds_name, status, pms_default }) => ({
            tds_id,
            tds_name,
            status,
            pms_default,
          })
        ),
        medicine: updatedMedication,
        advice: adviceData.map(({ advice_name, change }) => ({
          advice_name,
          ...(change !== undefined && { change }),
        })),
        investigation: investigationData.map(
          ({ investigation_name, change }) => ({
            investigation_name,
            ...(change !== undefined && { change }),
          })
        ),
      },
    };
    const action = await dispatch(oneClickUpdateTemplate(sendData));
    if (action.meta.requestStatus === "fulfilled") {
      // const updatedData = symptomsData.map(e => {
      //     const obj = { ...e };
      //     delete obj['change'];
      //     return obj;
      //     return { ...e, change: 0 }
      // })
      if (symptomsData.length > 0) {
        const updatedData = symptomsData.map((e) => {
          return { ...e, change: 0 };
        });
        setSymptomsData(updatedData);
      }

      if (examinationData.length > 0) {
        const updatedData = examinationData.map((e) => {
          return { ...e, change: 0 };
        });
        setExaminationData(updatedData);
      }

      if (diagnosisData.length > 0) {
        const fetchDiagnosisList = action.payload.diagnosis;
        const updatedData = diagnosisData.map((e, i) => {
          return { ...e, ...fetchDiagnosisList[i] };
        });
        setDiagnosisData(updatedData);
      }

      if (adviceData.length > 0) {
        const updatedData = adviceData.map((e) => {
          return { ...e, change: 0 };
        });
        setAdviceData(updatedData);
      }

      if (investigationData.length > 0) {
        const updatedData = investigationData.map((e) => {
          return { ...e, change: 0 };
        });
        setInvestigationData(updatedData);
      }

      setInputTemplateName(null);
      !isMobile ? showHideSaveTemplatePopOver() : handleDrawerSave();
    }
  };

  const showHideModal = useCallback(
    (template_id) => {
      template_id !== undefined
        ? setRemoveTemplateId(template_id)
        : setRemoveTemplateId(null);
      setIsModalOpen(!isModalOpen);
    },
    [isModalOpen]
  );

  const checkDataFillOrNot = () => {
    if (
      symptomsData.length > 0 ||
      examinationData.length > 0 ||
      diagnosisData.length > 0 ||
      medicationData.length > 0 ||
      adviceData.length > 0 ||
      investigationData.length > 0 ||
      vitalsData.length > 0
    ) {
      showHideBackModal();
    } else {
      navigate("/", { replace: true });
    }
  };

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
              <ProfilePopover patient_data={patient_data} />
            </div>
          </Col>
          <Col lg="auto">
            <div className="align-items-center d-flex h-100">
              <Button
                type="button"
                className="btn-41 btn px-4 me-4 ant-btn-text btn-input"
                // onClick={onCustomizePadClick}
                loading={loading}
              >
                Save
              </Button>
              <Button
                type="button"
                className="btn-41 btn px-4 me-4 ant-btn-text btn-input"
                // onClick={onCustomizePadClick}
                loading={loading}
              >
                Print
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default React.memo(HeaderVaccine);
