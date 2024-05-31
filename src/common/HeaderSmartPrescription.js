import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Button, Dropdown, Tooltip, Popover, Input, Spin, Tabs, Select, Drawer } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';

import CustomizeSetting from './CustomizeSetting';

import CashManagerContext from "../context/CashManagerContext";
import ProfilePopover from './ProfilePopover';
import CommonModal from './CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';
import reload from '../assets/images/ic_Reload.svg';
import tutorial from '../assets/images/tutorial.svg';

import { errorMessage, removeBeforeWhiteSpace } from "../utils/utils";

import { useSelector, useDispatch } from "react-redux";

import {
    oneClickAddTemplate,
    oneClickUpdateTemplate,
    oneClickDeleteTemplate,
    oneClickTemplatesList,
    oneClickSingleTemplateDetails,
    addCaseManager,
    editCaseManager
} from "../redux/caseManagerSlice";

function HeaderPrescription({prescription, onClear, onSubmit}) {

    const { frequencyList, timingList } = useSelector((state) => state.doctors);

    const {
        templates,
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { patient_data, tcmId, consultationDate, symptomsData, setSymptomsData, examinationData, setExaminationData, diagnosisData, setDiagnosisData, adviceData, setAdviceData, investigationData, setInvestigationData, medicationData, setMedicationData, vitalsData, setVitalsData, medicalHistoryData, setMedicalHistoryData, followUpDate, setFollowUpDate, additionalNote, setAdditionalNote } = useContext(CashManagerContext);

    const [isBackModalOpen, setIsBackModalOpen] = useState(false);

    //PopOver1
    const [popOver1, setPopOver1] = useState(false);
    const [allTemplates, setAllTemplates] = useState([]);
    const [matchedTemplates, setMatchedTemplates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
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

    const [templateDrawer, setTemplateDrawer] = useState(false);
    const [saveDrawer, setSaveDrawer] = useState(false);

    const [customizeDrawer, setCustomizeDrawer] = useState(false);

    useEffect(() => {
        dispatch(oneClickTemplatesList());
    }, []);

    useEffect(() => {
        setMatchedTemplates(templates);
        setAllTemplates(templates);
    }, [templates]);

    const items = [
        {
            label: <div onClick={onResetClick}>Clear</div>,
            key: 'clear',
        },
    ];
    async function onResetClick() {
        setSymptomsData([])
        setExaminationData([])
        setDiagnosisData([])
        setAdviceData([])
        setInvestigationData([])
        setMedicationData([])
        setVitalsData([])
        setMedicalHistoryData([])
        setFollowUpDate(null)
        setAdditionalNote('')
    }

    const showHideBackModal = useCallback(() => {
        setIsBackModalOpen(!isBackModalOpen);
    }, [isBackModalOpen]);

    const showHideClearModal = useCallback(() => {
        setIsClearModalOpen(!isClearModalOpen);
    }, [isClearModalOpen]);

    // Handle Save Drawer
    const handleDrawerSave = useCallback(() => {
        setInputTemplateName(null);
        setSaveDrawer(!saveDrawer);
    }, [saveDrawer]);

    //PopOver1 function
    const showHideTemplatesListPopover = useCallback(() => {
        setPopOver1(!popOver1);
    }, [popOver1]);

    const onSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery) {
            let filteredTemplates = templates.filter((template) => {
                return template.tmoc_template_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
            setMatchedTemplates(filteredTemplates);
        } else {
            setMatchedTemplates(templates);
        }
    };

    const onTemplateSelected = async (tmoc_id, tmoc_template_name) => {
        window.Moengage.track_event("one_click_template_select", {
            "template_name": tmoc_template_name
        });
        const action = await dispatch(oneClickSingleTemplateDetails(tmoc_id));
        if (action.meta.requestStatus === "fulfilled") {
            const data = action.payload
            if (data !== undefined) {
                if (data.symptoms.length > 0) {
                    const updatedData = data.symptoms.map(e => {
                        return { ...e, unique_id: uuidv4(), since: "", severity: "", note: "" }
                    })
                    setSymptomsData([...symptomsData, ...updatedData]);
                }
                if (data.examination.length > 0) {
                    const updatedData = data.examination.map(e => {
                        return { ...e, unique_id: uuidv4(), note: "" }
                    })
                    setExaminationData([...examinationData, ...updatedData]);
                }
                if (data.diagnosis.length > 0) {
                    const updatedData = data.diagnosis.map(e => {
                        return { ...e, unique_id: uuidv4(), since: "", status: e.hasOwnProperty('status') ? e.status : "", note: "" }
                    })
                    setDiagnosisData([...diagnosisData, ...updatedData]);
                }
                if (data.advice.length > 0) {
                    const updatedData = data.advice.map(e => {
                        return { ...e, unique_id: uuidv4() }
                    })
                    setAdviceData([...adviceData, ...updatedData]);
                }
                if (data.investigation.length > 0) {
                    const updatedData = data.investigation.map(e => {
                        return { ...e, unique_id: uuidv4(), note: "" }
                    })
                    setInvestigationData([...investigationData, ...updatedData]);
                }
                if (data.medicine.length > 0) {
                    if (!isMobile) {
                        const updatedData = data.medicine.map((e) => {

                            const unitObj = e?.medicineUnit ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit) : null;
                            const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
                            const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

                            return {
                                ...e,
                                tmm_unit_name: unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
                                tmm_freq_type_name: e.tmf_block == 0 ?
                                    `${e.tcm_tmm_freq_morning ? e.tcm_tmm_freq_morning + " - " : "0 -"}${e.tcm_tmm_freq_afternoon ? e.tcm_tmm_freq_afternoon + " - " : "0 -"}${e.tcm_tmm_freq_evening ? e.tcm_tmm_freq_evening + " - " : "0 -"}${e.tcm_tmm_freq_night ? e.tcm_tmm_freq_night : "0"}`
                                    : frequencyObj !== undefined ? frequencyObj.tmf_title : "",
                                tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
                                tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
                                tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
                                tmm_days_duration_type: `${e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""}`,
                                unique_id: uuidv4(),
                            };
                        });
                        setMedicationData([...medicationData, ...updatedData])
                    } else {
                        const updatedData = data.medicine.map((e) => {
                            const medicineUnit = e?.medicineUnit.map((e1) => {
                                return {
                                    key: JSON.stringify({ ...e1 }),
                                    value: e1.tmu_id,
                                    label: <>{e1.tmu_title}</>,
                                };
                            });

                            const unitObj = medicineUnit
                                ? medicineUnit.find((x) => x.value == e.tmm_unit)
                                : null;
                            const frequencyObj = frequencyList.find(
                                (x) => x.tmf_id == e.tmm_freq_type
                            );
                            const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

                            return {
                                ...e,
                                tmm_unit_name:
                                    unitObj && unitObj !== undefined
                                        ? JSON.parse(unitObj.key).tmu_title
                                        : "",
                                tmm_freq_type_name:
                                    frequencyObj !== undefined ? frequencyObj.tmf_title : "",
                                tmf_block_val:
                                    frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
                                tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
                                medicineUnit: medicineUnit,
                                tmm_days_duration_type: `${e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""}`,
                                unique_id: uuidv4(),
                            };
                        });
                        setMedicationData([...medicationData, ...updatedData])
                    }
                }
            }
        } else {
            errorMessage(action.error)
        }
    };

    const onDeleteTemplateClicked = async (tmoc_id) => {
        const action = await dispatch(oneClickDeleteTemplate(tmoc_id));
        if (action.meta.requestStatus === "rejected") {
            errorMessage(action.error)
        }
    };

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
            const updateQuery = removeBeforeWhiteSpace(e.target.value)
            setInputTemplateName(updateQuery);
        },
        [inputTemplateName]
    );

    const onAddTemplateClicked = async () => {
        let updatedMedication = []
        if (!isMobile) {
            updatedMedication = [...medicationData]
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
                symptoms: symptomsData.map(({ symptom_name, change }) => ({ symptom_name, ...(change !== undefined && { change }) })),
                examination: examinationData.map(({ examination_name, change }) => ({ examination_name, ...(change !== undefined && { change }) })),
                diagnosis: diagnosisData.map(({ tds_id, tds_name, status, pms_default }) => ({ tds_id, tds_name, status, pms_default })),
                medicine: updatedMedication,
                advice: adviceData.map(({ advice_name, change }) => ({ advice_name, ...(change !== undefined && { change }) })),
                investigation: investigationData.map(({ investigation_name, change }) => ({ investigation_name, ...(change !== undefined && { change }) }))
            }
        }

        const action = await dispatch(oneClickAddTemplate(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            // const updatedData = symptomsData.map(e => {
            //     const obj = { ...e };
            //     delete obj['change'];
            //     return obj;
            //     return { ...e, change: 0 }
            // })
            if (symptomsData.length > 0) {
                const updatedData = symptomsData.map(e => {
                    return { ...e, change: 0 }
                })
                setSymptomsData(updatedData)
            }

            if (examinationData.length > 0) {
                const updatedData = examinationData.map(e => {
                    return { ...e, change: 0 }
                })
                setExaminationData(updatedData)
            }

            if (diagnosisData.length > 0) {
                const fetchDiagnosisList = action.payload.diagnosis
                const updatedData = diagnosisData.map((e, i) => {
                    return { ...e, ...fetchDiagnosisList[i] }
                })
                setDiagnosisData(updatedData)
            }

            if (adviceData.length > 0) {
                const updatedData = adviceData.map(e => {
                    return { ...e, change: 0 }
                })
                setAdviceData(updatedData)
            }

            if (investigationData.length > 0) {
                const updatedData = investigationData.map(e => {
                    return { ...e, change: 0 }
                })
                setInvestigationData(updatedData)
            }

            setInputTemplateName(null);
            !isMobile ? showHideSaveTemplatePopOver() : handleDrawerSave()
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
        let updatedMedication = []
        if (!isMobile) {
            updatedMedication = [...medicationData]
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
                symptoms: symptomsData.map(({ symptom_name, change }) => ({ symptom_name, ...(change !== undefined && { change }) })),
                examination: examinationData.map(({ examination_name, change }) => ({ examination_name, ...(change !== undefined && { change }) })),
                diagnosis: diagnosisData.map(({ tds_id, tds_name, status, pms_default }) => ({ tds_id, tds_name, status, pms_default })),
                medicine: updatedMedication,
                advice: adviceData.map(({ advice_name, change }) => ({ advice_name, ...(change !== undefined && { change }) })),
                investigation: investigationData.map(({ investigation_name, change }) => ({ investigation_name, ...(change !== undefined && { change }) }))
            }
        }
        const action = await dispatch(oneClickUpdateTemplate(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            // const updatedData = symptomsData.map(e => {
            //     const obj = { ...e };
            //     delete obj['change'];
            //     return obj;
            //     return { ...e, change: 0 }
            // })
            if (symptomsData.length > 0) {
                const updatedData = symptomsData.map(e => {
                    return { ...e, change: 0 }
                })
                setSymptomsData(updatedData)
            }

            if (examinationData.length > 0) {
                const updatedData = examinationData.map(e => {
                    return { ...e, change: 0 }
                })
                setExaminationData(updatedData)
            }

            if (diagnosisData.length > 0) {
                const fetchDiagnosisList = action.payload.diagnosis
                const updatedData = diagnosisData.map((e, i) => {
                    return { ...e, ...fetchDiagnosisList[i] }
                })
                setDiagnosisData(updatedData)
            }

            if (adviceData.length > 0) {
                const updatedData = adviceData.map(e => {
                    return { ...e, change: 0 }
                })
                setAdviceData(updatedData)
            }

            if (investigationData.length > 0) {
                const updatedData = investigationData.map(e => {
                    return { ...e, change: 0 }
                })
                setInvestigationData(updatedData)
            }

            setInputTemplateName(null);
            !isMobile ? showHideSaveTemplatePopOver() : handleDrawerSave()
        }

    };

    const showHideModal = useCallback((template_id) => {
        template_id !== undefined ? setRemoveTemplateId(template_id) : setRemoveTemplateId(null)
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    //Save Componet Web
    const SAVE_CONTENT_WEB = useCallback(() => {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
                    <Tabs
                        defaultActiveKey={TAB_ADD_TEMPLATE}
                        items={ADD_EDIT_TEMPLATE_TABS}
                        onChange={onTabChange}
                        className="w-100"
                    />
                    <Button
                        className="btn btn-delete-prescription"
                        onClick={showHideSaveTemplatePopOver}
                    >
                        <i className="icon-Cross"></i>
                    </Button>
                </div>
                {tabChange === TAB_ADD_TEMPLATE ? (
                    <div className="pop-header d-flex">
                        <Input
                            allowClear
                            value={inputTemplateName && inputTemplateName}
                            className="popinput inputheight41"
                            placeholder="Template Name"
                            onChange={onChangeSaveTemplate}
                        />
                        <Button
                            className="btn btn-primary3 btn-41 ms-3"
                            loading={loading}
                            disabled={inputTemplateName ? false : true}
                            onClick={onAddTemplateClicked}
                        >
                            {" Save "}
                        </Button>
                    </div>
                ) : (
                    <div className="pop-header d-flex">
                        <Select
                            showSearch
                            value={inputTemplateName && JSON.parse(inputTemplateName).tmoc_template_name}
                            className="autocomplete-custom w-100 popinput inputheight41"
                            placeholder="Select Template"
                            onSearch={onSearchTemplate}
                            onSelect={onSelectTemplate}
                            optionLabelProp="label"
                            options={allTemplates.map((template) => {
                                return {
                                    key: JSON.stringify(template),
                                    value: template.tmoc_template_name,
                                    label: (
                                        <div key={template.tst_id}>
                                            {template.tmoc_template_name}
                                        </div>
                                    ),
                                };
                            })}
                            optionRender={(option) => (
                                <div className="align-items-center d-flex text-truncate w-100">
                                    <div className="round-box"><i className="icon-template"></i></div>
                                    <div className="text-truncate w-100">
                                        <div className="title text-main2">{option.data.value}</div>
                                        <div className="text-truncate">{JSON.parse(option.data.key).medicine_name}</div>
                                    </div>
                                </div>
                            )}
                        />
                        <Button
                            className="btn btn-primary3 btn-41 ms-3"
                            loading={loading}
                            disabled={inputTemplateName ? false : true}
                            onClick={onUpdateTemplateClicked}
                        >
                            {" Update "}
                        </Button>
                    </div>
                )}
            </>
        );
    }, [tabChange, popOver2, inputTemplateName, loading, allTemplates]);

    const checkDataFillOrNot = () => {
        if (symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || medicationData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || vitalsData.length > 0 || medicalHistoryData.length > 0) {
            showHideBackModal()
        } else {
            navigate('/', { replace: true });
        }
    }

    const handleClearClick = () => {
        setIsClearModalOpen(!isClearModalOpen)
        onClear(); // Call the parent's clear handler
    };

    const handleSubmitClick = () => {
        onSubmit();
        onEndVisitClick() // Call the parent's submit handler with the current input data
    };

    async function onEndVisitClick() {
        if (symptomsData.length > 0 && symptomsData.filter(e => e.symptom_name == "").length > 0) {
            errorMessage('Please fillup symptom name')
        } else if (examinationData.length > 0 && examinationData.filter(e => e.examination_name == "").length > 0) {
            errorMessage('Please fillup examination name')
        } else if (diagnosisData.length > 0 && diagnosisData.filter((e) => e.tds_name == "").length > 0) {
            errorMessage('Please fillup diagnosis name')
        } else if (medicationData.length > 0 && medicationData.filter((e) => e.tmm_medicine_name == "").length > 0) {
            errorMessage('Please fillup medication name')
        } else if (adviceData.length > 0 && adviceData.filter(e => e.advice_name == "").length > 0) {
            errorMessage('Please fillup advice name')
        } else if (investigationData.length > 0 && investigationData.filter(e => e.investigation_name == "").length > 0) {
            errorMessage('Please fillup investigation name')
        } else {
            var sendData = {
                action: tcmId == 0 ? 'add' : 'edit',
                tcm_id: tcmId,
                patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
                pam_id: patient_data !== undefined ? patient_data.hasOwnProperty('pam_id') ? patient_data.pam_id : 0 : 0,
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
                medical_history: medicalHistoryData
            }

            const action = tcmId == 0 ? await dispatch(addCaseManager(sendData)) : await dispatch(editCaseManager(sendData))
            if (action.meta.requestStatus === "fulfilled") {
                navigate('/print-smart-rx', { replace: true, state: { ...action.payload, patient_data: patient_data } })
            } else {
                errorMessage(action.error)
            }
        }
    }

    console.log(prescription,"prescription")
    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <Container fluid className='h-100 gx-0 w-100'>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col lg="auto" className='h-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center'>
                                <div onClick={checkDataFillOrNot} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
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
                                                    <img className='me-3' src={alertIcon} alt="Warning" />
                                                    <span>
                                                        Are you sure you want to leave? <br />
                                                        You will permanently lose your data.
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="d-flex align-items-center mt-2 justify-content-end">
                                                    <div onClick={() => navigate('/', { replace: true })} className="me-4 text-decoration-underline btn p-0 text-main">
                                                        Yes Leave
                                                    </div>
                                                    <Button onClick={showHideBackModal} className="lh-lg btn btn-primary3 btn-41 px-4">
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
                        <div className='align-items-center d-flex h-100'>
                            <div className="d-flex align-items-center">
                                <button className='btn d-flex align-items-center btn-play' onClick={() => {}}>
                                    <img className='align-items-center d-flex' src={tutorial} alt="Warning" />
                                    <span>Tutorial</span>
                                </button>
                                {/* <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) ? "" : "Please enter some data to save a template"}>
                                    <button className='btn d-flex align-items-center btn-text' onClick={() => (symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) && handleDrawerSave()} > <i className="icon-save me-2"></i> <span>Save</span></button>
                                </Tooltip> */}
                            </div>

                            <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0 || vitalsData.length > 0 || medicalHistoryData.length > 0 || followUpDate || additionalNote) ? "" : "Please fill your prescription to end visit."}>
                                <Button type='button' className='btn align-items-center d-flex btn-41 btn-clear me-20' onClick={() => setIsClearModalOpen(!isClearModalOpen)} loading={loading} disabled={!prescription}>
                                    <img className='align-items-center d-flex' src={reload} alt="Warning" />
                                    <span>Clear</span>
                                </Button>
                            </Tooltip>

                            <CommonModal
                                    isModalOpen={isClearModalOpen}
                                    onCancel={showHideClearModal}
                                    modalWidth={500}
                                    title={"You may lose your data"}
                                    modalBody={
                                        <>
                                            <div className="alert-warning rounded-10px p-2 patient-details">
                                                <div className="d-flex align-items-center">
                                                    <img className='me-3' src={alertIcon} alt="Warning" />
                                                    <span>
                                                        Are you sure you want to clear this <br />
                                                        page data?
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="d-flex align-items-center mt-2 justify-content-end">
                                                    <div onClick={() => handleClearClick()} className="me-4 text-decoration-underline btn p-0 text-main">
                                                        Clear
                                                    </div>
                                                    <Button onClick={showHideClearModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                                        <span>No</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    }
                                />

                            <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0 || vitalsData.length > 0 || medicalHistoryData.length > 0 || followUpDate || additionalNote) ? "" : "Please fill your prescription to end visit."}>
                                <Button type='button' className='btn align-items-center d-flex btn-41 btn-primary3 me-20' onClick={handleSubmitClick} loading={loading} disabled={!prescription}>
                                    Submit
                                </Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default React.memo(HeaderPrescription);