import React from "react";
import { Button, Card, Row, Col, Checkbox, Input, Select } from 'antd';

import noRecordFound from '../assets/images/no-record-round.svg';
import verticleUpDown from '../assets/images/verticle-up-down.svg';
import ActiveverticleUpDown from '../assets/images/active-verticle-up-down.svg';
import InActiveverticleUpDown from '../assets/images/inactive-verticle-up-down.svg';

import NoHypertension from '../assets/images/no-hypertension.png';

function MedicalHistoryBox(props) {
    const { handleDrawerMedicalHistory } = props

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };

    // Select
    const onChangeSelect = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
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
                        <div className="bg-body overflow-y-auto" style={{ height: 'calc(100vh - 194px)' }}>
                            {/* No Records Found! Image */}
                            {/* <div className="text-center">
                                <img className="my-4" style={{ width: 194 }} src={noRecordFound} alt="No Result Found" />
                                <div className="fontroboto text-main title-common"> No Records Found! </div>
                                <div className="fontroboto text-main title fw-normal mt-2"> You haven’t added any medical history. </div>
                            </div> */}

                            {/* Right section details */}
                            <div>
                                <div className="selectedchip-header1 d-flex flex-column justify-content-center title px-20">
                                    <span className="text-truncate">Diabetes</span>
                                </div>

                                <div className="p-3">

                                    {/* Medical Problem */}
                                    <div className="mt-2">
                                        <label className="title-common mb-1"> Since</label>
                                        <div className="segement-static d-flex">
                                            <button type="button" className='btn w-100'>1</button>
                                            <button type="button" className='btn w-100'>2</button>
                                            <button type="button" className='btn w-100'>3</button>
                                            <button type="button" className='btn w-100'>4</button>
                                            <button type="button" className='btn w-100'>5</button>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <label className="title-common mb-1"> Status</label>
                                        <div className="segement-static d-flex">
                                            <button type="button" className='btn w-100'>Active</button>
                                            <button type="button" className='btn w-100'>Inactive</button>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <label className="title-common mb-1"> Medication</label>
                                        <div className="segement-static d-flex">
                                            <button type="button" className='btn w-100'>Yes</button>
                                            <button type="button" className='btn w-100'>No</button>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <label className="title-common mb-1">Note</label>
                                        <Input.TextArea placeholder="Enter any specific notes here" className="textareaPlaceholder" rows={3} />
                                    </div>

                                    {/* Add & edit */}
                                    {/* <div>
                                        <div className="mt-1 mb-3">
                                            <Input className="popinput" placeholder="Search Allergy" prefix={<i className='icon-search me-2'></i>} allowClear />
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            <div className="border rounded-10px px-2 py-1 d-flex align-items-center me-3 mb-2 bg-white fontroboto">
                                                Milk <i className="ms-2 icon-Cross fs-18"></i>
                                            </div>
                                            <div className="border rounded-10px px-2 py-1 d-flex align-items-center me-3 mb-2 bg-white fontroboto">
                                                Peanuts <i className="ms-2 icon-Cross fs-18"></i>
                                            </div>
                                            <div className="border rounded-10px px-2 py-1 d-flex align-items-center me-3 mb-2 bg-white fontroboto">
                                                Shelfish <i className="ms-2 icon-Cross fs-18"></i>
                                            </div>
                                            <div className="border rounded-10px px-2 py-1 d-flex align-items-center me-3 mb-2 bg-white fontroboto">
                                                Egg <i className="ms-2 icon-Cross fs-18"></i>
                                            </div>
                                            <div className="border rounded-10px px-2 py-1 d-flex align-items-center me-3 mb-2 bg-white fontroboto">
                                                Pollen <i className="ms-2 icon-Cross fs-18"></i>
                                            </div>
                                            <div className="border rounded-10px px-2 py-1 d-flex align-items-center me-3 mb-2 bg-white fontroboto">
                                                Banana <i className="ms-2 icon-Cross fs-18"></i>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Family History */}
                                    {/* <div>
                                        <div className="mt-5">
                                            <div className="title-common mb-1"> Relationship</div>
                                            <Select
                                                showSearch
                                                placeholder="Select relationship"
                                                optionFilterProp="children"
                                                onChange={onChangeSelect}
                                                onSearch={onSearch}
                                                className="w-75 h-38"
                                                mode="multiple"
                                                filterOption={filterOption}
                                                options={[
                                                    {
                                                        value: 'jack',
                                                        label: 'Jack',
                                                    },
                                                    {
                                                        value: 'lucy',
                                                        label: 'Lucy',
                                                    },
                                                    {
                                                        value: 'tom',
                                                        label: 'Tom',
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div> */}
                                </div>

                                {/* No Selection Image */}
                                {/* <div className="text-center">
                                    <img className="mt-4 mb-3" style={{ width: 135 }} src={NoHypertension} alt="No Result Found" />
                                    <div className="title-hypertension"> No Hypertension ! </div>
                                    <div className="fontroboto text-main title fw-normal mt-2"> 
                                        You have selected that patient does not <br />
                                        have hypertension
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}


export default React.memo(MedicalHistoryBox);
