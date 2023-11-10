import React from 'react';
import Nav from 'react-bootstrap/Nav';
function SidebarDoctor() {
    return (
        <>
            <div className="SidebarDoctor">
                <Nav.Item>
                    <Nav.Link href="/" className='active'>
                        <i className='icon-calendar'></i>
                        <div className='mt-1'>Appointment</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/">
                        <i className='icon-patients'></i>
                        <div className='mt-1'>All Patients</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/">
                        <i className='icon-analytics'></i>
                        <div className='mt-1'>Analytics</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/">
                    <i className='icon-billings'></i>
                        <div className='mt-1'>Billings</div>
                    </Nav.Link>
                </Nav.Item>
            </div>
        </>
    )
}
export default SidebarDoctor