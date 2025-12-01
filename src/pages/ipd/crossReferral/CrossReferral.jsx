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
import useIpdCustomModules from "../../../hooks/useIpdCustomModules";
import {
  resetCrossReferralForm,
  updateCrossReferralData,
} from "../../../redux/ipd/crossReferralSlice.js";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";
import {
  getCrossReferralData,
  setSingleCrossReferralData,
} from "../../../redux/ipd/crossReferralSlice.js";
import ReferralInformation from "./ReferralInformation.jsx";
import dayjs from "dayjs";
import FullPageLoader from "../../vaccination/components/Loader.js";
import { errorMessage } from "../../../utils/utils.js";
import { useSelector } from "react-redux";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const CrossReferral = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    patient_data,
    patientDetails,
    isEditable = true,
    fromTab,
  } = state || {};
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [filledDate, setFilledDate] = useState(new Date());
  const [filledAtTime, setFilledAtTime] = useState(new Date());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");

  const customModuleFormType = IPD.CUSTOM_MODULE_FORM_TYPES.crossReferral;
  const { customization = {} } = useSelector((state) => state.ipd);
  const crossReferralState = useSelector((state) => state.crossReferral);
  const crossReferralData = useSelector((state) => state.crossReferral);
  const { profile } = useSelector((state) => state.doctors);
  const { crossReferral = [] } = customization;
  const [modelData, setModelData] = useState(
    crossReferral.length > 0
      ? crossReferral
      : IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE
  );

  useEffect(() => {
    if (crossReferral.length > 0) {
      setModelData(crossReferral);
    }
  }, [crossReferral]);

  const {
    customModuleContents,
    hydrateFromSavedModules,
    serializeCustomModules,
    defaultCustomModulesForCustomization,
  } = useIpdCustomModules({
    formType: customModuleFormType,
    customizationKey: customModuleFormType,
    modelData,
    setModelData,
    admissionId: patientDetails?.admissionId,
    patientId: patientDetails?.details?.id,
    patientData: patient_data,
    isEditable,
  });

  useEffect(() => {
    dispatch(getCustomization({ doctorId: patientDetails?.doctor?.id }));

    // Only fetch Cross Referral data if we have the required patient details
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getCrossReferralData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      ).then((res) => {
        if (crossReferralData.currentCrossReferralId) {
          dispatch(
            setSingleCrossReferralData({
              _id: crossReferralData.currentCrossReferralId,
            })
          );
        }
      });
    }
  }, [
    crossReferralData.currentCrossReferralId,
    dispatch,
    patientDetails?.admissionId,
    patientDetails?.details?.id,
  ]);

  useEffect(() => {
    hydrateFromSavedModules(
      crossReferralState?.crossReferralFormDetails?.customModules || []
    );
  }, [
    crossReferralState?.crossReferralFormDetails?.customModules,
    hydrateFromSavedModules,
  ]);

  const handleDefaultClick = () => {
    const defaultModules = [
      ...IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE,
      ...defaultCustomModulesForCustomization,
    ];
    setModelData(defaultModules);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      crossReferral: defaultModules,
    };
    dispatch(
      updateCustomization({
        doctorId: patientDetails?.doctor?.id,
        customization: newData,
      })
    );
  };

  const renderSections = (data) => {
    // Don't render if data is undefined or doesn't have required properties
    if (!data) {
      return null;
    }

    return (
      <div className="ipd-otnotes-editable-section-container">
        {(() => {
          switch (data.id) {
            case "referralInformation":
              return <ReferralInformation {...props} sectionData={data} />;
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, crossReferral: [...modelData] };
    dispatch(
      updateCustomization({
        doctorId: patientDetails?.doctor?.id,
        customization: newData,
      })
    );
  };

  const onAddReferralClick = async () => {
    const reqData = {
      ...crossReferralState.crossReferralFormDetails,
      customModules: serializeCustomModules(customModuleContents),
    };

    const response = await dispatch(
      updateCrossReferralData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: crossReferralState?.currentCrossReferralId || null,
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
        dispatch(
          getCrossReferralData({
            patientId: patientDetails?.details?.id,
            admissionId: patientDetails?.admissionId,
            _id: crossReferralState.currentCrossReferralId,
          })
        );
        message.success("Cross Referral Added Successfully");
        navigate("/ipd/patient-details", {
          state: {
            isEditable: false,
            patient_data: patient_data,
            patientDetails,
            activeTab: "crossReferral",
            fromTab,
          },
          replace: true,
        });
      } catch (err) {
        errorMessage(response?.error);
      }
    } else {
      errorMessage(response?.error);
    }
  };

  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);
  };
  const renderHeaderSection = () => {
    return (
      <div className="ipd-filled-by-card-container">
        {crossReferralState.currentCrossReferralFilledByDetails
          ?.createdByName ? (
          <FilledByCard
            showBeing={
              !crossReferralState.currentCrossReferralFilledByDetails?.createdAt
            }
            filledBy={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdByName || ""
            }
            role={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdByRole || ""
            }
            showFilledOnDate={true}
            selectedDate={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdAt || ""
            }
          />
        ) : (
          <FilledByCard
            filledBy={profile?.um_name}
            role="Doctor"
            selectedDate={dayjs(filledDate)}
            selectedTime={dayjs(filledAtTime)}
            // showRole={false}
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
        {crossReferral.length > 0
          ? crossReferral.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  const onMenuItemClick = (activeId) => {
    console.log("INTEL ==> activeId", activeId);
  };

  // Early return if essential data is missing to prevent undefined errors
  if (!patientDetails && isEditable) {
    return (
      <>
        <FullPageLoader />
      </>
    );
  }

  return (
    <div
      className={`afipd-otnotes-form-container ${
        isEditable ? "" : "ipd-otnotes-form-container-readonly"
      }`}
    >
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
            className={`ipd-generic-form-container cross-referral ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
          >
            {open && modelData && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="crossReferral"
                title={"Cross Referral"}
                mainCta={{
                  handler: onAddReferralClick,
                  title: "Add Referral",
                }}
                items={[modelData[0]]}
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
                customModel={[modelData?.[0]]}
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
              activeTab: "crossReferral",
              isEditable: false,
              fromTab,
            },
            replace: true,
          });
          dispatch(resetCrossReferralForm());
          setOpen(false);
        }}
      />
    </div>
  );
};

export default CrossReferral;
