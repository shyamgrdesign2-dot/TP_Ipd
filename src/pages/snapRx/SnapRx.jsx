import React, { useState, useCallback, useEffect, useRef } from "react";
import CashManagerContext from "../../context/CashManagerContext";
import { useLocation, useNavigate } from "react-router-dom";
import visitEnd from "../../assets/images/end-visit.svg";
import imgCloseVisit from "../../assets/images/close-visit.svg";
import FullPageLoader from "../vaccination/components/Loader";
import ErrorBoundary from "./components/ErrorBoundary";
import UploadedFilesPreview from "./components/UploadedFilesPreview";
import { Drawer, message, Button } from "antd";
import KnowMore from "../../components/KnowMore";
import { MESSAGE_KEY, SNAP_RX_KNOW_MORE_DATA, SNAP_RX_TOKENS_STORAGE_KEY } from "../../utils/constants";
import FileUploadErrorModal from "../../components/common/FileUploadErrorModal";
import {
  SnapRxSessionProvider,
  useSnapRxSession,
} from "./context/SnapRxSessionContext";
import UploadWrittenRx from "./components/UploadWrittenRx";
import { createSnapRx, editSnapRx } from "./services/snapRxService";
import "./SnapRx.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  generateFileUploadToken,
  getFiles,
  setFileUploadToken,
  setFileUploadSessionId,
  setUploadedFilesFromStore,
  digitizeAssessments,
  resetFileUploadToken,
} from "../../redux/ipd/ipdSnapRxDigitizationSlice";
import PreviewDrawer from "./components/PreviewDrawer";
import { clearExpiredTokensFromStorage } from "../../utils/utils";
import { useAssessmentDataStore } from "../../hooks/useAssessmentDataStore";

const UPLOADED_FILES_DOMAIN = "iscribe.blob.core.windows.net";

const stableIdFromName = (name = "") =>
  `srv_${String(name).trim().toLowerCase().replace(/\s+/g, "_")}`;

function SnapRxContent({ previousOutput, handleClose, schemaKey = "ASSESSMENTS" }) {
  const { addDataToStore } = useAssessmentDataStore();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    uploadedFiles: uploadedFilesFromStore,
    fileUploadToken,
    fileUploadSessionId: sessionId,
  } = useSelector((s) => s.ipdSnapRx);

  const uploadWrittenRxRef = useRef(null);
  const previewDrawerRef = useRef(null);
  const timerForLoadingRef = useRef(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showKnowMore, setShowKnowMore] = useState(false);
  const [isUploadMoreDrawerOpen, setIsUploadMoreDrawerOpen] = useState(false);
  const [isAddMoreClicked, setIsAddMoreClicked] = useState(false);
  const [isDigitizing, setIsDigitizing] = useState(false);

  // This is the local “working set” used by PreviewDrawer (crop/rotate/etc).
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isWaitingForFiles, setIsWaitingForFiles] = useState(false);

  const { patient_data, send_path, caseManagerData, pam_id } = state || {};
  const tcmId = caseManagerData?.tcm_id || 0;
  const pamId =
    pam_id ? pam_id : caseManagerData !== undefined ? caseManagerData.pam_id : 0;

  const contextApi = { patient_data, send_path, tcmId, pamId };

  const { setHasUploadedFiles } = useSnapRxSession();

  const requestSeqRef = useRef(0);

  useEffect(() => {
    clearExpiredTokensFromStorage();
  }, []);

  // token bootstrap
  useEffect(() => {
    const patientId = patientDetails?.details?.id;
    const admissionId = patientDetails?.admissionId;
    if (!patientId || !admissionId) return;

    const tokenKey = `fileUploadToken_${patientId}_${admissionId}`;
    const tokenDataString = localStorage.getItem(SNAP_RX_TOKENS_STORAGE_KEY);

    if (tokenDataString) {
      try {
        const parsed = JSON.parse(tokenDataString);
        const storedToken = parsed[tokenKey];
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const isExpired =
          !storedToken?.timestamp ||
          Date.now() - storedToken.timestamp > ONE_DAY_MS ||
          Date.now() > storedToken.expiresIn;

        if (storedToken && !isExpired) {
          dispatch(setFileUploadToken(storedToken.value));
          if (storedToken.sessionId) dispatch(setFileUploadSessionId(storedToken.sessionId));
          return;
        }

        if (isExpired && parsed[tokenKey]) {
          delete parsed[tokenKey];
          localStorage.setItem(SNAP_RX_TOKENS_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch (error) {
        console.error("Error parsing stored token:", error);
      }
    }

    if (!fileUploadToken) {
      dispatch(generateFileUploadToken({ patientId, admissionId, schemaKey }));
    }
  }, [dispatch, fileUploadToken, patientDetails, schemaKey]);

  useEffect(() => {
    return () => {
      dispatch(setFileUploadToken(null));
    };
  }, []);

  const fetchUploadedFiles = async (createEditSnapRx = false, showLoader = false) => {
    const patientId = patientDetails?.details?.id;
    const admissionId = patientDetails?.admissionId;
    if (!patientId || !admissionId) {
      message.error("Patient information is missing. Please try again.");
      return;
    }

    if (showLoader) setIsLoading(true);

    try {
      const reqData = {
        patientId,
        admissionId,
        sessionId,
        fileUploadToken,
        type: schemaKey,
      };
      dispatch(getFiles(reqData)).then(() => {
        if (createEditSnapRx) {
          setIsWaitingForFiles(true);
          handleCreateSnapRx();
        }
      });
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    } finally {
      timerForLoadingRef.current = setTimeout(() => setIsLoading(false), 600);
    }
  };

  useEffect(() => {
    if (fileUploadToken) fetchUploadedFiles();
  }, [fileUploadToken, patientDetails, schemaKey]);

  useEffect(() => {
    return () => clearTimeout(timerForLoadingRef.current);
  }, []);

  /**
   * Normalize redux “server list” into local “working list” WITHOUT:
   * - downloading blobs
   * - creating object URLs
   * - generating Date.now IDs
   *
   * This makes delete instant + prevents duplication loops.
   */
  const syncLocalWorkingFilesFromStore = useCallback(
    (storeFiles) => {
      const seq = ++requestSeqRef.current;

      const list = Array.isArray(storeFiles) ? storeFiles : [];
      if (!list.length) {
        setUploadedFiles([]);
        setIsLoading(false);
        return;
      }

      const deduped = Array.from(
        new Map(
          list.map((f) => [
            (f.filename || f.name || "").trim().toLowerCase(),
            f,
          ])
        ).values()
      );

      const normalized = deduped.map((f, index) => {
        const name = f.filename || f.name || `page_${index + 1}.jpeg`;
        const fileUrl = f.fileUrl; // remote blob url from API
        return {
          id: stableIdFromName(name),
          name,
          filename: name,
          fileUrl,
          url: fileUrl,
          preview: fileUrl,
          rotation: 0,
          zoom: 1,
          crop: f.crop || { unit: "%", x: 2, y: 2, width: 96, height: 96 },
          // file: undefined here on purpose (lazy)
          __source: "server",
        };
      });

      // apply only latest call
      if (seq === requestSeqRef.current) {
        setUploadedFiles(normalized);
        setIsLoading(false);
      }
    },
    []
  );

  // whenever redux store list changes, re-sync working list (fast)
  useEffect(() => {
    syncLocalWorkingFilesFromStore(uploadedFilesFromStore);
  }, [uploadedFilesFromStore, syncLocalWorkingFilesFromStore]);

  // if everything empty, go back
  useEffect(() => {
    if (!isLoading && !uploadedFilesFromStore?.length && !uploadedFiles?.length) {
      navigate(-1, { replace: true });
    }
  }, [isLoading, uploadedFilesFromStore?.length, uploadedFiles?.length]);

  useEffect(() => {
    return () => {
      // no objectURLs created in sync now, so nothing heavy to cleanup here
    };
  }, []);

  useEffect(() => {
    if (isWaitingForFiles && uploadedFilesFromStore?.length > 0) {
      handleCreateSnapRx();
      setIsWaitingForFiles(false);
    }
  }, [isWaitingForFiles, uploadedFilesFromStore]);

  const handleEditSnapRx = useCallback(async () => {
    if (!uploadedFilesFromStore?.length && !uploadedFiles?.length) {
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
          ? uploadedFilesFromStore.map((f) => f.filename || f.name)
          : uploadedFiles.map((f) => f.filename || f.name);

      const response = await editSnapRx(
        patient_data.patient_unique_id,
        fileNames,
        tcmId,
        sessionId
      );

      if (response?.status) {
        dispatch(setFileUploadToken(null));
        navigate("/ipd/snap-rx/preview", {
          state: { ...state, ...response?.data, files: uploadedFilesFromStore?.length ? uploadedFilesFromStore : uploadedFiles },
          replace: true,
        });
      } else {
        throw new Error(response.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating snap rx:", error);
      message.error(error.message || "Failed to create prescription. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles, patient_data, navigate, state, uploadedFilesFromStore, tcmId, sessionId, dispatch]);

  const handleCreateSnapRx = useCallback(async () => {
    if (!uploadedFilesFromStore?.length) {
      fetchUploadedFiles(true);
      return;
    }
    if (!patient_data?.patient_unique_id) {
      message.error("Patient information is missing. Please try again.");
      return;
    }

    setIsUploading(true);

    try {
      const fileNames = uploadedFilesFromStore.map((f) => f.filename);

      const response = await createSnapRx(
        patient_data.patient_unique_id,
        fileNames,
        sessionId,
        patient_data?.pam_id
      );

      if (response?.status) {
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
      message.error(error.message || "Failed to create prescription. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFilesFromStore, patient_data, navigate, tcmId, sessionId, dispatch]);

  const handleUploadMore = useCallback(() => {
    setIsUploadMoreDrawerOpen(true);
  }, []);

  const handleUploadMoreDrawerClose = () => {
    setIsUploadMoreDrawerOpen(false);
    setIsPreviewOpen(false);
    setIsAddMoreClicked(false);
  };

  const handleKnowMore = () => setShowKnowMore((v) => !v);

  const handleAddMore = () => uploadWrittenRxRef?.current?.handleAddMore();
  const handleReupload = (fileId) => uploadWrittenRxRef?.current?.handleReupload(fileId);
  const handleZoomIn = (fileId) => uploadWrittenRxRef?.current?.handleZoomIn(fileId);
  const handleZoomOut = (fileId) => uploadWrittenRxRef?.current?.handleZoomOut(fileId);
  const handleRotateClick = (fileId) => uploadWrittenRxRef?.current?.handleRotateClick(fileId);

  /**
   * FIXED DELETE:
   * - do NOT call heavy fetchImages
   * - do NOT re-normalize with Date.now IDs
   * - do NOT append anywhere
   *
   * Just remove from redux list + local working list.
   */
  const handlePreviewDelete = useCallback(
    (file) => {
      const filename = (file && (file.filename || file.name)) || file || "";
      if (!filename) {
        message.error("Unable to delete the selected file. Please try again.");
        return;
      }

      const nextStore = (uploadedFilesFromStore || []).filter(
        (f) => (f.filename || f.name) !== filename
      );

      // keep at least one file rule (same as your UI)
      if (!nextStore.length) {
        message.warning("You cannot delete the only file. Please reupload the file.");
        return;
      }

      dispatch(setUploadedFilesFromStore(nextStore));
      // local working list will auto-sync via useEffect above
    },
    [dispatch, uploadedFilesFromStore]
  );

  const handleRemoveFile = (file) => {
    const fileId = file?.id;
    const filename = file?.filename || file?.name || file;

    // If already on server, delete from redux list (instant)
    if (uploadedFilesFromStore?.length) {
      handlePreviewDelete(filename);
      return;
    }

    // else local remove
    if (fileId || filename) {
      uploadWrittenRxRef?.current?.handleRemoveFile(fileId || filename, true, !fileId);
    }
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

  const removeFileUploadTokenFromLS = () => {
    const patientId = patientDetails?.details?.id;
    const admissionId = patientDetails?.admissionId;
    if (!patientId || !admissionId) return;

    const tokenKey = `fileUploadToken_${patientId}_${admissionId}`;
    const tokenDataString = localStorage.getItem(SNAP_RX_TOKENS_STORAGE_KEY);
    if (!tokenDataString) return;

    try {
      const tokenData = JSON.parse(tokenDataString);
      delete tokenData[tokenKey];
      localStorage.setItem(SNAP_RX_TOKENS_STORAGE_KEY, JSON.stringify(tokenData));
    } catch (e) {
      localStorage.removeItem(SNAP_RX_TOKENS_STORAGE_KEY);
    }
  };

  const handleExtract = async () => {
    try {
      setIsDigitizing(true);
      const res = await dispatch(
        digitizeAssessments({ previousOutput, schemaKey })
      ).unwrap();
      addDataToStore(res?.data?.rxDigitizationHistory?.[0]?.response || {});
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

  if (isLoading) return <FullPageLoader />;

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
        style={{ display: isPreviewOpen ? "block" : "none" }}
      />

      <div
        className={`snap-rx-container ${
          uploadedFilesFromStore?.length ? "with-overflow-hidden" : ""
        }`}
        style={{ display: isPreviewOpen ? "none" : "block" }}
      >
        <ErrorBoundary>
          <div
            className={`snap-rx-content ${
              uploadedFilesFromStore?.length ? "with-overflow-auto" : ""
            }`}
          >
            {uploadedFilesFromStore?.length && !isUploadMoreDrawerOpen ? (
              <UploadedFilesPreview
                uploadedFiles={uploadedFilesFromStore}
                onEdit={handleFileEdit}
                loading={false}
                onDelete={handlePreviewDelete}
              />
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
            />
          </div>

          {uploadedFilesFromStore?.length && !isUploadMoreDrawerOpen ? (
            <div className="snap-rx-floating-actions">
              <Button className="upload-more-btn" onClick={handleUploadMore} disabled={isDigitizing}>
                Upload More
              </Button>
              <Button
                type="primary"
                className="extract-btn"
                onClick={handleExtract}
                loading={isDigitizing}
              >
                Extract & Autofill Details
              </Button>
            </div>
          ) : null}
        </ErrorBoundary>
      </div>

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
          styles={{ header: { display: "none" } }}
        >
          <KnowMore handleKnowMore={handleKnowMore} data={SNAP_RX_KNOW_MORE_DATA} />
        </Drawer>
      )}
    </CashManagerContext.Provider>
  );
}

// Main component with session provider
export default function IPDSnapRx({ previousOutput, handleClose, schemaKey }) {
  return (
    <SnapRxSessionProvider>
      <SnapRxContent
        previousOutput={previousOutput}
        handleClose={handleClose}
        schemaKey={schemaKey}
      />
    </SnapRxSessionProvider>
  );
}
