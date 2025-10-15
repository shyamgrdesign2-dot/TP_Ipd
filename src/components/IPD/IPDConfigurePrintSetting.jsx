import React, { useState, useEffect, useCallback, useRef } from "react";
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
} from "../../utils/constants";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";

// Document type mapping for PDF generation
const DOCUMENT_TYPE_MAPPING = {
  assessments: "assessment",
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

function IPDConfigurePrintSetting({ printSettings, moduleType, data }) {
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const { draftSettings, fileStates } = useSelector(
    (state) => state.printSettings
  );

  const { returnPath } = useLocation();

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
    return DOCUMENT_TYPE_MAPPING[moduleType] || "dischargeSummary";
  };

  // Get module title
  const getModuleTitle = () => {
    return MODULE_TITLE_MAPPING[moduleType] || "Document";
  };

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

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

  const updateFooterImageHeight = (footerFile, initialUpdate) => {
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
  };

  useEffect(() => {
    if (!fileFooter?.showFile) return;
    updateFooterImageHeight(fileFooter);
  }, [printSettings, fileFooter]);

  const onTabChange = useCallback((key) => {
    setSelectedTab(key);
    updateFooterImageHeight();
  }, []);

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

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }

  const makePDFUrl = useCallback(async () => {
    try {
      const currentSettings = getCurrentModuleSettings();
      if (!currentSettings || !data) return;

      const blob = await pdf(
        <PDFGenerator
          settings={currentSettings}
          data={data}
          documentType={documentType}
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, [data, documentType, getCurrentModuleSettings]);

  useEffect(() => {
    makePDFUrl();
  }, [makePDFUrl]);

  return (
    <>
      <IPDHeaderPrintSetting
        printSettings={getCurrentModuleSettings()}
        moduleType={moduleType}
        moduleTitle={getModuleTitle()}
        returnPath={returnPath}
      />
      <div className={"w-100 bg-body wrapper2"}>
        <Row justify="space-between">
          <Col xl={8} sm={10} className="pe-3">
            <div
              className="bg-white overflow-y-auto"
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
          <Col xl={16} sm={14}>
            <div
              className="mx-auto overflow-y-auto"
              style={{ width: isMobile ? 580 : 900 }}
            >
              <div className="titleprint mt-20">Preview</div>
              <div className="rounded-20px bg-white mt-20 overflow-hidden">
                <div ref={divRef} className="printheight">
                  <div className="position-relative h-100">
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
