import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Accordion, Form } from 'react-bootstrap';
import { AutoComplete, Input, Button, Row, Col, Select, Popover, Tabs, Layout, Collapse } from 'antd';

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
    const buttonRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState(0);
    const character = 'Frequent Urination Muscle'
    const [value, setValue] = useState('');
    const [options, setOptions] = useState([{
        label: (
            'FREQUENTLY USED'
        )
    }]);

    useEffect(() => {
        setButtonWidth(buttonRef.current.offsetWidth);
    }, [buttonRef]);

    const accordionItems = [
        {
            key: '1',
            label: <div className="title-common">Past Visit Data</div>,
            children:
                <>
                    <div className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            10 OCT, 22
                        </div>
                        <div className="py-3">
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">SPO2(%)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">HbA1C (%)</div>
                                <div className="fontroboto">7.4</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Temperature (Frh)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Pulse(/min)</div>
                                <div className="fontroboto">66</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BP(mm Hg)</div>
                                <div className="fontroboto">120/80</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            10 OCT, 22
                        </div>
                        <div className="py-3">
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">SPO2(%)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">HbA1C (%)</div>
                                <div className="fontroboto">7.4</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Temperature (Frh)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Pulse(/min)</div>
                                <div className="fontroboto">66</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BP(mm Hg)</div>
                                <div className="fontroboto">120/80</div>
                            </div>
                        </div>
                    </div>
                </>
            ,
        },
    ];

    const onChange = (key) => {
        console.log(key);
    };

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

    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper p-0'>
                <Layout>
                    <div className="prescription-sidebar">
                        <button type='button' className="mb-3 text-center btn btn-action" onClick={() => setCollapsed(!collapsed)}>
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={vitalsWhite} alt="Vitals" />
                            </div>
                            <label className="text-white mt-1">Vitals</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action" onClick={() => setCollapsed(!collapsed)}>
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={medicalHistoryWhite} alt="History" />
                            </div>
                            <label className="text-white mt-1">History</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action" onClick={() => setCollapsed(!collapsed)}>
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={labParametersWhite} alt="Lab" />
                            </div>
                            <label className="text-white mt-1">Lab</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action" onClick={() => setCollapsed(!collapsed)}>
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={vaccinationWhite} alt="Vaccine" />
                            </div>
                            <label className="text-white mt-1">Vaccine</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action" onClick={() => setCollapsed(!collapsed)}>
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={notesWhite} alt="Notes" />
                            </div>
                            <label className="text-white mt-1">Notes</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action" onClick={() => setCollapsed(!collapsed)}>
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={docsWhite} alt="Docs" />
                            </div>
                            <label className="text-white mt-1">Docs</label>
                        </button>
                    </div>
                    <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'tabsider' : 'tabsider1'}>
                        <>
                            <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
                                Vitals
                                <Button type="text" className="btn p-0 btn-outline" onClick={() => setCollapsed(!collapsed)}>
                                    <i className='icon-Contract fs-21 text-white p-0'></i>
                                </Button>
                            </div>
                            <div className="p-10 pb-0">
                                <span className="title-common">Today’s Data</span>
                                <Button className='btn btn-input mt-3 d-flex justify-content-center align-items-center btn-41'>
                                    <i className='icon-Add me-2 fs-21'></i>
                                    Add or Edit Vitals
                                </Button>
                                <div className="py-3">
                                    <div className="d-flex align-items-center justify-content-between mb-12">
                                        <div className="fontroboto">SPO2(%)</div>
                                        <div className="fontroboto">95</div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mb-12">
                                        <div className="fontroboto">HbA1C (%)</div>
                                        <div className="fontroboto">7.4</div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mb-12">
                                        <div className="fontroboto">Temperature (Frh)</div>
                                        <div className="fontroboto">95</div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mb-12">
                                        <div className="fontroboto">Pulse(/min)</div>
                                        <div className="fontroboto">66</div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mb-12">
                                        <div className="fontroboto">BP(mm Hg)</div>
                                        <div className="fontroboto">120/80</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Collapse items={accordionItems} className="prescriptiontab-accordian" expandIconPosition={'end'} onChange={onChange} />
                            </div>
                        </>
                    </Sider>
                    <div className="p-20 w-100">
                        <Content>
                            <div className="prescription-box-sm p-20px">
                                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                                    <div className="d-flex align-items-center">
                                        <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                        <div className="title-common">Symptoms</div>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span></button>
                                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button>
                                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap p-14-pb0">
                                    <div style={{ width: character.length > 12 && character.length < 24 ? `${character.length * 10.5}px` : character.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                                        <div className="text-truncate p-2">
                                            <div className="text-truncate">{character}
                                                <div className="text-truncate small">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                                            </div>
                                        </div>
                                        <Button type="text" className="border-start rounded-0 btn-close-chips">
                                            <i className="icon-Cross"></i>
                                        </Button>
                                    </div>
                                </div>
                                <Form className="p-14 py-0">
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <AutoComplete
                                            options={options}
                                            className='autocomplete-custom w-100'
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
                                <div className="d-flex flex-wrap p-14-pb0">
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Pain</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Chest Discomfort</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">High Blood Pressure</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Vomiting</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Diarrhea</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Joint Pain</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Muscle Aches</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Sore Throat</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">Loss of Appetite</Button>
                                    {/* <Button type="text" className="btn btn-primary2 chips-custom chips-custom-break mb-14 me-14">Frequent Urination Muscle Achesa Urination Diarrhea</Button> */}
                                    {buttonWidth > 150 ? (
                                        <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom chips-custom-break mb-14 me-14`}>{character}</Button>
                                    ) : (
                                        <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom mb-14 me-14`}>{character}</Button>
                                    )}

                                </div>
                            </div>
                        </Content>
                    </div>
                </Layout>
            </div>
        </>
    );
}

export default TabPrescription;
