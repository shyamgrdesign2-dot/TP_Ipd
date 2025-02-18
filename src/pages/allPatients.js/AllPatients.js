import { Button, DatePicker, Dropdown, Input, Row, Spin, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../common/Header";
import SidebarDoctor from "../../common/SidebarDoctor";
import { genderAge } from "../opdBilling/components/viewBillPdf/helper";
import { fetchAllPatients } from "./service";
import { isAndroid, isBrowser } from "react-device-detect";
import moment from "moment";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM YYYY";

const AllPatients = () => {
  const location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const [allPatientsData, setAllPatientsData] = useState([]);
  const [loading, setOnLoad] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: moment().format(dateFormat),
    endDate: moment().format(dateFormat),
  });
  const [pickerModal, setPickerModal] = useState(false);
  const [dateStatus, setDateStatus] = useState(1);

  useEffect(() => {
    setLocationPath(location.pathname);
  }, [location]);

  useEffect(() => {
    getAllPatients();
  }, []);

  const getAllPatients = async () => {
    const params = {
      page: 1,
      limit: 25,
      search: searchQuery,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };
    const res = await fetchAllPatients(params);
    setAllPatientsData(res);
  };

  const onSearch = useCallback(
    (query) => {
      setSearchQuery(query);
    },
    [searchQuery]
  );

  const getMenuItems = (record) => {
    return [
      {
        label: (
          <span
          // onClick={() => onPatientDetailsClick(record)}
          >
            View Patient Details
          </span>
        ),
        key: "patientdetails",
      },
      {
        label: (
          <span
            onClick={() => {
              // handleAddLabParamsDrawer();
            }}
          >
            Edit Patient Details
          </span>
        ),
        key: "labparams",
      },
      {
        label: (
          <span
            onClick={() => {
              // setAppointmentSelectedFromMenu(record);
            }}
          >
            Book Appointment
          </span>
        ),
        key: "cancelappt",
      },
      {
        label: (
          <div
          // onClick={handleAddClick}
          >
            Upload Medical Records
            {isAndroid && !isBrowser ? (
              <div
                // ref={fileInputRef}
                // onClick={() => handleUploadDocPopup(record)}
                style={{ display: "none" }}
              />
            ) : (
              <input
                type="file"
                multiple
                // ref={fileInputRef}
                // onChange={(event) => handleFileUpload(event, record)}
                accept="image/png, image/jpeg, image/jpg, application/pdf"
                style={{ display: "none" }}
              />
            )}
          </div>
        ),
        key: "uploadDoc",
      },
    ];
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
          <span className="text-primary">{record.pm_full_name}</span>
          <br />
          <small>{genderAge(record)}</small>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "pm_contact_no",
      key: "pm_contact_no",
      ellipsis: true,
      render: (text, record) => (
        <div>
          <span>{record.pm_contact_no} </span>
        </div>
      ),
    },
    {
      title: "Patient ID",
      dataIndex: "pm_pid",
      key: "pm_pid",
      ellipsis: true,
      render: (text, record) => (
        <div>
          <span>{record.pm_pid} </span>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ellipsis: true,
      render: (text, record) => (
        <div>
          <span>{record.category ?? "-"} </span>
        </div>
      ),
    },
    {
      title: "Last Visit",
      dataIndex: "lastVisitDate",
      key: "lastVisitDate",
      ellipsis: true,
      render: (text, record) => (
        <div>
          <span>{record.lastVisitDate} </span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 170,
      render: (_, record, index) => (
        <div>
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

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const handlePickerModal = useCallback(() => {
    setPickerModal(!pickerModal);
  }, [pickerModal]);

  const rangePresets = [
    {
      label: <div className={`${dateStatus === 1 ? "active" : ""}`}>Today</div>,
      value: [dayjs(), dayjs().endOf("day")],
    },
    {
      label: (
        <div className={`${dateStatus === 2 ? "active" : ""}`}>Last 7 days</div>
      ),
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: (
        <div className={`${dateStatus === 3 ? "active" : ""}`}>
          Last 30 days
        </div>
      ),
      value: [dayjs().add(-1, "M"), dayjs()],
    },
    {
      label: (
        <div
          className={`${!dateStatus ? "active" : ""}`}
          onClick={() => onRangeChange(null)}
        >
          Custom range
        </div>
      ),
      value: null,
    },
  ];

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      if (
        dayjs().format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(1);
      } else if (
        dayjs().add(-7, "d").format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(2);
      } else if (
        dayjs().add(-1, "M").format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(3);
      } else {
        setDateStatus(null);
      }
      setDateRange({
        startDate: moment(dateStrings[0], showDateFormat).format(dateFormat),
        endDate: moment(dateStrings[1], showDateFormat).format(dateFormat),
      });
    } else {
      setDateStatus(null);
      setDateRange({
        startDate: moment().format(dateFormat),
        endDate: moment().format(dateFormat),
      });
    }
  };

  return (
    <>
      <Header locationPath={locationPath} />
      <div className="d-flex billing-dashboard-wraper">
        <SidebarDoctor activeItem={"opd-billing"} />
        <div className="w-100 bg-body wrapper">
          <>
            <div className="welcomesection position-relative mb-3">
              <div className="bg-welcome d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <>
                    <div>
                      <h1>All Patients</h1>
                    </div>
                    <img
                      src={require("./../../assets/images/bg-welcome.png")}
                      className="welcomeig d-inline-block align-top"
                      alt="Welcome"
                    />
                  </>
                </div>
                <div className="d-flex gap-1">
                  <Button
                    className="btn-create-bill"
                    //   onClick={handleCreateBillDrawer}
                  >
                    <span style={{ fontSize: "22px" }}>+</span>
                    <span>Add New Patient</span>
                  </Button>
                </div>
              </div>
              <div className="pb-5">&nbsp;</div>
            </div>
          </>

          <div className="border rounded-4 appointment-wrap dateborder">
            <div className="appointment-data billing-table-wrapper mt-2">
              <Row className="justify-content-between align-items-center my-4 px-4">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <Input
                      value={searchQuery}
                      placeholder={"Search by patient name / ID / mobile no"}
                      className="inputheight38"
                      prefix={<i className="icon-search" />}
                      suffix={
                        searchQuery.length > 0 && (
                          <i
                            className="icon-Cross"
                            onClick={() => onSearch("")}
                          ></i>
                        )
                      }
                      onChange={(e) => onSearch(e.target.value)}
                    />
                  </div>
                  <div className="massage-date-wrapper">
                    <div
                      className="fs-14 h-100 w-100 d-flex align-items-center justify-content-between"
                      onClick={handlePickerModal}
                    >
                      <span>
                        {dateStatus === 1 ? (
                          "Today"
                        ) : dateStatus === 2 ? (
                          "Last week"
                        ) : dateStatus === 3 ? (
                          "Last month"
                        ) : (
                          <>
                            {moment(dateRange.startDate).format(showDateFormat)}{" "}
                            - {moment(dateRange.endDate).format(showDateFormat)}
                          </>
                        )}
                      </span>
                      <i className="mx-2 fs-18 icon-calendar"></i>
                    </div>
                    <RangePicker
                      disabledDate={(current) => disabledDate(current)}
                      open={pickerModal}
                      presets={rangePresets}
                      format={showDateFormat}
                      onChange={onRangeChange}
                      popupClassName="massage-date"
                      className="massage-input"
                      inputReadOnly
                      renderExtraFooter={() => (
                        <div className="d-flex align-items-center justify-content-between py-1">
                          <div>
                            {moment(dateRange.startDate).format(showDateFormat)}{" "}
                            - {moment(dateRange.endDate).format(showDateFormat)}
                          </div>
                          <div>
                            <button
                              className="btn btn-text me-3 px-0"
                              onClick={() => {
                                setDateStatus(1);
                                setDateRange({
                                  startDate: moment().format(dateFormat),
                                  endDate: moment().format(dateFormat),
                                });
                                handlePickerModal();
                              }}
                            >
                              <span>Cancel</span>
                            </button>
                            <Button
                              className="px-4"
                              type="primary"
                              onClick={handlePickerModal}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      )}
                      onOpenChange={() => {}}
                      value={[
                        dateRange.startDate !== dateRange.endDate
                          ? dayjs(
                              moment(dateRange.startDate).format(
                                showDateFormat
                              ),
                              showDateFormat
                            )
                          : "",
                        dateRange.startDate != dateRange.endDate
                          ? dayjs(
                              moment(dateRange.endDate).format(showDateFormat),
                              showDateFormat
                            )
                          : "",
                      ]}
                    />
                  </div>
                </div>
                <div className="ddx-ready-txt">
                  (Showing {allPatientsData?.total} of {allPatientsData?.total}{" "}
                  patients)
                </div>
              </Row>
            </div>

            <Row className="justify-content-between align-items-center px-4">
              <div className="card-container">
                <Table
                  className="mt-1"
                  columns={columns}
                  dataSource={allPatientsData?.patients}
                  pagination={false}
                  // loading={loading && pageNo === 0}
                />
                {allPatientsData?.patients?.length >= 25 && setOnLoad && (
                  <div
                    // ref={lastPostElementRef}
                    className="align-items-center d-flex h-38 justify-content-center"
                  >
                    <Spin />
                  </div>
                )}
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPatients;
