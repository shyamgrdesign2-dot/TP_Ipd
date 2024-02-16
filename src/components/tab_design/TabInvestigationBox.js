import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Input, Button, Drawer, Tabs, message, Select, Card, Spin, Segmented, Tooltip } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';
import { MESSAGE_KEY } from "../../utils/constants";
import { removeBeforeWhiteSpace } from "../../utils/utils";
import Investigationicon from "../../assets/images/Lab.svg";
import {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getInvestigationTemplates,
    getFrequentlySearchedInvestigation,
} from "../../redux/investigationSlice";

import TabInvestigationSearch from "../../components/tab_design/TabInvestigationSearch";

function TabInvestigationBox() {

    const [messageApi, contextHolder] = message.useMessage();
    const {
        selectedInvestigationList,
        parentOptionsList,
        templates,
        loading,
    } = useSelector((state) => state.investigation);
    const dispatch = useDispatch();

    const { investigationData, setInvestigationData } = useContext(CashManagerContext);
    // const [ investigationData, setInvestigationData] = useState([]);

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

    useEffect(() => {
        if (selectedInvestigationList.length > 0) {
            const updatedData = investigationData.map((e, i) => {
                return { ...e, ...selectedInvestigationList[i] };
            });
            setInvestigationData(updatedData);
        }
    }, [selectedInvestigationList]);

    useEffect(() => {
        dispatch(getInvestigationTemplates());
        dispatch(getFrequentlySearchedInvestigation());
    }, []);

    useEffect(() => {
        setMatchedTemplates(templates);
        setAllTemplates(templates);
    }, [templates]);

    const onRemoveRow = (index) => {
        investigationData.splice(index, 1);
        setInvestigationData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    // Handle Parent Drawer
    const handleDrawerParent = useCallback(() => {
        setParentDrawer(!parentDrawer);
    }, [parentDrawer]);

    const onSelectParent = useCallback(
        (e) => {
            investigationData.push({
                ...e,
                note: "",
            });
            setInvestigationData((prev) => [...prev]);
            setSelectedIndex(investigationData.length - 1);
            handleDrawerParent()
        },
        [investigationData, selectedIndex, parentDrawer]
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
                return template.tit_template_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
            setMatchedTemplates(filteredTemplates);
        } else {
            setMatchedTemplates(templates);
        }
    };

    const onTemplateSelected = (template) => {
        const updatedData = template.investigation.map(e => {
            return { ...e, unique_id: uuidv4(), note: "" }
        })
        setInvestigationData([...investigationData, ...updatedData]);
        handleDrawerTemplate();
    };

    const onDeleteTemplateClicked = (tit_id) => {
        dispatch(deleteTemplate(tit_id));
    };

    const onChangeSaveTemplate = useCallback(
        (e) => {
            const updateQuery = removeBeforeWhiteSpace(e.target.value)
            setInputTemplateName(updateQuery);
        },
        [inputTemplateName]
    );

    const onAddTemplateClicked = async () => {
        if (investigationData.length === 0) {
            messageApi.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'At least 1 investigation added',
                duration: 2
            });
        } else if (investigationData.filter(e => e.investigation_name === "").length > 0) {
            messageApi.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup investigation name',
                duration: 2
            });
        } else {
            var sendData = {
                tit_template_name: inputTemplateName,
                investigation: investigationData,
            };
            const action = await dispatch(addTemplate(sendData));
            if (action.meta.requestStatus === "fulfilled") {
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
        if (investigationData.length === 0) {
            messageApi.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'At least 1 investigation added',
                duration: 2
            });
        } else if (investigationData.filter(e => e.investigation_name === "").length > 0) {
            messageApi.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup investigation name',
                duration: 2
            });
        } else {
            var data = JSON.parse(inputTemplateName);
            var sendData = {
                tit_id: data.tit_id,
                tit_template_name: data.tit_template_name,
                investigation: investigationData,
            };
            const action = await dispatch(updateTemplate(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                setInputTemplateName(null);
                handleDrawerSave();
            }
        }
    };

    //Child Componet
    const TABLE_INVESTIGATION = useMemo(() => {
        return (
            investigationData.length > 0 &&
            investigationData.map((item, index) => {
                return (
                    <div key={index} style={{ width: item.investigation_name.length > 12 && item.investigation_name.length < 24 ? `${item.investigation_name.length * 10.5}px` : item.investigation_name.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips closable-chips-active">
                        <div className="text-truncate p-2" onClick={() => handleDrawerChild({ ...item, index: index })}>
                            <div className="text-truncate">{item.investigation_name}
                                {item.note ? (
                                    <div className="text-truncate small">{item.note}</div>
                                ) : (
                                    <div className="text-truncate small">Add Details</div>
                                )}
                            </div>
                        </div>
                        <Button type="text" className="rounded-0 btn-close-chips" onClick={() => onRemoveRow(index)}>
                            <i className="icon-Cross"></i>
                        </Button>
                    </div>
                );
            })
        );
    }, [investigationData]);

    //Template Componet
    const TEMPLATE_CONTENT = useMemo(() => {
        return (
            <>
                <div>
                    <div className="medicine-templates">
                        <Input className="popinput" placeholder="Search Templates" onChange={onSearch} prefix={<i className='icon-search me-2'></i>} allowClear />
                    </div>
                    <div className="tab-template-height" >
                        {matchedTemplates.length > 0 &&
                            matchedTemplates.map((template, i) => {
                                return (
                                    <div className="align-items-center d-flex justify-content-between medicine-templates" key={i}>
                                        <div className="align-items-center d-flex text-truncate w-100" onClick={() => onTemplateSelected(template)}>
                                            <div className="round-box"><i className="icon-template"></i></div>
                                            <div className="text-truncate w-100">
                                                <div className="title text-main2">{template.tit_template_name}</div>
                                                <div className="text-truncate">
                                                    {template.investigation.map((item, ii) => {
                                                        return (
                                                            <span key={ii}>{`${item.investigation_name}${template.investigation.length - 1 !== ii ? ", " : ""
                                                                }`}</span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="btn btn-delete-prescription p-0 ms-3" onClick={() => onDeleteTemplateClicked(template.tit_id)}>
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
                            value={inputTemplateName && JSON.parse(inputTemplateName).tit_template_name}
                            className="autocomplete-custom w-100 popinput inputheight41"
                            placeholder="Select Template"
                            onSearch={onSearchTemplate}
                            onSelect={onSelectTemplate}
                            optionLabelProp="label"
                            options={allTemplates.map((template) => {
                                return {
                                    key: JSON.stringify(template),
                                    value: template.tit_template_name,
                                    label: (
                                        <div key={template.tit_id}>
                                            {template.tit_template_name}
                                        </div>
                                    ),
                                };
                            })}
                            optionRender={(option) => (
                                <div className="align-items-center d-flex text-truncate w-100">
                                    <div className="round-box"><i className="icon-template"></i></div>
                                    <div className="text-truncate w-100">
                                        <div className="title text-main2">{option.data.value}</div>
                                        <div className="text-truncate">
                                            {JSON.parse(option.data.key).investigation.map((item, ii) => {
                                                return (
                                                    <span key={ii}>{`${item.investigation_name}${JSON.parse(option.data.key).investigation.length - 1 !== ii ? ", " : ""
                                                        }`}</span>
                                                );
                                            })}
                                        </div>
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

    const onChangeInputNoteChild = useCallback(
        (e) => {
            setChildDrawerData({ ...childDrawerData, note: e.target.value })
        },
        [childDrawerData]
    );

    const updateChild = (item) => {
        const { index, ...updatedReqData } = item;
        investigationData[item.index] = { ...investigationData[item.index], ...updatedReqData };
        setInvestigationData((prev) => [...prev]);
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
                                <div className="modal-title text-truncate-twolines">{childDrawerData.investigation_name}</div>
                            </div>
                            <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={() => updateChild(childDrawerData)}>
                                Done
                            </Button>
                        </div>
                    </Card>
                    <div className="p-4">
                        <Input.TextArea value={childDrawerData.note !== undefined && childDrawerData.note} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                    </div>
                </>
            )
        );
    }, [childDrawer, childDrawerData]);

    return (
        <>
            {contextHolder}
            <div>
                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                    <div className="d-flex align-items-center">
                        <img className='me-2' src={Investigationicon} alt="Investigation" />
                        <div className="title-common">Lab Investigation</div>
                    </div>

                    <div className="d-flex align-items-center">
                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerTemplate}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                        <Tooltip placement="bottom" title={(investigationData.length > 0) ? "" : "Please enter some Investigation to save a template"}>
                            <button className='btn d-flex align-items-center btn-text' onClick={() => (investigationData.length > 0) && handleDrawerSave()} > <i className="icon-save me-2"></i> <span>Save</span></button>
                        </Tooltip>
                    </div>
                    <Drawer title="Investigation Templates" placement="right" onClose={handleDrawerTemplate} open={templateDrawer} className="modalWidth-563" width="auto">
                        {TEMPLATE_CONTENT}
                    </Drawer>

                    <Drawer title="Save Template" placement="right" onClose={handleDrawerSave} open={saveDrawer} className="modalWidth-563" width="auto">
                        {SAVE_CONTENT}
                    </Drawer>
                </div>
                <div className="d-flex flex-wrap p-14-pb0">
                    {TABLE_INVESTIGATION}
                    <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild} open={childDrawer} className="modalWidth-563" width="auto">
                        {CHILD_DRAWER_DATA}
                    </Drawer>
                </div>
                <div className="p-14 py-0">
                    <div className="inputheight38 border rounded-10px d-flex align-items-center" onClick={handleDrawerParent}>
                        <i className='icon-search mx-2'></i>
                        <span className="fontroboto backbar fw-normal">Search Lab Investigation</span>
                    </div>
                </div>
                <Drawer closeIcon={false} placement="right" onClose={handleDrawerParent} open={parentDrawer} width={'100%'} className="searchdrawer-content">
                    {parentDrawer && (<TabInvestigationSearch passIndex={selectedIndex} onClose={handleDrawerParent} />)}
                </Drawer>
                <div className="d-flex flex-wrap p-14-pb0 overflow-hidden" style={{ maxHeight: '114px' }}>
                    {parentOptionsList.length > 0 &&
                        parentOptionsList.filter(e => ![...investigationData.map(e1 => e1.investigation_name)].includes(e.investigation_name)).map((item, i) => {
                            return (
                                <Button key={i} type="text" style={{ width: item.investigation_name.length > 26 && '250px' }} className={`${item.investigation_name.length > 26 && 'chips-custom-break'} btn btn-primary2 chips-custom mb-14 me-14`} onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.investigation_name}</Button>
                            )
                        })}
                </div>
            </div>
        </>
    );
}


export default React.memo(TabInvestigationBox);
