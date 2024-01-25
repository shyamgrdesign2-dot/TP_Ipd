import React from 'react';
import { isMobile } from 'react-device-detect';
import { NavLink } from "react-router-dom";

function SidebarDoctor() {
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
            </div>
        </>
    )
}

export default React.memo(SidebarDoctor)