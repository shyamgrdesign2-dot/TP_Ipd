import React, { useState, useEffect, useRef } from "react";
import { Form } from 'react-bootstrap';
import { AutoComplete, Input, Button, Layout, Collapse, Drawer, Tabs, Select, Card, Row, Col, DatePicker } from 'antd';

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
import TabSearch from "../../components/tab_design/TabSearch";
import TabSearchDetails from "../../components/tab_design/TabSearchSymptomsDetails";
import TabSelectedAdvise from "../../components/tab_design/TabSelectedAdvise";
import VitalsDetails from "../../components/VitalsDetails";

function TabPrescription() {
    // For Symptoms Autocomplete
    const buttonRef = useRef(null);
    const [collapsed, setCollapsed] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(0);
    const character = 'Frequent Urination Muscle'
    const [open, setDrawer] = useState(false);
    const [openVital, setVitalDrawer] = useState(false);
    const [openSave, setSaveDrawer] = useState(false);
    const [drawerSymptom, setDrawerSymptom] = useState(false);
    const [drawerMedication, setDrawerMedication] = useState(false);
    const [openClosableChips, setClosableChipsDrawer] = useState(false);
    const [tabChange, setTabChange] = useState('1');
    const [drawerHandle, setDrawerHandle] = useState(null);


    // Chips buttons
    useEffect(() => {
        setButtonWidth(buttonRef.current.offsetWidth);
    }, [buttonRef]);

    // Drawer Vitals
    const vitalsDrawer = () => {
        setVitalDrawer(true);
    };
    const onVitalClose = () => {
        setVitalDrawer(false);
    };

    // Drawer Template
    const templateDrawer = () => {
        setDrawer(true);
    };
    const onClose = () => {
        setDrawer(false);
    };
    // Drawer Save
    const saveDrawer = () => {
        setSaveDrawer(true);
    };
    const saveonClose = () => {
        setSaveDrawer(false);
    };
    // Drawer Search
    const handleDrawerSymptom = () => {
        setDrawerSymptom(!drawerSymptom);
    };
    const handleDrawerMedication = () => {
        setDrawerMedication(!drawerMedication);
    };
    // Closable Chips Search
    const ClosableChipsDrawer = () => {
        setClosableChipsDrawer(true);
    };
    const ClosableChipsonClose = () => {
        setClosableChipsDrawer(false);
    };

    // Drawer save Tabs 
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

    // Accordian for side menu
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

    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper p-0'>
                <Layout>
                    <div className="prescription-sidebar">
                        <button type='button' className="mb-3 text-center btn btn-action" onClick={vitalsDrawer}>
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={vitalsWhite} alt="Vitals" />
                            </div>
                            <label className="text-white mt-1">Vitals</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action">
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={medicalHistoryWhite} alt="History" />
                            </div>
                            <label className="text-white mt-1">History</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action">
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={labParametersWhite} alt="Lab" />
                            </div>
                            <label className="text-white mt-1">Lab</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action">
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={vaccinationWhite} alt="Vaccine" />
                            </div>
                            <label className="text-white mt-1">Vaccine</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action">
                            <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                <img src={notesWhite} alt="Notes" />
                            </div>
                            <label className="text-white mt-1">Notes</label>
                        </button>
                        <button type='button' className="mb-3 text-center btn btn-action">
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
                            <div className="overflow-y-auto" style={{ height: "calc(100vh - 109px)" }}>
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
                            </div>
                        </>
                    </Sider>
                    <div className="p-20 w-100 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                        <Content>
                            {/* Symptoms Box */}
                            <div className="prescription-box-sm p-20px">
                                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                                    <div className="d-flex align-items-center">
                                        <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                        <div className="title-common">Symptoms</div>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <button className='btn d-flex align-items-center btn-text' onClick={templateDrawer}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                                        <button className='btn d-flex align-items-center btn-text' onClick={saveDrawer}> <i className="icon-save me-2"></i> <span>Save</span></button>
                                    </div>
                                    <Drawer title="Symptoms Templates" placement="right" onClose={onClose} open={open} className="modalWidth-563" width="auto">
                                        <>
                                            <div>
                                                <div className="medicine-templates">
                                                    <Input className="popinput" prefix={<i className='icon-search me-2'></i>} />
                                                </div>
                                                <div className="tab-template-height">
                                                    <div className="align-items-center d-flex justify-content-between medicine-templates">
                                                        <div className="align-items-center d-flex text-truncate">
                                                            <div className="round-box"><i className="icon-template"></i></div>
                                                            <div className="text-truncate">
                                                                <div className="title">Template name</div>
                                                                <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet Pan 40 Tablet, Telma20 </div>
                                                            </div>
                                                        </div>
                                                        <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                                                    </div>
                                                    <div className="align-items-center d-flex justify-content-between medicine-templates">
                                                        <div className="align-items-center d-flex text-truncate">
                                                            <div className="round-box"><i className="icon-template"></i></div>
                                                            <div className="text-truncate">
                                                                <div className="title">Template name</div>
                                                                <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet Pan 40 Tablet, Telma20 </div>
                                                            </div>
                                                        </div>
                                                        <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                                                    </div>
                                                    <div className="align-items-center d-flex justify-content-between medicine-templates">
                                                        <div className="align-items-center d-flex text-truncate">
                                                            <div className="round-box"><i className="icon-template"></i></div>
                                                            <div className="text-truncate">
                                                                <div className="title">Template name</div>
                                                                <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet Pan 40 Tablet, Telma20 </div>
                                                            </div>
                                                        </div>
                                                        <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                                                    </div>
                                                    <div className="align-items-center d-flex justify-content-between medicine-templates">
                                                        <div className="align-items-center d-flex text-truncate">
                                                            <div className="round-box"><i className="icon-template"></i></div>
                                                            <div className="text-truncate">
                                                                <div className="title">Template name</div>
                                                                <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet Pan 40 Tablet, Telma20 </div>
                                                            </div>
                                                        </div>
                                                        <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                                                    </div>
                                                    <div className="align-items-center d-flex justify-content-between medicine-templates">
                                                        <div className="align-items-center d-flex text-truncate">
                                                            <div className="round-box"><i className="icon-template"></i></div>
                                                            <div className="text-truncate">
                                                                <div className="title">Template name</div>
                                                                <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet Pan 40 Tablet, Telma20 </div>
                                                            </div>
                                                        </div>
                                                        <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    </Drawer>

                                    <Drawer title="Save Template" placement="right" onClose={saveonClose} open={openSave} className="modalWidth-563" width="auto">
                                        <>
                                            <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
                                                <Tabs defaultActiveKey="1" items={saveitems} onChange={onTabChange} className="w-100" />
                                            </div>
                                            {tabChange == 1 ? (
                                                <div className="medicine-templates d-flex">
                                                    <Input className="popinput inputheight41" placeholder="Template Name" />
                                                    <Button className="btn btn-primary3 btn-41 ms-3"> Save </Button>
                                                </div>
                                            ) : (
                                                <div className="medicine-templates d-flex">
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
                                    </Drawer>
                                </div>
                                <div className="d-flex flex-wrap p-14-pb0">
                                    <div style={{ width: character.length > 12 && character.length < 24 ? `${character.length * 10.5}px` : character.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                                        <div className="text-truncate p-2" onClick={ClosableChipsDrawer}>
                                            <div className="text-truncate">{character}
                                                <div className="text-truncate small">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                                            </div>
                                        </div>
                                        <Button type="text" className="border-start rounded-0 btn-close-chips">
                                            <i className="icon-Cross"></i>
                                        </Button>
                                    </div>
                                    <Drawer closeIcon={false} placement="right" onClose={ClosableChipsonClose} open={openClosableChips} className="modalWidth-563" width="auto">
                                        <>
                                            <Card bordered={false} className="search-modalCard">
                                                <div className='modalCard-header align-items-center justify-content-between d-flex'>
                                                    <div className='align-items-center d-flex'>
                                                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100'>
                                                            <i className='icon-Cross fs-3'></i>
                                                        </Button>
                                                        <div className="modal-title">Chest Pain</div>
                                                    </div>
                                                    <Button disabled className='btn btn-primary3 btn-41 px-4 me-20'>
                                                        Done
                                                    </Button>
                                                </div>
                                            </Card>
                                            <TabSearchDetails />
                                        </>
                                    </Drawer>
                                </div>
                                <Form className="p-14 py-0">
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <AutoComplete
                                            className='autocomplete-custom w-100'
                                            onClick={handleDrawerSymptom}
                                        >
                                            <Input
                                                placeholder="Search Symptoms"
                                                prefix={<i className='icon-search'></i>}
                                            />
                                        </AutoComplete>
                                    </Form.Group>
                                </Form>
                                <Drawer closeIcon={false} placement="right" onClose={handleDrawerSymptom} open={drawerSymptom} width={'100%'} className="searchdrawer-content">
                                    <TabSearch type={1}/>
                                </Drawer>
                                <div className="d-flex flex-wrap p-14-pb0">
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Chest Pain</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Chest Discomfort</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>High Blood Pressure</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Vomiting</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Diarrhea</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Joint Pain</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Muscle Aches</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Sore Throat</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Loss of Appetite</Button>
                                    {buttonWidth > 150 ? (
                                        <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom chips-custom-break mb-14 me-14`}>{character}</Button>
                                    ) : (
                                        <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom mb-14 me-14`}>{character}</Button>
                                    )}
                                </div>
                            </div>

                            {/* Medication Box */}
                            <div className="prescription-box-sm p-20px">
                                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                                    <div className="d-flex align-items-center">
                                        <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                        <div className="title-common">Medication (Rx)</div>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <button className='btn d-flex align-items-center btn-text' onClick={templateDrawer}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                                        <button className='btn d-flex align-items-center btn-text' onClick={saveDrawer}> <i className="icon-save me-2"></i> <span>Save</span></button>
                                    </div>
                                </div>
                                <div className="p-14-pb0">
                                    <Form className="py-0">
                                        <Form.Group controlId="exampleForm.ControlInput1">
                                            <AutoComplete
                                                className='autocomplete-custom w-100'
                                            >
                                                <Input
                                                    placeholder="Search Symptoms"
                                                    prefix={<i className='icon-search'></i>}
                                                />
                                            </AutoComplete>
                                        </Form.Group>
                                    </Form>

                                   <Drawer closeIcon={false} placement="right" onClose={handleDrawerMedication} open={drawerMedication} width={'100%'} className="searchdrawer-content">
                                        <TabSearch type={2}/>
                                    </Drawer>
                                </div>
                                <div className="d-flex flex-wrap p-14-pb0">
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerMedication}>Dolo (650mg)</Button>
                                </div>
                            </div>

                            {/* Advice Box */}
                            <div className="prescription-box-sm p-20px">
                                <div className="d-flex align-items-center justify-content-between p-14-pb0">
                                    <div className="d-flex align-items-center">
                                        <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                        <div className="title-common">Advise</div>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <button className='btn d-flex align-items-center btn-text' onClick={templateDrawer}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                                        <button className='btn d-flex align-items-center btn-text' onClick={saveDrawer}> <i className="icon-save me-2"></i> <span>Save</span></button>
                                    </div>
                                </div>
                                <div className="p-14-pb0">
                                    <div className="mb-3 overflow-y-auto" style={{ height: "150px" }}>
                                        <TabSelectedAdvise />
                                    </div>
                                    <Form className="py-0">
                                        <Form.Group controlId="exampleForm.ControlInput1">
                                            <AutoComplete
                                                className='autocomplete-custom w-100'
                                            >
                                                <Input
                                                    placeholder="Search Symptoms"
                                                    prefix={<i className='icon-search'></i>}
                                                />
                                            </AutoComplete>
                                        </Form.Group>
                                    </Form>
                                </div>
                                <div className="d-flex flex-wrap p-14-pb0">
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Chest Pain</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Chest Discomfort</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>High Blood Pressure</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Vomiting</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Diarrhea</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Joint Pain</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Muscle Aches</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Sore Throat</Button>
                                    <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerSymptom}>Loss of Appetite</Button>
                                    {buttonWidth > 150 ? (
                                        <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom chips-custom-break mb-14 me-14`}>{character}</Button>
                                    ) : (
                                        <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom mb-14 me-14`}>{character}</Button>
                                    )}
                                </div>
                            </div>

                            {/* Follow-up Box */}
                            <div className="prescription-box-sm p-20px">
                                <div className="p-14-pb0">
                                    <Row gutter={30}>
                                        <Col md={7}>
                                            <div className="d-flex align-items-center mb-14">
                                                <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                                <div className="title-common">Follow-up</div>
                                            </div>
                                            <DatePicker className="w-100" onChange={onChange} inputReadOnly />
                                            {/* Open Below code after date selection  */}
                                            {/* <div className="title fontroboto mt-2">
                                                Saturday, 16th October 2023
                                            </div> */}
                                            <div className="d-flex flex-wrap mt-14">
                                                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">2 Days</Button>
                                                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">5 Days</Button>
                                                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14">1 Week</Button>
                                            </div>
                                        </Col>
                                        <Col md={17}>
                                            <div className="d-flex align-items-center mb-14">
                                                <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                                <div className="title-common">Additional Notes</div>
                                            </div>
                                            <div className="textarea-save">
                                                <Input.TextArea placeholder="Enter any specific note here" className="textareaPlaceholder fontroboto text-main" rows={3} />
                                                <Button className="d-flex align-items-center textarea-save-btn">
                                                    <i className="icon-check"></i>
                                                    <a className="text-decoration-underline">Save</a>
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                        </Content>
                    </div>
                </Layout>
            </div>
            <Drawer closeIcon={false} placement="right" onClose={onVitalClose} open={openVital} className="modalWidth-645" width="auto">
                <Card bordered={false} className="search-modalCard h-100">
                    <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                        <div className='align-items-center d-flex'>
                            <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100'>
                                <i className='icon-Cross fs-3'></i>
                            </Button>
                            <div className="modal-title">Vitals</div>
                        </div>
                        <Button onClick={() => setCollapsed(!collapsed)} className='btn btn-primary3 btn-41 px-4 me-20'>
                            Done
                        </Button>
                    </div>
                    <div className="align-items-center d-flex justify-content-between px-20 py-3">
                        <Button className='btn btn-primary2 btn-41'>
                            Add New Date
                        </Button>
                        <div className="float-end d-flex align-itms-center">
                            <i className="icon-setting me-2"></i>
                            <span className="text-decoration-underline fw-medium"> Add or Configure </span>
                        </div>
                    </div>
                    <VitalsDetails />
                </Card>
            </Drawer >
        </>
    );
}


export default TabPrescription;
