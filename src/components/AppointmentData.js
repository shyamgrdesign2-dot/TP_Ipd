import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
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
  getAllRecords,
  searchAppointments,
} from "../redux/appointmentsSlice";
import { getFormattedDate } from "../utils/utils";
import { PAGE_SIZE } from "../utils/constants";
import noData from "../assets/images/nodata-found.svg";

export const TAB_QUEUE = 0;
export const TAB_FINISHED = 1;
export const TAB_CANCELLED = 4;

function AppointmentData({ clinicChanged, type }) {
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
  const { records, loading, error, counts } = useSelector(
    (state) => state.records
  );
  const dispatch = useDispatch();

  console.log("records: ", records);

  const getQueueTypeString = () => {
    return type === TAB_QUEUE
      ? "queue"
      : type === TAB_FINISHED
      ? "finished"
      : "cancelled";
  };

  const getQueuePageNo = () => {
    return type === TAB_QUEUE
      ? pageNoQueue
      : type === TAB_FINISHED
      ? pageNoFinished
      : pageNoCancelled;
  };

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
          filterVisitType: type,
          pageNo: 0,
          queueType: getQueueTypeString(),
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
          filterVisitType: type,
          pageNo: getQueuePageNo(),
          queueType: getQueueTypeString(),
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
  ]);

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
        pam_id,
        patient_unique_id
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
        };
      }
    );
  }, [records, type]);

  console.log("data: ", data);

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
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
          <span>{text}</span>
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
      onFilter: (value, record) => record.toct_type === value,
      filters: [
        {
          text: "New",
          value: "new-visit",
        },
        {
          text: "Follow-Up",
          value: "follow-up-visit",
        },
      ],
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
          {/* <button className='btn btn-outline-primary btn-consult' onClick={() => navigate("/patient_details")}>Consult</button> */}
          <Link to="/patient_details">
            <button className="btn btn-outline-primary btn-consult">
              Consult
            </button>
          </Link>
          <Dropdown
            className="btn btn-outline btn-more ms-3"
            menu={{
              items: getMenuItems(record)
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => {
              e.preventDefault();
            }}>
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


  const getMenuItems = (record) => {
    const items = [
      {
        label: "Patient Details",
        key: "patientdetails",
      },
      {
        label: (
          <span onClick={() => {
            
            console.log('clicked.data', record);
            dispatch(cancelAppointments({record}));
          }}>
            Cancel Appt.
          </span>
        ),
        key: "cancelappt",
      },
      {
        label: "End Visit",
        key: "endvisit",
      },
    ];

    return items;
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
    </div>
  );
}

export default React.memo(AppointmentData);
