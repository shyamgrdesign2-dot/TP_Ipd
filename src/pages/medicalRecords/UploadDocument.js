import { Button, Card, DatePicker, Input, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import emptyBg from "./../../assets/images/empty-bg.svg";
import emptyFile from "./../../assets/images/empty-file.svg";
import dayjs from "dayjs";
import { disableFutureDates } from "../growthChart/growthChartHelper";
import "./UploadDocument.scss";
import CommonModal from "../../common/CommonModal";
import alertIcon from "./../../assets/images/alertIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPatientDocs,
  fetchDocById,
  updateDocument,
  uploadDocument,
} from "./service";
import { setAllUploadedDocs } from "../../redux/uploadDocSlice";
import { useLocation } from "react-router-dom";
import { shortenText } from "./components/recordCard/RecordCard";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import SuccessPopup from "../../common/SuccessPopup";
import { isAndroid, isBrowser } from "react-device-detect";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const dataURLtoFile = (dataurl, filename) => {
  const base64 = dataurl?.split(",")?.[1];
  const mime = dataurl?.match(/:(.*?);/)?.[1];

  const bstr = atob(base64);
  let n = bstr?.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

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
  isAppointmentData,
  handleUploadDocPopup,
}) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.doctors);
  const { state } = useLocation();
  const patient_data = state?.patient_data || patientData;
  const { uploadDocCategories, allUploadedDocs } = useSelector(
    (state) => state.uploadDoc
  );
  const documentOptions = uploadDocCategories.map((item) => {
    return {
      label: item.category_name,
      value: item.category_id,
    };
  });

  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loader, setLoader] = useState(false);

  const [recordData, setRecordData] = useState([]);
  const fileInputRef = useRef(null);

  const updateRecordData = async () => {
    const updatedRecord = await Promise.all(
      filesData.map(async (item, index) => {
        let thumbnailUrl;
        let fileData;
        if (!isEditDocument) {
          if (item && item.type === "application/pdf") {
            thumbnailUrl = await loadPdf(URL.createObjectURL(item));
            fileData = dataURLtoFile(
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
          name:
            item?.name !== "image.jpg" ? item?.name : `image${index + 1}.jpg`,
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
        // 8388608 = 8 MB (maximum file size to upload)
        if (item?.size > 8388608) {
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
          const response = await fetchDocById(fileData?.id);
          let updatedData = allUploadedDocs.map((item) =>
            item.id === fileData?.id ? response : item
          );
          dispatch(setAllUploadedDocs(updatedData));
          setShowSuccess(true);
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
        updateDocument(payload);
      }
      if (!isAppointmentData) {
        setTimeout(async () => {
          const response = await fetchAllPatientDocs(
            patient_data?.patient_unique_id
          );
          dispatch(setAllUploadedDocs(response));
        }, 1100);
      }
      setShowSuccess(true);
    }
    setLoader(false);
    handleDrawerUploadDoc();
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const totalFiles = [...selectedFiles, ...filesData];
    const newRecordData = await Promise.all(
      selectedFiles.map(async (item, index) => {
        let thumbnailUrl;
        let fileData;
        if (item && item.type === "application/pdf") {
          thumbnailUrl = await loadPdf(URL.createObjectURL(item));
          fileData = dataURLtoFile(
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
          name:
            item?.name !== "image.jpg" ? item?.name : `image${index + 1}.jpg`,
          recordType: undefined,
          recordUploadDate: dayjs().format("YYYY-MM-DD"),
          notes: "",
          thumbnailUrl: thumbnailUrl,
          thumbnailFile: fileData,
        };
      })
    );
    const updatedRecordData = [...newRecordData, ...recordData];
    setFilesData(totalFiles);
    setRecordData(updatedRecordData);
  };

  const handleRetryBtn = () => {
    setFilesData([]);
    setRecordData([]);
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    setIsFileTypeError(null);
  };

  const handleLeaveBtn = () => {
    handleDrawerUploadDoc();
    toggleDeletePopup();
    setFilesData([]);
    setRecordData([]);
  };

  const loadPdf = (url) => {
    return new Promise(async (resolve) => {
      try {
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        // Convert canvas to data URL (base64)
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL); // Return the base64 image data
      } catch (e) {
        resolve("");
      }
    });
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
          {filesData.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#FAFAFB",
                borderRadius: "16px",
                padding: "16px 24px",
              }}
            >
              <div className="d-flex justify-content-between pb-3">
                <span style={{ fontWeight: 500 }}>
                  {recordData?.[index]?.name}
                </span>
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
      {showSuccess && (
        <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
      )}
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
