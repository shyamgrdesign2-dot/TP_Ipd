import React, { useState, useCallback } from 'react';
import { Button, Collapse, Form, Input, Tabs, Row, Col, Select } from 'antd';

import { Address, Timings, Photos } from "../../utils/constants";

function DWClinicProfile() {

    const specialtyList = [
        {
            value: 'anaesthesiology',
            label: 'Anaesthesiology',
        }
    ]

    const [selectedTab, setSelectedTab] = useState();

    const TabsPrintSetting = [
        {
            key: Address,
            label: 'Address'
        },
        {
            key: Timings,
            label: 'Timings'
        },
        {
            key: Photos,
            label: 'Photos'
        },
    ];

    const onTabChange = useCallback(
        (key) => {
            setSelectedTab(key);
        },
        [selectedTab]
    );

    const accordionItems = [
        {
            key: '1',
            label:
                <>
                    <div className="title-common">Clinic 1</div>
                    <div className='fontroboto'>Aayushyam Clinic Centre LLP</div>
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
                                    <Input placeholder="Clinic Name" className="text-capitalize rounded-10px h-38" />
                                </Form.Item>
                                <Form.Item
                                    label="Clinic Contact"
                                    className='fw-medium mb-20'
                                    required>
                                    <Input placeholder="Clinic Contact" className="text-capitalize rounded-10px h-38" />
                                </Form.Item>
                            </div>
                            <Tabs defaultActiveKey="1" onChange={onTabChange} items={TabsPrintSetting} className="print-tabs" />
                            {selectedTab === Address ? (
                                <Row gutter={20} className='px-20'>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Pincode"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="Pincode" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="City"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="City" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="State"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="City" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Address"
                                            className='fw-medium mb-20'>
                                            <Input.TextArea placeholder="Address" rows={3} className="textareaPlaceholder text-capitalize rounded-10px" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Google map link"
                                            className='fw-medium mb-20'>
                                            <Input placeholder="Copy and paste your clinic address link" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : selectedTab === Timings ? (
                                <Row gutter={20} className='px-20'>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Pincode"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="Pincode" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="City"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="City" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="State"
                                            className='fw-medium mb-20'
                                            required>
                                            <Input placeholder="City" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Address"
                                            className='fw-medium mb-20'>
                                            <Input.TextArea placeholder="Address" rows={3} className="textareaPlaceholder text-capitalize rounded-10px" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Google map link"
                                            className='fw-medium mb-20'>
                                            <Input placeholder="Copy and paste your clinic address link" className="text-capitalize rounded-10px h-38" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : selectedTab === Photos && (
                                '655656564'
                            )}
                        </Form>
                    </div>
                    <Button className='btn w-100 btn-delete-experience btn-41 rounded-top-0 btn-primary3' disabled><i className='icon-delete fs-18 me-2'></i>Delete</Button>
                </div>,

        },
    ];

    return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto"> Add your clinic name, location, timings, and photos.</div>
                <div className="border rounded-20px bg-white mt-3">
                    <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian doctor-experience" expandIconPosition={'end'} />
                </div>
                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3'><i className='icon-Add fs-18 me-2'></i>Add Education</Button>
            </div>
        </div>
    );
}

export default DWClinicProfile;
