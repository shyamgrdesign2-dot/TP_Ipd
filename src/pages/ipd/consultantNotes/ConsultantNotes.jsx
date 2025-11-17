import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import {
  convertMedicationFormat,
  formatDateWithTime,
} from "../../../utils/utils";
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
import dayjs from "dayjs";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { updateCustomization } from "../../../redux/ipd/ipdSlice";
import { isMobile } from "react-device-detect";
import TabMedicationBox from "../../../components/tab_design/TabMedicationBox";
import TabInvestigationBox from "../../../components/tab_design/TabInvestigationBox";
import { MESSAGE_KEY } from "../../../utils/constants";
import visitEnd from "../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../assets/images/close-visit.svg";
import ProgressSummary from "./ProgressSummary";
import AgentAlex from "./AgentAlex";
import { getProgressNotes } from "../../../redux/ipd/progressNotesSlice";
import FullPageLoader from "../../vaccination/components/Loader";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isEmptyRichText } from "../../../components/PDFGenerator";
import MedicationBoxIpd from "../../../components/medicationBoxIpd";
import FluidBalanceSection from "../assessmentForm/FluidBalanceSection";
import CNExaminationSection from "../assessmentForm/CNExaminationSection";
dayjs.extend(customParseFormat);

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const DATE_FORMAT = "DD MMM YYYY";
const TIME_FORMAT = "hh:mm A";
const API_DATE_FORMAT = "YYYY-MM-DD";
const API_TIME_FORMAT = "HH:mm:ss";

const ConsultantNotes = (props) => {
  const { state } = useLocation();
  const { patient_data, patientDetails, fromTab } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;

  const { isEditable = true } = props;
  const dispatch = useDispatch();

  const {
    consultantNotes,
    currentConsultantNote,
    isUpdating,
    clinicalAssessmentPlan,
    vitals,
    additionalRemarks,
    fluidBalance,
    physicalExaminationBasicData
  } = useSelector((state) => state.consultantNotes);
  const { medicationData } = useSelector((state) => state.prescription);
  const { customization = {} } = useSelector((state) => state.ipd);
  const { profile } = useSelector((state) => state.doctors);
  const { progressNotes, isFetched: isProgressNotesFetched } = useSelector(
    (state) => state.progressNotes
  );

  const { consultationNotes: consultantNotesCustomization = [] } =
    customization;

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [filledDate, setFilledDate] = useState(dayjs());
  const [filledAtTime, setFilledAtTime] = useState(dayjs());
  const [investigationData, setInvestigationData] = useState([]);
  const [shouldAutofill, setShouldAutofill] = useState(false);
  const [showAgentAlex, setShowAgentAlex] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");

  // Load filledDate and filledAtTime from current consultant note
  useEffect(() => {
    if (currentConsultantNote && currentConsultantNote.consultationNotes) {
      if (currentConsultantNote.consultationNotes.date) {
        setFilledDate(dayjs(currentConsultantNote.consultationNotes.date));
      }

      if (currentConsultantNote.consultationNotes.time) {
        setFilledAtTime(
          dayjs(currentConsultantNote.consultationNotes.time, API_TIME_FORMAT)
        );
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

  useEffect(() => {
    if (patientId && admissionId) {
      if (!currentConsultantNote?._id) dispatch(clearMedicationData());
      dispatch(getConsultantNotes({ patientId, admissionId }));
    }
  }, [patientId, dispatch, admissionId]);

  useEffect(() => {
    if (!isProgressNotesFetched && patientId && admissionId) {
      dispatch(getProgressNotes({ patientId, admissionId }));
    }
  }, [dispatch, isProgressNotesFetched, patientId, admissionId]);

  const isDataPresent = useMemo(() => {
    return (
      !isEmptyRichText(clinicalAssessmentPlan) ||
      Object.values(vitals)?.some((item) => !!item) ||
      medicationData?.length > 0 ||
      investigationData?.length > 0 ||
      !isEmptyRichText(additionalRemarks)
    );
  }, [
    clinicalAssessmentPlan,
    vitals,
    medicationData,
    investigationData,
    additionalRemarks,
  ]);

  // Save consultant notes
  const saveConsultantNotes = async () => {
    try {
      const consultantNotesData = {
        clinicalAssessmentPlan: clinicalAssessmentPlan || [],
        vitals: vitals || {},
        currentMedication: convertMedicationFormat(medicationData),
        examination: Object.entries(physicalExaminationBasicData || {}).reduce(
          (acc, [key, value]) => {
            acc[key] = {
              title: value?.title || "",
              notes: value?.notes || [],
              value: value?.value || null,
            };
            return acc;
          },
          {}
        ),
        fluidBalance: fluidBalance || {},
        medication: medicationData,
        labInvestigation:
          investigationData?.map((e) => ({
            name: e.investigation_name,
            notes: e.note,
          })) || [],
        additionalRemarks: additionalRemarks || [],
        date: filledDate ? dayjs(filledDate).format(API_DATE_FORMAT) : "",
        time: filledAtTime ? dayjs(filledAtTime).format(API_TIME_FORMAT) : "",
      };

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
              <img src={visitEnd} className="me-3" alt="Visit End" />
              <div>
                <div className="title-common text-start fontroboto">
                  Consultant Notes Saved Successfully!
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
        await dispatch(resetConsultantNotes());
      } else {
        console.error("Failed to update consultant notes");
      }

      navigate(`/ipd/patient-details`, {
        replace: true,
        state: {
          patient_data,
          patientDetails,
          isEditable: false,
          activeTab: "consultantNotes",
          fromTab
        },
      });
    } catch (error) {
      console.error("Error saving consultant notes:", error);
    }
  };

  const latestNote = consultantNotes[0];

  const handleAutofillVitals = useCallback(() => {
    if (latestNote?.consultationNotes?.vitals) {
      dispatch(setVitals(latestNote?.consultationNotes?.vitals));
    }
  }, [latestNote, dispatch]);

  const handleAutofillMedication = useCallback(() => {
    if (latestNote?.consultationNotes?.medication) {
      dispatch(setMedicationData(latestNote?.consultationNotes?.medication));
    }
  }, [latestNote, dispatch]);

  const handleAutofillLabInvestigation = useCallback(() => {
    if (latestNote?.consultationNotes?.labInvestigation) {
      setInvestigationData(
        latestNote?.consultationNotes?.labInvestigation?.map((e) => ({
          investigation_name: e.name,
          note: e.notes,
        }))
      );
    }
  }, [latestNote, dispatch]);

  const handleAutofillAll = () => {
    setShouldAutofill(true);
    if (latestNote?.consultationNotes) {
      handleAutofillMedication();
      handleAutofillLabInvestigation();
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
              patientDetails={patientDetails}
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
        case "examinations":
          return (
            <CNExaminationSection
              isConsultantNotes={true}
              {...props}
              sectionData={data}
              patientDetails={patientDetails}
            />
          );
        case "fluidBalance":
          return <FluidBalanceSection {...props} sectionData={data} />;
        case "medication":
          return (
            <div className="ipdaf-box-container">
              {isMobile ? (
                <MedicationBoxIpd isEditable={isEditable} />
              ) : (
                <MedicationsBox
                  isEditable={isEditable}
                  medicationData={medicationData}
                  isIpd={true}
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
              patientDetails={patientDetails}
            />
          );
        default:
          return null;
      }
    },
    [
      props,
      shouldAutofill,
      handleAutofillVitals,
      handleAutofillLabInvestigation,
      isEditable,
      medicationData,
      investigationData,
      dispatch,
    ]
  );

  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);
  };

  const renderFilledBySection = () => {
    return (
      <div style={{ margin: "16px 24px 0" }}>
        <FilledByCard
          filledBy={profile?.um_name}
          role="Doctor"
          selectedDate={filledDate ? dayjs(filledDate, DATE_FORMAT) : ""}
          selectedTime={dayjs(filledAtTime, TIME_FORMAT)}
          dateFormat={DATE_FORMAT}
          timeFormat={TIME_FORMAT}
          selectedTimePeriod={selectedTimePeriod}
          timePeriodOptions={[
            { label: "Morning", value: "Morning" },
            { label: "Afternoon", value: "Afternoon" },
            { label: "Evening", value: "Evening" },
            { label: "Night", value: "Night" },
          ]}
          onDateChange={(date) => setFilledDate(date)}
          onTimeChange={(time) => {
            setFilledAtTime(time);
          }}
          onTimePeriodChange={handleTimePeriodChange}
          editable
          showTimePeriod={false}
        />
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
    setShowAgentAlex(true);
  };

  const handleAgentAlexClose = () => {
    setShowAgentAlex(false);
  };

  const renderBottomSection = () => (
    <>
      {!showAgentAlex && progressNotes.length > 0 && (
        <div className="progress-summary-wrapper">
          <ProgressSummary onClick={handleProgressSummaryClick} />
        </div>
      )}
    </>
  );

  const autoFillTitle = useMemo(() => {
    return latestNote
      ? `Autofill From Prev. Consultant Notes (${dayjs(
          latestNote?.consultationNotes?.date
        ).format(DATE_FORMAT)}, ${dayjs(
          latestNote?.consultationNotes?.time,
          API_TIME_FORMAT
        ).format(TIME_FORMAT)})`
      : "";
  }, [latestNote]);

  return (
    <div className="afipd-assessments-form-container">
      <Suspense
        fallback={
          <>
            <FullPageLoader />
          </>
        }
      >
        <div className={`ipd-assessments-form-container `}>
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
              renderBottomSection={renderBottomSection}
              showAutoFill={!!consultantNotes?.length}
              autoFillTitle={autoFillTitle}
              onAutoFill={handleAutofillAll}
              mainCta={{
                title: isUpdating ? "Saving..." : "Save",
                handler: saveConsultantNotes,
                disabled: isUpdating || !isDataPresent,
              }}
              isAuxPanelOpen={showAgentAlex}
              auxPanel={<AgentAlex onClose={handleAgentAlexClose} />}
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
    </div>
  );
};

export default React.memo(ConsultantNotes);
