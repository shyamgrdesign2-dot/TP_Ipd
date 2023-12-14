import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AutoComplete, Input, Button, Form, Row, Col, Select, Popover, Tabs, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";

import { onlyNumberFormat } from "../utils/utils";
import Diagnosisicon from "../assets/images/Diagnosis.svg";
import { addTemplate, updateTemplate, deleteTemplate, getDiagnosisTemplates, getFrequentlySearchedDiagnosis, searchDiagnosis, clearDiagnosisSearch } from "../redux/diagnosisSlice";

function DiagnosisBox() {
    const { selectedDiagnosisList, parentOptionsList, childOptionsList, templates, loading } = useSelector((state) => state.diagnosis);
    const dispatch = useDispatch();


    const [selectedData, setSelectedData] = useState([]);
    const SEVERITY_LIST = [
        { value: "severe", label: "Severe" },
        { value: "moderate", label: "Moderate" },
        { value: "mild", label: "Mild" },
    ];

    //PopOver1
    const [popOver1, setPopOver1] = useState(false);
    const [allTemplates, setAllTemplates] = useState([]);
    const [matchedTemplates, setMatchedTemplates] = useState([]);
    const [searchParentQuery, setSearchParentQuery] = useState('');
    const [parentSearchOptions, setParentSearchOptions] = useState([]);

    const [searchChildQuery, setSearchChildQuery] = useState(null);
    const [childSearchOptions, setChildSearchOptions] = useState([]);
    const [sinceOptions, setSinceOptions] = useState([]);
    const SINCE_OPTIONS = ["Hour", "Day", "Week", "Month", "Year"];

    //PopOver2
    const [popOver2, setPopOver2] = useState(false);
    const [tdtTemplateName, setTdtTemplateName] = useState(null);
    const TAB_ADD_TEMPLATE = 1;
    const TAB_UPDATE_TEMPLATE = 2;
    const ADD_EDIT_TEMPLATE_TABS = [
        { key: TAB_ADD_TEMPLATE, label: "New Template" },
        { key: TAB_UPDATE_TEMPLATE, label: "Update Template" }
    ];
    const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);



    useEffect(() => {
        if (selectedDiagnosisList.length > 0) {
            const updatedData = selectedData.map((e, i) => {
                return { ...e, ...selectedDiagnosisList[i] }
            })
            setSelectedData(updatedData);
        }
    }, [selectedDiagnosisList]);

    useEffect(() => {
        dispatch(getDiagnosisTemplates());
    }, []);

    useEffect(() => {
        setMatchedTemplates(templates);
        setAllTemplates(templates)
    }, [templates]);



    //Parent AutoComplete
    useEffect(() => {
        if (searchParentQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(searchDiagnosis({ searchQuery: searchParentQuery, type: 'parent' }));
            }, 500)
            return () => {
                clearTimeout(timeOutId)
            }
        } else {
            dispatch(getFrequentlySearchedDiagnosis())
        }
    }, [searchParentQuery])

    useEffect(() => {
        const data = [];
        parentOptionsList.map((e) => {
            return data.push({
                key: JSON.stringify(e),
                value: e.tds_name,
                label: (
                    <div>
                        {e.tds_name}
                    </div>
                ),
            });
        });
        if (searchParentQuery.length == 0) {
            data.unshift({
                key: -1,
                label: (
                    <>
                        <div>FREQUENTLY USED</div>
                    </>
                ),
            });
        } else {
            searchParentQuery &&
                data.push({
                    key: JSON.stringify({ tds_id: 0, tds_name: searchParentQuery, pms_default: 0 }),
                    value: searchParentQuery,
                    label: (
                        <>
                            <div>{searchParentQuery}</div>
                        </>
                    ),
                });
        }
        setParentSearchOptions(data);
    }, [parentOptionsList]);

    const onSearchParent = useCallback((query) => {
        setSearchParentQuery(query)
    }, [searchParentQuery]);

    const onSelectParent = useCallback((data, e) => {
        selectedData.push({ ...JSON.parse(e.key), since: '', severity: '', note: '' })
        setSelectedData(prev => [...prev])
        setSearchParentQuery('')
    }, [searchParentQuery, selectedData])



    //Child AutoComplete
    useEffect(() => {
        if (searchChildQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(searchDiagnosis({ searchQuery: searchChildQuery.query, type: 'child' }));
            }, 500)
            return () => {
                clearTimeout(timeOutId)
            }
        }
    }, [searchChildQuery])

    useEffect(() => {
        const data = [];
        childOptionsList.map((e) => {
            return data.push({
                key: JSON.stringify(e),
                value: e.tds_name,
                label: (
                    <div>
                        {e.tds_name}
                    </div>
                ),
            });
        });
        if (searchChildQuery?.query) {
            data.push({
                key: JSON.stringify({ ...selectedData[searchChildQuery.index], tds_id: 0, tds_name: searchChildQuery.query, pms_default: 0 }),
                value: searchChildQuery.query,
                label: (
                    <>
                        <div>{searchChildQuery.query}</div>
                    </>
                ),
            });
        }
        setChildSearchOptions(data);
    }, [childOptionsList]);

    const onFocusChid = (i) => {
        setSearchChildQuery({ query: selectedData[i].tds_name, index: i })
        dispatch(searchDiagnosis({ searchQuery: selectedData[i].tds_name, type: 'child' }));
    }

    const onSearchChid = useCallback((query, i) => {
        selectedData[i] = { ...selectedData[i], tds_id: 0, tds_name: query, pms_default: 0 }
        setSelectedData(prev => [...prev])
        setSearchChildQuery({ query: query, index: i })
    }, [searchChildQuery, selectedData]);

    const onSelectChild = useCallback((data, e, i) => {
        selectedData[i] = { ...selectedData[i], ...JSON.parse(e.key) }
        setSelectedData(prev => [...prev])
        setSearchChildQuery({ query: JSON.parse(e.key).tds_name, index: i })
    }, [searchChildQuery, selectedData])


    const onSearchSinceChid = useCallback((query, i) => {
        const updateQuery = onlyNumberFormat(query);
        selectedData[i].since = updateQuery
        setSelectedData(prev => [...prev])
        if (updateQuery) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${updateQuery} ${option}`,
                    label: <>{`${updateQuery} ${option}`}</>,
                };
            });
            setSinceOptions(options);
        } else {
            setSinceOptions([]);
        }
    }, [sinceOptions, selectedData]);

    const onSelectSinceChild = useCallback((data, i) => {
        setSinceOptions([]);
        selectedData[i].since = data
        setSelectedData(prev => [...prev])
    }, [sinceOptions, selectedData]);

    const onBlurChild = useCallback((i) => {
        // setSinceOptions([]);
        // selectedData[i].since = ''
        // setSelectedData(prev => [...prev])
    }, [sinceOptions, selectedData]);


    const onSelectSeverityChild = useCallback((data, i) => {
        selectedData[i].severity = data
        setSelectedData(prev => [...prev])
    }, [selectedData]);

    const onChangeNoteChild = useCallback((e, i) => {
        selectedData[i].note = e.target.value
        setSelectedData(prev => [...prev])
    }, [selectedData]);


    const onRemoveRow = (index) => {
        selectedData.splice(index, 1)
        setSelectedData(prev => [...prev])
    };



    //PopOver1 function
    const showHideTemplatesListPopover = useCallback(() => {
        setPopOver1(!popOver1);
    }, [popOver1]);

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
        setSelectedData([...selectedData, ...template.diagnosis]);
        showHideTemplatesListPopover()
    }

    const onDeleteTemplateClicked = (tdt_id) => {
        dispatch(deleteTemplate(tdt_id));
    };



    //PopOver2 function
    const showHideSaveTemplatePopOver = useCallback(() => {
        setTdtTemplateName(null)
        setPopOver2(!popOver2);
    }, [popOver2]);

    const onTabChange = useCallback((key) => {
        setTdtTemplateName(null)
        setTabChange(key);
    }, [tabChange]);

    const onChangeSaveTemplate = useCallback((e) => {
        setTdtTemplateName(e.target.value);
    }, [tdtTemplateName]);

    const onAddTemplateClicked = async () => {
        if (selectedData.length > 0) {
            var sendData = {
                tdt_template_name: tdtTemplateName,
                diagnosis: selectedData
            }
            const action = await dispatch(addTemplate(sendData));
            if (action.meta.requestStatus == 'fulfilled') {
                setTdtTemplateName(null);
                showHideSaveTemplatePopOver()
            }
        } else {
            alert('At least 1 diagnososes added')
        }
    };

    const onSearchTemplate = useCallback(() => {
        setTdtTemplateName(null)
    }, [tdtTemplateName])

    const onSelectTemplate = useCallback((data, e) => {
        setTdtTemplateName(e.key)
    }, [tdtTemplateName])

    const onUpdateTemplateClicked = async () => {
        if (selectedData.length > 0) {
            var data = JSON.parse(tdtTemplateName)
            var sendData = {
                tdt_id: data.tdt_id,
                tdt_template_name: data.tdt_template_name,
                diagnosis: selectedData
            }
            const action = await dispatch(updateTemplate(sendData));
            if (action.meta.requestStatus == 'fulfilled') {
                setTdtTemplateName(null);
                showHideSaveTemplatePopOver()
            }
        } else {
            alert('At least 1 diagnososes added')
        }
    }




    //Child Componet
    const TABLE_DIAGNOSISES = useMemo(() => {
        return (
            selectedData.length > 0 && selectedData.map((item, i) => {
                return (
                    <Row
                        key={i}
                        gutter={[0]}
                        className="align-items-center border-bottom border-top mt-14"
                    >
                        <Col lg={7} md={7} sm={7} xs={7} className="border-end">
                            <div className="fontroboto fw-medium">
                                <AutoComplete
                                    defaultValue={item.tds_name}
                                    // value={item.tds_name}
                                    bordered={false}
                                    defaultOpen={false}
                                    onSearch={(query) => onSearchChid(query, i)}
                                    onFocus={() => onFocusChid(i)}
                                    options={childSearchOptions}
                                    className="autocomplete-custom w-100 inputborder"
                                    defaultActiveFirstOption={true}
                                    onSelect={(data, e) => onSelectChild(data, e, i)}
                                />
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                            <AutoComplete
                                defaultValue={item.since}
                                value={item.since}
                                placeholder="Since"
                                bordered={false}
                                defaultOpen={false}
                                onSearch={(query) => onSearchSinceChid(query, i)}
                                options={sinceOptions}
                                className="autocomplete-custom w-100 inputborder"
                                defaultActiveFirstOption={true}
                                onSelect={(data) => onSelectSinceChild(data, i)}
                                onBlur={() => onBlurChild(i)}
                            />
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                            <Select
                                className="autocomplete-custom w-100 inputborder"
                                placeholder="Severity"
                                // onSelect={(value) => {
                                //     accumulateOtherData(item, "severity", value);
                                // }}
                                onSelect={(data) => onSelectSeverityChild(data, i)}
                                options={SEVERITY_LIST}

                            //     showSearch
                            // className="autocomplete-custom w-100 popinput inputheight41"
                            // placeholder="Select Template"
                            // onSearch={onSearchTemplate}
                            // onSelect={onSelectTemplate}
                            // options={allTemplates.map((template) => {
                            //     return {
                            //         key: JSON.stringify(template),
                            //         value: template.tdt_template_name,
                            //         label: (
                            //             <div key={template.tdt_id}>
                            //                 {template.tdt_template_name}
                            //             </div>
                            //         ),
                            //     };
                            // })}
                            />
                        </Col>
                        <Col lg={8} md={8} sm={7} xs={7} className="border-end">
                            <Input
                                className="notesinput border-0"
                                placeholder="Notes"
                                onChange={(e) => onChangeNoteChild(e, i)}
                            />
                        </Col>
                        <Col lg={1} md={1} sm={2} xs={2} className="text-center">
                            <Button
                                className="btn py-0 btn-delete-prescription px-0"
                                onClick={() => onRemoveRow(i)}>
                                <i className="icon-delete"></i>
                            </Button>
                        </Col>
                    </Row>
                );
            })
        )
    }, [selectedData, childSearchOptions])

    //Template Componet
    const TEMPLATE_CONTENT = useCallback(() => {
        return (
            <>
                <div className="pop-header" key="diagnosis-template">
                    <div className="align-items-center d-flex justify-content-between">
                        <div className="title-common">Diagnosis Templates</div>
                        <Button
                            className="btn btn-delete-prescription p-0"
                            onClick={showHideTemplatesListPopover}
                        >
                            <i className="icon-Cross" />
                        </Button>
                    </div>
                    <div className="mt-3" key="diagnosis-template-search">
                        <Input
                            className="popinput"
                            onChange={onSearch}
                            prefix={<i className="icon-search me-2" />}
                        />
                    </div>
                </div>
                <div className="pop-body">
                    {matchedTemplates.length > 0 && matchedTemplates.map((template, i) => {
                        return (
                            <div className="align-items-center d-flex medicine-templates" key={i}>
                                <div className="round-box"
                                    onClick={() => onTemplateSelected(template)}>
                                    <i className="icon-template"></i>
                                </div>
                                <div className="text-truncate w-100"
                                    onClick={() => onTemplateSelected(template)}>
                                    <div className="title">{template.tdt_template_name}</div>
                                    <div className="text-truncate">
                                        {template.diagnosis.map((item, ii) => {
                                            return (
                                                <span key={ii}>{`${item.tds_name}${template.diagnosis.length - 1 != ii ? ', ' : ''}`}</span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <Button className="btn btn-delete-prescription p-0 ms-2"
                                    onClick={() => onDeleteTemplateClicked(template.tdt_id)} >
                                    {template.loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22 }} spin />} /> : <i className="icon-delete"></i>}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </>
        )
    }, [popOver1, matchedTemplates])

    //Save Componet
    const SAVE_CONTENT = useCallback(() => {
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
                            className="popinput inputheight41"
                            placeholder="Template Name"
                            onChange={onChangeSaveTemplate}
                        />
                        <Button
                            className="btn btn-primary3 btn-41 ms-3"
                            loading={loading}
                            disabled={tdtTemplateName ? false : true}
                            onClick={onAddTemplateClicked}>
                            {" Save "}
                        </Button>
                    </div>
                ) : (
                    <div className="pop-header d-flex">
                        <Select
                            showSearch
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
                            disabled={tdtTemplateName ? false : true}
                            onClick={onUpdateTemplateClicked}>
                            {" Update "}
                        </Button>
                    </div>
                )}
            </>
        )
    }, [tabChange, popOver2, tdtTemplateName, loading, allTemplates])


    return (
        <div className="col-lg-8 col-md-12 col-12 mt-lg-0 mt-3">
            <div className="prescription-box-sm">
                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                    <div className="d-flex align-items-center">
                        <img className="me-2" src={Diagnosisicon} alt="Diagnosis" />
                        <div className="title-common">Diagnosis</div>
                    </div>
                    <div className="d-flex align-items-center">
                        <button className="btn d-flex align-items-center btn-text">
                            {" "}
                            <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span>
                        </button>
                        <Popover
                            open={popOver1}
                            onOpenChange={showHideTemplatesListPopover}
                            content={TEMPLATE_CONTENT}
                            trigger="click"
                            overlayClassName="pop-350 pp-0"
                            placement="bottom"
                        >
                            <button className="btn d-flex align-items-center btn-text">
                                {" "}
                                <i className="icon-template me-2"></i> <span>Templates</span>
                            </button>
                        </Popover>
                        <Popover
                            open={popOver2}
                            onOpenChange={showHideSaveTemplatePopOver}
                            content={SAVE_CONTENT}
                            trigger="click"
                            overlayClassName="pop-450 pp-0"
                            placement="bottom"
                        >
                            <button className="btn d-flex align-items-center btn-text">
                                {" "}
                                <i className="icon-save me-2"></i> <span>Save</span>
                            </button>
                        </Popover>
                    </div>
                </div>

                {TABLE_DIAGNOSISES}

                <div className="p-14">
                    <AutoComplete
                        // defaultValue={searchParentQuery}
                        value={searchParentQuery}
                        onSearch={onSearchParent}
                        options={parentSearchOptions}
                        className="autocomplete-custom w-100"
                        onSelect={onSelectParent}
                        defaultActiveFirstOption={true}>
                        <Input
                            placeholder="Search by Patient’s Name, Phone number or Id"
                            prefix={<i className="icon-search"></i>}
                        />
                    </AutoComplete>
                </div>

            </div>
        </div>
    )
}

export default React.memo(DiagnosisBox)