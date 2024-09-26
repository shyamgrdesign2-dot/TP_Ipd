import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDecodedToken } from "../utils/localStorage";
import config from "../config";
import { env } from "../EnvironmentConfig";
import { OPD_API_KEY } from "../utils/constants";
import axios from "axios";

function Welcome(props) {

  const navigate = useNavigate();

  const { locationPath, backVisible } = props;

  const { profile } = useSelector((state) => state.doctors);
  const decodedToken = getDecodedToken();
  const apiUrl = env.opd_encryption_url;

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
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const clickOpdPlans = async() => {
    const clinic_Id = decodedToken?.result?.clinic_id;
    const doc_Id = decodedToken?.result?.doctor_unique_id;
    const clinic_Data = {
      c_id:clinic_Id
    }
    const doc_Data = {
      d_id:doc_Id
    }
  
    const c_id = await opdEncryptionApiCall(clinic_Data)
    const d_id = await opdEncryptionApiCall(doc_Data)
    const opdPlansUrl = `https://visit-enrolment-tatva.getvisitapp.net/tatva-care?d_id=${d_id}&c_id=${c_id}`
    console.log(opdPlansUrl,"opdPlansUrl")
  }

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
              {locationPath == "/" && (
                <div className="d-lg-flex d-block">
                  {/* <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2" onClick={() => alert('Comming Soon')}> <i className={'icon-Add me-2'}></i> {'Add New Appointment'}</Button> */}
                  <Button
                    variant="primary"
                    className="px-3 btn-41"
                    onClick={clickOpdPlans}
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
        </div>
        <div className="pb-5">&nbsp;</div>
      </div>
    </>
  );
}

export default React.memo(Welcome);
