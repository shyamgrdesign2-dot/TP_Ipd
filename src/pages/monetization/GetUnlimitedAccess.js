import React, { useState, useEffect, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Drawer } from "antd";
import { useLocation } from 'react-router-dom';

import HeaderUnlimitedAccess from "../../common/HeaderUnlimitedAccess";
import TatvaPracticeEMR from "./components/TatvaPracticeEMR";
import SmartSyncPro from "./components/SmartSyncPro";
import AddonServices from "./components/AddonServices";
import CampaignDiscount from "./components/CampaignDiscount";
import UnlimitedAccessSummary from "./components/UnlimitedAccessSummary";
import { S_TATVA_PRACTICE, S_SMARTSYNC, S_VOICE_RX, S_DDX, S_RX_DIGITIZATION, S_IPD, S_ASK_TATVA, S_PHARMACY, S_BILLING } from "../../utils/constants";
import { services } from "../../redux/doctorsSlice";

import GenRxKnowMore from "../../components/GenRxKnowMore";
import SmartSyncKnowMore from "./components/SmartSyncKnowMore";
import CvtKnowMore from "../smartSync/components/CvtKnowMore";
import DDxKnowMore from "../../components/DDxKnowMore";
import IPDKnowMore from "./components/IPDKnowMore";
import AskTatvaKnowMore from "./components/AskTatvaKnowMore";
import PharmacyKnowMore from "./components/PharmacyKnowMore";
import BillingKnowMore from "./components/BillingKnowMore";
import MedEcoAppKnowMore from "./components/MedEcoAppKnowMore";

import "./GetUnlimitedAccess.scss";

function GetUnlimitedAccess() {

    const { profile, campaignsData, servicesLoading, servicesList } = useSelector((state) => state.doctors);
    const dispatch = useDispatch();

    const { state } = useLocation();
    const { buyServiceName } = state != null && state;

    const [servicesData, setServicesData] = useState([]);
    const [checked, setChecked] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [genRxKnowMoreDrawer, setGenRxKnowMoreDrawer] = useState(false);
    const [ddxKnowMoreDrawer, setDDxKnowMoreDrawer] = useState(false);
    const [smartSyncKnowMoreDrawer, setSmartSyncKnowMoreDrawer] = useState(false);
    const [cvtDrawer, setCvtDrawer] = useState(false);
    const [askTatvaKnowMoreDrawer, setAskTatvaKnowMoreDrawer] = useState(false);
    const [iPDKnowMoreDrawer, setIPDKnowMoreDrawer] = useState(false);
    const [pharmacyKnowMoreDrawer, setPharmacyKnowMoreDrawer] = useState(false);
    const [billingDrawer, setBillingDrawer] = useState(false);
    const [medEcoKnowMoreDrawer, setMedEcoKnowMoreDrawer] = useState(false);

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

            let defaultService = []
            if (buyServiceName !== undefined) {
                if (buyServiceName === S_RX_DIGITIZATION) {
                    const isSmartRxPurchased = jsonArray?.some(e => e.service_name === S_SMARTSYNC)
                    defaultService = jsonArray
                        ?.filter(({ service_name }) => !isSmartRxPurchased ? service_name === buyServiceName : service_name === S_SMARTSYNC || service_name === S_RX_DIGITIZATION)
                        ?.map(service => ({ ...service, validity: 1 }))
                    setChecked(true)
                } else {
                    defaultService = jsonArray
                        ?.filter(({ service_name }) => service_name === buyServiceName)
                        ?.map(service => ({ ...service, validity: 1 }))
                }
            } else {
                defaultService = jsonArray
                    ?.filter(({ service_name }) => service_name === S_TATVA_PRACTICE)
                    ?.map(service => ({ ...service, validity: 1 }))
            }
            setSelectedServices(defaultService)
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

    const handleSmartSyncAddRemove = useCallback((item) => {
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
            handleSmartSyncKnowMore()
        } else if (service_name === S_RX_DIGITIZATION) {
            handleDrawerCvtKnowMore()
        } else if (service_name === S_DDX) {
            handleDDxKnowMore()
        } else if (service_name === S_IPD) {
            handleIPDKnowMore()
        } else if (service_name === S_ASK_TATVA) {
            handleAskTatvaKnowMore()
        } else if (service_name === S_PHARMACY) {
            handlePharmacyKnowMore()
        } else if (service_name === S_BILLING) {
            handleBillingKnowMore()
        } else if (service_name === S_TATVA_PRACTICE) {
            handleMedEcoKnowMore()
        }
    }

    const handleGenRxKnowMore = () => {
        setGenRxKnowMoreDrawer((prev) => !prev);
    };

    const handleDDxKnowMore = () => {
        setDDxKnowMoreDrawer((prev) => !prev);
    };

    const handleSmartSyncKnowMore = () => {
        setSmartSyncKnowMoreDrawer((prev) => !prev);
    };

    const handleDrawerCvtKnowMore = () => {
        setCvtDrawer((prev) => !prev);
    };

    const handleAskTatvaKnowMore = () => {
        setAskTatvaKnowMoreDrawer((prev) => !prev);
    };

    const handleIPDKnowMore = () => {
        setIPDKnowMoreDrawer((prev) => !prev);
    };

    const handlePharmacyKnowMore = () => {
        setPharmacyKnowMoreDrawer((prev) => !prev);
    };

    const handleBillingKnowMore = () => {
        setBillingDrawer((prev) => !prev);
    };

    const handleMedEcoKnowMore = () => {
        setMedEcoKnowMoreDrawer((prev) => !prev);
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
                                                        handleSmartSyncAddRemove={() => handleSmartSyncAddRemove(item?.data)}
                                                        checked={checked}
                                                        setChecked={setChecked}
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

                {smartSyncKnowMoreDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={smartSyncKnowMoreDrawer}
                        onClose={handleSmartSyncKnowMore}
                        className=".modalWidth-800"
                        width={600}
                    >
                        <SmartSyncKnowMore handleSmartSyncKnowMore={handleSmartSyncKnowMore} />
                    </Drawer>
                )}

                {cvtDrawer && (
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
                )}

                {askTatvaKnowMoreDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={askTatvaKnowMoreDrawer}
                        onClose={handleAskTatvaKnowMore}
                        className=".modalWidth-800"
                        width={600}
                    >
                        <AskTatvaKnowMore handleAskTatvaKnowMore={handleAskTatvaKnowMore} />
                    </Drawer>
                )}

                {iPDKnowMoreDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={iPDKnowMoreDrawer}
                        onClose={handleIPDKnowMore}
                        className=".modalWidth-800"
                        width={600}
                    >
                        <IPDKnowMore handleIPDKnowMore={handleIPDKnowMore} />
                    </Drawer>
                )}

                {pharmacyKnowMoreDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={pharmacyKnowMoreDrawer}
                        onClose={handlePharmacyKnowMore}
                        className=".modalWidth-800"
                        width={600}
                    >
                        <PharmacyKnowMore handlePharmacyKnowMore={handlePharmacyKnowMore} />
                    </Drawer>
                )}

                {billingDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={billingDrawer}
                        onClose={handleBillingKnowMore}
                        className=".modalWidth-800"
                        width={600}
                    >
                        <BillingKnowMore handleBillingKnowMore={handleBillingKnowMore} />
                    </Drawer>
                )}

                {medEcoKnowMoreDrawer && (
                    <Drawer
                        closeIcon={false}
                        placement="right"
                        open={medEcoKnowMoreDrawer}
                        onClose={handleMedEcoKnowMore}
                        className=".modalWidth-800"
                        width={600}
                    >
                        <MedEcoAppKnowMore handleMedEcoKnowMore={handleMedEcoKnowMore} />
                    </Drawer>
                )}

            </div>
        </>
    );
}

export default GetUnlimitedAccess;
