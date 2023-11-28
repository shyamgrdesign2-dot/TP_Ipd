import React from 'react';
import { Button, Form, Input, Select, Row, Col } from 'antd';

function AddressDetails() {

    // Select for Address State List 
    const stateList = [
        { value: 'AN', label: 'Andaman and Nicobar Islands' },
        { value: 'AP', label: 'Andhra Pradesh' },
        { value: 'AR', label: 'Arunachal Pradesh' },
        { value: 'AS', label: 'Assam' },
    ];
     return (
        <>
            <div className="d-flex justify-content-between">
                <div className='title'>Address Details</div>
                <Button className='border-0 shadow-none'>
                    <div className='title align-items-center d-flex'> <i className='icon-Add me-2'></i> Add Details</div>
                </Button>
            </div>
            <Form
                layout="vertical"
                name="advanced_search"
                className="form_addnewpatient">
                <Row className='mt-3' gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item name="Pincode" label="Pincode">
                            <Input placeholder="Enter Pin Code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item name="city" label="City">
                            <Input placeholder="City" disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className='mt-3' gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item name="state" label="State">
                            <Select placeholder="Select state" disabled options={stateList}></Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item name="streetaddress" label="Street Address">
                            <Input placeholder="Address" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default React.memo(AddressDetails)