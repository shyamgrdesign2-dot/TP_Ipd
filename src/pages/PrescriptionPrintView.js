import React, { useState, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { Col, Row, Select, Button } from "antd";
import { isMobile } from "react-device-detect";
import axios from 'axios';
import { saveAs } from 'file-saver';

import messageSent from '../assets/images/message-sent.svg';
import HeaderPrescriptionPrint from "../common/HeaderPrescriptionPrint";

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
    {
        value: 5,
        label: 'Telugu',
    },
    {
        value: 6,
        label: 'Kannada',
    },
    {
        value: 7,
        label: 'Urdu',
    },
    {
        value: 8,
        label: 'Punjabi',
    },
    {
        value: 9,
        label: 'Malayalam',
    },
    {
        value: 10,
        label: 'Tamil',
    },
]
function PrescriptionPrintView() {

    const { state } = useLocation();

    const [selectedLang, setSelectedLang] = useState(1);

    const [printUrl, setPrintUrl] = useState(state != undefined ? `${state.print_url}` : null);
    const [printRxUrl, setPrintRxUrl] = useState(state != undefined ? `${state.print_rx_url}` : null);

    const printContent = async () => {
        const printWindow = await window.open(printUrl);
        printWindow.print();
    };

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
            url:printUrl,
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

    return (
        <>
            <HeaderPrescriptionPrint state={state} />
            <div className={`${isMobile ? 'p-0' : ''} w-100 bg-body wrapper2 custom-scroll prescription-wrapper`}>
                {/* <img src={hey} alt="Hey" className='me-3 hey' /> */}
                <Row gutter={{ xl: 40, lg: 0 }} justify="center">
                    <Col md={7} lg={7} xl={5}>

                        {isMobile ? '' : <div className="d-flex align-items-center justify-content-end h-38 " style={{ visibility: 'hidden' }}>
                            <i className="icon-setting me-2"></i>
                            <span className="text-decoration-underline fw-medium"> Configure Print Setting </span>
                        </div>
                        }
                        <div className={`${!isMobile ? 'rounded-20px mt-20' : 'border-top-0 border-start-0 border-bottom-0'} border p-20 bg-white d-flex justify-content-between flex-column`}
                            style={{ height: !isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 60px)' }}>
                            <div>
                                {!isMobile ? '' : <div className="d-flex align-items-center mb-14 h-38" style={{ visibility: 'hidden' }}>
                                    <i className="icon-setting me-2"></i>
                                    <span className="text-decoration-underline fw-medium"> Configure Print Setting </span>
                                </div>
                                }
                                <Button
                                    type="text"
                                    onClick={printContent}
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-Print"></i>}
                                >
                                    <span className="fw-semibold">Print</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                                <Button

                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-billings"></i>}
                                >
                                    <span className="fw-semibold">Create Bill</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-download"></i>}
                                    onClick={handleDownload}
                                >
                                    <span className="fw-semibold">Download</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex btn-41 w-100"
                                    icon={<i className="icon-Edit"></i>}
                                >
                                    <span className="fw-semibold">Edit Prescription</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                            </div>
                            <div className="bg-body d-flex p-3 rounded-10px border" style={{ visibility: 'hidden' }}>
                                <img src={messageSent} alt="whatsapp Message" className='align-self-baseline me-3' />
                                <div className="fontroboto title-common">
                                    <div className="fw-normal fontroboto mb-2">WhatsApp & SMS Sent to </div>
                                    +91 7894561230
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={17} lg={17} xl={12}>
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
                            <div className="border rounded-20px bg-white mt-20">
                                <div className="printheight">
                                    <embed className="printBox" src={`${printUrl}#toolbar=0&navpanes=0&scrollbar=0`} height="100%" width="100%"></embed>
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
