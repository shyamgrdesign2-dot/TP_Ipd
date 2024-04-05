import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Col, Tabs, Row, Spin } from "antd";
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from "react-redux";
import { isMobile } from "react-device-detect";

import PrintSettingsContext from '../context/PrintSettingsContext';

import HeaderPrintSetting from "../common/HeaderPrintSetting";
import Quixote from "./Quixote";

import { TAB_PRESCRIPTION, TAB_HEADER_FOOTER, TAB_PAGE_FORMAT, NORMAL } from "../utils/constants";

import PrescriptionLayout from "../components/print_settings/PrescriptionLayout";
import HeaderFooterLayout from "../components/print_settings/HeaderFooterLayout";
import PageFormatLayout from "../components/print_settings/PageFormatLayout";

import "cropperjs/dist/cropper.css";

function ConfigurePrintSetting() {

    const printRef = useRef();

    const { defaultPrintSettings, configurePrintData } = useSelector((state) => state.doctors);

    const [selectedTab, setSelectedTab] = useState(TAB_PRESCRIPTION);
    const [printSettings, setPrintSettings] = useState(null);
    const [fileHeader, setFileHeader] = useState(null);
    const [fileFooter, setFileFooter] = useState(null);
    const [fileLogo, setFileLogo] = useState(null);
    const [fileWatermark, setFileWatermark] = useState(null);
    const [fileSignature, setFileSignature] = useState(null);

    const contextApi = { configurePrintData, printSettings, setPrintSettings, fileHeader, setFileHeader, fileFooter, setFileFooter, fileLogo, setFileLogo, fileWatermark, setFileWatermark, fileSignature, setFileSignature };

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

    useEffect(() => {
        const copyPrintSettings = JSON.parse(JSON.stringify(defaultPrintSettings))
        setPrintSettings(copyPrintSettings);
        copyPrintSettings?.logo_enable == 'Y' && setFileLogo({ imageShow: true, showFile: copyPrintSettings.logo_image });
        copyPrintSettings?.header_image && setFileHeader({ imageShow: true, showFile: copyPrintSettings.header_image });
        copyPrintSettings?.footer_image && setFileFooter({ imageShow: true, showFile: copyPrintSettings.footer_image });
        copyPrintSettings?.water_mark_enable == 'Y' && setFileWatermark({ imageShow: true, showFile: copyPrintSettings.water_mark_image });
        copyPrintSettings?.signature_enable == 'Y' && setFileSignature({ imageShow: true, showFile: copyPrintSettings.signature_image });
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
                <HeaderPrintSetting defaultPrintSettings={defaultPrintSettings} />
                {/* <style scoped>{css}</style> */}
                <div className={'w-100 bg-body wrapper2'}>
                    <Row justify="space-between">
                        <Col xl={8} lg={10} className="pe-3">
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
                        <Col xl={16} lg={14} className="overflow-y-auto pdfMobile-Class">
                            <div className="mx-auto overflow-y-auto">
                                <div className="titleprint mt-20" onClick={() => printContent()}>Preview</div>
                                <div className="border rounded-20px bg-body mt-20 overflow-y-auto" style={{ height: 'calc(100vh - 136px)' }}>
                                    {isMobile && (<Spin style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%" }} />)}
                                    <Quixote mode={NORMAL} />
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