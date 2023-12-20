import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import { Button, Card, Row, Col, Segmented, Input } from 'antd';

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';
import {
    searchDiagnosis
} from "../../redux/diagnosisSlice";

import TabSearchHeader from "./TabSearchHeader";

function TabDiagnosisSearch({ passIndex, onClose }) {

    const {
        parentOptionsList,
        childOptionsList,
    } = useSelector((state) => state.diagnosis);
    const dispatch = useDispatch();

    const { diagnosisData, setDiagnosisData } = useContext(CashManagerContext);

    const [searchChildQuery, setSearchChildQuery] = useState("");
    const [childSearchOptions, setChildSearchOptions] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(passIndex);
    const SINCE_OPTIONS = ["H", "D", "W", "M", "Y"];
    const [sinceValue, setSinceValue] = useState(1);
    const [inputSince, setInputSince] = useState('');
    const [sinceOptions, setSinceOptions] = useState([]);


    //Parent AutoComplete
    useEffect(() => {
        if (searchChildQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(
                    searchDiagnosis({ searchQuery: searchChildQuery, type: "child" })
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
                value: e.tds_name
            });
        });
        if (searchChildQuery.length > 0) {
            searchChildQuery &&
                data.push({
                    key: JSON.stringify({
                        unique_id: uuidv4(),
                        tds_id: 0,
                        tds_name: searchChildQuery,
                        pms_default: 0
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
            diagnosisData.push({
                ...e,
                since: "",
                severity: "",
                note: "",
            });
            setDiagnosisData((prev) => [...prev]);
            setSelectedIndex(diagnosisData.length - 1);
            setSinceValue(1)
        },
        [diagnosisData, selectedIndex, sinceValue]
    );

    const onRemoveRow = (index) => {
        diagnosisData.splice(index, 1);
        setDiagnosisData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    //Child Componet
    const TABLE_DIAGNOSIS = useMemo(() => {
        return (
            diagnosisData.length > 0 &&
            diagnosisData.map((item, index) => {
                return (
                    <div key={index} style={{ width: item.tds_name.length > 12 && item.tds_name.length < 24 ? `${item.tds_name.length * 10.5}px` : item.tds_name.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                        <div className="text-truncate p-2" onClick={() => {
                            setSelectedIndex(index)
                            setSinceValue(item.since ? parseInt(item.since.split(" ")[0]) : 1)
                        }}>
                            <div className="text-truncate">{item.tds_name}
                                {(item.since || item.severity || item.note) ? (
                                    <div className="text-truncate small">{`${item.since ? item.since + ' | ' : ''}${item.severity ? item.severity + ' | ' : ''}${item.note ? item.note : ''}`}</div>
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
            diagnosisData[selectedIndex].since = '';
            setDiagnosisData((prev) => [...prev]);
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
        [inputSince, sinceOptions, diagnosisData]
    );

    const SINCE_LIST = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: -1, label: <Input className="w-100 segment-input" placeholder="Custom" onChange={onChangeInputSinceChild} onClick={() => onChangeSegmentedSinceChild(-1)} /> }
    ];

    const SEVERITY_LIST = [
        { value: "severe", label: "Severe" },
        { value: "moderate", label: "Moderate" },
        { value: "mild", label: "Mild" },
    ];

    const onChangeSegmentedSinceChild = useCallback(
        (key) => {
            setSinceValue(key)
            diagnosisData[selectedIndex].since = '';
            setDiagnosisData((prev) => [...prev]);
        },
        [sinceValue, selectedIndex, diagnosisData]
    );

    const onChangeSinceChild = useCallback(
        (key) => {
            diagnosisData[selectedIndex].since = key;
            setDiagnosisData((prev) => [...prev]);
        },
        [selectedIndex, diagnosisData]
    );

    const onChangeSeverityChild = useCallback(
        (key) => {
            diagnosisData[selectedIndex].severity = key;
            setDiagnosisData((prev) => [...prev]);
        },
        [selectedIndex, diagnosisData]
    );
    const onChangeInputNoteChild = useCallback(
        (e) => {
            diagnosisData[selectedIndex].note = e.target.value;
            setDiagnosisData((prev) => [...prev]);
        },
        [selectedIndex, diagnosisData]
    );

    //Child Componet
    const CHILD_DRAWER_DATA = useMemo(() => {
        return (
            selectedIndex != null && (
                <>
                    <div className="h-100">
                        <div className="selectedchip-header d-flex flex-column justify-content-center title px-20">
                            <span className="text-truncate-twolines">{selectedIndex != null && diagnosisData[selectedIndex].tds_name}</span>
                        </div>
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
                                    value={selectedIndex != null && diagnosisData[selectedIndex].since}
                                    className="search-segment"
                                    options={sinceOptions}
                                    onChange={onChangeSinceChild}
                                />
                            </div>
                            <div className="mt-5">
                                <label className="title-common">
                                    Severity
                                </label>
                                <Segmented
                                    value={selectedIndex != null && diagnosisData[selectedIndex].severity}
                                    className="search-segment"
                                    options={SEVERITY_LIST}
                                    onChange={onChangeSeverityChild}
                                />
                            </div>
                            <div className="mt-5">
                                <label className="title-common">
                                    Add Details
                                </label>
                                <Input.TextArea value={selectedIndex != null && diagnosisData[selectedIndex].note} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                            </div>
                        </div>
                    </div>

                </>
            )
        );
    }, [selectedIndex, diagnosisData, sinceValue, inputSince, sinceOptions]);

    return (
        <>
            <Card bordered={false} className="search-modalCard h-100">
                <TabSearchHeader
                    searchQuery={searchChildQuery}
                    onSearchParent={onSearchParent}
                    onClose={onClose} />
                <div className="modalcard-body">
                    <Row gutter={0} className="h-100">
                        <Col md={14}>
                            <div className="bg-white h-100 p-14">
                                {diagnosisData.length > 0 && (
                                    <>
                                        <div className="title2">
                                            Added
                                        </div>
                                        <div className="d-flex flex-wrap mt-3">
                                            {TABLE_DIAGNOSIS}
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
                                                    <Button key={i} type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={() => onSelectParent({ ...JSON.parse(item.key) })}>{item.value}</Button>
                                                )
                                            })
                                        ) : (
                                            parentOptionsList.length > 0 &&
                                            parentOptionsList.map((item, i) => {
                                                return (
                                                    <Button key={i} type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.tds_name}</Button>
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

export default React.memo(TabDiagnosisSearch);
