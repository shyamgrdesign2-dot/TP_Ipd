import React, { useState, useEffect, useCallback } from "react";
import { Col, Tabs, Row } from "antd";
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from "react-redux";

import PrintSettingsContext from '../context/PrintSettingsContext';

import HeaderPrintSetting from "../common/HeaderPrintSetting";
import PrintHtmlPage from "../components/print_settings/PrintHtmlPage";

import { TAB_PRESCRIPTION, TAB_HEADER_FOOTER, TAB_PAGE_FORMAT } from "../utils/constants";

import PrescriptionLayout from "../components/print_settings/PrescriptionLayout";
import HeaderFooterLayout from "../components/print_settings/HeaderFooterLayout";
import PageFormatLayout from "../components/print_settings/PageFormatLayout";

import "cropperjs/dist/cropper.css";
import Quixote from "./Quixote";

function ConfigurePrintSetting() {

    const printRef = React.useRef();

    const { defaultPrintSettings } = useSelector((state) => state.doctors);

    const [selectedTab, setSelectedTab] = useState(TAB_PRESCRIPTION);
    const [printSettings, setPrintSettings] = useState(null);
    const [fileHeader, setFileHeader] = useState(null);
    const [fileFooter, setFileFooter] = useState(null);
    const [fileLogo, setFileLogo] = useState(null);
    const [fileWatermark, setFileWatermark] = useState(null);
    const [fileSignature, setFileSignature] = useState(null);

    const contextApi = { printSettings, setPrintSettings, fileHeader, setFileHeader, fileFooter, setFileFooter, fileLogo, setFileLogo, fileWatermark, setFileWatermark, fileSignature, setFileSignature };

    const TabsPrintSetting = [
        {
            key: TAB_PRESCRIPTION,
            label: 'Prescription'
        },
        {
            key: TAB_HEADER_FOOTER,
            label: 'Header & Footer'
        },
        {
            key: TAB_PAGE_FORMAT,
            label: 'Page Format'
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

    return (
        <PrintSettingsContext.Provider value={contextApi}>
            <>
                <HeaderPrintSetting />
                {/* <style scoped>{css}</style> */}
                <div className={'w-100 bg-body wrapper2'}>
                    <Row justify="space-between">
                        <Col lg={8} className="pe-4">
                            <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                                <Tabs defaultActiveKey="1" items={TabsPrintSetting} onChange={onTabChange} className="print-tabs" />
                                {selectedTab === TAB_PRESCRIPTION ? (
                                    <PrescriptionLayout />
                                ) : selectedTab === TAB_HEADER_FOOTER ? (
                                    <HeaderFooterLayout />
                                ) : selectedTab === TAB_PAGE_FORMAT && (
                                    <PageFormatLayout />
                                )}
                            </div>
                        </Col>
                        <Col lg={16} className="overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <div className="mx-auto overflow-y-auto" style={{ width: 900 }}>
                                <div className="titleprint mt-20" onClick={() => printContent()}>Preview</div>
                                <div className="border rounded-20px bg-white mt-20 overflow-hidden h-100">
                                    <div key={Math.random()} ref={printRef} style={{ padding: 20 }} className="h-100">
                                        {/* <PrintHtmlPage />\ */}
                                        <Quixote />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        </PrintSettingsContext.Provider>
    );
}

export default ConfigurePrintSetting;