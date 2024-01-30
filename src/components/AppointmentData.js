import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import {
    Tabs,
    Table,
    Space,
    Drawer,
    Select,
    Segmented,
    DatePicker,
    Dropdown,
    Input,
    Button,
    message
} from "antd";
import { Row, Col, ButtonGroup } from "react-bootstrap";
import dayjs from "dayjs";

import { TAB_QUEUE, TAB_FINISHED, TAB_CANCELLED } from "../utils/constants";
import noData from "../assets/images/nodata-found.svg";
import visitEnd from '../assets/images/end-visit.svg';
import ImgcancelEnd from '../assets/images/cancel-visit.svg';
import imgCloseVisit from '../assets/images/close-visit.svg';
import CommonModal from "../common/CommonModal";
import { MESSAGE_KEY } from "../utils/constants";

import { useSelector, useDispatch } from "react-redux";

import {
    getCaseTypes,
    getAllAppointment,
    cancelAppointments,
    endVisit
} from "../redux/appointmentsSlice";

const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD'
const showDateFormat = 'DD-MM-YYYY'

function AppointmentData() {

    const navigate = useNavigate();

    const { queueCount, finishedCount, cancelledCount, appointmentsData, caseTypes, loading, setOnLoad } = useSelector((state) => state.records);
    const dispatch = useDispatch();

    const [date, setDate] = useState({
        startDate: moment().format(dateFormat),
        endDate: moment().format(dateFormat),
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [pageNo, setPageNo] = useState(0);
    const [visitTypeFilters, setVisitTypeFilters] = useState('');

    const items = [
        {
            key: TAB_QUEUE,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Queue"></i>
                    Queue ({queueCount})
                </div>
            ),
        },
        {
            key: TAB_FINISHED,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Finished"></i>
                    Finished ({finishedCount})
                </div>
            ),
        },
        {
            key: TAB_CANCELLED,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Cancelled"></i>
                    Cancelled ({cancelledCount})
                </div>
            ),
        },
    ];
    const [selectedTab, setSelectedTab] = useState(TAB_QUEUE);

    const calanderOptions = [
        { value: 1, label: "Today" },
        { value: 2, label: "Next 7 Days" },
        { value: 3, label: "Next 30 Days" },
        { value: 4, label: "Last 7 Days" },
        { value: 5, label: "Last 30 Days" },
    ];
    const [selectedCalanderOptions, setSelectedCalanderOptions] = useState(1);

    const segmentedList = [
        { value: 1, icon: <i className="icon-List"></i> },
        { value: 2, icon: <i className="icon-calendar"></i> },
    ];
    const [segmented, setSegmented] = useState(1);
    const [appointmentSelectedFromMenu, setAppointmentSelectedFromMenu] = useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isEndVisitReasonModal, setEndVisitReasonModal] = useState(false);
    const [endVisitReasonDrawer, setEndVisitReasonDrawer] = useState(false);
    const [endVisitReason, setEndVisitReason] = useState('');

    useEffect(() => {
        dispatch(getCaseTypes());
    }, []);

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            var sendData = {
                startDate: date.startDate,
                endDate: date.endDate,
                apStatue: selectedTab,
                filterVisitType: visitTypeFilters,
                page: pageNo,
                search: searchQuery
            }
            // console.log(sendData)
            dispatch(getAllAppointment(sendData));
            // if (searchQuery) {
            //     const searchTimeOutId = setTimeout(() => {
            //         dispatch(getAllAppointment(sendData));
            //     }, 500);
            //     return () => {
            //         clearTimeout(searchTimeOutId);
            //     };
            // } else {
            //     dispatch(getAllAppointment(sendData));
            // }
        }, 500);
        return () => {
            clearTimeout(timeOutId);
        };
    }, [selectedTab, date, searchQuery, pageNo, visitTypeFilters]);

    useEffect(() => {
        if (date.startDate === date.endDate) {
            if (moment(moment(date.startDate).format(dateFormat)).isSame(moment().format(dateFormat), 'day')) {
                setSelectedCalanderOptions(1)
            } else {
                setSelectedCalanderOptions(null)
            }
        }
    }, [date]);

    const onChange = useCallback(
        (key) => {
            setPageNo(0)
            setVisitTypeFilters('')
            setDate({
                startDate: moment().format(dateFormat),
                endDate: moment().format(dateFormat),
            })
            setSelectedCalanderOptions(1)
            setSelectedTab(key);
        },
        [selectedTab]
    );

    const onSearch = useCallback(
        (query) => {
            setPageNo(0)
            setSearchQuery(query);
        },
        [searchQuery]
    );

    const onDateChange = useCallback(
        (date, dateString) => {
            if (dateString) {
                setPageNo(0)
                setDate({
                    startDate: moment(dateString, showDateFormat).format(dateFormat),
                    endDate: moment(dateString, showDateFormat).format(dateFormat),
                });
            }
        },
        [date]
    );

    const backDatePress = useCallback(
        () => {
            setPageNo(0)
            setDate({
                startDate: moment(date.startDate).subtract(1, 'day').format(dateFormat),
                endDate: moment(date.endDate).subtract(1, 'day').format(dateFormat),
            })
        },
        [date]);

    const nextDatePress = useCallback(
        () => {
            if (selectedTab !== TAB_QUEUE) {
                if (!moment(moment(date.startDate).format(dateFormat)).isSame(moment().format(dateFormat), 'day')) {
                    setPageNo(0)
                    setDate({
                        startDate: moment(date.startDate).add(1, 'day').format(dateFormat),
                        endDate: moment(date.endDate).add(1, 'day').format(dateFormat),
                    })
                } else {
                    message.open({
                        MESSAGE_KEY,
                        type: 'warning',
                        content: `Can't select next date`,
                        duration: 5,
                    });
                }
            } else {
                setPageNo(0)
                setDate({
                    startDate: moment(date.startDate).add(1, 'day').format(dateFormat),
                    endDate: moment(date.endDate).add(1, 'day').format(dateFormat),
                })
            }
        },
        [date]);

    const handleDateChange = useCallback(
        (value) => {
            setSelectedCalanderOptions(value)
            const updatedate = {
                startDate: moment().format(dateFormat),
                endDate: moment().format(dateFormat),
            }
            setPageNo(0)
            if (value === 1) {
                setDate(updatedate)
            } else if (value === 2) {
                setDate({
                    startDate: moment(updatedate.startDate).format(dateFormat),
                    endDate: moment(updatedate.endDate).add(7, 'day').format(dateFormat),
                })
            } else if (value === 3) {
                setDate({
                    startDate: moment(updatedate.startDate).format(dateFormat),
                    endDate: moment(updatedate.endDate).add(30, 'day').format(dateFormat),
                })
            } else if (value === 4) {
                setDate({
                    startDate: moment(updatedate.startDate).subtract(7, 'day').format(dateFormat),
                    endDate: moment(updatedate.endDate).format(dateFormat),
                })
            } else if (value === 5) {
                setDate({
                    startDate: moment(updatedate.startDate).subtract(30, 'day').format(dateFormat),
                    endDate: moment(updatedate.endDate).format(dateFormat),
                })
            } else {
                setDate(null)
            }
        },
        [selectedCalanderOptions, date]
    );

    const segmentedChange = useCallback(
        (key) => {
            setSegmented(key);
        },
        [segmented]
    );

    const getVisitTypeFilters = () => {
        return caseTypes.map((e) => {
            return {
                text: e.toct_type,
                value: e.toct_id,
            };
        });
    };

    const getMenuItems = (record) => {
        const items = [
            {
                label: <Link to="/patient_details" state={{ patient_data: record }}>Patient Details</Link>,
                key: "patientdetails",
            },
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleConfirmationModal()
                    }}>Cancel Appt.</span>,
                key: "cancelappt",
            },
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleEndVisitReasonDrawer()
                    }}>End Visit</span>,
                key: "endvisit",
            },
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleEndVisitReasonModal();
                    }}>End Visit Reason</span>,
                key: "endvisitreason",
            },
        ];

        if (selectedTab === TAB_QUEUE) {
            return items.filter((item) => item.key !== "endvisitreason");
        } else if (selectedTab === TAB_FINISHED) {
            return items.filter((item) => item.key !== "endvisit" && item.key !== "cancelappt");
        } else if (selectedTab === TAB_CANCELLED) {
            return items.splice(0, 1);
        } else {
            return items;
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "srno",
            key: "srno",
            ellipsis: true,
            width: 80,
            className: "fs-14",
            render: (text, record, index) => (
                <div>
                    <span>{index + 1}</span>
                </div>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            render: (text, record) => (
                <div>
                    <span className="text-primary">{record.pm_fullname}</span>
                    <br />
                    <small>
                        {record.pm_gender}, {record.ageYears}y
                    </small>
                </div>
            ),
        },
        {
            title: "Contact",
            dataIndex: "pm_contact_no",
            key: "pm_contact_no",
            ellipsis: true,
        },
        {
            title: "Visit Type",
            dataIndex: "toct_type",
            key: "toct_type",
            ellipsis: true,
            filteredValue: visitTypeFilters.split(',') || '',
            filters: getVisitTypeFilters()
        },
        {
            title: "Slot",
            dataIndex: "time",
            key: "time",
            ellipsis: true,
            sorter: (a, b) => {

                const lhsDateTime = `${a.apDate} ${a.apTime}`;
                const lhsLongTime = moment(lhsDateTime, "Do MMM YYYY HH:mm A").valueOf();

                const rhsDateTime = `${b.apDate} ${b.apTime}`;
                const rhsLongTime = moment(rhsDateTime, "Do MMM YYYY HH:mm A").valueOf();

                const result = lhsLongTime - rhsLongTime;
                return result;
            },
            render: (text, record) => (
                <div>
                    <span className="text-lowercase">{record.apTime} </span> <br /> <small> {record.apDate}</small>
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: 170,
            render: (_, record) => (
                <div size="middle">
                    {selectedTab !== TAB_CANCELLED && (
                        <button className="btn btn-outline-primary btn-consult" onClick={() => selectedTab === TAB_QUEUE ? navigate("/prescription", { state: { patient_data: record } }) : alert('comming soon')}>
                            {selectedTab === TAB_FINISHED ? "PrintRx" : "Consult"}
                        </button>
                    )}
                    <Dropdown
                        className="btn btn-outline btn-more ms-3"
                        menu={{
                            items: getMenuItems(record),
                        }}
                        trigger={["click"]}
                    >
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <i className="icon-More" />
                        </a>
                    </Dropdown>
                </div>
            ),

        },
    ];

    const handleChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        setVisitTypeFilters(filters.toct_type ? filters.toct_type.toString() : '');
    };

    const emptyText = (
        <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ height: "calc(100vh - 350px)" }}
        >
            <img src={noData} alt="Warning" />
            <div className="mt-3 fontroboto fw-normal">
                {selectedTab === TAB_QUEUE
                    ? "There are no patients in your queue right now!"
                    : selectedTab === TAB_FINISHED
                        ? "You haven't finished any consultations or ended the visit yet."
                        : "Nothing here! You haven’t cancelled any appointments here."}
            </div>
        </div>
    );

    const loadMoreData = useCallback(
        () => {
            setPageNo(pageNo + 1)
        },
        [pageNo]
    );

    const handleConfirmationModal = useCallback(
        () => {
            setConfirmationModalOpen(!isConfirmationModalOpen)
        },
        [isConfirmationModalOpen]
    );

    const handleEndVisitReasonModal = useCallback(
        () => {
            setEndVisitReasonModal(!isEndVisitReasonModal)
        },
        [isEndVisitReasonModal]
    );

    const handleEndVisitReasonDrawer = useCallback(
        () => {
            setEndVisitReasonDrawer(!endVisitReasonDrawer)
        },
        [endVisitReasonDrawer]
    );

    const onEndVisitReasonChange = useCallback(
        (e) => {
            setEndVisitReason(e.target.value)
        },
        [endVisitReason]
    );

    const CONFIRMATION_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={isConfirmationModalOpen}
                modalWidth={610}
                title={"Are you sure you want to cancel this appointment?"}
                onCancel={handleConfirmationModal}
                modalBody={
                    <>
                        <div className="border bg-body rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <i className="icon-patients me-2" />

                                <span className="title-common fontroboto">
                                    {appointmentSelectedFromMenu?.pm_fullname}
                                    <span className="fw-normal ms-2">
                                        (
                                        {appointmentSelectedFromMenu?.pm_gender},{" "}
                                        {appointmentSelectedFromMenu?.ageYears}y)
                                    </span>
                                </span>
                            </div>
                            <div className="mt-2 d-flex align-items-center">
                                <i className="icon-phone me-2" />{" "}
                                <span>{appointmentSelectedFromMenu?.pm_contact_no}</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i className="icon-Id me-2" />{" "}
                                <span>{appointmentSelectedFromMenu?.pm_pid}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2">
                                <Button
                                    type="text"
                                    className="btn btn-primary2 align-items-center text-primary btn-41 me-4 w-50"
                                    onClick={handleConfirmationModal}>
                                    No, Keep Appointment{" "}
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-primary3 align-items-center btn-41 w-50"
                                    loading={loading}
                                    onClick={async () => {
                                        const sendData = {
                                            pam_id: appointmentSelectedFromMenu.pam_id,
                                            patient_unique_id: appointmentSelectedFromMenu.patient_unique_id,
                                            pm_id: appointmentSelectedFromMenu.pm_id,
                                            pm_pid: appointmentSelectedFromMenu.pm_pid
                                        };
                                        const action = await dispatch(cancelAppointments(sendData));
                                        if (action.meta.requestStatus == "fulfilled") {
                                            handleConfirmationModal()
                                            message.open({
                                                MESSAGE_KEY,
                                                type: '',
                                                className: 'message-appointment',
                                                content: (
                                                    <div className='d-flex align-items-center'>
                                                        <img src={ImgcancelEnd} className='me-3' />
                                                        <div>
                                                            <div className='title-common text-start fontroboto'>Appointment Cancelled Successfully</div>
                                                            <div className='fontroboto text-start fw-normal mt-1'>View cancelled appointments in Cancelled tab.</div>
                                                        </div>
                                                        <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
                                                    </div>
                                                ),
                                                duration: 5,
                                            });
                                        }
                                    }}>
                                    Yes, Cancel Appointment{" "}
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        );
    }, [isConfirmationModalOpen]);

    const END_VISIT_REASON_DISPLAY_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={isEndVisitReasonModal}
                modalWidth={610}
                title={
                    <>
                        <div className="d-flex align-items-center">
                            <i className="icon-patients me-2" />
                            <span className="title-common fontroboto">
                                {appointmentSelectedFromMenu?.pm_fullname}
                                <span className="fw-normal ms-2">
                                    (
                                    {appointmentSelectedFromMenu?.pm_gender},{" "}
                                    {appointmentSelectedFromMenu?.ageYears}y)
                                </span>
                            </span>
                        </div>
                    </>
                }
                onCancel={handleEndVisitReasonModal}
                modalBody={
                    <>
                        <div className="mb-2 fw-medium fs-16">End Visit Reason</div>
                        <div className="border bg-body rounded-10px p-3 patient-details" style={{minHeight: 100}}>
                            {appointmentSelectedFromMenu?.tpvl_remarks}
                        </div>
                    </>
                }
            />
        );
    }, [isEndVisitReasonModal]);

    const onEndVisitClick = async () => {
        const sendData = {
            pam_id: appointmentSelectedFromMenu.pam_id,
            patient_unique_id: appointmentSelectedFromMenu.patient_unique_id,
            pm_id: appointmentSelectedFromMenu.pm_id,
            pm_pid: appointmentSelectedFromMenu.pm_pid,
            tpvl_remarks: endVisitReason
        };
        const action = await dispatch(endVisit(sendData));
        if (action.meta.requestStatus == "fulfilled") {
            setEndVisitReason('')
            handleEndVisitReasonDrawer()

            message.open({
                MESSAGE_KEY,
                type: '',
                className: 'message-appointment',
                content: (
                    <div className='d-flex align-items-center'>
                        <img src={visitEnd} className='me-3' />
                        <div>
                            <div className='title-common fontroboto'>{`${appointmentSelectedFromMenu?.pm_first_name}’s visit end successfully.`}</div>
                            <div className='fontroboto text-start fw-normal mt-1'>View end visits in Finished tab.</div>
                        </div>
                        <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
                    </div>
                ),
                duration: 5,
            });

        }
    }

    const disabledDate = (current) => {
        // Can not select days before today and today
        // return current && current > dayjs().endOf("day");
        return current && current >= moment().add(1, 'days').startOf('day');
    };

    return (
        <div className="border rounded-4 appointment-wrap dateborder">
            <Tabs
                defaultActiveKey={TAB_QUEUE}
                items={items}
                onChange={onChange}
                activeKey={selectedTab}
            />
            <div className="appointment-data">
                <Row className="justify-content-between align-items-center my-3 px-4">
                    <Col xl={4} lg={4}>
                        <Input
                            value={searchQuery}
                            placeholder="Search patient by name and mobile number"
                            className="inputheight38"
                            prefix={<i className="icon-search" />}
                            suffix={searchQuery.length > 0 && <i className="icon-Cross" onClick={() => onSearch('')}></i>}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </Col>
                    <Col md="auto">
                        <div className="d-flex align-items-center">
                            <ButtonGroup aria-label="Basic example" className="appointment-date-group">
                                <Button
                                    variant="outline-light"
                                    className="dateoutline"
                                    disabled={date.startDate !== date.endDate}
                                    onClick={backDatePress}>
                                    <i className="icon-right d-block text-main"></i>
                                </Button>
                                <Button variant="outline-light" className="p-0 antround-0">
                                    <DatePicker
                                        inputReadOnly
                                        format={showDateFormat}
                                        placeholder={showDateFormat.toLowerCase()}
                                        // disabled={date.startDate != date.endDate}
                                        disabledDate={selectedTab !== TAB_QUEUE && disabledDate}
                                        defaultValue={dayjs(moment(date.startDate).format(showDateFormat), showDateFormat)}
                                        value={
                                            date.startDate == date.endDate
                                                ? dayjs(moment(date.startDate).format(showDateFormat), showDateFormat)
                                                : ""
                                        }
                                        onChange={onDateChange}

                                    />
                                </Button>
                                <Button
                                    variant="outline-light"
                                    className="dateoutline"
                                    disabled={date.startDate !== date.endDate}
                                    onClick={nextDatePress}>
                                    <i className="icon-right text-main d-block iconrotate90"></i>
                                </Button>
                            </ButtonGroup>
                            <Select
                                placeholder="Select Period"
                                className="ms-3 appointmentselect"
                                value={selectedCalanderOptions}
                                options={selectedTab === TAB_QUEUE ? calanderOptions.filter(e => [1, 2, 3].includes(e.value)) : calanderOptions.filter(e => [1, 4, 5].includes(e.value))}
                                onChange={handleDateChange}
                            />
                            {/* <Segmented
                                className="ms-3 appointment-segment"
                                defaultValue={1}
                                options={segmentedList}
                                onChange={segmentedChange}
                            /> */}
                        </div>
                    </Col>
                </Row>
                {segmented == 1 ? (
                    <div>
                        <>
                            <Table
                                className="px-xl-4 px-0"
                                columns={columns}
                                dataSource={appointmentsData}
                                onChange={handleChange}
                                pagination={false}
                                loading={loading}
                                locale={{ emptyText: emptyText }}
                            />
                            {appointmentsData.length >= 10 && setOnLoad && (
                                <button
                                    className="btn btn-light w-100 mt-3 load-more"
                                    onClick={loadMoreData}>
                                    Show More
                                </button>
                            )}
                        </>
                    </div>
                ) : (
                    <h1>Grid View</h1>
                )}
                {CONFIRMATION_MODAL}
                {END_VISIT_REASON_DISPLAY_MODAL}
            </div>
            <Drawer
                className="modalWidth-700" width="auto"
                title="End Visit"
                placement="right"
                closable
                open={endVisitReasonDrawer}
                onClose={handleEndVisitReasonDrawer}
                extra={
                    <Button
                        type='button'
                        onClick={onEndVisitClick}
                        className="btn-41 btn px-4 btn-primary3"
                        loading={loading}
                        disabled={!endVisitReason}>
                        Done
                    </Button>
                }
                key="left"
            >
                <div className="p-4">
                    <div className="title-common mb-2">Reason</div>
                    <TextArea
                        // showCount
                        className="endreason-textarea"
                        // maxLength={100}
                        value={endVisitReason}
                        placeholder="Enter reason for end visit"
                        onChange={onEndVisitReasonChange}
                        style={{
                            height: 200,
                            resize: "none",
                        }}
                    />
                </div>
            </Drawer>
        </div>
    );
}

export default React.memo(AppointmentData);
