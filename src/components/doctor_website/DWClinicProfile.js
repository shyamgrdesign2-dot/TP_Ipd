import React, { useState, useCallback, useContext } from 'react';
import { Button, Collapse, Form, Input, Tabs, Row, Col, TimePicker } from 'antd';
import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';

import { TAB_ADDRESS, TAB_TIMINGS, TAB_PHOTOS } from "../../utils/constants";

function DWClinicProfile() {

    const { clinicProfile, setClinicProfile } = useContext(DoctorWebsiteSettingsContext);

    const TabsPrintSetting = [
        {
            key: TAB_ADDRESS,
            label: 'Address'
        },
        {
            key: TAB_TIMINGS,
            label: 'Timings'
        },
        {
            key: TAB_PHOTOS,
            label: 'Photos'
        },
    ];

    const onTabChange = useCallback(
        (key, i) => {
            clinicProfile[i]['selectedTab'] = key;
            setClinicProfile((prev) => { return [...prev] });
        },
        [clinicProfile]
    );

    const TimingItems = [
        {
            key: '1',
            label:
                <>
                    <div className="title-common">Shift 1</div>
                    <div className='fontroboto'>Manage your shifts with new set of days</div>
                </>,
            children:
                <>
                    <div className='p-10 pt-3'>
                        <Form.Item
                            label="Select multiple days for create the shift"
                            className='fw-medium mb-1'
                            required>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='days-width sunday-color rounded-10px border'>S</div>
                                <div className='days-width active-days rounded-10px border'>M</div>
                                <div className='days-width active-days rounded-10px border'>T</div>
                                <div className='days-width active-days rounded-10px border'>W</div>
                                <div className='days-width active-days rounded-10px border'>T</div>
                                <div className='days-width rounded-10px border'>F</div>
                                <div className='days-width rounded-10px border'>S</div>
                            </div>
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="Set your shift timings"
                        className='fw-medium p-10 pb-0 mb-0'
                        required>
                        <Row align="middle" justify="space-between" className='mb-12'>
                            <Col span={9}>
                                <TimePicker format="h:mm A" use12Hours placeholder="hh:mm" className="text-capitalize rounded-10px h-38" />
                            </Col>
                            <Col span={2}>
                                <div className='text-center'>To</div>
                            </Col>
                            <Col span={9}>
                                <TimePicker format="h:mm A" use12Hours placeholder="hh:mm" className="text-capitalize rounded-10px h-38" />
                            </Col>
                            <Col span='auto'>
                                <Button className='btn-delete-prescription btn px-0'><i className='icon-Add text-primary'></i></Button>
                            </Col>
                        </Row>
                        <Row align="middle" justify="space-between" className='mb-12'>
                            <Col span={9}>
                                <TimePicker format="h:mm A" use12Hours placeholder="hh:mm" className="text-capitalize rounded-10px h-38" />
                            </Col>
                            <Col span={2}>
                                <div className='text-center'>To</div>
                            </Col>
                            <Col span={9}>
                                <TimePicker format="h:mm A" use12Hours placeholder="hh:mm" className="text-capitalize rounded-10px h-38" />
                            </Col>
                            <Col span='auto'>
                                <Button className='btn-delete-prescription btn px-0'><i className='icon-delete text-primary'></i></Button>
                            </Col>
                        </Row>
                        <button className='btn float-end mb-2 btn-text d-flex px-0'><i className='icon-delete fs-18 me-1'></i><span>Delete Shift</span></button>
                    </Form.Item>
                </>
        },
    ];

    const onChangeInput = useCallback(
        (e, key, i) => {
            clinicProfile[i][key] = e.target.value;
            setClinicProfile((prev) => { return [...prev] });
        },
        [clinicProfile]
    );

    const onChangeAddressInput = useCallback(
        (e, key, i) => {
            clinicProfile[i]['address'][key] = e.target.value;
            setClinicProfile((prev) => { return [...prev] });
        },
        [clinicProfile]
    );

    const inputWatermarkFile = React.createRef();

    const clinicItems = (e, i) => [
        {
            key: `${i + 1}`,
            label:
                <>
                    <div className="title-common">Clinic 1</div>
                    {(e?.name) ? (
                        <div className='fontroboto'>{`${Object.values(Object.fromEntries(Object.entries((({ name }) => ({ name }))(e)).filter(([_, v]) => v))).join(', ')}`}</div>
                    ) : (
                        <div className='fontroboto'>{'(Not Specified)'}</div>
                    )}
                </>,
            children:
                <div className="rounded-20px">
                    <div>
                        <Form layout="vertical">
                            <div className='px-20'>
                                <Form.Item
                                    label="Clinic Name"
                                    className='fw-medium mb-20'
                                    required>
                                    <Input placeholder="Clinic Name"
                                        className="text-capitalize rounded-10px h-38"
                                        value={e?.name}
                                        onChange={(e) => onChangeInput(e, 'name', i)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Clinic Contact"
                                    className='fw-medium mb-20'
                                    required>
                                    <Input placeholder="Clinic Contact"
                                        className="text-capitalize rounded-10px h-38"
                                        value={e?.contact_no}
                                        onChange={(e) => onChangeInput(e, 'contact_no', i)} />
                                </Form.Item>
                            </div>
                            <Tabs defaultActiveKey={'1'} onChange={(key) => onTabChange(key, i)} items={TabsPrintSetting} className="print-tabs" />
                            {e?.selectedTab === TAB_ADDRESS ? (
                                <Row gutter={20} className='px-10'>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Pincode"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="Pincode" className="text-capitalize rounded-10px h-38"
                                                value={e?.address?.pincode}
                                                onChange={(e) => onChangeAddressInput(e, 'pincode', i)} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="City"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="City"
                                                className="text-capitalize rounded-10px h-38"
                                                value={e?.address?.city}
                                                onChange={(e) => onChangeAddressInput(e, 'city', i)} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="State"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="City"
                                                className="text-capitalize rounded-10px h-38"
                                                value={e?.address?.state}
                                                onChange={(e) => onChangeAddressInput(e, 'state', i)} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Address"
                                            className='fw-medium mb-20'>
                                            <Input.TextArea placeholder="Address" rows={3} className="textareaPlaceholder text-capitalize rounded-10px"
                                                value={e?.address?.address}
                                                onChange={(e) => onChangeAddressInput(e, 'address', i)} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Google map link"
                                            className='fw-medium mb-20'>
                                            <Input placeholder="Copy and paste your clinic address link" className="text-capitalize rounded-10px h-38"
                                                value={e?.address?.google_map}
                                                onChange={(e) => onChangeAddressInput(e, 'address', i)} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : e?.selectedTab === TAB_TIMINGS ? (
                                <div className='px-10 mb-2'>
                                    <Collapse items={TimingItems} defaultActiveKey={['1']} className='prescriptiontab-accordian timingTab' expandIconPosition={'end'} />
                                    <button className='mt-2 btn btn-delete-experience text-primary'><i className='icon-Add fs-18 me-2'></i>Add More Shifts</button>
                                </div>
                            ) : e?.selectedTab === TAB_PHOTOS && (
                                <div className='px-10'>
                                    <div className="upload-headfoot mt-0" onClick={() => inputWatermarkFile.current?.click()}>
                                        <input ref={inputWatermarkFile} className="image-upload-input" style={{ display: 'none' }} type="file" accept="image/png" />
                                        <div className="fw-medium text-decoration-underline cursor-pointer">Upload Clinic Photos</div>
                                        <div className="fs-12-1 fontroboto">  Only jpg, jpeg or png files with the max size 5mb.</div>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </div>
                    {/* <Button className='btn w-100 btn-delete-experience btn-41 rounded-top-0 btn-primary3' disabled><i className='icon-delete fs-18 me-2'></i>Delete</Button> */}
                </div>,
        },
    ];

    const addClinicProfileClick = useCallback(
        () => {
            clinicProfile.push({
                random_id: '',
                name: '',
                contact_no: '',
                address: {
                    pincode: '',
                    city: '',
                    state: '',
                    address: '',
                    google_map: ''
                },
                timing: [],
                clinic_photos: [],
                clinic_delete: 0
            })
            setClinicProfile((prev) => { return [...prev] });
        },
        [clinicProfile]
    );


    return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto"> Add your clinic name, location, timings, and photos.</div>
                {clinicProfile.map((e, i) => {
                    return (
                        <div className="border rounded-20px bg-white mt-3">
                            <Collapse items={clinicItems(e, i)} defaultActiveKey={['1']} className="prescriptiontab-accordian doctor-experience" expandIconPosition={'end'} />
                        </div>
                    )
                })}

                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3' onClick={addClinicProfileClick} ><i className='icon-Add fs-18 me-2'></i>Add one more clinic</Button>
            </div>
        </div>
    );
}

export default DWClinicProfile;
