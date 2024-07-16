import React, { useState, useCallback } from 'react';
import { Button, Collapse, Form, Input, Row, Col, Select, Checkbox } from 'antd';

function DWDoctorExperience() {

    const specialtyList = [
        {
            value: 'anaesthesiology',
            label: 'Anaesthesiology',
        }
    ]
    const [switchCheckbox, setSwitchCheckbox] = useState(false);
    const onSwitchChange = useCallback((e) => {
        setSwitchCheckbox(e.target.checked)
    }, [switchCheckbox]);

    const accordionItems = [
        {
            key: '1',
            label:
                <>
                    <div className="title-common">Key Experience 1</div>
                    <div className='fontroboto'>{'(Not Specified)'}</div>
                </>,
            children:
                <div className="rounded-20px">
                    <div className='px-20'>
                        <Form layout="vertical">
                            <Form.Item
                                label="Title"
                                className='fw-medium mb-20'
                                required>
                                <Input placeholder="e.g. Medical Director" className="text-capitalize rounded-10px h-38" />
                            </Form.Item>
                            <Form.Item
                                label="Hospital"
                                className='fw-medium mb-20'
                                required>
                                <Input placeholder="e.g Medanta Hospital" className="text-capitalize rounded-10px h-38" />
                            </Form.Item>
                            <Form.Item
                                label="City"
                                className='fw-medium mb-20'
                                required>
                                <Input placeholder="e.g. Mumbai" className="text-capitalize rounded-10px h-38" />
                            </Form.Item>

                            <Checkbox className="switch-name-check checkbold mb-3" checked={switchCheckbox} onChange={onSwitchChange}>I am currently working in this role</Checkbox>

                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Start Date"
                                        className='fw-medium mb-20'
                                        required>
                                        <Select
                                            className="autocomplete-custom"
                                            placeholder="Month"
                                            options={specialtyList}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label=" "
                                        className='fw-medium mb-20'>
                                        <Select
                                            className="autocomplete-custom"
                                            placeholder="Year"
                                            options={specialtyList}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="End Date"
                                        className='fw-medium mb-20'
                                        required>
                                        <Select
                                            className="autocomplete-custom"
                                            placeholder="Month"
                                            options={specialtyList}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label=" "
                                        className='fw-medium mb-20'>
                                        <Select
                                            className="autocomplete-custom"
                                            placeholder="Year"
                                            options={specialtyList}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <Button className='btn w-100 btn-delete-experience btn-41 rounded-top-0 btn-primary3' disabled><i className='icon-delete fs-18 me-2'></i>Delete Experience</Button>
                </div>,
        },
    ];

    return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto"> Your experience journey includes previous roles, locations, durations, and descriptions.</div>
                <div className="border rounded-20px bg-white mt-3">
                    <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian doctor-experience" expandIconPosition={'end'} />
                </div>
                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3'><i className='icon-Add fs-18 me-2'></i>Add Experience</Button>
            </div>
        </div>
    );
}

export default DWDoctorExperience;
