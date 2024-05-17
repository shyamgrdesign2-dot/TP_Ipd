import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Col, Tabs, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { isMobile } from "react-device-detect";
import QRCode from 'qrcode'
import config from '../config';

import PrintSettingsContext from '../context/PrintSettingsContext';

import HeaderPrintSetting from "../common/HeaderPrintSetting";
import Quixote from "./Quixote";

import { TAB_PRESCRIPTION, TAB_HEADER_FOOTER, TAB_PAGE_FORMAT, NORMAL } from "../utils/constants";

import PrescriptionLayout from "../components/print_settings/PrescriptionLayout";
import HeaderFooterLayout from "../components/print_settings/HeaderFooterLayout";
import PageFormatLayout from "../components/print_settings/PageFormatLayout";

import "cropperjs/dist/cropper.css";

function ConfigurePrintSetting() {

    const divRef = useRef(null);

    const { defaultPrintSettings } = useSelector((state) => state.doctors);

    const { state } = useLocation();
    const { caseManagerData } = state

    const [divWidth, setDivWidth] = useState(0);
    const [selectedTab, setSelectedTab] = useState(TAB_PRESCRIPTION);
    const [printSettings, setPrintSettings] = useState(null);
    const [fileHeader, setFileHeader] = useState(null);
    const [fileFooter, setFileFooter] = useState(null);
    const [fileLogo, setFileLogo] = useState(null);
    const [fileWatermark, setFileWatermark] = useState(null);
    const [fileSignature, setFileSignature] = useState(null);

    useEffect(() => {
        setDivWidth(divRef.current?.offsetWidth);
    }, [divRef]);

    const contextApi = { divWidth, caseManagerData, printSettings, setPrintSettings, fileHeader, setFileHeader, fileFooter, setFileFooter, fileLogo, setFileLogo, fileWatermark, setFileWatermark, fileSignature, setFileSignature };

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


    useEffect(() => {
        const makeData = async () => {
            const copyPrintSettings = JSON.parse(JSON.stringify({
                ...defaultPrintSettings,
                qrcode: await QRCode.toDataURL(`${config.doctor_website_url}${parseInt(defaultPrintSettings?.um_contact, 10).toString(36)}_${defaultPrintSettings?.hm_refer_code}`)
            }))
            setPrintSettings(copyPrintSettings);
            copyPrintSettings?.logo_enable == 'Y' && copyPrintSettings.logo_image && setFileLogo({ imageShow: true, showFile: copyPrintSettings.logo_image });
            copyPrintSettings?.header_image && setFileHeader({ imageShow: true, showFile: copyPrintSettings.header_image });
            copyPrintSettings?.footer_image && setFileFooter({ imageShow: true, showFile: copyPrintSettings.footer_image });
            copyPrintSettings?.water_mark_enable == 'Y' && copyPrintSettings.water_mark_image && setFileWatermark({ imageShow: true, showFile: copyPrintSettings.water_mark_image });
            copyPrintSettings?.signature_enable == 'Y' && copyPrintSettings.signature_image && setFileSignature({ imageShow: true, showFile: copyPrintSettings.signature_image });
        }
        makeData()
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
            {console.log(caseManagerData)}
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
                        <Col xl={16} lg={14}>
                            <div className="mx-auto overflow-y-auto " style={{ width: isMobile ? 580 : 900 }} >
                                <div className="titleprint mt-20">Preview</div>
                                <div ref={divRef} className="rounded-20px bg-white mt-20 overflow-hidden">
                                    <div className="position-relative printheight">
                                        <Quixote mode={NORMAL} />
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