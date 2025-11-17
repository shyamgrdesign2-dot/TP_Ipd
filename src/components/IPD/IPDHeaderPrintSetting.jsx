import React, { useState, useCallback } from "react";
import { Navbar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Popover } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { errorMessage, getClinicName } from "../../utils/utils";
import VideoModal from "../../common/VideoModal";

import {
  saveDraftSettings,
  revertDraftSettings,
  setDraftSettings,
  getDefaultPrintsettings,
  updatePrintSettings,
} from "../../redux/ipd/printSettingsSlice";

import CommonModal from "../../common/CommonModal";
import alertIcon from "../../assets/images/alertIcon.svg";
import tutorial from "../../assets/images/tutorial-icon.svg";
import playIcons from "../../assets/images/tube-icon.svg";

function IPDHeaderPrintSetting({ moduleType, moduleTitle, returnPath }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [popOverVideo, setPopOverVideo] = useState(false);
  const [videoLink, setVideoLink] = useState(null);

  //PopOverVideo function
  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  const { state } = useLocation();
  const { patientDetails = {} } = state || {};

  const { loading, videoList, profile } = useSelector((state) => state.doctors);
  const { draftSettings, printSettings } = useSelector(
    (state) => state.printSettings
  );

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [flag, setFlag] = useState(0);

  const onDefaultPrintsettings = async () => {
    setFlag(2);
    showHideBackModal();
  };

  //Video Component
  const VIDEO_CONTENT = useCallback(() => {
    return (
      <>
        <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
          <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
            <div className="title-common lh-base">Video Tutorial</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideVideoListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 550px)" }}
          >
            {videoList
              ?.filter((e) => e.category_id === 7)[0]
              ?.video?.map((item1, i1) => {
                return (
                  <div
                    key={i1}
                    className={`d-flex ${
                      i1 !==
                        videoList?.filter((e) => e.category_id === 7)[0]?.video
                          ?.length -
                          1 && "pb-3 mb-15 border-bottom"
                    }`}
                  >
                    <div className="tutorial-play me-14">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoLink(item1);
                          const clinic_name = getClinicName(
                            profile?.hospital_data
                          );
                          window.Moengage.track_event("TP_Tutorial_Viewed", {
                            clinic_name,
                            tutorial_type: videoList[0]?.category,
                          });
                        }}
                      >
                        <img src={playIcons} alt="play" />
                      </button>
                      <span className="tutorial-thumb">
                        <img src={item1.thumbnail} alt="thumbnail" />
                      </span>
                    </div>
                    <div>
                      <h3 className="title-common text-welcome">
                        {item1?.tmv_title}
                      </h3>
                      <div className="fs-12 fontroboto fw-normal text-main">
                        {item1?.tmv_description}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }, [popOverVideo]);

  const onSavePrintSettingsClick = async () => {
    if (!draftSettings || !moduleType) {
      errorMessage("No settings to save");
      return;
    }

    try {
      // Remove server-managed fields before updating
      const { _id, doctorId, hospitalId, ...settingsPayload } = draftSettings;

      // Call update print settings API with the module settings
      const action = await dispatch(
        updatePrintSettings({
          ...settingsPayload,
          doctorId: patientDetails?.doctor?.id,
        })
      );

      if (action.meta.requestStatus === "fulfilled") {
        // Save draft settings to main settings (persist changes)
        dispatch(saveDraftSettings({ moduleType }));
        // Navigate back to return path if provided, otherwise go back in history
        if (returnPath) {
          navigate(returnPath);
        } else {
          navigate(-1);
        }
      } else {
        showHideBackModal();
        errorMessage("Failed to save print settings");
      }
    } catch (error) {
      errorMessage("Failed to save print settings");
    }
  };

  const checkDataFillOrNot = () => {
    if (!draftSettings) {
      // Navigate back to return path if provided, otherwise go back in history
      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate(-1);
      }
      return;
    }

    let update_json = { ...draftSettings };
    delete update_json["qrcode"];

    // For now, assume settings have changed (we can add proper comparison later)
    const hasChanges = true;

    if (!hasChanges) {
      // Navigate back to return path if provided, otherwise go back in history
      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate(-1);
      }
    } else {
      setFlag(1);
      showHideBackModal();
    }
  };

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  const onYesLeaveClick = async () => {
    if (flag === 1) {
      // Revert draft settings back to saved settings before leaving
      dispatch(revertDraftSettings({ moduleType }));

      // Navigate back to return path if provided, otherwise go back in history
      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate(-1);
      }
    } else if (flag === 3) {
      // Navigate back to return path if provided, otherwise go back in history
      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate(-1);
      }
    } else {
      // Handle default settings reset
      try {
        const action = await dispatch(getDefaultPrintsettings());

        if (action.meta.requestStatus === "fulfilled") {
          const defaultSettings = action.payload;

          // Update both draft and main settings with the default settings for this module
          if (defaultSettings && defaultSettings[moduleType]) {
            // Update draft settings
            dispatch(
              setDraftSettings({
                moduleType,
                settings: defaultSettings[moduleType],
              })
            );

            // Save draft to main settings to persist the defaults
            dispatch(saveDraftSettings({ moduleType }));

            // Remove server-managed fields before updating
            const { _id, doctorId, hospitalId, ...settingsPayload } =
              printSettings;

            // Call update print settings API with the module settings
            await dispatch(
              updatePrintSettings({
                ...settingsPayload,
                [moduleType]: defaultSettings[moduleType],
                doctorId: patientDetails?.doctor?.id,
              })
            );
          } else {
            console.warn("No default settings found for module:", moduleType);
          }
        }
      } catch (error) {
        console.error("Error resetting to default settings:", error);
        errorMessage("Failed to load default settings. Please try again.");
      }
      showHideBackModal();
    }
  };

  return (
    <Navbar className="justify-content-between headerprescription p-0">
      <div className="align-items-center d-flex w-100 h-100 justify-content-between">
        <div className="align-items-center d-flex h-100 w-100">
          <div className="border-end h-100 text-center me-2">
            <div
              onClick={checkDataFillOrNot}
              className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
            >
              <i className="icon-right"></i>
            </div>
            <CommonModal
              isModalOpen={isBackModalOpen}
              onCancel={showHideBackModal}
              modalWidth={500}
              title={
                flag === 3 ? "Save Print Settings" : "You may lose your data"
              }
              modalBody={
                <>
                  <div className="alert-warning rounded-10px p-2 patient-details">
                    <div className="d-flex align-items-center">
                      <img className="me-3" src={alertIcon} alt="warning" />
                      <span>
                        {flag === 3 ? (
                          `Do you want to set these changes as default for all future ${
                            moduleTitle || "documents"
                          }?`
                        ) : (
                          <>
                            Are you sure you want to leave? <br />
                            You will permanently lose your data.
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="d-flex align-items-center mt-2 justify-content-end">
                      <div
                        onClick={onYesLeaveClick}
                        className="me-4 text-decoration-underline btn p-0 text-main"
                      >
                        {flag == 1
                          ? "Yes Leave"
                          : flag === 3
                          ? "No, Apply on This Document Only"
                          : "Yes"}
                      </div>
                      <Button
                        onClick={
                          flag === 3
                            ? onSavePrintSettingsClick
                            : showHideBackModal
                        }
                        className="lh-lg btn btn-primary3 btn-41 px-4"
                      >
                        <span>
                          {flag == 1
                            ? "No, Stay"
                            : flag === 3
                            ? "Yes, Set as Default for All Documents"
                            : "No"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </>
              }
            />
          </div>
          <div className="title-common">
            Configure Print Setting ({moduleTitle || "Document"})
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-end w-100">
          <button
            className="btn btn-text me-14"
            onClick={onDefaultPrintsettings}
          >
            <span>Default Settings</span>
          </button>

          <Button
            type="button"
            className="btn-41 btn px-4 btn-primary3 me-4"
            onClick={() => {
              setFlag(3);
              showHideBackModal();
            }}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </div>
    </Navbar>
  );
}

export default React.memo(IPDHeaderPrintSetting);
