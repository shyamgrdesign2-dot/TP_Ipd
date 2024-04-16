import React from "react";
import { Button, Card, Row, Col, Checkbox } from 'antd';

import noRecordFound from '../assets/images/no-record-round.svg';
import verticleUpDown from '../assets/images/verticle-up-down.svg';
import ActiveverticleUpDown from '../assets/images/active-verticle-up-down.svg';
import InActiveverticleUpDown from '../assets/images/inactive-verticle-up-down.svg';

function HistoryBox(props) {
    const { handleDrawerHistory } = props

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };

    return (
        <>
            <Card bordered={false} className="search-modalCard">
                <div>
                    <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center me-3'>
                                <div onClick={handleDrawerHistory} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                            </div>
                            <div className="title-common">Medical History</div>
                        </div>
                        <Button className='btn btn-primary3 btn-41 px-4 me-20'>
                            Save
                        </Button>
                    </div>
                </div>
                <Row>
                    <Col lg={15}>
                        <div className="bg-white overflow-y-auto medical-history-section" style={{ height: 'calc(100vh - 194px)' }}>
                            <div className="border-bottom px-4 pt-3 pb-2">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="titleprint">Medical problem?</div>
                                        <Button className="btn border rounded-3 px-1 ms-3 collapseButton">
                                            <i className="icon-right d-block iconrotate270 fs-18"></i>
                                        </Button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Checkbox className="fontroboto" onChange={onChange}>No known history</Checkbox>
                                        <button className='btn d-flex ms-1 align-items-center btn-text pe-0'>
                                            <i className="icon-setting me-2"></i> <span>Add & Edit</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap">
                                    <div className="history-badge history-active">Diabetes <span>Y <img src={ActiveverticleUpDown} /></span></div>
                                    <div className="history-badge history-inactive">Hypertension <span>N <img src={InActiveverticleUpDown} /></span></div>
                                    <div className="history-badge">Hypothyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">CKD <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperthyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperlipidemia <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Obesity <span>- <img src={verticleUpDown} /></span></div>
                                </div>
                            </div>
                            <div className="border-bottom px-4 pt-3 pb-2">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="titleprint">Allergies</div>
                                        <Button className="btn border rounded-3 px-1 ms-3 collapseButton">
                                            <i className="icon-right d-block iconrotate270 fs-18"></i>
                                        </Button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Checkbox className="fontroboto" onChange={onChange}>No known history</Checkbox>
                                        <button className='btn d-flex ms-1 align-items-center btn-text pe-0'>
                                            <i className="icon-setting me-2"></i> <span>Add & Edit</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap">
                                    <div className="history-badge history-active">Diabetes <span>Y <img src={ActiveverticleUpDown} /></span></div>
                                    <div className="history-badge history-inactive">Hypertension <span>N <img src={InActiveverticleUpDown} /></span></div>
                                    <div className="history-badge">Hypothyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">CKD <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperthyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperlipidemia <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Obesity <span>- <img src={verticleUpDown} /></span></div>
                                </div>
                            </div>
                            <div className="border-bottom px-4 pt-3 pb-2">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="titleprint">Family history</div>
                                        <Button className="btn border rounded-3 px-1 ms-3 collapseButton">
                                            <i className="icon-right d-block iconrotate270 fs-18"></i>
                                        </Button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Checkbox className="fontroboto" onChange={onChange}>No known history</Checkbox>
                                        <button className='btn d-flex ms-1 align-items-center btn-text pe-0'>
                                            <i className="icon-setting me-2"></i> <span>Add & Edit</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap">
                                    <div className="history-badge history-active">Diabetes <span>Y <img src={ActiveverticleUpDown} /></span></div>
                                    <div className="history-badge history-inactive">Hypertension <span>N <img src={InActiveverticleUpDown} /></span></div>
                                    <div className="history-badge">Hypothyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">CKD <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperthyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperlipidemia <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Obesity <span>- <img src={verticleUpDown} /></span></div>
                                </div>
                            </div>
                            <div className="border-bottom px-4 pt-3 pb-2">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="titleprint">Lifestyle</div>
                                        <Button className="btn border rounded-3 px-1 ms-3 collapseButton">
                                            <i className="icon-right d-block iconrotate270 fs-18"></i>
                                        </Button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Checkbox className="fontroboto" onChange={onChange}>No known history</Checkbox>
                                        <button className='btn d-flex ms-1 align-items-center btn-text pe-0'>
                                            <i className="icon-setting me-2"></i> <span>Add & Edit</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap">
                                    <div className="history-badge history-active">Diabetes <span>Y <img src={ActiveverticleUpDown} /></span></div>
                                    <div className="history-badge history-inactive">Hypertension <span>N <img src={InActiveverticleUpDown} /></span></div>
                                    <div className="history-badge">Hypothyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">CKD <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperthyroidism <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Hyperlipidemia <span>- <img src={verticleUpDown} /></span></div>
                                    <div className="history-badge">Obesity <span>- <img src={verticleUpDown} /></span></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={9}>
                        <div className="bg-body h-100 text-center">
                            <img className="my-4" style={{ width: 194 }} src={noRecordFound} alt="No Result Found" />
                            <div className="fontroboto text-main title-common"> No Records Found! </div>
                            <div className="fontroboto text-main title fw-normal mt-2"> You haven’t added any medical history. </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}


export default React.memo(HistoryBox);
