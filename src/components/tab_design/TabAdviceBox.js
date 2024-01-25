import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Input, Button, Drawer, Tabs, message, Select, Card, Spin, Checkbox } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';
import { MESSAGE_KEY } from "../../utils/constants";
import { removeBeforeWhiteSpace } from "../../utils/utils";
import Adviceicon from "../../assets/images/advice.svg";
import {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getAdviceTemplates,
    getFrequentlySearchedAdvice,
} from "../../redux/adviceSlice";

import TabAdviceSearch from "../../components/tab_design/TabAdviceSearch";

function TabAdviceBox() {

    const [messageApi, contextHolder] = message.useMessage();
    const {
        selectedAdviceList,
        parentOptionsList,
        templates,
        loading,
    } = useSelector((state) => state.advice);
    const dispatch = useDispatch();

    const { adviceData, setAdviceData } = useContext(CashManagerContext);
    // const [ adviceData, setAdviceData] = useState([]);

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

    useEffect(() => {
        if (selectedAdviceList.length > 0) {
            const updatedData = adviceData.map((e, i) => {
                return { ...e, ...selectedAdviceList[i] };
            });
            setAdviceData(updatedData);
        }
    }, [selectedAdviceList]);

    useEffect(() => {
        dispatch(getAdviceTemplates());
        dispatch(getFrequentlySearchedAdvice());
    }, []);

    useEffect(() => {
        setMatchedTemplates(templates);
        setAllTemplates(templates);
    }, [templates]);

    const onRemoveRow = (index) => {
        adviceData.splice(index, 1);
        setAdviceData((prev) => [...prev]);
    };

    // Handle Parent Drawer
    const handleDrawerParent = useCallback(() => {
        setParentDrawer(!parentDrawer);
    }, [parentDrawer]);

    const onSelectParent = useCallback(
        (e) => {
            adviceData.unshift({
                ...e,
            });
            setAdviceData((prev) => [...prev]);
        },
        [adviceData]
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
                return template.tat_template_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
            setMatchedTemplates(filteredTemplates);
        } else {
            setMatchedTemplates(templates);
        }
    };

    const onTemplateSelected = (template) => {
        const updatedData = template.advices.map(e => {
            return { ...e, unique_id: uuidv4() }
        })
        setAdviceData([...adviceData, ...updatedData]);
        handleDrawerTemplate();
    };

    const onDeleteTemplateClicked = (tat_id) => {
        dispatch(deleteTemplate(tat_id));
    };

    const onChangeSaveTemplate = useCallback(
        (e) => {
            const updateQuery = removeBeforeWhiteSpace(e.target.value)
            setInputTemplateName(updateQuery);
        },
        [inputTemplateName]
    );

    const onAddTemplateClicked = async () => {
        if (adviceData.length == 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'At least 1 advice added',
                duration: 2
            });
        } else if (adviceData.filter(e => e.advice_name == "").length > 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup advice name',
                duration: 2
            });
        } else {
            var sendData = {
                tat_template_name: inputTemplateName,
                advices: adviceData,
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
        if (adviceData.length == 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'At least 1 advice added',
                duration: 2
            });
        } else if (adviceData.filter(e => e.advice_name == "").length > 0) {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: 'Please fillup advice name',
                duration: 2
            });
        } else {
            var data = JSON.parse(inputTemplateName);
            var sendData = {
                tat_id: data.tat_id,
                tat_template_name: data.tat_template_name,
                advices: adviceData,
            };
            const action = await dispatch(updateTemplate(sendData));
            if (action.meta.requestStatus == "fulfilled") {
                setInputTemplateName(null);
                handleDrawerSave();
            }
        }
    };

    //Child Componet
    const TABLE_ADVICE = useMemo(() => {
        return (
            adviceData.length > 0 &&
            adviceData.map((item, index) => {
                return (
                    <div className="d-flex align-items-center justify-content-between border-bottom py-1">
                        <Checkbox checked onClick={() => onRemoveRow(index)}><div className="text-truncate-twolines">{item.advice_name}</div></Checkbox>
                        <Button className="focus-none btn px-1 btn-delete-prescription" onClick={() => handleDrawerChild({ ...item, index: index })}><i className="icon-Edit fs-21"></i></Button>
                    </div>
                );
            })
        );
    }, [adviceData]);

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
                                                <div className="title text-main2">{template.tat_template_name}</div>
                                                <div className="text-truncate">
                                                    {template.advices.map((item, ii) => {
                                                        return (
                                                            <span key={ii}>{`${item.advice_name}${template.advices.length - 1 != ii ? ", " : ""
                                                                }`}</span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="btn btn-delete-prescription p-0 ms-3" onClick={() => onDeleteTemplateClicked(template.tat_id)}>
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
                            value={inputTemplateName && JSON.parse(inputTemplateName).tat_template_name}
                            className="autocomplete-custom w-100 popinput inputheight41"
                            placeholder="Select Template"
                            onSearch={onSearchTemplate}
                            onSelect={onSelectTemplate}
                            options={allTemplates.map((template) => {
                                return {
                                    key: JSON.stringify(template),
                                    value: template.tat_template_name,
                                    label: (
                                        <div key={template.tat_id}>
                                            {template.tat_template_name}
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
            const updateQuery = removeBeforeWhiteSpace(e.target.value)
            setChildDrawerData({ ...childDrawerData, advice_name: updateQuery })
        },
        [childDrawerData]
    );

    const updateChild = (item) => {
        const { index, ...updatedReqData } = item;
        console.log(adviceData[item.index].advice_name, updatedReqData.advice_name)
        if (adviceData[item.index].advice_name != updatedReqData.advice_name) {
            updatedReqData["change"] = 1
        }
        adviceData[item.index] = { ...adviceData[item.index], ...updatedReqData };
        setAdviceData((prev) => [...prev]);
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
                                <div className="modal-title text-truncate-twolines">{'Edit Advice'}</div>
                            </div>
                            <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={() => updateChild(childDrawerData)}>
                                Done
                            </Button>
                        </div>
                    </Card>
                    <div className="p-4">
                        <Input.TextArea value={childDrawerData.advice_name != undefined && childDrawerData.advice_name} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
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
                        <img className='me-2' src={Adviceicon} alt="Advice" />
                        <div className="title-common">Advices</div>
                    </div>

                    <div className="d-flex align-items-center">
                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerTemplate}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerSave}> <i className="icon-save me-2"></i> <span>Save</span></button>
                    </div>
                    <Drawer title="Advice Templates" placement="right" onClose={handleDrawerTemplate} open={templateDrawer} className="modalWidth-563" width="auto">
                        {TEMPLATE_CONTENT}
                    </Drawer>

                    <Drawer title="Save Template" placement="right" onClose={handleDrawerSave} open={saveDrawer} className="modalWidth-563" width="auto">
                        {SAVE_CONTENT}
                    </Drawer>
                </div>
                <div className={adviceData.length > 0 ? "p-14" : "p-14-pb0"}>
                    <div className="overflow-y-auto" style={{maxHeight: '200px'}}>
                        {TABLE_ADVICE}
                    </div>
                    <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild} open={childDrawer} className="modalWidth-563" width="auto">
                        {CHILD_DRAWER_DATA}
                    </Drawer>
                </div>
                <div className="p-14 py-0">
                    <div className="inputheight38 border rounded-10px d-flex align-items-center" onClick={handleDrawerParent}>
                        <i className='icon-search mx-2'></i>
                        <span className="fontroboto backbar fw-normal">Search Advices</span>
                    </div>
                </div>
                <Drawer closeIcon={false} placement="right" onClose={handleDrawerParent} open={parentDrawer} width={'100%'} className="searchdrawer-content">
                    {parentDrawer && (<TabAdviceSearch onClose={handleDrawerParent} />)}
                </Drawer>
                <div className="d-flex flex-wrap p-14-pb0 overflow-hidden" style={{maxHeight: '114px'}}>
                    {parentOptionsList.length > 0 &&
                        parentOptionsList.map((item, i) => {
                            return (
                                <Button key={i} type="text" style={{ width: item.advice_name.length > 26 && '250px' }} className={`${item.advice_name.length > 26 && 'chips-custom-break'} btn btn-primary2 chips-custom mb-14 me-14`} onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.advice_name}</Button>
                            )
                        })}
                </div>
            </div>
        </>
    );
}


export default React.memo(TabAdviceBox);
