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
import QuixoteCertificate from "./QuixoteCertificate";

import { TAB_PRESCRIPTION, TAB_HEADER_FOOTER, TAB_PAGE_FORMAT, NORMAL } from "../utils/constants";

import PrescriptionLayout from "../components/print_settings/PrescriptionLayout";
import HeaderFooterLayout from "../components/print_settings/HeaderFooterLayout";
import PageFormatLayout from "../components/print_settings/PageFormatLayout";

import "cropperjs/dist/cropper.css";
import { useTodayVaccines } from "./vaccination/useTodayVaccines";
import { useGrowthChart } from "./growthChart/useGrowthChart";
import useObstetric from "./obstetric/useObstetric";
import { getModules } from "../redux/customModuleSlice";
import moment from "moment";
import { fetchBillsByPatient, fetchPatientWalletBalance, listAdvancedDepositByPatient } from "./opdBilling/service";
import { getCarePlanAssignments } from "./smartSync/services/carePlanService";

function ConfigurePrintSetting() {

    const divRef = useRef(null);

    const { defaultPrintSettings, userId } = useSelector((state) => state.doctors);

    const { state } = useLocation();
    const { caseManagerData, certificateData, smartRxFile, pam_id } = state;

    const [divWidth, setDivWidth] = useState(0);
    const [selectedTab, setSelectedTab] = useState(caseManagerData !== undefined ? TAB_PRESCRIPTION : TAB_HEADER_FOOTER);
    const [printSettings, setPrintSettings] = useState(null);
    const [fileHeader, setFileHeader] = useState(null);
    const [fileFooter, setFileFooter] = useState(null);
    const [fileLogo, setFileLogo] = useState(null);
    const [fileWatermark, setFileWatermark] = useState(null);
    const [fileSignature, setFileSignature] = useState(null);
    const todayVaccines = useTodayVaccines(caseManagerData);
    const growthChartDetails = useGrowthChart(caseManagerData);
    const obstetricDetails = useObstetric(caseManagerData?.patient_data?.patient_unique_id, caseManagerData?.doctor_Data?.um_id);
    const medicalHistoryCheckboxOptions = caseManagerData?.medical_history?.map(e => {
        return { label: e?.title, value: e?.tmmhs_id }
    })
    const [patientBills, setPatientBills] = useState([]);
    const [advanceReceipts, setAdvanceReceipts] = useState([]);
    const [patientWalletBalance, setPatientWalletBalance] = useState(0);
    const [carePlanAssignments, setCarePlanAssignments] = useState([]);

    const {customModules} = useSelector((state) => state.customModules);
    const dispatch = useDispatch();

    // Extract lab params data that was passed from PrescriptionPrintView
    const labParamsData = caseManagerData?.labParamsData || [];
    const zydusSelectedLabParams = caseManagerData?.zydusSelectedLabParams || [];


    useEffect(() => {
        setDivWidth(divRef.current?.offsetWidth);
    }, [divRef]);

    useEffect(() => {
        growthChartDetails.getGrowthChartDetails();
        getPatientBills();
    }, []);

    // Fetch care plan assignments for PDF rendering (used by Quixote/ViewPDF)
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const patientId = caseManagerData?.patient_data?.patient_unique_id;
                if (!patientId) return;
                const resp = await getCarePlanAssignments(patientId);
                const list = Array.isArray(resp)
                    ? resp
                    : Array.isArray(resp?.data)
                        ? resp.data
                        : Array.isArray(resp?.data?.data)
                            ? resp.data.data
                            : Array.isArray(resp?.data?.assignments)
                                ? resp.data.assignments
                                : Array.isArray(resp?.assignments)
                                    ? resp.assignments
                                    : Array.isArray(resp?.body)
                                        ? resp.body
                                        : [];
                setCarePlanAssignments(list);
            } catch (e) {
                setCarePlanAssignments([]);
            }
        };
        fetchAssignments();
    }, [caseManagerData?.patient_data?.patient_unique_id]);

    useEffect(() => {
        dispatch(getModules(userId));
      }, [userId]);

    const contextApi = { smartRxFile, divWidth, caseManagerData, certificateData, printSettings, setPrintSettings, fileHeader, setFileHeader, fileFooter, setFileFooter, fileLogo, setFileLogo, fileWatermark, setFileWatermark, fileSignature, setFileSignature, medicalHistoryCheckboxOptions, labParamsData, zydusSelectedLabParams, customModules, carePlanAssignments };

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

    const getImageDimensions = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
      
          img.onload = () => {
            resolve({
              width: img.naturalWidth,
              height: img.naturalHeight
            });
          };
      
          img.onerror = (err) => reject(err);
        });
    }

    useEffect(() => {
        const makeData = async () => {
            const copyPrintSettings = JSON.parse(JSON.stringify({
                ...defaultPrintSettings,
                qrcode: await QRCode.toDataURL(`${config.doctor_website_url}${parseInt(defaultPrintSettings?.um_contact, 10).toString(36)}_${defaultPrintSettings?.hm_refer_code}`)
            }))
            
            // Add Case Option ID 18 for Zydus Lab Results if it doesn't exist and we have Zydus data
            if (zydusSelectedLabParams?.length > 0 && copyPrintSettings?.prescription?.case_option) {
                const hasZydusOption = copyPrintSettings.prescription.case_option.find(option => option.id === 18);
                if (!hasZydusOption) {
                    // Find Lab Results (ID 15) position to insert Zydus Lab Results (ID 18) after it
                    const labResultsIndex = copyPrintSettings.prescription.case_option.findIndex(option => option.id === 15);
                    const insertIndex = labResultsIndex !== -1 ? labResultsIndex + 1 : copyPrintSettings.prescription.case_option.length;
                    
                    // Add Zydus Lab Results option
                    copyPrintSettings.prescription.case_option.splice(insertIndex, 0, {
                        id: 18,
                        title: "Zydus Lab Results",
                        format: "inline",
                        enable: "Y",
                        custom_status: "Y"
                    });
                }
            }

            setPrintSettings(copyPrintSettings);
            copyPrintSettings?.logo_enable == 'Y' && copyPrintSettings.logo_image && setFileLogo({ imageShow: true, showFile: copyPrintSettings.logo_image });
            copyPrintSettings?.water_mark_enable == 'Y' && copyPrintSettings.water_mark_image && setFileWatermark({ imageShow: true, showFile: copyPrintSettings.water_mark_image });
            copyPrintSettings?.signature_enable == 'Y' && copyPrintSettings.signature_image && setFileSignature({ imageShow: true, showFile: copyPrintSettings.signature_image });
            copyPrintSettings?.header_image && setFileHeader({ imageShow: true, showFile: copyPrintSettings.header_image });
            if (copyPrintSettings?.footer_image) {
                updateFooterImageHeight({showFile: copyPrintSettings?.footer_image}, true);
            }
        }
        makeData()
    }, [defaultPrintSettings]);

    const updateFooterImageHeight = (footerFile, initialUpdate) => {
        getImageDimensions(footerFile?.showFile)
            .then(({height, width}) => {
            const widthOfA4PageInPts = 595;
            const PX_TO_PT = 0.75;
            const pageXPadding = PX_TO_PT * 60;
            const footerImgDimensions = {
                footerHeight: height || 0,
                footerWidth: width || 0,
                renderedFooterImageHeight: ((height/ width) * (widthOfA4PageInPts - pageXPadding)) || 0
            }
            if (initialUpdate) {
                setFileFooter({imageShow: true, showFile: footerFile?.showFile, ...footerImgDimensions});
            } else {
                setFileFooter(prev =>  ({ ...prev, ...footerImgDimensions }));
            }
        })
        .catch((err) => {
            console.error(err);
            if (initialUpdate) {
                setFileFooter({ imageShow: true, showFile: footerFile?.showFile, footerHeight: 0, footerWidth: 0, renderedFooterImageHeight: 0 });
            }
        });
    }

    useEffect(() => {
        if (!fileFooter?.showFile) return;
        updateFooterImageHeight(fileFooter);
    }, [printSettings, fileFooter?.showFile])

    const onTabChange = useCallback(
        (key) => {
            setSelectedTab(key);
            updateFooterImageHeight();
        },
        [selectedTab]
    );

    const getPatientBills = async () => {
        const queryParams = {
          doctorIds: [userId],
          sortBy: "date",
          sortOrder: "asc",
          page: 1,
          limit: 25,
          startDate: moment().format("YYYY-MM-DD"),
          endDate: moment().format("YYYY-MM-DD"),
          patientId: caseManagerData?.patient_data?.patient_unique_id,
          appointmentId: pam_id || caseManagerData?.patient_data?.pam_id,
          includeInRx: true,
        };
        const response = await fetchBillsByPatient(queryParams);
        if (response?.bills?.length > 0) {
            setPatientBills(response?.bills);
        }
        const patientAdvanceDeposit = await listAdvancedDepositByPatient({
          ...queryParams,
          status: ["Deposit", "Refund"],
        });
        if (patientAdvanceDeposit?.receipts?.length > 0) {
          setAdvanceReceipts(patientAdvanceDeposit?.receipts);
        }
        const patientWalletBalanceRes = await fetchPatientWalletBalance(
            caseManagerData?.patient_data?.patient_unique_id
        );
        setPatientWalletBalance(patientWalletBalanceRes?.advanceDepositBalance);
    };
    return (
        <PrintSettingsContext.Provider value={contextApi}>
            <>
                <HeaderPrintSetting defaultPrintSettings={defaultPrintSettings} />
                {/* <style scoped>{css}</style> */}
                <div className={'w-100 bg-body wrapper2'}>
                    <Row justify="space-between">
                        <Col xl={8} sm={10} className="pe-3">
                            <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                                <Tabs defaultActiveKey="1" items={caseManagerData !== undefined ? TabsPrintSetting : TabsPrintSetting.slice(1, 2)} onChange={onTabChange} className="print-tabs" />
                                {selectedTab === TAB_PRESCRIPTION ? (
                                    <PrescriptionLayout updateFooterImageHeight={updateFooterImageHeight} todayVaccines={todayVaccines} growthChartDetails={growthChartDetails} obstetricDetails={obstetricDetails} patientBills={[...patientBills, ...advanceReceipts]} />
                                ) : selectedTab === TAB_HEADER_FOOTER ? (
                                    <HeaderFooterLayout updateFooterImageHeight={updateFooterImageHeight} todayVaccines={todayVaccines} growthChartDetails={growthChartDetails} obstetricDetails={obstetricDetails} patientBills={patientBills} advanceReceipts={advanceReceipts} patientWalletBalance={patientWalletBalance} />
                                ) : selectedTab === TAB_PAGE_FORMAT && (
                                    <PageFormatLayout updateFooterImageHeight={updateFooterImageHeight} />
                                )}
                            </div>
                        </Col>
                        <Col xl={16} sm={14}>
                            <div className="mx-auto overflow-y-auto " style={{ width: isMobile ? 580 : 900 }} >
                                <div className="titleprint mt-20">Preview</div>
                                <div ref={divRef} className="rounded-20px bg-white mt-20 overflow-hidden">
                                    <div className="position-relative printheight">
                                        {caseManagerData !== undefined ? <Quixote mode={NORMAL} todayVaccines={todayVaccines} growthChartDetails={growthChartDetails} obstetricDetails={obstetricDetails} patientBills={patientBills} advanceReceipts={advanceReceipts} patientWalletBalance={patientWalletBalance} /> : <QuixoteCertificate mode={NORMAL} />}
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