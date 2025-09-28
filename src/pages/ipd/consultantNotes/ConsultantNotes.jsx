import React, { Suspense, useCallback, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import { convertMedicationFormat } from "../../../utils/utils";
import MedicationsBox from "../../../components/MedicationsBox";
import { Button, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getConsultantNotes,
  updateConsultantNotes,
  setVitals,
  setLabInvestigation,
  resetConsultantNotes,
} from "../../../redux/ipd/consultantNotesSlice";
import {
  setMedicationData,
  clearMedicationData,
} from "../../../redux/prescriptionSlice";
import InvestigationBox from "../../../components/InvestigationBox";
import Vitals from "../../ipd/consultantNotes/Vitals";
import ClinicalAssessment from "../../ipd/consultantNotes/ClinicalAssessment";
import AdditionalRemarks from "../../ipd/consultantNotes/AdditionalRemarks";
import CustomModule from "../../../components/CustomModule";
import AddCustomModule from "../../../components/AddCustomModule";
import dayjs from "dayjs";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { updateCustomization } from "../../../redux/ipd/ipdSlice";
import { isMobile } from "react-device-detect";
import TabMedicationBox from "../../../components/tab_design/TabMedicationBox";
import TabInvestigationBox from "../../../components/tab_design/TabInvestigationBox";
import { MESSAGE_KEY } from "../../../utils/constants";
import visitEnd from "../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../assets/images/close-visit.svg";
import ProgressSummary from "../../../components/ProgressSummary";
import AgentAlex from "../../../components/AgentAlex";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const ConsultantNotes = (props) => {
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;

  const { isEditable = true } = props; // Default patientId for testing
  const dispatch = useDispatch();

  const {
    consultantNotes,
    currentConsultantNote,
    loading,
    clinicalAssessmentPlan,
    vitals,
    additionalRemarks,
  } = useSelector((state) => state.consultantNotes);
  const { medicationData } = useSelector((state) => state.prescription);
  const { customModules } = useSelector((state) => state.customModules);
  const { customization = {} } = useSelector((state) => state.ipd);
  const { profile } = useSelector((state) => state.doctors);

  const { consultationNotes: consultantNotesCustomization = [] } =
    customization;
  console.log({ customization });

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [filledDate, setFilledDate] = useState(new Date());
  const [filledAtTime, setFilledAtTime] = useState(new Date());
  const [investigationData, setInvestigationData] = useState([]);
  const [shouldAutofill, setShouldAutofill] = useState(false);
  const [showAgentAlex, setShowAgentAlex] = useState(false);

  // Load filledDate and filledAtTime from current consultant note
  useEffect(() => {
    if (currentConsultantNote && currentConsultantNote.consultationNotes) {
      if (currentConsultantNote.consultationNotes.date) {
        setFilledDate(new Date(currentConsultantNote.consultationNotes.date));
      }
      if (currentConsultantNote.consultationNotes.time) {
        setFilledAtTime(new Date(currentConsultantNote.consultationNotes.time));
      }
      if (currentConsultantNote.consultationNotes.labInvestigation) {
        setInvestigationData(
          currentConsultantNote.consultationNotes.labInvestigation?.map(
            (e) => ({
              investigation_name: e.name,
              note: e.notes,
            })
          ) || []
        );
      }
    }
  }, [currentConsultantNote]);

  useEffect(() => {
    if (consultantNotesCustomization.length > 0) {
      setModelData(consultantNotesCustomization);
    }
  }, [consultantNotesCustomization]);

  // Fetch consultant notes on component mount and clear medication data
  useEffect(() => {
    if (patientId && admissionId) {
      // Clear medication data to ensure clean state for consultant notes
      if (!currentConsultantNote?._id) dispatch(clearMedicationData());
      dispatch(getConsultantNotes({ patientId, admissionId }));
    }
  }, [patientId, dispatch, admissionId]);

  // Save consultant notes
  const saveConsultantNotes = async () => {
    try {
      // Collect data from Redux state
      const consultantNotesData = {
        clinicalAssessmentPlan: clinicalAssessmentPlan || [],
        vitals: vitals || {},
        currentMedication: convertMedicationFormat(medicationData),
        medication: medicationData,
        labInvestigation:
          investigationData?.map((e) => ({
            name: e.investigation_name,
            notes: e.note,
          })) || [],
        additionalRemarks: additionalRemarks || [],
        date: filledDate,
        time: filledAtTime,
      };

      console.log("Saving consultant notes with data:", consultantNotesData);
      console.log("Filled Date:", filledDate);
      console.log("Filled At Time:", filledAtTime);

      // Update existing note
      const result = await dispatch(
        updateConsultantNotes({
          patientId,
          admissionId,
          _id: currentConsultantNote?._id,
          data: consultantNotesData,
        })
      );

      if (result.type.endsWith("fulfilled")) {
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" />
              <div>
                <div className="title-common text-start fontroboto">
                  Consultant Notes Saved Successfully!
                </div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
              />
            </div>
          ),
          duration: 3,
        });
        console.log("Consultant notes updated successfully");
      } else {
        console.error("Failed to update consultant notes");
      }

      // Refresh the notes after saving
      await dispatch(getConsultantNotes({ patientId, admissionId }));
      navigate(`/ipd/patient-details`, {
        replace: true,
        state: {
          patient_data,
          patientDetails,
          isEditable: false,
          activeTab: "consultantNotes", // This will help identify which tab to show
        },
      });
    } catch (error) {
      console.error("Error saving consultant notes:", error);
    }
  };

  const handleAutofillVitals = () => {
    if (consultantNotes && consultantNotes.length > 0) {
      const latestNote = consultantNotes[consultantNotes?.length - 1];
      if (latestNote.consultationNotes?.vitals) {
        dispatch(setVitals(latestNote.consultationNotes.vitals));
        console.log("Autofilled Vitals:", latestNote.consultationNotes.vitals);
      }
    }
  };

  const handleAutofillMedication = () => {
    if (consultantNotes && consultantNotes.length > 0) {
      const latestNote = consultantNotes[consultantNotes?.length - 1];
      if (latestNote.consultationNotes?.medication) {
        dispatch(setMedicationData(latestNote.consultationNotes.medication));
        console.log(
          "Autofilled Medication:",
          latestNote.consultationNotes.medication
        );
      }
    }
  };

  const handleAutofillLabInvestigation = () => {
    if (consultantNotes && consultantNotes.length > 0) {
      const latestNote = consultantNotes[consultantNotes?.length - 1];
      if (latestNote.consultationNotes?.labInvestigation) {
        setInvestigationData(
          latestNote.consultationNotes.labInvestigation?.map((e) => ({
            investigation_name: e.name,
            note: e.notes,
          }))
        );
        dispatch(
          setLabInvestigation(latestNote.consultationNotes.labInvestigation)
        );
        console.log(
          "Autofilled Lab Investigation:",
          latestNote.consultationNotes.labInvestigation
        );
      }
    }
  };

  // Main autofill function that calls all individual autofill functions
  const handleAutofillAll = () => {
    setShouldAutofill(true);
    if (consultantNotes && consultantNotes.length > 0) {
      const latestNote = consultantNotes[consultantNotes?.length - 1];

      if (latestNote.consultationNotes) {
        // Call all individual autofill functions
        handleAutofillMedication();
        handleAutofillLabInvestigation();
      }
    } else {
      console.log("No previous consultant notes found for autofill");
    }
    setTimeout(() => {
      setShouldAutofill(false);
    }, 100);
  };

  const renderSections = useCallback(
    (data) => {
      switch (data?.id) {
        case "clinicalAssessmentPlan":
          return (
            <ClinicalAssessment
              {...props}
              sectionData={data}
              shouldAutofill={shouldAutofill}
            />
          );
        case "vitals":
          return (
            <Vitals
              {...props}
              sectionData={data}
              onAutofill={handleAutofillVitals}
            />
          );
        case "medication":
          return (
            <div className="ipdaf-box-container">
              {isMobile ? (
                <TabMedicationBox
                  hideFrequentlyUsedMeds={true}
                  isEditable={isEditable}
                />
              ) : (
                <MedicationsBox
                  isEditable={isEditable}
                  medicationData={medicationData}
                />
              )}
            </div>
          );
        case "labInvestigation":
          return (
            <div className="ipdaf-box-container">
              {isMobile ? (
                <TabInvestigationBox
                  investigationData={investigationData || []}
                  setInvestigationData={(data) => {
                    setInvestigationData(data);
                    dispatch(setLabInvestigation(data));
                  }}
                  diagnosisData={[]}
                />
              ) : (
                <InvestigationBox
                  onAutofill={handleAutofillLabInvestigation}
                  investigationData={investigationData || []}
                  setInvestigationData={(data) => {
                    setInvestigationData(data);
                    dispatch(setLabInvestigation(data));
                  }}
                  diagnosisData={[]}
                />
              )}
            </div>
          );
        case "additionalRemarks":
          return (
            <AdditionalRemarks
              {...props}
              sectionData={data}
              shouldAutofill={shouldAutofill}
            />
          );
        default:
          return null;
      }
    },
    [
      props,
      handleAutofillVitals,
      handleAutofillMedication,
      handleAutofillLabInvestigation,
      shouldAutofill,
    ]
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");
  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);
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
          showTimePeriod={false}
        />
      </div>
    );
  };

  const renderCustomModuleSection = () => {
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

  const [modelData, setModelData] = useState(
    consultantNotesCustomization.length > 0
      ? consultantNotesCustomization
      : IPD.DEFAULT_CONSULTANT_NOTES_FORM_STRUCTURE
  );

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_CONSULTANT_NOTES_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      consultationNotes: IPD.DEFAULT_CONSULTANT_NOTES_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      consultationNotes: [...modelData],
    };
    dispatch(updateCustomization(newData));
  };

  const handleProgressSummaryClick = () => {
    console.log("Progress Summary clicked - Opening Agent Alex");
    setShowAgentAlex(true);
  };

  const handleAgentAlexClose = () => {
    console.log("Agent Alex closed");
    setShowAgentAlex(false);
  };

  const handleViewProgressNotes = () => {
    console.log("View Progress Notes clicked");
    // TODO: Implement navigation to progress notes or open detailed view
    // You can add navigation logic here
  };

  return (
    <div className="afipd-assessments-form-container">
      <Suspense fallback={<>Loading ...</>}>
        <div
          className={`ipd-assessments-form-container ${
            !isEditable ? "ipd-assessments-readable-container" : ""
          } ${showAgentAlex ? "agent-alex-open" : ""}`}
          style={{
            "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80",
            width: showAgentAlex ? "calc(100% - 404px)" : "100%", // 380px panel + 24px margin
            transition: "width 0.3s ease",
          }}
        >
          {open && modelData && (
            <LayoutWithMenu
              onCustomiseClick={() => setShowCustomisationDrawer(true)}
              key="consult"
              items={modelData}
              onRequestClose={() => {
                dispatch(resetConsultantNotes());
                navigate(-1);
                return setOpen(false);
              }}
              headerOffset={72}
              title="Consultant Notes"
              renderSection={renderSections}
              renderTopSection={renderFilledBySection}
              // renderBottomSection={renderCustomModuleSection}
              showAutoFill={!!consultantNotes?.length}
              autoFillTitle={
                consultantNotes && consultantNotes.length > 0
                  ? `Autofill From Prev. Consultant Notes (${new Date(
                      consultantNotes[consultantNotes?.length - 1].createdAt
                    ).toLocaleDateString()}, ${new Date(
                      consultantNotes[consultantNotes?.length - 1].createdAt
                    ).toLocaleTimeString()})`
                  : "No previous consultant notes available"
              }
              onAutoFill={handleAutofillAll}
              mainCta={{
                title: loading ? "Saving..." : "Save",
                handler: saveConsultantNotes,
                disabled: loading,
              }}
            />
          )}
        </div>
      </Suspense>

      {/* Progress Summary Component - Fixed Bottom Right */}
      {/* {!showAgentAlex && (
        <div className="progress-summary-wrapper">
          <ProgressSummary onClick={handleProgressSummaryClick} />
        </div>
      )} */}

      {/* Agent Alex Panel */}
      {showAgentAlex && (
        <AgentAlex
          onClose={handleAgentAlexClose}
          onViewProgressNotes={handleViewProgressNotes}
        />
      )}
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
    </div>
  );
};

export default React.memo(ConsultantNotes);
