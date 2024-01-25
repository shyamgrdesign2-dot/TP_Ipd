import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_PROFILE } from "../utils/constants";

function Welcome(props) {
  const navigate = useNavigate();
  const [getStoredProfile, saveProfile] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_PROFILE
  );

  const profile = getStoredProfile();

  const { locationPath, backVisible } = props;

  const getFirstNameWithFallback = () => {
    const fullName = profile?.um_name;

    if (!fullName) {
      return "Dr.";
    } else {
      return fullName;
    }

    // if (fullName?.includes(" ")) {
    //   const firstName = fullName.split(" ")[0];
    //   return firstName;
    // } else {
    //   return fullName;
    // }
  };

  return (
    <>
      <div className="welcomesection position-relative">
        <div className="bg-welcome d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {backVisible && (
              <div onClick={() => locationPath == "/walk_in_consultation" ? navigate(-1) : navigate(-2)} className="lh-1 me-1 px-2 text-dark cursor-pointer">
                <i className="fs-3 icon-right"></i>
              </div>
            )}
            <div>
              {locationPath == "/add_patient" ? (
                <h1>Add New Patient</h1>
              ):locationPath == "/edit_patient" ? (
                <h1>Edit Patient Details</h1>
              ) : locationPath == "/walk_in_consultation" ? (
                <h1>Start Walk-In Consultation</h1>
              ) : (
                <h1>Welcome {getFirstNameWithFallback()}!</h1>
              )}
              {locationPath == "/" && <p>{"Your Appointments"}</p>}
            </div>
            <img
              src={require("../assets/images/bg-welcome.png")}
              className="welcomeig d-inline-block align-top ms-4"
              alt="Welcome"
            />
          </div>
          <div>
            {locationPath == "/" && (
              <div className="d-lg-flex d-block">
                {/* <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2" onClick={() => alert('Comming Soon')}> <i className={'icon-Add me-2'}></i> {'Add New Appointment'}</Button> */}
                <Button
                  variant="primary"
                  className="px-3"
                  onClick={() => navigate("/walk_in_consultation")}
                >
                  {"Start Walk-in Consultation"}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="pb-5">&nbsp;</div>
      </div>
    </>
  );
}

export default React.memo(Welcome);
