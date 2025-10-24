import { Button, Card, DatePicker, Input, Select, message } from "antd";
import { useEffect, useRef, useState } from "react";
import emptyBg from "./../../assets/images/empty-bg.svg";
import emptyFile from "./../../assets/images/empty-file.svg";
import dayjs from "dayjs";
import { disableFutureDates } from "../growthChart/growthChartHelper";
import "./UploadDocument.scss";
import CommonModal from "../../common/CommonModal";
import alertIcon from "./../../assets/images/alertIcon.svg";
import visitEnd from "./../../assets/images/end-visit.svg";
import imgCloseVisit from "./../../assets/images/close-visit.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDocsUploadedFromAndroid,
  fetchAllPatientDocs,
  updateDocument,
  uploadDocument,
} from "./service";
import { setAllUploadedDocs } from "../../redux/uploadDocSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { isAndroid, isBrowser } from "react-device-detect";
import { MESSAGE_KEY } from "../../utils/constants";
import {
  generateUniqueFileName,
  getCorrectedFileName,
  loadPdf,
  mergeDocuments,
  shortenText,
  uploadDocURLtoFile,
} from "./utils/helper";
// Updated to use Redux
import { uploadMedicalRecordDocument, getMedicalRecordsDocuments } from "../../redux/ipd/medicalRecordsSlice";

const UploadDocument = ({
  onClose,
  handleDrawerUploadDoc,
  shouldShowDeletePopup,
  setShowDeletePopup,
  filesData,
  setFilesData,
  isEditDocument,
  setIsEditDocument,
  patientData,
  patient_data_naviagte,
  patientDetails,
  isAppointmentData,
  handleUploadDocPopup,
  // New optional props for IPD medical records flow
  isIPDMedicalRecords = false,
  patientId: ipdPatientId,
  admissionId: ipdAdmissionId,
  // Optional override for category options
  overrideDocumentOptions,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.doctors);
  const { state } = useLocation();
  const patient_data = state?.patient_data || patientData;
  const { uploadDocCategories, allUploadedDocs, patientUploadedDocs } =
    useSelector((state) => state.uploadDoc);
  const documentOptions = isIPDMedicalRecords && overrideDocumentOptions?.length
    ? overrideDocumentOptions
    : uploadDocCategories.map((item) => {
        return {
          label: item.category_name,
          value: item.category_id,
        };
      });

  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(null);
  const [loader, setLoader] = useState(false);

  const [recordData, setRecordData] = useState([]);
  const fileInputRef = useRef(null);

  const updateRecordData = async () => {
    const updatedRecord = await Promise.all(
      filesData.map(async (item) => {
        let thumbnailUrl;
        let fileData;
        if (!isEditDocument) {
          if (item && item.type === "application/pdf") {
            thumbnailUrl = await loadPdf(URL.createObjectURL(item));
            fileData = uploadDocURLtoFile(
              thumbnailUrl,
              "thumbnail_" +
                item?.name?.substring(0, item?.name?.lastIndexOf(".")) +
                ".png"
            );
          } else {
            thumbnailUrl = URL.createObjectURL(item);
            fileData = new File(
              [item],
              "thumbnail_" +
                item?.name?.substring(0, item?.name?.lastIndexOf(".")) +
                ".png",
              { type: "image/png" }
            );
          }
        }
        return {
          id: item?.id,
          name: item?.name,
          recordType: item?.category_id,
          recordUploadDate: item?.investigation_date
            ? item?.investigation_date
            : dayjs().format("YYYY-MM-DD"),
          notes: item?.notes || "",
          thumbnailUrl: thumbnailUrl,
          thumbnailFile: fileData,
        };
      })
    );
    setRecordData(updatedRecord);
  };

  useEffect(() => {
    if (filesData?.length !== recordData?.length) {
      updateRecordData();
    }
  }, [filesData]);

  useEffect(() => {
    const supportedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (filesData?.length > 0) {
      filesData.forEach((item) => {
        // 15728640 = 15 MB (maximum file size to upload)
        if (item?.size > 15728640) {
          setIsFileSizeError(true);
        }
        if (!supportedTypes?.includes(item?.type)) {
          setIsFileTypeError(item?.type);
        }
      });
      if (filesData.length > 5) {
        setIsFileLimitError(true);
      }
    }
  }, [filesData]);

  const handleRecordChange = (index, field, value) => {
    setRecordData((prevData) =>
      prevData.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const toggleDeletePopup = () => {
    setShowDeletePopup(false);
  };

  const handleDeleteRecord = (index) => {
    const updatedFilesData = filesData?.filter((_, i) => i !== index);
    setFilesData([...updatedFilesData]);
    setRecordData((prevData) => prevData.filter((_, i) => i !== index));
    if (updatedFilesData.length === 0) {
      handleDrawerUploadDoc();
    }
  };

  const handleSubmit = async () => {
    setLoader(true);

    // Separate submit flow for IPD Medical Records (does not affect existing flow)
    if (isIPDMedicalRecords) {
      try {
        // Upload each file via IPD docs API
        for (let i = 0; i < filesData.length; i++) {
          const fileBlob = filesData[i];
          const meta = recordData?.[i];
          // Derive subCategory from selected document option label if available
          const selectedOption = documentOptions.find(
            (opt) => opt.value === meta?.recordType
          );
          const subCategory = (selectedOption?.label || "other").toLowerCase();
          const name = meta?.name || fileBlob?.name;

          await dispatch(uploadMedicalRecordDocument({
            patientId: ipdPatientId,
            admissionId: ipdAdmissionId,
            category: "medical_records",
            subCategory,
            file: fileBlob,
            name,
          }));
        }
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" />
              <div>
                <div className="fontroboto text-start fw-normal mt-1">
                  Medical Records added successfully
                </div>
              </div>
              <img src={imgCloseVisit} className="ms-3" onClick={() => message.destroy()} />
            </div>
          ),
          duration: 5,
        });
      } catch (e) {
        console.error("IPD Medical Records upload failed:", e);
      }
      setLoader(false);
      setFilesData([]);
      setRecordData([]);
      handleDrawerUploadDoc();
      // Refresh the notes after saving
      // await dispatch(getProgressNotes({ patientId, admissionId }));
      await dispatch(getMedicalRecordsDocuments({ 
        patientId: patient_data_naviagte?.patient_unique_id, 
        admissionId: patientDetails?.admissionId, 
        category: "medical_records" 
      }));
      navigate(`/ipd/patient-details`, {
        replace: true,
        state: {
          patient_data : patient_data_naviagte,
          patientDetails,
          isEditable: false,
          activeTab: "records", // This will help identify which tab to show
        },
      });
      return;
    }

    if (isEditDocument) {
      const fileData = recordData?.[0];
      if (fileData) {
        const payload = {
          id: fileData?.id,
          category_id: fileData?.recordType,
          investigation_date: fileData?.recordUploadDate,
          notes: fileData?.notes?.trim(),
        };
        const resultStatus = await updateDocument([payload]);
        if (resultStatus?.status === 204) {
          const doctorUploadedDocs = allUploadedDocs
            .map((item) => {
              if (item?.id)
                return item.id === fileData?.id
                  ? {
                      ...item,
                      category_id: payload?.category_id,
                      investigation_date: payload?.investigation_date,
                      notes: payload?.notes,
                    }
                  : item;
            })
            ?.filter((item) => item !== undefined);
          dispatch(
            setAllUploadedDocs(
              mergeDocuments(doctorUploadedDocs, patientUploadedDocs)
            )
          );
          message.open({
            key: MESSAGE_KEY,
            type: "",
            className: "message-appointment",
            content: (
              <div className="d-flex align-items-center">
                <img src={visitEnd} className="me-3" />
                <div>
                  <div className="fontroboto text-start fw-normal mt-1">
                    Medical Records updated successfully
                  </div>
                </div>
                <img
                  src={imgCloseVisit}
                  className="ms-3"
                  onClick={() => message.destroy()}
                />
              </div>
            ),
            duration: 5,
          });
        }
      }
      setIsEditDocument(false);
    } else {
      const formData = new FormData();
      filesData.forEach((item, index) => {
        formData.append(item?.name, item);
        formData.append(
          "thumbnail_" +
            item?.name?.substring(0, item?.name?.lastIndexOf(".")) +
            ".png",
          recordData?.[index]?.thumbnailFile
        );
      });
      formData.append(
        "pm_id",
        patient_data !== undefined ? patient_data.pm_id : 0
      );
      formData.append(
        "patient_unique_id",
        patient_data !== undefined ? patient_data.patient_unique_id : 0
      );
      formData.append("um_id", userId);
      formData.append(
        "pm_pid",
        patient_data !== undefined ? patient_data.pm_pid : 0
      );
      const uploadResponse = await uploadDocument(formData);
      if (uploadResponse?.length > 0) {
        const payload = uploadResponse.map((item) => {
          const recordItem = recordData.find(
            (record) => record.name === item.name
          );
          return {
            id: item?.id || 0,
            category_id: recordItem?.recordType,
            investigation_date: recordItem?.recordUploadDate,
            notes: recordItem?.notes?.trim(),
          };
        });
        const resultStatus = await updateDocument(payload);
        if (resultStatus?.status === 204) {
          message.open({
            key: MESSAGE_KEY,
            type: "",
            className: "message-appointment",
            content: (
              <div className="d-flex align-items-center">
                <img src={visitEnd} className="me-3" />
                <div>
                  <div className="fontroboto text-start fw-normal mt-1">
                    Medical Records added successfully
                  </div>
                </div>
                <img
                  src={imgCloseVisit}
                  className="ms-3"
                  onClick={() => message.destroy()}
                />
              </div>
            ),
            duration: 5,
          });
        }
      }
      if (isAndroid && !isBrowser) {
        deleteDocsUploadedFromAndroid(patient_data.patient_unique_id);
      }
      if (!isAppointmentData) {
        setTimeout(async () => {
          const doctorUploadedDocs = await fetchAllPatientDocs(
            patient_data?.patient_unique_id
          );
          dispatch(
            setAllUploadedDocs(
              mergeDocuments(doctorUploadedDocs, patientUploadedDocs)
            )
          );
        }, 1100);
      }
    }
    setLoader(false);
    setFilesData([]);
    setRecordData([]);
    handleDrawerUploadDoc();
  };

  const handleFileUpload = async (event) => {
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
        const newRecordData = await Promise.all(
          updatedFiles.map(async (item) => {
            let thumbnailUrl;
            let fileData;
            if (item && item.type === "application/pdf") {
              thumbnailUrl = await loadPdf(URL.createObjectURL(item));
              fileData = uploadDocURLtoFile(
                thumbnailUrl,
                "thumbnail_" +
                  item?.name?.substring(0, item?.name?.lastIndexOf(".")) +
                  ".png"
              );
            } else {
              thumbnailUrl = URL.createObjectURL(item);
              fileData = new File(
                [item],
                "thumbnail_" +
                  item?.name?.substring(0, item?.name?.lastIndexOf(".")) +
                  ".png",
                { type: "image/png" }
              );
            }
            return {
              id: item?.id,
              name: item?.name,
              recordType: undefined,
              recordUploadDate: dayjs().format("YYYY-MM-DD"),
              notes: "",
              thumbnailUrl: thumbnailUrl,
              thumbnailFile: fileData,
            };
          })
        );
        const updatedRecordData = [...newRecordData, ...recordData];
        setRecordData(updatedRecordData);
        setFilesData((prev) => [...updatedFiles, ...prev]);
      }
    }
    event.target.value = null;
  };

  const handleRetryBtn = () => {
    setFilesData([]);
    setRecordData([]);
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    setIsFileTypeError(null);
  };

  const handleLeaveBtn = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handleDrawerUploadDoc();
    toggleDeletePopup();
    setFilesData([]);
    setRecordData([]);
    if (isAndroid && !isBrowser) {
      deleteDocsUploadedFromAndroid(patient_data.patient_unique_id);
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-document">
      <Card bordered={false} className="search-modalCard">
        <div
          className="modalCard-header h-60 align-items-center justify-content-between d-flex"
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
          }}
        >
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={onClose}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">
              {isEditDocument ? "Edit" : "Upload"} Medical Records
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="btn btn-primary3 btn-41 px-4 me-20"
            disabled={
              recordData?.length === 0 ||
              recordData?.filter((item) => item.recordType === undefined)
                ?.length > 0
            }
            loading={loader}
          >
            {isEditDocument ? "Save" : "Submit"}
          </Button>
        </div>

        <div style={{ padding: "20px" }}>
          {!isEditDocument ? (
            <Button
              className="btn-41 btn ant-btn-text btn-input"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              onClick={handleFileInputClick}
            >
              {isAndroid && !isBrowser ? (
                <div
                  ref={fileInputRef}
                  onClick={handleUploadDocPopup}
                  style={{ display: "none" }}
                />
              ) : (
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  style={{ display: "none" }}
                  disabled={filesData.length >= 5}
                />
              )}
              <i className="icon-upload" />
              <span>Upload new report</span>
            </Button>
          ) : null}
        </div>

        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ gap: "24px", padding: "0 24px 24px" }}
        >
          {filesData?.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#FAFAFB",
                borderRadius: "16px",
                padding: "16px 24px",
              }}
            >
              <div className="d-flex justify-content-between pb-3">
                <span style={{ fontWeight: 500 }}>{item?.name}</span>
                {!isEditDocument ? (
                  <i
                    className="icon-delete"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteRecord(index)}
                  />
                ) : null}
              </div>
              <div
                className="d-flex justify-content-between"
                style={{ gap: "32px" }}
              >
                <div>
                  <div
                    className="image-container"
                    style={{
                      backgroundImage: `url('${
                        (isEditDocument
                          ? filesData?.[index]?.thumbnail_url
                          : recordData?.[index]?.thumbnailUrl) || emptyBg
                      }')`,
                      height: 144,
                      width: 144,
                      border: "1px solid #F1F1F5",
                      paddingBottom: "0px",
                    }}
                  >
                    {(isEditDocument && filesData?.[index]?.thumbnail_url) ||
                    recordData?.[index]?.thumbnailUrl ? null : (
                      <>
                        <img
                          className="doc-image"
                          width={62}
                          height={62}
                          src={emptyFile}
                          alt="document"
                        />
                        <div className="file-name">
                          {shortenText(item?.name, 20, 13, -7)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-100">
                  <div
                    className="d-flex align-items-center w-100 justify-content-between"
                    style={{ gap: "32px" }}
                  >
                    <div style={{ width: "50%" }}>
                      <label className="label" style={{ marginBottom: 5 }}>
                        Record Type<span className="mandatory">*</span>
                      </label>
                      <Select
                        style={{ height: 38 }}
                        onChange={(value) =>
                          handleRecordChange(index, "recordType", value)
                        }
                        options={documentOptions}
                        placeholder="Select"
                        className="w-100"
                        value={recordData?.[index]?.recordType}
                        allowClear
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <label style={{ marginBottom: 5 }} className="label">
                        Date of Investigation
                        <span className="mandatory">*</span>
                      </label>
                      <DatePicker
                        placeholder="Select Date"
                        onChange={(_, d) => {
                          handleRecordChange(
                            index,
                            "recordUploadDate",
                            d
                              ? dayjs(d, "DD MMM YYYY").format("YYYY-MM-DD")
                              : ""
                          );
                        }}
                        style={{
                          height: "38px",
                          width: "100%",
                        }}
                        format="DD MMM YYYY"
                        value={
                          recordData?.[index]?.recordUploadDate
                            ? dayjs(recordData?.[index]?.recordUploadDate)
                            : ""
                        }
                        allowClear={false}
                        disabledDate={disableFutureDates}
                        defaultValue={dayjs()}
                      />
                    </div>
                  </div>
                  <div style={{ paddingTop: "12px" }}>
                    <label style={{ marginBottom: 5 }} className="label">
                      Notes
                    </label>
                    <Input.TextArea
                      placeholder="Enter remarks"
                      className="textareaPlaceholder"
                      style={{ height: "38px" }}
                      value={recordData?.[index]?.notes}
                      onChange={(e) =>
                        handleRecordChange(index, "notes", e.target.value)
                      }
                      autoComplete="off"
                      autoCorrect="off"
                      maxLength={300}
                    />
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ marginTop: 5 }}
                    >
                      <label style={{ color: "#A2A2A8", fontSize: 10 }}>
                        Write maximum 300 characters
                      </label>
                      <label style={{ fontSize: 10 }}>
                        {`${recordData?.[index]?.notes?.length || 0} / 300`}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {shouldShowDeletePopup ||
      isFileSizeError ||
      isFileLimitError ||
      isFileTypeError ? (
        <CommonModal
          isModalOpen={
            shouldShowDeletePopup ||
            isFileSizeError ||
            isFileLimitError ||
            isFileTypeError
          }
          onCancel={
            isFileSizeError || isFileLimitError || isFileTypeError
              ? handleDrawerUploadDoc
              : toggleDeletePopup
          }
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
                        <span style={{ fontWeight: 700 }}>15MB.</span> Please
                        upload a file smaller than 15MB
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
                {isFileSizeError || isFileLimitError || isFileTypeError ? (
                  <Button
                    onClick={handleRetryBtn}
                    className="w-100 btn btn-primary3 btn-41 px-4"
                  >
                    Retry
                  </Button>
                ) : (
                  <div className="d-flex align-items-center mt-2 justify-content-end">
                    <div
                      onClick={handleLeaveBtn}
                      className="me-4 text-decoration-underline btn p-0 text-main"
                    >
                      Yes, Leave
                    </div>
                    <Button
                      onClick={toggleDeletePopup}
                      className="lh-lg btn btn-primary3 btn-41 px-4"
                    >
                      <span>No, Stay</span>
                    </Button>
                  </div>
                )}
              </div>
            </>
          }
        />
      ) : null}
    </div>
  );
};

export default UploadDocument;
