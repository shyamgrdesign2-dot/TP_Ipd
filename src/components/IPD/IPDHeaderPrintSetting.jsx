import React, { useState, useCallback } from "react";
import { Navbar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { errorMessage } from "../../utils/utils";

import {
  saveDraftSettings,
  revertDraftSettings,
  setDraftSettings,
  getDefaultPrintsettings,
  updatePrintSettings,
} from "../../redux/ipd/printSettingsSlice";

import CommonModal from "../../common/CommonModal";
import alertIcon from "../../assets/images/alertIcon.svg";
import useIpdCustomModules from "../../hooks/useIpdCustomModules";
import { IPD } from "../../utils/locale";

const PRINT_SETTINGS_MODULE_CUSTOM_MODULE_TYPE_MAP = {
  consultationNotes: IPD.CUSTOM_MODULE_FORM_TYPES.consultantNotes,
  progressNotes: IPD.CUSTOM_MODULE_FORM_TYPES.progressNotes,
  otNotes: IPD.CUSTOM_MODULE_FORM_TYPES.otNotes,
  dischargeSummary: IPD.CUSTOM_MODULE_FORM_TYPES.dischargeSummary,
  assessments: IPD.CUSTOM_MODULE_FORM_TYPES.assessments,
  crossReferral: IPD.CUSTOM_MODULE_FORM_TYPES.crossReferral,
};

function IPDHeaderPrintSetting({ moduleType, moduleTitle, returnPath }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { state } = useLocation();
  const { patientDetails = {} } = state || {};

  const { draftSettings, printSettings } = useSelector(
    (state) => state.printSettings
  );

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [flag, setFlag] = useState(0);
  const { defaultCustomModulesForPrintSettings } = useIpdCustomModules({
    formType: PRINT_SETTINGS_MODULE_CUSTOM_MODULE_TYPE_MAP[moduleType],
  });

  const onDefaultPrintsettings = async () => {
    setFlag(2);
    showHideBackModal();
  };

  const onSavePrintSettingsClick = async () => {
    if (!draftSettings || !moduleType) {
      errorMessage("No settings to save");
      return;
    }

    try {
      const {
        _id,
        doctorId,
        hospitalId,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        message,
        ...settingsPayload
      } = draftSettings;

      const action = await dispatch(
        updatePrintSettings({
          printSettings: { ...settingsPayload },
          doctorId: patientDetails?.doctor?.id,
        })
      );

      if (action.meta.requestStatus === "fulfilled") {
        dispatch(saveDraftSettings({ moduleType }));
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
      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate(-1);
      }
      return;
    }

    let update_json = { ...draftSettings };
    delete update_json["qrcode"];

    const hasChanges = true;

    if (!hasChanges) {
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
      dispatch(revertDraftSettings({ moduleType }));

      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate(-1);
      }
    } else if (flag === 3) {
      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate(-1);
      }
    } else {
      try {
        const action = await dispatch(getDefaultPrintsettings());

        if (action.meta.requestStatus === "fulfilled") {
          const defaultSettings = action.payload;
          if (defaultSettings && defaultSettings[moduleType]) {
            const defaultFormatStyleWithCustomModules = [
              ...defaultSettings[moduleType].formatStyle,
              ...defaultCustomModulesForPrintSettings,
            ];
            dispatch(
              setDraftSettings({
                moduleType,
                settings: {
                  ...defaultSettings[moduleType],
                  formatStyle: defaultFormatStyleWithCustomModules,
                },
              })
            );

            await dispatch(saveDraftSettings({ moduleType }));

            const { _id, doctorId, hospitalId, ...settingsPayload } =
              printSettings;

            await dispatch(
              updatePrintSettings({
                printSettings: {
                  ...settingsPayload,
                  [moduleType]: {
                    ...defaultSettings[moduleType],
                    formatStyle: defaultFormatStyleWithCustomModules,
                  },
                },
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
          >
            Save
          </Button>
        </div>
      </div>
    </Navbar>
  );
}

export default React.memo(IPDHeaderPrintSetting);
