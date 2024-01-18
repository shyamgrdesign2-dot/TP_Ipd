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
} from "antd";
import { Row, Col, ButtonGroup } from "react-bootstrap";
import dayjs from "dayjs";

import { getFormattedDate } from "../utils/utils";
import { TAB_QUEUE, TAB_FINISHED, TAB_CANCELLED } from "../utils/constants";
import noData from "../assets/images/nodata-found.svg";
import CommonModal from "../common/CommonModal";

import { useSelector, useDispatch } from "react-redux";

import {
    getCaseTypes,
    getAllAppointment,
    cancelAppointments,
    endVisit
} from "../redux/appointmentsSlice";

const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD'

function AppointmentData() {

    const navigate = useNavigate();

    const { queueCount, finishedCount, cancelledCount, appointmentsData, caseTypes, loading, setOnLoad } = useSelector((state) => state.records);
    const dispatch = useDispatch();

    const [date, setDate] = useState({
        startDate: getFormattedDate(moment().format(dateFormat)),
        endDate: getFormattedDate(moment().format(dateFormat)),
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
        { value: '1', label: "Today" },
        { value: '2', label: "Next 7 Days" },
        { value: '3', label: "Next 30 Days" },
    ];

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
        var sendData = {
            startDate: date.startDate,
            endDate: date.endDate,
            apStatue: selectedTab,
            filterVisitType: visitTypeFilters,
            page: pageNo,
            search: searchQuery
        }
        // console.log(sendData)
        if (searchQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(getAllAppointment(sendData));
            }, 500);
            return () => {
                clearTimeout(timeOutId);
            };
        } else {
            dispatch(getAllAppointment(sendData));
        }
    }, [selectedTab, date, searchQuery, pageNo, visitTypeFilters]);

    const onChange = useCallback(
        (key) => {
            setPageNo(0)
            setVisitTypeFilters('')
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
                    startDate: getFormattedDate(dateString),
                    endDate: getFormattedDate(dateString),
                });
            }
        },
        [date]
    );

    const backDatePress = useCallback(
        () => {
            setPageNo(0)
            setDate({
                startDate: getFormattedDate(moment(date.startDate).subtract(1, 'day').format(dateFormat)),
                endDate: getFormattedDate(moment(date.endDate).subtract(1, 'day').format(dateFormat)),
            })
        },
        [date]);

    const nextDatePress = useCallback(
        () => {
            setPageNo(0)
            setDate({
                startDate: getFormattedDate(moment(date.startDate).add(1, 'day').format(dateFormat)),
                endDate: getFormattedDate(moment(date.endDate).add(1, 'day').format(dateFormat)),
            })
        },
        [date]);

    const handleDateChange = useCallback(
        (value) => {
            const updatedate = {
                startDate: getFormattedDate(moment().format(dateFormat)),
                endDate: getFormattedDate(moment().format(dateFormat)),
            }
            setPageNo(0)
            if (value == 2) {
                setDate({
                    startDate: getFormattedDate(moment(updatedate.startDate).format(dateFormat)),
                    endDate: getFormattedDate(moment(updatedate.endDate).add(7, 'day').format(dateFormat)),
                })
            } else if (value == 3) {
                setDate({
                    startDate: getFormattedDate(moment(updatedate.startDate).format(dateFormat)),
                    endDate: getFormattedDate(moment(updatedate.endDate).add(30, 'day').format(dateFormat)),
                })
            } else {
                setDate(updatedate)
            }
        },
        [date]
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
            style={{ height: "calc(100vh - 385px)" }}
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

                                <span className="fw-medium">
                                    {appointmentSelectedFromMenu?.pm_fullname} (
                                    {appointmentSelectedFromMenu?.pm_gender},{" "}
                                    {appointmentSelectedFromMenu?.ageYears}y)
                                </span>
                            </div>
                            <div className="mt-2 d-flex align-items-center">
                                <i className="icon-phone me-2" />{" "}
                                <span>{appointmentSelectedFromMenu?.pm_contact_no}</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i className="icon-Id me-2" />{" "}
                                <span>{appointmentSelectedFromMenu?.patient_unique_id}</span>
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
                        <div className="mb-2">End Visit Reason</div>
                        <div className="border bg-body rounded-10px p-3 patient-details">
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
        }
    }

    return (
        <div className="border rounded-4 appointment-wrap dateborder">
            <Tabs
                defaultActiveKey={TAB_QUEUE}
                items={items}
                onChange={onChange}
                activeKey={selectedTab}
            />
            <div className="p-4 appointment-data">
                <Row className="justify-content-between align-items-center mb-3">
                    <Col xl={4} lg={4}>
                        <Input
                            value={searchQuery}
                            placeholder="Search by patient name"
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
                                        format={dateFormat}
                                        disabled={date.startDate != date.endDate}
                                        defaultValue={dayjs(getFormattedDate(date.startDate), dateFormat)}
                                        value={
                                            date.startDate === date.endDate
                                                ? dayjs(getFormattedDate(date.startDate), dateFormat)
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
                                placeholder="Today"
                                className="ms-3 appointmentselect"
                                options={calanderOptions}
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
                    <Space>
                        <Button
                            onClick={onEndVisitClick}
                            type="primary"
                            className="btn-41 px-4"
                            loading={loading}
                            disabled={!endVisitReason}>
                            Done
                        </Button>
                    </Space>
                }
                key="left"
            >
                <div className="p-4">
                    <div className="title-common mb-2">Reason</div>
                    <TextArea
                        showCount
                        className="endreason-textarea"
                        maxLength={100}
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
