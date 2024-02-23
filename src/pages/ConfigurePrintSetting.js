import React from "react";
import { Col, Flex, Tabs } from "antd";
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
                <Flex justify="space-between">
                    <Col flex={1} className="me-4">
                        <div className="bg-white overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
                            <Tabs defaultActiveKey="1" items={TabsPrintSetting} onChange={onChange} />
                        </div>
                    </Col>
                    <Col flex={8} className="overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
                        <div className="mx-auto overflow-y-auto" style={{width: 1240}}>
                            <div className="titleprint mt-20" onClick={() => printContent()}>Preview</div>
                            <div className="border rounded-20px bg-white mt-20 overflow-hidden h-100">
                                <div key={Math.random()} ref={printRef} style={{padding: 20}} className="h-100">
                                    <PrintHtmlPage />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Flex>
            </div>
        </>
    );
}

export default ConfigurePrintSetting;
