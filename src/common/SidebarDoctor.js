import React, { useState, useEffect } from 'react';
import { Button } from "antd";
import { isMobile, isChrome, isSafari } from 'react-device-detect';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import axios from 'axios';

import config from "../config";
import { useLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import newGif from '../assets/images/new-gif.gif';
import ipdIcon from '../assets/images/ipd.svg';
import patientsIcon from '../assets/images/patients.svg';
import analyticsIcon from '../assets/images/analytics.svg';
import pharmacyIcon from '../assets/images/pharmacy.svg';
import billingsIcon from '../assets/images/billings.svg';
import followUpIcon from '../assets/images/followup-home.svg';
import ipdActiveIcon from '../assets/images/ipd-active.svg';
import patientsActiveIcon from '../assets/images/patients-active.svg';
import analyticsActiveIcon from '../assets/images/analytics-active.svg';
import pharmacyActiveIcon from '../assets/images/pharmacy-active.svg';
import billingsActiveIcon from '../assets/images/billings-active.svg';
import followUpActiveIcon from '../assets/images/follow-up-active.svg';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

function SidebarDoctor() {

    const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    const { profile } = useSelector((state) => state.doctors);
    const [tokenData, setTokenData] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const navigate = useNavigate();

    const isApolloConsultationsEnabled = useFeatureIsOn('apollo-consultations');

    const location = useLocation();

    useEffect(() => {
        if (profile) {
            const getStorageData = async () => {
                const token = await getToken()
                if (token !== undefined) {
                    try {
                        var decoded = jwtDecode(token);
                        setTokenData(decoded.result)
                        window.beamer_config = {
                            ...window.beamer_config,
                            product_id: "JBgEuAKX59541",
                            filter: profile?.dp_name,
                            user_firstname: profile?.um_name,
                            user_lastname: '',
                            user_id: decoded.result.user_id
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
            getStorageData()
        }
    }, [profile]);


    const clickOldModule = (moduleName) => {
        SSO_TO_PM().then(async (data) => {
            if (data.success == 200) {
                if (!isChrome && !isSafari) {
                    navigate(`/?url=${data.url}&module=${moduleName}&key=phpRedirect`, { replace: true })
                    navigate(0, { replace: true });
                } else {
                    await window.open(`${data.url}&module=${moduleName}`)
                }
            }
        });
    }
    async function SSO_TO_PM() {
        try {
            const sendData = {
                doctor_unique_id: tokenData.doctor_unique_id,
                mobile_no: tokenData.mobile_no,
                clinic_id: tokenData.clinic_id,
                hm_business_id: tokenData.hospital_business_id,
                from: 'app'
            };

            const formData = new FormData();
            Object.keys(sendData).forEach((key) => {
                formData.append(key, sendData[key]);
            });

            const response = await axios.post(config.sso_to_pm_url, formData,
                {
                    auth: {
                        username: config.sso_to_pm_username,
                        password: config.sso_to_pm_password,
                    }
                },
            );

            return response.data;
        } catch (err) {
            console.log(err.message);
            console.log(err.response.status);
        }
    }

    const getIcon = (type, isHovered) => {
        if (isHovered) {
            switch (type) {
                case "ipd":
                    return ipdActiveIcon;
                case "all_patients":
                    return patientsActiveIcon;
                case "data_analytics":
                    return analyticsActiveIcon;
                case "pharmacy":
                    return pharmacyActiveIcon;
                case "opd_billing":
                    return billingsActiveIcon;
                case "dr_followup_appointment":
                    return followUpActiveIcon;
                default:
                    return "";
            }
        } else {
            switch (type) {
                case "ipd":
                    return ipdIcon;
                case "all_patients":
                    return patientsIcon;
                case "data_analytics":
                    return analyticsIcon;
                case "pharmacy":
                    return pharmacyIcon;
                case "opd_billing":
                    return billingsIcon;
                case "dr_followup_appointment":
                    return followUpIcon;
                default:
                    return "";
            }
        }
    };

    return (
        <>
            <div className="SidebarDoctor">
                <NavLink to="/" replace={true} className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>
                    <i className='icon-calendarfill'></i>
                    <div className='mt-1 px-2'>{isMobile ? 'Appt' : <div className='text-truncate'>Appointment</div>}</div>
                </NavLink>

                {/* <NavLink to="/" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>
                    <i className='icon-patients'></i>
                    <div className='mt-1 px-2'>{isMobile ? 'Patients' : 'All Patients'}</div>
                </NavLink>
                <NavLink to="/" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>
                    <i className='icon-analytics'></i>
                    <div className='mt-1 px-2'>Analytics</div>
                </NavLink>
                <NavLink to="/" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>
                    <i className='icon-billings'></i>
                    <div className='mt-1 px-2'>Billings</div>
                </NavLink> */}

                {profile && profile?.module_data?.map((item, i) => {
                    const isHovered = hoveredItem === i;
                    return (
                        <NavLink key={i} onClick={() => clickOldModule(item.type)} replace={true} className={({ isActive, isPending }) =>
                            isHovered ? "" : isPending ? "pending" : isActive ? "" : "active"
                        }
                            onMouseEnter={() => setHoveredItem(i)} // Set the hovered item
                            onMouseLeave={() => setHoveredItem(null)} // Clear the hovered item
                        >
                            <img src={getIcon(item.type, isHovered)} alt={`${item.type}`} />
                            <div className='mt-1 px-2'>{item.title}</div>
                        </NavLink>
                    )
                })}

                {isApolloConsultationsEnabled &&
                    <NavLink to="/apollo-consultations" replace={true} className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                        onMouseEnter={() => setHoveredItem(true)} // Set the hovered item
                        onMouseLeave={() => setHoveredItem(null)} // Clear the hovered item
                    >
                        <img src={getIcon("data_analytics", hoveredItem || location.pathname === '/apollo-consultations')} alt="apollo" />
                        <div className='mt-1 px-2'>
                            <div>Apollo analytics</div>
                        </div>
                    </NavLink>
                }

                {profile?.ownerDoctor === 1 && (
                    <NavLink to="/bulk_messages" replace={true} className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }>
                        <i className='icon-calendarfill'></i>
                        <div className='mt-1 px-2'>
                            <div className='mt-1 px-2'>{isMobile ? 'Message' : <div className='text-truncate'>Messages</div>}</div>
                            <img src={newGif} className='mx-auto d-block text-center mb-2 position-absolute sidebar-message' style={{ right: -4, top: 6, zIndex: -1 }} alt='New' />
                        </div>
                    </NavLink>
                )}


                <Button className="btn btn-delete-prescription mx-auto d-block p-0 mt-2" onClick={() => window.Moengage.track_event("announcement_button_clicked")} id='beamerButton'>
                    <i className="icon-announcement fs-3"></i> <br />
                </Button>
                <img src={newGif} width={42} className='mx-auto d-block text-center mb-2' alt='New' />
            </div>
        </>
    )
}

export default React.memo(SidebarDoctor);