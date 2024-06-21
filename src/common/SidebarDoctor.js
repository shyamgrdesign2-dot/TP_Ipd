import React, { useState, useEffect } from 'react';
import { Button } from "antd";
import { isMobile } from 'react-device-detect';
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import config from "../config";
import { useLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import newGif from '../assets/images/new-gif.gif';

function SidebarDoctor() {

    const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    const { profile } = useSelector((state) => state.doctors);
    const [tokenData, setTokenData] = useState(null);

    const [url, setUrl] = useState('');

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
                console.log(`${data.url}&module=${moduleName}`)
                // await window.open(`${data.url}&module=${moduleName}`);
             setUrl(`${data.url}&module=${moduleName}`);
            }
        });
    }
    async function SSO_TO_PM() {
        try {
            const sendData = {
                doctor_unique_id: tokenData.doctor_unique_id,
                mobile_no: tokenData.mobile_no
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

                <Button className="btn btn-delete-prescription mx-auto d-block p-0 mt-2" onClick={() => window.Moengage.track_event("announcement_button_clicked")} id='beamerButton'>
                    <i className="icon-announcement fs-3"></i> <br />
                </Button>
                <img src={newGif} width={42} className='mx-auto d-block text-center' alt='New' />

                <br />

                {/* <NavLink onClick={() => clickOldModule('opd_billing')} replace={true} className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "" : "active"
                }>
                    <i className='icon-billings'></i>
                    <div className='mt-1 px-2'>{isMobile ? 'OPD Bill' : <div className='text-truncate'>OPD Billing</div>}</div>
                </NavLink> */}

                <NavLink onClick={() => clickOldModule('opd_billing')} replace={true} className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "" : "active"
                }>
                    <i className='icon-billings'></i>
                    <div className='mt-1 px-2'>{isMobile ? 'OPD Bill' : <div className='text-truncate'>OPD Billing</div>}</div>

                    {url && (
                        <iframe
                            title=""
                            src={url}
                            frameBorder="0"
                            style={{width: 'calc(100vw - 110px)', height: '100vh', right: 0, top: 0, position: 'fixed', zIndex: 99}}
                        />
                    )}
                </NavLink>

            </div>
        </>
    )
}

export default React.memo(SidebarDoctor);