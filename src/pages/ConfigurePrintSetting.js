import React, { useState, useEffect, useCallback } from "react";
import { Col, Tabs, Radio, Row, Form, Select, Switch, Button, Input, Checkbox } from "antd";
import HeaderPrintSetting from "../common/HeaderPrintSetting";
import { useReactToPrint } from 'react-to-print';
import PrintHtmlPage from "./PrintHtmlPage";

import { useSelector, useDispatch } from "react-redux";

import { TAB_PRESCRIPTION, TAB_HEADER_FOOTER, TAB_PAGE_FORMAT } from "../utils/constants";
import defaultprofile from "../assets/images/default-profile.svg";

const { TextArea } = Input;

function ConfigurePrintSetting() {

    const printRef = React.useRef();

    const { defaultPrintSettings } = useSelector((state) => state.doctors);

    const [selectedTab, setSelectedTab] = useState(TAB_PRESCRIPTION);
    const [printSettings, setPrintSettings] = useState(null);

    const TabsPrintSetting = [
        {
            key: TAB_PRESCRIPTION,
            label: 'Prescription'
        },
        {
            key: TAB_HEADER_FOOTER,
            label: 'Header & Footer',
            children: <div className="px-3 form_addnewpatient">
                <div className="border-bottom pb-3 mb-3">
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                        <Col lg="18">
                            <div className="titleprint">Header & Footer</div>
                        </Col>
                        <Col lg="6">
                            <Button className="btn rounded-10px px-1 border" style={{ transform: "rotate(-89deg)" }}>
                                <i className="icon-right"></i>
                            </Button>
                        </Col>
                    </Row>
                    <div>Setup your header and Footer</div>

                    <div className="mt-3">
                        <Form.Item className="mb-0">
                            <label className="mb-1 title-common">Select Letterhead Format</label>
                            <Radio.Group className="d-flex gender-radio">
                                <Radio.Button className="w-100 text-center" value="Male">Custom</Radio.Button>
                                <Radio.Button className="w-100 text-center" value="Female">Upload Letterhead</Radio.Button>
                                <Radio.Button className="w-100 text-center" value="Other">Own Letterhead</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    {/* For Custom tab  */}
                    <div className="mt-5">
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="18">
                                <div className="title-common">Doctor’s information</div>
                            </Col>
                            <Col lg="6">
                                <Switch />
                            </Col>
                        </Row>
                        <Form.Item className="mb-0 mt-3">
                            <Radio.Group className="d-flex gender-radio">
                                <Radio.Button className="w-100 text-center" value="left">left</Radio.Button>
                                <Radio.Button className="w-100 text-center" value="Female">right</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <div className="mt-3">
                            <Form.Item>
                                <label className="mb-1">Header</label>
                                <Input className='inputheight41-group' />
                            </Form.Item>
                        </div>
                        <div className="mt-3">
                            <Form.Item>
                                <label className="mb-1">Subheader</label>
                                <TextArea
                                    className="endreason-textarea subheader-textarea"
                                    style={{
                                        resize: "none"
                                    }}
                                />
                            </Form.Item>
                        </div>
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="18">
                                <div className="title-common">Clinic’s information</div>
                            </Col>
                            <Col lg="6">
                                <Switch />
                            </Col>
                        </Row>
                        <Form.Item className="mb-0 mt-3">
                            <Radio.Group className="d-flex gender-radio">
                                <Radio.Button className="w-100 text-center" value="left">left</Radio.Button>
                                <Radio.Button className="w-100 text-center" value="Female">right</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <div className="mt-3">
                            <Form.Item>
                                <label className="mb-1">Header</label>
                                <Input className='inputheight41-group' />
                            </Form.Item>
                        </div>
                        <div className="mt-3">
                            <Form.Item>
                                <label className="mb-1">Subheader</label>
                                <TextArea
                                    className="endreason-textarea subheader-textarea"
                                    style={{
                                        resize: "none"
                                    }}
                                />
                            </Form.Item>
                        </div>
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="18">
                                <div className="title-common">Logo on Header</div>
                            </Col>
                            <Col lg="6">
                                <Switch />
                            </Col>
                        </Row>
                        <div className="upload-headfoot upload-headfoot1 p-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="text-start fontroboto">Upload a picture of your<br /> Logo</div>
                                <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
                                    <Form.Item name="pm_image" />
                                    <input type="file" accept="image/*" />
                                    <span>Upload</span>
                                </div>
                            </div>
                        </div>
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="18">
                                <div className="title-common">See whatsApp Rx preview </div>
                            </Col>
                            <Col lg="6">
                                <div className="d-flex align-items-center">
                                    <i className="icon-Preview"></i>
                                    <button className='btn btn-text'>
                                        <span>Default Settings</span>
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* For Upload Letter head tab  */}
                    <div className="mt-5">
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="24">
                                <div className="title-common">Upload your header and footer image</div>
                            </Col>
                        </Row>
                        <div className="upload-headfoot">
                            <div className="fw-medium text-decoration-underline cursor-pointer">Upload Header</div>
                            <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                            <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                        </div>
                        <div className="upload-headfoot">
                            <div className="fw-medium text-decoration-underline cursor-pointer">Upload Footer</div>
                            <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                            <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                        </div>
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="18">
                                <div className="title-common">See whatsApp Rx preview </div>
                            </Col>
                            <Col lg="6">
                                <div className="d-flex align-items-center">
                                    <i className="icon-Preview"></i>
                                    <button className='btn btn-text'>
                                        <span>Default Settings</span>
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* For Own Letterhead tab */}
                    <div className="mt-5">
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="24">
                                <div className="title-common">Set page margins to display your own letterhead</div>
                            </Col>
                        </Row>
                        <div className="">
                            <div className="my-3 text-center">
                                <label className="mb-1">Top (cm)</label> <br />
                                <Input className='inputheight41-group' style={{ width: 70 }} />
                            </div>
                            <Row className="align-items-center justify-content-around form_addnewpatient mb-1">
                                <Col lg="6">
                                    <div className="text-center">
                                        <label className="mb-1">Left (cm)</label> <br />
                                        <Input className='inputheight41-group' style={{ width: 70 }} />
                                    </div>
                                </Col>
                                <Col lg="12">
                                    <img src={defaultprofile} />
                                </Col>
                                <Col lg="6">
                                    <div className="text-center">
                                        <label className="mb-1">Right (cm)</label> <br />
                                        <Input className='inputheight41-group' style={{ width: 70 }} />
                                    </div>
                                </Col>
                            </Row>
                            <div className="my-3 text-center">
                                <Input className='inputheight41-group' style={{ width: 70 }} /> <br />
                                <label className="mb-1">Bottom (cm)</label>
                            </div>
                        </div>
                        <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                            <Col lg="18">
                                <div className="title-common">See whatsApp Rx preview </div>
                            </Col>
                            <Col lg="6">
                                <div className="d-flex align-items-center">
                                    <i className="icon-Preview"></i>
                                    <button className='btn btn-text'>
                                        <span>Default Settings</span>
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* <div className="upload-headfoot">
                        <div className="fw-medium text-decoration-underline cursor-pointer">Upload Header</div>
                        <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                        <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                    </div>
                    <div className="upload-headfoot">
                        <div className="fw-medium text-decoration-underline cursor-pointer">Upload Footer</div>
                        <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                        <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                    </div> */}
                    {/* <Form.Item className="mb-0">
                        <label className="mb-1">Letterhead Used In</label>
                        <Radio.Group className="d-flex gender-radio">
                            <Radio.Button className="w-100 text-center" value="Male">Both</Radio.Button>
                            <Radio.Button className="w-100 text-center" value="Female">Print Rx</Radio.Button>
                            <Radio.Button className="w-100 text-center" value="Other">WhatsApp Rx</Radio.Button>
                        </Radio.Group>
                    </Form.Item> */}

                </div>
                {/* <div className="border-bottom pb-3 mb-3">
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                        <Col lg="18">
                            <div className="titleprint">Print Rx on your letter head</div>
                        </Col>
                        <Col lg="6">
                            <Switch />
                        </Col>
                    </Row>
                    <div>Use page margins to display your letterhead safely on print</div>

                    <div className="mt-3">
                        <div className="d-flex mt-3">
                            <div className="me-4">
                                <label className="mb-1 title-common">Top Margin</label>
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <Input className='inputheight41-group' inputMode="numeric" addonAfter={'cm'} />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 title-common">Bottom Margin</label>
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <Input className='inputheight41-group' inputMode="numeric" addonAfter={'cm'} />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mt-3">
                            <div className="me-4">
                                <label className="mb-1 title-common">Left Margin</label>
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <Input className='inputheight41-group' inputMode="numeric" addonAfter={'cm'} />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 title-common">Right Margin</label>
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <Input className='inputheight41-group' inputMode="numeric" addonAfter={'cm'} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div> */}
                {/* <div className="border-bottom pb-3 mb-3">
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                        <Col lg="18">
                            <div className="titleprint">Custom Header</div>
                        </Col>
                        <Col lg="6">
                            <Button className="btn rounded-10px px-1 border" style={{ transform: "rotate(-89deg)" }}>
                                <i className="icon-right"></i>
                            </Button>
                        </Col>
                    </Row>
                    <div>Create your custom header</div>
                    <div className="mt-3">
                        <Form.Item>
                            <label className="mb-1">Header Title</label>
                            <Input className='inputheight41-group' inputMode="numeric" />
                        </Form.Item>
                    </div>
                    <div className="mt-3">
                        <Form.Item>
                            <label className="mb-1">Header Font Size</label>
                            <Select
                                showSearch
                                className="autocomplete-custom"
                                allowClear
                            />
                        </Form.Item>
                    </div>
                    <div className="mt-3">
                        <Form.Item>
                            <label className="mb-1">Header Title</label>
                            <Input className='inputheight41-group' inputMode="numeric" />
                        </Form.Item>
                    </div>
                    <div className="mt-3">
                        <Form.Item>
                            <label className="mb-1">Header Font Size</label>
                            <Select
                                showSearch
                                className="autocomplete-custom"
                                allowClear
                            />
                        </Form.Item>
                    </div>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                        <Col lg="18">
                            <div className="title-common">Logo on Header</div>
                        </Col>
                        <Col lg="6">
                            <Switch />
                        </Col>
                    </Row>
                    <div className="upload-headfoot upload-headfoot1 p-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="text-start fontroboto">Upload a picture of your<br /> Logo</div>
                            <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
                                <Form.Item name="pm_image" />
                                <input type="file" accept="image/*" />
                                <span>Upload</span>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="border-bottom pb-3 mb-3">
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                        <Col lg="18">
                            <div className="titleprint">Display Patient Info</div>
                        </Col>
                        <Col lg="6">
                            <Button className="btn rounded-10px px-1 border" style={{ transform: "rotate(-89deg)" }}>
                                <i className="icon-right"></i>
                            </Button>
                        </Col>
                    </Row>
                    <div>Manage your patient information</div>
                </div>

                {/* Use here for Customize Setting draggable table */}

                <div className="mb-3">
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                        <Col lg="18">
                            <div className="titleprint">Other Settings</div>
                        </Col>
                        <Col lg="6">
                            <Button className="btn rounded-10px px-1 border" style={{ transform: "rotate(-89deg)" }}>
                                <i className="icon-right"></i>
                            </Button>
                        </Col>
                    </Row>
                    <div>Customize your watermark, signature, and QR code</div>
                    <div className="mt-4">
                        <div className="mb-3">
                            <Row justify="space-between" className="align-items-center form_addnewpatient">
                                <Col lg="18">
                                    <div className="title-common">Watermark</div>
                                </Col>
                                <Col lg="6">
                                    <Switch />
                                </Col>
                            </Row>
                            <div className="upload-headfoot upload-headfoot1 p-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <img src={defaultprofile} style={{ height: 75 }} />
                                    <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
                                        <Form.Item name="pm_image" />
                                        <input type="file" accept="image/*" />
                                        <span>Upload New</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                <Col lg="18">
                                    <div className="title-common">Signature</div>
                                </Col>
                                <Col lg="6">
                                    <Switch />
                                </Col>
                            </Row>
                            <Form.Item className="mb-0 mt-3">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="left">left</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">right</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <div className="border rounded-10px mt-3">
                                <div className="upload-headfoot border-0 border-bottom rounded-bottom-0 mt-0">
                                    <div className="fw-medium text-decoration-underline cursor-pointer">Draw or Upload Signature</div>
                                    <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                                </div>
                                <div className="p-3">
                                    <div className="title-common mb-3">Include in signature</div>
                                    <div className="mb-3">
                                        <Checkbox className="switch-name-check">Name of Doctor</Checkbox>
                                    </div>
                                    <div className="mb-3">
                                        <Checkbox className="switch-name-check">Medical Registration Number</Checkbox>
                                    </div>
                                    <div className="mb-3">
                                        <Checkbox className="switch-name-check">Qualifications</Checkbox>
                                    </div>

                                    <TextArea
                                        className="endreason-textarea h-76"
                                        placeholder="Enter qualification e.g. MBBS, MS, MD"
                                        style={{
                                            resize: "none"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                <Col lg="18">
                                    <div className="title-common">Show QR code</div>
                                </Col>
                                <Col lg="6">
                                    <Switch />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>,
        },
        {
            key: TAB_PAGE_FORMAT,
            label: 'Page Format',
            children: <div className="px-3 form_addnewpatient">
                <div className="titleprint mb-3">Page Layout</div>
                <Form.Item>
                    <label className="mb-1">Page Size</label>
                    <Radio.Group className="d-flex gender-radio">
                        <Radio.Button className="w-100 text-center" value="a4">A4</Radio.Button>
                        <Radio.Button className="w-100 text-center" value="a5">A5</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <label className="mb-1">Font Family</label>
                    <Select
                        showSearch
                        className="autocomplete-custom"
                        placeholder="e.g 1-0-1"
                        // defaultValue={}
                        // value={}
                        // onSearch={}
                        // onFocus={}
                        // onBlur={}
                        // onSelect={}
                        // options={}
                        // onClear={}
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <label className="mb-1">Font Size</label>
                    <Select
                        showSearch
                        className="autocomplete-custom"
                        placeholder="e.g 1-0-1"
                        allowClear
                    />
                </Form.Item>
            </div>,
        },
    ];

    const printContent = useReactToPrint({
        content: () => printRef.current,
    });

    // const css = `@page {
    //     size: A4 landscape;
    //   }
    //   table {
    //     page-break-inside: avoid;
    //   }

    //   @media print {

    //   }`;

    useEffect(() => {
        setPrintSettings(JSON.parse(JSON.stringify(defaultPrintSettings)));
    }, [defaultPrintSettings]);

    const onTabChange = useCallback(
        (key) => {
            setSelectedTab(key);
        },
        [selectedTab]
    );

    const onMainCaseOptionChange = useCallback(
        (e) => {
            const updatedData = printSettings.prescription.case_option.map((x) => {
                return { ...x, format: e.target.value };
            });

            setPrintSettings((prev) => {
                return {
                    ...prev,
                    prescription: {
                        case_option: updatedData
                    }
                };
            });
        },
        [printSettings]
    );

    const onCaseOptionChange = useCallback(
        (e, flag, i) => {
            flag === 'radio' ?
                printSettings.prescription.case_option[i]['format'] = e.target.value
                :
                printSettings.prescription.case_option[i]['enable'] = e.enable === 'Y' ? 'N' : 'Y'

            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    return (
        <>
            <HeaderPrintSetting />
            {/* <style scoped>{css}</style> */}
            <div className={'w-100 bg-body wrapper2'}>
                <Row justify="space-between">
                    <Col lg={8} className="pe-4">
                        <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <Tabs defaultActiveKey="1" items={TabsPrintSetting} onChange={onTabChange} className="print-tabs" />
                            {selectedTab === TAB_PRESCRIPTION && (
                                <div className="px-3">
                                    <div className="titleprint mb-3">Format Style</div>
                                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                        <Col lg="10">
                                            All Change to
                                        </Col>
                                        <Col lg="14">
                                            <Form.Item className="mb-0">
                                                <Radio.Group className="d-flex gender-radio" onChange={onMainCaseOptionChange}
                                                    value={
                                                        printSettings?.prescription?.case_option.every(e => e.format === 'inline') ? 'inline'
                                                            : printSettings?.prescription?.case_option.every(e => e.format === 'listview') ? 'listview'
                                                                : printSettings?.prescription?.case_option.every(e => e.format === 'table') ? 'table'
                                                                    : null}>
                                                    <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
                                                    <Radio.Button className="w-100 text-center" value="listview">ListView</Radio.Button>
                                                    <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {printSettings?.prescription?.case_option?.map((e, i) => {
                                        return (
                                            <Row key={i} justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                                <Col lg="10">
                                                    <div className="d-flex align-items-center cursor-pointer" onClick={() => onCaseOptionChange(e, 'visible', i)}>
                                                        <i className={`icon-Preview ${e.enable == 'N' && 'disable-preview'} me-2`}></i>
                                                        <span>{e.title}</span>
                                                    </div>
                                                </Col>
                                                <Col lg="14">
                                                    <Form.Item className="mb-0">
                                                        <Radio.Group className="d-flex gender-radio" onChange={(e) => onCaseOptionChange(e, 'radio', i)} value={e.format}>
                                                            <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
                                                            <Radio.Button className="w-100 text-center" value="listview">ListView</Radio.Button>
                                                            <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col lg={16} className="overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                        <div className="mx-auto overflow-y-auto" style={{ width: 900 }}>
                            <div className="titleprint mt-20" onClick={() => printContent()}>Preview</div>
                            <div className="border rounded-20px bg-white mt-20 overflow-hidden h-100">
                                <div key={Math.random()} ref={printRef} style={{ padding: 20 }} className="h-100">
                                    <PrintHtmlPage />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default ConfigurePrintSetting;
