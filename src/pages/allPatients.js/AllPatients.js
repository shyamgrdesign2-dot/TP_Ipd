import {
  Button,
  DatePicker,
  Drawer,
  Dropdown,
  Input,
  Row,
  Spin,
  Table,
} from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import SidebarDoctor from "../../common/SidebarDoctor";
import { genderAge } from "../opdBilling/components/viewBillPdf/helper";
import { fetchAllPatients } from "./service";
import { isAndroid, isBrowser, isChrome, isSafari } from "react-device-detect";
import moment from "moment";
import dayjs from "dayjs";
import {
  generateUniqueFileName,
  getCorrectedFileName,
} from "../medicalRecords/utils/helper";
import { useSelector } from "react-redux";
import {
  fetchAllDocumentCategories,
  uploadDocsToAzure,
} from "../medicalRecords/service";
import {
  setLoadingStatus,
  setUploadDocCategories,
} from "../../redux/uploadDocSlice";
import { useDispatch } from "react-redux";
import CommonModal from "../../common/CommonModal";
import UploadDocPopup from "../medicalRecords/components/uploadDocPopup/UploadDocPopup";
import UploadDocument from "../medicalRecords/UploadDocument";
import alertIcon from "./../../assets/images/alertIcon.svg";
import { debounce } from "lodash";
import * as XLSX from "xlsx";
import { handleInAppClick } from "../opdBilling/utils/helper";
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM YYYY";

const AllPatients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadDocCategories, isLoading } = useSelector(
    (state) => state.uploadDoc
  );
  const { userId } = useSelector((state) => state.doctors);
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
  const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
  const [shouldShowUploadDocPopup, setShowUploadDocPopup] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(null);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [downloadData, setDownloadData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const fileInputRef = useRef(null);
  const observer = useRef();

  useEffect(() => {
    setLocationPath(location.pathname);
  }, [location]);

  useEffect(() => {
    getAllPatients();
  }, [dateRange, pageNo]);

  useEffect(() => {
    if (uploadDocCategories.length === 0) {
      getAllDocumentCategories();
    }
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        getAllPatients();
      }, 500),
    [searchQuery] // Include the functions in dependencies
  );

  useEffect(() => {
    // Execute the search
    debouncedSearch(searchQuery);

    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !setOnLoad) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, setOnLoad]
  );

  const loadMoreData = useCallback(() => {
    setPageNo((prevPageNo) => prevPageNo + 1);
  }, []);

  const getAllDocumentCategories = async () => {
    const response = await fetchAllDocumentCategories();
    dispatch(setUploadDocCategories(response));
  };

  const getAllPatients = async () => {
    const params = {
      page: searchQuery === "" ? pageNo : 1,
      limit: 25,
      search: searchQuery,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };
    const res = await fetchAllPatients(params);
    if (pageNo === 1 || searchQuery !== "") {
      setAllPatientsData(res);
    } else {
      setAllPatientsData((prev) => {
        return { ...res, patients: [...prev.patients, ...res.patients] };
      });
    }
  };

  const onSearch = useCallback(
    (query) => {
      setSearchQuery(query);
    },
    [searchQuery]
  );

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRetryBtn = () => {
    setFilesData([]);
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    setIsFileTypeError(null);
  };

  const handleUploadDocPopup = (record) => {
    setShowUploadDocPopup((prev) => !prev);
    setPatientData(record);
  };

  const handleDrawerUploadDoc = () => {
    setUploadDocDrawer(!uploadDocDrawer);
  };

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const handleFileUpload = (event, record) => {
    const files = event.target.files;
    if (files) {
      const filesData = Array.from(files);
      if (filesData.length > 0) {
        const updatedFiles = [];
        filesData.forEach((file) => {
          const cleanFileName = getCorrectedFileName(file?.name || "");
          // Check if the file is an image and if its name follows typical camera-captured file patterns
          const isCapturedFromCamera =
            (file.type === "image/jpeg" ||
              file.type === "image/png" ||
              file.type === "image/jpg") &&
            (cleanFileName === "image.jpg" ||
              cleanFileName === "image.png" ||
              cleanFileName === "image.jpeg");

          let newFile = file;

          if (isCapturedFromCamera) {
            // Generate a unique file name for camera-captured images
            const uniqueFileName = generateUniqueFileName(file);
            newFile = new File([file], uniqueFileName, { type: file.type });
          } else {
            // If the file name had spaces, create a new file with spaces removed
            newFile = new File([file], cleanFileName, { type: file.type });
          }

          updatedFiles.push(newFile);
        });
        setFilesData(updatedFiles);
        handleDrawerUploadDoc();
        setPatientData(record);
      }
    }
    event.target.value = null;
  };

  const onPatientDetailsClick = (record) => {
    navigate("/patient_details", { state: { patient_data: record } });
  };

  const onEditPatientClick = (record) => {
    navigate("/edit_patient", { state: { patient_data: record } });
  };

  const getMenuItems = (record) => {
    return [
      {
        label: (
          <span onClick={() => onPatientDetailsClick(record)}>
            View Patient Details
          </span>
        ),
        key: "patientdetails",
      },
      {
        label: (
          <span onClick={() => onEditPatientClick(record)}>
            Edit Patient Details
          </span>
        ),
        key: "labparams",
      },
      {
        label: <span onClick={() => {}}>Book Appointment</span>,
        key: "cancelappt",
      },
      {
        label: (
          <div onClick={handleAddClick}>
            Upload Medical Records
            {isAndroid && !isBrowser ? (
              <div
                ref={fileInputRef}
                onClick={() => handleUploadDocPopup(record)}
                style={{ display: "none" }}
              />
            ) : (
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={(event) => handleFileUpload(event, record)}
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
          <span
            onClick={() => onPatientDetailsClick(record)}
            className="text-primary cursor-pointer"
          >
            {record.pm_fullname}
          </span>
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
          <span>
            {record.lastVisitDate
              ? moment(record.lastVisitDate).format("DD-MM-YYYY")
              : ""}
          </span>
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

  const setStartLoader = () => {
    dispatch(setLoadingStatus(true));
  };

  const handleDownloadPatientData = async () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    const excelData = allPatientsData?.patients?.map((patient) => ({
      "Patient Name": `${
        patient.pm_salutation ? patient.pm_salutation + " " : ""
      } ${patient.pm_fullname}`,
      Gender: patient.pm_gender,
      Age: `${
        patient.ageYears
          ? `${patient.ageYears}y${patient.ageMonths ? `, ` : ""}`
          : ""
      }${patient.ageMonths ? `${patient.ageMonths}m` : ""}`,
      Mobile: patient.pm_contact_no,
      "Patient ID": patient.tpml_refrence_id || patient.pm_pid,
      "Last Visited": patient.lastVisitDate
        ? moment(patient.lastVisitDate).format("DD-MM-YYYY")
        : "",
      "Patient Address": patient.address,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 25 }, // Name
      { wch: 10 }, // Gender
      { wch: 10 },
      { wch: 13 },
      { wch: 15 },
      { wch: 12 },
      { wch: 30 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Data");

    // Add date to filename
    XLSX.writeFile(workbook, `patient_data_${today}.xlsx`);

    if (!isChrome && !isSafari) {
      // Generate Excel buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create File object
      const file = new File([excelBlob], `patient_data_${today}.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const formData = new FormData();
      formData.append(file?.name, file);
      const res = await uploadDocsToAzure(formData);
      if (res?.length > 0) {
        handleInAppClick(userId, "download", res?.[0]?.url, setStartLoader);
      }
    } else {
      // else part already working in top
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
                <div className="d-flex">
                  <Button
                    className="btn-create-bill gap-1"
                    onClick={() => navigate("/add_patient")}
                    icon={<i className="icon-Add" style={{ fontSize: 20 }} />}
                  >
                    <span>Add New Patient</span>
                  </Button>
                </div>
              </div>
              <div className="pb-5">&nbsp;</div>
            </div>
          </>

          <div className="border rounded-4 appointment-wrap dateborder mb-4">
            <div className="billing-table-wrapper mt-2">
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
                          />
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
                                setPageNo(1);
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
                <div className="d-flex align-items-center gap-3">
                  <div className="ddx-ready-txt">
                    (Showing{" "}
                    {allPatientsData?.patients?.length ===
                    allPatientsData?.total ? (
                      allPatientsData?.patients?.length
                    ) : (
                      <span>{allPatientsData?.patients?.length}</span>
                    )}{" "}
                    of {allPatientsData?.total} patients)
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center billing-download"
                    onClick={handleDownloadPatientData}
                  >
                    <i
                      className="icon-download"
                      style={{ cursor: "pointer", color: "#4B4AD5" }}
                    />
                  </div>
                </div>
              </Row>
            </div>

            <Row className="justify-content-between align-items-center px-4">
              <div className="card-container appointment-data">
                <Table
                  className="mt-1"
                  columns={columns}
                  dataSource={allPatientsData?.patients}
                  pagination={false}
                  loading={loading && pageNo === 1}
                />
                {allPatientsData?.totalPages > allPatientsData?.page &&
                  setOnLoad && (
                    <div
                      ref={lastPostElementRef}
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
      {uploadDocDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          bodyStyle={{ backgroundColor: "white" }}
          onClose={handleDeletePopup}
          open={uploadDocDrawer}
          className="modalWidth-700"
          width="auto"
          push={false}
        >
          <UploadDocument
            onClose={handleDeletePopup}
            handleDrawerUploadDoc={handleDrawerUploadDoc}
            shouldShowDeletePopup={shouldShowDeletePopup}
            setShowDeletePopup={setShowDeletePopup}
            filesData={filesData}
            setFilesData={setFilesData}
            patientData={patientData}
            handleUploadDocPopup={() => setShowUploadDocPopup((prev) => !prev)}
            isAppointmentData={true}
          />
        </Drawer>
      )}
      {shouldShowUploadDocPopup && (
        <UploadDocPopup
          shouldShowUploadDocPopup={shouldShowUploadDocPopup}
          onCancel={() => setShowUploadDocPopup(false)}
          setFilesData={setFilesData}
          filesData={filesData}
          setUploadDocDrawer={setUploadDocDrawer}
          patientData={patientData}
          setIsFileSizeError={setIsFileSizeError}
          setIsFileLimitError={setIsFileLimitError}
          setIsFileTypeError={setIsFileTypeError}
        />
      )}
      {isLoading ? (
        <div>
          <Spin
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              zIndex: "9999",
            }}
            size="large"
          />
        </div>
      ) : null}
      {isFileSizeError || isFileLimitError || isFileTypeError ? (
        <CommonModal
          isModalOpen={isFileSizeError || isFileLimitError || isFileTypeError}
          onCancel={handleRetryBtn}
          modalWidth={500}
          title={
            isFileSizeError
              ? "Exceeded File Size"
              : isFileLimitError
              ? "Exceeded File Upload Limit"
              : isFileTypeError
              ? "File format not supported"
              : "You may lose your data"
          }
          modalBody={
            <>
              <div className="alert-warning rounded-10px p-2 patient-details">
                <div className="d-flex align-items-center">
                  <img className="me-3" src={alertIcon} alt="Warning" />
                  <span>
                    {isFileSizeError ? (
                      <>
                        The file size exceeded{" "}
                        <span style={{ fontWeight: 700 }}>8MB.</span> Please
                        upload a file smaller than 8MB
                      </>
                    ) : isFileLimitError ? (
                      <>
                        You can only upload up to
                        <span style={{ fontWeight: 700 }}> 5 files.</span>{" "}
                        Please reduce the number of files and try again.
                      </>
                    ) : isFileTypeError ? (
                      <>
                        You can't upload
                        <span style={{ fontWeight: 700 }}>
                          {" "}
                          {isFileTypeError}
                        </span>{" "}
                        file. Only PDF, JPG, JPEG, and PNG formats are accepted.
                      </>
                    ) : (
                      "Are you sure you want to leave ?"
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleRetryBtn}
                  className="w-100 btn btn-primary3 btn-41 px-4"
                >
                  Retry
                </Button>
              </div>
            </>
          }
        />
      ) : null}
    </>
  );
};

export default AllPatients;
