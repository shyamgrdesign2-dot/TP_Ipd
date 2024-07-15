import React from 'react';
import { Row, Col, Form, Input, Select } from 'antd';

function DoctorWebsitePersonalDetails({ onClose }) {

    const inputWatermarkFile = React.createRef();

    const specialtyList = [
        {
            value: 'anaesthesiology',
            label: 'Anaesthesiology',
        }
    ]

    const educationList = [
        {
            value: 'mbbs-md',
            label: 'MBBS, MD',
        }
    ]

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
                    <Col span={12}>
                        <Form.Item
                            label="Specialty"
                            className='fw-medium mb-20'
                            required>
                            <Select
                                className="autocomplete-custom"
                                placeholder="Specialty"
                                options={specialtyList}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Education"
                            className='fw-medium mb-20'
                            required>
                            <Select
                                className="autocomplete-custom"
                                placeholder="Education"
                                options={educationList}
                                allowClear
                            />
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
            <hr className='mt-1' />
            <div className='title-common'>Hero Image</div>
            <div className="upload-headfoot mt-2" onClick={() => inputWatermarkFile.current?.click()}>
                <input ref={inputWatermarkFile} className="image-upload-input" style={{ display: 'none' }} type="file" accept="image/png" />
                <div className="fw-medium text-decoration-underline cursor-pointer">Upload Image</div>
                <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
            </div>
            <div className="text-greycolor fontroboto my-3"> Profile image will be centered and have image ratio of 1:1 with the minimum dimension of 565px x 565px.</div>
        </div>
    );
}

export default DoctorWebsitePersonalDetails;
