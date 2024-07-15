import React from 'react';
import { Row, Col, Form, Input, Select } from 'antd';

function DoctorWebsiteSocialLinks() {

    return (
        <div className="bg-white p-20 overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="text-greycolor fontroboto mb-3"> Write about doctor's personal details.</div>
            <Form layout="vertical">
                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            label="First Name"
                            className='fw-medium mb-20'
                            required>
                            <Input placeholder="First Name" className="text-capitalize rounded-10px h-38" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name"
                            className='fw-medium mb-20'
                            required>
                            <Input placeholder="Last Name" className="text-capitalize rounded-10px h-38" />
                        </Form.Item>
                    </Col>
                    
                    <Col span={24}>
                        <Form.Item
                            label="Email"
                            className='fw-medium mb-20'>
                            <Input placeholder="Email" className="text-capitalize rounded-10px h-38" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default DoctorWebsiteSocialLinks;
