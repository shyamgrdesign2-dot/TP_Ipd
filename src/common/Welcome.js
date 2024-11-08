import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDecodedToken } from "../utils/localStorage";
import config from "../config";

function Welcome(props) {

  const navigate = useNavigate();

  const { locationPath, backVisible } = props;

  const { profile } = useSelector((state) => state.doctors);
  const decodedToken = getDecodedToken();

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

  return (
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
  );
}

export default React.memo(Welcome);
