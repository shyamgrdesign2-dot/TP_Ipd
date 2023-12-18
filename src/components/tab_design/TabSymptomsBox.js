import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form } from 'react-bootstrap';
import { AutoComplete, Input, Button, Drawer, Tabs, Select, Card } from 'antd';


import Symptomsicon from '../../assets/images/Symptoms.svg';
import TabSearch from "../../components/tab_design/TabSearch";
import TabSearchSymptomsDetails from "../../components/tab_design/TabSearchSymptomsDetails";

function TabSymptomsBox() {

    // For Symptoms Autocomplete
    const buttonRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState(0);
    const character = 'Frequent Urination Muscle'

    const [parentDrawer, setParentDrawer] = useState(false);
    const [childDrawer, setChildDrawer] = useState(false);

    const [templateDrawer, setTemplateDrawer] = useState(false);
    const [saveDrawer, setSaveDrawer] = useState(false);

    const [inputTemplateName, setInputTemplateName] = useState(null);
    const TAB_ADD_TEMPLATE = 1;
    const TAB_UPDATE_TEMPLATE = 2;
    const ADD_EDIT_TEMPLATE_TABS = [
        { key: TAB_ADD_TEMPLATE, label: "New Template" },
        { key: TAB_UPDATE_TEMPLATE, label: "Update Template" },
    ];
    const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);

    // Chips buttons
    useEffect(() => {
        setButtonWidth(buttonRef.current.offsetWidth);
    }, [buttonRef]);

    // Handle Parent Drawer
    const handleDrawerParent = useCallback(() => {
        setParentDrawer(!parentDrawer);
    }, [parentDrawer]);

    // Handle Child Drawer
    const handleDrawerChild = useCallback(() => {
        setChildDrawer(!childDrawer);
    }, [childDrawer]);

    // Handle Template Drawer
    const handleDrawerTemplate = useCallback(() => {
        setTemplateDrawer(!templateDrawer);
    }, [templateDrawer]);

    // Handle Save Drawer
    const handleDrawerSave = useCallback(() => {
        setSaveDrawer(!saveDrawer);
    }, [saveDrawer]);

    const onTabChange = useCallback(
        (key) => {
            setInputTemplateName(null);
            setTabChange(key);
        },
        [tabChange]
    );

    return (
        <div className="prescription-box-sm p-20px">
            <div className="d-flex align-items-center justify-content-between p-14-pb0">
                <div className="d-flex align-items-center">
                    <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                    <div className="title-common">Symptoms</div>
                </div>

                <div className="d-flex align-items-center">
                    <button className='btn d-flex align-items-center btn-text'> <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span></button>
                    <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerTemplate}> <i className="icon-template me-2"></i> <span>Templates</span></button>
                    <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerSave}> <i className="icon-save me-2"></i> <span>Save</span></button>
                </div>
                <Drawer title="Symptoms Templates" placement="right" onClose={handleDrawerTemplate} open={templateDrawer} className="modalWidth-563" width="auto">
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

                <Drawer title="Save Template" placement="right" onClose={handleDrawerSave} open={saveDrawer} className="modalWidth-563" width="auto">
                    <>
                        <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
                            <Tabs
                                defaultActiveKey={TAB_ADD_TEMPLATE}
                                items={ADD_EDIT_TEMPLATE_TABS}
                                onChange={onTabChange}
                                className="w-100" />
                        </div>
                        {tabChange === TAB_ADD_TEMPLATE ? (
                            <div className="medicine-templates d-flex">
                                <Input className="popinput inputheight41" placeholder="Template Name" />
                                <Button className="btn btn-primary3 btn-41 ms-3"> {" Save "} </Button>
                            </div>
                        ) : (
                            <div className="medicine-templates d-flex">
                                {/* <Select
                                    showSearch
                                    className='autocomplete-custom w-100 popinput inputheight41'
                                    placeholder="Select Template"
                                    onChange={onSelectChange}
                                    onSearch={onSelectSearch}
                                    options={severityList}
                                /> */}
                                <Button className="btn btn-primary3 btn-41 ms-3"> {" Update "} </Button>
                            </div>
                        )}
                    </>
                </Drawer>
            </div>
            <div className="d-flex flex-wrap p-14-pb0">
                <div style={{ width: character.length > 12 && character.length < 24 ? `${character.length * 10.5}px` : character.length >= 24 ? '256px' : '150px' }} className="d-flex align-items-center justify-content-between text-truncate closable-chips">
                    <div className="text-truncate p-2" onClick={handleDrawerChild}>
                        <div className="text-truncate">{character}
                            <div className="text-truncate small">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                        </div>
                    </div>
                    <Button type="text" className="border-start rounded-0 btn-close-chips">
                        <i className="icon-Cross"></i>
                    </Button>
                </div>
                <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild} open={childDrawer} className="modalWidth-563" width="auto">
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
                        <TabSearchSymptomsDetails />
                    </>
                </Drawer>
            </div>
            <div className="p-14 py-0">
                <AutoComplete
                    className='autocomplete-custom w-100'
                    onClick={handleDrawerParent}>
                    <Input
                        placeholder="Search Symptoms"
                        prefix={<i className='icon-search'></i>}
                    />
                </AutoComplete>
            </div>
            <Drawer closeIcon={false} placement="right" onClose={handleDrawerParent} open={parentDrawer} width={'100%'} className="searchdrawer-content">
                <TabSearch type={1} />
            </Drawer>
            <div className="d-flex flex-wrap p-14-pb0">
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Chest Pain</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Chest Discomfort</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>High Blood Pressure</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Vomiting</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Diarrhea</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Joint Pain</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Muscle Aches</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Sore Throat</Button>
                <Button type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={handleDrawerParent}>Loss of Appetite</Button>
                {buttonWidth > 150 ? (
                    <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom chips-custom-break mb-14 me-14`}>{character}</Button>
                ) : (
                    <Button ref={buttonRef} type="text" className={`btn btn-primary2 chips-custom mb-14 me-14`}>{character}</Button>
                )}
            </div>
        </div>
    );
}


export default TabSymptomsBox;
