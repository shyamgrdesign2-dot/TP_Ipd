import React from 'react';
import { Form, Input, Select, Button, Collapse } from 'antd';
function DWRewardsRecognition() {
    const yearList = [
        {
            value: '2021',
            label: '2021',
        }
    ]
    const accordionItems = [
        {
            key: '1',
            label:
                <>
                    <div className="title-common">Rewards & Recognition 1</div>
                    <div className='fontroboto'>Not Specified</div>
                </>,
            children:
                <div className="rounded-20px">
                    <div className='px-20'>
                        <Form layout="vertical">
                            <Form.Item
                                label="Title"
                                className='fw-medium mb-20'>
                                <Input placeholder="Add your achievements" className="text-capitalize rounded-10px h-38" />
                            </Form.Item>
                            <Form.Item
                                label="Year"
                                className='fw-medium mb-20'>
                                <Select
                                    className="autocomplete-custom"
                                    placeholder="Year"
                                    options={yearList}
                                    allowClear
                                />
                            </Form.Item>
                        </Form>
                    </div>
                    <Button className='btn w-100 btn-delete-experience btn-41 rounded-top-0 btn-primary3 align-items-center d-flex justify-content-center' disabled><i className='icon-delete fs-18 me-2'></i>Delete Experience</Button>
                </div>,
        },
    ];
    return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto">Add your achievements, public acknowledgment or praise, such as awards, certificates, commendations, etc.</div>
                <div className="border rounded-20px bg-white mt-3">
                    <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian doctor-experience" expandIconPosition={'end'} />
                </div>
                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3'><i className='icon-Add fs-18 me-2'></i>Add Rewards & Recognition</Button>
            </div>
        </div>
    );
}
export default DWRewardsRecognition;