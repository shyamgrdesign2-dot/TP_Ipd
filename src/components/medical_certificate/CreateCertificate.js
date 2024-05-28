import React from "react";
import { Button } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import medicalFitness from "../../assets/images/medical-fitness.svg";
import medicalLeave from "../../assets/images/medical-leave.svg";
import medicalVisa from "../../assets/images/medical-visa.svg";
import travelCetificate from "../../assets/images/travel-cetificate.svg";

function CreateCertificate() {

    const navigate = useNavigate();

    return (
        <div className="bg-white h-100 p-20">
            <div className="titleprint mb-2">Select certificate template</div>
            <div onClick={() => {navigate('/certificate')}} className="d-flex align-items-center py-3 border-bottom cursor-pointer">
                <div className="bg-fitness">
                    <img src={medicalFitness} alt="" />
                </div>
                <div className="title-common">
                    Medical Fitness
                </div>
            </div>
            <div onClick={() => {navigate('/certificate')}} className="d-flex align-items-center py-3 border-bottom cursor-pointer">
                <div className="bg-fitness">
                    <img src={medicalLeave} alt="" />
                </div>
                <div className="title-common">
                    Medical Leave
                </div>
            </div>
            <div onClick={() => {navigate('/certificate')}} className="d-flex align-items-center py-3 border-bottom cursor-pointer">
                <div className="bg-fitness">
                    <img src={medicalVisa} alt="" />
                </div>
                <div className="title-common">
                    Medical Visa
                </div>
            </div>
            <div onClick={() => {navigate('/certificate')}} className="d-flex align-items-center py-3 cursor-pointer">
                <div className="bg-fitness">
                    <img src={travelCetificate} alt="" />
                </div>
                <div className="title-common">
                    Travel Certificate
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-between custom-certificate">
                <div className="title-common">Want to create custom certificate ? </div>
                <Button onClick={() => {navigate('/certificate')}} className='btn btn-input btn-41'>
                    Custom Certificate
                </Button>
            </div>
        </div>
    )
}
export default React.memo(CreateCertificate);
