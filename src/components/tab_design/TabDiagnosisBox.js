import React, { useState, useEffect, useCallback, useRef, useContext, useMemo } from "react";
import { AutoComplete, Input, Button, Drawer, Tabs, message, Select, Card, Spin, Segmented } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';
import { MESSAGE_KEY } from "../../utils/constants";
import Diagnosisicon from "../../assets/images/Diagnosis.svg";
import {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getDiagnosisTemplates,
    getFrequentlySearchedDiagnosis,
} from "../../redux/diagnosisSlice";

import TabDiagnosisSearch from "../../components/tab_design/TabDiagnosisSearch";

function TabDiagnosisBox() {

    const [messageApi, contextHolder] = message.useMessage();
    const {
        selectedDiagnosisList,
        parentOptionsList,
        templates,
        loading,
    } = useSelector((state) => state.diagnosis);
    const dispatch = useDispatch();

    const { diagnosisData, setDiagnosisData } = useContext(CashManagerContext);
    // const [ diagnosisData, setDiagnosisData] = useState([]);

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
    const SINCE_OPTIONS = ["H", "D", "W", "M", "Y"];
    const [sinceValue, setSinceValue] = useState(1);
    const [inputSince, setInputSince] = useState('');
    const [sinceOptions, setSinceOptions] = useState([]);


    useEffect(() => {
        if (selectedDiagnosisList.length > 0) {
            const updatedData = diagnosisData.map((e, i) => {
                return { ...e, ...selectedDiagnosisList[i] };
            });
            setDiagnosisData(updatedData);
        }
    }, [selectedDiagnosisList]);

    useEffect(() => {
        dispatch(getDiagnosisTemplates());
        dispatch(getFrequentlySearchedDiagnosis());
    }, []);

    useEffect(() => {
        setMatchedTemplates(templates);
        setAllTemplates(templates);
    }, [templates]);

    const onRemoveRow = (index) => {
        diagnosisData.splice(index, 1);
        setDiagnosisData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    // Handle Parent Drawer
    const handleDrawerParent = useCallback(() => {
        setParentDrawer(!parentDrawer);
    }, [parentDrawer]);

    const onSelectParent = useCallback(
        (e) => {
            diagnosisData.push({
                ...e,
                since: "",
                status: "",
                note: "",
            });
            setDiagnosisData((prev) => [...prev]);
            setSelectedIndex(diagnosisData.length - 1);
            handleDrawerParent()
        },
        [diagnosisData, selectedIndex, parentDrawer]
    );

    // Handle Child Drawer
    const handleDrawerChild = useCallback((item) => {
        setChildDrawer(!childDrawer);
        setChildDrawerData(item)
        setSinceValue(item && item.since ? parseInt(item.since.split(" ")[0]) : 1)
    }, [childDrawer, childDrawerData, sinceValue]);

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
                return template.tdt_template_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
            setMatchedTemplates(filteredTemplates);
        } else {
            setMatchedTemplates(templates);
        }
    };

    const onTemplateSelected = (template) => {
        const updatedData = template.diagnosis.map(e => {
            return { ...e, unique_id: uuidv4(), since: "", status: "", note: "" }
        })
        setDiagnosisData([...diagnosisData, ...updatedData]);
        handleDrawerTemplate();
    };

    const onDeleteTemplateClicked = (tdt_id) => {
        dispatch(deleteTemplate(tdt_id));
    };

    const onChangeSaveTemplate = useCallback(
        (e) => {
            setInputTemplateName(e.target.value);
        },
        [inputTemplateName]
    );

    const onAddTemplateClicked = async () => {
        if (diagnosisData.length == 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'At least 1 diagnosis added',
                duration: 2
            });
        } else if (diagnosisData.filter(e => e.tds_name == "").length > 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup diagnosis name',
                duration: 2
            });
        } else {
            var sendData = {
                tdt_template_name: inputTemplateName,
                diagnosis: diagnosisData,
            };
            const action = await dispatch(addTemplate(sendData));
            if (action.meta.requestStatus == "fulfilled") {
                setInputTemplateName(null);
                handleDrawerSave();
            }
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
        if (diagnosisData.length == 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'At least 1 diagnosis added',
                duration: 2
            });
        } else if (diagnosisData.filter(e => e.tds_name == "").length > 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup diagnosis name',
                duration: 2
            });
        } else {
            var data = JSON.parse(inputTemplateName);
            var sendData = {
                tdt_id: data.tdt_id,
                tdt_template_name: data.tdt_template_name,
                diagnosis: diagnosisData,
            };
            const action = await dispatch(updateTemplate(sendData));
            if (action.meta.requestStatus == "fulfilled") {
                setInputTemplateName(null);
                handleDrawerSave();
            }
        }
    };

    //Child Componet
    const TABLE_DIAGNOSIS = useMemo(() => {
        return (
            diagnosisData.length > 0 &&
            diagnosisData.map((item, index) => {
                return (
                    <div key={index} style={{ width: item.tds_name.length > 12 && item.tds_name.length < 24 ? `${item.tds_name.length * 10.5}px` : item.tds_name.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                        <div className="text-truncate p-2" onClick={() => handleDrawerChild({ ...item, index: index })}>
                            <div className="text-truncate">{item.tds_name}
                                {(item.since || item.status || item.note) ? (
                                    <div className="text-truncate small">{`${item.since ? item.since + ' | ' : ''}${item.status ? item.status + ' | ' : ''}${item.note ? item.note : ''}`}</div>
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
    }, [diagnosisData]);

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
                                                <div className="title">{template.tdt_template_name}</div>
                                                <div className="text-truncate">
                                                    {template.diagnosis.map((item, ii) => {
                                                        return (
                                                            <span key={ii}>{`${item.tds_name}${template.diagnosis.length - 1 != ii ? ", " : ""
                                                                }`}</span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="btn btn-delete-prescription p-0 ms-3" onClick={() => onDeleteTemplateClicked(template.tdt_id)}>
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
                            value={inputTemplateName && inputTemplateName.tdt_template_name}
                            className="autocomplete-custom w-100 popinput inputheight41"
                            placeholder="Select Template"
                            onSearch={onSearchTemplate}
                            onSelect={onSelectTemplate}
                            options={allTemplates.map((template) => {
                                return {
                                    key: JSON.stringify(template),
                                    value: template.tdt_template_name,
                                    label: (
                                        <div key={template.tdt_id}>
                                            {template.tdt_template_name}
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


    useEffect(() => {
        if (sinceValue != -1) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${sinceValue} ${option}`,
                    label: <>{`${sinceValue} ${option}`}</>,
                };
            });
            setSinceOptions(options);
        } else if (inputSince.length > 0) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${inputSince} ${option}`,
                    label: <>{`${inputSince} ${option}`}</>,
                };
            });
            setSinceOptions(options);
        } else {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${option}`,
                    label: <>{`${option}`}</>,
                };
            });
            setSinceOptions(options);
        }
    }, [sinceValue]);

    const onChangeInputSinceChild = useCallback(
        (e) => {
            setInputSince(e.target.value);
            setChildDrawerData({ ...childDrawerData, since: '' })
            if (e.target.value.length > 0) {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${e.target.value} ${option}`,
                        label: <>{`${e.target.value} ${option}`}</>,
                    };
                });
                setSinceOptions(options);
            } else {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${option}`,
                        label: <>{`${option}`}</>,
                    };
                });
                setSinceOptions(options);
            }
        },
        [inputSince, sinceOptions, childDrawerData]
    );

    const SINCE_LIST = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: -1, label: <Input className="w-100 segment-input" placeholder="Custom" onChange={onChangeInputSinceChild} onClick={() => onChangeSegmentedSinceChild(-1)} /> }
    ];

    const STATUS_LIST = [
        { value: "ruled out", label: "Ruled Out" },
        { value: "suspected", label: "Suspected" },
        { value: "confirmed", label: "Confirmed" },
    ];

    const onChangeSegmentedSinceChild = useCallback(
        (key) => {
            setSinceValue(key)
            setChildDrawerData({ ...childDrawerData, since: '' })
        },
        [sinceValue, childDrawerData]
    );

    const onChangeSinceChild = useCallback(
        (key) => {
            setChildDrawerData({ ...childDrawerData, since: key })
        },
        [childDrawerData]
    );

    const onChangeStatusChild = useCallback(
        (key) => {
            setChildDrawerData({ ...childDrawerData, status: key })
        },
        [childDrawerData]
    );
    const onChangeInputNoteChild = useCallback(
        (e) => {
            setChildDrawerData({ ...childDrawerData, note: e.target.value })
        },
        [childDrawerData]
    );

    const updateChild = (item) => {
        const { index, ...updatedReqData } = item;
        diagnosisData[item.index] = { ...diagnosisData[item.index], ...updatedReqData };
        setDiagnosisData((prev) => [...prev]);
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
                                <div className="modal-title text-truncate-twolines">{childDrawerData.tds_name}</div>
                            </div>
                            <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={() => updateChild(childDrawerData)}>
                                Done
                            </Button>
                        </div>
                    </Card>
                    <div className="p-4">
                        <div>
                            <label className="title-common">
                                Since
                            </label>
                            <Segmented
                                value={sinceValue > 5 ? -1 : sinceValue}
                                className="search-segment"
                                options={SINCE_LIST}
                                onChange={onChangeSegmentedSinceChild}
                            />
                        </div>
                        <div className="mt-3">
                            <Segmented
                                value={childDrawerData.since != undefined && childDrawerData.since}
                                className="search-segment"
                                options={sinceOptions}
                                onChange={onChangeSinceChild}
                            />
                        </div>
                        <div className="mt-5">
                            <label className="title-common">
                                Status
                            </label>
                            <Segmented
                                value={childDrawerData.status != undefined && childDrawerData.status}
                                className="search-segment"
                                options={STATUS_LIST}
                                onChange={onChangeStatusChild}
                            />
                        </div>
                        <div className="mt-5">
                            <label className="title-common">
                                Add Details
                            </label>
                            <Input.TextArea value={childDrawerData.note != undefined && childDrawerData.note} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                        </div>
                    </div>
                </>
            )
        );
    }, [childDrawer, childDrawerData, sinceValue, inputSince, sinceOptions]);

    return (
        <>
            {contextHolder}
            <div className="prescription-box-sm p-20px">
                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                    <div className="d-flex align-items-center">
                        <img className='me-2' src={Diagnosisicon} alt="Diagnosis" />
                        <div className="title-common">Diagnosis</div>
                    </div>

                    <div className="d-flex align-items-center">
                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span></button>
                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerTemplate}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerSave}> <i className="icon-save me-2"></i> <span>Save</span></button>
                    </div>
                    <Drawer title="Diagnosis Templates" placement="right" onClose={handleDrawerTemplate} open={templateDrawer} className="modalWidth-563" width="auto">
                        {TEMPLATE_CONTENT}
                    </Drawer>

                    <Drawer title="Save Template" placement="right" onClose={handleDrawerSave} open={saveDrawer} className="modalWidth-563" width="auto">
                        {SAVE_CONTENT}
                    </Drawer>
                </div>
                <div className="d-flex flex-wrap p-14-pb0">
                    {TABLE_DIAGNOSIS}
                    <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild} open={childDrawer} className="modalWidth-563" width="auto">
                        {CHILD_DRAWER_DATA}
                    </Drawer>
                </div>
                <div className="p-14 py-0">
                    <div className="inputheight38 border rounded-10px d-flex align-items-center" onClick={handleDrawerParent}>
                        <i className='icon-search mx-2'></i>
                        <span className="fontroboto backbar fw-normal">Search Diagnosis</span>
                    </div>
                </div>
                <Drawer closeIcon={false} placement="right" onClose={handleDrawerParent} open={parentDrawer} width={'100%'} className="searchdrawer-content">
                    {parentDrawer && (<TabDiagnosisSearch passIndex={selectedIndex} onClose={handleDrawerParent} />)}
                </Drawer>
                <div className="d-flex flex-wrap p-14-pb0">
                    {parentOptionsList.length > 0 &&
                        parentOptionsList.map((item, i) => {
                            return (
                                <Button key={i} type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.tds_name}</Button>
                            )
                        })}
                </div>
            </div>
        </>
    );
}


export default React.memo(TabDiagnosisBox);
