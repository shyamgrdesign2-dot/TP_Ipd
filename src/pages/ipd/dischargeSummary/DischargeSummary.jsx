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
  resetActualDischargeSummaryData,
  resetDischargeSummaryData,
  resetDischargeSummaryForm,
  setSurgeriesPerformed,
  updateDischargeSummaryData,
} from "../../../redux/ipd/dischargeSummarySlice.js";
import { addDischargeDataToStore } from "../../../utils/dischargeDataMapper.js";
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
import {
  getLastPrescriptionDate,
  lastPrescriptionData,
} from "../../../redux/ipd/assessmentsFormSlice.js";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import DrawerWrapper from "../components/DrawerWrapper/DrawerWrapper.jsx";
import OtNotesTimeline from "../otNotes/OtNotesTimeline.jsx";
import { otNotesIcons } from "../../../assets/images/indices/index.js";
import {
  getOtNotesData,
  resetOtNotesForm,
} from "../../../redux/ipd/otNotesSlice.js";
import { errorMessage } from "../../../utils/utils.js";

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
    fromTab,
    isNew = false,
  } = state || {};
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showAutoFillLocal, setShowAutoFillLocal] = useState(false);
  const [autoFillTitleLocal, setAutoFillTitleLocal] = useState("");
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { customization = {} } = useSelector((state) => state.ipd);
  const assessmentData = useSelector((state) => state.assessment);
  const { customModules } = useSelector((state) => state.customModules);
  const dischargeSummaryState = useSelector((state) => state.dischargeSummary);
  const prescriptionSlice = useSelector((state) => state.prescription);
  const obstetricSlice = useSelector((state) => state.obstetric);
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
  useEffect(() => {
    if (dischargeSummary.length > 0) {
      setModelData(dischargeSummary);
    }
  }, [dischargeSummary]);

  useEffect(() => {
    if (otNotesData?.otNotesData && Array.isArray(otNotesData.otNotesData)) {
      const surgeryDetails = otNotesData.otNotesData.map((otNote) => {
        const surgeryInfo = otNote?.otNotes?.surgeryDetails || {};
        return {
          procedureName: Array.isArray(surgeryInfo.procedureName)
            ? surgeryInfo.procedureName.join(", ")
            : surgeryInfo.procedureName || "",
          surgeryDate: surgeryInfo.surgeryDate || "",
          otNoteId: otNote._id || null,
        };
      });

      if (surgeryDetails.length > 0) {
        dispatch(setSurgeriesPerformed(surgeryDetails));
      }
    }
  }, [otNotesData?.otNotesData]);

  useEffect(() => {
    if (
      patientDetails?.details?.id &&
      (!dischargeSummaryState?.actualDischargeSummaryData ||
        (dischargeSummaryState?.actualDischargeSummaryData &&
          !Object.keys(dischargeSummaryState.actualDischargeSummaryData)
            .length))
    )
      dispatch(
        getDischargeSummaryData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      )
        .then((res) => {
          if (res.payload && !res.error) {
            addDischargeDataToStore(res.payload, dispatch);
          }
        })
        .catch((error) => {
          console.error("Error fetching discharge summary data:", error);
        });
  }, []);

  useEffect(() => {
    if (isEditable)
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
  }, []);

  useEffect(() => {
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getOtNotesData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      );
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

  const handleAddEditOtNotes = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    dispatch(resetOtNotesForm());
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        isNew: true,
        fromDischargeSummary: true,
        fromTab
      },
    });
  };
  console.log(patient_data,"patient_data")
  console.log(patientDetails,"patientDetails");

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
                <div
                  className="flex-column-gap-16"
                  key={`${JSON.stringify(
                    assessmentData?.physicalExaminationOthersData
                  )}-${JSON.stringify(
                    assessmentData?.physicalExaminationBasicData
                  )}-${JSON.stringify(assessmentData?.vitalsData)}`}
                >
                  <PhysicalExamination
                    isEditable={false}
                    {...props}
                    sectionData={data}
                    isDischargeSummary={true}
                    isCollapsible={true}
                  >
                    <div onClick={() => handleAddEditPhysicalExamination(data)}>
                      <GenericCard
                        icon={defaultIcons.editIcon}
                        title={"Add/Edit Physical Examination"}
                      />
                    </div>
                  </PhysicalExamination>
                </div>
              );
            case "functionalAssessment":
              return (
                <div
                  className="flex-column-gap-16"
                  key={JSON.stringify(assessmentData?.functionalAssessmentData)}
                >
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
              return (
                <CourseInHospital
                  {...props}
                  sectionData={data}
                  patientId={patientDetails?.details?.id}
                  admissionId={patientDetails?.admissionId}
                />
              );
            case "otNotes":
              return (
                <div className="flex-column-gap-16">
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
                    <div className="flex-column-gap-16">
                      <OtNotesTimeline isLiteMode={true} />
                      <div onClick={handleAddEditOtNotes}>
                        <GenericCard
                          icon={defaultIcons.editIcon}
                          title={"Add New OT Notes"}
                        />
                      </div>
                    </div>
                  </CollapsibleWrapper>
                </div>
              );
            case "dischargeNotes":
              return <DischargeNotes {...props} sectionData={data} />;
            case "dischargeAdvice":
              return <DischargeAdvice {...props} sectionData={data} />;
            case "followUp":
              return <FollowUp {...props} sectionData={data} />;
            // case "preparedBy":
            //   return <PreparedBy {...props} sectionData={data} />;
            default:
              return <></>;
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

  const onSaveDischargeSummaryClick = async () => {
    // Helper function to format surgery data from OT Notes
    const formatSurgeriesPerformed = (otNotesData) => {
      if (!Array.isArray(otNotesData) || otNotesData.length === 0) {
        return [];
      }

      return otNotesData.map((otNote) => {
        const surgeryDetails = otNote?.otNotes?.surgeryDetails || {};
        return {
          procedureName: Array.isArray(surgeryDetails.procedureName)
            ? surgeryDetails.procedureName
            : surgeryDetails.procedureName
            ? [surgeryDetails.procedureName]
            : [],
          surgeryDate: surgeryDetails.surgeryDate || "",
          surgeryStartTime: surgeryDetails.surgeryStartTime || "",
          surgeryEndTime: surgeryDetails.surgeryEndTime || "",
        };
      });
    };

    // Helper function to format treatment given data
    const formatTreatmentGiven = (treatmentNotes) => {
      if (!Array.isArray(treatmentNotes) || treatmentNotes.length === 0) {
        return [];
      }

      return treatmentNotes.map((treatment) => ({
        name: treatment.name || "",
        givenDate: treatment.givenDate || "",
        duration: treatment.duration || "",
        notes: treatment.notes || "",
        module: treatment.module || "",
      }));
    };

    // Helper function to format chronological summary
    const formatChronologicalSummary = (chronologicalSummary, arr) => {
      return arr || chronologicalSummary;
    };

    // Helper function to format OT Notes surgeries
    const formatOtNotesSurgeries = (otNotesData) => {
      if (!Array.isArray(otNotesData) || otNotesData.length === 0) {
        return [];
      }

      return otNotesData.map((otNote) => {
        const surgeryDetails = otNote?.otNotes?.surgeryDetails || {};
        const surgeryTeam = otNote?.otNotes?.surgeryTeam || {};

        return {
          _id: otNote._id || "",
          procedureName: Array.isArray(surgeryDetails.procedureName)
            ? surgeryDetails.procedureName
            : surgeryDetails.procedureName
            ? [surgeryDetails.procedureName]
            : [],
          dateOfSurgery: surgeryDetails.surgeryDate || "",
          surgeon: surgeryTeam.primarySurgeon || [],
          secondarySurgeon: surgeryTeam.secondarySurgeon || [],
          assistant: surgeryTeam.assistant || [],
          anaesthetist: surgeryTeam.anaesthesiologist || [],
          scrubNurse: surgeryTeam.scrubNurse || [],
          floorCirculatingNurse: surgeryTeam.floorCirculatingNurse || [],
          anaesthetistType: surgeryDetails.anaesthesiaType || "",
          operativeFindings:
            otNote?.otNotes?.operativeNotes?.operativeFindings || [],
          procedure: otNote?.otNotes?.operativeNotes?.procedures || [],
          additionalNotes:
            otNote?.otNotes?.postOperativeNotes?.additionalNotes || [],
        };
      });
    };  

    // Helper function to format discharge medications
    // Format tmm_dosage: if tmm_dosage_unit_name exists, use it; otherwise combine tmm_dosage + tmm_unit_name
    const formatDischargeMedications = (medications) => {
      if (!Array.isArray(medications) || medications.length === 0) {
        return [];
      }

      return medications.map((medication) => {
        const formattedMedication = { ...medication };
        const formattedMedicineUnit = convertToRawFormat(formattedMedication.medicineUnit);
        
        // If tmm_dosage_unit_name exists and is not empty, use it as tmm_dosage
        if (formattedMedication.tmm_dosage_unit_name && formattedMedication.tmm_dosage_unit_name.trim() !== "") {
          formattedMedication.tmm_dosage = formattedMedication.tmm_dosage_unit_name;
        } else {
          // Otherwise, combine tmm_dosage + tmm_unit_name
          const dosage = formattedMedication.tmm_dosage ? formattedMedication.tmm_dosage: 1 ;
          // const unitName = formattedMedication.tmm_unit_name || "";
          const unitName = formattedMedication.tmm_unit_name ? formattedMedication.tmm_unit_name : formattedMedicineUnit?.find(
            (x) => x.tmu_id == formattedMedication.tmu_id
          )?.tmu_title || formattedMedicineUnit[0]?.tmu_title ;
          
          formattedMedication.tmm_dosage_unit_name = `${dosage} ${unitName}`.trim();
        }
        
        return formattedMedication;
      });
    };

    const reqData = {
      assessmentId:
        dischargeSummaryState?.dischargeSummaryData?.assessmentId !==
        "undefined"
          ? dischargeSummaryState?.dischargeSummaryData?.assessmentId
          : "",
      patientInformation: {
        ...dischargeSummaryState.dischargeSummaryData?.patientInformation,
      },
      diagnosisAndSurgery: {
        finalDiagnosis:
          dischargeSummaryState?.dischargeSummaryData?.diagnosisAndSurgery
            ?.finalDiagnosis || [],
        provisionalDiagnosis:
          dischargeSummaryState?.dischargeSummaryData?.diagnosisAndSurgery
            ?.provisionalDiagnosis || [],
        surgeriesPerformed: formatSurgeriesPerformed(otNotesData.otNotesData),
      },
      patientHistory: {
        presentingComplaints: assessmentData.chiefComplaint || [],
        pastMedicalHistory: prescriptionSlice.medicalHistoryData || [],
        gyneacHistory: assessmentData.gynecHistoryData || {},
        obstetricHistory: obstetricSlice.obstetricDetails || {},
      },
      physicalExamination: {
        vitals: assessmentData.vitalsData,
        generalExamination: assessmentData.physicalExaminationBasicData || {},
        others: assessmentData.physicalExaminationOthersData || [],
      },
      functionalAssessmentTimeOfAdmission: {
        assessment: (() => {
          const data = { ...assessmentData.functionalAssessmentData };
          delete data.others;
          return data;
        })(),
        others: assessmentData.functionalAssessmentData.others,
      },
      date:
        JSON.stringify(
          dischargeSummaryState.dischargeSummaryData?.courseInHospital
            ?.chronologicalSummary
        ) !== JSON.stringify(dischargeSummaryState?.chronologicalSummary) ||
        JSON.stringify(
          dischargeSummaryState.dischargeSummaryData?.courseInHospital
            ?.treatmentGiven
        ) !== JSON.stringify(dischargeSummaryState?.treatmentNotes)
          ? new Date()
          : null,
      courseInHospital: {
        chronologicalSummary: formatChronologicalSummary(
          dischargeSummaryState?.chronologicalSummary,
          dischargeSummaryState.dischargeSummaryData?.courseInHospital
            ?.chronologicalSummary
        ),
        treatmentGiven: formatTreatmentGiven(
          dischargeSummaryState.treatmentNotes
        ),
      },
      otNotes: {
        surgeries: formatOtNotesSurgeries(otNotesData.otNotesData),
      },
      dischargeNotes: {
        dischargeVitals: {
          ...dischargeSummaryState.dischargeSummaryData?.vitalsData,
        },
        patientCondition:
          dischargeSummaryState.dischargeSummaryData?.patientCondition,
        dischargeMedications: formatDischargeMedications(prescriptionSlice.medicationData || []),
      },
      crossReferral:
        dischargeSummaryState.dischargeSummaryData?.crossReferral || [],
      labResults: dischargeSummaryState.dischargeSummaryData?.labResults || [],
      dischargeAdvice: {
        diet: dischargeSummaryState.dischargeSummaryData?.diet || [],
        physicalActivities:
          dischargeSummaryState.dischargeSummaryData?.physicalActivities || [],
        otherAdvice:
          dischargeSummaryState.dischargeSummaryData?.otherAdvice || [],
        warningSigns:
          dischargeSummaryState.dischargeSummaryData?.warningSigns || [],
        preventiveMeasures:
          dischargeSummaryState.dischargeSummaryData?.preventiveMeasures || [],
        emergencyContact:
          dischargeSummaryState.dischargeSummaryData?.emergencyContact || [],
      },
      followUpAdditionalNotes:
        dischargeSummaryState.dischargeSummaryData?.additionalNotes || [],
      followUp: dischargeSummaryState.dischargeSummaryData?.followUps || [],
      preparedBy:
        dischargeSummaryState.dischargeSummaryData?.preparedBy || null,
    };

    const response = await dispatch(
      updateDischargeSummaryData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: dischargeSummaryState.dischargeSummaryData?._id || null,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      try {
        if (response?.payload?.error) {
          if (response.payload.message?.split("must")?.[0]) {
            message.warning(`Please fill all the fields before saving`);
          } else {
            message.warning(`Something went wrong, Please try again.`);
          }
          return;
        }
        dispatch(resetActualDischargeSummaryData());
        dispatch(resetDischargeSummaryData());
        navigate("/ipd/patient-details", {
          state: {
            isEditable: false,
            patient_data: patient_data,
            patientDetails,
            fromTab,
            activeTab: "dischargeSummary",
          },
          replace: true,
        });
      } catch (err) {
        errorMessage(response?.error);
      }
    } else {
      errorMessage(response?.error);
      // message.error("Failed to update discharge summary. Please try again.");
    }
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

  if (
    !Object.keys(dischargeSummaryState?.actualDischargeSummaryData || {})
      ?.length
  ) {
    return <FullPageLoader />;
  }
  // Early return if essential data is missing to prevent undefined errors
  if (!patientDetails && isEditable) {
    return <FullPageLoader />;
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
            {open && dischargeSummary && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="dischargeSummary"
                title={"Discharge Summary"}
                mainCta={{
                  handler: onSaveDischargeSummaryClick,
                  title: "Save",
                }}
                items={dischargeSummary}
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
          onClose={() => {
            dispatch(
              updateCustomization({
                ...customization,
                dischargeSummary: modelData,
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
        onConfirm={() => {
          setIsBackModalOpen(false);
          navigate(`/ipd/patient-details`, {
            state: {
              ...state,
              activeTab: "dischargeSummary",
              isEditable: false,
              fromTab,
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
          onSave={handleAddEditPhysicalExamination}
        >
          <PhysicalExamination
            {...props}
            isEditable={true}
            sectionData={sectionData}
            showCollapsibleWrapper={false}
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
          onSave={handleAddEditFunctionalAssessment}
        >
          <FunctionalAssessment
            showCollapsibleWrapper={false}
            {...props}
            isEditable={true}
            sectionData={sectionData}
          />
        </DrawerWrapper>
      )}
    </div>
  );
};

export default DischargeSummary;
