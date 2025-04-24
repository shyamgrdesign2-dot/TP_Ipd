import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Checkbox } from "antd";
import { useSelector } from "react-redux";

import vaccinationImg from "../../../assets/images/Vaccination.svg";
import deviderIncludes from "../../../assets/images/includes-devider.svg";
import { formatAmount } from "../../../utils/utils";

function SmartSyncPro({ data, addOrNot, handleSmartSyncAddRemove, selectedServices, setSelectedServices }) {

    const { campaignsData } = useSelector((state) => state.monetization);
    const [checked, setChecked] = useState(false);

    const onChange = (e) => {
        setChecked(e.target.checked)
        if (addOrNot) {

            setSelectedServices(prev => {
                const exists = prev.find(e => e.service_name === data[1].service_name);
                if (exists) {
                    return prev.filter(e => e.service_name !== data[1].service_name);
                } else {
                    return [...prev, { ...data[1], validity: 1 }];
                }
            });
        }
    }

    return (
        <>
            <div className="addon-access mt-2 mb-3">
                <div className={`addon-box ${addOrNot && 'box-added'}`}>
                    {data[0].must_have && (<div className="tag-recommend">Must Have</div>)}
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <div className="fs-4 text-welcome fw-semibold my-2">
                                <img style={{ background: '#EDDFF780' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" />
                                {data[0].service_display_name}
                            </div>
                            <div>
                                <div className="fs-14">{data[0].service_description}<Link className="text-decoration-underline fw-medium text-main">Know more</Link></div>
                            </div>
                        </div>
                        <div className="addon-box-price mx-4">
                            <div className="d-flex align-items-end">
                                <div className="fw-semibold text-price lh-1 fs-4">
                                    {`₹${data[1] !== undefined && checked ?
                                        campaignsData?.campaign_active ?
                                            formatAmount((parseFloat(data[0].service_cost) - (parseFloat(data[0].service_cost) * parseFloat(campaignsData?.campaign_value) / 100)) + (parseFloat(data[1].service_cost) - (parseFloat(data[1].service_cost) * parseFloat(campaignsData?.campaign_value) / 100)))
                                            :
                                            formatAmount((parseFloat(data[0].service_cost)) + (parseFloat(data[1].service_cost)))
                                        :
                                        campaignsData?.campaign_active ?
                                            formatAmount(parseFloat(data[0].service_cost) - (parseFloat(data[0].service_cost) * parseFloat(campaignsData?.campaign_value) / 100))
                                            :
                                            formatAmount(parseFloat(data[0].service_cost))
                                        }`}
                                </div>
                                <div className="text-price fs-18">/year</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mt-1">
                                {campaignsData?.campaign_active && (
                                    <>
                                        <div className="text-black-50 text-decoration-line-through me-2">
                                            {`₹${data[1] !== undefined && checked ?
                                                formatAmount(parseFloat(data[0].service_cost) + parseFloat(data[1].service_cost))
                                                :
                                                formatAmount(parseFloat(data[0].service_cost))
                                                }`}
                                        </div>
                                        <div className="access-off px-2 py-1 rounded-pill fw-semibold fs-12-1 text-white">{`${campaignsData?.campaign_value}% off`}</div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <Button className={`btn d-flex rounded-10px align-items-center justify-content-center ms-4 ${!addOrNot ? 'btn-addon' : 'btn-added'}`} onClick={() => handleSmartSyncAddRemove(checked)}>
                                <i className={`me-2 ${!addOrNot ? 'icon-Add fs-18 ' : 'fs-4 icon-check'}`}></i> {!addOrNot ? 'Add' : 'Added'}
                            </Button>
                        </div>
                    </div>

                    {data[1] !== undefined && (
                        <div className="includes-box mt-5">
                            <div className="d-flex align-items-center justify-content-between my-3">
                                <div className="d-flex align-items-center">
                                    <Checkbox defaultChecked disabled className="include-checkbox">{data[0].service_display_name}</Checkbox>
                                    <i className="icon-info fs-6 text-black-50"></i>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className="fw-medium fs-18 fontroboto text-price">
                                            {`₹${campaignsData?.campaign_active ?
                                                formatAmount(parseFloat(data[0].service_cost) - (parseFloat(data[0].service_cost) * parseFloat(campaignsData?.campaign_value) / 100))
                                                :
                                                formatAmount(parseFloat(data[0].service_cost))}`}
                                        </div>
                                        {campaignsData?.campaign_active && (
                                            <div className="text-black-50 text-decoration-line-through">{`₹${data[0].service_cost}`}</div>
                                        )}
                                    </div>
                                    <div className="fs-14 text-price ms-2">Lifetime</div>
                                </div>
                                <div className="text-black-50 fs-14 include-text">
                                    Included by default
                                </div>
                            </div>
                            <img className="d-block img-fluid mx-auto my-3 my-xl-4" src={deviderIncludes} alt="Includes" />
                            <div className="d-flex align-items-center justify-content-between my-3">
                                <div className="d-flex align-items-center">
                                    <Checkbox checked={checked} onChange={onChange} className="include-checkbox">{data[1].service_display_name}</Checkbox>
                                    <i className="icon-info fs-6 text-black-50"></i>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className="fw-medium fs-18 fontroboto text-price">
                                            {`₹${campaignsData?.campaign_active ?
                                                formatAmount(parseFloat(data[1].service_cost) - (parseFloat(data[1].service_cost) * parseFloat(campaignsData?.campaign_value) / 100))
                                                :
                                                formatAmount(parseFloat(data[1].service_cost))}`}
                                        </div>
                                        {campaignsData?.campaign_active && (
                                            <div className="text-black-50 text-decoration-line-through">{`₹${data[1].service_cost}`}</div>
                                        )}
                                    </div>
                                    <div className="fs-14 text-price ms-2">Lifetime</div>
                                </div>
                                <div className="text-black-50 fs-14 include-text">
                                    --
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default React.memo(SmartSyncPro);
