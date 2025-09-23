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
import SurgeryDetails from "./SurgeryDetails";
import SurgeryTeam from "./SurgeryTeam";
import OperativeNotes from "./OperativeNotes";
import IntraOperativeNotes from "./IntraOperativeNotes";
import PostOperativeNotes from "./PostOperativeNotes";
import { getOtNotesData, setSingleOtNotesData, updateOtNotesData } from "../../../redux/ipd/otNotesSlice.js";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const OtNotes = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data, patientDetails, isEditable = true } = state || {};

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { customization = {} } = useSelector((state) => state.ipd);
  const otNotesState = useSelector((state) => state.otNotes);
  const { customModules } = useSelector((state) => state.customModules);
  const otNotesData = useSelector((state) => state.otNotes);
  const { otNotes = [] } = customization;
  const [modelData, setModelData] = useState(
    // otNotes.length > 0 ? otNotes :
    IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE
  );

  // useEffect(() => {
  //   if (otNotes.length > 0) {
  //     setModelData(otNotes);
  //   }
  // }, [otNotes]);

  useEffect(() => {
    // fetch assessments form from api
    if (
      isEditable &&
      patientDetails?.details?.id &&
      patientDetails?.details?.admissionId &&
      Object.keys(otNotesData?.otNotesData || {}).length === 0 &&
      !otNotesState.currentOtNoteId
    ) {
    }
    dispatch(getCustomization());
    dispatch(
      getOtNotesData({
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
      })
    ).then(res => {
      dispatch(setSingleOtNotesData({_id: otNotesData.currentOtNoteId}))
    });
  }, []);

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      otNotes: IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const renderSections = (data) => {
    return (
      <div className="ipd-otnotes-editable-section-container">
        {(() => {
          switch (data?.id) {
            case "surgeryDetails":
              return <SurgeryDetails {...props} sectionData={data} />;
            case "surgeryTeam":
              return <SurgeryTeam {...props} sectionData={data} />;
            case "operativeNotes":
              return <OperativeNotes {...props} sectionData={data} />;
            case "intraOperativeNotes":
              return <IntraOperativeNotes {...props} sectionData={data} />;
            case "postOperativeNotes":
              return <PostOperativeNotes {...props} sectionData={data} />;
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, otNotes: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const onSaveOtNotesClick = () => {
    const reqData = {
      surgeryDetails: {
        ...otNotesState.surgeryDetails,
      },
      surgeryTeam: {
        ...otNotesState.surgeryTeam,
      },
      operativeNotes: Object.entries(otNotesState.operativeNotes || {}).reduce(
        (acc, [key, value]) => {
          acc[key] = value?.value || value;
          return acc;
        },
        {}
      ),
      intraOperativeNotes: {
        complication:
          otNotesState.intraOperativeNotes.complicationsSeverity?.value || [],
        specimensSent:
          otNotesState.intraOperativeNotes.specimensSent?.value || [],
        implants: otNotesState.intraOperativeNotes.implantsUsed?.value || [],
        estimatedBloodLoss:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits
              ?.estimatedBloodLoss,
            10
          ) || 0,
        swabCount:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits?.swabCount,
            10
          ) || 0,
        fluidCount:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits?.fluidCount,
            10
          ) || 0,
        sutureType:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits?.sutureType,
            10
          ) || 0,
      },
      postOperativeNotes: {
        postOpDestination:
          otNotesState.postOperativeNotes.postOpDestination?.value || "",
        additionalInstructions:
          otNotesState.postOperativeNotes.additionalInstructions?.value || [],
        ...Object.entries(otNotesState.postOperativeNotes || {}).reduce(
          (acc, [key, value]) => {
            const excludedKeys = [
              "postOpDestination",
              "additionalInstructions",
            ];
            if (!excludedKeys.includes(key)) {
              acc[key] = value?.value || value;
            }
            return acc;
          },
          {}
        ),
      },
      customModule: [], // TODO: INTEL - HANDLE CUSTOM MODULE
    };

    console.log('INTEL ==>req data', reqData)

    dispatch(
      updateOtNotesData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: otNotesState?.currentOtNoteId || null,
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
        getOtNotesData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
          _id: otNotesState.currentOtNoteId,
        })
      );
      navigate("/ipd/patient-details", {
        state: {
          isEditable: false,
          patient_data: patient_data,
          patientDetails,
          activeTab: "otNotes",
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
        {otNotesState.currentOtNoteFilledByDetails?.createdByName && <FilledByCard
          filledBy={otNotesState.currentOtNoteFilledByDetails?.createdByName || ""}
          role={otNotesState.currentOtNoteFilledByDetails?.createdByRole || ""}
          showFilledOnDate={true}
          selectedDate={otNotesState.currentOtNoteFilledByDetails?.createdAt || ""}
        />}
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
        style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
      >
        {otNotes.length > 0
          ? otNotes.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  const onMenuItemClick = (activeId) => {
    console.log("INTEL ==> activeId", activeId);
  };

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
                key="otNotes"
                title={"OT Notes"}
                mainCta={{
                  handler: onSaveOtNotesClick,
                  title: "Save",
                }}
                items={modelData}
                renderSection={renderSections}
                onRequestClose={() => {
                  navigate(-1);
                  return setOpen(false);
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
    </div>
  );
};

export default OtNotes;
