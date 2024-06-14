import React, { useState, useEffect, useContext } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Spin } from "antd";

import { useSelector } from "react-redux";

import PrintSettingsContext from '../context/PrintSettingsContext';

import { NORMAL } from "../utils/constants";
import ViewCertificatePDF from '../components/print_settings/ViewCertificatePDF';
import { pdfjs, Document, Page } from "react-pdf";
const worker = require('pdfjs-dist/build/pdf.worker.min.js')
pdfjs.GlobalWorkerOptions.workerSrc = worker

function QuixoteCertificate({ mode = NORMAL, ...props }) {

    const { profile } = useSelector((state) => state.doctors);
    const { divWidth, certificateData, printSettings, fileHeader, fileFooter, fileLogo, fileWatermark, fileSignature } = useContext(PrintSettingsContext);

    const [pdfUrl, setPdfUrl] = useState(null)
    const [numPages, setNumPages] = useState();
    const [loadSuccess, setLoadSuccesss] = useState(false);

    useEffect(() => {
        const makePDFUrl = async () => {
            const blob = await pdf(<ViewCertificatePDF
                mode={mode}
                heading={certificateData?.title}
                content={certificateData?.content}
                doctorData={profile}
                printSettings={mode == NORMAL ? printSettings : props.printSettingsCopy}
                fileHeader={mode == NORMAL ? fileHeader : props.fileHeaderCopy}
                fileFooter={mode == NORMAL ? fileFooter : props.fileFooterCopy}
                fileLogo={mode == NORMAL ? fileLogo : props.fileLogoCopy}
                fileWatermark={fileWatermark}
                fileSignature={fileSignature}
            />).toBlob();
            setPdfUrl(URL.createObjectURL(blob))
        }
        certificateData && makePDFUrl()
        return () => {
            setLoadSuccesss(false)
        };
    }, [
        mode,
        props.printSettingsCopy,
        props.fileHeaderCopy,
        props.fileFooterCopy,
        props.fileLogoCopy,
        printSettings,
        fileHeader,
        fileFooter,
        fileSignature,
        fileWatermark,
        fileLogo
    ]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
        setLoadSuccesss(true)
    }

    return (
        <>
            {pdfUrl && (
                <Document
                    loading={<Spin style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%", height: '100%' }} />}
                    error={<div style={{ position: 'absolute', zIndex: 0, left: "42%", top: "50%" }} >{'Failed to load PDF file.'}</div>}
                    noData={<div style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%" }} >{'No PDF file specified.'}</div>}
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.apply(null, Array(numPages))
                        .map((x, i) => i + 1)
                        .map((page) => {
                            return (
                                <Page
                                    key={Math.random()}
                                    className={loadSuccess ? 'react-pdf__Page_afterload' : null}
                                    loading={null}
                                    width={divWidth}
                                    pageNumber={page}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            );
                        })}
                </Document>
            )}
        </>
    )
};

export default React.memo(QuixoteCertificate);