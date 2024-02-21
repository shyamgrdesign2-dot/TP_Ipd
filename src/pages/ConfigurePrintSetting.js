import React from "react";
import { Col, Row, Tabs } from "antd";
import { isMobile } from "react-device-detect";
import HeaderPrintSetting from "../common/HeaderPrintSetting";

function ConfigurePrintSetting() {    
    const onChange = (key) => {
        console.log(key);
    };
    const TabsPrintSetting = [
        {
            key: '1',
            label: 'Prescription',
            children: 'Content of Tab Pane 1',
          },
          {
            key: '2',
            label: 'Header & Footer',
            children: 'Content of Tab Pane 2',
          },
          {
            key: '3',
            label: 'Page Format',
            children: 'Content of Tab Pane 3',
          },
    ];

    return (
        <>
            <HeaderPrintSetting />
            <div className={`${isMobile ? 'p-0' : ''} w-100 bg-body wrapper2`}>
                <Row gutter={{ xl: 40, lg: 0 }} justify="center">
                    <Col md={7} lg={7} xl={5}>
                        <Tabs defaultActiveKey="1" items={TabsPrintSetting} onChange={onChange} />
                    </Col>
                    <Col md={17} lg={17} xl={12}>
                        <div className={isMobile ? 'p-20' : ''}>
                            <div className="border rounded-20px bg-white mt-20 overflow-hidden">
                                Lorem
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default ConfigurePrintSetting;
