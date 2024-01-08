import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Button, Card, Row, Col, Input, Select, message,Segmented } from 'antd';
import { Button as BSButton, ButtonGroup as BSButtonGroup } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { onlyNumberFormat } from "../../utils/utils";

import CashManagerContext from '../../context/CashManagerContext';
import { MESSAGE_KEY } from "../../utils/constants";
import {
    getMedicineDetails,
    searchMedication,
} from "../../redux/medicationSlice";

import TabSearchHeader from "./TabSearchHeader";

function TabMedicationSearch({ passIndex, onClose }) {

    const [messageApi, contextHolder] = message.useMessage();
    const {
        parentOptionsList,
        childOptionsList,
        timingList,
        frequencyList,
    } = useSelector((state) => state.medication);
    const dispatch = useDispatch();

    const { medicationData, setMedicationData } = useContext(CashManagerContext);

    const [searchChildQuery, setSearchChildQuery] = useState("");
    const [childSearchOptions, setChildSearchOptions] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(passIndex);
    const SINCE_OPTIONS = [
        { value: "day(s)", label: "D" },
        { value: "week(s)", label: "W" },
        { value: "month(s)", label: "M" },
        { value: "year(s)", label: "Y" },
    ];
    const [sinceValue, setSinceValue] = useState(1);
    const [inputSince, setInputSince] = useState('');
    const [sinceOptions, setSinceOptions] = useState([]);


    //Parent AutoComplete
    useEffect(() => {
        if (searchChildQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(
                    searchMedication({ searchQuery: searchChildQuery, type: "child" })
                );
            }, 500);
            return () => {
                clearTimeout(timeOutId);
            };
        }
    }, [searchChildQuery]);

    useEffect(() => {
        const data = [];
        childOptionsList.map((e) => {
            return data.push({
                key: JSON.stringify({ ...e, unique_id: uuidv4() }),
                value: e.tmm_medicine_name
            });
        });
        // if (searchChildQuery.length > 0) {
        //     searchChildQuery &&
        //         data.push({
        //             key: JSON.stringify({
        //                 unique_id: uuidv4(),
        //                 change: 1,
        //                 symptom_name: searchChildQuery
        //             }),
        //             value: searchChildQuery
        //         });
        // }
        setChildSearchOptions(data);
    }, [childOptionsList]);

    const onSearchParent = useCallback(
        (query) => {
            setSearchChildQuery(query);
        },
        [searchChildQuery]
    );

    const onSelectParent = useCallback(
        async (e) => {
            const action = await dispatch(getMedicineDetails(e.tmm_id));
            if (action.meta.requestStatus == "fulfilled") {
                const updatedData = action.payload.map(e => {
                    const medicineUnit = e?.medicineUnit.map((e1) => {
                        return {
                            key: Math.random(),
                            value: e1.tmu_id,
                            label: <>{e1.tmu_title}</>,
                        };
                    });
                    return { ...e, medicineUnit: medicineUnit, unique_id: uuidv4() }
                })
                medicationData.push({
                    ...updatedData[0],
                });
                setMedicationData((prev) => [...prev]);
                setSelectedIndex(medicationData.length - 1);
                setSinceValue(1)
            } else {
                messageApi.open({
                    MESSAGE_KEY,
                    type: 'warning',
                    content: action.error.message,
                    duration: 2
                });
            }
        },
        [medicationData, selectedIndex]
    );

    const onRemoveRow = (index) => {
        medicationData.splice(index, 1);
        setMedicationData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    //Child Componet
    const TABLE_MEDICATION = useMemo(() => {
        return (
            medicationData.length > 0 &&
            medicationData.map((item, index) => {
                return (
                    <div key={index} style={{ width: item.tmm_medicine_name.length > 12 && item.tmm_medicine_name.length < 24 ? `${item.tmm_medicine_name.length * 10.5}px` : item.tmm_medicine_name.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                        <div className="text-truncate p-2" onClick={() => {
                            setSelectedIndex(index)
                            setSinceValue(item.tmm_days ? parseInt(item.tmm_days) : 1)
                        }}>
                            <div className="text-truncate">{item.tmm_medicine_name}</div>
                        </div>
                        <Button type="text" className="border-start rounded-0 btn-close-chips" onClick={() => onRemoveRow(index)}>
                            <i className="icon-Cross"></i>
                        </Button>
                    </div>
                );
            })
        );
    }, [medicationData]);

    const onChangeDosageChild = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            medicationData[selectedIndex].tmm_dosage = updateQuery;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onSelectMedicineUnitChild = useCallback(
        (data) => {
            medicationData[selectedIndex].tmm_unit = data;
            medicationData[selectedIndex].tmu_id = data;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onSelectMedicineFrequencyChild = useCallback(
        (data) => {
            const obj = frequencyList.find(e => e.value == data)
            if (obj != undefined) {
                const objParse = JSON.parse(obj.key)
                medicationData[selectedIndex].tmm_freq_type = objParse.tmf_id;
                medicationData[selectedIndex].tmf_block = objParse.tmf_block;
                setMedicationData((prev) => [...prev]);
            }
        },
        [selectedIndex, medicationData]
    );

    const morningDecrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_morning = parseInt(medicationData[selectedIndex].tcm_tmm_freq_morning) - 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const morningClick = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_morning = 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onChangeInputMorningChild = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            medicationData[selectedIndex].tcm_tmm_freq_morning = updateQuery;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const morningIncrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_morning = parseInt(medicationData[selectedIndex].tcm_tmm_freq_morning) + 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const afternoonDecrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_afternoon = parseInt(medicationData[selectedIndex].tcm_tmm_freq_afternoon) - 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const afternoonClick = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_afternoon = 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onChangeInputAfternoonChild = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            medicationData[selectedIndex].tcm_tmm_freq_afternoon = updateQuery;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const afternoonIncrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_afternoon = parseInt(medicationData[selectedIndex].tcm_tmm_freq_afternoon) + 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const eveningDecrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_evening = parseInt(medicationData[selectedIndex].tcm_tmm_freq_evening) - 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const eveningClick = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_evening = 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onChangeInputEveningChild = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            medicationData[selectedIndex].tcm_tmm_freq_evening = updateQuery;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const eveningIncrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_evening = parseInt(medicationData[selectedIndex].tcm_tmm_freq_evening) + 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const nightDecrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_night = parseInt(medicationData[selectedIndex].tcm_tmm_freq_night) - 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const nightClick = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_night = 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onChangeInputNightChild = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            medicationData[selectedIndex].tcm_tmm_freq_night = updateQuery;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const nightIncrement = useCallback(
        () => {
            medicationData[selectedIndex].tcm_tmm_freq_night = parseInt(medicationData[selectedIndex].tcm_tmm_freq_night) + 1;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onSelectMedicineTimingChild = useCallback(
        (data) => {
            medicationData[selectedIndex].tmm_time = data;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    useEffect(() => {
        if (sinceValue != -1) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: option.value,
                    label: <>{`${sinceValue} ${option.label}`}</>,
                };
            });
            setSinceOptions(options);
        } else if (inputSince.length > 0) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: option.value,
                    label: <>{`${inputSince} ${option.label}`}</>,
                };
            });
            setSinceOptions(options);
        } else {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: option.value,
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
            medicationData[selectedIndex].tmm_days = parseInt(updateQuery);
            medicationData[selectedIndex].tmm_duration_type = '';
            setMedicationData((prev) => [...prev]);
            if (updateQuery.length > 0) {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: option.value,
                        label: <>{`${updateQuery} ${option.label}`}</>,
                    };
                });
                setSinceOptions(options);
            } else {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: option.value,
                        label: <>{`${option.label}`}</>,
                    };
                });
                setSinceOptions(options);
            }
        },
        [inputSince, sinceOptions, medicationData]
    );

    const SINCE_LIST = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: -1, label: <Input className="w-100 segment-input" placeholder="Custom" value={inputSince} inputMode="numeric" onChange={onChangeInputSinceChild} onClick={() => onChangeSegmentedSinceChild(-1)} /> }
    ];

    const onChangeSegmentedSinceChild = useCallback(
        (key) => {
            console.log(key)
            setSinceValue(key)
            medicationData[selectedIndex].tmm_days = key != -1 ? key : 0;
            medicationData[selectedIndex].tmm_duration_type = '';
            setMedicationData((prev) => [...prev]);
        },
        [sinceValue, selectedIndex, medicationData]
    );

    const onChangeSinceChild = useCallback(
        (key) => {
            medicationData[selectedIndex].tmm_duration_type = key;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    const onChangeInputNoteChild = useCallback(
        (e) => {
            medicationData[selectedIndex].tmm_remarks = e.target.value;
            setMedicationData((prev) => [...prev]);
        },
        [selectedIndex, medicationData]
    );

    //Child Componet
    const CHILD_DRAWER_DATA = useMemo(() => {
        return (
            selectedIndex != null && (
                <>
                    <div className="h-100">
                        <div className="selectedchip-header d-flex flex-column justify-content-center title px-20">
                            <div className="text-truncate title-common fontroboto">{selectedIndex != null && medicationData[selectedIndex].tmm_medicine_name}
                                <div className="text-truncate fs-14 fontroboto mt-1">{selectedIndex != null && medicationData[selectedIndex].tmm_generic}</div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div>
                                <label className="title-common mb-1">
                                    Unit/Dose
                                </label>
                                <Row gutter={20} className="mb-3">
                                    <Col md={12}>
                                        <Input placeholder="e.g. 1" value={medicationData[selectedIndex].tmm_dosage ? medicationData[selectedIndex].tmm_dosage : ''} inputMode="numeric" onChange={onChangeDosageChild} className="inputheight38" />
                                    </Col>
                                    <Col md={12}>
                                        <Select
                                            className="autocomplete-custom w-100 popinput inputheight38"
                                            placeholder="Select"
                                            defaultValue={medicationData[selectedIndex].medicineUnit ? medicationData[selectedIndex].medicineUnit.findIndex(e => e.value == medicationData[selectedIndex].tmm_unit) != -1 ? medicationData[selectedIndex].tmm_unit : null : null}
                                            value={medicationData[selectedIndex].medicineUnit ? medicationData[selectedIndex].medicineUnit.findIndex(e => e.value == medicationData[selectedIndex].tmm_unit) != -1 ? medicationData[selectedIndex].tmm_unit : null : null}
                                            onSelect={(data) => onSelectMedicineUnitChild(data)}
                                            options={medicationData[selectedIndex].medicineUnit}
                                        />
                                    </Col>
                                </Row>
                                <label className="title-common mb-1">
                                    Timing
                                </label>
                                <Row gutter={20} className="mb-3">
                                    <Col md={12}>
                                        <Select
                                            className="autocomplete-custom w-100 popinput inputheight38"
                                            placeholder="Select"
                                            defaultValue={frequencyList ? frequencyList.findIndex(e => e.value == medicationData[selectedIndex].tmm_freq_type) != -1 ? medicationData[selectedIndex].tmm_freq_type : null : null}
                                            value={frequencyList ? frequencyList.findIndex(e => e.value == medicationData[selectedIndex].tmm_freq_type) != -1 ? medicationData[selectedIndex].tmm_freq_type : null : null}
                                            onSelect={(data) => onSelectMedicineFrequencyChild(data)}
                                            options={frequencyList}
                                        />
                                    </Col>
                                    <Col md={12}>
                                        <Select
                                            className="autocomplete-custom w-100 popinput inputheight38"
                                            placeholder="Select"
                                            defaultValue={timingList ? timingList.findIndex(e => e.value == medicationData[selectedIndex].tmm_time) != -1 ? parseInt(medicationData[selectedIndex].tmm_time) : null : null}
                                            value={timingList ? timingList.findIndex(e => e.value == medicationData[selectedIndex].tmm_time) != -1 ? parseInt(medicationData[selectedIndex].tmm_time) : null : null}
                                            onSelect={(data) => onSelectMedicineTimingChild(data)}
                                            options={timingList}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={20} className="mb-3">
                                    <Col xl={6} lg={12} className="mb-lg-2">
                                        <BSButtonGroup aria-label="Basic example" className="inputheight45 border rounded-0">
                                            {medicationData[selectedIndex].tcm_tmm_freq_morning != undefined && medicationData[selectedIndex].tcm_tmm_freq_morning != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={morningDecrement}>
                                                    <i className="icon-minus d-block text-main"></i>
                                                </BSButton>
                                            )}
                                            <BSButton variant="outline-light" className="rounded-0 dateoutline p-0 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={() => !medicationData[selectedIndex].tcm_tmm_freq_morning && morningClick()}>
                                                <Input placeholder="Morning" value={medicationData[selectedIndex].tcm_tmm_freq_morning ? medicationData[selectedIndex].tcm_tmm_freq_morning : ''} className="rounded-0 h-100 border-0 text-center text-main" onChange={onChangeInputMorningChild} />
                                            </BSButton>
                                            {medicationData[selectedIndex].tcm_tmm_freq_morning != undefined && medicationData[selectedIndex].tcm_tmm_freq_morning != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={morningIncrement}>
                                                    <i className="icon-Add text-main d-block"></i>
                                                </BSButton>
                                            )}
                                        </BSButtonGroup>
                                    </Col>
                                    <Col xl={6} lg={12} className="mb-lg-2">
                                        <BSButtonGroup aria-label="Basic example" className="inputheight45 border rounded-0">
                                            {medicationData[selectedIndex].tcm_tmm_freq_afternoon != undefined && medicationData[selectedIndex].tcm_tmm_freq_afternoon != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={afternoonDecrement}>
                                                    <i className="icon-minus d-block text-main"></i>
                                                </BSButton>
                                            )}
                                            <BSButton variant="outline-light" className="rounded-0 dateoutline p-0 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={() => !medicationData[selectedIndex].tcm_tmm_freq_afternoon && afternoonClick()}>
                                                <Input placeholder="Afternoon" value={medicationData[selectedIndex].tcm_tmm_freq_afternoon ? medicationData[selectedIndex].tcm_tmm_freq_afternoon : ''} className="rounded-0 h-100 border-0 text-center text-main" onChange={onChangeInputAfternoonChild} />
                                            </BSButton>
                                            {medicationData[selectedIndex].tcm_tmm_freq_afternoon != undefined && medicationData[selectedIndex].tcm_tmm_freq_afternoon != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={afternoonIncrement}>
                                                    <i className="icon-Add text-main d-block"></i>
                                                </BSButton>
                                            )}
                                        </BSButtonGroup>
                                    </Col>
                                    <Col xl={6} lg={12} className="mb-lg-2">
                                        <BSButtonGroup aria-label="Basic example" className="inputheight45 border rounded-0">
                                            {medicationData[selectedIndex].tcm_tmm_freq_evening != undefined && medicationData[selectedIndex].tcm_tmm_freq_evening != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={eveningDecrement}>
                                                    <i className="icon-minus d-block text-main"></i>
                                                </BSButton>
                                            )}
                                            <BSButton variant="outline-light" className="rounded-0 dateoutline p-0 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={() => !medicationData[selectedIndex].tcm_tmm_freq_evening && eveningClick()}>
                                                <Input placeholder="Evening" value={medicationData[selectedIndex].tcm_tmm_freq_evening ? medicationData[selectedIndex].tcm_tmm_freq_evening : ''} className="rounded-0 h-100 border-0 text-center text-main" onChange={onChangeInputEveningChild} />
                                            </BSButton>
                                            {medicationData[selectedIndex].tcm_tmm_freq_evening != undefined && medicationData[selectedIndex].tcm_tmm_freq_evening != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={eveningIncrement}>
                                                    <i className="icon-Add text-main d-block"></i>
                                                </BSButton>
                                            )}
                                        </BSButtonGroup>
                                    </Col>
                                    <Col xl={6} lg={12} className="mb-lg-2">
                                        <BSButtonGroup aria-label="Basic example" className="inputheight45 border rounded-0">
                                            {medicationData[selectedIndex].tcm_tmm_freq_night != undefined && medicationData[selectedIndex].tcm_tmm_freq_night != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={nightDecrement}>
                                                    <i className="icon-minus d-block text-main"></i>
                                                </BSButton>
                                            )}
                                            <BSButton variant="outline-light" className="rounded-0 dateoutline p-0 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={() => !medicationData[selectedIndex].tcm_tmm_freq_night && nightClick()}>
                                                <Input placeholder="Night" value={medicationData[selectedIndex].tcm_tmm_freq_night ? medicationData[selectedIndex].tcm_tmm_freq_night : ''} className="rounded-0 h-100 border-0 text-center text-main" onChange={onChangeInputNightChild} />
                                            </BSButton>
                                            {medicationData[selectedIndex].tcm_tmm_freq_night != undefined && medicationData[selectedIndex].tcm_tmm_freq_night != 0 && (
                                                <BSButton variant="outline-light" className="rounded-0 dateoutline px-2 bg-white" disabled={medicationData[selectedIndex].tmf_block} onClick={nightIncrement}>
                                                    <i className="icon-Add text-main d-block"></i>
                                                </BSButton>
                                            )}
                                        </BSButtonGroup>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <label className="title-common">
                                    Duration
                                </label>
                                <Segmented
                                    value={sinceValue > 5 ? -1 : sinceValue}
                                    className="search-segment"
                                    options={SINCE_LIST}
                                    onChange={onChangeSegmentedSinceChild}
                                />
                            </div>
                            <div className="mt-3 mb-3">
                                <Segmented
                                    value={medicationData[selectedIndex].tmm_duration_type != undefined && medicationData[selectedIndex].tmm_duration_type}
                                    className="search-segment"
                                    options={sinceOptions}
                                    onChange={onChangeSinceChild}
                                />
                            </div>
                            <label className="title-common mb-1">
                                Add Details
                            </label>
                            <Input.TextArea value={medicationData[selectedIndex].tmm_remarks ? medicationData[selectedIndex].tmm_remarks : ''} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                        </div>
                    </div>
                </>
            )
        );
    }, [selectedIndex, medicationData, sinceValue, inputSince, sinceOptions]);

    return (
        <>
            {contextHolder}
            <Card bordered={false} className="search-modalCard h-100">
                <TabSearchHeader
                    placeholder="Search Medicines by Name, Brand or generic"
                    searchQuery={searchChildQuery}
                    onSearchParent={onSearchParent}
                    onClose={onClose} />
                <div className="modalcard-body">
                    <Row gutter={0} className="h-100">
                        <Col md={14}>
                            <div className="bg-white h-100 p-14">
                                {medicationData.length > 0 && (
                                    <>
                                        <div className="title2">
                                            Added
                                        </div>
                                        <div className="d-flex flex-wrap mt-3">
                                            {TABLE_MEDICATION}
                                        </div>
                                    </>
                                )}
                                <div>
                                    <div className="title2">
                                        {searchChildQuery.length > 0 ? 'Searched' : 'Frequently Used'}
                                    </div>
                                    <div className="mt-3 d-flex flex-wrap">
                                        {searchChildQuery.length > 0 ? (
                                            childSearchOptions.length > 0 &&
                                            childSearchOptions.map((item, i) => {
                                                return (
                                                    // i === childSearchOptions.length - 1 ? (
                                                    //     <Button
                                                    //         key={i}
                                                    //         type="text"
                                                    //         className="btn btn-primary2 chips-custom mb-14 me-14 d-flex align-items-center chips-addCustom"
                                                    //         onClick={() => onSelectParent({ ...JSON.parse(item.key) })}>
                                                    //         {item.value} <i className="icon-Add mx-1 fs-6"></i> <a className="text-decoration-underline"> Add Custom</a>
                                                    //     </Button>
                                                    // ) : (
                                                    <Button
                                                        key={i}
                                                        type="text"
                                                        className="btn btn-primary2 chips-custom mb-14 me-14"
                                                        onClick={() => onSelectParent({ ...JSON.parse(item.key) })}>
                                                        {item.value}
                                                    </Button>
                                                    // )
                                                )
                                            })
                                        ) : (
                                            parentOptionsList.length > 0 &&
                                            parentOptionsList.map((item, i) => {
                                                return (
                                                    <Button key={i} type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={() => onSelectParent(item)}>{item.tmm_medicine_name}</Button>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={10}>
                            {CHILD_DRAWER_DATA}
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
}

export default React.memo(TabMedicationSearch);
