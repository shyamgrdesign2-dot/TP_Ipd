import React from "react";
import { Button, Checkbox, Popover } from "antd";
import { useSelector } from "react-redux";

import smartSyncIcon from "../../../assets/images/smart-sync-icon.png";
import deviderIncludes from "../../../assets/images/includes-devider.svg";
import { formatAmount } from "../../../utils/utils";

function SmartSyncPro({ data, addOrNot, handleSmartSyncAddRemove, checked, setChecked, selectedServices, setSelectedServices, clickKnowMore }) {

    const { campaignsData } = useSelector((state) => state.doctors);

    const onChange = (e) => {
        setChecked(e.target.checked)
        if (addOrNot) {
            setSelectedServices(prev => {
                const exists = prev.find(e => e.service_name === data[1].service_name);
                if (exists) {
                    return prev.filter(e => e.service_name !== data[1].service_name);
                } else {
                    return [...prev, { ...data[1], validity: 12 }];
                }
            });
        }
    }

    const contentSmartSync = (
        <div><span className="fw-semibold">Smart Sync device</span> comes with a digital pad <br />
            and smart pen, enabling you to write naturally<br />
            —just like on paper. This is a <span className="fw-semibold"> one-time purchase</span> <br />
            and the device is free for lifetime <br />
            use with no renewals or hidden charges.</div>
    );

    const contentRxDigitization = (
        <div>Get <span className="fw-semibold">AI Rx Digitisation</span> to unlock full <br />
            automation. Our AI engine converts your <br />
            handwritten prescriptions into structured <br />
            digital formats within 30 seconds. It improves <br />
            accuracy, speeds up documentation, and <br />
            streamlines your clinical workflow for better <br />
            patient care.</div>
    );

    return (
        <>
            <div className={`addon-box ${addOrNot && 'box-added'}`}>
                {data[0].must_have === 'true' && (<div className="tag-recommend">Must Have</div>)}
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="fs-4 text-welcome fw-semibold my-2">
                            <img style={{ background: '#EDDFF780', padding: 6 }} className="rounded-10px me-2" src={smartSyncIcon} alt="Icon" />
                            {data[0].service_display_name}
                        </div>
                        <div>
                            <div className="fs-14">{data[0].service_description}&nbsp;
                                <span className="text-decoration-underline fw-medium text-main cursor-pointer" onClick={clickKnowMore}>
                                    Know more
                                </span>
                            </div>
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
                            {/* <div className="text-price fs-18">/year</div> */}
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
                        <Button className={`btn d-flex rounded-10px align-items-center justify-content-center ms-4 ${!addOrNot ? 'btn-addon' : 'btn-added'}`} onClick={handleSmartSyncAddRemove}>
                            <i className={`me-2 ${!addOrNot ? 'icon-Add fs-18 ' : 'fs-4 icon-check'}`}></i> {!addOrNot ? 'Add' : 'Added'}
                        </Button>
                    </div>
                </div>

                {data[1] !== undefined && (
                    <div className="includes-box mt-3">
                        <div className="d-flex align-items-center justify-content-between my-2">
                            <div className="d-flex align-items-center">
                                <Checkbox defaultChecked disabled className="include-checkbox">{data[0].service_display_name}</Checkbox>
                                <Popover trigger="hover" content={contentSmartSync}>
                                    <i className="icon-info fs-5 text-black-50"></i>
                                </Popover>
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
                                <div className="fs-14 text-price">/Lifetime</div>
                            </div>
                            <div className="text-black-50 fs-14 include-text">
                                Included by default
                            </div>
                        </div>
                        <img className="d-block img-fluid mx-auto my-2 my-xl-4" src={deviderIncludes} alt="Includes" />
                        <div className="d-flex align-items-center justify-content-between my-2">
                            <div className="d-flex align-items-center">
                                <Checkbox checked={checked} onChange={onChange} className="include-checkbox">{data[1].service_display_name}</Checkbox>
                                <Popover trigger="hover" content={contentRxDigitization}>
                                    <i className="icon-info fs-5 text-black-50"></i>
                                </Popover>
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
                                <div className="fs-14 text-price">/year</div>
                            </div>
                            <div className="text-black-50 fs-14 include-text">
                                Addon
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default React.memo(SmartSyncPro);
