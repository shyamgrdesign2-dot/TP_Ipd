import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Select, Segmented, DatePicker, Dropdown } from "antd";
import { Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";

import { getAllRecords, searchAppointments } from "../redux/appointmentsSlice";
import { getFormattedDate } from "../utils/utils";

function AppointmentData() {
  const navigate = useNavigate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterDate = getFormattedDate(yesterday);
  const todaysDate = getFormattedDate(new Date());
  console.log("todaysDate: ", todaysDate);
  console.log("yesterDate: ", yesterDate);
  const startDate = "2023-08-17";
  const endDate = "2023-08-17";
  const initialDate = {
    startDate,
    endDate,
  };
  const [date, setDate] = useState(initialDate);
  const [searchQuery, setSearchQuery] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const { records, loading, error, queueCount } = useSelector(
    (state) => state.records
  );
  const dispatch = useDispatch();
  console.log("records: ", records);

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 3) {
      dispatch(searchAppointments(searchQuery));
    } else {
      dispatch(
        getAllRecords({
          startDate: date.startDate,
          endDate: date.endDate,
          pageNo,
        })
      );
    }
  }, [pageNo, date, searchQuery, dispatch]);

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
    return records?.app_data?.map(
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
      }) => {
        return {
          key: Math.random(),
          pm_contact_no,
          name: `${pm_first_name} ${pm_last_name}`,
          srno: um_id,
          ageYears,
          apTime,
          apDate,
          pm_gender,
          toct_type,
        };
      }
    );
  }, [records]);

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
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Jim",
          value: "Jim",
        },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
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
      key: "visittype",
      sorter: (a, b) => a.visittype.length - b.visittype.length,
      sortOrder: sortedInfo.columnKey === "visittype" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Slot",
      dataIndex: "time",
      key: "time",
      filteredValue: filteredInfo.time || null,
      onFilter: (value, record) => record.time.includes(value),
      sorter: (a, b) => a.time.length - b.time.length,
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
            menu={{ items }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <i className="icon-More"></i>
            </a>
          </Dropdown>
        </div>
      ),
      width: 170,
    },
  ];

  const dateChange = (date, dateString) => {
    console.log(date, dateString);
    setDate({
      startDate: getFormattedDate(dateString),
      endDate: getFormattedDate(dateString),
    });
  };

  const items = [
    {
      label: "Patient Details",
      key: "patientdetails",
    },
    {
      label: "Cancel Appt.",
      key: "cancelappt",
    },
    {
      label: "End Visit",
      key: "endvisit",
    },
  ];

  const loadMoreData = () => {
    setPageNo(pageNo + 1);
  };

  const onDateChanged = (selectedValue) => {
    console.log("selectedValue: ", selectedValue);
    if (selectedValue === "next7days") {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      const forwardDate = getFormattedDate(date);
      console.log("forwardDate7: ", forwardDate);
      setDate({
        startDate: todaysDate,
        endDate: forwardDate,
      });
    } else if (selectedValue === "next30days") {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      const forwardDate = getFormattedDate(date);
      console.log("forwardDate30: ", forwardDate);
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

  const onSearch = (e) => {
    let id = 0;
    id = setTimeout(() => {
      const query = e.target.value;
      console.log("value: ", query);
      setSearchQuery(query);

      clearTimeout(id);
    }, 500);
  };

  return (
    <div className="p-4 appointment-data">
      <Row className="justify-content-between">
        <Col xl={3} lg={4}>
          <Form>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="Search by patient name"
                onChange={onSearch}
              />
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
                  onChange={dateChange}
                  value={
                    date.startDate === date.endDate
                      ? dayjs(getFormattedDate(date.startDate), "YYYY-MM-DD")
                      : ""
                  }
                  defaultValue={dayjs(
                    getFormattedDate(date.startDate),
                    "YYYY-MM-DD"
                  )}
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
          {error ? (
            <div>{error.message}</div>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={data}
                onChange={handleChange}
                pagination={false}
                loading={loading}
              />
              {queueCount > 10 && (
                <button
                  className="btn btn-light w-100 mt-3 load-more"
                  onClick={loadMoreData}
                >
                  Show All (10)
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <h1>Grid View</h1>
      )}
    </div>
  );
}

export default React.memo(AppointmentData);
