import React, { Suspense, useCallback, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import "../assessmentForm/styles.scss";
import "./styles.scss";
import { Button, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import {
  getProgressNotes,
  resetProgressNotes,
  setFindings,
  setVitals,
  updateProgressNotes,
  setChiefComplaint,
  setAdditionalRemarks,
  setCurrentProgressNote,
} from "../../../redux/ipd/progressNotesSlice.js";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice";
import AddCustomModule from "../../../components/AddCustomModule";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import CustomModule from "../../../components/CustomModule";
import { MESSAGE_KEY } from "../../../utils/constants";
import visitEnd from "../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../assets/images/close-visit.svg";
import alertIcon from "../../../assets/images/alertIcon.svg";

import Findings from "./Findings.jsx";
import AdditionalRemarks from "./AdditionalRemarks.jsx";
import ChiefComplaint from "./ChiefComplaint.jsx";
import Vitals from "./Vitals.jsx";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const ProgressNotes = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { progressNotesData, patient_data, patientDetails, isEditable = true } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails || {};

  // const { isEditable = true } = props; // Default patientId for testing

  const navigate = useNavigate();
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [filledDate, setFilledDate] = useState(new Date());
  const [filledAtTime, setFilledAtTime] = useState(new Date());
  const [shouldAutofill, setShouldAutofill] = useState(false);

  const {
    progressNotes,
    currentProgressNote,
    loading,
    chiefComplaint,
    findings,
    vitals,
    additionalRemarks,
  } = useSelector((state) => state.progressNotes);

  const { customization = {} } = useSelector((state) => state.ipd);
  const { customModules } = useSelector((state) => state.customModules);
  const { profile } = useSelector((state) => state.doctors);

  const { progressNotes: progressNotesCustomization = [] } =
  customization;
  const [modelData, setModelData] = useState(
    progressNotesCustomization.length > 0 ? progressNotesCustomization : IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE
  );

  // Preload from navigation state when user clicked Edit from the timeline
  useEffect(() => {
    if (progressNotesData && progressNotesData.raw) {
      const raw = progressNotesData.raw;
      const pn = raw.progressNotes || {};
      dispatch(setCurrentProgressNote(raw));
      if (Array.isArray(pn.chiefComplaint)) dispatch(setChiefComplaint(pn.chiefComplaint));
      if (Array.isArray(pn.findings)) dispatch(setFindings(pn.findings));
      if (pn.vitals && typeof pn.vitals === 'object') dispatch(setVitals(pn.vitals));
      if (Array.isArray(pn.additionalRemarks)) dispatch(setAdditionalRemarks(pn.additionalRemarks));
      if (pn.date) setFilledDate(new Date(pn.date));
      // prefer explicit time field, fallback to timestamp
      if (pn.time) setFilledAtTime(new Date(pn.time));
    }
  }, [progressNotesData, dispatch]);

  // If navigated directly (no state), ensure customization and fetch list for autofill/use
  useEffect(() => {
    dispatch(getCustomization());
    if (patientId && admissionId) {
      dispatch(getProgressNotes({ patientId, admissionId }));
    }
  }, [dispatch, patientId, admissionId]);

  // Load filledDate and filledAtTime from current note if it changes (kept, with minor fix)
  useEffect(() => {
    if (currentProgressNote && currentProgressNote.progressNotes) {
      if (currentProgressNote.progressNotes.date) {
        setFilledDate(new Date(currentProgressNote.progressNotes.date));
      }
      if (currentProgressNote.progressNotes.time) {
        setFilledAtTime(new Date(currentProgressNote.progressNotes.time));
      }
    }
  }, [currentProgressNote]);

  const saveProgressNotes = async () => {
    try {
      // Collect data from Redux state
      const progressNotesData = {
        vitals: vitals || {},
        chiefComplaint: chiefComplaint || [],
        findings: findings || [],
        additionalRemarks: additionalRemarks || [],
        date: filledDate,
        time: filledAtTime,
      };

      // Validate that there's actual data to save
      const hasVitalsData = vitals && Object.values(vitals).some(value => 
        value !== null && value !== undefined && value !== ""
      );

      // Helper function to check if rich text editor data has meaningful content
      const hasRichTextContent = (data) => {
        if (!Array.isArray(data) || data.length === 0) return false;
        
        return data.some(item => {
          if (item && item.children && Array.isArray(item.children)) {
            return item.children.some(child => {
              if (child && child.text) {
                return child.text.trim() !== "";
              }
              return false;
            });
          }
          return false;
        });
      };

      const hasChiefComplaint = chiefComplaint && chiefComplaint.length > 0 && 
        hasRichTextContent(chiefComplaint);
      const hasFindings = findings && findings.length > 0 && 
        hasRichTextContent(findings);
      const hasAdditionalRemarks = additionalRemarks && additionalRemarks.length > 0 && 
        hasRichTextContent(additionalRemarks);

      // Check if any field has meaningful data
      const hasAnyData = hasVitalsData || hasChiefComplaint || hasFindings || hasAdditionalRemarks;

      if (!hasAnyData) {
        message.open({
          key: MESSAGE_KEY,
          // type: "error",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={alertIcon} className="me-3" />
              <div>
                <div className="title-common text-start fontroboto">
                  Please fill in at least one field before saving!
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
        return; // Exit early if no data
      }

      // Update existing note (requires _id). If none, try to use currentProgressNote or skip _id.
      const result = await dispatch(
        updateProgressNotes({
          patientId,
          admissionId,
          _id: currentProgressNote?._id || progressNotesData?._id,
          data: progressNotesData,
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
                  Progress Notes Saved Successfully!
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
      await dispatch(getProgressNotes({ patientId, admissionId }));
      navigate(`/ipd/patient-details`, {
        replace: true,
        state: {
          patient_data,
          patientDetails,
          isEditable: false,
          activeTab: "progress", // This will help identify which tab to show
        },
      });
    } catch (error) {
      console.error("Error saving progress notes:", error);
    }
  };

  const handleAutofillVitals = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.vitals) {
        dispatch(setVitals(latestNote.progressNotes.vitals));
        console.log("Autofilled Vitals:", latestNote.progressNotes.vitals);
      }
    }
  };

  const handleAutofillFindings = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.findings) {
        dispatch(setFindings(latestNote.progressNotes.findings));
        console.log(
          "Autofilled Findings:",
          latestNote.progressNotes.findings
        );
      }
    }
  };

  const handleAutofillChiefComplaint = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.chiefComplaint) {
        dispatch(setChiefComplaint(latestNote.progressNotes.chiefComplaint));
        console.log(
          "Autofilled Chief Complaint:",
          latestNote.progressNotes.chiefComplaint
        );
      }
    }
  };

  const handleAutofillAdditionalRemarks = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.additionalRemarks) {
        dispatch(setAdditionalRemarks(latestNote.progressNotes.additionalRemarks));
        console.log(
          "Autofilled Additional Remarks:",
          latestNote.progressNotes.additionalRemarks
        );
      }
    }
  };

  // Main autofill function that calls all individual autofill functions
  const handleAutofillAll = () => {
    console.log(
      "handleAutofillAll called with progressNotes:",
      progressNotes
    );
    setShouldAutofill(true);
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes) {
        console.log(
          "Dispatching Redux actions with data:",
          latestNote.progressNotes
        );

        // Call all individual autofill functions
        handleAutofillChiefComplaint();
        handleAutofillFindings();
        handleAutofillVitals();
        handleAutofillAdditionalRemarks();

        console.log(
          "Autofilled all sections from latest progress note:",
          latestNote.progressNotes
        );
      }
    } else {
      console.log("No previous progress notes found for autofill");
    }
    setTimeout(() => {
      setShouldAutofill(false);
    }, 100);
  };

  const renderSections = useCallback(
    (data) => {
    switch (data?.id) {
      case "chiefComplaint":
        return (
          <div className="ipd-pn-section-container">
            <ChiefComplaint {...props} sectionData={data} shouldAutofill={shouldAutofill} />
          </div>
        );
      case "findings":
        return (
          <div className="ipd-pn-section-container">
            <Findings {...props} sectionData={data} shouldAutofill={shouldAutofill} />
          </div>
        );
      case "vitals":
        return (
          <div className="ipd-pn-section-container">
            <Vitals {...props} sectionData={data} shouldAutofill={shouldAutofill} />
          </div>
        );
      case "additionalRemarks":
        return (
          <div className="ipd-pn-section-container">
            <AdditionalRemarks {...props} sectionData={data} shouldAutofill={shouldAutofill} />
          </div>
        );
      default:
        return null;
    }
  },
  [
    props,
    handleAutofillVitals,
    handleAutofillFindings,
    handleAutofillChiefComplaint,
    handleAutofillAdditionalRemarks,
    shouldAutofill,
  ]
);

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
          // showRole={false}
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

  // const renderAllSections = () => {
  //   return (
  //     <div
  //       className={`ipd-generic-form-container ${
  //         !isEditable ? "ipd-assessments-readable-container" : ""
  //       }`}
  //       style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
  //     >
  //       {progressNotes.length > 0
  //         ? progressNotes.map((item) => {
  //             return renderSections(item);
  //           })
  //         : null}
  //     </div>
  //   );
  // };

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      progressNotes: IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, progressNotes: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const handleBackConfirmation = () => {
    if (!patientDetails?.details?.id && !patientDetails?.admissionId) {
      setIsBackModalOpen(false);
      navigate(`/ipd/patient-details`, {state: {...state, activeTab: "progress", isEditable: false}, replace: true});
      setOpen(false);
    }
    try {
      // dispatch(
      //   getProgressNotes({
      //     patientId: patientDetails?.details?.id,
      //     admissionId: patientDetails?.admissionId,
      //   })
      // ).then((res) => {
        // addDataToStore(res.payload.assessment);
        dispatch(resetProgressNotes());
        navigate(`/ipd/patient-details`, {state: {...state, activeTab: "progress", isEditable: false}, replace: true});
        setIsBackModalOpen(false);
        setOpen(false);
      // });
    } catch (err) {
      console.error(err, "error");
      setIsBackModalOpen(false);
      setOpen(false);
    }
  };

  return (
    <div className="afipd-assessments-form-container afipd-progress-notes-form-container">
      <Suspense fallback={<>Loading ...</>}>
        <div
          className={`ipd-assessments-form-container ${
            !isEditable ? "ipd-assessments-readable-container" : ""
          }`}
          style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
        >
          {open && modelData && (
            <LayoutWithMenu
              onCustomiseClick={() => setShowCustomisationDrawer(true)}
              key="progressNotes"
              title={"Progress Notes"}
              mainCta={{
                title: loading ? "Saving..." : "Save",
                handler: saveProgressNotes,
                disabled: loading,
              }}
              items={modelData}
              renderSection={renderSections}

              // onRequestClose={() => {
              //   dispatch(resetProgressNotes());
              //   navigate(-1);
              //   return setOpen(false);
              // }}
              onRequestClose={() => {
                setIsBackModalOpen(true);
              }}
              headerOffset={72}
              renderTopSection={renderFilledBySection}
              renderBottomSection={renderCustomModuleSection}
              showAutoFill={!!progressNotes?.length}
              autoFillTitle={
                progressNotes && progressNotes.length > 0
                  ? `Autofill From Prev. Progress Notes (${new Date(
                    progressNotes[progressNotes?.length - 1].createdAt
                    ).toLocaleDateString()}, ${new Date(
                      progressNotes[progressNotes?.length - 1].createdAt
                    ).toLocaleTimeString()})`
                  : "No previous progress notes available"
              }
              onAutoFill={handleAutofillAll}
            />
          )}
        </div>
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
        onConfirm={handleBackConfirmation}
      />
    </div>
  );
};

export default ProgressNotes;
