import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Button, Card, Row, Col, Segmented, Input } from 'antd';

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { onlyNumberFormat, hasNumber, capitalizeAfterSentence } from "../../utils/utils";

import CashManagerContext from '../../context/CashManagerContext';
import {
    searchSymptoms
} from "../../redux/symptomsSlice";

import TabSearchHeader from "./TabSearchHeader";

function TabSymptomsSearch({ passIndex, onClose }) {

    const {
        parentOptionsList,
        childOptionsList,
    } = useSelector((state) => state.symptoms);
    const dispatch = useDispatch();

    const { symptomsData, setSymptomsData } = useContext(CashManagerContext);

    const [searchChildQuery, setSearchChildQuery] = useState("");
    const [childSearchOptions, setChildSearchOptions] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(passIndex);
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


    //Parent AutoComplete
    useEffect(() => {
        if (searchChildQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(
                    searchSymptoms({ searchQuery: searchChildQuery, type: "child" })
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
                value: e.symptom_name
            });
        });
        if (searchChildQuery.length > 0) {
            searchChildQuery &&
                data.push({
                    key: JSON.stringify({
                        unique_id: uuidv4(),
                        change: 1,
                        symptom_name: searchChildQuery
                    }),
                    value: searchChildQuery
                });
        }
        setChildSearchOptions(data);
    }, [childOptionsList]);

    const onSearchParent = useCallback(
        (query) => {
            setSearchChildQuery(query);
        },
        [searchChildQuery]
    );

    const onSelectParent = useCallback(
        (e) => {
            window.Moengage.track_event("symptom_select", {
                "value": e.symptom_name
            });
            symptomsData.push({
                ...e,
                since: "",
                severity: "",
                note: "",
            });
            setSymptomsData((prev) => [...prev]);
            setSelectedIndex(symptomsData.length - 1);
            setSinceValue(1)
            setSearchChildQuery("")
        },
        [symptomsData, selectedIndex, sinceValue]
    );

    const onRemoveRow = (index) => {
        symptomsData.splice(index, 1);
        setSymptomsData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    //Child Componet
    const TABLE_SYMPTOMS = useMemo(() => {
        return (
            symptomsData.length > 0 &&
            symptomsData.map((item, index) => {
                return (
                    <div key={index} style={{ width: item.symptom_name.length > 12 && item.symptom_name.length < 24 ? `${item.symptom_name.length * 10.5}px` : item.symptom_name.length >= 24 ? '256px' : '150px' }} className={`${selectedIndex == index && "closable-chips-active"} d-flex align-items-center justify-content-between text-truncate closable-chips`}>
                        <div className="text-truncate p-2" onClick={() => {
                            setSelectedIndex(index)
                            setSinceValue(item.since ? parseInt(item.since.split(" ")[0]) : 1)
                        }}>
                            <div className="text-truncate">{item.symptom_name}
                                {(item.since || item.severity || item.note) ? (
                                    <div className="text-truncate small">{`${item.since ? item.since + ' | ' : ''}${item.severity ? item.severity + ' | ' : ''}${item.note ? item.note : ''}`}</div>
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
    }, [symptomsData, selectedIndex]);


    useEffect(() => {
        if (sinceValue !== -1) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${sinceValue} ${option.value}`,
                    label: <>{`${sinceValue}${option.label}`}</>,
                };
            });
            setSinceOptions(options);
        } else if (inputSince.length > 0) {
            const options = SINCE_OPTIONS.map((option) => {
                return {
                    key: Math.random(),
                    value: `${inputSince} ${option.value}`,
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
            symptomsData[selectedIndex].since = '';
            setSymptomsData((prev) => [...prev]);
            if (updateQuery.length > 0) {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${updateQuery} ${option.value}`,
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
        [inputSince, sinceOptions, symptomsData]
    );

    const SINCE_LIST = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: -1, label: <Input className="w-100 custom-segment-input inputheight45 border-0" placeholder="Custom" value={inputSince} inputMode="numeric" onChange={onChangeInputSinceChild} onClick={() => onChangeSegmentedSinceChild(-1)} /> }
    ];

    const SEVERITY_LIST = [
        { value: "Severe", label: "Severe" },
        { value: "Moderate", label: "Moderate" },
        { value: "Mild", label: "Mild" },
    ];

    const onChangeSegmentedSinceChild = useCallback(
        (key) => {
            setSinceValue(key)
            symptomsData[selectedIndex].since = '';
            setSymptomsData((prev) => [...prev]);
        },
        [sinceValue, selectedIndex, symptomsData]
    );

    const onChangeSinceChild = useCallback(
        (key) => {
            if (hasNumber(key)) {
                if (key != symptomsData[selectedIndex].since) {
                    symptomsData[selectedIndex].since = key;
                } else {
                    symptomsData[selectedIndex].since = '';
                }
                setSymptomsData((prev) => [...prev]);
            }
        },
        [selectedIndex, symptomsData]
    );

    const onChangeSeverityChild = useCallback(
        (key) => {
            if (key != symptomsData[selectedIndex].severity) {
                symptomsData[selectedIndex].severity = key;
            } else {
                symptomsData[selectedIndex].severity = '';
            }
            setSymptomsData((prev) => [...prev]);
        },
        [selectedIndex, symptomsData]
    );
    const onChangeInputNoteChild = useCallback(
        (e) => {
            symptomsData[selectedIndex].note = capitalizeAfterSentence(e.target.value);
            setSymptomsData((prev) => [...prev]);
        },
        [selectedIndex, symptomsData]
    );

    //Child Componet
    const CHILD_DRAWER_DATA = useMemo(() => {
        return (
            selectedIndex != null && symptomsData[selectedIndex] !== undefined && (
                <>
                    <div className="h-100">
                        <div className="selectedchip-header d-flex flex-column justify-content-center title px-20">
                            <span className="text-truncate-twolines">{selectedIndex != null && symptomsData[selectedIndex].symptom_name}</span>
                        </div>
                        <div className="p-4">
                            <div>
                                <label className="title-common">
                                    Since
                                </label>
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
                                {/* <Segmented
                                    value={sinceValue > 5 ? -1 : sinceValue}
                                    className="search-segment"
                                    options={SINCE_LIST}
                                    onChange={onChangeSegmentedSinceChild}
                                /> */}
                            </div>
                            <div className="mt-3">
                                <div className="segement-static d-flex">
                                    {sinceOptions.map((item, i) => {
                                        return (
                                            <button key={i}
                                                type="button"
                                                className={`btn w-100 ${selectedIndex != null && symptomsData[selectedIndex].since == item.value && 'btn-segement'}`}
                                                onClick={() => onChangeSinceChild(item.value)}>
                                                {item.label}
                                            </button>
                                        )
                                    })}
                                </div>
                                {/* <Segmented
                                    value={selectedIndex != null && symptomsData[selectedIndex].since}
                                    className="search-segment"
                                    options={sinceOptions}
                                    onChange={onChangeSinceChild}
                                /> */}
                            </div>
                            <div className="mt-5">
                                <label className="title-common">
                                    Severity
                                </label>
                                <div className="segement-static d-flex">
                                    {SEVERITY_LIST.map((item, i) => {
                                        return (
                                            <button key={i}
                                                type="button"
                                                className={`btn w-100 ${selectedIndex != null && symptomsData[selectedIndex].severity == item.value && 'btn-segement'}`}
                                                onClick={() => onChangeSeverityChild(item.value)}>
                                                {item.label}
                                            </button>
                                        )
                                    })}
                                </div>
                                {/* <Segmented
                                    value={selectedIndex != null && symptomsData[selectedIndex].severity}
                                    className="search-segment"
                                    options={SEVERITY_LIST}
                                    onChange={onChangeSeverityChild}
                                /> */}
                            </div>
                            <div className="mt-5">
                                <label className="title-common">
                                    Add Details
                                </label>
                                <Input.TextArea value={selectedIndex != null && symptomsData[selectedIndex].note} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                            </div>
                        </div>
                    </div>

                </>
            )
        );
    }, [selectedIndex, symptomsData, sinceValue, inputSince, sinceOptions]);

    return (
        <>
            <Card bordered={false} className="search-modalCard h-100">
                <TabSearchHeader
                    placeholder="Search Symptoms / Chief Complaints"
                    searchQuery={searchChildQuery}
                    onSearchParent={onSearchParent}
                    disabled={symptomsData.length > 0 ? false : true}
                    onClose={onClose} />
                <div className="modalcard-body">
                    <Row gutter={0} className="h-100">
                        <Col md={14}>
                            <div className="bg-white h-100 p-14">
                                {symptomsData.length > 0 && !searchChildQuery && (
                                    <>
                                        <div className="title2">
                                            Added
                                        </div>
                                        <div className="d-flex flex-wrap mt-3">
                                            {TABLE_SYMPTOMS}
                                        </div>
                                    </>
                                )}
                                <div>
                                    <div className="title2">
                                        {searchChildQuery.length > 0 ? 'Search Results' : 'Frequently Used'}
                                    </div>
                                    <div className="mt-3">
                                        {searchChildQuery.length > 0 ? (
                                            childSearchOptions.length > 0 &&
                                            childSearchOptions.filter(e => ![...symptomsData.map(e1 => e1.symptom_name)].includes(e.value)).map((item, i) => {
                                                return (
                                                    i === childSearchOptions.length - 1 ? (
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
                                            parentOptionsList.length > 0 &&
                                            parentOptionsList.filter(e => ![...symptomsData.map(e1 => e1.symptom_name)].includes(e.symptom_name)).map((item, i) => {
                                                return (
                                                    <Button key={i} type="text" style={{ width: item.symptom_name.length > 26 && '250px' }} className={`${item.symptom_name.length > 26 && 'chips-custom-break'} btn btn-primary2 chips-custom mb-14 me-14`} onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.symptom_name}</Button>
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

export default React.memo(TabSymptomsSearch);
