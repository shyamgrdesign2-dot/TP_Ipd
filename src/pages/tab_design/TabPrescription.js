import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { AutoComplete, Input, Button, Row, Col, Select, Popover, Tabs, Layout } from 'antd';

import HeaderPrescription from "../../common/HeaderPrescription";
import Symptomsicon from '../../assets/images/Symptoms.svg';
import vitalsWhite from '../../assets/images/vitals-white.svg';
import medicalHistoryWhite from '../../assets/images/medical-history-white.svg';
import labParametersWhite from '../../assets/images/lab-parameters-white.svg';
import vaccinationWhite from '../../assets/images/vaccination-white.svg';
import notesWhite from '../../assets/images/notes-white.svg';
import docsWhite from '../../assets/images/docs-white.svg';
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

function TabPrescription() {
    // For Symptoms Autocomplete

    const [value, setValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState('');
    const [popOver1, setPopOver1] = useState(false);
    const [popOver2, setPopOver2] = useState(false);
    const [tabChange, setTabChange] = useState('1');

    const [options, setOptions] = useState([{
        label: (
            'FREQUENTLY USED'
        )
    }]);
    const [collapsed, setCollapsed] = useState(false);
    const onSearch = (data) => {
        setValue(data);
        console.log('onSearch', data);
        if (data.length > 0) {
            const array = [
                { id: 1, name: 'Chest Pain' },
                { id: 2, name: 'Chest Discomfort' },
                { id: 3, name: 'Snoring' },
                { id: 4, name: 'Anxiety' },
                { id: 5, name: 'High blood pressure' },
                { id: 6, name: 'Heartburn' },
                { id: -1 }
            ]
            array.map(e => {
                if (e.id != -1) {
                    options.push({
                        value: e.name,
                        label: (
                            <>
                                {e.name}
                            </>
                        )
                    })
                }
            })
        }
        setOptions(prev => [...prev])
    };

    const mockVal = (str, repeat = 1) => ({
        value: str.repeat(repeat),
    });

    const onSelectSearch = (data) => {
        console.log('onSelectSearch', data);
    };
    const onSelectChange = (value) => {
        console.log(`onSelectChange ${value}`);
    };

    const severityList = [
        { value: 'severe', label: 'Severe' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'mild', label: 'Mild' },
    ];

    const saveitems = [
        {
            key: '1',
            label: 'New Template'
        },
        {
            key: '2',
            label: 'Update Template'
        },
    ];
    const onTabChange = (key) => {
        setTabChange(key)
        console.log(`onSelectChange ${key}`);
    };
    const showHidePopOver1 = () => {
        setPopOver1(!popOver1);
    };


    const showHidePopOver2 = () => {
        setPopOver2(!popOver2);
    };
    const saveContent = (
        <>
            <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
                <Tabs defaultActiveKey="1" items={saveitems} onChange={onTabChange} className="w-100" />
                <Button className="btn btn-delete-prescription" onClick={showHidePopOver2}><i className="icon-Cross"></i></Button>
            </div>
            {tabChange == 1 ? (
                <div className="pop-header d-flex">
                    <Input className="popinput inputheight41" placeholder="Template Name" />
                    <Button className="btn btn-primary3 btn-41 ms-3"> Save </Button>
                </div>
            ) : (
                <div className="pop-header d-flex">
                    <Select
                        showSearch
                        className='autocomplete-custom w-100 popinput inputheight41'
                        placeholder="Select Template"
                        onChange={onSelectChange}
                        onSearch={onSelectSearch}
                        options={severityList}
                    />
                    <Button className="btn btn-primary3 btn-41 ms-3"> Update </Button>
                </div>
            )}
        </>
    )

    const content = (
        <>
            <div className="pop-header">
                <div className="align-items-center d-flex justify-content-between">
                    <div className="title-common">Medicine Templates</div>
                    <Button className="btn btn-delete-prescription p-0" onClick={showHidePopOver1}><i className="icon-Cross"></i></Button>
                </div>
                <div className="mt-3">
                    <Input className="popinput" prefix={<i className='icon-search me-2'></i>} />
                </div>
            </div>
            <div className="pop-body">
                <div className="align-items-center d-flex justify-content-between medicine-templates">
                    <div className="round-box"><i className="icon-template"></i></div>
                    <div className="text-truncate">
                        <div className="title">Template name</div>
                        <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                    </div>
                    <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                </div>
                <div className="align-items-center d-flex justify-content-between medicine-templates">
                    <div className="round-box"><i className="icon-template"></i></div>
                    <div className="text-truncate">
                        <div className="title">Template name</div>
                        <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                    </div>
                    <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                </div>
                <div className="align-items-center d-flex justify-content-between medicine-templates">
                    <div className="round-box"><i className="icon-template"></i></div>
                    <div className="text-truncate">
                        <div className="title">Template name</div>
                        <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                    </div>
                    <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                </div>
                <div className="align-items-center d-flex justify-content-between medicine-templates">
                    <div className="round-box"><i className="icon-template"></i></div>
                    <div className="text-truncate">
                        <div className="title">Template name</div>
                        <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                    </div>
                    <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                </div>
                <div className="align-items-center d-flex justify-content-between medicine-templates">
                    <div className="round-box"><i className="icon-template"></i></div>
                    <div className="text-truncate">
                        <div className="title">Template name</div>
                        <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                    </div>
                    <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                </div>
            </div>
        </>
    );

    const navigate = useNavigate();
    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper p-0'>
                <Layout>

                    <div className="prescription-sidebar">
                            <button type='button' className="mb-20 text-center btn btn-action" onClick={() => setCollapsed(!collapsed)}>
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={vitalsWhite} alt="Vitals" />
                                </div>
                                <label className="text-white mt-1">Vitals</label>
                            </button>
                            {/* <div className="mb-20 text-center">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={medicalHistoryWhite} alt="History" />
                                </div>
                                <label className="text-white mt-1">History</label>
                            </div>
                            <div className="mb-20 text-center">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={labParametersWhite} alt="Lab" />
                                </div>
                                <label className="text-white mt-1">Lab</label>
                            </div>
                            <div className="mb-20 text-center">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={vaccinationWhite} alt="Vaccine" />
                                </div>
                                <label className="text-white mt-1">Vaccine</label>
                            </div>
                            <div className="mb-20 text-center">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={notesWhite} alt="Vaccine" />
                                </div>
                                <label className="text-white mt-1">Notes</label>
                            </div>
                            <div className="mb-20 text-center">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={docsWhite} alt="Vaccine" />
                                </div>
                                <label className="text-white mt-1">Docs</label>
                            </div> */}
                        
                    </div>
                    <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'tabsider' : 'tabsider1'}>
                        <>
                            <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
                                Vitals
                                <i className="icon-Contract"></i>
                            </div>
                        </>
                    </Sider>

                    <div className="p-20 ms-3 w-100">
                        <Content>
                            <div className="prescription-box-sm p-20px">
                                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                                    <div className="d-flex align-items-center">
                                        <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                        <div className="title-common">Symptoms</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span></button>
                                        <Popover open={popOver1} onOpenChange={showHidePopOver1} content={content} trigger="click" overlayClassName="pop-350 pp-0" placement="bottom">
                                            <button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button>
                                        </Popover>
                                        <Popover open={popOver2} onOpenChange={showHidePopOver2} content={saveContent} trigger="click" overlayClassName="pop-450 pp-0" placement="bottom">
                                            <button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button>
                                        </Popover>
                                    </div>
                                </div>
                                <Row gutter={[0]} className="align-items-center border-bottom border-top mt-14">
                                    <Col lg={7} md={7} sm={7} xs={7} className="border-end">
                                        <div className="p-2 fontroboto fw-medium">Chest Pain</div>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                                        <AutoComplete
                                            options={options}
                                            className='autocomplete-custom w-100 inputborder'
                                            // onSelect={onSelect}
                                            onSearch={onSearch}
                                            bordered={false}
                                            placeholder="Since"
                                        >
                                        </AutoComplete>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                                        <Select
                                            showSearch
                                            className='autocomplete-custom w-100 inputborder'
                                            placeholder="Severity"
                                            onChange={onSelectChange}
                                            onSearch={onSelectSearch}
                                            options={severityList}
                                        />
                                    </Col>
                                    <Col lg={8} md={8} sm={7} xs={7} className="border-end">
                                        <Input className="notesinput border-0" placeholder="Notes" />
                                    </Col>
                                    <Col lg={1} md={1} sm={2} xs={2} className="text-center">
                                        <Button className="btn py-0 btn-delete-prescription px-0">
                                            <i className="icon-delete"></i>
                                        </Button>
                                    </Col>
                                </Row>

                                <Form className="p-14">
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <AutoComplete
                                            options={options}
                                            className='autocomplete-custom w-100'
                                            // onSelect={onSelect}
                                            onSearch={onSearch}
                                        >
                                            <Input
                                                placeholder="Search by Patient’s Name, Phone number or Id"
                                                prefix={<i className='icon-search'></i>}
                                                suffix={value.length > 0 && <i className='icon-Cross' onClick={() => setValue('')}></i>}
                                            />
                                        </AutoComplete>
                                    </Form.Group>
                                </Form>
                            </div>
                        </Content>

                    </div>
                </Layout>
            </div>
        </>
    );
}

export default TabPrescription;
