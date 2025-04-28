import React, { useState, useEffect, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Spin, Drawer } from "antd";

import HeaderUnlimitedAccess from "../../common/HeaderUnlimitedAccess";
import TatvaPracticeEMR from "./components/TatvaPracticeEMR";
import SmartSyncPro from "./components/SmartSyncPro";
import AddonServices from "./components/AddonServices";
import CampaignDiscount from "./components/CampaignDiscount";
import UnlimitedAccessSummary from "./components/UnlimitedAccessSummary";
import { S_TATVA_PRACTICE, S_SMARTSYNC, S_VOICE_RX, S_DDX, S_RX_DIGITIZATION } from "../../utils/constants";
import { services } from "../../redux/doctorsSlice";
import GenRxKnowMore from "../../components/GenRxKnowMore";

import "./GetUnlimitedAccess.scss";
import CvtKnowMore from "../smartSync/components/CvtKnowMore";
import DDxKnowMore from "../../components/DDxKnowMore";

function GetUnlimitedAccess() {

    const { profile, campaignsData, servicesLoading, servicesList } = useSelector((state) => state.doctors);
    const dispatch = useDispatch();

    const [servicesData, setServicesData] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [genRxKnowMoreDrawer, setGenRxKnowMoreDrawer] = useState(false);
    const [cvtDrawer, setCvtDrawer] = useState(false);
    const [ddxKnowMoreDrawer, setDDxKnowMoreDrawer] = useState(false);

    useEffect(() => {
        dispatch(services(profile?.b2c));
    }, []);

    useEffect(() => {
        if (servicesList?.length) {
            const jsonArray = servicesList?.filter(({ purchased }) => purchased == 'false')
            const result = [];
            const groupedServices = [];

            jsonArray.forEach(service => {
                if (service.service_name === S_SMARTSYNC) {
                    groupedServices.unshift(service);
                } else if (service.service_name === S_RX_DIGITIZATION) {
                    groupedServices.push(service);
                } else {
                    result.push(service);
                }
            });

            if (groupedServices.length > 0) {
                result.push({ data: groupedServices });
            }

            setServicesData(result)

            const EMR = result
                ?.filter(({ service_name }) => service_name === S_TATVA_PRACTICE)
                ?.map(service => ({ ...service, validity: 1 }));
            setSelectedServices(EMR)
        }
    }, [servicesList]);

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

    const clickKnowMore = (service_name) => {
        if (service_name === S_VOICE_RX) {
            handleGenRxKnowMore()
        } else if (service_name === S_SMARTSYNC) {
            handleDrawerCvtKnowMore()
        } else if (service_name === S_DDX) {
            handleDDxKnowMore()
        }
    }
    const handleGenRxKnowMore = () => {
        setGenRxKnowMoreDrawer((prev) => !prev);
    };

    const handleDrawerCvtKnowMore = () => {
        setCvtDrawer((prev) => !prev);
    };

    const handleDDxKnowMore = () => {
        setDDxKnowMoreDrawer((prev) => !prev);
    };

    return (
        <>
            <HeaderUnlimitedAccess />
            <div className="unlimited-access-wrapper overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                {!servicesLoading ? (
                    <>
                        {campaignsData?.campaign_active && (
                            <CampaignDiscount flag={1} />
                        )}
                        <div className="bg-unlimited-access">
                            <Row className="g-4">
                                <Col xl={8} lg={8} sm={7} xs={12}>
                                    {servicesData?.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                {item.hasOwnProperty("data") ? (
                                                    <SmartSyncPro
                                                        data={item?.data}
                                                        addOrNot={selectedServices?.some(e => e.service_name === S_SMARTSYNC || e.service_name === S_RX_DIGITIZATION)}
                                                        handleSmartSyncAddRemove={(checked) => handleSmartSyncAddRemove(item?.data, checked)}
                                                        selectedServices={selectedServices}
                                                        setSelectedServices={setSelectedServices}
                                                        clickKnowMore={() => clickKnowMore(item?.data[0]?.service_name)}
                                                    />
                                                ) : item.service_name === S_TATVA_PRACTICE ? (
                                                    <TatvaPracticeEMR
                                                        item={item}
                                                        clickKnowMore={() => clickKnowMore(item.service_name)}
                                                    />
                                                ) : (
                                                    <AddonServices
                                                        item={item}
                                                        addOrNot={selectedServices?.some(e => e.service_name === item.service_name)}
                                                        handleAddRemove={() => handleAddRemove(item)}
                                                        clickKnowMore={() => clickKnowMore(item.service_name)}
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

                {genRxKnowMoreDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={genRxKnowMoreDrawer}
                        onClose={handleGenRxKnowMore}
                        className=".modalWidth-800"
                        width={825}
                    >
                        <GenRxKnowMore handleGenRxKnowMore={handleGenRxKnowMore} />
                    </Drawer>
                )}

                <Drawer
                    closeIcon={false}
                    placement="right"
                    onClose={handleDrawerCvtKnowMore}
                    open={cvtDrawer}
                    className=".modalWidth-800"
                    width={800}
                >
                    <CvtKnowMore handleDrawerCvtKnowMore={handleDrawerCvtKnowMore} handleCollapsed={handleDrawerCvtKnowMore} />
                </Drawer>

                {ddxKnowMoreDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={ddxKnowMoreDrawer}
                        onClose={handleDDxKnowMore}
                        className=".modalWidth-800"
                        width={825}
                    >
                        <DDxKnowMore handleDDxKnowMore={handleDDxKnowMore} />
                    </Drawer>
                )}
            </div>
        </>
    );
}

export default GetUnlimitedAccess;
