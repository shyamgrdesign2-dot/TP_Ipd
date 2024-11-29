import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Table, Drawer, Checkbox } from "antd";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import emptyCampaign from '../assets/images/empty-campaign-history.svg'
import emptyPurchase from '../assets/images/empty-purchase-history.svg'
import newGif from '../assets/images/new-gif.gif';
import playcover2 from '../assets/images/play-cover2.png';
// import "../components/bulk_messages/messages.scss";
import { TAB_QUEUE, TAB_FINISHED, TAB_CANCELLED } from "../utils/constants";
import Dropdown from "antd/es/dropdown/dropdown";
import MessageDetailedView from "../components/bulk_messages/MessageDetailedView";
import CommonModal from "../common/CommonModal";

function MessagesData() {

    const [messageDetailed, setMessageDetailed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [locationPath, setLocationPath] = useState("/bulk_messages");
    let location = useLocation();
    useEffect(() => {
        setLocationPath(location.pathname);
        showHideModal()
    }, [location]);


    const handleMessageDetailed = useCallback(
        () => {
            setMessageDetailed(!messageDetailed)
        },
        [messageDetailed]
    );

    const items = [
        {
            label: <div
                onClick={() => {
                    handleMessageDetailed()
                }}>Detailed View</div>,
            key: 'detailed_view',
        },
        {
            label: <div>Edit campaign</div>,
            key: 'edit_campaign',
        },
        {
            label: <div>Delete campaign</div>,
            key: 'delete_campaign',
        },
        {
            label: <div>Reuse campaign</div>,
            key: 'reuse_campaign',
        },
    ];


    const [tItems, setItems] = useState([
        {
            key: TAB_QUEUE,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Queue"></i>
                    Campaign History
                </div>
            ),
        },
        {
            key: TAB_FINISHED,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Finished"></i>
                    Draft Campigns
                </div>
            ),
        },
        {
            key: TAB_CANCELLED,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Cancelled"></i>
                    Purchase History
                </div>
            ),
        },
    ]);

    const columns = [
        {
            title: "#",
            dataIndex: "srno",
            key: "srno",
            ellipsis: true,
            width: 70,
            render: (record, text, index) => (
                <div>{index + 1}</div>
            ),
        },
        {
            title: "MESSAGE TEXT",
            dataIndex: "message_text",
            key: "message_text",
            width: 310,
            render: () => (
                <div className="cursor-pointer" onClick={() => { handleMessageDetailed() }}>
                    <div>Medical Camp</div>
                    <div className="text-truncate-twolines">
                        Hi, Ashish Clinic is holding a Diabetes camp from 26/11/2024 to 28/11/2024 between 6:00AM to 12:00PM at Koramangla . Ashish - TatvaPractice
                    </div>
                </div>
            ),
        },
        {
            title: "DATE & TIME",
            dataIndex: "date_time",
            key: "date_time",
            ellipsis: true,
            sorter: () => { },
            render: () => (
                <div>
                    26 Nov 2023, <br />09:58 AM
                </div>
            ),
        },
        {
            title: "MESSAGE TYPE",
            dataIndex: "message_type",
            key: "message_type",
            ellipsis: true,
            render: () => (
                <div> SMS </div>
            ),
        },
        {
            title: "Target Users",
            dataIndex: "target_users",
            key: "target_users",
            ellipsis: true,
            sorter: () => { },
            render: () => (
                <div> 524 </div>
            ),
        },
        {
            title: "CAMPAIGN STATUS",
            dataIndex: "campaign_status",
            key: "campaign_status",
            ellipsis: true,
            render: () => (
                <>
                    {/* <div className="text-scheduled">Scheduled for later</div> */}

                    <div className="text-delivered">400 Delivered</div>
                    <div className="text-faild mt-1">32 Not Delivered</div>
                </>
            ),
        },
        {
            key: "action",
            width: 70,
            render: () => (
                <Dropdown className="cursor-pointer" menu={{ items }} trigger={['click']}>
                    <i className='icon-More'></i>
                </Dropdown>
            ),
        },
    ];

    const emptyText = (
        <div className="d-flex flex-column align-items-center justify-content-center"
            style={{ height: "calc(100vh - 350px)" }}>
            <img width={221.54} height={180} src={emptyCampaign} alt="Empty" />
            {/* <img src={emptyPurchase} alt="Empty" /> */}
            <div className="fs-16 fw-medium"> You haven't created any SMS or WhatsApp campaigns yet!</div>
            <div className="mt-2 lh-normal fs-14 fw-normal">Start creating campaigns to keep your patients </div>
            <div className="mt-2 lh-normal fs-14 fw-normal">informed and engaged</div>
            {/* <div className="mt-3 fs-16 fw-medium"> You haven't purchased any credits yet!</div>
            <div>Start buying credits to keep your messages flowing.</div> */}
            <Button
                variant="primary"
                className="px-3 mt-4 btn-41 d-flex align-items-center">
                <i className="icon-Add me-2"></i>
                {"Create New Campaign"}
            </Button>
            {/* <Button
                variant="primary"
                className="px-3 btn-41 ms-3 d-flex align-items-center">
                <i className="icon-Add me-2"></i>
                {"Buy Credits"}
            </Button> */}
        </div>
    );

    const showHideModal = useCallback(() => {
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);


    return (
        <>
            <div className="border rounded-4 appointment-wrap dateborder">
                <Tabs
                    defaultActiveKey={TAB_QUEUE}
                    items={tItems}
                    className="tabs-massages"
                />
                <div>
                    <Table
                        className="px-xl-4 px-0 table-message"
                        columns={columns}
                        dataSource={[{}, {}, {}]}
                        pagination={false}
                        locale={{ emptyText: emptyText }}
                    />
                </div>
            </div>
            <Drawer
                className="modalWidth-700" width="auto"
                title="Detailed View (Medical Camp)"
                placement="right"
                closable
                open={messageDetailed}
                onClose={handleMessageDetailed}
            >
                <MessageDetailedView handleMessageDetailed={handleMessageDetailed} replace={false} />
            </Drawer>

            <CommonModal
                isModalOpen={isModalOpen}
                onCancel={showHideModal}
                modalWidth={520}
                title={
                    <>
                        Messages
                        <img src={newGif} width={38} className="ms-2" alt='New' />
                    </>
                }
                modalBody={
                    <>
                        <img src={playcover2} className="img-fluid w-100" />
                        <div className="titleprint fw-semibold mt-4">
                            Reach Your Patients Easily with Messages!
                        </div>
                        <div className="mt-2">
                            This feature allow you to send important updates, reminders, and personalized health tips to your patients all in one place! This feature is designed to save you time, improve communication, and keep your patients engaged in their health journey
                        </div>
                        <Checkbox className="switch-name-check mt-4">Don’t show this again</Checkbox>
                        <div className="mt-4">
                            <Button onClick={showHideModal} className="lh-lg btn btn-primary3 btn-41 w-100">
                                <span>Got it</span>
                            </Button>
                        </div>
                    </>
                }
            />
        </>
    );
}

export default React.memo(MessagesData);