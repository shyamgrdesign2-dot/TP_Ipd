import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import LanguageMoreModal from './LanguageMoreModal';


function DoctorWebsitePersonalDetails() {

    const [languageMoreOptions, setLanguageMoreOptions] = useState(false);

    const handleLanguageMoreOptions = useCallback(() => {
        setLanguageMoreOptions(!languageMoreOptions)
    },
        [languageMoreOptions]
    );

    return (
        <div className="bg-white p-20 overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="text-greycolor fontroboto mb-3"> Write a brief introduction. Highlight your role, experience, languages spoken, best qualities, and key skills.</div>
            <Form layout="vertical">
                <Form.Item
                    label="Years of Experience"
                    className='fw-medium mb-20'
                    required>
                    <Input placeholder="12" className="text-capitalize rounded-10px h-38" defaultValue="0" />
                </Form.Item>
            </Form>
            <hr className='mt-1' />
            <div className='fw-medium mb-20'>Languages Spoken</div>
            <div className='d-flex align-items-center'>
                <div className="closable-chips p-2" onClick={() => handleLanguageMoreOptions()}>
                    English
                </div>
            </div>
            {languageMoreOptions && (
                <LanguageMoreModal width='563px' title={'Timings'} onClose={handleLanguageMoreOptions}
                    onClick={() => {
                        setLanguageMoreOptions(false);
                    }} label='123' value='123' />
            )}
            <hr className='mt-1' />
            <div className='title-common'>About Doctor</div>
            <div className="text-greycolor fontroboto my-3"> Write a brief introduction. Share your experience journey, major achievements, best qualities, and key skills. </div>
            <Input.TextArea rows="5" showCount maxLength={400} className="show-count-textarea text-capitalize textareaPlaceholder rounded-10px" defaultValue="Dr. [Full Name] is a dedicated and compassionate medical professional with extensive experience in providing exceptional patient care. With a strong educational background and a commitment to continuous learning, [He/She] stays at the forefront of medical advancements to offer the best treatment options available. [He/She] is here to provide the support and expertise you need." />
            <div className="text-greycolor fontroboto my-2"> Write maximum 400 characters </div>
        </div>
    );
}

export default DoctorWebsitePersonalDetails;
