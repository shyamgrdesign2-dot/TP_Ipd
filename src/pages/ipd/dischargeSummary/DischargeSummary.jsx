import React, { Suspense, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale.js";
import "../assessmentForm/styles.scss";
import "./styles.scss";
import { Button, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents.js";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice.js";
import AddCustomModule from "../../../components/AddCustomModule.js";
import { useSelector } from "react-redux";
import CustomModule from "../../../components/CustomModule.js";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";
import FullPageLoader from "../../vaccination/components/Loader.js";
import {
  getDischargeSummaryData,
  resetDischargeSummaryForm,
  updateDischargeSummaryData,
} from "../../../redux/ipd/dischargeSummarySlice.js";
import PatientInformation from "./components/PatientInformation.jsx";
import DiagnosisAndSurgery from "./components/DiagnosisAndSurgery.jsx";
import PatientHistory from "./components/PatientHistory.jsx";
import PhysicalExamination from "../assessmentForm/PhysicalExamination.jsx";
import FunctionalAssessment from "../assessmentForm/FunctionalAssessment.jsx";
import CourseInHospital from "./components/CourseInHospital.jsx";
import DischargeNotes from "./components/DischargeNotes.jsx";
import DischargeAdvice from "./components/DischargeAdvice.jsx";
import FollowUp from "./components/FollowUp.jsx";
import PreparedBy from "./components/PreparedBy.jsx";
import OtNotes from "../otNotes/OtNotes.jsx";
import {
  getAssessmentsData,
  getLastPrescriptionDate,
  lastPrescriptionData,
  setChiefComplaint,
  setFunctionalAssessmentData,
  setGynecHistoryData,
  setHistoryOfPresentIllness,
  setPhysicalExaminationBasicData,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setReferredDocForReview,
  setVitalsData,
} from "../../../redux/ipd/assessmentsFormSlice.js";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import DrawerWrapper from "../components/DrawerWrapper/DrawerWrapper.jsx";
import OtNotesTimeline from "../otNotes/OtNotesTimeline.jsx";
import { otNotesIcons } from "../../../assets/images/indices/index.js";
import { setMedicalHistoryData } from "../../../redux/prescriptionSlice.js";
import { addObstetricDetails } from "../../../redux/obstetricSlice.js";
import {
  getOtNotesData,
  setSingleOtNotesData,
} from "../../../redux/ipd/otNotesSlice.js";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");
const GenericCard = createRemoteComponent("GenericCard");
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const DischargeSummary = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    patient_data,
    patientDetails,
    isEditable = true,
    isNew = false,
  } = state || {};
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showAutoFillLocal, setShowAutoFillLocal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoFillTitleLocal, setAutoFillTitleLocal] = useState("");
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { customization = {} } = useSelector((state) => state.ipd);
  const assessmentData = useSelector((state) => state.assessment);
  const { customModules } = useSelector((state) => state.customModules);
  const dischargeSummaryState = useSelector((state) => state.dischargeSummary);
  const { dischargeSummary = [] } = customization;
  const [modelData, setModelData] = useState(
    dischargeSummary.length > 0
      ? dischargeSummary
      : IPD.DEFAULT_DISCHARGE_SUMMARY_FORM_STRUCTURE
  );
  const [showPhysicalExaminationDrawer, setShowPhysicalExaminationDrawer] =
    useState(false);
  const [showFunctionalAssessmentDrawer, setShowFunctionalAssessmentDrawer] =
    useState(false);
  const otNotesData = useSelector((state) => state.otNotes);
  const [sectionData, setSectionData] = useState(null);
  const [showOtNotesDrawer, setShowOtNotesDrawer] = useState(false);
  useEffect(() => {
    if (dischargeSummary.length > 0) {
      setModelData(dischargeSummary);
    }
  }, [dischargeSummary]);

  const addDataToStore = (data) => {
    if (data) {
      dispatch(setChiefComplaint(data?.basicInfo?.chiefComplaint || []));
      dispatch(
        setMedicalHistoryData(data?.basicInfo?.pastMedicalHistory || [])
      );
      dispatch(setGynecHistoryData(data?.basicInfo?.gyneacHistory || []));
      dispatch(addObstetricDetails(data?.basicInfo?.obstetricHistory || []));
      dispatch(
        setPhysicalExaminationProvisionalDiagnosisData(
          data?.physicalExamination?.provisionalDiagnosis || []
        )
      );
      dispatch(
        setPhysicalExaminationOthersData(
          data?.physicalExamination?.others || []
        )
      );
      dispatch(
        setPhysicalExaminationBasicData(
          data?.physicalExamination?.examination || {}
        )
      );
      const functionalAssessmentWithoutReferredDoc = {
        ...data?.functionalAssessment,
      };
      delete functionalAssessmentWithoutReferredDoc.referredToPhysiotherapyForReview;
      dispatch(
        setFunctionalAssessmentData(
          functionalAssessmentWithoutReferredDoc || {}
        )
      );
      dispatch(
        setReferredDocForReview(
          data?.functionalAssessment?.referredToPhysiotherapyForReview || null
        )
      );
    }
  };

  useEffect(() => {
    if (isEditable && patientDetails?.details?.id) {
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
  }, []);

  useEffect(() => {
    // Only fetch OT Notes data if we have the required patient details
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getOtNotesData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      ).then((res) => {
        if (otNotesData.currentOtNoteId) {
          dispatch(setSingleOtNotesData({ _id: otNotesData.currentOtNoteId }));
        }
      });
    }
  }, [patientDetails?.details?.id, patientDetails?.admissionId]);

  useEffect(() => {
    dispatch(getCustomization());
  }, [patientDetails?.details?.id, patientDetails?.admissionId]);

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_DISCHARGE_SUMMARY_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      dischargeSummary: IPD.DEFAULT_DISCHARGE_SUMMARY_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const handleAddEditPhysicalExamination = (data) => {
    setSectionData(data);
    setShowPhysicalExaminationDrawer((prev) => !prev);
  };

  const handleAddEditFunctionalAssessment = (data) => {
    setSectionData(data);
    setShowFunctionalAssessmentDrawer((prev) => !prev);
  };

  const handleAddEditOtNotes = (data) => {
    setSectionData(data);
    setShowOtNotesDrawer((prev) => !prev);
  };

  const onSavePhysicalExaminationClick = () => {
    console.log("INTEL ==> CLICKED SAVE");
  };

  const onSaveFunctionalAssessmentClick = () => {
    console.log("INTEL ==> CLICKED SAVE");
  };

  const onSaveOtNotesClick = () => {
    console.log("INTEL ==> CLICKED SAVE");
  };

  const renderSections = (data) => {
    if (!data || !data.id) {
      return null;
    }

    return (
      <div className="ipd-otnotes-editable-section-container">
        {(() => {
          switch (data.id) {
            case "patientInformation":
              return <PatientInformation {...props} sectionData={data} />;
            case "diagnosisAndSurgery":
              return <DiagnosisAndSurgery {...props} sectionData={data} />;
            case "patientHistory":
              return <PatientHistory {...props} sectionData={data} />;
            case "physicalExamination":
              return (
                <div className="flex-column-gap-16">
                  <PhysicalExamination
                    isEditable={false}
                    {...props}
                    sectionData={data}
                    isDischargeSummary={true}
                  />
                  <div onClick={() => handleAddEditPhysicalExamination(data)}>
                    <GenericCard
                      icon={defaultIcons.editIcon}
                      title={"Add/Edit Physical Examination"}
                    />
                  </div>
                </div>
              );
            case "functionalAssessment":
              return (
                <div className="flex-column-gap-16">
                  <FunctionalAssessment
                    isEditable={false}
                    isCollapsible={true}
                    {...props}
                    sectionData={data}
                    hideBorder={true}
                    showAddEditButton={true}
                    onAddEditClick={() =>
                      handleAddEditFunctionalAssessment(data)
                    }
                  />
                </div>
              );
            case "courseInHospital":
              return <CourseInHospital 
                {...props} 
                sectionData={data} 
                patientId={patientDetails?.details?.id}
                admissionId={patientDetails?.admissionId}
              />;
            case "otNotes":
              return (
                <div className="flex-column-gap-16">
                  {/* <FunctionalAssessment
                    isEditable={false}
                    {...props}
                    sectionData={data}
                    hideBorder={true}
                  /> */}
                  {/* <OtNotes isEditable={false} hideLayoutWithMenu={true} {...props} sectionData={data} /> */}
                  <CollapsibleWrapper
                    title={data?.title}
                    data-testid={data?.id}
                    icon={otNotesIcons[`${data?.id}PcDark`]}
                    collapsible={isEditable}
                    width={"100%"}
                    className={`collapsible-wrapper-class ${
                      isEditable ? "" : "collapsible-wrapper-class-readonly"
                    }`}
                    defaultOpen
                  >
                    <OtNotesTimeline isLiteMode={true} />
                  </CollapsibleWrapper>
                  <div onClick={() => handleAddEditOtNotes(data)}>
                    <GenericCard
                      icon={defaultIcons.editIcon}
                      title={"Add/Edit Ot Notes"}
                    />
                  </div>
                </div>
              );
            case "dischargeNotes":
              return <DischargeNotes {...props} sectionData={data} />;
            case "dischargeAdvice":
              return <DischargeAdvice {...props} sectionData={data} />;
            case "followUp":
              return <FollowUp {...props} sectionData={data} />;
            case "preparedBy":
              return <PreparedBy {...props} sectionData={data} />;
            default:
              return <>{data?.title}</>;
              return null;
          }
        })()}
      </div>
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, dischargeSummary: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const onSaveDischargeSummaryClick = () => {
    const reqData = {
      ...dischargeSummaryState.dischargeSummaryData,
      customModule: [], // TODO: INTEL - HANDLE CUSTOM MODULE
    };

    console.log('INTEL ==> reqData',reqData)

    dispatch(
      updateDischargeSummaryData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
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
      dispatch(
        getDischargeSummaryData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      );
      navigate("/ipd/patient-details", {
        state: {
          isEditable: false,
          patient_data: patient_data,
          patientDetails,
          activeTab: "dischargeSummary",
        },
        replace: true,
      });
    });
  };

  const renderBottomSection = () => {
    return (
      <div className="ipd-custom-module-container">
        {customModules?.map((customModule) => {
          return (
            <CustomModule module={customModule} patient_data={patient_data} />
          );
        })}
        <AddCustomModule />
      </div>
    );
  };

  const renderHeaderSection = () => {
    return (
      <div className="ipd-filled-by-card-container">
        {dischargeSummaryState.currentDischargeSummaryFilledByDetails
          ?.createdByName && (
          <FilledByCard
            showBeing={
              !dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdAt
            }
            filledBy={
              dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdByName || ""
            }
            role={
              dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdByRole || ""
            }
            showFilledOnDate={true}
            selectedDate={
              dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdAt || ""
            }
          />
        )}
        {/* TODO: INTEL - SHOW EDITABLE ONE INSTEAD OF THIS */}
      </div>
    );
  };

  const renderAllSections = () => {
    return (
      <div
        className={`ipd-generic-form-container ipd-otnotes-form-container ${
          !isEditable ? "ipd-assessments-readable-container" : ""
        }`}
      >
        {dischargeSummary.length > 0
          ? dischargeSummary.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  const onMenuItemClick = (activeId) => {
    console.log("INTEL ==> activeId", activeId);
  };

  if (isLoading) {
    return <FullPageLoader />;
  }
  // Early return if essential data is missing to prevent undefined errors
  if (!patientDetails && isEditable) {
    return <div>Loading patient details...</div>;
  }

  return (
    <div
      className={`afipd-otnotes-form-container ${
        isEditable ? "" : "ipd-otnotes-form-container-readonly"
      }`}
    >
      <Suspense fallback={<>Loading ...</>}>
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-generic-form-container ipd-editable-discharge-summary-with-readonly-elements ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
            style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
          >
            {open && modelData && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="dischargeSummary"
                title={"Discharge Summary"}
                mainCta={{
                  handler: onSaveDischargeSummaryClick,
                  title: "Save",
                }}
                items={modelData}
                renderSection={renderSections}
                onRequestClose={() => {
                  setIsBackModalOpen(true);
                }}
                renderHeaderSection={renderHeaderSection}
                headerOffset={72}
                onMenuItemClick={onMenuItemClick}
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
          onClose={() => setShowCustomisationDrawer(false)}
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
        onConfirm={() => {
          setIsBackModalOpen(false);
          navigate(`/ipd/patient-details`, {
            state: {
              ...state,
              activeTab: "dischargeSummary",
              isEditable: false,
            },
            replace: true,
          });
          dispatch(resetDischargeSummaryForm());
          setOpen(false);
        }}
      />
      {showPhysicalExaminationDrawer && (
        <DrawerWrapper
          width={"100%"}
          open={showPhysicalExaminationDrawer}
          onClose={handleAddEditPhysicalExamination}
          title="Physical Examination"
          saveButtonText="Save"
          onSave={onSavePhysicalExaminationClick}
        >
          <PhysicalExamination
            {...props}
            isEditable={true}
            sectionData={sectionData}
          />
        </DrawerWrapper>
      )}
      {showFunctionalAssessmentDrawer && (
        <DrawerWrapper
          width={"100%"}
          open={showFunctionalAssessmentDrawer}
          onClose={handleAddEditFunctionalAssessment}
          title="Functional Assessment"
          saveButtonText="Save"
          onSave={onSaveFunctionalAssessmentClick}
        >
          <FunctionalAssessment
            showCollapsibleWrapper={false}
            {...props}
            isEditable={true}
            sectionData={sectionData}
          />
        </DrawerWrapper>
      )}
      {showOtNotesDrawer && (
        <DrawerWrapper
          width={"100%"}
          open={showOtNotesDrawer}
          onClose={handleAddEditOtNotes}
          title="Ot Notes"
          saveButtonText="Save"
          onSave={onSaveOtNotesClick}
        >
          <OtNotes
            hideLayoutWithMenu={true}
            {...props}
            sectionData={sectionData}
          />
        </DrawerWrapper>
      )}
    </div>
  );
};

export default DischargeSummary;
