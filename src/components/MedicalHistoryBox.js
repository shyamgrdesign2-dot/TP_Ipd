import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Card, Row, Col, Checkbox, Input, message, Spin, Popover } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../context/CashManagerContext';
import { MESSAGE_KEY } from "../utils/constants";
import { removeBeforeWhiteSpace, onlyNumberFormat, hasNumber, capitalizeAfterSentence } from "../utils/utils";

import noRecordFound from '../assets/images/no-record-round.svg';
import verticleUpDown from '../assets/images/verticle-up-down.svg';
import ActiveverticleUpDown from '../assets/images/active-verticle-up-down.svg';
import InActiveverticleUpDown from '../assets/images/inactive-verticle-up-down.svg';
import NoHypertension from '../assets/images/no-hypertension.png';

import {
    listSectionwithTag,
    addTag,
    searchTag
} from "../redux/medicalhistorySlice";

function MedicalHistoryBox(props) {

    const { handleDrawerMedicalHistory, handleCollapsed } = props

    const [messageApi, contextHolder] = message.useMessage();
    const {
        searchList,
        defaultList,
        loading,
    } = useSelector((state) => state.medicalhistory);
    const dispatch = useDispatch();

    const { medicalHistoryData, setMedicalHistoryData } = useContext(CashManagerContext);
    // const [ medicalHistoryData, setMedicalHistoryData] = useState([]);
    const [cloneMedicalHistoryData, setCloneMedicalHistoryData] = useState([])

    const MEDICAL_PROBLEM = {
        since: '',
        status: '',
        medication: '',
        note: ''
    }
    const FAMILY_HISTORY = {
        since: '',
        relationship: '',
        note: ''
    }
    const OTHERS = {
        since: '',
        status: '',
        note: ''
    }

    const [selectData, setSelectData] = useState(null);
    const [addEditData, setAddEditData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);

    const SINCE_OPTIONS = [
        { value: "Hour", label: "H" },
        { value: "Day", label: "D" },
        { value: "Week", label: "W" },
        { value: "Month", label: "M" },
        { value: "Year", label: "Y" },
    ];
    const [sinceValue, setSinceValue] = useState(1);
    const [inputSince, setInputSince] = useState('');
    const [sinceOptions, setSinceOptions] = useState([]);

    const STATUS_LIST = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];
    const MEDICATION_LIST = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    const [popOver, setPopOver] = useState(false);
    const RELATIONSHIP_LIST = ['Father', 'Mother', 'Grandparents', 'Uncle', 'Aunty', 'Sibling', 'Relatives']
    const [selectedRelationship, setSelectedRelationship] = useState([]);

    // useEffect(() => {
    //     defaultList.length === 0 && dispatch(listSectionwithTag());
    // }, [handleDrawerMedicalHistory]);

    useEffect(() => {
        dispatch(listSectionwithTag());
    }, []);

    useEffect(() => {
        if (defaultList.length > 0) {
            const data1 = JSON.parse(JSON.stringify(defaultList))
            const data2 = JSON.parse(JSON.stringify(medicalHistoryData))
            const mergedArray = data2.length > 0 ? [
                ...data1.map(e => ({
                    ...e,
                    ...(data2?.find(x => x.tmmhs_id === e.tmmhs_id) || {}),
                    tags: [
                        ...e?.tags.map(tag => ({
                            ...tag,
                            ...(data2?.find(x => x.tmmhs_id === e.tmmhs_id)?.tags?.find(x1 => x1.tmmhst_id === tag.tmmhst_id) || {})
                        })),
                        ...data2?.find(x => x.tmmhs_id === e.tmmhs_id)?.tags?.filter(item2 => !e?.tags?.find(item1 => item1.tmmhst_id === item2.tmmhst_id))
                    ],
                }))
            ] : data1;
            setCloneMedicalHistoryData(JSON.parse(JSON.stringify(mergedArray)));
        }
    }, [defaultList]);

    const onNoKnownHistoryChange = useCallback((e, i) => {
        cloneMedicalHistoryData[i].no_know_history = e.target.checked
        setCloneMedicalHistoryData((prev) => [...prev]);
    }, [cloneMedicalHistoryData]);

    const onExpandCollapseClick = useCallback((i) => {
        cloneMedicalHistoryData[i].isExpand = !cloneMedicalHistoryData[i].isExpand
        setCloneMedicalHistoryData((prev) => [...prev]);
    }, [cloneMedicalHistoryData]);

    const onTagClick = useCallback((tmmhs_id, tmmhst_id, i, i1) => {
        setAddEditData(null)
        setSelectData({
            tmmhs_id: tmmhs_id,
            tmmhst_id: tmmhst_id,
            section_index: i,
            tag_index: i1
        });
        let initial = {}
        if (tmmhs_id === 2) {
            initial = { ...MEDICAL_PROBLEM }
        } else if (tmmhs_id === 3) {
            initial = { ...FAMILY_HISTORY }
        } else {
            initial = { ...OTHERS }
        }
        if (cloneMedicalHistoryData[i].tags[i1].enable === undefined || cloneMedicalHistoryData[i].tags[i1].enable === "-") {
            setCloneMedicalHistoryData((prev) => {
                const newArray = [...prev];
                newArray[i].tags[i1] = {
                    ...newArray[i].tags[i1],
                    ...initial,
                    enable: "Y"
                };
                return newArray;
            })
        }
        setSinceValue(cloneMedicalHistoryData[i].tags[i1].since ? parseInt(cloneMedicalHistoryData[i].tags[i1].since.split(" ")[0]) : 1)
        setSelectedRelationship(cloneMedicalHistoryData[i].tags[i1].relationship ? cloneMedicalHistoryData[i].tags[i1].relationship.split(', ') : [])
    }, [addEditData, selectData, cloneMedicalHistoryData]);

    const onEnableClick = useCallback((tmmhs_id, tmmhst_id, i, i1) => {
        setAddEditData(null)
        setSelectData({
            tmmhs_id: tmmhs_id,
            tmmhst_id: tmmhst_id,
            section_index: i,
            tag_index: i1
        });
        let initial = {}
        if (tmmhs_id === 2) {
            initial = { ...MEDICAL_PROBLEM }
        } else if (tmmhs_id === 3) {
            initial = { ...FAMILY_HISTORY }
        } else {
            initial = { ...OTHERS }
        }
        setCloneMedicalHistoryData((prev) => {
            const newArray = [...prev];
            newArray[i].tags[i1] = {
                ...newArray[i].tags[i1],
                ...initial,
                enable: newArray[i].tags[i1].enable !== undefined ?
                    newArray[i].tags[i1].enable === "Y" ? "N"
                        : newArray[i].tags[i1].enable === "N" ? "-" : "Y"
                    : "Y"
            };
            return newArray;
        })
        setSinceValue(cloneMedicalHistoryData[i].tags[i1].since ? parseInt(cloneMedicalHistoryData[i].tags[i1].since.split(" ")[0]) : 1)
        setSelectedRelationship(cloneMedicalHistoryData[i].tags[i1].relationship ? cloneMedicalHistoryData[i].tags[i1].relationship.split(', ') : [])
    }, [addEditData, selectData, cloneMedicalHistoryData]);


    const onAddEditClick = useCallback((e) => {
        let modifyData = JSON.parse(JSON.stringify(e))
        modifyData.tags.map((e) => {
            e.unique_id = uuidv4()
            return e
        })
        setAddEditData(modifyData)
    }, [addEditData]);

    useEffect(() => {
        if (searchQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(searchTag({ section_id: addEditData?.tmmhs_id, keyword: searchQuery }));
            }, 500);
            return () => {
                clearTimeout(timeOutId);
            };
        }
    }, [searchQuery]);

    useEffect(() => {
        const data = [];
        searchList.map((e) => {
            return data.push({
                key: JSON.stringify({ ...e, unique_id: uuidv4() }),
                value: e.title
            });
        });
        if (searchQuery.length > 0) {
            searchQuery &&
                data.push({
                    key: JSON.stringify({
                        unique_id: uuidv4(),
                        tmmhst_id: 0,
                        pms_default: 1,
                        title: searchQuery
                    }),
                    value: searchQuery
                });
        }
        setSearchOptions(data);
    }, [searchList]);

    const onSearch = useCallback((e) => {
        setSearchQuery(removeBeforeWhiteSpace(e.target.value));
    }, [searchQuery]);

    const onSelectParent = useCallback((e) => {
        addEditData.tags.push({
            ...e
        });
        setAddEditData((prev) => {
            return { ...prev };
        })
        setSearchQuery("")
    }, [addEditData]);

    const onRemoveTag = useCallback((e, i) => {
        if (e.tmmhst_id == 0) {
            addEditData.tags.splice(i, 1);
        } else {
            e.delete = true
        }
        setAddEditData((prev) => {
            return { ...prev };
        })
    }, [addEditData]);

    const onAddEditSaveClick = async () => {
        var sendData = JSON.parse(JSON.stringify(addEditData))
        const action = await dispatch(addTag(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            setAddEditData(null)
            if (action.payload.tags.length > 0) {
                const updatedData = action.payload?.tags?.map((e, i) => {
                    const data = sendData?.tags?.find(e1 => e1.unique_id == e.unique_id)
                    return { ...e, ...data };
                });
                const index = cloneMedicalHistoryData?.findIndex(e => e.tmmhs_id == sendData.tmmhs_id)
                setCloneMedicalHistoryData((prev) => {
                    const newArray = [...prev];
                    newArray[index].tags = [
                        ...updatedData.map(({ unique_id, ...rest }) => rest),
                    ];
                    return newArray;
                })
            }
        } else {
            messageApi.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: action.error.message,
                duration: 2
            });
        }
    }

    useEffect(() => {
        if (sinceValue !== -1) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${sinceValue} ${sinceValue <= 1 ? option.value : `${option.value}(s)`}`,
                    label: <>{`${sinceValue}${option.label}`}</>,
                };
            });
            setSinceOptions(options);
        } else if (inputSince.length > 0) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${inputSince} ${inputSince <= 1 ? option.value : `${option.value}(s)`}`,
                    label: <>{`${inputSince}${option.label}`}</>,
                };
            });
            setSinceOptions(options);
        } else {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${option.value}`,
                    label: <>{`${option.label}`}</>,
                };
            });
            setSinceOptions(options);
        }
    }, [sinceValue]);

    const onChangeInputSinceChild = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            setInputSince(updateQuery);
            cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].since = ''
            setCloneMedicalHistoryData((prev) => [...prev]);
            if (updateQuery.length > 0) {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${updateQuery} ${updateQuery <= 1 ? option.value : `${option.value}(s)`}`,
                        label: <>{`${updateQuery}${option.label}`}</>,
                    };
                });
                setSinceOptions(options);
            } else {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${option.value}`,
                        label: <>{`${option.label}`}</>,
                    };
                });
                setSinceOptions(options);
            }
        },
        [inputSince, sinceOptions, cloneMedicalHistoryData]
    );

    const SINCE_LIST = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: -1, label: <Input className="w-100 custom-segment-input inputheight45 border-0" placeholder="Custom" value={inputSince} inputMode="numeric" onChange={onChangeInputSinceChild} onClick={() => onChangeSegmentedSinceChild(-1)} /> }
    ];

    const onChangeSegmentedSinceChild = useCallback(
        (key) => {
            setSinceValue(key)
            cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].since = ''
            setCloneMedicalHistoryData((prev) => [...prev]);
        },
        [sinceValue, cloneMedicalHistoryData]
    );

    const onChangeSinceChild = useCallback(
        (key) => {
            if (hasNumber(key)) {
                if (key != cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.since) {
                    cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].since = key
                } else {
                    cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].since = ''
                }
                setCloneMedicalHistoryData((prev) => [...prev]);
            }
        },
        [selectData, cloneMedicalHistoryData]
    );

    const onChangeStatus = useCallback((key) => {
        if (key != cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status) {
            cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].status = key
        } else {
            cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].status = ''
        }
        setCloneMedicalHistoryData((prev) => [...prev]);
    }, [selectData, cloneMedicalHistoryData]);

    const onChangeMedication = useCallback((key) => {
        if (key != cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.medication) {
            cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].medication = key
        } else {
            cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].medication = ''
        }
        setCloneMedicalHistoryData((prev) => [...prev]);
    }, [selectData, cloneMedicalHistoryData]);

    const onChangeInputNote = useCallback((e) => {
        cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].note = capitalizeAfterSentence(e.target.value)
        setCloneMedicalHistoryData((prev) => [...prev]);
    }, [selectData, cloneMedicalHistoryData]);

    const showHidePopover = useCallback(() => {
        setPopOver(!popOver);
    }, [popOver]);

    const onCheckboxClick = (e) => {
        const index = selectedRelationship.indexOf(e);
        if (index !== -1) {
            selectedRelationship.splice(index, 1);
        } else {
            selectedRelationship.push(e)
        }
        setSelectedRelationship((prev) => [...prev])
    }

    const onChangeRelationship = () => {
        cloneMedicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].relationship = selectedRelationship.join(', ')
        setCloneMedicalHistoryData((prev) => [...prev]);
    }

    const RELATIONSHIP_CONTENT = useCallback(() => {
        return (
            <div className="pop-body pop-h-none">
                {RELATIONSHIP_LIST.map((e, i) => {
                    return (
                        <div className="px-3 py-2" key={i}>
                            <Checkbox className="advice-check" checked={selectedRelationship.includes(e)} onClick={() => onCheckboxClick(e)}>{e}</Checkbox>
                        </div>
                    )
                })}
                <div className="d-flex justify-content-end align-items-center my-2 pt-2 border-top">
                    <Button className='btn mx-3 p-0 shadow-none border-0' onClick={showHidePopover}>
                        Cancel
                    </Button>
                    <Button className='btn mx-3 p-0 btn-save' onClick={() => {
                        showHidePopover()
                        onChangeRelationship()
                    }}>
                        Save
                    </Button>
                </div>
            </div>
        );
    }, [popOver, selectedRelationship]);

    const onSaveClicked = async () => {
        const medicalHistory = cloneMedicalHistoryData?.map((e) => {
            return {
                ...e,
                no_know_history: e?.no_know_history !== undefined ? e?.no_know_history : false,
                tags: !e?.no_know_history ? e?.tags?.filter(x => x.enable == 'Y' || x.enable == 'N') : []
            }
        })
        if (medicalHistory.filter(e => !e?.no_know_history && e?.tags?.length === 0).length === medicalHistory.length) {
            setMedicalHistoryData([])
            handleDrawerMedicalHistory()
        } else {
            setMedicalHistoryData(JSON.parse(JSON.stringify(medicalHistory)))
            handleCollapsed(2)
        }
    }

    return (
        <>
            {contextHolder}
            <Card bordered={false} className="search-modalCard">
                <div>
                    <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center me-3'>
                                <div onClick={handleDrawerMedicalHistory} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                            </div>
                            <div className="title-common">Medical History</div>
                        </div>
                        <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={onSaveClicked}>
                            Save
                        </Button>
                    </div>
                </div>
                <Row>
                    <Col lg={15}>
                        <div className="bg-white overflow-y-auto medical-history-section" style={{ height: 'calc(100vh - 61px)' }}>
                            {cloneMedicalHistoryData.length > 0 ? (
                                cloneMedicalHistoryData?.map((e, i) => {
                                    return (
                                        <div key={i} className="border-bottom px-4 pt-3 pb-2">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="titleprint">{e?.title}</div>
                                                    <Button className="btn border rounded-3 px-1 ms-3 collapseButton" onClick={() => onExpandCollapseClick(i)}>
                                                        <i style={{ transitionDuration: '0.5s' }} className={`icon-right d-block fs-18 ${e?.isExpand ? 'iconrotate270' : 'iconrotatehistory90'}`}></i>
                                                    </Button>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <Checkbox className="fontroboto" onChange={(e) => onNoKnownHistoryChange(e, i)}>No known history</Checkbox>
                                                    <button className='btn d-flex ms-1 align-items-center btn-text pe-0' onClick={() => onAddEditClick(e)}>
                                                        <i className="icon-setting me-2"></i> <span>Add & Edit</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-wrap">
                                                {!e?.no_know_history && !e?.isExpand && e?.tags?.map((e1, i1) => {
                                                    return (
                                                        <div key={e1?.tmmhst_id} className={`history-badge ${e1?.enable !== undefined ? e1?.enable === "Y" ? 'history-active' : e1?.enable === "N" ? 'history-inactive' : '' : ''}`}>
                                                            <div onClick={() => onTagClick(e?.tmmhs_id, e1?.tmmhst_id, i, i1)}>{e1?.title}</div>
                                                            <span onClick={() => onEnableClick(e?.tmmhs_id, e1?.tmmhst_id, i, i1)}>{e1?.enable !== undefined ? e1?.enable : "-"}<img src={e1?.enable !== undefined ? e1?.enable === "Y" ? ActiveverticleUpDown : e1?.enable === "N" ? InActiveverticleUpDown : verticleUpDown : verticleUpDown} />
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <Spin />
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col lg={9}>
                        <div className="bg-body overflow-y-auto" style={{ height: 'calc(100vh - 61px)' }}>
                            {addEditData ? (
                                <div>
                                    <div className="selectedchip-header1 d-flex flex-column justify-content-center title px-20">
                                        <span className="text-truncate">{addEditData?.title}</span>
                                    </div>
                                    <div className="p-3">
                                        <div className="mt-1 mb-3">
                                            <Input className="popinput" onChange={onSearch} value={searchQuery} placeholder="Search Allergy" prefix={<i className='icon-search me-2'></i>} allowClear />
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            {searchQuery.length > 0 ? (
                                                searchOptions?.map((item, i) => {
                                                    return (
                                                        i === searchOptions.length - 1 ? (
                                                            <Button
                                                                key={i}
                                                                type="text"
                                                                className="btn btn-primary2 chips-custom mb-14 chips-addCustom chips-height"
                                                                onClick={() => onSelectParent({ ...JSON.parse(item.key) })}>
                                                                "{item.value}" <i className="icon-Add mx-2 fs-6"></i> <a className="fw-medium text-decoration-underline text-primary"> Add Custom</a>
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                key={i}
                                                                type="text"
                                                                style={{ width: item.value.length > 26 && '250px' }}
                                                                className={`${item.value.length > 26 && 'chips-custom-break'} btn btn-primary2 chips-custom mb-14 me-14`}
                                                                onClick={() => onSelectParent({ ...JSON.parse(item.key) })}>
                                                                {item.value}
                                                            </Button>
                                                        )
                                                    )
                                                })
                                            ) : (
                                                addEditData?.tags?.filter(e => !e.delete).map((e, i) => {
                                                    return (
                                                        <div key={e?.tmmhst_id} className="border rounded-10px px-2 py-1 d-flex align-items-center me-3 mb-2 bg-white fontroboto">
                                                            {e?.title}
                                                            <i className="ms-2 icon-Cross fs-18" onClick={() => onRemoveTag(e, i)}></i>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center mt-4">
                                            <Button className='btn btn-text me-4 p-0 shadow-none border-0' onClick={() => setAddEditData(null)}>
                                                Cancel
                                            </Button>
                                            <Button className='btn btn-primary3 btn-41 px-4' onClick={onAddEditSaveClick} loading={loading}>
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                selectData ? (
                                    cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.enable == 'Y' ? (
                                        <div>
                                            <div className="selectedchip-header1 d-flex flex-column justify-content-center title px-20">
                                                <span className="text-truncate">{cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.title}</span>
                                            </div>

                                            <div className="p-3">
                                                <div className="mt-2">
                                                    <label className="title-common mb-1"> Since</label>
                                                    <div className="segement-static d-flex">
                                                        {SINCE_LIST.map((item, i) => {
                                                            return (
                                                                <button key={i}
                                                                    type="button"
                                                                    className={`btn w-100 p-0 ${sinceValue > 5 ? item.value == -1 && 'btn-segement custom-input-selected' : sinceValue == item.value && 'btn-segement'}`}
                                                                    onClick={() => onChangeSegmentedSinceChild(item.value)}>
                                                                    {item.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <div className="segement-static d-flex">
                                                        {sinceOptions.map((item, i) => {
                                                            return (
                                                                <button key={i}
                                                                    type="button"
                                                                    className={`btn w-100 ${cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.since !== undefined && cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.since == item.value && 'btn-segement'}`}
                                                                    onClick={() => onChangeSinceChild(item.value)}>
                                                                    {item.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                {selectData?.tmmhs_id != 3 && (
                                                    <div className="mt-5">
                                                        <label className="title-common mb-1">Status</label>
                                                        <div className="segement-static d-flex">
                                                            {STATUS_LIST.map((item, i) => {
                                                                return (
                                                                    <button key={i}
                                                                        type="button"
                                                                        className={`btn w-100 ${cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status !== undefined && cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status == item.value && 'btn-segement'}`}
                                                                        onClick={() => onChangeStatus(item.value)}>
                                                                        {item.label}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectData?.tmmhs_id == 2 && cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status == 'Active' && (
                                                    <div className="mt-5">
                                                        <label className="title-common mb-1"> Medication</label>
                                                        <div className="segement-static d-flex">
                                                            {MEDICATION_LIST.map((item, i) => {
                                                                return (
                                                                    <button key={i}
                                                                        type="button"
                                                                        className={`btn w-100 ${cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.medication !== undefined && cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.medication == item.value && 'btn-segement'}`}
                                                                        onClick={() => onChangeMedication(item.value)}>
                                                                        {item.label}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectData?.tmmhs_id == 3 && (
                                                    <div className="mt-5">
                                                        <label className="title-common mb-1"> Relationship</label>
                                                        <Popover
                                                            open={popOver}
                                                            onOpenChange={showHidePopover}
                                                            content={RELATIONSHIP_CONTENT}
                                                            trigger="click"
                                                            arrow={false}
                                                            overlayClassName="pop-350 pp-0"
                                                            placement="bottom">
                                                            <Input className="popinput" readOnly value={cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.relationship !== undefined ? cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.relationship : ''} placeholder="Search relationship" suffix={<i className='icon-right iconrotate270 ms-2'></i>} allowClear />
                                                        </Popover>
                                                    </div>
                                                )}
                                                <div className="mt-5">
                                                    <label className="title-common mb-1">Note</label>
                                                    <Input.TextArea value={cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.note !== undefined && cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.note} placeholder="Enter any specific notes here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNote} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.enable == 'N' && (
                                        <div className="text-center">
                                            <img className="mt-4 mb-3" style={{ width: 135 }} src={NoHypertension} alt="No Result Found" />
                                            <div className="title-hypertension">{`No ${cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.title} !`}</div>
                                            <div className="fontroboto text-main title fw-normal mt-2">
                                                You have selected that patient does not <br />
                                                have {cloneMedicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.title}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center">
                                        <img className="my-4" style={{ width: 194 }} src={noRecordFound} alt="No Result Found" />
                                        <div className="fontroboto text-main title-common"> No Records Found! </div>
                                        <div className="fontroboto text-main title fw-normal mt-2"> You haven’t added any medical history. </div>
                                    </div>
                                )
                            )}
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}


export default React.memo(MedicalHistoryBox);
