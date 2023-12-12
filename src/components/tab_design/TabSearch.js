import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Row, Col} from 'antd';
import TabSearchDetails from "./TabSearchDetails";
import TabSelectedAdvise from "./TabSelectedAdvise";
import TabSearchHeader from "./TabSearchHeader";

function TabSearch() {
    const buttonRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState(0);
    const character = 'Frequent Urination Muscle'

    // Chips buttons
    useEffect(() => {
        setButtonWidth(buttonRef.current.offsetWidth);
    }, [buttonRef]);

    return (
        <>
            <Card bordered={false} className="search-modalCard h-100">
                <TabSearchHeader />
                <div className="modalcard-body">
                    <Row gutter={0} className="h-100">
                        <Col md={14}>
                            <div className="bg-white h-100 p-14">
                                <div className="title2">
                                    Added
                                </div>
                                <div className="d-flex flex-wrap mt-3">
                                    <div style={{ width: character.length > 12 && character.length < 24 ? `${character.length * 10.5}px` : character.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                                        <div className="text-truncate p-2">
                                            <div className="text-truncate">{character}
                                                <div className="text-truncate small">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                                            </div>
                                        </div>
                                        <Button type="text" className="border-start rounded-0 btn-close-chips">
                                            <i className="icon-Cross"></i>
                                        </Button>
                                    </div>
                                </div>
                                {/* For Advise box */}
                                <div className="title2">
                                    Selected Advices
                                </div>
                                <div className="mt-3">
                                    <TabSelectedAdvise />
                                </div>
                                <div className="d-flex flex-wrap mt-3">
                                    <div className="title2">
                                        Frequently Used
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
                                <TabSearchDetails />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
}

export default TabSearch;
