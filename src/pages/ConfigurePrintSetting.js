import React from "react";
import { Col, Flex, Tabs, Radio, Row, Form, Select } from "antd";
import HeaderPrintSetting from "../common/HeaderPrintSetting";
import { useReactToPrint } from 'react-to-print';
import PrintHtmlPage from "./PrintHtmlPage";

function ConfigurePrintSetting() {
    const printRef = React.useRef();
    const onChange = (key) => {
        console.log(key);
    };
    const TabsPrintSetting = [
        {
            key: '1',
            label: 'Prescription',
            children:
                <div className="px-2">
                    <div className="title-common mb-3">Format Style</div>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            All Change to
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Symptoms</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Examinations</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Diagnosis</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Medications (Rx)</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Advices</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Lab Investigation</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Medical History</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview me-2"></i>
                                <span>Lab Results</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                        <Col lg="10">
                            <div className="d-flex align-items-center">
                                <i className="icon-Preview disable-preview me-2"></i>
                                <span>Vaccination</span>
                            </div>
                        </Col>
                        <Col lg="14">
                            <Form.Item className="mb-0">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>,
        },
        {
            key: '2',
            label: 'Header & Footer',
            children: 'Content of Tab Pane 2',
        },
        {
            key: '3',
            label: 'Page Format',
            children: <div className="px-2 form_addnewpatient">
                <div className="title-common mb-3">Page Layout</div>
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

    // const css = `@page {
    //     size: A4 landscape;
    //   }
    //   table {
    //     page-break-inside: avoid;
    //   }

    //   @media print {

    //   }`;

    const printContent = useReactToPrint({
        content: () => printRef.current,
    });
    return (
        <>
            <HeaderPrintSetting />
            {/* <style scoped>{css}</style> */}
            <div className={'w-100 bg-body wrapper2'}>
                <Row justify="space-between">
                    <Col lg={8} className="pe-4">
                        <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <Tabs defaultActiveKey="1" items={TabsPrintSetting} onChange={onChange} />
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
