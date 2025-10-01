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

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

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
  const otNotesState = useSelector((state) => state.otNotes);
  const { customModules } = useSelector((state) => state.customModules);
  const dischargeSummaryState = useSelector((state) => state.dischargeSummary);
  const { dischargeSummary = [] } = customization;
  const [modelData, setModelData] = useState(
    dischargeSummary.length > 0
      ? dischargeSummary
      : IPD.DEFAULT_DISCHARGE_SUMMARY_FORM_STRUCTURE
  );

  useEffect(() => {
    if (dischargeSummary.length > 0) {
      setModelData(dischargeSummary);
    }
  }, [dischargeSummary]);

  //   useEffect(() => {
  //     if (isNew) {
  //       dispatch(setCurrentOtNoteId(null));
  //     }
  //   }, [isNew]);

  useEffect(() => {
    dispatch(getCustomization());

    // Only fetch OT Notes data if we have the required patient details
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getDischargeSummaryData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      );
    }
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
                return <PhysicalExamination {...props} sectionData={data} />;
            case "functionalAssessment":
                return <FunctionalAssessment {...props} sectionData={data} />;
            case "courseInHospital":
                return <CourseInHospital {...props} sectionData={data} />;
            case "otNotes":
                return <OtNotes {...props} sectionData={data} />;
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
            className={`ipd-generic-form-container ${
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
                showAutoFill={showAutoFillLocal && isNew}
                autoFillTitle={autoFillTitleLocal}
                onAutoFill={() => {
                  // setIsLoading(true);
                  // otNotesData?.otNotesData[otNotesData?.otNotesData?.length - 1]?._id && dispatch(setSingleOtNotesData({_id: otNotesData?.otNotesData[otNotesData?.otNotesData?.length - 1]?._id})).then(() => {
                  //   console.log('INTEL ==> DONE')
                  // })
                  // setTimeout(() => {
                  //   setIsLoading(false)
                  // }, 100)
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
    </div>
  );
};

export default DischargeSummary;
