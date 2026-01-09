import React, { useState, useCallback, useEffect, useRef } from "react";
import CashManagerContext from "../../../context/CashManagerContext";
import { useLocation, useNavigate } from "react-router-dom";
import visitEnd from "../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../assets/images/close-visit.svg";
import Header from "./components/Header";
import FullPageLoader from "../../vaccination/components/Loader";
import ErrorBoundary from "./components/ErrorBoundary";
import UploadedFilesPreview from "./components/UploadedFilesPreview";
import { Drawer } from "antd";
import KnowMore from "../../../components/KnowMore";
import { MESSAGE_KEY, SNAP_RX_KNOW_MORE_DATA } from "../../../utils/constants";
import FileUploadErrorModal from "../../../components/common/FileUploadErrorModal";
import {
  IPDSnapRxSessionProvider,
} from "./context/SnapRxSessionContext";
import UploadMoreDrawer from "./components/UploadMoreDrawer";
import UploadWrittenRx from "./components/UploadWrittenRx";
import { message, Button } from "antd";
import { createSnapRx, editSnapRx } from "./services/snapRxService";
import "./SnapRx.scss";
import { useSelector } from "react-redux";
import {
  generateFileUploadToken,
  getFiles,
  setFileUploadToken,
  setFileUploadSessionId,
  setUploadedFilesFromStore,
  digitizeAssessments,
  resetFileUploadToken,
} from "../../../redux/ipd/ipdSnapRxDigitizationSlice";
import { useDispatch } from "react-redux";
import PreviewDrawer from "./components/PreviewDrawer";
import { clearExpiredTokensFromStorage } from "../../../utils/utils";
import { SNAP_RX_TOKENS_STORAGE_KEY } from "../../../utils/constants";
import { useAssessmentDataStore } from "../../../hooks/useAssessmentDataStore";
import GenRXLoaders from "../../../components/GenRxLoaders";
const UPLOADED_FILES_DOMAIN = "iscribe.blob.core.windows.net";

const getTokenKey = (patientId, admissionId, schemaKey) =>
  `fileUploadToken_${patientId}_${admissionId}_${schemaKey || "ASSESSMENTS"}`;

const getLegacyTokenKey = (patientId, admissionId) =>
  `fileUploadToken_${patientId}_${admissionId}`;

function SnapRxContent({
  previousOutput,
  handleClose,
  schemaKey = "ASSESSMENTS",
  onSuccess,
  onDigitizingChange,
}) {
  const { addDataToStore } = useAssessmentDataStore();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    uploadedFiles: uploadedFilesFromStoreRaw,
    uploadedFilesScope,
    fileUploadToken,
    fileUploadSessionId: sessionId,
  } = useSelector((state) => state.ipdSnapRx);
  
  const patientId = patientDetails?.details?.id;
  const admissionId = patientDetails?.admissionId;
  
  const uploadedFilesFromStore =
    uploadedFilesScope?.patientId === patientId &&
    uploadedFilesScope?.admissionId === admissionId &&
    uploadedFilesScope?.schemaKey === schemaKey
      ? (uploadedFilesFromStoreRaw || [])
      : [];
  const { userId } = useSelector((state) => state.doctors);
  const uploadWrittenRxRef = useRef(null);
  const timerForLoadingRef = useRef(null);
  const isGeneratingTokenRef = useRef(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showKnowMore, setShowKnowMore] = useState(false);
  const [isUploadMoreDrawerOpen, setIsUploadMoreDrawerOpen] = useState(false);
  const [isAddMoreClicked, setIsAddMoreClicked] = useState(false);
  const [isDigitizing, setIsDigitizing] = useState(false);
  const previewDrawerRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isWaitingForFiles, setIsWaitingForFiles] = useState(false);
  const { patient_data, send_path, caseManagerData, pam_id } = state || {};
  const tcmId = caseManagerData?.tcm_id || 0;
  const pamId = pam_id
    ? pam_id
    : caseManagerData !== undefined
    ? caseManagerData.pam_id
    : 0;

  const contextApi = {
    patient_data,
    send_path,
    tcmId,
    pamId,
  };

  useEffect(() => {
    clearExpiredTokensFromStorage();
  }, []);

  useEffect(() => {
    const patientId = patientDetails?.details?.id;
    const admissionId = patientDetails?.admissionId;
    if (!patientId || !admissionId) return;

    const tokenKey = getTokenKey(patientId, admissionId, schemaKey);
    const legacyTokenKey = getLegacyTokenKey(patientId, admissionId);
    const tokenDataString = localStorage.getItem(SNAP_RX_TOKENS_STORAGE_KEY);
    if (tokenDataString) {
      try {
        const parsed = JSON.parse(tokenDataString);
        const storedToken = parsed[tokenKey] || parsed[legacyTokenKey];
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const isExpired =
          !storedToken?.timestamp ||
          Date.now() - storedToken.timestamp > ONE_DAY_MS ||
          Date.now() > storedToken.expiresIn;
        if (storedToken && !isExpired) {
          dispatch(setFileUploadToken(storedToken.value));
          if (storedToken.sessionId) {
            dispatch(setFileUploadSessionId(storedToken.sessionId));
          }
          // migrate legacy key forward
          if (parsed[legacyTokenKey] && !parsed[tokenKey]) {
            delete parsed[legacyTokenKey];
            parsed[tokenKey] = storedToken;
            localStorage.setItem(
              SNAP_RX_TOKENS_STORAGE_KEY,
              JSON.stringify(parsed)
            );
          }
          return;
        }
        if (isExpired) {
          if (parsed[tokenKey]) delete parsed[tokenKey];
          if (parsed[legacyTokenKey]) delete parsed[legacyTokenKey];
          localStorage.setItem(
            SNAP_RX_TOKENS_STORAGE_KEY,
            JSON.stringify(parsed)
          );
        }
      } catch (error) {
        console.error("Error parsing stored token:", error);
      }
    }

    if (isGeneratingTokenRef.current) return;

    dispatch(setFileUploadToken(null));
    dispatch(setFileUploadSessionId(null));
    isGeneratingTokenRef.current = true;
    dispatch(
      generateFileUploadToken({
        patientId,
        admissionId,
        schemaKey,
      })
    ).finally(() => {
      isGeneratingTokenRef.current = false;
    });
  }, [fileUploadToken, patientDetails, schemaKey]);

  useEffect(() => {
    return () => {
      dispatch(setFileUploadToken(null));
    };
  }, []);

  useEffect(() => {
    if (onDigitizingChange) {
      onDigitizingChange(isDigitizing);
    }
  }, [isDigitizing, onDigitizingChange]);

  useEffect(() => {
    return () => {
      if (onDigitizingChange) {
        onDigitizingChange(false);
      }
    };
  }, [onDigitizingChange]);

  useEffect(() => {
    if (!isDigitizing) return;
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDigitizing]);

  const fetchUploadedFiles = async (
    createEditSnapRx = false,
    showErrorOnRefreshClick = false
  ) => {
    const patientId = patientDetails?.details?.id;
    const admissionId = patientDetails?.admissionId;
    const tokenForFiles = fileUploadToken;
    if (!patientId || !admissionId) {
      message.error("Patient information is missing. Please try again.");
      return;
    }
    if (showErrorOnRefreshClick) {
      setIsLoading(true);
    }
    try {
      const reqData = {
        patientId,
        admissionId,
        sessionId,
        fileUploadToken: tokenForFiles,
        type: schemaKey,
      };
      dispatch(
        getFiles({
          ...reqData,
        })
      ).then((action) => {
        if (createEditSnapRx) {
          setIsWaitingForFiles(true);
          handleCreateSnapRx();
        }
      });
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    } finally {
      timerForLoadingRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (fileUploadToken) {
      fetchUploadedFiles();
    }
  }, [fileUploadToken, patientDetails, schemaKey]);

  useEffect(() => {
    return () => {
      clearTimeout(timerForLoadingRef.current);
    };
  }, []);

  const fetchImageAsFile = async (url, filename = "image.jpg") => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchImages = async (toDeleteFile = null) => {
    const patientId = patientDetails?.details?.id;
    const admissionId = patientDetails?.admissionId;
    if (!patientId || !admissionId) {
      setIsLoading(false);
      message.error("Patient information is missing. Please try again.");
      return;
    }
    if (uploadedFilesFromStore?.length === 0) {
      setUploadedFiles([]);
      setIsLoading(false);
      return;
    }
    if (
      !uploadedFilesFromStore?.[0]?.fileUrl?.includes(UPLOADED_FILES_DOMAIN)
    ) {
      const dedupedFiles = Array.from(
        new Map(
          uploadedFilesFromStore.map((file) => [
            file.filename || file.name,
            file,
          ])
        ).values()
      );
      setUploadedFiles(dedupedFiles);
      dispatch(setUploadedFilesFromStore(dedupedFiles));
      setIsLoading(false);
      return;
    }

    try {
      const dedupedFiles = Array.from(
        new Map(
          uploadedFilesFromStore.map((file) => [
            file.filename || file.name,
            file,
          ])
        ).values()
      );
      // Apply deletion before normalizing to avoid re-uploading/duplicating files
      const filteredStoreFiles = toDeleteFile
        ? dedupedFiles.filter(
            (file) =>
              file?.filename !== toDeleteFile &&
              file?.name !== toDeleteFile &&
              file !== toDeleteFile
          )
        : dedupedFiles;

      const normalizedFiles = await Promise.all(
        filteredStoreFiles.map(async (file, index) => {
          const fileBlob = await fetchImageAsFile(file.fileUrl);
          const objectUrl = URL.createObjectURL(fileBlob);
          return {
            id: Date.now() + index,
            name: file.filename || file.name,
            filename: file.filename || file.name,
            file: fileBlob,
            fileUrl: objectUrl,
            url: objectUrl,
            preview: objectUrl,
            rotation: 0,
            zoom: 1,
            crop: file?.crop || {
              unit: "%",
              x: 2,
              y: 2,
              width: 96,
              height: 96,
            },
          };
        })
      );
      setUploadedFiles(normalizedFiles);
      dispatch(setUploadedFilesFromStore(filteredStoreFiles));
      if (toDeleteFile) {
        try {
          if (!filteredStoreFiles.length) {
            message.warning(
              "You cannot delete the only file. Please reupload the file."
            );
          }
        } catch (err) {
          console.error("Error: fetching images in snapRx", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (
      !isLoading &&
      !uploadedFilesFromStore?.length &&
      !uploadedFiles?.length
    ) {
      navigate(-1, { replace: true });
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [uploadedFilesFromStore?.length]);

  useEffect(() => {
    if (isWaitingForFiles && uploadedFilesFromStore?.length > 0) {
      handleCreateSnapRx();
      setIsWaitingForFiles(false);
    }
  }, [isWaitingForFiles, uploadedFilesFromStore]);

  const handleEditSnapRx = useCallback(async () => {
    if (uploadedFiles?.length === 0 && uploadedFilesFromStore?.length === 0) {
      message.warning("Please upload prescription images before submitting");
      return;
    }

    if (!patient_data?.patient_unique_id) {
      message.error("Patient information is missing. Please try again.");
      return;
    }

    setIsUploading(true);

    try {
      const fileNames =
        uploadedFilesFromStore?.length > 0
          ? uploadedFilesFromStore.map((file) => file.filename || file.name)
          : uploadedFiles.map((file) => file?.filename || file.name);

      const response = await editSnapRx(
        patient_data.patient_unique_id,
        fileNames,
        tcmId,
        sessionId
      );

      if (response && response.status) {
        dispatch(setFileUploadToken(null));
        navigate("/ipd/snap-rx/preview", {
          state: {
            ...state,
            ...response?.data,
            files:
              uploadedFilesFromStore?.length > 0
                ? uploadedFilesFromStore
                : uploadedFiles,
          },
          replace: true,
        });
      } else {
        throw new Error(response.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating snap rx:", error);
      message.error(
        error.message || "Failed to create prescription. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles, patient_data, navigate, state, uploadedFilesFromStore]);

  const handleCreateSnapRx = useCallback(async () => {
    if (!uploadedFilesFromStore?.length) {
      fetchUploadedFiles(true);
      return;
    }
    if (!uploadedFilesFromStore?.length) {
      message.warning("Please upload prescription images before submitting");
      return;
    }

    if (!patient_data?.patient_unique_id) {
      message.error("Patient information is missing. Please try again.");
      return;
    }

    setIsUploading(true);

    try {
      const fileNames = uploadedFilesFromStore.map((file) => file.filename);

      const response = await createSnapRx(
        patient_data.patient_unique_id,
        fileNames,
        sessionId,
        patient_data?.pam_id
      );
      if (response && response.status) {
        dispatch(setFileUploadToken(null));
        navigate("/ipd/snap-rx/preview", {
          replace: true,
          state: { ...state, ...response?.data, files: uploadedFilesFromStore },
        });
      } else {
        throw new Error(response.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating snap rx:", error);
      message.error(
        error.message || "Failed to create prescription. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFilesFromStore, patient_data, navigate, tcmId, sessionId]);

  const handleClearFiles = () => {
    // clear all files
  };

  const handleUploadMore = useCallback(() => {
    setIsUploadMoreDrawerOpen(true);
  }, []);

  const handleUploadMoreDrawerClose = () => {
    setIsUploadMoreDrawerOpen(false);
    setIsPreviewOpen(false);
    setIsAddMoreClicked(false);
  };

  const fetchUploadedFilesOnUploadMoreDrawer = () => {
    if (isUploadMoreDrawerOpen) {
      setIsUploadMoreDrawerOpen(false);
    }
    fetchUploadedFiles();
  };

  const handleKnowMore = () => {
    setShowKnowMore(!showKnowMore);
  };

  const handleAddMore = () => {
    uploadWrittenRxRef?.current?.handleAddMore();
  };

  const handleReupload = (fileId) => {
    uploadWrittenRxRef?.current?.handleReupload(fileId);
  };

  const handleZoomIn = (fileId) => {
    uploadWrittenRxRef?.current?.handleZoomIn(fileId);
  };

  const handleZoomOut = (fileId) => {
    uploadWrittenRxRef?.current?.handleZoomOut(fileId);
  };

  const handleRemoveFile = (file) => {
    const fileId = file?.id;
    const filename = file?.filename || file?.name || file;

    // If files are already on the server, delete via refresh flow
    if (uploadedFilesFromStore?.length) {
      handlePreviewDelete(filename);
      return;
    }

    // Fallback: just remove from local uploads
    if (fileId || filename) {
      uploadWrittenRxRef?.current?.handleRemoveFile(fileId || filename, true, !fileId);
    }
  };

  const handleRotateClick = (fileId) => {
    uploadWrittenRxRef?.current?.handleRotateClick(fileId);
  };

  const handleGoBackToMainFiles = () => {
    clearTimeout(timerForLoadingRef.current);
    setIsLoading(true);
    dispatch(setUploadedFilesFromStore([]));
    fetchUploadedFiles();
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    setIsAddMoreClicked(false);
    setIsUploadMoreDrawerOpen(false);
  };

  const handleRefreshForMobileUploadedFiles = () => {
    fetchUploadedFiles(false, true);
  };

  const handleFileEdit = (file) => {
    uploadWrittenRxRef?.current?.handleFileEdit(file);
    previewDrawerRef?.current?.handleFileEdit(file);
  };

  const handlePreviewDelete = (file) => {
    const filename =
      (file && (file.filename || file.name)) || file || "";
    if (!filename) {
      message.error("Unable to delete the selected file. Please try again.");
      return;
    }
    setIsLoading(true);
    fetchImages(filename);
  };
  const removeFileUploadTokenFromLS = () => {
    const patientId = patientDetails?.details?.id;
    const admissionId = patientDetails?.admissionId;
    if (patientId && admissionId) {
      const tokenKey = getTokenKey(patientId, admissionId, schemaKey);
      const legacyTokenKey = getLegacyTokenKey(patientId, admissionId);
      const tokenDataString = localStorage.getItem(SNAP_RX_TOKENS_STORAGE_KEY);
      if (tokenDataString) {
        try {
          const tokenData = JSON.parse(tokenDataString);
          if (tokenData[tokenKey]) delete tokenData[tokenKey];
          if (tokenData[legacyTokenKey]) delete tokenData[legacyTokenKey];
          localStorage.setItem(
            SNAP_RX_TOKENS_STORAGE_KEY,
            JSON.stringify(tokenData)
          );
        } catch (e) {
          // fallback to removing the whole key
          localStorage.removeItem(SNAP_RX_TOKENS_STORAGE_KEY);
        }
      }
    }
  };

  const handleExtract = async () => {
    try {
      setIsDigitizing(true);
      const res = await dispatch(
        digitizeAssessments({
          previousOutput,
          schemaKey,
        })
      ).unwrap();
      const digitizedData =
        res?.data?.rxDigitizationHistory?.[0]?.response || {};

      if (onSuccess) {
        onSuccess(digitizedData);
      } else {
        addDataToStore(digitizedData || {}, true);
      }
      dispatch(resetFileUploadToken());
      removeFileUploadTokenFromLS();
      handleClose();
      message.open({
        key: MESSAGE_KEY,
        type: "",
        className: "message-appointment",
        content: (
          <div className="d-flex align-items-center">
            <img src={visitEnd} className="me-3" alt="Visit End" />
            <div>
              <div className="title-common text-start fontroboto">
                Your Input Autofilled Successfully
              </div>
            </div>
            <img
              src={imgCloseVisit}
              className="ms-3"
              onClick={() => message.destroy()}
              alt="Close Visit"
            />
          </div>
        ),
        duration: 3,
      });
    } catch (error) {
      console.error("Error digitizing assessment:", error);
      message.error("Failed to extract details. Please try again.");
    } finally {
      setIsDigitizing(false);
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <CashManagerContext.Provider value={contextApi}>
      <PreviewDrawer
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        tcmId={tcmId}
        ref={previewDrawerRef}
        sessionId={sessionId}
        uploadedFilesFromStore={uploadedFilesFromStore}
        onCloseDrawer={handleUploadMoreDrawerClose}
        uploadedFiles={uploadedFiles}
        onReupload={handleReupload}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        handleUpdatedFiles={setUploadedFiles}
        onRemove={handleRemoveFile}
        onRotate={handleRotateClick}
        handleGoBackToMainFiles={handleGoBackToMainFiles}
        onAddMore={handleAddMore}
        isUploadMoreDrawer={false}
        schemaKey={schemaKey}
        style={{
          display: isPreviewOpen ? "block" : "none",
        }}
      />

      <div
        className={`snap-rx-container ${
          uploadedFilesFromStore?.length ? "with-overflow-hidden" : ""
        }`}
        style={{
          display: isPreviewOpen ? "none" : "block",
        }}
      >
        {isDigitizing ? (
          <div className="snaprx-digitizing-overlay" role="status" aria-live="polite">
            <div className="snaprx-digitizing-center">
              <GenRXLoaders
                isProcessing={true}
                isSnapRx={true}
                showStepText={false}
                showProgress={false}
                containerStyle={{ height: "220px", width: "240px", padding: "16px" }}
              />
              <div className="snaprx-digitizing-text">
                Extracting your input data...
              </div>
            </div>
          </div>
        ) : null}
        {/* <Header
          loader={isUploading}
          onClear={handleClearFiles}
          onSubmit={handleCreateSnapRx}
          onUploadMore={handleUploadMore}
          showUploadMoreButton={uploadedFilesFromStore?.length}
          handleTutorial={handleKnowMore}
        /> */}
        <ErrorBoundary>
          <div
            className={`snap-rx-content ${
              uploadedFilesFromStore?.length ? "with-overflow-auto" : ""
            }`}
          >
            {uploadedFilesFromStore?.length && !isUploadMoreDrawerOpen ? (
              <>
                <UploadedFilesPreview
                  uploadedFiles={uploadedFilesFromStore}
                  onEdit={handleFileEdit}
                  loading={false}
                  onDelete={handlePreviewDelete}
                />
              </>
            ) : null}
            <UploadWrittenRx
              isOpen={!uploadedFilesFromStore?.length || isUploadMoreDrawerOpen}
              ref={uploadWrittenRxRef}
              showBackButton={false}
              onBack={() => {}}
              fetchUploadedFiles={handleRefreshForMobileUploadedFiles}
              handlePreviewOpen={setIsPreviewOpen}
              handleUpdatedFiles={setUploadedFiles}
              uploadedFiles={uploadedFiles}
              setIsAddMoreClicked={setIsAddMoreClicked}
              schemaKey={schemaKey}
            />
            {/* Preview Drawer */}
          </div>
          {uploadedFilesFromStore?.length && !isUploadMoreDrawerOpen ? (
            <>
              <div className="snap-rx-floating-actions">
                <Button
                  className="upload-more-btn"
                  onClick={handleUploadMore}
                  disabled={isDigitizing}
                >
                  Upload More
                </Button>
                <Button
                  type="primary"
                  className="extract-btn"
                  onClick={handleExtract}
                  disabled={isDigitizing}
                >
                  Extract & Autofill Details
                </Button>
              </div>
            </>
          ) : null}
        </ErrorBoundary>
      </div>

      {/* <UploadMoreDrawer
        isOpen={isUploadMoreDrawerOpen}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        setIsAddMoreClicked={setIsAddMoreClicked}
        onClose={handleUploadMoreDrawerClose}
        setIsPreviewOpen={setIsPreviewOpen}
        fetchUploadedFiles={fetchUploadedFilesOnUploadMoreDrawer}
        tcmId={tcmId}
        sessionId={sessionId}
        onFileUpload={() => {}}
      /> */}

      <FileUploadErrorModal
        isFileSizeError={false}
        isFileLimitError={false}
        isFileTypeError={false}
        onRetry={() => {}}
      />

      {showKnowMore && (
        <Drawer
          open={showKnowMore}
          onClose={handleKnowMore}
          width={"51.625rem"}
          placement="right"
          styles={{
            header: {
              display: "none",
            },
          }}
        >
          <KnowMore
            handleKnowMore={handleKnowMore}
            data={SNAP_RX_KNOW_MORE_DATA}
          />
        </Drawer>
      )}
    </CashManagerContext.Provider>
  );
}

// Main component with session provider
export default function IPDSnapRx({
  previousOutput,
  handleClose,
  schemaKey,
  onSuccess,
  onDigitizingChange,
}) {
  return (
    <IPDSnapRxSessionProvider>
      <SnapRxContent
        previousOutput={previousOutput}
        handleClose={handleClose}
        schemaKey={schemaKey}
        onSuccess={onSuccess}
        onDigitizingChange={onDigitizingChange}
      />
    </IPDSnapRxSessionProvider>
  );
}
