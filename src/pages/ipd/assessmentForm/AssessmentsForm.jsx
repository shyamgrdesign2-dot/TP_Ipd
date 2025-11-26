import React, { Suspense, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import { Button, Drawer, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import PhysicalExamination from "./PhysicalExamination";
import FunctionalAssessment from "./FunctionalAssessment";
import TreatmentPlan from "./TreatmentPlan";
import NoteSection from "./NoteSection";
import saveIcon from "../../../assets/images/save.svg";
import {
  getAssessmentsData,
  getLastPrescriptionDate,
  lastPrescriptionData,
  updateAssessmentsData,
} from "../../../redux/ipd/assessmentsFormSlice";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice";
import {
  getAllDoses,
  getMedicationTemplates,
} from "../../../redux/medicationSlice";
import { getExaminationTemplates } from "../../../redux/examinationSlice";
import { getDiagnosisTemplates } from "../../../redux/diagnosisSlice";
import { getSymptomsTemplates } from "../../../redux/symptomsSlice";
import { getInvestigationTemplates } from "../../../redux/investigationSlice";
import { getAdviceTemplates } from "../../../redux/adviceSlice";
import { convertMedicationFormat, errorMessage } from "../../../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import useIpdCustomModules from "../../../hooks/useIpdCustomModules";
import BackConfirmationModal from "../../../components/BackConfirmationModal";
import { useAssessmentSectionVisibility } from "../../../hooks/useAssessmentSectionVisibility";
import { useAssessmentDataStore } from "../../../hooks/useAssessmentDataStore";
import ProvisionalDiagnosisWrapper from "./provisinalDiagnosisWrapper";
import dayjs from "dayjs";
import FullPageLoader from "../../vaccination/components/Loader";
import FilledByCards from "../otNotes/components/FilledByCards";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const AssessmentsForm = (props) => {
  const dispatch = useDispatch();
  const { hasAnyData } = useAssessmentSectionVisibility();
  const { addDataToStore } = useAssessmentDataStore();
  const { state } = useLocation();
  const { patient_data, patientDetails, isEditable = true, fromTab } = state || {};

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};
  const { customization = {} } = useSelector((state) => state.ipd);
  const assessmentData = useSelector((state) => state.assessment);
  const prescriptionData = useSelector((state) => state.prescription);
  const { assessments = [] } = customization;
  const { profile } = useSelector((state) => state.doctors);
  const [filledDate, setFilledDate] = useState(new Date());
  const [filledAtTime, setFilledAtTime] = useState(new Date());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");

  const formType = "assessments";
  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);
  };
  const [modelData, setModelData] = useState(
    assessments.length > 0
      ? assessments
      : IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE
  );

  const {
    customModuleContents,
    isCustomModuleSection,
    renderCustomModuleSection: renderCustomModuleComponent,
    renderCustomModulesFooter,
    hydrateFromSavedModules,
    serializeCustomModules,
    handleCustomModuleRenamed,
    handleCustomModuleDeleted,
    defaultCustomModulesForCustomization,
  } = useIpdCustomModules({
    formType,
    customizationKey: "assessments",
    modelData,
    setModelData,
    admissionId: patientDetails?.admissionId,
    patientId: patientDetails?.details?.id,
    patientData: patient_data,
    isEditable,
  });
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  useEffect(() => {
    if (assessments.length > 0) {
      setModelData(assessments);
    }
  }, [assessments]);

  useEffect(() => {
    if (
      !patient_data ||
      !patientDetails?.details?.id ||
      !patientDetails?.admissionId
    ) {
      navigate(-1);
      return;
    }
  }, [patient_data, patientDetails?.details?.id, patientDetails?.admissionId]);

  useEffect(() => {
    if (
      isEditable &&
      patientDetails?.details?.id &&
      Object.keys(assessmentData?.assessmentsData || {}).length === 0
    ) {
      dispatch(
        getAssessmentsData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      ).then((res) => {
        addDataToStore(res.payload.assessment);
      });
    }
    dispatch(getCustomization({doctorId : patientDetails?.doctor?.id}));
    if (isEditable) {
      dispatch(
        getLastPrescriptionDate({
          patientId: patientDetails?.patient_unique_id,
        })
      ).then((res) => {
        if (res.payload) {
          dispatch(
            lastPrescriptionData({
              patientId: patientDetails?.patient_unique_id,
              caseId: res.payload?.caseId,
            })
          );
        }
      });
    }
  }, [addDataToStore, dispatch, isEditable, patientDetails]);

  useEffect(() => {
    const { assessmentsData: { date, time } = {} } = assessmentData;
    if (date) setFilledDate(new Date(date));
    if (time) setFilledAtTime(new Date(time));
  }, [assessmentData]);
  
  useEffect(() => {
    hydrateFromSavedModules(
      assessmentData?.assessmentsData?.customModules || []
    );
  }, [assessmentData?.assessmentsData?.customModules, hydrateFromSavedModules]);

  useEffect(() => {
    dispatch(getMedicationTemplates());
    dispatch(getAllDoses());
    dispatch(getExaminationTemplates());
    dispatch(getDiagnosisTemplates());
    dispatch(getSymptomsTemplates());
    dispatch(getInvestigationTemplates());
    dispatch(getAdviceTemplates());
  }, [dispatch]);

  const handleDefaultClick = () => {
    const defaultModules = [
      ...IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE,
      ...defaultCustomModulesForCustomization,
    ];
    setModelData(defaultModules);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      assessments: defaultModules,
    };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const renderSections = (data) => {
    if (isCustomModuleSection(data)) {
      return renderCustomModuleComponent(data);
    }

    switch (data?.id) {
      case "basicInfo":
        return (
          <BasicInfo {...props} sectionData={data} isEditable={isEditable} patientDetails={patientDetails} />
        );
      case "physicalExamination":
        return <PhysicalExamination {...props} sectionData={data} patientDetails={patientDetails}/>;
      case "functionalAssessment":
        return <FunctionalAssessment {...props} sectionData={data} patientDetails={patientDetails} />;
      case "provisionalDiagnosis":
        return <ProvisionalDiagnosisWrapper {...props} sectionData={data} patientDetails={patientDetails} />;
      case "treatmentPlan":
        return <TreatmentPlan {...props} sectionData={data} patientDetails={patientDetails} />;
      case "additionalNotes":
        return <NoteSection {...props} sectionData={data} patientDetails={patientDetails} />;
      default:
        return null;
    }
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, assessments: [...modelData] };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const convertToRawFormat = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    // Check if already in raw format (has tmu_id and tmu_title)
    const isAlreadyRaw = data.every(
      (item) => item.tmu_id !== undefined && item.tmu_title !== undefined
    );
    if (isAlreadyRaw) return data;

    // Convert formatted → raw
    return data.map((item) => {
      if (item.key) {
        try {
          return JSON.parse(item.key);
        } catch {
          return { tmu_id: item.value, tmu_title: item.label };
        }
      } else {
        return { tmu_id: item.value, tmu_title: item.label };
      }
    });
  };

  const onSaveAssessmentClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Helper function to format discharge medications
    // Format tmm_dosage: if tmm_dosage_unit_name exists, use it; otherwise combine tmm_dosage + tmm_unit_name
    const formatAssessmentMedications = (medications) => {
      if (!Array.isArray(medications) || medications.length === 0) {
        return [];
      }

      return medications.map((medication) => {
        const formattedMedication = { ...medication };
        const formattedMedicineUnit = convertToRawFormat(
          formattedMedication.medicineUnit
        );

        // If tmm_dosage_unit_name exists and is not empty, use it as tmm_dosage
        if (
          formattedMedication.tmm_dosage_unit_name &&
          formattedMedication.tmm_dosage_unit_name.trim() !== ""
        ) {
          formattedMedication.tmm_dosage_unit_name =
            formattedMedication.tmm_dosage_unit_name;
        } else {
          // Otherwise, combine tmm_dosage + tmm_unit_name
          const dosage = formattedMedication.tmm_dosage
            ? formattedMedication.tmm_dosage
            : 1;
          // const unitName = formattedMedication.tmm_unit_name || "";
          const unitName = formattedMedication.tmm_unit_name
            ? formattedMedication.tmm_unit_name
            : formattedMedicineUnit?.find(
                (x) => x.tmu_id == formattedMedication.tmu_id
              )?.tmu_title || formattedMedicineUnit[0]?.tmu_title;

          formattedMedication.tmm_dosage_unit_name =
            `${dosage} ${unitName}`.trim();
        }

        return formattedMedication;
      });
    };

    const reqData = {
      date: filledDate,
      time: filledAtTime,
      basicInfo: {
        topInformant: assessmentData.topInformant || null,
        presentingComplaints: assessmentData.chiefComplaint || [],
        historyOfPresentIllness: assessmentData.historyOfPresentIllness,
        currentMedications: convertMedicationFormat(
          prescriptionData.medicationData || []
        ),
        medications: formatAssessmentMedications(
          prescriptionData.medicationData || []
        ),
        labResults: assessmentData.labResults || [],
        pastMedicalHistory: prescriptionData.medicalHistoryData || {},
        gyneacHistory: assessmentData.gynecHistoryData || {},
        obstetricHistory:
          Array.isArray(allObstetricDetails) && !allObstetricDetails.length
            ? {}
            : allObstetricDetails || {},
      },
      physicalExamination: {
        vitals: assessmentData.vitalsData || {},
        examination: Object.entries(
          assessmentData.physicalExaminationBasicData || {}
        ).reduce((acc, [key, value]) => {
          acc[key] = {
            title: value?.title || "",
            notes: value?.notes || [],
            value: value?.value || null,
          };
          return acc;
        }, {}),
        others: assessmentData.physicalExaminationOthersData || [],
      },
      provisionalDiagnosis: provisionalDiagnosis || [],
      functionalAssessment:
        {
          ...assessmentData.functionalAssessmentData,
          referredToPhysiotherapyForReview:
            assessmentData?.referredDocForReview || null,
        } || {},
      treatmentPlan: assessmentData.treatmentPlanData || [],
      additionalNotes: assessmentData.additionalNotesData || [],
      customModules: serializeCustomModules(customModuleContents),
    };

    const response = await dispatch(
      updateAssessmentsData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: assessmentData?.assessmentId,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      try {
        if (response?.payload?.error) {
          if (response.payload.message?.split("must")?.[0]) {
            message.warning(`Please fill the fields before saving`);
          } else {
            message.warning(`Something went wrong, Please try again.`);
          }
          return;
        }
        setIsLoading(false);
        addDataToStore(reqData);
        dispatch(
          getAssessmentsData({
            patientId: patientDetails?.details?.id,
            admissionId: patientDetails?.admissionId,
          })
        );
        navigate("/ipd/patient-details", {
          state: {
            isEditable: false,
            patient_data: patient_data,
            patientDetails,
            fromTab,
          },
          replace: true,
        });
        setIsLoading(false);
        message.success({
          content: (
            <div className="ipd-success-msg-bar-container">
              <span>Admission Assessment Form Saved Successfully</span>
            </div>
          ),
          duration: 3,
          type: "success",
          icon: <img src={saveIcon} alt="x" />,
          className: "ipd-custom-message",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Assessment form save failed:", error);
        setIsLoading(false);
      }
    } else {
      errorMessage(response?.error);
      // message.error("Failed to save assessment form. Please try again.");
      setIsLoading(false);
    }
  };

  const handleBackConfirmation = () => {
    if (!patientDetails?.details?.id && !patientDetails?.admissionId) {
      setIsBackModalOpen(false);
      navigate(`/ipd/patient-details`, {
        state: { ...state, activeTab: "assessment", isEditable: false, fromTab },
        replace: true,
      });
      setOpen(false);
    }
    try {
      dispatch(
        getAssessmentsData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      ).then((res) => {
        addDataToStore(res.payload.assessment);
        navigate(`/ipd/patient-details`, {
          state: { ...state, activeTab: "assessment", isEditable: false, fromTab },
          replace: true,
        });
        setIsBackModalOpen(false);
        setOpen(false);
      });
    } catch (err) {
      console.error("get assessment form api failed", err);
      setIsBackModalOpen(false);
      setOpen(false);
    }
  };

  const renderFilledBySection = () => {
    return (
      <div style={{ margin: "16px 24px 0" }}>
        <FilledByCard
          filledBy={profile?.um_name}
          role="Doctor"
          selectedDate={dayjs(filledDate)}
          selectedTime={dayjs(filledAtTime)}
          dateFormat="DD MMM YYYY"
          timeFormat="hh:mm A"
          selectedTimePeriod={selectedTimePeriod}
          timePeriodOptions={[
            { label: "Morning", value: "Morning" },
            { label: "Afternoon", value: "Afternoon" },
            { label: "Evening", value: "Evening" },
            { label: "Night", value: "Night" },
          ]}
          onDateChange={(date) => setFilledDate(date)}
          onTimeChange={(time) => setFilledAtTime(time)}
          onTimePeriodChange={handleTimePeriodChange}
          editable
          showTimePeriod={true}
        />
      </div>
    );
  };

  const renderAllSections = () => {
    const {
      createdByName,
      createdByRole,
      createdAt,
      updates,
    } = assessmentData?.assessmentsFilledByData || {};
    const normalizedUpdates = Array.isArray(updates) ? updates : [];
    if (!Array.isArray(updates)) {
      console.warn(
        "[AssessmentsForm] Expected updates to be an array but received:",
        updates,
        "Full assessmentsFilledByData:",
        assessmentData?.assessmentsFilledByData
      );
    }
    const latestUpdatedAt = assessmentData.assessmentsData?.date || new Date();
    const latestUpdatedAtTime =
      assessmentData.assessmentsData?.time || new Date();
    return (
      <div
        className={`ipd-generic-form-container ${
          !isEditable ? "ipd-assessments-readable-container" : ""
        }`}
      >
        {latestUpdatedAt && (
          <FilledByCard
            showBeing={!latestUpdatedAt}
            filledBy={
              assessmentData.assessmentsFilledByData?.createdByName || ""
            }
            filledOnText={"Created At:"}
            role={assessmentData.assessmentsFilledByData?.createdByRole || ""}
            showFilledOnDate={true}
            selectedDate={latestUpdatedAt}
            selectedTime={latestUpdatedAtTime}
          />
        )}
        {assessments.length > 0
          ? assessments.map((item) => {
              return (
                <React.Fragment key={item.id}>
                  {renderSections(item)}
                </React.Fragment>
              );
            })
          : null}
        <FilledByCards
          updates={
            normalizedUpdates.length
              ? [normalizedUpdates[normalizedUpdates.length - 1]]
              : []
          }
          createdByRole={createdByRole}
          createdByName={createdByName}
          createdAt={createdAt}
          containerClassName={"assessment-form-filled-by-cards-container"}
        />
      </div>
    );
  };

  if (!isEditable && !hasAnyData) return null;

  return (
    <div className="afipd-generic-form-container">
      <Suspense
        fallback={
          <>
            <FullPageLoader />
          </>
        }
      >
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-generic-form-container ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
          >
            {open && assessments && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="assessment"
                title={"Admission Assessment"}
                mainCta={{
                  handler: onSaveAssessmentClick,
                  title: isLoading ? "Saving..." : "Save",
                  disabled: isLoading,
                }}
                items={assessments}
                renderSection={renderSections}
                renderTopSection={renderFilledBySection}
                onRequestClose={() => {
                  setIsBackModalOpen(true);
                }}
                headerOffset={72}
                renderBottomSection={renderCustomModulesFooter}
              />
            )}
          </div>
        )}
      </Suspense>
      {showCustomisationDrawer && (
        <Drawer
          closeIcon={true}
          width={"70%"}
          placement="right"
          className="customise-form-ipd-container"
          title="Customise Your Form"
          open={showCustomisationDrawer}
          onClose={() => {
            dispatch(
              updateCustomization({
                doctorId: patientDetails?.doctor?.id,
                customization: {
                  ...customization,
                  assessments: modelData,
                },
                assessments: modelData,
              })
            );
            return setShowCustomisationDrawer(false);
          }}
          extra={
            <>
              <Button
                type="button"
                onClick={handleDefaultClick}
                className="btn-41 btn text-underline"
                loading={false}
                disabled={false}
              >
                Default Settings
              </Button>
              <Button
                type="button"
                onClick={handleSaveCustomization}
                className="btn-41 btn px-4 btn-primary3"
                loading={false}
                disabled={false}
              >
                Save
              </Button>
            </>
          }
        >
          <Suspense fallback={<>Loading ...</>}>
            <div className="customise-form-ipd-container-inner">
              <Customization
                onModelChange={(e) => {
                  setModelData(e);
                }}
                customModel={modelData}
                onUpdateCustomModuleName={handleCustomModuleRenamed}
                onDeleteCustomModule={handleCustomModuleDeleted}
              />
            </div>
          </Suspense>
        </Drawer>
      )}
      <BackConfirmationModal
        isModalOpen={isBackModalOpen}
        onCancel={() => setIsBackModalOpen(false)}
        onConfirm={handleBackConfirmation}
      />
    </div>
  );
};

export default AssessmentsForm;
