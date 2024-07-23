import React, { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Col, Row, Select, Button, message, Spin } from "antd";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';

// import { PDFReader } from 'reactjs-pdf-reader';

import { errorMessage } from "../utils/utils";

import messageSent from '../assets/images/message-sent.svg';
import HeaderPrescriptionPrint from "../common/HeaderPrescriptionPrint";

import { useSelector, useDispatch } from "react-redux";

import { viewCaseManager } from "../redux/caseManagerSlice";

import { pdfjs, Document, Page } from "react-pdf";
import { getGynecDetails } from "../api/services/ApiGynec";
const worker = require('pdfjs-dist/build/pdf.worker.min.js')
pdfjs.GlobalWorkerOptions.workerSrc = worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.min.js",
//     import.meta.url
// ).toString();

const LANGUAGE_LIST = [
    {
        value: 1,
        label: 'English',
    },
    {
        value: 2,
        label: 'Gujarati',
    },
    {
        value: 3,
        label: 'Hindi',
    },
    {
        value: 4,
        label: 'Marathi',
    },
    // {
    //     value: 5,
    //     label: 'Telugu',
    // },
    {
        value: 6,
        label: 'Kannada',
    },
    // {
    //     value: 7,
    //     label: 'Urdu',
    // },
    // {
    //     value: 8,
    //     label: 'Punjabi',
    // },
    // {
    //     value: 9,
    //     label: 'Malayalam',
    // },
    {
        value: 10,
        label: 'Tamil',
    },
]
function PrescriptionPrintView() {

    const divRef = useRef(null);
    const printRef = useRef();

    const {
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { state } = useLocation();
    const { patient_data } = state

    const [selectedLang, setSelectedLang] = useState(1);

    const [printUrl, setPrintUrl] = useState(state !== undefined ? `${state.print_url}` : null);
    const [printRxUrl, setPrintRxUrl] = useState(state !== undefined ? `${state.print_rx_url}` : null);

    const [divWidth, setDivWidth] = useState(0);
    const [numPages, setNumPages] = useState();
    const [printBlob, setPrintBlob] = useState(null);

    const [gynecHistoryData, setGynecHistoryData] = useState(null);

    useEffect(() => {
        setDivWidth(divRef.current?.offsetWidth);
    }, [divRef]);

    useEffect(() => {
        fetchGynecHistory();
    }, []);
    
    const fetchGynecHistory = async () => {
        try {
            const data = await getGynecDetails(patient_data?.patient_unique_id);
            setGynecHistoryData(data);
        } catch (error) {
            console.error('Error fetching gynec history:', error);
        }
    };

    // const printContent = useReactToPrint({
    //     content: () => printRef.current,
    // });

    const printContent = async () => {
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
    };

    const printInAppContent = async () => {
        navigate(`/prescription_print_view/?url=${printUrl}&key=print`, { replace: true, state: state })
        navigate(0, { replace: true });
    };

    // const printContent = async () => {
    //     {(/Android/i.test(navigator.userAgent)) ? (
    //         window.open(printUrl, '_blank')
    //     ) : (
    //         <embed className="printBox" src={`${printUrl}#toolbar=0&navpanes=0&scrollbar=0`} height="100%" width="100%"></embed>
    //     )}
    //     const printWindow = await window.open('https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf');
    //     printWindow.print();
    // };

    const onSelect = useCallback(
        (data) => {
            const encodedData = btoa(data.toString());
            setPrintUrl(`${printUrl}&lg=${encodedData}`)
            setSelectedLang(data)
        },
        [selectedLang, printUrl]
    );

    const handleDownload = async () => {
        try {
            const response = await axios({
                // url: "https://morth.nic.in/sites/default/files/dd12-13_0.pdf",
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
        navigate(`/prescription_print_view/?url=${printUrl}&key=download`, { replace: true, state: state })
        navigate(0, { replace: true });
    };

    const onEditPrescriptionClick = async () => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcm_id: state.tcm_id
        }
        const action = await dispatch(viewCaseManager(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate("/prescription", { replace: true, state: { patient_data: patient_data, caseManagerData: action.payload } })
        } else {
            errorMessage(action.error)
        }
    };

    // function onDocumentLoadSuccess({ numPages }) {
    //     setNumPages(numPages);
    // }
    async function onDocumentLoadSuccess(successEvent) {
        setNumPages(successEvent?.numPages);
        const data = await successEvent.getData()
        const blob = new Blob([data], { type: 'application/pdf' })
        setPrintBlob(blob)
    }

    const configurePrintUrl = async () => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcm_id: state.tcm_id,
            configurePrintSetting: true
        }
        const action = await dispatch(viewCaseManager(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/configure_print_setting', { state: { caseManagerData: {...action.payload, patient_data: {...action.payload.patient_data, pm_id: patient_data?.pm_id}, gynecHistoryData} } })
        } else {
            errorMessage(action.error)
        }
    }

    return (
        <>
            <HeaderPrescriptionPrint patient_data={patient_data} tcm_id={state?.tcm_id} />
            <div className={`${isMobile ? 'p-0' : ''} w-100 bg-body wrapper2 prescription-wrapper`}>
                {/* <img src={hey} alt="Hey" className='me-3 hey' /> */}
                <Row gutter={{ xl: 40, lg: 0 }} justify="center">
                    <Col md={7} sm={7} xl={5}>

                        {isMobile ? '' : <div className="d-flex align-items-center justify-content-end h-38" onClick={configurePrintUrl}>
                            <i className="icon-setting me-2"></i>
                            <span className="text-decoration-underline fw-medium cursor-pointer"> Configure Print Setting </span>
                        </div>
                        }
                        <div className={`${!isMobile ? 'rounded-20px mt-20' : 'border-top-0 border-start-0 border-bottom-0'} border p-20 bg-white d-flex justify-content-between flex-column`}
                            style={{ height: !isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 60px)' }}>
                            <div>
                                {!isMobile ? '' : <div className="d-flex align-items-center mb-14 h-38" onClick={configurePrintUrl}>
                                    <i className="icon-setting me-2"></i>
                                    <span className="text-decoration-underline fw-medium cursor-pointer"> Configure Print Setting </span>
                                </div>
                                }
                                <Button
                                    type="text"
                                    onClick={() => {
                                        window.Moengage.track_event("print_select", {
                                            "language": LANGUAGE_LIST.find(e => e.value === selectedLang).label
                                        });
                                        !isChrome && !isSafari ? printInAppContent() : printContent()
                                    }}
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-Print"></i>}
                                >
                                    <span className="fw-semibold">Print</span>
                                    <i className="icon-right iconrotate180 ms-auto"></i>
                                </Button>
                                {/* <Button

                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-billings"></i>}
                                >
                                    <span className="fw-semibold">Create Bill</span>
                                    <i className="icon-right iconrotate180 ms-auto"></i>
                                </Button> */}
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-download"></i>}
                                    onClick={() => !isChrome && !isSafari ? handleInAppDownload() : handleDownload()}
                                >
                                    <span className="fw-semibold">Download</span>
                                    <i className="icon-right iconrotate180 ms-auto"></i>
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex btn-41 w-100"
                                    icon={<i className="icon-Edit"></i>}
                                    onClick={onEditPrescriptionClick}
                                    loading={loading}
                                >
                                    <span className="fw-semibold">Edit Prescription</span>
                                    <i className="icon-right iconrotate180 ms-auto"></i>
                                </Button>
                            </div>
                            {/* <div className="bg-body d-flex p-3 rounded-10px border">
                                <img src={messageSent} alt="whatsapp Message" className='align-self-baseline me-3' />
                                <div className="fontroboto title-common">
                                    <div className="fw-normal fontroboto mb-2">WhatsApp Sent to </div>
                                    {patient_data !== undefined ? `+91 ${patient_data.pm_contact_no}` : '-'}
                                </div>
                            </div> */}
                        </div>
                    </Col>
                    <Col md={17} sm={17} xl={12}>
                        <div className={isMobile ? 'p-20' : ''}>
                            <div className="d-flex align-itms-center justify-content-between">
                                <div className="titleprint">Preview</div>
                                <div className="d-flex align-items-center">
                                    <label className="fontroboto">Select Language</label>
                                    <Select placeholder="English" className='ms-3 appointmentselect'
                                        value={selectedLang}
                                        onSelect={onSelect}
                                        options={LANGUAGE_LIST}
                                    />
                                </div>
                            </div>
                            <div className="rounded-20px bg-white mt-20 overflow-hidden">
                                <div ref={divRef} className="printheight">
                                    <div ref={printRef} className="position-relative h-100">
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
                                    {/* <Spin style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%" }} />
                                    <PDFReader key={selectedLang} ref={printRef} width={divWidth} showAllPage={true} url={`${printUrl}#toolbar=0&navpanes=0&scrollbar=0`} /> */}
                                    {/* <embed className="printBox" ref={printRef} src={`${printUrl}#toolbar=0&navpanes=0&scrollbar=0`} height="100%" width="100%"></embed> */}
                                    {/* <iframe
                                        src="https://pms-upgrade.azurewebsites.net/case_manager/pdf_casemanager_send.php?pdf_id=MTI3Njgx&p_id=U1QtMTAxOQ==&pu_id=NDA3OTIzNjg1MQ=#toolbar=0&navpanes=0&scrollbar=0"
                                        height="100%" width="100%"
                                        title="PDF Viewer"
                                    ></iframe> */}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default PrescriptionPrintView;
