import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Table, Drawer, Checkbox, Dropdown } from "antd";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

import { useSelector, useDispatch } from "react-redux";
import { userCampaign } from "../redux/bulkMessagesSlice";

import emptyCampaign from '../assets/images/empty-campaign-history.svg'
import emptyPurchase from '../assets/images/empty-purchase-history.svg'
import newGif from '../assets/images/new-gif.gif';
import messagesVideo from '../assets/images/messages-video.jpg';

import MessageDetailedView from "../components/bulk_messages/MessageDetailedView";
import CommonModal from "../common/CommonModal";

import { TAB_CAMPAIGN, TAB_DRAFT, TAB_PURCHASE } from "../utils/constants";

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD'
const showDateFormat = 'MMM DD, YYYY'

function MessagesData() {

    const { userCampaignList, loading, popup } = useSelector((state) => state.bulkMessages);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(TAB_CAMPAIGN);
    const [date, setDate] = useState({
        startDate: moment().format(dateFormat),
        endDate: moment().format(dateFormat),
    });
    const [dateStatus, setDateStatus] = useState(null);
    const [messageDetailed, setMessageDetailed] = useState(false);

    let location = useLocation();

    useEffect(() => {
        if (popup) {
            showHideModal()
        }
    }, []);
    
    const showHideModal = useCallback(() => {
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            var sendData = {
                draft: selectedTab
            }
            if (date.startDate != date.endDate) {
                sendData['start_date'] = date.startDate;
                sendData['end_date'] = date.endDate;
            }
            // console.log(sendData)
            dispatch(userCampaign(sendData));
        }, 500);
        return () => {
            clearTimeout(timeOutId);
        };
    }, [selectedTab, date]);

    const [tabItems, setTabItems] = useState([
        {
            key: TAB_CAMPAIGN,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Queue"></i>
                    Campaign History
                </div>
            ),
        },
        {
            key: TAB_DRAFT,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Finished"></i>
                    Draft Campigns
                </div>
            ),
        },
        {
            key: TAB_PURCHASE,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Cancelled"></i>
                    Purchase History
                </div>
            ),
        },
    ]);

    const onChange = useCallback(
        (key) => {
            setSelectedTab(key);
        },
        [selectedTab]
    );

    const getMenuItems = (record) => {
        const items = [
            {
                label: <div onClick={() => handleMessageDetailed()}>Detailed View</div>,
                key: "detailed_view",
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

        return items;
    };

    const columns = [
        {
            title: "#",
            dataIndex: "srno",
            key: "srno",
            ellipsis: true,
            width: 70,
            render: (text, record, index) => (
                <div>{index + 1}</div>
            ),
        },
        {
            title: "MESSAGE TEXT",
            dataIndex: "message_text",
            key: "message_text",
            width: 310,
            render: (text, record) => (
                <div className="cursor-pointer" onClick={() => { handleMessageDetailed() }}>
                    <div>{record.campaign_name}</div>
                    <div className="text-truncate-twolines">
                        {record.msg}
                    </div>
                </div>
            ),
        },
        {
            title: "DATE & TIME",
            dataIndex: "date_time",
            key: "date_time",
            ellipsis: true,
            sorter: (a, b) => {
                const lhsDateTime = `${a.campaign_date} ${a.campaign_time}`;
                const lhsLongTime = moment(lhsDateTime, "Do MMM YYYY HH:mm A").valueOf();

                const rhsDateTime = `${b.campaign_date} ${b.campaign_time}`;
                const rhsLongTime = moment(rhsDateTime, "Do MMM YYYY HH:mm A").valueOf();

                const result = lhsLongTime - rhsLongTime;
                return result;
            },
            render: (text, record) => (
                <div>
                    {record.campaign_date}, <br />{record.campaign_time}
                </div>
            ),
        },
        {
            title: "MESSAGE TYPE",
            dataIndex: "send_on",
            key: "send_on",
            ellipsis: true,
            filters: [
                {
                    text: 'SMS',
                    value: 'SMS',
                },
                {
                    text: 'WhatsApp',
                    value: 'WhatsApp',
                },
            ],
            onFilter: (value, record) => record.send_on.startsWith(value),
            render: (text) => (
                <div> {text} </div>
            ),
        },
        {
            title: "Target Users",
            dataIndex: "total_patient",
            key: "total_patient",
            ellipsis: true,
            sorter: (a, b) => a.total_patient - b.total_patient,
            render: (text) => (
                <div> {text} </div>
            ),
        },
        {
            title: "CAMPAIGN STATUS",
            dataIndex: "campaign_status",
            key: "campaign_status",
            ellipsis: true,
            render: (text, record) => (
                <>
                    <div className={`${record.campaign_sent ? 'text-delivered' : 'text-scheduled'}`}>{record.campaign_sent ? `${record.total_patient} Delivered` : record.campaign_status}</div>
                    {/* <div className="text-faild mt-1">32 Not Delivered</div> */}
                </>
            ),
        },
        {
            key: "action",
            width: 70,
            render: (text, record) => (
                <Dropdown className="cursor-pointer"
                    menu={{
                        items: getMenuItems(record),
                    }}
                    trigger={['click']}>
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

    const rangePresets = [
        {
            label: <div className={`${!dateStatus ? 'active' : ''}`}>Till date</div>,
            value: [dayjs(), dayjs().endOf('day')],
        },
        {
            label: <div className={`${dateStatus === 1 ? 'active' : ''}`}>Last week</div>,
            value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 2 ? 'active' : ''}`}>Last month</div>,
            value: [dayjs().add(-1, 'M'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 3 ? 'active' : ''}`}>Last 3 month</div>,
            value: [dayjs().add(-3, 'M'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 4 ? 'active' : ''}`}>Last 6 month</div>,
            value: [dayjs().add(-6, 'M'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 5 ? 'active' : ''}`}>Last 1 year</div>,
            value: [dayjs().add(-1, 'y'), dayjs()],
        }
    ];

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            // console.log('From: ', dates[0], ', to: ', dates[1]);
            // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

            if (dayjs().add(-7, 'd').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(1);
            } else if (dayjs().add(-1, 'M').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(2);
            } else if (dayjs().add(-3, 'M').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(3);
            } else if (dayjs().add(-6, 'M').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(4);
            } else if (dayjs().add(-1, 'y').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(5);
            } else {
                setDateStatus(null);
            }
            setDate({
                startDate: moment(dateStrings[0], showDateFormat).format(dateFormat),
                endDate: moment(dateStrings[1], showDateFormat).format(dateFormat),
            });
        } else {
            setDateStatus(null);
            setDate({
                startDate: moment().format(dateFormat),
                endDate: moment().format(dateFormat),
            });
        }
    };

    const handleMessageDetailed = useCallback(
        () => {
            setMessageDetailed(!messageDetailed)
        },
        [messageDetailed]
    );

    return (
        <>
            <div className="border rounded-4 appointment-wrap dateborder">
                <Tabs
                    defaultActiveKey={TAB_CAMPAIGN}
                    items={tabItems}
                    className="tabs-massages"
                    onChange={onChange}
                    activeKey={selectedTab}
                />
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <div></div>
                        <RangePicker
                            presets={rangePresets}
                            format={showDateFormat}
                            onChange={onRangeChange}
                            popupClassName="massage-date"
                            className="massage-input"
                            inputReadOnly
                        // value={[date.startDate != date.endDate
                        //     ? dayjs(moment(date.startDate).format(showDateFormat), showDateFormat)
                        //     : "",
                        // date.startDate != date.endDate
                        //     ? dayjs(moment(date.endDate).format(showDateFormat), showDateFormat)
                        //     : ""]
                        // }
                        />
                    </div>

                    <Table
                        className="px-xl-4 px-0 table-message"
                        columns={columns}
                        dataSource={userCampaignList}
                        pagination={false}
                        locale={{ emptyText: emptyText }}
                        loading={loading}
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
                        <img src={messagesVideo} className="img-fluid w-100" />
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