import React, { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Col, Row, Select, Button, message, Spin, Input } from "antd";
import { isMobile, browserName, osName } from "react-device-detect";
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';

import { inputToLabel, HTMLTransformer, removeLabelTags, errorMessage, removeBeforeWhiteSpace, sendMessageToParent } from "../utils/utils";

import { MESSAGE_KEY } from "../utils/constants";

import visitEnd from '../assets/images/end-visit.svg';
import imgCloseVisit from '../assets/images/close-visit.svg';

import HeaderCertificatePrint from "../common/HeaderCertificatePrint";

import { useSelector, useDispatch } from "react-redux";

import { addCertificate, viewPatientCertificate } from "../redux/doctorsSlice";
import { EVENTS } from "../utils/events";
import { printBlobInNewTab } from "./opdBilling/utils/helper";
import { pdfjs, Document, Page } from "react-pdf";
const worker = require('pdfjs-dist/build/pdf.worker.min.js')
pdfjs.GlobalWorkerOptions.workerSrc = worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.min.js",
//     import.meta.url
// ).toString();

function CertificatePrintView() {

    const divRef = useRef(null);

    const {
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { state } = useLocation();
    const { patient_data, tcu_content_id, pms_default, tcu_title, tcu_content, viewable } = state

    const [printUrl, setPrintUrl] = useState(state !== undefined ? `${state.certificate}` : null);

    const [title, setTitle] = useState('');
    const [divWidth, setDivWidth] = useState(0);
    const [numPages, setNumPages] = useState();
    const [printBlob, setPrintBlob] = useState(null);
    const [addEditFlag, setAddEditFlag] = useState(false);

    useEffect(() => {
        setDivWidth(divRef.current?.offsetWidth);
    }, [divRef]);

    async function onDocumentLoadSuccess(successEvent) {
        setNumPages(successEvent?.numPages);
        const data = await successEvent.getData()
        const blob = new Blob([data], { type: 'application/pdf' })
        setPrintBlob(blob)
    }

    useEffect(() => {
        if (tcu_title !== undefined) {
            tcu_content_id && !pms_default ? setTitle(tcu_title) : setTitle(`${tcu_title} ${Math.floor(Math.random() * 90) + 10}`)
        }
    }, [tcu_title]);

    const onTitleChange = useCallback((e) => {
        setTitle(removeBeforeWhiteSpace(e.target.value));
    }, [title]);

    const onAddEditCertificateClick = async () => {
        var sendData = {
            id: tcu_content_id,
            pms_default: pms_default,
            title: title,
            content: removeLabelTags(HTMLTransformer(inputToLabel(tcu_content)))
        }

        const action = await dispatch(addCertificate(sendData))
        if (action.meta.requestStatus === "fulfilled") {
            setAddEditFlag(true)
            message.open({
                key: MESSAGE_KEY,
                type: '',
                className: 'message-appointment',
                content: (
                    <div className='d-flex align-items-center'>
                        <img src={visitEnd} className='me-3' />
                        <div>
                            <div className='title-common text-start fontroboto'>{`Template ${tcu_content_id && !pms_default ? 'Updated' : 'Saved'} successfully`}</div>
                        </div>
                        <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
                    </div>
                ),
                duration: 5,
            });
        } else {
            errorMessage(action.error)
        }
    }

    const printContent = async () => {
        if (isMobile || osName == 'Linux') {
            printBlobInNewTab(printBlob);
        } else {
            if (!printBlob) return;
            var blobURL = URL.createObjectURL(printBlob);
            // Remove all existing iframes
            document.querySelectorAll('iframe').forEach(function (iframe) {
                iframe.parentNode.removeChild(iframe);
            });
            var iframe = document.createElement('iframe'); //load content in an iframe to print later
            document.body.appendChild(iframe);
            iframe.style.display = 'none';
            iframe.src = blobURL;
            iframe.onload = function () {
                setTimeout(function () {
                    iframe.focus();
                    iframe.contentWindow.print();
                    // Revoke the Blob URL to avoid memory leaks
                    URL.revokeObjectURL(blobURL);
                }, 1);
            };
        }
    };

    const printInAppContent = async () => {
        sendMessageToParent(EVENTS.PRINT, { url: printUrl });
        // navigate(`/certificate_print_view/?url=${printUrl}&key=print`, { replace: true, state: state })
        // navigate(0, { replace: true });
    };

    const handleDownload = async () => {
        try {
            const response = await axios({
                url: printUrl,
                method: 'GET',
                responseType: 'blob', // Important for binary data
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            saveAs(blob, `${Date.now()}.pdf`);
        } catch (error) {
            console.error('Error downloading file:', error);
            // Handle errors gracefully, e.g., display an error message to the user
        }
    };

    const handleInAppDownload = async () => {
        // navigate(`/certificate_print_view/?url=${printUrl}&key=download`, { replace: true, state: state })
        // navigate(0, { replace: true });
        sendMessageToParent(EVENTS.DOWNLOAD, { url: printUrl });
    };

    const onEditCertificateClick = async () => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcu_id: state.tcu_id
        }
        const action = await dispatch(viewPatientCertificate(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate("/certificate", { replace: true, state: { patient_data: patient_data, certificate_data: action.payload } })
        } else {
            errorMessage(action.error)
        }
    };

    const configurePrintUrl = async () => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcu_id: state.tcu_id,
            configurePrintSetting: true
        }
        const action = await dispatch(viewPatientCertificate(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/configure_print_setting', { state: { ...state, certificateData: action.payload } })
        } else {
            errorMessage(action.error)
        }
    }

    return (
        <>
            <HeaderCertificatePrint state={state} viewable={viewable} />
            <div className={`${isMobile ? 'p-0' : ''} w-100 bg-body wrapper2 prescription-wrapper`}>
                {/* <img src={hey} alt="Hey" className='me-3 hey' /> */}
                <Row gutter={{ xl: 40, lg: 0 }} justify="center">
                    <Col md={7} sm={7} xl={5}>

                        {(viewable !== undefined || isMobile) ? <div className="d-flex align-items-center justify-content-end h-38" /> : <div className="d-flex align-items-center justify-content-end h-38" onClick={configurePrintUrl}>
                            <i className="icon-setting me-2"></i>
                            <span className="text-decoration-underline fw-medium cursor-pointer"> Configure Print Setting </span>
                        </div>
                        }
                        <div className={`${!isMobile ? 'rounded-20px mt-20' : 'border-top-0 border-start-0 border-bottom-0'} border p-20 bg-white`}
                            style={{ height: !isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 60px)' }}>
                            <div>
                                {(viewable !== undefined || !isMobile) ? '' : <div className="d-flex align-items-center mb-14 h-38" onClick={configurePrintUrl}>
                                    <i className="icon-setting me-2"></i>
                                    <span className="text-decoration-underline fw-medium cursor-pointer"> Configure Print Setting </span>
                                </div>
                                }
                                <Button
                                    type="text"
                                    onClick={() => {
                                        (browserName == "Chrome WebView" || browserName == "WebKit") ? printInAppContent() : printContent()
                                    }}
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-Print"></i>}
                                >
                                    <span className="fw-semibold">Print</span>
                                    <i className="icon-right iconrotate180 ms-auto"></i>
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-download"></i>}
                                    onClick={() => (browserName == "Chrome WebView" || browserName == "WebKit") ? handleInAppDownload() : handleDownload()}
                                >
                                    <span className="fw-semibold">Download</span>
                                    <i className="icon-right iconrotate180 ms-auto"></i>
                                </Button>
                                {viewable === undefined && (
                                    <Button
                                        type="text"
                                        className="btn btn-input btnicon20 align-items-center d-flex btn-41 w-100"
                                        icon={<i className="icon-Edit"></i>}
                                        onClick={onEditCertificateClick}
                                        loading={loading}
                                    >
                                        <span className="fw-semibold">Edit Certificate</span>
                                        <i className="icon-right iconrotate180 ms-auto"></i>
                                    </Button>
                                )}
                            </div>
                            {viewable === undefined && (
                                <>
                                    <hr className="my-4" />
                                    <div className="fw-medium my-2 pt-2">Save as Template</div>
                                    <div className="saveButton overflow-hidden">
                                        <Input className="popinput inputheight41 rounded-end-0" placeholder="Template Name" onChange={onTitleChange} value={title} disabled={addEditFlag} />
                                        {title?.length > 0 && (
                                            <Button className="h-auto ps-0 rounded-start-0" onClick={onAddEditCertificateClick} disabled={addEditFlag}>{`${tcu_content_id && !pms_default ? 'Update' : 'Save'}${addEditFlag && !pms_default ? 'd' : ''}`}</Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                    <Col md={17} sm={17} xl={12}>
                        <div className={isMobile ? 'p-20' : ''}>
                            <div className="d-flex align-itms-center justify-content-between">
                                <div className="titleprint">Preview</div>
                            </div>
                            <div className="rounded-20px bg-white mt-20 overflow-hidden">
                                <div ref={divRef} className="printheight">
                                    <div className="position-relative h-100">
                                        <Document
                                            loading={<Spin style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%" }} />}
                                            error={<div style={{ position: 'absolute', zIndex: 0, left: "42%", top: "50%" }} >{'Failed to load PDF file.'}</div>}
                                            noData={<div style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%" }} >{'No PDF file specified.'}</div>}
                                            file={printUrl}
                                            onLoadSuccess={onDocumentLoadSuccess}>
                                            {Array.apply(null, Array(numPages))
                                                .map((x, i) => i + 1)
                                                .map((page) => {
                                                    return (
                                                        <Page
                                                            key={Math.random()}
                                                            className={printBlob ? 'react-pdf__Page_afterload' : null}
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

export default CertificatePrintView;
