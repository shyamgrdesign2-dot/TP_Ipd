import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Button, Dropdown, message, Tooltip, Popover, Input, Spin, Tabs, Select, Drawer } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';

import CustomizeSetting from './CustomizeSetting';

import CashManagerContext from "../context/CashManagerContext";
import ProfilePopover from './ProfilePopover';
import CommonModal from './CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';

import { removeBeforeWhiteSpace } from "../utils/utils";
import { MESSAGE_KEY } from "../utils/constants";

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

function HeaderPrescription() {

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
        setFollowUpDate(null)
        setAdditionalNote('')
    }
    // const languageItems = [
    //     {
    //         label: '1st menu item',
    //         key: '0',
    //     },
    //     {
    //         label: '2nd menu item',
    //         key: '1',
    //     },
    //     {
    //         label: '3rd menu item',
    //         key: '3',
    //     },
    // ];

    const showHideBackModal = useCallback(() => {
        setIsBackModalOpen(!isBackModalOpen);
    }, [isBackModalOpen]);

    // Handle Template Drawer
    const handleDrawerTemplate = useCallback(() => {
        setTemplateDrawer(!templateDrawer);
    }, [templateDrawer]);

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
            !isMobile ? showHideTemplatesListPopover() : handleDrawerTemplate()
        } else {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: action.error.message,
                duration: 2
            });
        }
    };

    const onDeleteTemplateClicked = async (tmoc_id) => {
        const action = await dispatch(oneClickDeleteTemplate(tmoc_id));
        if (action.meta.requestStatus === "rejected") {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: action.error.message,
                duration: 2
            });
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

    //Template Remove
    const DELETE_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={isModalOpen}
                onCancel={showHideModal}
                modalWidth={500}
                title={"You may lose your data"}
                modalBody={
                    <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={alertIcon} alt="Warning" />
                                <span>
                                    Are you sure you want to delete this template?
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2 justify-content-end">
                                <div onClick={() => {
                                    onDeleteTemplateClicked(removeTemplateId)
                                    showHideModal()
                                }}
                                    className="me-4 text-decoration-underline btn p-0 text-main">
                                    Yes Delete
                                </div>
                                <Button onClick={showHideModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                    <span>No</span>
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        );
    }, [isModalOpen]);

    //Template Componet Web
    const TEMPLATE_CONTENT_WEB = useCallback(() => {
        return (
            <>
                <div className="pop-header" key="oneclickrx-template">
                    <div className="align-items-center d-flex justify-content-between">
                        <div className="title-common">One Click Rx Templates</div>
                        <Button
                            className="btn btn-delete-prescription p-0"
                            onClick={showHideTemplatesListPopover}
                        >
                            <i className="icon-Cross" />
                        </Button>
                    </div>
                    <div className="mt-3" key="symptoms-template-search">
                        <Input
                            allowClear
                            className="popinput"
                            onChange={onSearch}
                            placeholder="Search Templates"
                            prefix={<i className="icon-search me-2" />}
                        />
                    </div>
                </div>
                <div className="pop-body">
                    {matchedTemplates.length > 0 &&
                        matchedTemplates.map((template, i) => {
                            return (
                                <div
                                    className="align-items-center d-flex medicine-templates"
                                    key={i}
                                >
                                    <div
                                        className="round-box"
                                        onClick={() => onTemplateSelected(template.tmoc_id, template.tmoc_template_name)}
                                    >
                                        <i className="icon-template"></i>
                                    </div>
                                    <div
                                        className="text-truncate w-100"
                                        onClick={() => onTemplateSelected(template.tmoc_id, template.tmoc_template_name)}
                                    >
                                        <div className="title text-main2">{template.tmoc_template_name}</div>
                                        <div className="text-truncate">{template.medicine_name}</div>
                                    </div>
                                    <Button
                                        className="btn btn-delete-prescription p-0 ms-2"
                                        onClick={() => {
                                            showHideModal(template.tmoc_id)
                                            showHideTemplatesListPopover()
                                        }}
                                    >
                                        {template.loading ? (
                                            <Spin
                                                indicator={
                                                    <LoadingOutlined style={{ fontSize: 22 }} spin />
                                                }
                                            />
                                        ) : (
                                            <i className="icon-delete"></i>
                                        )}
                                    </Button>
                                </div>
                            );
                        })}
                </div>
            </>
        );
    }, [popOver1, matchedTemplates]);

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

    //Template Componet Tab
    const TEMPLATE_CONTENT_TAB = useMemo(() => {
        return (
            <>
                <div>
                    <div className="medicine-templates">
                        <Input className="popinput" onChange={onSearch} placeholder="Search Templates" prefix={<i className='icon-search me-2'></i>} allowClear />
                    </div>
                    <div className="tab-template-height" >
                        {matchedTemplates.length > 0 &&
                            matchedTemplates.map((template, i) => {
                                return (
                                    <div className="align-items-center d-flex justify-content-between medicine-templates" key={i}>
                                        <div className="align-items-center d-flex text-truncate w-100" onClick={() => onTemplateSelected(template.tmoc_id, template.tmoc_template_name)}>
                                            <div className="round-box"><i className="icon-template"></i></div>
                                            <div className="text-truncate w-100">
                                                <div className="title text-main2">{template.tmoc_template_name}</div>
                                                <div className="text-truncate">{template.medicine_name}</div>
                                            </div>
                                        </div>
                                        <Button className="btn btn-delete-prescription p-0 ms-3" onClick={() => showHideModal(template.tmoc_id)}>
                                            {template.loading ? (
                                                <Spin
                                                    indicator={
                                                        <LoadingOutlined style={{ fontSize: 22 }} spin />
                                                    }
                                                />
                                            ) : (
                                                <i className="icon-delete"></i>
                                            )}
                                        </Button>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </>
        );
    }, [templateDrawer, matchedTemplates]);

    //Save Componet Tab
    const SAVE_CONTENT_TAB = useMemo(() => {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
                    <Tabs
                        defaultActiveKey={TAB_ADD_TEMPLATE}
                        items={ADD_EDIT_TEMPLATE_TABS}
                        onChange={onTabChange}
                        className="w-100" />
                </div>
                {tabChange === TAB_ADD_TEMPLATE ? (
                    <div className="medicine-templates d-flex">
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
                    <div className="medicine-templates d-flex">
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
    }, [tabChange, saveDrawer, inputTemplateName, loading, allTemplates]);

    // Handle Customize Drawer
    const handleDrawerCustomize = useCallback(() => {
        setCustomizeDrawer(!customizeDrawer);
    }, [customizeDrawer]);

    const CUSTOMIZE_CONTENT_TAB = useMemo(() => {
        return (
            <CustomizeSetting handleDrawerCustomize={handleDrawerCustomize} />
        );
    }, [customizeDrawer]);

    async function onEndVisitClick() {
        if (symptomsData.length > 0 && symptomsData.filter(e => e.symptom_name == "").length > 0) {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup symptom name',
                duration: 2
            });
        } else if (examinationData.length > 0 && examinationData.filter(e => e.examination_name == "").length > 0) {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup examination name',
                duration: 2
            });
        } else if (diagnosisData.length > 0 && diagnosisData.filter((e) => e.tds_name == "").length > 0) {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup diagnosis name',
                duration: 2
            });
        } else if (medicationData.length > 0 && medicationData.filter((e) => e.tmm_medicine_name == "").length > 0) {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup medication name',
                duration: 2
            });
        } else if (adviceData.length > 0 && adviceData.filter(e => e.advice_name == "").length > 0) {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup advice name',
                duration: 2
            });
        } else if (investigationData.length > 0 && investigationData.filter(e => e.investigation_name == "").length > 0) {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup investigation name',
                duration: 2
            });
        } else {
            const medicalHistory = medicalHistoryData?.map((e, i) => {
                return {
                    ...e,
                    no_know_history: e?.no_know_history !== undefined ? e?.no_know_history : false,
                    tags: !e?.no_know_history ? e?.tags?.filter(x => x.enable == 'Y' || x.enable == 'N') : []
                }
            })
            
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
                medical_history: medicalHistory.filter(e => !e?.no_know_history && e?.tags?.length === 0).length === medicalHistory.length ? [] : medicalHistory
            }

            const action = tcmId == 0 ? await dispatch(addCaseManager(sendData)) : await dispatch(editCaseManager(sendData))
            if (action.meta.requestStatus === "fulfilled") {
                navigate('/prescription_print_view', { replace: true, state: { ...action.payload, patient_data: patient_data } })
            } else {
                message.open({
                    key: MESSAGE_KEY,
                    type: 'warning',
                    content: action.error.message,
                    duration: 2
                });
            }
        }
    }

    const checkDataFillOrNot = () => {
        if (symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || medicationData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || vitalsData.length > 0) {
            showHideBackModal()
        } else {
            navigate('/', { replace: true });
        }
    }

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
                            <ProfilePopover patient_data={patient_data} />
                        </div>
                    </Col>
                    <Col lg="auto">
                        <div className='align-items-center d-flex h-100'>
                            {!isMobile ? (
                                <div className="d-flex align-items-center">
                                    <Popover
                                        open={popOver1}
                                        onOpenChange={showHideTemplatesListPopover}
                                        content={TEMPLATE_CONTENT_WEB}
                                        trigger="click"
                                        overlayClassName="pop-350 pp-0"
                                        placement="bottom"
                                    >
                                        <button className="btn d-flex align-items-center btn-text">
                                            {" "}
                                            <i className="icon-template me-2"></i> <span>Templates</span>
                                        </button>
                                    </Popover>
                                    <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) ? "" : "Please enter some data to save a template"}>
                                        <Popover
                                            open={popOver2}
                                            onOpenChange={() => (symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) && showHideSaveTemplatePopOver()}
                                            content={SAVE_CONTENT_WEB}
                                            trigger="click"
                                            overlayClassName="pop-450 pp-0"
                                            placement="bottom"
                                        >
                                            <button className="btn d-flex align-items-center btn-text">
                                                {" "}
                                                <i className="icon-save me-2"></i> <span>Save</span>
                                            </button>

                                        </Popover>
                                    </Tooltip>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center">
                                    <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerTemplate}>
                                        <i className="icon-template me-2"></i> <span>Templates</span>
                                    </button>
                                    <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) ? "" : "Please enter some data to save a template"}>
                                        <button className='btn d-flex align-items-center btn-text' onClick={() => (symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0) && handleDrawerSave()} > <i className="icon-save me-2"></i> <span>Save</span></button>
                                    </Tooltip>
                                </div>
                            )}

                            {DELETE_MODAL}

                            <button className='btn d-flex align-items-center btn-text me-14' onClick={handleDrawerCustomize}>
                                <i className="icon-setting me-2"></i> <span>Customize</span>
                            </button>

                            <Drawer title="One Click Rx Templates" placement="right" onClose={handleDrawerTemplate} open={templateDrawer} className="modalWidth-563" width="auto">
                                {TEMPLATE_CONTENT_TAB}
                            </Drawer>
                            <Drawer title="Save Template" placement="right" onClose={handleDrawerSave} open={saveDrawer} className="modalWidth-563" width="auto">
                                {SAVE_CONTENT_TAB}
                            </Drawer>
                            <Drawer placement="right" closeIcon={false} onClose={handleDrawerCustomize} open={customizeDrawer} className="modalWidth-900" width="auto">
                                {CUSTOMIZE_CONTENT_TAB}
                            </Drawer>
                            {/* <Link className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                <i className='icon-setting me-2'></i> <span className='text-decoration-underline'>Customize</span>
                            </Link> */}

                            {/* <Dropdown
                                menu={{
                                    items
                                }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()} className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                    <i className='icon-language me-2'></i>
                                    <span className='text-decoration-underline'>English</span>
                                    <i className='icon-right iconrotate270 ms-1'></i>
                                </a>
                            </Dropdown> */}
                            {/* <Tooltip placement="bottom" title="Ready to print? Please enter your prescription details.">
                                <div onClick={() => window.print()}>
                                    <Button className='btn align-items-center d-flex btn-41 btn-input me-20'>
                                        <i className='icon-Print me-2'></i>
                                        Print
                                    </Button>
                                </div>
                            </Tooltip> */}

                            <Tooltip placement="bottom" title={(symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0 || vitalsData.length > 0 || followUpDate || additionalNote) ? "" : "Please fill your prescription to end visit."}>
                                <Button type='button' className='btn align-items-center d-flex btn-41 btn-primary3 me-20' onClick={() => (symptomsData.length > 0 || examinationData.length > 0 || diagnosisData.length > 0 || adviceData.length > 0 || investigationData.length > 0 || medicationData.length > 0 || vitalsData.length > 0 || followUpDate || additionalNote) && onEndVisitClick()} loading={loading}>
                                    <i className='icon-exit me-2'></i>
                                    End Visit
                                </Button>
                            </Tooltip>

                            <Dropdown className='btn btn-outline btn-more p-0' menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <i className='icon-More'></i>
                                </a>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default React.memo(HeaderPrescription);