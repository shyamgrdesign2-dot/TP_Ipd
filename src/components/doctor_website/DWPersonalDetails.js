import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Input } from 'antd';

import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';

function DWPersonalDetails() {

    const inputWatermarkFile = React.createRef();

    const { personalDetails, setPersonalDetails } = useContext(DoctorWebsiteSettingsContext);

    const [imageUrl, setImageUrl] = useState(null);

    const onChangeInput = useCallback(
        (e, key) => {
            personalDetails[key] = e.target.value;
            setPersonalDetails((prev) => { return { ...prev } });
        },
        [personalDetails]
    );


    const handleProfileChange = (e) => {
        if (e.target.files?.length > 0) {
            const file = e.target.files[0];
            if (file.size <= 2000000 && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setImageUrl(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload only jpg, jpeg or png files with the max size 2mb.');
            }
        }
    };

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
                            <Input placeholder="First Name"
                                className="text-capitalize rounded-10px h-38"
                                value={personalDetails?.first_name}
                                onChange={(e) => onChangeInput(e, 'first_name')} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name"
                            className='fw-medium mb-20'
                            required>
                            <Input placeholder="Last Name"
                                className="text-capitalize rounded-10px h-38"
                                value={personalDetails?.last_name}
                                onChange={(e) => onChangeInput(e, 'last_name')} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Specialty"
                            className='fw-medium mb-20'
                            required>
                            <Input placeholder="Specialty"
                                className="text-capitalize rounded-10px h-38"
                                value={personalDetails?.specialty}
                                disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Education"
                            className='fw-medium mb-20'
                            required>
                            <Input placeholder="Education"
                                className="text-capitalize rounded-10px h-38"
                                value={personalDetails?.education}
                                onChange={(e) => onChangeInput(e, 'education')} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Email"
                            className='fw-medium mb-20'>
                            <Input placeholder="Email"
                                className="text-capitalize rounded-10px h-38"
                                value={personalDetails?.email_id}
                                onChange={(e) => onChangeInput(e, 'email_id')} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <hr className='mt-1' />
            <div className='title-common'>Hero Image</div>
            {imageUrl ?
                <div className='upload-headfoot mt-2'>
                    <img src={imageUrl} alt="Profile" style={{ width: '30%', marginTop: '10px' }} />
                    <input ref={inputWatermarkFile} className="image-upload-input" style={{ display: 'none' }} type="file" accept="image/png, image/jpeg" onChange={handleProfileChange} />
                    <div className="fw-medium text-decoration-underline cursor-pointer">Change Image</div>
                    <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                </div>
                :
                <div className="upload-headfoot mt-2" onClick={() => inputWatermarkFile.current?.click()}>
                    <img className='mt-5' src={personalDetails.hero_image_link} width={"30%"} height={"100%"} alt="" />
                    <input ref={inputWatermarkFile} className="image-upload-input" style={{ display: 'none' }} type="file" accept="image/png, image/jpeg" onChange={handleProfileChange} />
                    <div className="fw-medium text-decoration-underline cursor-pointer">Upload Image</div>
                    <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                </div>
            }
            <div className="text-greycolor fontroboto my-3"> Profile image will be centered and have image ratio of 1:1 with the minimum dimension of 565px x 565px.</div>

        </div>
    );
}

export default React.memo(DWPersonalDetails);
