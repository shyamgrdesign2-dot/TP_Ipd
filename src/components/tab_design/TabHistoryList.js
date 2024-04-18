import React from "react";
import { Button, Collapse } from 'antd';

function TabHistoryList(props) {

    const { handleDrawerHistory, handleCollapsed } = props

    // Accordian for History
    const accordionItems = [
        {
            key: '1',
            label: <div className="fw-bold">Medical Problems</div>,
            children: "ldldl",
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
            <div className="overflow-y-auto" style={{ height: "calc(100vh - 109px)" }}>
                <div className="p-10">
                    <Button className='btn btn-input d-flex w-100 align-items-center btn-41' onClick={handleDrawerHistory}>
                        <i className='icon-Add me-2 fs-21'></i>
                        Add or Edit History
                    </Button>
                    <div className="border rounded-3 bg-body mt-3 p-3">
                        <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian history-sider-box" expandIconPosition={'end'} />
                    </div>
                </div>
            </div>
        </>
    );
}


export default React.memo(TabHistoryList);
