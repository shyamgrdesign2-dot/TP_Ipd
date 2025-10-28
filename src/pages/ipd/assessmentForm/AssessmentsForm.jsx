import React, { Suspense, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import { Button, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
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
import AddCustomModule from "../../../components/AddCustomModule";
import { useSelector } from "react-redux";
import { convertMedicationFormat } from "../../../utils/utils";
import CustomModule from "../../../components/CustomModule";
import BackConfirmationModal from "../../../components/BackConfirmationModal";
import { useAssessmentSectionVisibility } from "../../../hooks/useAssessmentSectionVisibility";
import { useAssessmentDataStore } from "../../../hooks/useAssessmentDataStore";
import ProvisionalDiagnosisWrapper from "./provisinalDiagnosisWrapper";
import dayjs from "dayjs";
import FullPageLoader from "../../vaccination/components/Loader";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const AssessmentsForm = (props) => {
  const dispatch = useDispatch();
  const { hasAnyData } = useAssessmentSectionVisibility();
  const { addDataToStore } = useAssessmentDataStore();
  const { state } = useLocation();
  const { patient_data, patientDetails, isEditable = true } = state || {};

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};
  const { customization = {} } = useSelector((state) => state.ipd);
  const { customModules } = useSelector((state) => state.customModules);
  const assessmentData = useSelector((state) => state.assessment);
  const prescriptionData = useSelector((state) => state.prescription);
  const { assessments = [] } = customization;
  const { profile } = useSelector((state) => state.doctors);
  const [filledDate, setFilledDate] = useState(new Date());
  const [filledAtTime, setFilledAtTime] = useState(new Date());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");
  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);
  };
  const [modelData, setModelData] = useState(
    assessments.length > 0
      ? assessments
      : IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE
  );
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  useEffect(() => {
    if (assessments.length > 0) {
      setModelData(assessments);
    }
  }, [assessments]);

  // useEffect(() => {
  //   const { date, time } = assessmentData.assessmentsData || {};
  //   if (date && time) {
  //     setFilledDate(new Date(date));
  //     setFilledAtTime(new Date(time));
  //   }
  // }, [assessmentData.assessmentsData]);

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
    dispatch(getCustomization());
    if (isEditable)
      dispatch(
        getLastPrescriptionDate({ patientId: patientDetails?.patientUniqueId })
      ).then((res) => {
        if (res.payload) {
          dispatch(
            lastPrescriptionData({
              patientId: patientDetails?.patientUniqueId,
              caseId: res.payload?.caseId,
            })
          );
        }
      });
  }, [
    addDataToStore,
    dispatch,
    isEditable,
    patientDetails?.details?.id,
    patientDetails?.admissionId,
    patientDetails?.patientUniqueId,
    assessmentData?.assessmentsData,
  ]);

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
    setModelData(IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      assessments: IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };
  
  const renderSections = (data) => {
    switch (data?.id) {
      case "basicInfo":
        return (
          <BasicInfo {...props} sectionData={data} isEditable={isEditable} />
        );
      case "physicalExamination":
        return <PhysicalExamination {...props} sectionData={data} />;
      case "functionalAssessment":
        return <FunctionalAssessment {...props} sectionData={data} />;
      case "provisionalDiagnosis":
        return <ProvisionalDiagnosisWrapper {...props} sectionData={data} />;
      case "treatmentPlan":
        return <TreatmentPlan {...props} sectionData={data} />;
      case "additionalNotes":
        return <NoteSection {...props} sectionData={data} />;
      default:
        return null;
    }
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, assessments: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const onSaveAssessmentClick = () => {
    const reqData = {
      date: filledDate,
      time: filledAtTime,
      basicInfo: {
        presentingComplaints: assessmentData.chiefComplaint || [],
        historyOfPresentIllness: assessmentData.historyOfPresentIllness,
        currentMedications: convertMedicationFormat(
          prescriptionData.medicationData || []
        ),
        medications: prescriptionData.medicationData || [],
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
            assessmentData?.referredDocForReview || {},
        } || {},
      treatmentPlan: assessmentData.treatmentPlanData || [],
      additionalNotes: assessmentData.additionalNotesData || [],
      customModule: [], // TODO: INTEL - HANDLE CUSTOM MODULE
    };

    dispatch(
      updateAssessmentsData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: assessmentData?.assessmentId,
      })
    ).then((res) => {
      if (res?.payload?.error) {
        message.warning(
          `${res.payload.error} - ${
            res.payload.message?.split("must")?.[0]
          } missing`
        );
        return;
      }
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
        },
        replace: true,
      });
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
    });
  };

  const handleBackConfirmation = () => {
    if (!patientDetails?.details?.id && !patientDetails?.admissionId) {
      setIsBackModalOpen(false);
      navigate(`/ipd/patient-details`, {
        state: { ...state, activeTab: "assessment", isEditable: false },
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
          state: { ...state, activeTab: "assessment", isEditable: false },
          replace: true,
        });
        setIsBackModalOpen(false);
        setOpen(false);
      });
    } catch (err) {
      console.log("INTEL ==> err", err);
      setIsBackModalOpen(false);
      setOpen(false);
    }
  };

  const renderFilledBySection = () => {
    return (
      <div style={{ margin: "24px 24px 0" }}>
        <FilledByCard
          filledBy={profile?.um_name}
          role="Doctor"
          selectedDate={dayjs(filledDate)}
          selectedTime={dayjs(filledAtTime)}
          dateFormat="DD MMM YYYY"
          timeFormat="HH:mm A"
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
                  title: "Save",
                }}
                items={assessments}
                renderSection={renderSections}
                renderTopSection={renderFilledBySection}
                onRequestClose={() => {
                  setIsBackModalOpen(true);
                }}
                headerOffset={72}
                // renderBottomSection={renderBottomSection} // TODO: INTEL - WHEN SHOWING CUSTOM MODULE - WHEN ANY NEW ADDED, ADD THEM IN CUSTOMIZATION API FOR THIS PARTICULAR USER, so that user can move the custom module too
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
                ...customization,
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
