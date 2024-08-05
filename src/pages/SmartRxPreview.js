import React, { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { AutoComplete, Input, Button, Form, Row, Col, Select, Popover, Tabs, Spin, Tooltip, message, Checkbox} from "antd";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import axios from 'axios';
import { saveAs } from 'file-saver';
import { jwtDecode } from "jwt-decode";

import { errorMessage } from "../utils/utils";
import api from "../api/services/axiosService";

import visitEnd from '../assets/images/end-visit.svg';
import imgCloseVisit from '../assets/images/close-visit.svg';
import wtsp from '../assets/images/wtsp.svg';
import loadingImg from '../assets/images/loading.png';
import HeaderPrescriptionPrint from "../common/HeaderPrescriptionPrint";

import { FETCH_SMART_RX, MESSAGE_KEY, WHATS_APP_API, WTSAP_ERR_MESSAGE } from "../utils/constants";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";

import { useSelector, useDispatch } from "react-redux";

import { viewCaseManager } from "../redux/caseManagerSlice";

import { pdfjs, Document, Page } from "react-pdf";
import CommonModal from "../common/CommonModal";
import { env } from "../EnvironmentConfig";
const worker = require('pdfjs-dist/build/pdf.worker.min.js')
pdfjs.GlobalWorkerOptions.workerSrc = worker

function SmartRxPreview() {

    const divRef = useRef(null);
    const printRef = useRef();

    const {
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { state } = useLocation();
    const { patient_data } = state

    const [printUrl, setPrintUrl] = useState(state !== undefined ? `${state.print_url}` : null);
    const [token, setToken] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [divWidth, setDivWidth] = useState(0);
    const [numPages, setNumPages] = useState();
    const [printBlob, setPrintBlob] = useState(null);
    const [smartRxFile, setSmartRxFile] = useState(null);
    const [isUpdateMobileNoModalOpen, setIsUpdateMobileNoModalOpen] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [useRegisteredMobile, setUseRegisteredMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Send to WhatsApp");
    const registeredMobileNumber = '';

    const baseUrl = { customBaseUrl: env.casemanager_api_url };

    useEffect(() => {
        setDivWidth(divRef.current?.offsetWidth);
    }, [divRef]);

    useEffect(() => {
        message.open({
            key: MESSAGE_KEY,
            type: '',
            className: 'message-appointment',
            content: (
                <div className='d-flex align-items-center'>
                    <img src={visitEnd} className='me-3' />
                    <div>
                        <div className='title-common text-start fontroboto'>{`${patient_data?.pm_first_name}’s visit ended successfully.`}</div>
                        <div className='fontroboto text-start fw-normal mt-1'>View completed visits in finished tab.</div>
                    </div>
                    <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
                </div>
            ),
            duration: 5,
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
        setToken(token)
        if (token) {
          try {
            var decoded = jwtDecode(token);
            setTokenData(decoded.result)
          } catch (e) {
            console.log(e);
          }
        }
      }, []);

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
        navigate(`/prescription_print_view/?url=${printUrl}&key=download`, { replace: true, state: state })
        navigate(0, { replace: true });
    };

    async function onDocumentLoadSuccess(successEvent) {
        setNumPages(successEvent?.numPages);
        const data = await successEvent.getData()
        const blob = new Blob([data], { type: 'application/pdf' })
        setPrintBlob(blob)
    }

    useEffect(() => {
        const fetchData = async () => {
          const payload = {
            tcm_id: state?.tcm_id,
          };
          try {
                const response = await api.post(
                  FETCH_SMART_RX,
                  payload,
                  baseUrl
                );
                setSmartRxFile(response?.data || null);
          } catch (error) {
            console.error("Error:", error);
          }
        };
        fetchData();
    }, []);

    const configurePrintUrl = async () => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcm_id: state.tcm_id,
            configurePrintSetting: true
        }
        const action = await dispatch(viewCaseManager(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/configure_print_setting', { state: { caseManagerData: action.payload , smartRxFile} })
        } else {
            errorMessage(action.error)
        }
    }

    const showHideUpdateMobileNoModal = () => {
        setIsUpdateMobileNoModalOpen(!isUpdateMobileNoModalOpen);
    };
    
    const onChangeMobileNumber = (e) => {
        setMobileNumber(e.target.value);
    };

    const onChangeCheckbox = (e) => {
        setUseRegisteredMobile(e.target.checked);
        if (e.target.checked) {
          setMobileNumber(registeredMobileNumber);
        } else {
          setMobileNumber('');
        }
      };

    const handleUpdateMobileNoClick = () => {
        setIsUpdateMobileNoModalOpen(!isUpdateMobileNoModalOpen)
    };

    const handleSendToWhatsapp = async () => {
        const body = {
          tcm_id: state?.tcm_id,
          pm_contact_no: state?.patient_data?.pm_contact_no,
          change_mobile_number: false,
          patient_unique_id: state?.patient_data?.patient_unique_id,
          hospital_business_id: tokenData?.hospital_business_id,
          um_id: tokenData?.user_id
        };
    
        setIsLoading(true);
        setButtonText("Sending...");
        try {
            const response = await api.post(
              WHATS_APP_API,
              body,
              baseUrl
            );
            if (response.message) {
                setButtonText("Successfully Sent");

                // After 2-3 seconds, reset the button text back to "Send to WhatsApp again"
                setTimeout(() => {
                    setButtonText("Send to WhatsApp again");
                }, 3000);
            } else {
                setButtonText("Send to WhatsApp");
            }
          } catch (error) {
                errorMessage(WTSAP_ERR_MESSAGE);
          } finally {
                setIsLoading(false);
        }
    };

    const handleEditRxClick = async() => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcm_id: state.tcm_id
        }
        const action = await dispatch(viewCaseManager(sendData));
      
        if (action.meta.requestStatus === "fulfilled") {
            navigate("/smart-prescription", {
                state: {
                  patient_data: patient_data,
                  caseManagerData: action.payload,
                  smartRxFile: smartRxFile,
                },
            });
        } else {
            errorMessage(action.error)
        }
    };

    return (
        <>
            <HeaderPrescriptionPrint patient_data={patient_data} tcm_id={state?.tcm_id} />
            <div className={`${isMobile ? 'p-0' : ''} w-100 bg-body wrapper2 prescription-wrapper`}>
                <Row gutter={{ xl: 40, lg: 0 }} justify="center">
                    <Col md={7} lg={7} xl={7}>

                        {isMobile ? '' : <div className="d-flex align-items-center justify-content-end h-38" onClick={configurePrintUrl}>
                            <i className="icon-setting me-2"></i>
                            <span className="text-decoration-underline fw-medium cursor-pointer"> Configure Print Setting </span>
                        </div>
                        }
                        <div className={`${!isMobile ? 'rounded-20px mt-20' : 'border-top-0 border-start-0 border-bottom-0'} border p-20 bg-white d-flex flex-column`}
                            style={{ height: !isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 60px)' }}>
                            <div>
                                {!isMobile ? '' : <div className="d-flex align-items-center mb-14 h-38" onClick={configurePrintUrl}>
                                    <i className="icon-setting me-2"></i>
                                    <span className="text-decoration-underline fw-medium cursor-pointer"> Configure Print Setting </span>
                                </div>
                                }
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
                                        className="btn btn-input btnicon20 align-items-center d-flex mb-3  btn-41 w-100"
                                        icon={<i className="icon-Edit"></i>}
                                        onClick={handleEditRxClick}
                                        loading={loading}
                                    >
                                        <span className="fw-semibold">Edit Prescription</span>
                                        <i className="icon-right iconrotate180 ms-auto"></i>
                                </Button>
                            </div>
                            <div className="bg-body d-flex p-3 rounded-10px border">
                                <img src={wtsp} alt="Whatsapp Icon" className='align-self-baseline me-3' />
                                <div className="fontroboto title-common">
                                    <div className="fw-normal fontroboto mb-2">Send this prescription to</div>
                                    {patient_data !== undefined ? `WhatsApp +91 ${patient_data.pm_contact_no}` : '-'}
                                    {/* <i className='icon-Edit me-2 fs-21 edit-number-icon' onClick={() => setIsUpdateMobileNoModalOpen(!isUpdateMobileNoModalOpen)}></i> */}
                                </div>
                            </div>
                            <button
                            className="btn btn-send-to-wtsap btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                            onClick={handleSendToWhatsapp}
                            >
                                {isLoading ? (
                                <img src={loadingImg} alt="Loading..." width="25px" height="25px"/>
                                ) : (
                                    buttonText
                                )}
                            </button>                                
                            {/* <CommonModal
                                isModalOpen={isUpdateMobileNoModalOpen}
                                onCancel={showHideUpdateMobileNoModal}
                                modalWidth={500}
                                title={"Update Mobile Number"}
                                modalBody={
                                <>
                                    <div >
                                        <div>Mobile Number<sup className="text-danger update-number-icon">*</sup> <br /></div>
                                        <Form.Item
                                            className="inputLabel-45">
                                            <Input
                                                placeholder="Mobile Number"
                                                value={"7894561230"}
                                                onChange={onChangeMobileNumber}
                                                className="inputheight45 text-capitalize" />
                                        </Form.Item>
                                    </div>
                                    <div className="mt-4">
                                    <div>
                                        <Checkbox onChange={onChangeCheckbox}>
                                            Update with registered mobile number
                                        </Checkbox>
                                    </div>
                                    <div className="d-flex align-items-center mt-2 justify-content-end">
                                        <div onClick={showHideUpdateMobileNoModal}
                                            className="me-4 btn p-0 text-main">
                                            Cancel
                                        </div>
                                        <Button className="lh-lg btn btn-primary3 btn-41 px-4" onClick={handleUpdateMobileNoClick} loading={loading} disabled={patient_data ? false : false}>
                                            <span>Update</span>
                                        </Button>
                                    </div>
                                    </div>
                                </>
                                }
                            /> */}
                        </div>
                    </Col>
                    <Col md={17} lg={17} xl={12}>
                        <div className={isMobile ? 'p-20' : ''}>
                            <div className="d-flex align-itms-center justify-content-between">
                                <div className="titleprint">Preview</div>
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
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default SmartRxPreview;
