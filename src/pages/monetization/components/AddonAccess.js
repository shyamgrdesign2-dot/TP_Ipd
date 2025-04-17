import React, { useState } from "react";
import { Link } from "react-router-dom";
import vaccinationImg from "../../../assets/images/Vaccination.svg";
import deviderIncludes from "../../../assets/images/includes-devider.svg";
import aiPowered from "../../../assets/images/ai-powered.svg";
import "../GetUnlimitedAccess.scss";
import { Button, Checkbox } from "antd";

function AddonAccess() {

    const [add, setAdd] = useState(null);
    const handleAdd = () => {
        setAdd(!add)
    }

    return (
        <>
            <div className="addon-access mt-2 mb-3">
                <div className={`addon-box ${add && 'box-added'}`}>
                    <div className="tag-recommend">Recommend</div>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <div className="fs-4 text-welcome fw-semibold my-2">
                                <img style={{ background: '#EDDFF780' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" /> 
                                Smart Sync Pro 
                                {/* <img src={aiPowered} alt="Icon" /> Uncomment in AI modules  */}
                            </div>
                            <div>
                                <div className="fs-14">Write naturally, with real-time view in your device <Link className="text-decoration-underline fw-medium text-main">Know more</Link></div>
                            </div>
                        </div>
                        <div className="addon-box-price mx-4">
                            <div className="d-flex align-items-end">
                                <div className="fw-semibold text-price lh-1 fs-4">₹23,999</div>
                                <div className="text-price fs-18">/year</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mt-1">
                                <div className="text-black-50 text-decoration-line-through me-2">₹28,999</div>
                                <div className="access-off px-2 py-1 rounded-pill fw-semibold fs-12-1 text-white">20% off</div>
                            </div>
                        </div>
                        <div>
                            <Button className={`btn d-flex rounded-10px align-items-center justify-content-center ms-4 ${!add ? 'btn-addon' : 'btn-added'}`} onClick={handleAdd}>
                                <i className={`me-2 ${!add ? 'icon-Add fs-18 ' : 'fs-4 icon-check'}`}></i> {!add ? 'Add' : 'Added'}
                            </Button>
                        </div>
                    </div>
                    <div className="includes-box mt-5">
                        <div className="d-flex align-items-center justify-content-between my-3">
                            <div className="d-flex align-items-center">
                                <Checkbox defaultChecked disabled className="include-checkbox">Smart sync Device</Checkbox>
                                <i className="icon-info fs-6 text-black-50"></i>
                            </div>
                            <div className="d-flex align-items-end">
                                <div className="fw-medium fs-18 fontroboto text-price">
                                    ₹20,000/
                                </div>
                                <div className="fs-14 text-price">Lifetime</div>
                            </div>
                            <div className="text-black-50 fs-14 include-text">
                                Included by default
                            </div>
                        </div>
                        <img className="d-block img-fluid mx-auto my-3 my-xl-4" src={deviderIncludes} alt="Includes" />
                        <div className="d-flex align-items-center justify-content-between my-3">
                            <div className="d-flex align-items-center">
                                <Checkbox className="include-checkbox">AI Rx Digitisation</Checkbox>
                                <i className="icon-info fs-6 text-black-50"></i>
                            </div>
                            <div className="d-flex align-items-end">
                                <div className="fw-medium fs-18 fontroboto text-price">
                                    ₹8,999/
                                </div>
                                <div className="fs-14 text-price">Lifetime</div>
                            </div>
                            <div className="text-black-50 fs-14 include-text">
                                --
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddonAccess;
