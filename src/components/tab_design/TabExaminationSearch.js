import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Button, Card, Row, Col, Input } from 'antd';

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';
import {
    searchExamination
} from "../../redux/examinationSlice";

import TabSearchHeader from "./TabSearchHeader";

function TabExaminationSearch({ passIndex, onClose }) {

    const {
        parentOptionsList,
        childOptionsList,
    } = useSelector((state) => state.examination);
    const dispatch = useDispatch();

    const { examinationData, setExaminationData } = useContext(CashManagerContext);

    const [searchChildQuery, setSearchChildQuery] = useState("");
    const [childSearchOptions, setChildSearchOptions] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(passIndex);

    //Parent AutoComplete
    useEffect(() => {
        if (searchChildQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(
                    searchExamination({ searchQuery: searchChildQuery, type: "child" })
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
                value: e.examination_name
            });
        });
        if (searchChildQuery.length > 0) {
            searchChildQuery &&
                data.push({
                    key: JSON.stringify({
                        unique_id: uuidv4(),
                        change: 1,
                        examination_name: searchChildQuery
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
            examinationData.push({
                ...e,
                note: "",
            });
            setExaminationData((prev) => [...prev]);
            setSelectedIndex(examinationData.length - 1);
            setSearchChildQuery("")
        },
        [examinationData, selectedIndex]
    );

    const onRemoveRow = (index) => {
        examinationData.splice(index, 1);
        setExaminationData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    //Child Componet
    const TABLE_EXAMINATION = useMemo(() => {
        return (
            examinationData.length > 0 &&
            examinationData.map((item, index) => {
                return (
                    <div key={index} style={{ width: item.examination_name.length > 12 && item.examination_name.length < 24 ? `${item.examination_name.length * 10.5}px` : item.examination_name.length >= 24 ? '256px' : '150px' }} className={`${selectedIndex === index && "closable-chips-active"} d-flex align-items-center justify-content-between text-truncate closable-chips`}>
                        <div className="text-truncate p-2" onClick={() => {
                            setSelectedIndex(index)
                        }}>
                            <div className="text-truncate">{item.examination_name}
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
    }, [examinationData, selectedIndex]);

    const onChangeInputNoteChild = useCallback(
        (e) => {
            examinationData[selectedIndex].note = e.target.value;
            setExaminationData((prev) => [...prev]);
        },
        [selectedIndex, examinationData]
    );

    //Child Componet
    const CHILD_DRAWER_DATA = useMemo(() => {
        return (
            selectedIndex !== null && (
                <>
                    <div className="h-100">
                        <div className="selectedchip-header d-flex flex-column justify-content-center title px-20">
                            <span className="text-truncate-twolines">{selectedIndex !== null && examinationData[selectedIndex].examination_name}</span>
                        </div>
                        <div className="p-4">
                            <label className="title-common">
                                Add Details
                            </label>
                            <Input.TextArea value={selectedIndex !== null && examinationData[selectedIndex].note} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                        </div>
                    </div>

                </>
            )
        );
    }, [selectedIndex, examinationData]);

    return (
        <>
            <Card bordered={false} className="search-modalCard h-100">
                <TabSearchHeader
                    placeholder="Search Examinations"
                    searchQuery={searchChildQuery}
                    onSearchParent={onSearchParent}
                    disabled={examinationData.length > 0 ? false : true}
                    onClose={onClose} />
                <div className="modalcard-body">
                    <Row gutter={0} className="h-100">
                        <Col md={14}>
                            <div className="bg-white h-100 p-14">
                                {examinationData.length > 0 && !searchChildQuery && (
                                    <>
                                        <div className="title2">
                                            Added
                                        </div>
                                        <div className="d-flex flex-wrap mt-3">
                                            {TABLE_EXAMINATION}
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
                                            childSearchOptions.filter(e => ![...examinationData.map(e1 => e1.examination_name)].includes(e.value)).map((item, i) => {
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
                                            parentOptionsList.filter(e => ![...examinationData.map(e1 => e1.examination_name)].includes(e.examination_name)).map((item, i) => {
                                                return (
                                                    <Button key={i} type="text" style={{ width: item.examination_name.length > 26 && '250px' }} className={`${item.examination_name.length > 26 && 'chips-custom-break'} btn btn-primary2 chips-custom mb-14 me-14`} onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.examination_name}</Button>
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

export default React.memo(TabExaminationSearch);
