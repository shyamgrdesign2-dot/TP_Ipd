import React, { useEffect } from 'react';
import { Button } from "antd";
import { isMobile } from 'react-device-detect';
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";

import { useLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import newGif from '../assets/images/new-gif.gif';

function SidebarDoctor() {

    const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    const { profile } = useSelector((state) => state.doctors);

    useEffect(() => {
        if (profile) {
            const getStorageData = async () => {
                const token = await getToken()
                if (token !== undefined) {
                    try {
                        var decoded = jwtDecode(token);
                        window.beamer_config = {
                            ...window.beamer_config,
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

                <Button className="btn btn-delete-prescription mx-auto d-block p-0 mt-2" id='beamerButton'>
                    <i className="icon-announcement fs-3"></i> <br />
                </Button>
                <img src={newGif} width={42} className='mx-auto d-block text-center' alt='New' />

            </div>
        </>
    )
}

export default React.memo(SidebarDoctor)