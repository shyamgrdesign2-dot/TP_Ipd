import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import { Button, Card, Row, Col, Input, Tour } from 'antd';

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';
import {
    searchInvestigation
} from "../../redux/investigationSlice";
import { updateDragDrop } from "../../redux/doctorsSlice";

import TabSearchHeader from "./TabSearchHeader";
import dragChips from '../../../src/assets/images/drag-chips.gif'
import tagNew from '../../../src/assets/images/tag-new.svg'

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

function TabInvestigationSearch({ passIndex, onClose }) {

    const {
        parentOptionsList,
        childOptionsList,
    } = useSelector((state) => state.investigation);
    const { dragDrop } = useSelector((state) => state.doctors);
    const dispatch = useDispatch();

    const { investigationData, setInvestigationData } = useContext(CashManagerContext);

    const [searchChildQuery, setSearchChildQuery] = useState("");
    const [childSearchOptions, setChildSearchOptions] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(passIndex);

    //Parent AutoComplete
    useEffect(() => {
        if (searchChildQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(
                    searchInvestigation({ searchQuery: searchChildQuery, type: "child" })
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
                value: e.investigation_name
            });
        });
        if (searchChildQuery.length > 0) {
            searchChildQuery && childOptionsList.findIndex(e => e.investigation_name?.toLowerCase()?.trim() == searchChildQuery?.toLowerCase()?.trim()) === -1 &&
                data.push({
                    key: JSON.stringify({
                        unique_id: uuidv4(),
                        change: 1,
                        investigation_name: searchChildQuery
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
            window.Moengage.track_event("investigation_select", {
                "value": e.investigation_name
            });
            investigationData.push({
                ...e,
                note: "",
            });
            setInvestigationData((prev) => [...prev]);
            setSelectedIndex(investigationData.length - 1);
            setSearchChildQuery("")
        },
        [investigationData, selectedIndex]
    );

    const onRemoveRow = (index) => {
        investigationData.splice(index, 1);
        setInvestigationData((prev) => [...prev]);
        setSelectedIndex(null)
    };

    // Tour Drag & Drop
    const [tourOpen, setTourOpen] = useState(false);
    const tourRef = useRef(null);

    useEffect(() => {
        // dispatch(updateDragDrop(''));
        setTimeout(() => {
            if (investigationData?.length > 1 && !dragDrop?.lab_investigation) {
                setTourOpen(true)

            }
        }, 400);
    }, [investigationData]);

    const onTourHandle = () => {
        setTourOpen(!tourOpen)
        dispatch(updateDragDrop('lab_investigation'));
    }

    const steps = [
        {
            description:
                <>
                    <div className="fw-medium fs-18 pt-3">Reorder chips <img className="img-fluid ms-2" src={tagNew} /></div>
                    <div className="pt-1">Hold and drag the chips to reorder them.</div>
                    <img className="img-fluid my-2 rounded-2" style={{backgroundColor: '#E2E2EA80'}} width={329} height={107} src={dragChips} />
                </>
            ,
            target: () => tourRef.current,
            nextButtonProps: {
                children: 'Okay',
                onClick: onTourHandle
            }
        }
    ];

    //Child Componet
    // const TABLE_INVESTIGATION = useMemo(() => {
    //     return (
    //         investigationData.length > 0 &&
    //         investigationData.map((item, index) => {
    //             return (
    //                 <div key={index} style={{ width: item.investigation_name.length > 12 && item.investigation_name.length < 24 ? `${item.investigation_name.length * 10.5}px` : item.investigation_name.length >= 24 ? '256px' : '150px' }} className={`${selectedIndex == index && "closable-chips-active"} d-flex align-items-center justify-content-between text-truncate closable-chips`}>
    //                     <div className="text-truncate p-2" onClick={() => {
    //                         setSelectedIndex(index)
    //                     }}>
    //                         <div className="text-truncate">{item.investigation_name}
    //                             {item.note ? (
    //                                 <div className="text-truncate small">{item.note}</div>
    //                             ) : (
    //                                 <div className="text-truncate small">Add Details</div>
    //                             )}
    //                         </div>
    //                     </div>
    //                     <Button type="text" className="rounded-0 btn-close-chips" onClick={() => onRemoveRow(index)}>
    //                         <i className="icon-Cross"></i>
    //                     </Button>
    //                 </div>
    //             );
    //         })
    //     );
    // }, [investigationData, selectedIndex]);

    // Drag & Drop
    const SortableItem = SortableElement(({ item }) => (
        <div
            style={{
                width: item.investigation_name.length > 12 && item.investigation_name.length < 24
                    ? `${item.investigation_name.length * 10.5}px`
                    : item.investigation_name.length >= 24
                        ? '256px'
                        : '150px',
                zIndex: 9999,
            }}
            className={`${selectedIndex == item.index && "closable-chips-active"} d-flex align-items-center justify-content-between text-truncate closable-chips`}
        >
            <div className="text-truncate p-2" onClick={() => {
                setSelectedIndex(item.index)
            }}>
                <div className="text-truncate">{item.investigation_name}
                    {item.note ? (
                        <div className="text-truncate small">{item.note}</div>
                    ) : (
                        <div className="text-truncate small">Add Details</div>
                    )}
                </div>
            </div>
            <Button type="text" className="rounded-0 btn-close-chips" onClick={() => onRemoveRow(item.index)}>
                <i className="icon-Cross"></i>
            </Button>
        </div>
    ));

    const SortableList = SortableContainer(({ items }) => {
        return (
            <div className="d-flex flex-wrap">
                {items.map((item, index) => (
                    <SortableItem
                        key={`item-${index}`}
                        index={index}
                        item={{ ...item, index }}
                    />
                ))}
            </div>
        );
    });

    const TABLE_INVESTIGATION = useMemo(() => {
        return (
            investigationData.length > 0 && (
                <SortableList
                    items={investigationData}
                    onSortEnd={({ oldIndex, newIndex }) => {
                        const newInvestigationData = [...investigationData];
                        const [movedItem] = newInvestigationData.splice(oldIndex, 1);
                        newInvestigationData.splice(newIndex, 0, movedItem);
                        setInvestigationData(newInvestigationData);
                    }}
                    axis="xy"
                    pressDelay={100}
                />
            )
        );
    }, [investigationData, selectedIndex]);

    const onChangeInputNoteChild = useCallback(
        (e) => {
            investigationData[selectedIndex].note = e.target.value;
            setInvestigationData((prev) => [...prev]);
        },
        [selectedIndex, investigationData]
    );

    //Child Componet
    const CHILD_DRAWER_DATA = useMemo(() => {
        return (
            selectedIndex != null && investigationData[selectedIndex] !== undefined && (
                <>
                    <div className="h-100">
                        <div className="selectedchip-header d-flex flex-column justify-content-center title px-20">
                            <span className="text-truncate-twolines">{selectedIndex != null && investigationData[selectedIndex].investigation_name}</span>
                        </div>
                        <div className="p-4">
                            <Input.TextArea value={selectedIndex != null && investigationData[selectedIndex].note} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
                        </div>
                    </div>

                </>
            )
        );
    }, [selectedIndex, investigationData]);

    return (
        <>
            <Card bordered={false} className="search-modalCard h-100">
                <TabSearchHeader
                    placeholder="Search Lab Investigation"
                    searchQuery={searchChildQuery}
                    onSearchParent={onSearchParent}
                    disabled={investigationData.length > 0 ? false : true}
                    onClose={onClose} />
                <div className="modalcard-body">
                    <Row gutter={0} className="h-100">
                        <Col md={14}>
                            <div className="bg-white h-100 p-14">
                                {investigationData.length > 0 && !searchChildQuery && (
                                    <>
                                        <div className="title2">
                                            Added
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            <span ref={tourRef} className='pt-3'>
                                                {TABLE_INVESTIGATION}
                                            </span>
                                            {/* <Tour placement="rightTop" closeIcon={false} open={tourOpen} steps={steps} onClose={onTourHandle} /> */}
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
                                            childSearchOptions.filter(e => ![...investigationData.map(e1 => e1.investigation_name)].includes(e.value)).map((item, i) => {
                                                return (
                                                    // i === childSearchOptions.length - 1 ? (
                                                    JSON.parse(item.key).change === 1 ? (
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
                                            parentOptionsList.filter(e => ![...investigationData.map(e1 => e1.investigation_name)].includes(e.investigation_name)).map((item, i) => {
                                                return (
                                                    <Button key={i} type="text" style={{ width: item.investigation_name.length > 26 && '250px' }} className={`${item.investigation_name.length > 26 && 'chips-custom-break'} btn btn-primary2 chips-custom mb-14 me-14`} onClick={() => onSelectParent({ ...item, unique_id: uuidv4() })}>{item.investigation_name}</Button>
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

export default React.memo(TabInvestigationSearch);
