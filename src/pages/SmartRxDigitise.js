import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Spin } from "antd";
import { isMobile } from "react-device-detect";
import { jwtDecode } from "jwt-decode";
// import { errorMessage } from "../utils/utils";
import Card from "react-bootstrap/Card";
import api from "../api/services/axiosService";
import writtenRxIcon from '../assets/images/written-rx.svg';
import digitiseRxIcon from '../assets/images/digitise-rx.svg';
import cvtInfoIcon from '../assets/images/cvt-info.svg';
import { FETCH_SMART_RX, S_RX_DIGITIZATION } from "../utils/constants";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { env } from "../EnvironmentConfig";
import HeaderSmartRxDigitise from "../common/HeaderSmartRxDigitise";
import DigitisedPrescription from "../components/DigitisedPrescription";
import axios from "axios";
import { updateCredits } from "../redux/monetizationSlice";

function SmartRxDigitise() {

    const divRef = useRef(null);

    const { profile } = useSelector((state) => state.doctors);
    const {
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { state } = useLocation();
    const { patient_data, smartRxFilesData, tcm_id, print_url, digitisedData, pam_id} = state

    const [printUrl, setPrintUrl] = useState(state !== undefined ? `${state.print_url}` : null);
    const [token, setToken] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [divWidth, setDivWidth] = useState(0);
    const [data, setData] = useState(null);
    const [isDigitiseRxSubmit, setIsDigitiseRxSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [smartRxFile, setSmartRxFile] = useState(smartRxFilesData);

    const baseUrlRxDigitise = env.rx_digitization ;

    useEffect(() => {
        setDivWidth(divRef.current?.offsetWidth);
    }, [divRef]);

    useEffect(() => {
        if (smartRxFile?.length > 0 && token && state.type === "new") {
            uploadFiles();
        } else if (state.type === "edit" && digitisedData) {
            uploadFiles();
        }
    }, [token, smartRxFile, digitisedData]);

    useEffect(() => {
        const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
        setToken(token)
        if (token) {
          try {
            var decoded = jwtDecode(token);
            setTokenData(decoded.result)
          } catch (e) {
            console.error(e);
          }
        }
    }, []);

    const handleSave = async () => {
        try {
            const cleanedToken = token.replace(/['"]+/g, '');

            const payload = {
                isDigitize: true,
                editedData: {
                    ...data
                }
            }

            // API call to save the data
            const response = await axios.patch(`${baseUrlRxDigitise}/api/v1/rxdigitize/rx/${tcm_id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cleanedToken}`,
                },
            });
            
            // Handle navigation based on the API response
            if (response.status === 204) {
                let sendData = {
                    b2c_id: profile?.b2c,
                    service_name: S_RX_DIGITIZATION
                }
                dispatch(updateCredits(sendData))
                if (state?.page === "patient-summary" || state?.page === "pending-digitization") {
                    navigate(-1); // Go back to the previous page
                } else {
                    navigate('/print-smart-rx', {
                        replace: true,
                        state: {
                            patient_data,
                            smartRxData: smartRxFilesData,
                            tcm_id,
                            pam_id: pam_id || patient_data?.pam_id,
                            print_url,
                            showProgressbar: false,
                            page: "digitise"
                        }
                    });
                }
            }

        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const fetchImageAsFile = async (url, fileName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new File([blob], fileName, { type: blob.type });
        } catch (error) {
            console.error("Error fetching image:", error);
            return null;
        }
    };

    const uploadFiles = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
    
            // Convert images to File objects and append to FormData
            const files = await Promise.all(
                smartRxFile.map(async (file) => {
                    const fileUrl = file.smart_prescription_file;
                    const fileName = file.smart_prescription_filename;
                    return await fetchImageAsFile(fileUrl, fileName);
                })
            );
    
            files.forEach((file) => {
                if (file) {
                    formData.append('files', file);
                }
            });

            // Append other required fields
            formData.append('doctorId', tokenData.user_id);
            formData.append('patientId', patient_data.patient_unique_id);
            formData.append('appointmentId', pam_id);
            formData.append('caseId', tcm_id);
    
            const cleanedToken = token.replace(/['"]+/g, '');
            const response = await axios.post(
                `${baseUrlRxDigitise}/api/v1/rxdigitize/rx`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${cleanedToken}`,
                    },
                }
            );
            
            // Update the digitized data
            if (response?.data?.data) {
                setData(response.data.data.refinedData);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <>
            <HeaderSmartRxDigitise 
                onSave={handleSave} 
                patient_data={patient_data}
            />
            <div className="cvt-info">
                <img src={cvtInfoIcon} alt="cvt-info-icon" className="me-2" />
                <span className="cvt-info-text"><span className="title-common">Disclaimer:</span> Our AI model aims to be accurate, but sometimes it might make mistakes. Please double-check all details to ensure they are correct and complete.</span>
                <i className='icon-Cross ms-1 fs-18' style={{color:"#FEF4E6"}}></i>
            </div>
            <div className={`${isMobile ? 'p-0' : ''} w-100 bg-body wrapper2 prescription-wrapper`}>
                <Row gutter={{ xl: 40, lg: 0 }} justify="center">
                    <Col md={17} lg={17} xl={12}>
                        <div className="appointment-wrap PatientDetailswrap m-0">
                            <Card className="">
                                <>
                                    <Card.Header className="bg-white py-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="title-digitise-card">
                                                <img src={writtenRxIcon} alt="rx-icon1" className='me-2' />
                                                {`Handwritten Rx`}
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-0 cardbody-data scrollable-body">
                                        { loading ? (
                                            <div className="d-flex flex-column justify-content-center">
                                                <div className="align-items-center text-center">
                                                <Spin />
                                                </div>
                                            </div>
                                        ) : (
                                            smartRxFile?.length > 0 &&
                                                smartRxFile?.map(({ smart_prescription_file }) => (
                                                <div style={{ padding: "5px" }}>
                                                {smart_prescription_file && (
                                                    <img
                                                        src={smart_prescription_file}
                                                        alt="Smart Rx"
                                                        width="100%"
                                                    />
                                                )}
                                                </div>
                                            ))
                                        )}
                                    </Card.Body>
                                </>
                            </Card>
                        </div>
                    </Col>
                    <Col md={17} lg={17} xl={12}>
                        <div className="appointment-wrap PatientDetailswrap m-0">
                            {
                                isLoading ? (
                                    <DigitisedPrescription 
                                        data={data} 
                                        setData={setData}
                                        loading={isLoading}
                                        showAbsHeaderInsideLoader={true}
                                    />
                                ) : (
                                    <Card className="">
                                        <>
                                            <Card.Header className="bg-white py-3">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="title-digitise-card">
                                                        <img src={digitiseRxIcon} alt="rx-icon2" className='me-2' />
                                                        {`Digitised Rx`}
                                                    </div>
                                                </div>
                                            </Card.Header>
                                            <Card.Body className="p-0 cardbody-data scrollable-body">
                                                <div style={{padding: "5px"}}>
                                                    <DigitisedPrescription 
                                                        data={data} 
                                                        setData={setData}
                                                        loading={isLoading}
                                                    />
                                                </div>
                                            </Card.Body>
                                        </>
                                    </Card>
                                )
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default SmartRxDigitise;
