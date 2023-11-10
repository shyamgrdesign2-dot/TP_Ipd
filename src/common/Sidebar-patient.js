import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LeftOutlined } from '@ant-design/icons';
function SidebarPatient() {
    return (
        <>
            <div className="SidebarDoctor SidebarPatient">
                <div className='d-flex align-items-center justify-content-between'>
                    <button type='button' className='btn btn-action d-flex align-items-center'>
                        <LeftOutlined /> &nbsp; Back
                    </button>
                    <button type='button' className='btn btn-action'>
                        <i className='icon-Contract'></i>
                    </button>
                </div>
                <div className='bg-body d-flex align-items-center rounded-3 p-2 m-2 text-truncate'>
                    <div className='rounded-pill patientProfile border me-2'>
                        AP
                    </div>
                    <div className='text-truncate'>
                        <div className='patientName d-flex align-items-center'> <div className='text-truncate pt-2px'>Ashish Patel Ashish Patel Ashish Patel</div> <button className='btn p-0 ms-2'><i className='icon-Edit'></i></button> </div>
                        <p className='mb-0'>M, 28y, +91-7894561230</p>
                    </div>
                </div>
                <hr />
                <Nav.Item>
                    <Nav.Link href="/" className='active d-flex align-items-center'>
                        <i className='icon-Visit-Summary'></i>
                        <div className='ms-3'>Visit Summary</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/" className='d-flex align-items-center'>
                        <i className='icon-Report'></i>
                        <div className='ms-3'>Medical Reports (3)</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/" className='d-flex align-items-center'>
                        <i className='icon-Discharge-Summary'></i>
                        <div className='ms-3'>Discharge Summary</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/" className='d-flex align-items-center'>
                    <i className='icon-Medical-Certificate'></i>
                        <div className='ms-3'>Medical Certificate</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/" className='d-flex align-items-center'>
                    <i className='icon-billings'></i>
                        <div className='ms-3'>Add Bill/Payment</div>
                    </Nav.Link>
                </Nav.Item>
                <hr className='my-1' />
                <Nav.Item>
                    <Nav.Link href="/" className='d-flex align-items-center'>
                    <i className='icon-More'></i>
                        <div className='ms-3'>More Options</div>
                    </Nav.Link>
                </Nav.Item>
            </div>
        </>
    )
}
export default SidebarPatient