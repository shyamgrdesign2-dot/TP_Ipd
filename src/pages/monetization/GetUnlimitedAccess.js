import React, { useState, useEffect, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import HeaderUnlimitedAccess from "../../common/HeaderUnlimitedAccess";
import TatvaPracticeEMR from "./components/TatvaPracticeEMR";
import SmartSyncPro from "./components/SmartSyncPro";
import AddonServices from "./components/AddonServices";
import UnlimitedAccessSummary from "./components/UnlimitedAccessSummary";
import { S_TATVA_PRACTICE, S_SMARTSYNC, S_RX_DIGITIZATION } from "../../utils/constants";
import { campaigns, services } from "../../redux/monetizationSlice";

import "./GetUnlimitedAccess.scss";
import { Spin } from "antd";

function GetUnlimitedAccess() {

    const { campaignsData, servicesLoading, servicesList } = useSelector((state) => state.monetization);
    const dispatch = useDispatch();

    const [countdown, setCountdown] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
    });
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        dispatch(campaigns());
        dispatch(services('7401ba1b-aac7-49f1-8b88-bef3bffc1c1e'));
    }, []);

    useEffect(() => {
        if (servicesList?.length) {
            const EMR = servicesList
                ?.filter(({ service_name }) => service_name === S_TATVA_PRACTICE)
                ?.map(service => ({ ...service, validity: 1 }));
            setSelectedServices(EMR)
        }
    }, [servicesList]);

    useEffect(() => {
        if (campaignsData && campaignsData.campaign_active) {
            const updateCountdown = () => {
                const now = moment();
                const future = moment(campaignsData?.campaign_enddate);

                const duration = moment.duration(future.diff(now));

                const days = String(Math.floor(duration.asDays())).padStart(2, '0');
                const hours = String(duration.hours()).padStart(2, '0');
                const minutes = String(duration.minutes()).padStart(2, '0');

                if (duration.asMilliseconds() <= 0) {
                    setCountdown({ days: '00', hours: '00', minutes: '00' });
                } else {
                    setCountdown({ days, hours, minutes });
                }
            };

            updateCountdown(); // Run immediately on mount/update

            const interval = setInterval(updateCountdown, 60000); // Then run every 1 minute

            return () => clearInterval(interval);
        }
    }, [campaignsData]);

    const handleAddRemove = useCallback((item) => {
        setSelectedServices(prev => {
            const exists = prev.find(e => e.service_name === item.service_name);
            if (exists) {
                return prev.filter(e => e.service_name !== item.service_name);
            } else {
                return [...prev, { ...item, validity: 1 }];
            }
        });
    }, [selectedServices]);

    const handleSmartSyncAddRemove = useCallback((item, checked) => {
        if (checked) {
            setSelectedServices(prev => {
                const newSelection = [...prev];
                item.forEach(service => {
                    const index = newSelection.findIndex(e => e.service_name === service.service_name);
                    if (index !== -1) {
                        newSelection.splice(index, 1);
                    } else {
                        newSelection.push({ ...service, validity: 1 });
                    }
                });
                return newSelection;
            });
        } else {
            setSelectedServices(prev => {
                const exists = prev.find(e => e.service_name === item[0].service_name);
                if (exists) {
                    return prev.filter(e => e.service_name !== item[0].service_name);
                } else {
                    return [...prev, { ...item[0], validity: 1 }];
                }
            });
        }
    }, [selectedServices]);

    return (
        <>
            <HeaderUnlimitedAccess />
            <div className="unlimited-access-wrapper overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                {!servicesLoading ? (
                    <>
                        {campaignsData?.campaign_active && (
                            <div className="flat-20 py-3">
                                🎉<span>&nbsp;Flat {campaignsData?.campaign_value}% off</span>&nbsp;on EMR—limited time offer!&nbsp;&nbsp;
                                <div className="rounded-pill px-2 py-1">{countdown.days} Days : {countdown.hours} Hours : {countdown.minutes} Min ⏳ </div>
                            </div>
                        )}
                        <div className="bg-unlimited-access">
                            <Row className="g-4">
                                <Col xl={8} lg={8} sm={7} xs={12}>
                                    {servicesList?.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                {item.hasOwnProperty("data") ? (
                                                    <SmartSyncPro
                                                        data={item?.data}
                                                        addOrNot={selectedServices?.some(e => e.service_name === S_SMARTSYNC)}
                                                        handleSmartSyncAddRemove={(checked) => handleSmartSyncAddRemove(item?.data, checked)}
                                                        selectedServices={selectedServices}
                                                        setSelectedServices={setSelectedServices}
                                                    />
                                                ) : item.service_name === S_TATVA_PRACTICE ? (
                                                    <TatvaPracticeEMR
                                                        item={item}
                                                    />
                                                ) : (
                                                    <AddonServices
                                                        item={item}
                                                        addOrNot={selectedServices?.some(e => e.service_name === item.service_name)}
                                                        handleAddRemove={() => handleAddRemove(item)}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </Col>
                                <Col xl={4} lg={4} sm={5} xs={12}>
                                    <UnlimitedAccessSummary
                                        selectedServices={selectedServices}
                                        setSelectedServices={setSelectedServices}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </>
                ) : (
                    <Spin className="flex-fill align-self-center" />
                )}

            </div>
        </>
    );
}

export default GetUnlimitedAccess;
