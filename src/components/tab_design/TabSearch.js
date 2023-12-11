import React, { useState, useEffect, useRef } from "react";
import { AutoComplete, Input, Button, Card, Row, Col, Segmented } from 'antd';

function TabSearch() {
    const buttonRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState(0);
    const character = 'Frequent Urination Muscle'

    // Chips buttons
    useEffect(() => {
        setButtonWidth(buttonRef.current.offsetWidth);
    }, [buttonRef]);

    // Segnment
    const segmentedList = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label:  <Input className="w-100 segment-input" placeholder="Custom" /> },
    ];
    const segmentedSeverityList = [
        { value: 'severe', label: 'Severe' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'mild', label: 'Mild' },
    ];
    const segmentedTimeList = [
        { value: 'hour', label: '1H' },
        { value: 'day', label: '1D' },
        { value: 'Week', label: '1W' },
        { value: 'month', label: '1M' },
        { value: 'year', label: '1Y' },
    ];

    return (
        <>
            <Card bordered={false} className="search-modalCard h-100">
                <div className='modalCard-header align-items-center d-flex'>
                    <div className='border-end h-100 text-center'>
                        <Button className='btn btn-delete-prescription px-3 h-100'>
                            <i className='icon-right'></i>
                        </Button>
                    </div>
                    <AutoComplete
                        className="autocomplete-custom w-100 px-20"
                        popupClassName="autocompletepopup"
                    >
                        <Input
                            placeholder="Search Symptoms / Chief Complaints"
                            prefix={<i className="icon-search"></i>}
                            suffix={<i className="icon-Cross"></i>}
                        />
                    </AutoComplete>
                    <Button disabled className='btn btn-primary3 me-30 btn-41 px-4'>
                        Done
                    </Button>
                </div>
                <div className="modalcard-body">
                    <Row gutter={0} className="h-100">
                        <Col md={14}>
                            <div className="bg-white h-100">
                                <div className="d-flex flex-wrap p-14-pb0">
                                    <div className="title2">
                                        Frequently Used
                                        {/* Search Results */}
                                    </div>
                                    <div className="mt-3">
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Discomfort</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">High Blood Pressure</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Vomiting</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Diarrhea</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Joint Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Muscle Aches</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Sore Throat</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Loss of Appetite</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Discomfort</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">High Blood Pressure</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Vomiting</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Diarrhea</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Joint Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Muscle Aches</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Sore Throat</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Loss of Appetite</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Discomfort</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">High Blood Pressure</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Vomiting</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Diarrhea</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Joint Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Muscle Aches</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Sore Throat</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Loss of Appetite</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Discomfort</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">High Blood Pressure</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Vomiting</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Diarrhea</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Joint Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Muscle Aches</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Sore Throat</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Loss of Appetite</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Discomfort</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">High Blood Pressure</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Vomiting</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Diarrhea</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Joint Pain</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Muscle Aches</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Sore Throat</Button>
                                        <Button type="text" className="btn btn-primary2 chips-custom chips-addCustom mb-14 me-14">"C" +<a className="text-decoration-underline ms-2">Add Custom</a></Button>
                                        {/* <Button type="text" className="btn btn-primary2 chips-custom chips-custom-break mb-14 me-14">Frequent Urination Muscle Achesa Urination Diarrhea</Button> */}
                                        {buttonWidth > 150 ? (
                                            <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom chips-custom-break mb-14 me-14`}>{character}</Button>
                                        ) : (
                                            <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom mb-14 me-14`}>{character}</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={10}>
                            <div className="h-100">
                                <div className="selectedchip-header title align-items-center d-flex px-20">
                                    Chest Pain
                                </div>
                                <div className="p-4">
                                    <div>
                                        <label className="title-common">
                                            Since
                                        </label>
                                        <Segmented
                                            className="search-segment"
                                            options={segmentedList}
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <Segmented
                                            className="search-segment"
                                            options={segmentedTimeList}
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <label className="title-common">
                                            Severity
                                        </label>
                                        <Segmented
                                            className="search-segment"
                                            options={segmentedSeverityList}
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <label className="title-common">
                                            Add Details
                                        </label>
                                        <Input.TextArea placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
}

export default TabSearch;
