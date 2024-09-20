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
import { FETCH_SMART_RX } from "../utils/constants";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { env } from "../EnvironmentConfig";
import HeaderSmartRxDigitise from "../common/HeaderSmartRxDigitise";
import DigitisedPrescription from "../components/DigitisedPrescription";
import axios from "axios";

function SmartRxDigitise() {

    const divRef = useRef(null);

    const {
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { state } = useLocation();
    const { patient_data, smartRxFilesData, tcm_id, print_url, digitisedData} = state

    const [printUrl, setPrintUrl] = useState(state !== undefined ? `${state.print_url}` : null);
    const [token, setToken] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [divWidth, setDivWidth] = useState(0);
    const [data, setData] = useState(digitisedData?.refinedData);
    const [isDigitiseRxSubmit, setIsDigitiseRxSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [smartRxFile, setSmartRxFile] = useState(smartRxFilesData);

    const baseUrlRxDigitise = env.rx_digitization ;

    useEffect(() => {
        setDivWidth(divRef.current?.offsetWidth);
    }, [divRef]);

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
            
            // Navigate to a different page on successful API call
            if(response.status === 204){
                navigate('/print-smart-rx', { replace: true, state: { patient_data:patient_data, smartRxData:smartRxFilesData, tcm_id:tcm_id, print_url:print_url} })
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <>
            <HeaderSmartRxDigitise 
                onSave={handleSave} 
                patient_data={patient_data} 
                tcm_id={tcm_id} 
                print_url={print_url} 
                isDigitiseRxSubmit={isDigitiseRxSubmit} 
                smartRxData={smartRxFilesData} 
                digitisedData={digitisedData}
            />
            <div className="cvt-info">
                <img src={cvtInfoIcon} alt="cvt-info-icon" />
                <span className="cvt-info-text"><span className="title-common">Disclaimer:</span> Our AI model aims to be accurate, but sometimes it might make mistakes. Please double-check all details to ensure they are correct and complete.</span>
                <i className='icon-Cross ms-1 fs-18' style={{color:"#A2A2A8"}}></i>
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
                                            smartRxFile.length > 0 &&
                                                smartRxFile?.map(({ smart_prescription_file }) => (
                                                <div style={{ padding: "5px" }}>
                                                {smart_prescription_file && (
                                                    <img
                                                        src={smart_prescription_file}
                                                        alt="Smart Rx"
                                                        width="100%"
                                                        height="660px"
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
                                    {/* {loading && (
                                    <div
                                        className="d-flex flex-column justify-content-center"
                                        style={{ height: "calc(100vh - 218px)" }}
                                    >
                                        <div className="align-items-center text-center">
                                        <Spin />
                                        </div>
                                    </div>
                                    )} */}
                                    <Card.Body className="p-0 cardbody-data scrollable-body">
                                        <div style={{padding: "5px"}}>
                                            <DigitisedPrescription  data={data} setData={setData}/>
                                        </div>
                                    </Card.Body>
                                </>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default SmartRxDigitise;
