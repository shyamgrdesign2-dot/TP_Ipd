import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Drawer } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import Vitals from "../../../assets/images/Vitals.svg";
import purchased from "../../../assets/images/purchased.png";
import expired from "../../../assets/images/expired.png";
import RxVoice from "../../../assets/images/microphone-voice-rx.png";
import AskTatvaIcon from "../../../assets/images/icon-ask-tatva.png";
import DDXIcon from "../../../assets/images/DDX-icon.png";
import RECEPTIONISTIcon from "../../../assets/images/RECEPTIONIST-icon.png";
import smartSyncIcon from "../../../assets/images/smart-sync-icon.png";

import { FREE, S_SMARTSYNC, S_VOICE_RX, S_DDX, S_ASK_TATVA, S_RX_DIGITIZATION, S_RECEPTIONIST_AGENT } from "../../../utils/constants";
import GenRxKnowMore from "../../../components/GenRxKnowMore";
import DDxKnowMore from "../../../components/DDxKnowMore";
import SmartSyncKnowMore from "../components/SmartSyncKnowMore";
import CvtKnowMore from "../../smartSync/components/CvtKnowMore";
import AskTatvaKnowMore from "./AskTatvaKnowMore";

function AiSuite({ aiModal, handleAiSuite }) {

    const navigate = useNavigate();

    const { servicesList } = useSelector((state) => state.doctors);
    const [aiServicesData, setAiServicesData] = useState([]);
    const [genRxKnowMoreDrawer, setGenRxKnowMoreDrawer] = useState(false);
    const [ddxKnowMoreDrawer, setDDxKnowMoreDrawer] = useState(false);
    const [smartSyncKnowMoreDrawer, setSmartSyncKnowMoreDrawer] = useState(false);
    const [cvtDrawer, setCvtDrawer] = useState(false);
    const [askTatvaKnowMoreDrawer, setAskTatvaKnowMoreDrawer] = useState(false);

    useEffect(() => {
        if (servicesList?.length) {
            const jsonArray = servicesList?.filter(({ service_type }) => service_type == 'ai')
            setAiServicesData(jsonArray.sort((a, b) => {
                return (a.purchased === b.purchased) ? 0 : a.purchased === "true" ? -1 : 1;
            }))
        }
    }, [servicesList]);

    const clickKnowMore = (service_name) => {
        if (service_name === S_VOICE_RX) {
            handleGenRxKnowMore()
        } else if (service_name === S_SMARTSYNC) {
            handleSmartSyncKnowMore()
        } else if (service_name === S_RX_DIGITIZATION) {
            handleDrawerCvtKnowMore()
        } else if (service_name === S_DDX) {
            handleDDxKnowMore()
        } else if (service_name === S_ASK_TATVA) {
            handleAskTatvaKnowMore()
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

    const clickBuyNow = (service_name) => {
        navigate('/get-unlimited-access', { state: { buyServiceName: service_name } })
    }

    const getIcon = (service_name) => {
        switch (service_name) {
            case S_VOICE_RX:
                return RxVoice;
            case S_ASK_TATVA:
                return AskTatvaIcon;
            case S_DDX:
                return DDXIcon;
            case S_SMARTSYNC:
                return smartSyncIcon;
            case S_RX_DIGITIZATION:
                return DDXIcon;
            case S_RECEPTIONIST_AGENT:
                return RECEPTIONISTIcon;
            default:
                return "";
        }
    }

    return (
        <>
            <Drawer
                placement="right"
                open={aiModal}
                closeIcon={false}
                onClose={handleAiSuite}
                width={600}>
                <div className="modalCard-header h-60 position-sticky top-0 z-2">
                    <div className="align-items-center d-flex h-100">
                        <div className="border-end h-100 text-center me-3">
                            <div onClick={handleAiSuite}
                                className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer">
                                <i className="icon-right"></i>
                            </div>
                        </div>
                        <div className="fs-18 fw-semibold">AI Suite</div>
                    </div>
                </div>
                <div className="px-4 h-100 bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
                    {aiServicesData?.map((item, index) => {
                        return (
                            <div key={index}>
                                {item?.plan_tier === undefined || item?.plan_tier === FREE ? (
                                    <div className={`ai-suite my-4 ${item?.credit_balance <= 0 && 'ai-expired'}`}>
                                        <div className="d-flex align-items-center mb-3">
                                            <img style={{ background: '#EDDFF780', padding: 6 }} className="rounded-10px me-2" src={getIcon(item?.service_name)} alt="item.type" />
                                            <div className="fs-18 fw-semibold text-1F2933">{item?.service_display_name}</div>
                                            {item?.credit_balance <= 0 && (<img src={expired} className="ms-2" />)}
                                        </div>
                                        <p>
                                            {item?.service_description}
                                        </p>
                                        <Row className="mt-4">
                                            <Col lg={6}>
                                                <Button className='w-100 btn ant-btn btn-41 btn-primary1 btn-outline-primary' onClick={() => clickKnowMore(item?.service_name)}>
                                                    Know More
                                                </Button>
                                            </Col>
                                            <Col lg={6}>
                                                <Button className="btn btn-primary3 btn-41 w-100" onClick={() => clickBuyNow(item?.service_name)}>
                                                    Buy Now
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : (
                                    <div className="ai-suite ai-purchased my-4">
                                        <Row className="align-items-center">
                                            <Col lg={8}>
                                                <div className="d-flex align-items-center mb-2">
                                                    <img style={{ background: '#E6C3FF80' }} className="p-1 rounded-10px me-2" src={getIcon(item?.service_name)} alt="item.type" />
                                                    <div className="fs-18 fw-semibold text-1F2933">{item?.service_display_name}</div>
                                                    <img src={purchased} className="ms-2" />
                                                </div>
                                                <p className="mb-0">
                                                    {item?.service_description}&nbsp;
                                                    <Link className="text-decoration-underline fw-medium text-primary" onClick={() => clickKnowMore(item?.service_name)}>Know more</Link>
                                                </p>
                                            </Col>
                                            <Col lg={4} className="text-center">
                                                <div className="text-themesecondarylight fs-12-1">Valid till</div>
                                                <div className="text-secondary-custom fw-semibold">{moment(item?.plan_end_date).format('Do MMM YYYY')}</div>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                </div>
            </Drawer>

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
        </>

    );
}

export default React.memo(AiSuite);
