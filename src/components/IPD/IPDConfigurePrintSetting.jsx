import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useLocation } from "react-router-dom";
import { Col, Tabs, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import QRCode from "qrcode";
import config from "../../config";
import { useSelector, useDispatch } from "react-redux";

import { setDraftSettings, setFile } from "../../redux/ipd/printSettingsSlice";

import IPDHeaderPrintSetting from "./IPDHeaderPrintSetting";
import FormatStyleLayout from "./FormatStyleLayout";
import IPDHeaderFooterLayout from "./IPDHeaderFooterLayout";
import IPDPageFormatLayout from "./IPDPageFormatLayout";
import PDFGenerator from "../PDFGenerator/PDFGenerator";

import {
  TAB_FORMAT_STYLE,
  TAB_HEADER_FOOTER,
  TAB_PAGE_FORMAT,
  GB_IPD_DYNAMIC_DISCHARGE_HEADING,
} from "../../utils/constants";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";
import { getPatientInformation } from "../../utils/utils";
import usePrintPreviewSetup from "../../hooks/usePrintPreviewSetup";
import { sanitizePrintSettingsForPdf } from "../../utils/printSettings";
import useResolvedAssetUrl from "../../hooks/useResolvedAssetUrl";
import useTpmlReferenceId from "../../hooks/useTpmlReferenceId";

// Document type mapping for PDF generation
const DOCUMENT_TYPE_MAPPING = {
  assessments: "assessments",
  progressNotes: "progressNotes",
  consultationNotes: "consultationNotes",
  otNotes: "otNotes",
  crossReferral: "crossReferral",
  dischargeSummary: "dischargeSummary",
};

// Module title mapping
const MODULE_TITLE_MAPPING = {
  assessments: "Assessment Form",
  progressNotes: "Progress Notes",
  consultationNotes: "Consultant Notes",
  otNotes: "Operation Notes",
  crossReferral: "Cross Referral",
  dischargeSummary: "Discharge Summary",
};

function IPDConfigurePrintSetting({ moduleType, data }) {
  const divRef = useRef(null);
  const previewJobRef = useRef(0);
  const previewDebounceRef = useRef(null);
  const pdfUrlRef = useRef(null);
  const isIpdDynamicDischargeHeadingEnabled = useFeatureIsOn(
    GB_IPD_DYNAMIC_DISCHARGE_HEADING
  );
  const dispatch = useDispatch();
  const { draftSettings, fileStates, printSettings } = useSelector(
    (state) => state.printSettings
  );
  const { frequencyList, timingList } = useSelector((state) => state.doctors);

  const {
    returnPath,
    state: { patientDetails },
  } = useLocation();
  const patientUniqueId = patientDetails?.details?.id;
  const liveMrnNo = useTpmlReferenceId(patientUniqueId);

  const [divWidth, setDivWidth] = useState(0);
  const [selectedTab, setSelectedTab] = useState(TAB_FORMAT_STYLE);

  // Get file states from Redux for this module
  const moduleFileStates = fileStates[moduleType] || {};
  const fileFooter = moduleFileStates.fileFooter || null;

  // Helper function to update footer file in Redux
  const setFileFooter = useCallback(
    (fileData) => {
      if (typeof fileData === "function") {
        // Handle functional updates like setFileFooter((prev) => ({ ...prev, ...updates }))
        const currentFileFooter = fileStates[moduleType]?.fileFooter || {};
        const updatedData = fileData(currentFileFooter);
        dispatch(
          setFile({ moduleType, fileType: "fileFooter", fileData: updatedData })
        );
      } else {
        dispatch(setFile({ moduleType, fileType: "fileFooter", fileData }));
      }
    },
    [dispatch, moduleType, fileStates]
  );

  // Get the current module settings from draft settings (or fallback to saved settings)
  const getCurrentModuleSettings = useCallback(() => {
    if (!moduleType) return null;

    // Use draft settings if available, otherwise fallback to saved settings
    if (draftSettings[moduleType]) {
      return draftSettings[moduleType];
    }

    if (printSettings && printSettings[moduleType]) {
      return printSettings[moduleType];
    }

    return null;
  }, [moduleType, draftSettings, printSettings]);

  // Get document type for PDF generation
  const getDocumentType = () => {
    return DOCUMENT_TYPE_MAPPING[moduleType];
  };

  // Get module title
  const getModuleTitle = () => {
    return MODULE_TITLE_MAPPING[moduleType] || "Document";
  };

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  usePrintPreviewSetup();

  useEffect(() => {
    const initializePrintSettings = async () => {
      if (!moduleType) return;

      // Initialize draft settings with current saved settings for this module
      const moduleSettings = printSettings?.[moduleType];
      if (moduleSettings) {
        const copyPrintSettings = JSON.parse(
          JSON.stringify({
            ...moduleSettings,
            qrcode: await QRCode.toDataURL(
              `${config.doctor_website_url}${parseInt(
                printSettings?.um_contact,
                10
              ).toString(36)}_${printSettings?.hm_refer_code}`
            ),
          })
        );

        // Initialize draft settings for this module
        dispatch(
          setDraftSettings({
            moduleType,
            settings: copyPrintSettings,
          })
        );
      }

      // Initialize file states if they exist in settings
      if (moduleSettings?.logo_enable === "Y" && moduleSettings.logo_image) {
        dispatch(
          setFile({
            moduleType,
            fileType: "fileLogo",
            fileData: {
              imageShow: true,
              showFile: moduleSettings.logo_image,
            },
          })
        );
      }
      if (
        moduleSettings?.water_mark_enable === "Y" &&
        moduleSettings.water_mark_image
      ) {
        dispatch(
          setFile({
            moduleType,
            fileType: "fileWatermark",
            fileData: {
              imageShow: true,
              showFile: moduleSettings.water_mark_image,
            },
          })
        );
      }
      if (
        moduleSettings?.signature_enable === "Y" &&
        moduleSettings.signature_image
      ) {
        dispatch(
          setFile({
            moduleType,
            fileType: "fileSignature",
            fileData: {
              imageShow: true,
              showFile: moduleSettings.signature_image,
            },
          })
        );
      }
      if (moduleSettings?.header_image) {
        dispatch(
          setFile({
            moduleType,
            fileType: "fileHeader",
            fileData: {
              imageShow: true,
              showFile: moduleSettings.header_image,
            },
          })
        );
      }
      if (moduleSettings?.footer_image) {
        dispatch(
          setFile({
            moduleType,
            fileType: "fileFooter",
            fileData: {
              imageShow: true,
              showFile: moduleSettings.footer_image,
            },
          })
        );
        updateFooterImageHeight(
          { showFile: moduleSettings?.footer_image },
          true
        );
      }

      // setPrintSettings(copyPrintSettings);
    };

    initializePrintSettings();
  }, [printSettings, moduleType, dispatch]);

  const updateFooterImageHeight = useCallback(
    (footerFile, initialUpdate) => {
      const getImageDimensions = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;

          img.onload = () => {
            resolve({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          };

          img.onerror = (err) => reject(err);
        });
      };

      getImageDimensions(footerFile?.showFile)
        .then(({ height, width }) => {
          const widthOfA4PageInPts = 595;
          const PX_TO_PT = 0.75;
          const pageXPadding = PX_TO_PT * 60;
          const footerImgDimensions = {
            footerHeight: height || 0,
            footerWidth: width || 0,
            renderedFooterImageHeight:
              (height / width) * (widthOfA4PageInPts - pageXPadding) || 0,
          };
          if (initialUpdate) {
            setFileFooter({
              imageShow: true,
              showFile: footerFile?.showFile,
              ...footerImgDimensions,
            });
          } else {
            setFileFooter((prev) => ({ ...prev, ...footerImgDimensions }));
          }
        })
        .catch((err) => {
          console.error(err);
          if (initialUpdate) {
            setFileFooter({
              imageShow: true,
              showFile: footerFile?.showFile,
              footerHeight: 0,
              footerWidth: 0,
              renderedFooterImageHeight: 0,
            });
          }
        });
    },
    [setFileFooter]
  );

  useEffect(() => {
    if (!fileFooter?.showFile) return;
    // Only update if dimensions haven't been calculated yet
    if (!fileFooter.renderedFooterImageHeight) {
      updateFooterImageHeight(fileFooter);
    }
  }, [printSettings, fileFooter?.showFile, updateFooterImageHeight]);

  const onTabChange = useCallback(
    (key) => {
      setSelectedTab(key);
      // Only update footer height if fileFooter exists
      if (fileFooter?.showFile && !fileFooter.renderedFooterImageHeight) {
        updateFooterImageHeight(fileFooter);
      }
    },
    [fileFooter, updateFooterImageHeight]
  );

  const TabsPrintSetting = [
    {
      key: TAB_FORMAT_STYLE,
      label: getModuleTitle(),
    },
    {
      key: TAB_HEADER_FOOTER,
      label: "Header & Footer",
    },
    {
      key: TAB_PAGE_FORMAT,
      label: "Page Format",
    },
  ];

  const documentType = getDocumentType();

  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPreviewGenerating, setIsPreviewGenerating] = useState(false);

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }
  const currentSettings = getCurrentModuleSettings();
  const resolvedHeaderImg = useResolvedAssetUrl({
    moduleType,
    assetKey: "headerImg",
    assetValue: currentSettings?.headerFooter?.header?.headerImg,
    fileType: "fileHeader",
    settingsPath: ["headerFooter", "header", "headerImg"],
  });
  const resolvedFooterImg = useResolvedAssetUrl({
    moduleType,
    assetKey: "footerImg",
    assetValue: currentSettings?.headerFooter?.footer?.footerImg,
    fileType: "fileFooter",
    settingsPath: ["headerFooter", "footer", "footerImg"],
  });
  const footerReady =
    !resolvedFooterImg || fileFooter?.renderedFooterImageHeight != null;
  const resolvedLogo = useResolvedAssetUrl({
    moduleType,
    assetKey: "logo",
    assetValue: currentSettings?.headerFooter?.header?.logo,
    fileType: "fileLogo",
    settingsPath: ["headerFooter", "header", "logo"],
  });

  const settingsWithResolvedAssets = React.useMemo(() => {
    if (!currentSettings) return currentSettings;
    const next = JSON.parse(JSON.stringify(currentSettings));
    if (resolvedHeaderImg) {
      if (!next.headerFooter) next.headerFooter = {};
      if (!next.headerFooter.header) next.headerFooter.header = {};
      next.headerFooter.header.headerImg = resolvedHeaderImg;
    }
    if (resolvedFooterImg) {
      if (!next.headerFooter) next.headerFooter = {};
      if (!next.headerFooter.footer) next.headerFooter.footer = {};
      next.headerFooter.footer.footerImg = resolvedFooterImg;
    }
    if (resolvedLogo) {
      if (!next.headerFooter) next.headerFooter = {};
      if (!next.headerFooter.header) next.headerFooter.header = {};
      next.headerFooter.header.logo = resolvedLogo;
    }
    return next;
  }, [currentSettings, resolvedHeaderImg, resolvedFooterImg, resolvedLogo]);

  const settingsWithFooterDimensions = React.useMemo(() => {
    if (!settingsWithResolvedAssets) return settingsWithResolvedAssets;
    const renderedFooterImageHeight = fileFooter?.renderedFooterImageHeight;
    if (!renderedFooterImageHeight) return settingsWithResolvedAssets;
    const headerFooter = settingsWithResolvedAssets.headerFooter || {};
    const footerSettings = headerFooter.footer || {};
    if (!footerSettings.footerImg) return settingsWithResolvedAssets;
    return {
      ...settingsWithResolvedAssets,
      headerFooter: {
        ...headerFooter,
        footer: {
          ...footerSettings,
          renderedFooterImageHeight,
        },
      },
    };
  }, [
    settingsWithResolvedAssets,
    fileFooter?.renderedFooterImageHeight,
    fileFooter?.showFile,
  ]);
  const sanitizedSettingsWithFooterDimensions = React.useMemo(
    () => sanitizePrintSettingsForPdf(settingsWithFooterDimensions),
    [settingsWithFooterDimensions]
  );

  const makePDFUrl = useCallback(
    async (settings) => {
      if (!settings || !data) {
        return;
      }

      const jobId = ++previewJobRef.current;
      setIsPreviewGenerating(true);

      try {
        const baseInfo = getPatientInformation(patientDetails);
        const patientDataForPdf = liveMrnNo
          ? { ...baseInfo, mrnNo: liveMrnNo }
          : baseInfo;

        const blob = await pdf(
          <PDFGenerator
            settings={settings}
            data={data}
            documentType={documentType}
            patientData={patientDataForPdf}
            frequencyList={frequencyList}
            timingList={timingList}
            isIpdDynamicDischargeHeadingEnabled={
              documentType === "dischargeSummary" &&
              isIpdDynamicDischargeHeadingEnabled
            }
          />
        ).toBlob();

        if (jobId === previewJobRef.current) {
          const nextUrl = URL.createObjectURL(blob);

          if (pdfUrlRef.current) {
            URL.revokeObjectURL(pdfUrlRef.current);
          }

          pdfUrlRef.current = nextUrl;
          setPdfUrl(nextUrl);
        }
      } catch (error) {
        if (jobId === previewJobRef.current) {
          console.error("Error generating PDF:", error);
        }
      } finally {
        if (jobId === previewJobRef.current) {
          setIsPreviewGenerating(false);
        }
      }
    },
    [data, documentType, frequencyList, patientDetails, timingList, liveMrnNo, isIpdDynamicDischargeHeadingEnabled]
  );

  useEffect(() => {
    if (!sanitizedSettingsWithFooterDimensions) return;
    if (!footerReady) return;

    if (previewDebounceRef.current) {
      clearTimeout(previewDebounceRef.current);
    }

    previewDebounceRef.current = setTimeout(() => {
      previewDebounceRef.current = null;
      makePDFUrl(sanitizedSettingsWithFooterDimensions);
    }, 400);

    return () => {
      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
        previewDebounceRef.current = null;
      }
    };
  }, [sanitizedSettingsWithFooterDimensions, makePDFUrl, footerReady]);

  useEffect(() => {
    return () => {
      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
      }
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  return (
    <>
      <IPDHeaderPrintSetting
        printSettings={getCurrentModuleSettings()}
        moduleType={moduleType}
        moduleTitle={getModuleTitle()}
        returnPath={returnPath}
      />
      <div className={"w-100 bg-body wrapper2 over-flow-y-hidden"}>
        <Row justify="space-between">
          <Col xl={8} sm={10} className="pe-3">
            <div
              className="bg-white overflow-y-auto pb-4"
              style={{ height: "calc(100vh - 60px)" }}
            >
              <Tabs
                defaultActiveKey="1"
                items={TabsPrintSetting}
                onChange={onTabChange}
                className="print-tabs"
              />
              {selectedTab === TAB_FORMAT_STYLE && (
                <FormatStyleLayout
                  moduleType={moduleType}
                  formatSettings={getCurrentModuleSettings()?.formatStyle}
                />
              )}
              {selectedTab === TAB_HEADER_FOOTER && (
                <IPDHeaderFooterLayout
                  moduleType={moduleType}
                  updateFooterImageHeight={updateFooterImageHeight}
                />
              )}
              {selectedTab === TAB_PAGE_FORMAT && (
                <IPDPageFormatLayout moduleType={moduleType} />
              )}
            </div>
          </Col>
          <Col xl={16} sm={14} className="overflow-scroll-with-height">
            <div
              className="mx-auto overflow-y-auto"
              style={{ width: isMobile ? 580 : 900 }}
            >
              <div className="titleprint mt-20">Preview</div>
              <div className="rounded-20px bg-white mt-20 overflow-hidden">
                <div ref={divRef} className="printheight">
                  <div className="position-relative h-100">
                    {isPreviewGenerating && (
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                        style={{
                          backdropFilter: "blur(1px)",
                          backgroundColor: "rgba(255, 255, 255, 0.6)",
                          zIndex: 2,
                        }}
                      >
                        <Spin tip="Updating preview..." />
                      </div>
                    )}
                    <Document
                      loading={
                        <Spin
                          style={{
                            position: "absolute",
                            zIndex: 0,
                            left: "50%",
                            top: "50%",
                          }}
                          tip="Loading PDF..."
                        />
                      }
                      error={
                        <Spin
                          style={{
                            position: "absolute",
                            zIndex: 0,
                            left: "50%",
                            top: "50%",
                          }}
                          tip="Loading PDF..."
                        />
                      }
                      noData={
                        <Spin
                          style={{
                            position: "absolute",
                            zIndex: 0,
                            left: "50%",
                            top: "50%",
                          }}
                          tip="Loading PDF..."
                        />
                      }
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      {Array.apply(null, Array(numPages))
                        .map((x, i) => i + 1)
                        .map((page) => {
                          return (
                            <Page
                              key={Math.random()}
                              className={
                                printBlob ? "react-pdf__Page_afterload" : null
                              }
                              loading={null}
                              width={divWidth}
                              pageNumber={page}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          );
                        })}
                    </Document>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default IPDConfigurePrintSetting;
