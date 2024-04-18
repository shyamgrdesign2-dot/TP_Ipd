import React from "react";
import { Button, Collapse } from 'antd';

function TabHistoryList(props) {

    const { handleDrawerHistory, handleCollapsed } = props

    // Accordian for History
    const accordionItems = [
        {
            key: '1',
            label: <div className="fw-semibold">Medical Problems</div>,
            children: 
            <>
                <div className="d-flex align-items-center my-2">
                    <div className="text-history font-roboto fw-medium">Issue&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-history fw-normal">&nbsp;Diabetes</div>
                </div>
                <div className="d-flex align-items-center my-2">
                    <div className="text-history fontroboto fw-medium">Since&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-history fw-normal">&nbsp;1 Year</div>
                </div>
                <div className="d-flex align-items-center my-2">
                    <div className="text-history fontroboto fw-medium">Status&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-history fw-normal">&nbsp;Active</div>
                </div>
                <div className="my-2">
                    <div className="text-history fontroboto fw-medium">Notes&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-main fw-normal fs-12-1 border rounded-3 px-2 py-5px-3px text-truncate-threelines">Cannot get exposed to dust which comes after sweeping Cannot get exposed to dust which comes after sweeping</div>
                </div>
                <div className="fontroboto text-history fw-normal">No Hypothyroidism</div>
            </>
        },
    ];

    const accordionItems2 = [
        {
            key: '2',
            label: <div className="fw-semibold">Allergies</div>,
            children: 
            <>
                <div className="d-flex align-items-center my-2">
                    <div className="text-history font-roboto fw-medium">Issue&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-history fw-normal">&nbsp;Diabetes</div>
                </div>
                <div className="d-flex align-items-center my-2">
                    <div className="text-history fontroboto fw-medium">Since&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-history fw-normal">&nbsp;1 Year</div>
                </div>
                <div className="d-flex align-items-center my-2">
                    <div className="text-history fontroboto fw-medium">Status&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-history fw-normal">&nbsp;Active</div>
                </div>
                <div className="my-2">
                    <div className="text-history fontroboto fw-medium">Notes&nbsp;:&nbsp;</div>
                    <div className="fontroboto text-main fw-normal fs-12-1 border rounded-3 px-2 py-5px-3px text-truncate-threelines">Cannot get exposed to dust which comes after sweeping Cannot get exposed to dust which comes after sweeping</div>
                </div>
                <div className="fontroboto text-history fw-normal">No Hypothyroidism</div>
            </>
        },
    ];

    return (
        <>
            <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
                History
                <Button type="text" className="btn p-0 btn-outline" onClick={handleCollapsed}>
                    <i className='icon-Contract fs-21 text-white p-0'></i>
                </Button>
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(100vh - 247px)" }}>
                <div className="p-10">
                    <Button className='btn btn-input d-flex w-100 align-items-center btn-41' onClick={handleDrawerHistory}>
                        <i className='icon-Add me-2 fs-21'></i>
                        Add or Edit History
                    </Button>
                    <div className="border rounded-3 bg-body mt-3 p-10">
                        <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian history-sider-box" expandIconPosition={'end'} />
                        <Collapse items={accordionItems2} defaultActiveKey={['2']} className="prescriptiontab-accordian history-sider-box" expandIconPosition={'end'} />
                    </div>
                </div>
            </div>
        </>
    );
}


export default React.memo(TabHistoryList);
