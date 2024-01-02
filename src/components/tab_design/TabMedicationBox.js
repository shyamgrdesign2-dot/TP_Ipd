import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Input, Button, Drawer, Tabs, message, Select, Card, Spin } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';
import { MESSAGE_KEY } from "../../utils/constants";
import Medicationicon from "../../assets/images/Medication.svg";
import {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getMedicationTemplates,
    getFrequentlySearchedMedication,
} from "../../redux/medicationSlice";

// import TabMedicationSearch from "../../components/tab_design/TabMedicationSearch";

function TabMedicationBox() {

    const [messageApi, contextHolder] = message.useMessage();
    const {
        selectedMedicationList,
        parentOptionsList,
        templates,
        loading,
    } = useSelector((state) => state.medication);
    const dispatch = useDispatch();

    const { medicationData, setMedicationData } = useContext(CashManagerContext);
    // const [ medicationData, setMedicationData] = useState([]);

    const [parentDrawer, setParentDrawer] = useState(false);
    const [childDrawer, setChildDrawer] = useState(false);
    const [childDrawerData, setChildDrawerData] = useState(null);

    const [templateDrawer, setTemplateDrawer] = useState(false);
    const [allTemplates, setAllTemplates] = useState([]);
    const [matchedTemplates, setMatchedTemplates] = useState([]);
    const [saveDrawer, setSaveDrawer] = useState(false);

    const [inputTemplateName, setInputTemplateName] = useState(null);
    const TAB_ADD_TEMPLATE = 1;
    const TAB_UPDATE_TEMPLATE = 2;
    const ADD_EDIT_TEMPLATE_TABS = [
        { key: TAB_ADD_TEMPLATE, label: "New Template" },
        { key: TAB_UPDATE_TEMPLATE, label: "Update Template" },
    ];
    const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);

    const [selectedIndex, setSelectedIndex] = useState(null);

    // useEffect(() => {
    //     if (selectedMedicationList.length > 0) {
    //         const updatedData = medicationData.map((e, i) => {
    //             return { ...e, ...selectedMedicationList[i] };
    //         });
    //         setMedicationData(updatedData);
    //     }
    // }, [selectedMedicationList]);

    useEffect(() => {
        dispatch(getMedicationTemplates());
        dispatch(getFrequentlySearchedMedication());
    }, []);

    useEffect(() => {
        setMatchedTemplates(templates);
        setAllTemplates(templates);
    }, [templates]);

    const onRemoveRow = (index) => {
        medicationData.splice(index, 1);
        setMedicationData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    // Handle Parent Drawer
    const handleDrawerParent = useCallback(() => {
        setParentDrawer(!parentDrawer);
    }, [parentDrawer]);

    const onSelectParent = useCallback(
        (e) => {
            medicationData.push({
                ...e,
                note: "",
            });
            setMedicationData((prev) => [...prev]);
            setSelectedIndex(medicationData.length - 1);
            handleDrawerParent()
        },
        [medicationData, selectedIndex, parentDrawer]
    );

    // Handle Child Drawer
    const handleDrawerChild = useCallback((item) => {
        setChildDrawer(!childDrawer);
        setChildDrawerData(item)
    }, [childDrawer, childDrawerData]);

    // Handle Template Drawer
    const handleDrawerTemplate = useCallback(() => {
        setTemplateDrawer(!templateDrawer);
    }, [templateDrawer]);

    // Handle Save Drawer
    const handleDrawerSave = useCallback(() => {
        setInputTemplateName(null);
        setSaveDrawer(!saveDrawer);
    }, [saveDrawer]);

    const onTabChange = useCallback(
        (key) => {
            setInputTemplateName(null);
            setTabChange(key);
        },
        [tabChange]
    );

    const onSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery) {
            let filteredTemplates = templates.filter((template) => {
                return template.tmtd_template_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
            setMatchedTemplates(filteredTemplates);
        } else {
            setMatchedTemplates(templates);
        }
    };

    const onTemplateSelected = (template) => {
        // const updatedData = template.medication.map(e => {
        //     return { ...e, unique_id: uuidv4(), note: "" }
        // })
        // setMedicationData([...medicationData, ...updatedData]);
        // handleDrawerTemplate();
    };

    const onDeleteTemplateClicked = (tmtd_id) => {
        dispatch(deleteTemplate(tmtd_id));
    };

    const onChangeSaveTemplate = useCallback(
        (e) => {
            setInputTemplateName(e.target.value);
        },
        [inputTemplateName]
    );

    const onAddTemplateClicked = async () => {
        // if (medicationData.length == 0) {
        //     messageApi.open({
        //         MESSAGE_KEY,
        //         type: 'warning',
        //         content: 'At least 1 medication added',
        //         duration: 2
        //     });
        // } else if (medicationData.filter(e => e.medication_name == "").length > 0) {
        //     messageApi.open({
        //         MESSAGE_KEY,
        //         type: 'warning',
        //         content: 'Please fillup medication name',
        //         duration: 2
        //     });
        // } else {
        //     var sendData = {
        //         tmtd_template_name: inputTemplateName,
        //         data: medicationData,
        //     };
        //     const action = await dispatch(addTemplate(sendData));
        //     if (action.meta.requestStatus == "fulfilled") {
        //         setInputTemplateName(null);
        //         handleDrawerSave();
        //     }
        // }
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
        // if (medicationData.length == 0) {
        //     messageApi.open({
        //         MESSAGE_KEY,
        //         type: 'warning',
        //         content: 'At least 1 medication added',
        //         duration: 2
        //     });
        // } else if (medicationData.filter(e => e.medication_name == "").length > 0) {
        //     messageApi.open({
        //         MESSAGE_KEY,
        //         type: 'warning',
        //         content: 'Please fillup medication name',
        //         duration: 2
        //     });
        // } else {
        //     var data = JSON.parse(inputTemplateName);
        //     var sendData = {
        //         tmtd_id: data.tmtd_id,
        //         tmtd_template_name: data.tmtd_template_name,
        //         data: medicationData,
        //     };
        //     const action = await dispatch(updateTemplate(sendData));
        //     if (action.meta.requestStatus == "fulfilled") {
        //         setInputTemplateName(null);
        //         handleDrawerSave();
        //     }
        // }
    };

    //Child Componet
    const TABLE_MEDICATION = useMemo(() => {
        return (
            medicationData.length > 0 &&
            medicationData.map((item, index) => {
                return (
                    <div key={index} style={{ width: item.medication_name.length > 12 && item.medication_name.length < 24 ? `${item.medication_name.length * 10.5}px` : item.medication_name.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                        <div className="text-truncate p-2" onClick={() => handleDrawerChild({ ...item, index: index })}>
                            <div className="text-truncate">{item.medication_name}
                                {item.note ? (
                                    <div className="text-truncate small">{item.note}</div>
                                ) : (
                                    <div className="text-truncate small">Add Details</div>
                                )}
                            </div>
                        </div>
                        <Button type="text" className="border-start rounded-0 btn-close-chips" onClick={() => onRemoveRow(index)}>
                            <i className="icon-Cross"></i>
                        </Button>
                    </div>
                );
            })
        );
    }, [medicationData]);

    //Template Componet
    const TEMPLATE_CONTENT = useMemo(() => {
        return (
            <>
                <div>
                    <div className="medicine-templates">
                        <Input className="popinput" onChange={onSearch} prefix={<i className='icon-search me-2'></i>} />
                    </div>
                    <div className="tab-template-height" >
                        {matchedTemplates.length > 0 &&
                            matchedTemplates.map((template, i) => {
                                return (
                                    <div className="align-items-center d-flex justify-content-between medicine-templates" key={i}>
                                        <div className="align-items-center d-flex text-truncate">
                                            <div className="round-box" onClick={() => onTemplateSelected(template)}><i className="icon-template"></i></div>
                                            <div className="text-truncate" onClick={() => onTemplateSelected(template)}>
                                                <div className="title">{template.tmtd_template_name}</div>
                                                {/* <div className="text-truncate">
                                                    {template.medication.map((item, ii) => {
                                                        return (
                                                            <span key={ii}>{`${item.medication_name}${template.medication.length - 1 != ii ? ", " : ""
                                                                }`}</span>
                                                        );
                                                    })}
                                                </div> */}
                                            </div>
                                        </div>
                                        <Button className="btn btn-delete-prescription p-0 ms-3" onClick={() => onDeleteTemplateClicked(template.tmtd_id)}>
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

    //Save Componet
    const SAVE_CONTENT = useMemo(() => {
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
                            value={inputTemplateName && inputTemplateName.tmtd_template_name}
                            className="autocomplete-custom w-100 popinput inputheight41"
                            placeholder="Select Template"
                            onSearch={onSearchTemplate}
                            onSelect={onSelectTemplate}
                            options={allTemplates.map((template) => {
                                return {
                                    key: JSON.stringify(template),
                                    value: template.tmtd_template_name,
                                    label: (
                                        <div key={template.tmtd_id}>
                                            {template.tmtd_template_name}
                                        </div>
                                    ),
                                };
                            })}
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

    const onChangeInputNoteChild = useCallback(
        (e) => {
            setChildDrawerData({ ...childDrawerData, note: e.target.value })
        },
        [childDrawerData]
    );

    const updateChild = (item) => {
        const { index, ...updatedReqData } = item;
        medicationData[item.index] = { ...medicationData[item.index], ...updatedReqData };
        setMedicationData((prev) => [...prev]);
        handleDrawerChild()
    }

    //Child Componet
    const CHILD_DRAWER_DATA = useMemo(() => {
        return (
            childDrawerData && (
                <>
                    <Card bordered={false} className="search-modalCard">
                        <div className='modalCard-header align-items-center justify-content-between d-flex'>
                            <div className='align-items-center d-flex'>
                                <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerChild}>
                                    <i className='icon-Cross fs-3'></i>
                                </Button>
                                <div className="modal-title text-truncate-twolines">{childDrawerData.medication_name}</div>
                            </div>
                            <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={() => updateChild(childDrawerData)}>
                                Done
                            </Button>
                        </div>
                    </Card>
                    <div className="p-4">
                        <label className="title-common">
                            Add Details
                        </label>
                        <Input.TextArea value={childDrawerData.note != undefined && childDrawerData.note} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                    </div>
                </>
            )
        );
    }, [childDrawer, childDrawerData]);

    return (
        <>
            {contextHolder}
            <div className="prescription-box-sm p-20px">
                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                    <div className="d-flex align-items-center">
                        <img className='me-2' src={Medicationicon} alt="Medication" />
                        <div className="title-common">Medications (Rx)</div>
                    </div>

                    <div className="d-flex align-items-center">
                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span></button>
                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerTemplate}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerSave}> <i className="icon-save me-2"></i> <span>Save</span></button>
                    </div>
                    <Drawer title="Medication Templates" placement="right" onClose={handleDrawerTemplate} open={templateDrawer} className="modalWidth-563" width="auto">
                        {TEMPLATE_CONTENT}
                    </Drawer>

                    <Drawer title="Save Template" placement="right" onClose={handleDrawerSave} open={saveDrawer} className="modalWidth-563" width="auto">
                        {SAVE_CONTENT}
                    </Drawer>
                </div>
                <div className="d-flex flex-wrap p-14-pb0">
                    {TABLE_MEDICATION}
                    <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild} open={childDrawer} className="modalWidth-563" width="auto">
                        {CHILD_DRAWER_DATA}
                    </Drawer>
                </div>
                <div className="p-14 py-0">
                    <div className="inputheight38 border rounded-10px d-flex align-items-center" onClick={handleDrawerParent}>
                        <i className='icon-search mx-2'></i>
                        <span className="fontroboto backbar fw-normal">Search Medicines</span>
                    </div>
                </div>
                <Drawer closeIcon={false} placement="right" onClose={handleDrawerParent} open={parentDrawer} width={'100%'} className="searchdrawer-content">
                    {/* {parentDrawer && (<TabMedicationSearch passIndex={selectedIndex} onClose={handleDrawerParent} />)} */}
                </Drawer>
                <div className="d-flex flex-wrap p-14-pb0">
                    {parentOptionsList.length > 0 &&
                        parentOptionsList.map((item, i) => {
                            return (
                                <Button key={i} type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.tmm_medicine_name}</Button>
                            )
                        })}
                </div>
            </div>
        </>
    );
}


export default React.memo(TabMedicationBox);
