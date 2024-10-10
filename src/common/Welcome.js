import React, { useEffect,useState,useRef,useCallback } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDecodedToken } from "../utils/localStorage";
import config from "../config";
import { env } from "../EnvironmentConfig";
import { OPD_API_KEY } from "../utils/constants";
import axios from "axios";
import { QRCodeSVG } from 'qrcode.react';
import { Button as ButtonOPD } from "antd";
import CommonModal from "./CommonModal";
import { useFeatureIsOn } from "@growthbook/growthbook-react";

function Welcome(props) {

  const navigate = useNavigate();

  const { locationPath, backVisible } = props;

  const { profile } = useSelector((state) => state.doctors);
  const decodedToken = getDecodedToken();
  const apiUrl = env.opd_encryption_url;
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);
  const [opdPlansUrl, setOpdPlansUrl] = useState(null);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const printRef = useRef();

  const isOpdPlansAccessableFromGB = useFeatureIsOn(
    "opd-plans"
  );

  // Handle opening the QR code modal
  const handleShowQRCode = () => {
    setQRCodeVisible(true);
  };

  const showHideBackModal = useCallback(() => {
    setQRCodeVisible(false);
  }, [isQRCodeVisible]);

  useEffect(() => {
    if (isQRCodeVisible && !opdPlansUrl) {
      clickOpdPlans();  // Trigger the API call when QR modal is visible and URL isn't yet set
    }
  }, [isQRCodeVisible]);


  const clickWalkInConsultation = () => {
    const businessId = decodedToken?.result?.hospital_business_id;
    window.Moengage.track_event("walk_in_consultation_click", {
      "doctor_id": profile?.doctor_unique_id,
      "timestamp": new Date(),
    });
    if (businessId == config.zydus_business_id) {
      navigate("/walk_in_consultation_zydus")
    } else {
      navigate("/walk_in_consultation")
    }
  }

  const opdEncryptionApiCall = async (data) => {
    const headers = {
      'api-key': OPD_API_KEY,
      'tatvapractice': 'true',
      'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post(apiUrl, data, { headers });
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const clickOpdPlans = async () => {
    const clinic_Id = decodedToken?.result?.clinic_id;
    const doc_Id = decodedToken?.result?.doctor_unique_id;
    
    const clinic_Data = { c_id: clinic_Id };
    const doc_Data = { d_id: doc_Id };

    // Encrypt clinic and doctor ID
    const c_id = await opdEncryptionApiCall(clinic_Data);
    const d_id = await opdEncryptionApiCall(doc_Data);
    
    // Generate and set the URL
    const url = `https://visit-enrolment-tatva.getvisitapp.net/tatva-care?d_id=${d_id}&c_id=${c_id}`
    setOpdPlansUrl(url);  // Set the URL after the API call
  };

  // Handle print functionality
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open('', '', 'height=500,width=500');
    win.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };


  return (
    <>
      <div className="welcomesection position-relative">
        <div className="bg-welcome d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {backVisible && (
              <div onClick={() => navigate(-1)} className="lh-1 me-1 px-2 text-dark cursor-pointer">
                <i className="fs-3 icon-right"></i>
              </div>
            )}
            <div>
              {locationPath == "/add_patient" ? (
                <h1>Add New Patient</h1>
              ) : locationPath == "/edit_patient" ? (
                <h1>Edit Patient Details</h1>
              ) : (locationPath == "/walk_in_consultation" || locationPath == "/walk_in_consultation_zydus") ? (
                <h1>Start Walk-In Consultation</h1>
              ) : (
                <h1>Welcome Dr. {profile?.um_name?.split(/\s+/).filter(word => (word.toLowerCase() != "Dr".toLowerCase() && word.toLowerCase() != "Dr.".toLowerCase())).join(' ')}!</h1>
              )}
              {locationPath == "/" && <p>{"Your Appointments"}</p>}
            </div>
            <img
              src={require("../assets/images/bg-welcome.png")}
              className="welcomeig d-inline-block align-top"
              alt="Welcome"
            />
          </div>
          <div className="d-flex gap-1">
            <div>
              {locationPath == "/" && isOpdPlansAccessableFromGB && (
                <div className="d-lg-flex d-block">
                  {/* <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2" onClick={() => alert('Comming Soon')}> <i className={'icon-Add me-2'}></i> {'Add New Appointment'}</Button> */}
                  <Button
                    variant="primary"
                    className="px-3 btn-41"
                    // onClick={clickOpdPlans}
                    onClick={handleShowQRCode}
                  >
                    {"OPD Plans"}
                  </Button>
                </div>
              )}
            </div>
            <div>
              {locationPath == "/" && (
                <div className="d-lg-flex d-block">
                  {/* <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2" onClick={() => alert('Comming Soon')}> <i className={'icon-Add me-2'}></i> {'Add New Appointment'}</Button> */}
                  <Button
                    variant="primary"
                    className="px-3 btn-41"
                    onClick={clickWalkInConsultation}>
                    {"Start Walk-in Consultation"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <CommonModal
                  isModalOpen={(isQRCodeVisible && opdPlansUrl)}
                  onCancel={showHideBackModal}
                  modalWidth={500}
                  title={"QR Code for OPD plans"}
                  modalBody={
                    <>
                      <div className="alert-warning rounded-10px p-2 patient-details">
                        <div ref={printRef} className="d-flex align-items-center justify-content-center">
                          <QRCodeSVG  value={opdPlansUrl} size={256} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="d-flex align-items-center mt-2 justify-content-center">
                          <ButtonOPD
                            onClick={handlePrint}
                            className="lh-lg btn btn-primary3 btn-41 px-4"
                          >
                            <span>Print</span>
                          </ButtonOPD>
                        </div>
                      </div>
                    </>
                  }
                />
        </div>
        <div className="pb-5">&nbsp;</div>
      </div>
    </>
  );
}

export default React.memo(Welcome);
