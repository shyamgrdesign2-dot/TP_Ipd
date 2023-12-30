import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Drawer, Space, notification } from "antd";
import { Link } from "react-router-dom";
import {
  Table,
  Select,
  Segmented,
  DatePicker,
  Dropdown,
  Input,
  AutoComplete,
} from "antd";
import { Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";

import {
  cancelAppointments,
  clearSearch,
  endVisit,
  getAllRecords,
  getCaseTypes,
  searchAppointments,
} from "../redux/appointmentsSlice";
import { getFormattedDate } from "../utils/utils";
import { PAGE_SIZE } from "../utils/constants";
import noData from "../assets/images/nodata-found.svg";
import CommonModal from "../common/CommonModal";

// Tab constants mapping UI as well as apStatue field of API
// Changing these 0, 1, 4 value will break the functionality.
export const TAB_QUEUE = 0;
export const TAB_FINISHED = 1;
export const TAB_CANCELLED = 4;

// constants that are used as identifiers when storing queue based
// data into redux state
export const STRING_QUEUE_TYPE_QUEUE = "queue";
export const STRING_QUEUE_TYPE_FINISHED = "finished";
export const STRING_QUEUE_TYPE_CANCELLED = "cancelled";

const { TextArea } = Input;

function AppointmentData({ clinicChanged, type, setSelectedTab }) {
  console.log("type: ", type);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterDate = getFormattedDate(yesterday);
  const todaysDate = getFormattedDate(new Date());
  /* console.log("todaysDate: ", todaysDate);
  console.log("yesterDate: ", yesterDate); */
  /* const startDate = "2023-08-17";
  const endDate = "2023-08-17"; */
  const initialDate = {
    startDate: todaysDate,
    endDate: todaysDate,
  };
  const [date, setDate] = useState(initialDate);
  const [searchQuery, setSearchQuery] = useState(null);
  const [value, setValue] = useState(null);
  const [pageNoQueue, setPageNoQueue] = useState(0);
  const [pageNoFinished, setPageNoFinished] = useState(0);
  const [pageNoCancelled, setPageNoCancelled] = useState(0);
  const [reasonDrawerOpen, setReasonDrawerOpen] = useState(false);
  const [endVisitReason, setEndVisitReason] = useState(null);
  const [visitTypeFilters, setVisitTypeFilters] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [showEndVisitReasonModal, setShowEndVisitReasonModal] = useState(false);
  const [appointmentSelectedFromMenu, setAppointmentSelectedFromMenu] =
    useState(null);
  const { records, loading, error, counts, caseTypes, cancelledAppointment, endedAppointment } =
    useSelector((state) => state.records);
  const dispatch = useDispatch();
  // console.log("records: ", records);

  const getQueueTypeString = () => {
    return type === TAB_QUEUE
      ? STRING_QUEUE_TYPE_QUEUE
      : type === TAB_FINISHED
      ? STRING_QUEUE_TYPE_FINISHED
      : STRING_QUEUE_TYPE_CANCELLED;
  };

  const getQueuePageNo = () => {
    return type === TAB_QUEUE
      ? pageNoQueue
      : type === TAB_FINISHED
      ? pageNoFinished
      : pageNoCancelled;
  };

  useEffect(() => {
    dispatch(getCaseTypes());
  }, [dispatch]);

  useEffect(() => {
    if (cancelledAppointment && cancelledAppointment.pam_id) {
      setConfirmationModalOpen(false);

      // show notification
      const notificationParam = {
        message: "Appointment Cancelled Successfully",
        description: "View cancelled appointments in Cancelled tab.",
      };
      notification.success({ key: "notification_key", ...notificationParam });
      setSelectedTab(TAB_CANCELLED);
    } else if(endedAppointment) {
      console.log('endedAppointment: ', endedAppointment);
      setEndVisitReason(null);
      setReasonDrawerOpen(false);

      // show notification
      const notificationParam = {
        message: "Anish's visit end successfully",
        description: "View end visits in Finished tab.",
      };
      notification.success({ key: "notification_key", ...notificationParam });
      setSelectedTab(TAB_FINISHED);
    }
  }, [cancelledAppointment, endedAppointment]);

  useEffect(() => {
    console.log("clinicChanged: ", clinicChanged);
    if (clinicChanged) {
      setPageNoQueue(0);
      setPageNoCancelled(0);
      setPageNoFinished(0);
      setSearchQuery(null);

      dispatch(
        getAllRecords({
          startDate: date.startDate,
          endDate: date.endDate,
          apStatue: type,
          pageNo: 0,
          queueType: getQueueTypeString(),
          filterVisitType: ""
        })
      );
    }
  }, [clinicChanged]);

  useEffect(() => {
    if (searchQuery) {
      console.log("searchQuery: ", searchQuery);

      let timeOutId = setTimeout(() => {
        dispatch(
          searchAppointments({
            searchQuery,
            queueType: getQueueTypeString(),
          })
        );
      }, 500);

      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(
        getAllRecords({
          startDate: date.startDate,
          endDate: date.endDate,
          apStatue: type,
          pageNo: getQueuePageNo(),
          queueType: getQueueTypeString(),
          filterVisitType: visitTypeFilters ? Array.from(visitTypeFilters).join(', ') : ""
        })
      );
    }
  }, [
    pageNoQueue,
    pageNoFinished,
    pageNoCancelled,
    date,
    searchQuery,
    dispatch,
    type,
    visitTypeFilters
  ]);

  useEffect(() => {
    console.log('visitTypeFilters: ', visitTypeFilters);
  }, [visitTypeFilters]);

  const calanderList = [
    { value: todaysDate, label: "Today" },
    { value: "next7days", label: "Next 7 Days" },
    { value: "next30days", label: "Next 30 Days" },
  ];

  const segmentedList = [
    { value: 1, icon: <i className="icon-List"></i> },
    { value: 2, icon: <i className="icon-calendar"></i> },
  ];
  const [segmented, setSegmented] = useState(1);

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const segmentedChange = useCallback(
    (key) => {
      setSegmented(key);
    },
    [segmented]
  );

  // transform the data
  const data = useMemo(() => {
    let index = 1;
    const arrayOfPagedQueue =
      type === TAB_QUEUE
        ? Object.values(records?.queue)
        : type === TAB_FINISHED
        ? Object.values(records?.finished)
        : Object.values(records?.cancelled);
    let source = [].concat(...arrayOfPagedQueue);

    // console.log("source:", source);

    return source?.map(
      ({
        pm_first_name,
        pm_last_name,
        pm_contact_no,
        um_id,
        ageYears,
        apTime,
        apDate,
        pm_gender,
        toct_type,
        toct_id,
        pam_id,
        patient_unique_id,
        pageNo,
        indexInPage,
      }) => {
        return {
          key: Math.random(),
          pam_id,
          patient_unique_id,
          pm_contact_no,
          name: `${pm_first_name} ${pm_last_name}`,
          srno: index++,
          ageYears,
          apTime,
          apDate,
          pm_gender,
          toct_type,
          toct_id,
          pageNo,
          indexInPage,
        };
      }
    );
  }, [records, type]);

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);

    setVisitTypeFilters(filters.toct_type);
  };

  const getVisitTypeFilters = () => {
    return caseTypes.map((typeObj) => {
      return {
        text: typeObj.toct_type,
        value: typeObj.toct_id,
      };
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
      ellipsis: true,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: filteredInfo.name || null,
      /* sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null, */
      render: (text, record) => (
        <div>
          <span className="text-primary">{text}</span>
          <br />
          <small>
            {record.pm_gender}, {record.ageYears}
          </small>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Contact",
      dataIndex: "pm_contact_no",
      key: "contact",
      ellipsis: true,
    },
    {
      title: "Visit Type",
      dataIndex: "toct_type",
      key: "toct_type",
      // filteredValue: filteredInfo.toct_type || null,
      onFilter: (value, record) => record.toct_type === value,
      filters: getVisitTypeFilters(),
      // sorter: (a, b) => a.visittype.length - b.visittype.length,
      // sortOrder: sortedInfo.columnKey === "visittype" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Slot",
      dataIndex: "time",
      key: "time",
      filteredValue: filteredInfo.time || null,
      onFilter: (value, record) => record.time.includes(value),
      sorter: (a, b) => {
        const lhsDateTime = `${a.apDate} ${a.apTime}`;
        const lhsLongTime = moment(
          lhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const rhsDateTime = `${b.apDate} ${b.apTime}`;
        const rhsLongTime = moment(
          rhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const result = lhsLongTime - rhsLongTime;
        return result;
      },
      sortOrder: sortedInfo.columnKey === "time" ? sortedInfo.order : null,
      render: (text, record) => (
        <div>
          <span>{record.apTime} </span> <br /> <small> {record.apDate}</small>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div size="middle">
          {type !== TAB_CANCELLED && <Link to="/patient_details">
            <button className="btn btn-outline-primary btn-consult">
              {type === TAB_FINISHED ? "PrintRx" : "Consult"}
            </button>
          </Link>}
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
      width: 170,
    },
  ];

  const dateChange = (date, dateString) => {
    console.log(date, dateString);
    if (dateString) {
      setDate({
        startDate: getFormattedDate(dateString),
        endDate: getFormattedDate(dateString),
      });
    }
  };

  const getMenuItems = (appointment) => {
    const items = [
      {
        label: <Link to="/patient_details">Patient Details</Link>,
        key: "patientdetails",
      },
      {
        label: (
          <span
            onClick={() => {
              console.log("clicked.data", appointment);
              setAppointmentSelectedFromMenu(appointment);
              setConfirmationModalOpen(true);
            }}
          >
            Cancel Appt.
          </span>
        ),
        key: "cancelappt",
      },
      {
        label: (
          <span
            onClick={() => {
              console.log("clicked.data", appointment);
              setAppointmentSelectedFromMenu(appointment);
              setReasonDrawerOpen(true);
            }}
          >
            End Visit
          </span>
        ),
        key: "endvisit",
      },
      {
        label: (
          <span
            onClick={() => {
              console.log("clicked.data", appointment);
              setAppointmentSelectedFromMenu(appointment);
              setShowEndVisitReasonModal(true);
            }}
          >
            End Visit Reason
          </span>
        ),
        key: "endvisitreason",
      },
    ];

    if (type === TAB_QUEUE) {
      return items.filter((item) => item.key !== "endvisitreason");
    } else if (type === TAB_FINISHED) {
      return items
        .filter((item) => item.key !== "endvisit")
        .filter((item) => item.key !== "cancelappt");
    } else if (type === TAB_CANCELLED) {
      return items.splice(0, 1);
    } else {
      return items;
    }
  };

  const loadMoreData = () => {
    if (type === TAB_QUEUE) {
      setPageNoQueue(pageNoQueue + 1);
    } else if (type === TAB_FINISHED) {
      setPageNoFinished(pageNoFinished + 1);
    } else {
      setPageNoCancelled(pageNoCancelled + 1);
    }
  };

  const onDateChanged = (selectedValue) => {
    if (selectedValue === "next7days") {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      const forwardDate = getFormattedDate(date);
      setDate({
        startDate: todaysDate,
        endDate: forwardDate,
      });
    } else if (selectedValue === "next30days") {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      const forwardDate = getFormattedDate(date);
      setDate({
        startDate: todaysDate,
        endDate: forwardDate,
      });
    } else if (selectedValue === "alltime") {
      const todayDateStart = new Date();
      todayDateStart.setDate(todayDateStart.getDate() - 365);
      const startDate = getFormattedDate(todayDateStart);
      const todayDateEnd = new Date();
      todayDateEnd.setDate(todayDateEnd.getDate() + 365);
      const endDate = getFormattedDate(todayDateEnd);
      console.log("endDate: ", endDate);
      setDate({
        startDate: startDate,
        endDate: endDate,
      });
    } else {
      setDate({
        startDate: selectedValue,
        endDate: selectedValue,
      });
    }
  };

  const stepDate = (forward) => {
    const currentDate = date.startDate ? new Date(date.startDate) : new Date();
    currentDate.setDate(
      forward ? currentDate.getDate() + 1 : currentDate.getDate() - 1
    );
    console.log("currentDate: ", currentDate);
    setDate({
      startDate: getFormattedDate(currentDate),
      endDate: getFormattedDate(currentDate),
    });
  };

  const onSearch = useCallback(
    (query) => {
      setValue(query);
      setSearchQuery(query);

      if (!query) {
        dispatch(
          clearSearch({
            queueType: getQueueTypeString(),
            pageNo: getQueuePageNo(),
          })
        );

        type === TAB_QUEUE
          ? setPageNoQueue(0)
          : type === TAB_FINISHED
          ? setPageNoFinished(0)
          : setPageNoCancelled(0);
      }
    },
    [searchQuery]
  );

  const getDefaultDate = () => {
    const defaultDate = dayjs(getFormattedDate(date.startDate), "YYYY-MM-DD");
    console.log("defaultDate: ", defaultDate);
    return defaultDate;
  };

  const getRemainingRecordsCount = () => {
    const pageNo =
      type === TAB_QUEUE
        ? pageNoQueue
        : type === TAB_FINISHED
        ? pageNoFinished
        : pageNoCancelled;

    const count =
      type === TAB_QUEUE
        ? counts.queueCount
        : type === TAB_FINISHED
        ? counts.finishedCount
        : counts.cancelledCount;

    const pagesReminaing = count - PAGE_SIZE * (pageNo + 1);
    return pagesReminaing;
  };

  const getTotalCount = () => {
    if (type === TAB_QUEUE) {
      return counts.queueCount;
    } else if (type === TAB_FINISHED) {
      return counts.finishedCount;
    } else {
      return counts.cancelledCount;
    }
  };

  const onEndVisitClick = () => {
    // TODO: change this to end appointment API call
    console.log("appointmentSelectedFromMenu: ", appointmentSelectedFromMenu);
    dispatch(endVisit({appointment: appointmentSelectedFromMenu}));
  };

  const END_VISIT_REASON_DISPLAY_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={showEndVisitReasonModal}
        modalWidth={610}
        title={
          <>
            <div className="d-flex align-items-center">
              <i className="icon-patients me-2" />
              <span>
                {appointmentSelectedFromMenu?.name} (
                {appointmentSelectedFromMenu?.pm_gender},{" "}
                {appointmentSelectedFromMenu?.ageYears}y)
              </span>
            </div>
          </>
        }
        onCancel={() => {
          setShowEndVisitReasonModal(false);
        }}
        modalBody={
          <>
            <div>End Visit Reason</div>
            <div className="border bg-body rounded-10px p-2 patient-details">
              This is my reason of the life
            </div>
          </>
        }
      />
    );
  }, [showEndVisitReasonModal]);

  const CONFIRMATION_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isConfirmationModalOpen}
        modalWidth={610}
        title={"Are you sure you want to cancel this appointment?"}
        onCancel={() => {
          setConfirmationModalOpen(false);
        }}
        modalBody={
          <>
            <div className="border bg-body rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <i className="icon-patients me-2" />
                <span>
                  {appointmentSelectedFromMenu?.name} (
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
                  className="btn btn-primary2 align-items-center text-primary btn-41 w-50"
                  icon={<i className="icon-Preview" />}
                  onClick={() => {
                    setConfirmationModalOpen(false);
                  }}
                >
                  No, Keep Appointment{" "}
                </Button>
                <Button
                  type="text"
                  className="btn btn-primary3 align-items-center btn-41 w-50"
                  icon={<i className="icon-Consult" />}
                  onClick={() => {
                    console.log(
                      "clicked: ",
                      appointmentSelectedFromMenu.pam_id
                    );
                    dispatch(
                      cancelAppointments({
                        appointment: appointmentSelectedFromMenu,
                      })
                    );
                  }}
                >
                  Yes, Cancel Appointment{" "}
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isConfirmationModalOpen]);

  const emptyText = (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "calc(100vh - 434px)" }}
    >
      <img src={noData} alt="Warning" />
      <div className="mt-3 fontRoboto">
        {type === TAB_QUEUE
          ? "There are no patients in your queue right now!"
          : type === TAB_FINISHED
          ? "You haven't finished any consultations or ended the visit yet."
          : "Nothing here! You haven’t cancelled any appointments here."}
      </div>
    </div>
  );

  return (
    <>
      <div className="p-4 appointment-data">
        <Row className="justify-content-between align-items-center mb-3">
          <Col xl={4} lg={4}>
            <Form>
              <Form.Group controlId="exampleForm.ControlInput1">
                {/* <Form.Control
                type="text"
                placeholder="Search by patient name"
                onChange={onSearch}
                prefix={<i className="icon-search" />}
              /> */}
                <AutoComplete
                  value={value}
                  onSearch={onSearch}
                  defaultActiveFirstOption={true}
                  className="w-100 inputheight38"
                >
                  <Input
                    placeholder="Search by patient name"
                    className="inputheight38"
                    prefix={<i className="icon-search" />}
                    suffix={
                      searchQuery?.length > 0 && (
                        <i
                          className="icon-Cross"
                          onClick={() => {
                            onSearch(null);
                            setValue("");
                          }}
                        />
                      )
                    }
                  />
                </AutoComplete>
              </Form.Group>
            </Form>
          </Col>
          <Col md="auto">
            <div className="d-flex align-items-center">
              <ButtonGroup aria-label="Basic example">
                <Button
                  variant="outline-light"
                  className="dateoutline"
                  disabled={date.startDate !== date.endDate}
                  onClick={() => {
                    stepDate(false);
                  }}
                >
                  <i className="icon-right d-block text-main"></i>
                </Button>
                <Button variant="outline-light" className="p-0">
                  <DatePicker
                    // allowClear={false}
                    inputReadOnly
                    onChange={dateChange}
                    value={
                      date.startDate === date.endDate
                        ? dayjs(getFormattedDate(date.startDate), "YYYY-MM-DD")
                        : ""
                    }
                    defaultValue={getDefaultDate}
                    format="YYYY-MM-DD"
                    disabled={date.startDate !== date.endDate}
                  />
                </Button>
                <Button
                  variant="outline-light"
                  className="dateoutline"
                  disabled={date.startDate !== date.endDate}
                  onClick={() => {
                    stepDate(true);
                  }}
                >
                  <i className="icon-right text-main d-block iconrotate90"></i>
                </Button>
              </ButtonGroup>
              <Select
                placeholder="Today"
                className="ms-3 appointmentselect"
                options={calanderList}
                onChange={onDateChanged}
              />
              <Segmented
                className="ms-3 appointment-segment"
                defaultValue={1}
                options={segmentedList}
                onChange={segmentedChange}
              />
            </div>
          </Col>
        </Row>
        {segmented == 1 ? (
          <div>
            <>
              <Table
                columns={columns}
                dataSource={data}
                onChange={handleChange}
                pagination={false}
                loading={loading}
                locale={{ emptyText: emptyText }}
              />
              {data?.length > 0 &&
                !searchQuery &&
                getTotalCount() > PAGE_SIZE &&
                getRemainingRecordsCount() > 0 && (
                  <button
                    className="btn btn-light w-100 mt-3 load-more"
                    onClick={loadMoreData}
                  >
                    Show More ({getRemainingRecordsCount()})
                  </button>
                )}
            </>
            {/* )} */}
          </div>
        ) : (
          <h1>Grid View</h1>
        )}
        {CONFIRMATION_MODAL}
        {END_VISIT_REASON_DISPLAY_MODAL}
      </div>
      <Drawer
        title="End Visit"
        placement="left"
        closable
        onClose={() => {
          console.log("Close has been called");
          setReasonDrawerOpen(false);
          setEndVisitReason(null);
        }}
        extra={
          <Space>
            <Button
              onClick={onEndVisitClick}
              type="primary"
              disabled={!endVisitReason}
            >
              Save
            </Button>
          </Space>
        }
        open={reasonDrawerOpen}
        key="left"
      >
        <TextArea
          showCount
          maxLength={100}
          value={endVisitReason}
          onChange={(e) => {
            const text = e.target.value;
            console.log("value: ", text);
            setEndVisitReason(text);
          }}
          placeholder="disable resize"
          style={{
            height: 120,
            resize: "none",
          }}
        />
      </Drawer>
    </>
  );
}

export default React.memo(AppointmentData);
