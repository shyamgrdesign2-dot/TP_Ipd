import React, { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { IPD } from "../../../utils/locale";
import {
  formatDateToShortMonthYear,
  getPatientInformation,
  normalizeToDefault,
} from "../../../utils/utils";
import { AnimatePresence } from "framer-motion";
import "./styles.scss";
import AssessmentsForm from "../assessmentForm/AssessmentsForm";
import ToolbarActions from "../components/ToolbarActions/ToolbarActions";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getAssessmentsData,
  resetAssessmentForm,
  setAdditionalNotesData,
  setChiefComplaint,
  setFunctionalAssessmentData,
  setGynecHistoryData,
  setHistoryOfPresentIllness,
  setLabResults,
  setPhysicalExaminationBasicData,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setReferredDocForReview,
  setTreatmentPlanData,
  setVitalsData,
} from "../../../redux/ipd/assessmentsFormSlice";
import {
  setMedicalHistoryData,
  setMedicationData,
  clearMedicationData,
} from "../../../redux/prescriptionSlice";
import { addObstetricDetails } from "../../../redux/obstetricSlice";
import { getConsultantNotes } from "../../../redux/ipd/consultantNotesSlice";
import ConsultantNotesTimeline from "../consultantNotes/ConsultantNotesTimeline";
import LabResults from "../labResults/LabResults";
import ProgressNotesView from "../progressNotes/progressNotesView/progressNotesView";
import { getProgressNotes } from "../../../redux/ipd/progressNotesSlice";
import {
  getOtNotesData,
  resetOtNotesForm,
} from "../../../redux/ipd/otNotesSlice";
import MedicalRecords from "../medicalRecords/IPDMedicalRecords";
import { Drawer } from "antd";
import UploadDocument from "../../medicalRecords/UploadDocument";
import { getAllPatientDocs } from "../medicalRecords/utils.js/helper";
import VisitMedicalRecords from "../../medicalRecords/components/visitMedicalRecords/VisitMedicalRecords";
import OtNotesTimeline from "../otNotes/OtNotesTimeline";
import { useAssessmentSectionVisibility } from "../../../hooks/useAssessmentSectionVisibility";
import CrossReferralTimeline from "../crossReferral/CrossReferralTimeline";
import {
  getCrossReferralData,
  resetCrossReferralForm,
} from "../../../redux/ipd/crossReferralSlice";
import { getPrintSettings } from "../../../redux/ipd/printSettingsSlice";
import {
  getDischargeSummaryData,
  resetActualDischargeSummaryData,
  resetDischargeSummaryData,
  setProvisionalDiagnosis,
} from "../../../redux/ipd/dischargeSummarySlice";
import { addDischargeDataToStore } from "../../../utils/dischargeDataMapper";
import PreviewDischargeSummary from "../dischargeSummary/PreviewDischargeSummary";
import DischargeSummaryReadonly from "../dischargeSummary/DischargeSummaryReadonly";
import FullPageLoader from "../../vaccination/components/Loader";

const PatientDetailsLayout = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "PatientDetailsLayout")
  );
});

const IPDPatientDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    isEditable = true,
    patient_data,
    patientDetails,
    activeTab,
  } = state || {};

  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;

  const { hasAnyData: hasAnyAssessmentData } = useAssessmentSectionVisibility();

  const { assessmentsData } = useSelector((state) => state.assessment);
  const prescriptionSlice = useSelector((state) => state.prescription);
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const { otNotesData } = useSelector((state) => state.otNotes);
  const { progressNotes, filteredProgressNotes } = useSelector(
    (state) => state.progressNotes
  );
  const { medicalRecords } = useSelector((state) => state.medicalRecords);
  const { crossReferralData } = useSelector((state) => state.crossReferral);
  const { dischargeSummaryData, actualDischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { printSettings } = useSelector((state) => state.printSettings);
  const [open, setOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState("assessment");
  const [patientData, setPatientData] = useState(null);

  // Medical records states
  const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
  const [medicalReportDrawer, setMedicalReportDrawer] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [isEditDocument, setIsEditDocument] = useState(false);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [shouldShowUploadDocPopup, setShowUploadDocPopup] = useState(false);
  const fileInputRef = useRef(null);
  const dischargeSummaryReadonlyRef = useRef(null);

  const dispatch = useDispatch();

  const handleAddAssessmentClick = (isEmpty = false) => {
    if (isEmpty) {
      dispatch(resetAssessmentForm());
      dispatch(setMedicationData([]));
      dispatch(setMedicalHistoryData([]));
      dispatch(setLabResults([]));
      dispatch(addObstetricDetails([]));
    }
    navigate("/ipd/patient-details/assessment-form", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const handleAddConsultantNotesClick = () => {
    navigate("/ipd/patient-details/consultant-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const handleAddOtNotesClick = () => {
    dispatch(resetOtNotesForm());
    // TODO: INTEL - RESET ALL THE DATA IN THE OT NOTES FORM
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        isNew: true,
      },
    });
  };

  const handleAddCrossReferralClick = () => {
    dispatch(resetCrossReferralForm());
    navigate("/ipd/patient-details/cross-referral", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const handleDischargeSummaryClick = () => {
    // dispatch(resetCrossReferralForm());
    navigate("/ipd/patient-details/discharge-summary", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        activeMenuItem,
      },
    });
  };

  /* Functions realted to Medical records */

  // Fetch print settings once when component mounts
  useEffect(() => {
    // Only fetch if print settings are not already loaded
    if (!printSettings || Object.keys(printSettings).length === 0) {
      dispatch(getPrintSettings());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (patient_data?.patient_unique_id) {
      getAllPatientDocs(
        patient_data?.patient_unique_id,
        admissionId,
        "medical_records"
      );
    }
  }, [patient_data?.patient_unique_id]);

  // Drawer Medical Report
  const handleDrawerMedicalReport = () => {
    setMedicalReportDrawer(!medicalReportDrawer);
  };

  // Drawer Upload Document
  const handleDrawerUploadDoc = () => {
    setUploadDocDrawer(!uploadDocDrawer);
  };

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const handleUploadDocPopup = () => {
    setShowUploadDocPopup((prev) => !prev);
  };

  const handleMedicalRecordsClick = () => {
    handleDrawerUploadDoc();
    // navigate("/ipd/patient-details/medical-records", {
    //   state: {
    //     patient_data,
    //     patientDetails,
    //     isEditable: true,
    //   },
    // });
  };

  const handleProgressNotesClick = () => {
    navigate("/ipd/patient-details/progress-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  useEffect(() => {
    const data = {
      fullName: patientDetails?.details?.name,
      gender: patientDetails?.details?.gender,
      age: patientDetails?.details?.age,
      wardBedNumber: `${patientDetails?.ward?.title} - ${patientDetails?.room?.title}`,
      consultant: patientDetails?.doctor?.name,
      admittedOn: formatDateToShortMonthYear(patientDetails?.admittedOn),
    };
    setPatientData(data);
  }, [patientDetails]);
  // Set active menu item based on activeTab parameter
  useEffect(() => {
    if (activeTab) {
      setActiveMenuItem(activeTab);
    }
  }, [activeTab]);

  const addDataToStore = (data) => {
    if (data) {
      // Chief Complaint
      dispatch(setChiefComplaint(data?.basicInfo?.presentingComplaints || []));

      // History of Present Illness
      dispatch(
        setHistoryOfPresentIllness(
          data?.basicInfo?.historyOfPresentIllness || []
        )
      );

      // Medication
      dispatch(setMedicationData(data?.basicInfo?.medications || []));

      // Lab Results
      dispatch(setLabResults(data?.basicInfo?.labResults || []));

      // Medical History
      dispatch(
        setMedicalHistoryData(data?.basicInfo?.pastMedicalHistory || [])
      );

      // Gynec History
      dispatch(setGynecHistoryData(data?.basicInfo?.gyneacHistory || []));

      // Obstetric History
      dispatch(addObstetricDetails(data?.basicInfo?.obstetricHistory || []));

      // Physical Examination Vitals Data
      dispatch(setVitalsData(data?.physicalExamination?.vitals || {}));

      dispatch(setProvisionalDiagnosis(data?.provisionalDiagnosis || []));

      // Physical Examination Others Data
      dispatch(
        setPhysicalExaminationOthersData(
          data?.physicalExamination?.others || []
        )
      );

      // Physical Examination Basic Data
      dispatch(
        setPhysicalExaminationBasicData(
          data?.physicalExamination?.examination || {}
        )
      );

      // Functional Assessment Data
      const functionalAssessmentWithoutReferredDoc = {
        ...data?.functionalAssessment,
      };
      delete functionalAssessmentWithoutReferredDoc.referredToPhysiotherapyForReview;
      dispatch(
        setFunctionalAssessmentData(
          functionalAssessmentWithoutReferredDoc || {}
        )
      );

      // Treatment Plan Data
      dispatch(setTreatmentPlanData(data?.treatmentPlan || {}));

      // Additional Notes Data
      dispatch(setAdditionalNotesData(data?.additionalNotes || {}));

      // Referred Doc For Review
      dispatch(
        setReferredDocForReview(
          data?.functionalAssessment?.referredToPhysiotherapyForReview || {}
        )
      );
    }
  };

  useEffect(() => {
    if (!patientId || !admissionId) return;

    if (activeMenuItem === "assessment") {
      dispatch(getAssessmentsData({ patientId, admissionId })).then((res) => {
        if (!res?.payload?.assessment) return;
        addDataToStore(res.payload.assessment);
      });
    } else if (activeMenuItem === "consultantNotes") {
      dispatch(getConsultantNotes({ patientId, admissionId })).catch(
        (error) => {
          console.error("Error fetching consultant notes:", error);
        }
      );
    } else if (activeMenuItem === "progress") {
      dispatch(getProgressNotes({ patientId, admissionId })).catch((error) => {
        console.error("Error fetching progress notes:", error);
      });
    } else if (activeMenuItem === "otNotes") {
      dispatch(getOtNotesData({ patientId, admissionId })).catch((error) => {
        console.error("Error fetching OT notes:", error);
      });
    } else if (activeMenuItem === "crossReferral") {
      dispatch(getCrossReferralData({ patientId, admissionId })).catch(
        (error) => {
          console.error("Error fetching Cross Referral notes:", error);
        }
      );
    } else if (activeMenuItem === "records") {
      // if (patient_data.patient_unique_id) {
      //   getAllPatientDocs( patient_data.patient_unique_id , admissionId, "medical_records");
      // }
      // dispatch(getProgressNotes({ patientId, admissionId })).catch(
      //   (error) => {
      //     console.error("Error fetching progress notes:", error);
      //   }
      // );
    } else if (activeMenuItem === "dischargeSummary") {
      dispatch(getDischargeSummaryData({ patientId, admissionId }))
        .then((res) => {
          addDischargeDataToStore(res.payload, dispatch);
        })
        .catch((error) => {
          console.error("Error fetching discharge summary:", error);
        });
    }
  }, [activeMenuItem, admissionId, patientId, dispatch]);

  const handleEmptyCtaClick = {
    assessment: () => handleAddAssessmentClick(true),
    otNotes: handleAddOtNotesClick,
    consultantNotes: handleAddConsultantNotesClick,
    progress: handleProgressNotesClick,
    records: handleMedicalRecordsClick,
    crossReferral: handleAddCrossReferralClick,
    dischargeSummary: handleDischargeSummaryClick,
  };

  const patientDetailsMenu = () => {
    return IPD.PATIENT_DETAILS_MENU.map((item) => {
      return {
        ...item,
        ctaClick: handleEmptyCtaClick?.[item.id],
        isActive: item.id === activeTab,
      };
    });
  };

  const isDataPresent = useMemo(() => {
    if (
      activeMenuItem === "assessment" &&
      (!!assessmentsData || hasAnyAssessmentData)
    ) {
      return Object.keys(assessmentsData || {})?.length > 0;
    } else if (
      activeMenuItem === "otNotes" &&
      Array.isArray(otNotesData) &&
      otNotesData.length > 0
    ) {
      return true;
    } else if (activeMenuItem === "crossReferral") {
      return !!crossReferralData?.length;
    } else if (activeMenuItem === "dischargeSummary") {
      // return !!dischargeSummaryData && !!dischargeSummaryData.patientInformation && Object.keys(dischargeSummaryData.patientInformation).length > 0;
      return true;
    } else if (activeMenuItem === "consultantNotes") {
      return !!consultantNotes?.length;
    } else if (activeMenuItem === "progress") {
      return !!progressNotes?.length;
    } else if (activeMenuItem === "records") {
      return !!medicalRecords?.length;
    } else if (activeMenuItem === "labResults") {
      return true;
    }
    return false;
  }, [
    assessmentsData,
    otNotesData,
    activeMenuItem,
    consultantNotes,
    progressNotes,
    hasAnyAssessmentData,
    crossReferralData,
    medicalRecords,
    dischargeSummaryData,
  ]);

  const onRequestClose = () => {
    dispatch(resetOtNotesForm());
    dispatch(resetCrossReferralForm());
    dispatch(resetActualDischargeSummaryData());
    dispatch(resetDischargeSummaryData());
    navigate(`/ipd/inPatients`);
  };
  const handleCustomizeClick = () => {
    if (activeMenuItem === "dischargeSummary") {
      navigate("/ipd/discharge-summary/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "dischargeSummary",
          data: actualDischargeSummaryData,
        },
      });
    } else if (activeMenuItem === "consultantNotes") {
      navigate("/ipd/consultant-notes/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "consultationNotes",
          data: {
            patientInformation: getPatientInformation(patientDetails),
            consultantNotes: consultantNotes?.slice()?.sort((a, b) => {
              const dateA = new Date(
                a?.consultationNotes?.date || a?.createdAt || 0
              );
              const dateB = new Date(
                b?.consultationNotes?.date || b?.createdAt || 0
              );
              return dateB - dateA;
            }),
          },
        },
      });
    }
  };
  const onHandleSelect = (id) => {
    setActiveMenuItem(id);
    navigate("/ipd/patient-details", {
      state: {
        patientDetails,
        patient_data,
        isEditable: false,
        activeTab: id,
      },
      replace: true,
    });
  };

  const handleDischargeSummaryPrintPreview = () => {
    navigate("/ipd/discharge-summary/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const handleAssessmentPrintPreview = () => {
    navigate("/ipd/admission-assessment/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const handleOTNotesPrintPreview = () => {
    navigate("/ipd/ot-notes/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const handleConsultantNotesPrintPreview = () => {
    navigate("/ipd/consultant-notes/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const renderContent = (activeItem) => {
    switch (activeItem?.id) {
      case "assessment":
        return (
          <>
            <div className="ipd-adm-assess-container-readable">
              <AssessmentsForm isEditable={isEditable} />
            </div>
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                onEdit={() => handleAddAssessmentClick(false)}
                onPrintPreview={handleAssessmentPrintPreview}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </>
        );
      case "progress":
        return (
          <div className="ipd-progress-notes-view-container">
            <ProgressNotesView
              progressNotes={progressNotes}
              filteredProgressNotes={filteredProgressNotes}
              patientDetails={patientDetails}
            />
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                showEditForm={false}
                // onEdit={handleAddAssessmentClick}
                onPrintPreview={() => navigate("/ipd/progress-notes/preview")}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </div>
        );
      case "consultantNotes":
        return (
          <div className="ipd-adm-assess-container-readable">
            <ConsultantNotesTimeline />
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                showEditForm={false}
                onPrintPreview={handleConsultantNotesPrintPreview}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </div>
        );
      case "labResults":
        return (
          <div className="ipd-adm-assess-container-readable">
            <LabResults />
          </div>
        );
      case "records":
        return (
          <div className="ipd-adm-assess-container-readable">
            <VisitMedicalRecords
              isIPDFlow={true}
              ipdRecords={medicalRecords}
              filesData={medicalRecords}
              setUploadDocDrawer={setUploadDocDrawer}
              setFilesData={setFilesData}
              handleUploadDocPopup={handleUploadDocPopup}
              setIsEditDocument={setIsEditDocument}
              handleDrawerUploadDoc={handleDrawerUploadDoc}
              patientId={patientId}
              admissionId={admissionId}
            />
          </div>
        );
      case "otNotes":
        return (
          <div className="ipd-adm-assess-container-readable">
            <OtNotesTimeline />
            <div className="ipd-toolbar-edit-custom-print-download no-edit">
              <ToolbarActions
                showEditForm={false}
                onEdit={handleAddOtNotesClick}
                onPrintPreview={handleOTNotesPrintPreview}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </div>
        );
      case "crossReferral":
        return (
          <div className="ipd-adm-assess-container-readable">
            <CrossReferralTimeline />
            <div className="ipd-toolbar-edit-custom-print-download no-edit">
              <ToolbarActions
                showEditForm={false}
                onEdit={handleAddCrossReferralClick}
                onPrintPreview={() => console.log("Preview")}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </div>
        );
      case "dischargeSummary":
        return (
          <div className="ipd-adm-assess-container-readable ipd-discharge-summary-container-readable">
            <DischargeSummaryReadonly ref={dischargeSummaryReadonlyRef} />
            {Object.keys(actualDischargeSummaryData)?.length && (
              <div className="ipd-toolbar-edit-custom-print-download">
                <ToolbarActions
                  showEditForm={true}
                  onEdit={handleDischargeSummaryClick}
                  onPrintPreview={handleDischargeSummaryPrintPreview}
                  onPrint={() => {
                    dischargeSummaryReadonlyRef?.current?.handlePrintClick();
                  }}
                  onSettings={handleCustomizeClick}
                  onDownload={() => console.log("Download")}
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const canShowAddCTA = useMemo(() => {
    return (
      IPD.PATIENT_DETAILS_MENU.find((item) => item.id === activeMenuItem)
        ?.showAddCTA && isDataPresent
    );
  }, [activeMenuItem, isDataPresent]);

  return (
    <div>
      <Suspense
        fallback={
          <>
            <FullPageLoader />
          </>
        }
      >
        <AnimatePresence mode="wait">
          {open && !!patientData && (
            <PatientDetailsLayout
              key="patient-details"
              items={patientDetailsMenu()}
              onHandleSelect={onHandleSelect}
              onRequestClose={onRequestClose}
              fullName={patientData.fullName}
              gender={patientData.gender}
              age={patientData.age}
              wardBedNumber={patientData.wardBedNumber}
              consultant={patientData.consultant}
              admittedOn={patientData.admittedOn}
              renderContent={isDataPresent ? renderContent : null}
              showAddCTA={canShowAddCTA}
            />
          )}
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
                isEditDocument={isEditDocument}
                setIsEditDocument={setIsEditDocument}
                patientData={patientData}
                patient_data_naviagte={patient_data}
                patientDetails={patientDetails}
                handleUploadDocPopup={() =>
                  setShowUploadDocPopup((prev) => !prev)
                }
                // isAppointmentData={true}
                isIPDMedicalRecords={true}
                patientId={patientId}
                admissionId={admissionId}
                overrideDocumentOptions={[
                  { label: "Prescription", value: "prescription" },
                  { label: "Radiology", value: "radiology" },
                  { label: "Pathology", value: "pathology" },
                  { label: "Other", value: "other" },
                ]}
              />
            </Drawer>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default IPDPatientDetails;
