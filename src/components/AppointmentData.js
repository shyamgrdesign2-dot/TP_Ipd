import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Select, Segmented, DatePicker, Dropdown } from "antd";
import { Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import {
  addRecord,
  updateRecord,
  createNewRecord,
  getAllRecords,
} from "../redux/recordsSlice";

function AppointmentData() {
  const navigate = useNavigate();
  /* const startDate = "2023-08-17";
    const endDate = "2023-08-17"; */
  const todaysDate = new Date().toLocaleDateString().replaceAll("/", "-");
  const [startDate, setStartDate] = useState("2023-08-17");
  const [endDate, setEndDate] = useState("2023-08-17");
  const records = useSelector((state) => state.records.records);
  const loading = useSelector((state) => state.records.loading);
  const error = useSelector((state) => state.records.error);
  const dispatch = useDispatch();
  console.log("records: ", records);

  useEffect(() => {
    dispatch(
      getAllRecords({
        startDate,
        endDate,
      })
    );
  }, [getAllRecords, startDate, endDate]);

  const calanderList = [
    { value: "Today", label: "Today" },
    { value: "Yesterday", label: "Yesterday" },
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
  const [data, setData] = useState(
    records?.app_data.map(
      ({
        pm_first_name,
        pm_last_name,
        pm_contact_no,
        um_id,
        ageYears,
        apTime,
        apDate,
        pm_gender,
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
        };
      }
    )
  );

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
      dataIndex: "visittype",
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
  };

  const loadMoreData = () => {
    var dummyData = [];
    data.map((e, i) => {
      dummyData.push({ ...e, key: Math.random() });
    });
    setData([...data, ...dummyData]);
  };

  const items = [
    {
      label: "1st menu item",
      key: "0",
    },
    {
      label: "2nd menu item",
      key: "1",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  return (
    <div className="p-4 appointment-data">
      <Row className="justify-content-between">
        <Col md={3}>
          <Form>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Control type="email" placeholder="Search by patient name" />
            </Form.Group>
          </Form>
        </Col>
        <Col md="auto">
          <div className="d-flex align-items-center">
            <ButtonGroup aria-label="Basic example">
              <Button variant="outline-light" className="dateoutline">
                <i className="icon-right d-block text-main"></i>
              </Button>
              <Button variant="outline-light" className="p-0">
                <DatePicker onChange={dateChange} />
              </Button>
              <Button variant="outline-light" className="dateoutline">
                <i className="icon-right text-main d-block iconrotate90"></i>
              </Button>
            </ButtonGroup>
            <Select
              placeholder="Today"
              className="ms-3 appointmentselect"
              options={calanderList}
            />
            <Segmented
              className="ms-3"
              defaultValue={1}
              options={segmentedList}
              onChange={segmentedChange}
            />
          </div>
        </Col>
      </Row>
      {segmented == 1 ? (
        <div>
            {error ? <div>{error.message}</div> : (
            <Table
              columns={columns}
              dataSource={data}
              onChange={handleChange}
              pagination={false}
              loading={loading}
            />
          )
        }
          <button
            className="btn btn-light w-100 mt-3 load-more"
            onClick={loadMoreData}
          >
            Show All (10)
          </button>
        </div>
      ) : (
        <h1>Grid View</h1>
      )}
    </div>
  );
}

export default React.memo(AppointmentData);
