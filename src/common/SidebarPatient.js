import React from 'react';
import Nav from 'react-bootstrap/Nav';

function SidebarPatient({ collapsed }) {

    const menu = [
        { icon_name: 'icon-Visit-Summary', short_title: 'Visit', long_title: 'Visit Summary' },
        { icon_name: 'icon-Report', short_title: 'Reports', long_title: 'Medical Reports (3)' },
        { icon_name: 'icon-Discharge-Summary', short_title: 'Discharge', long_title: 'Discharge Summary' },
        { icon_name: 'icon-Medical-Certificate', short_title: 'Certificate', long_title: 'Medical Certificate' },
        { icon_name: 'icon-billings', short_title: 'Add Bill', long_title: 'Add Bill/Payment' },
        { icon_name: 'icon-More', short_title: '', long_title: 'More Options' }
    ]

    return (
        <div>
            <div className={`d-flex align-items-center rounded-3 m-2 text-truncate ${collapsed ? '' : 'bg-body p-2'}`}>
                <div className={`rounded-pill patientProfile border ${collapsed ? 'mx-auto' : 'me-2'}`}>
                    AP
                </div>
                {!collapsed && (
                    <div className='text-truncate'>
                        <div className='patientName d-flex align-items-center'> <div className='text-truncate pt-2px'>Ashish Patel</div> <button className='btn p-0 ms-2'><i className='icon-Edit text-primary'></i></button> </div>
                        <p className='mb-0'>M, 28y, +91-7894561230</p>
                    </div>
                )}
            </div>
            <hr />
            {menu.map((item, index) => {
                return (
                    <div>
                        <Nav.Item className={collapsed && 'text-center'}>
                            <Nav.Link href="/" className={`${index == 0 && 'active'} ${!collapsed && 'd-flex align-items-center'}`}>
                                <i className={item.icon_name}></i>
                                <div className={collapsed ? 'text-truncate' : 'ms-3'}>{collapsed ? item.short_title : item.long_title}</div>
                            </Nav.Link>
                        </Nav.Item>
                        {index == menu.length - 2 && <hr className='my-1' />}
                    </div>
                )
            })}
        </div>
    )
}
export default React.memo(SidebarPatient)