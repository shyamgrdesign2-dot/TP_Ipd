import React, { useCallback, useContext, useEffect, useState } from "react";
import { Tooltip, Input, Button, message } from "antd";
import {
  PlusOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./CustomModule.scss";
import CustomModuleIcon from "../assets/images/custom-module.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  addModule as addModuleOPD,
  getModuleContents as getModuleContentsOPD,
  getModules as getModulesOPD,
} from "../redux/customModuleSlice";
import {
  addModule as addModuleIPD,
  getCustomModules as getCustomModulesIPD,
  getModuleContents as getModuleContentsIPD,
} from "../redux/ipd/customModuleSlice";
import CashManagerContext from "../context/CashManagerContext";
import { MESSAGE_KEY } from "../utils/constants";
import visitEnd from "../assets/images/end-visit.svg";
import imgCloseVisit from "../assets/images/close-visit.svg";
import { customizedPad } from "../redux/doctorsSlice";
import { savePrintsettings } from "../redux/doctorsSlice";
import { extractModulesFromResponse } from "../utils/customModuleHelpers";

const AddCustomModule = ({
  form,
  setCustomModuleContents: setCustomModuleContentsProp,
  admissionId,
  patientId,
  onCustomModuleAdded,
  limit = 20,
  admittingDoctorId,
  isIPDMode = false,
  activeCount = 0,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const dispatch = useDispatch();

  const { customModules: opdCustomModules } = useSelector(
    (state) => state.customModules
  );
  const { customModules: ipdCustomModules } = useSelector(
    (state) => state.ipdCustomModules
  );
  const customModules = isIPDMode ? ipdCustomModules : opdCustomModules;

  const {
    userId,
    customizedPadRightList,
    customizedPadLeftList,
    defaultPrintSettings,
  } = useSelector((state) => state.doctors);

  const context = useContext(CashManagerContext);
  const setCustomModuleContents =
    setCustomModuleContentsProp || context?.setCustomModuleContents;
  const tcmId = admissionId || patientId || context?.tcmId;
  const activeModules = customModules.filter((cm) => !cm.isDeleted);
  const activeModuleCount = activeCount ?? activeModules.length;

  const getCustomModuleContents = useCallback(async () => {
    if (isIPDMode) {
      if (!tcmId || !form) return;
      const action = await dispatch(getModuleContentsIPD({ tcmId, form }));
      if (action.meta.requestStatus === "fulfilled") {
        const contents = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.moduleContents || [];
        if (setCustomModuleContents) {
          setCustomModuleContents(
            contents.filter(
              (e) => !!customModules.find((cm) => cm.module_id === e.module_id)
            )
          );
        }
      }
    } else {
      const action = await dispatch(getModuleContentsOPD(tcmId));
      if (action.meta.requestStatus === "fulfilled") {
        if (setCustomModuleContents) {
          setCustomModuleContents(
            action.payload.moduleContents?.filter(
              (e) => !!customModules.find((cm) => cm.module_id === e.module_id)
            )
          );
        }
      }
    }
  }, [
    tcmId,
    form,
    isIPDMode,
    customModules,
    setCustomModuleContents,
    dispatch,
  ]);

  useEffect(() => {
    if (tcmId && !isIPDMode) {
      getCustomModuleContents();
    }
  }, [tcmId, isIPDMode, getCustomModuleContents]);

  const syncPrintSettings = useCallback(() => {
    if (isIPDMode) return;
    const customModuleMap = new Map(
      customModules.map((module) => [module.module_id, module.name])
    );

    let updateFlag = false;

    const updatedCaseOptions = [];

    // Process existing case_option
    (defaultPrintSettings?.prescription?.case_option || []).forEach(
      (option) => {
        if (option.is_custom_module) {
          const newName = customModuleMap.get(option.id);

          if (newName) {
            // Update name if it's different
            if (option.title !== newName) {
              updatedCaseOptions.push({
                ...option,
                title: newName, // Create a new object with updated title
              });
              updateFlag = true;
            } else {
              updatedCaseOptions.push(option); // Retain unchanged custom module
            }
            customModuleMap.delete(option.id); // Remove from map to avoid duplicate addition
          } else {
            updateFlag = true; // Custom module no longer exists, so it will be removed
          }
        } else {
          // Retain non-custom modules
          updatedCaseOptions.push(option);
        }
      }
    );

    // Add remaining custom modules from customModuleMap
    customModuleMap.forEach((name, moduleId) => {
      updatedCaseOptions.push({
        id: moduleId,
        title: name,
        format: "inline",
        enable: "Y",
        custom_status: "Y",
        is_custom_module: true,
      });
      updateFlag = true;
    });

    if (updateFlag) {
      const rxPrescription = {
        ...defaultPrintSettings?.prescription,
        case_option: updatedCaseOptions,
      };

      const sendData = {
        ...defaultPrintSettings,
        prescription: JSON.stringify(rxPrescription),
        header_footer: JSON.stringify(defaultPrintSettings?.header_footer),
        page_format: JSON.stringify(defaultPrintSettings?.page_format),
      };

      dispatch(savePrintsettings(sendData));
    }
  }, [customModules, defaultPrintSettings, dispatch, isIPDMode]);

  const syncRightRxPad = useCallback(() => {
    if (isIPDMode) return;
    const customModuleMap = new Map(
      customModules.map((module) => [module.module_id, module.name])
    );

    let updateFlag = false;

    const updatedRightRxPad = [];

    (customizedPadRightList || []).forEach((option) => {
      if (option.is_custom_module) {
        const newName = customModuleMap.get(option.tmdpm_id);

        if (newName) {
          if (option.tmdpm_name !== newName) {
            updatedRightRxPad.push({
              ...option,
              tmdpm_name: newName,
              tmdpm_short_name: newName,
            });
            updateFlag = true;
          } else {
            updatedRightRxPad.push(option);
          }
          customModuleMap.delete(option.tmdpm_id);
        } else {
          updateFlag = true;
        }
      } else {
        updatedRightRxPad.push(option);
      }
    });

    customModuleMap.forEach((name, moduleId) => {
      updatedRightRxPad.push({
        tmdpm_id: moduleId,
        tmdpm_name: name,
        tmdpm_short_name: name,
        tmdpm_type: "R",
        tmdpm_status: 0,
        is_custom_module: true,
      });
      updateFlag = true;
    });

    if (updateFlag) {
      const sendData = {
        data: {
          default: false,
          reset: false,
          left: customizedPadLeftList,
          right: updatedRightRxPad,
        },
      };

      dispatch(customizedPad(sendData));
    }
  }, [
    customModules,
    customizedPadLeftList,
    customizedPadRightList,
    dispatch,
    isIPDMode,
  ]);

  useEffect(() => {
    if (customModules?.length && !isIPDMode) {
      syncPrintSettings();
      syncRightRxPad();
    }
  }, [customModules, isIPDMode, syncPrintSettings, syncRightRxPad]);

  useEffect(() => {
    if (isIPDMode) {
      if (admittingDoctorId && form) {
        dispatch(
          getCustomModulesIPD({ userId: admittingDoctorId, form })
        ).catch((error) => message.error(error || "Failed to fetch modules."));
      }
    } else {
      dispatch(getModulesOPD(userId)).catch((error) =>
        message.error(error || "Failed to fetch modules.")
      );
    }
  }, [userId, form, isIPDMode, dispatch, admittingDoctorId]);

  const handleAddModule = async () => {
    if (!newModuleName.trim()) {
      message.error("Module name cannot be empty.");
      return;
    }
    if (activeModules.some((cm) => cm.name === newModuleName.trim())) {
      message.error("Module name already exists.");
      return;
    }
    if (activeModules.length >= limit) {
      message.error(`You can only add up to ${limit} custom modules.`);
      return;
    }

    try {
      const previousModuleIds = new Set(
        customModules.map((cm) => cm.module_id)
      );
      const modulesPayload = [
        ...customModules,
        {
          name: newModuleName,
          templates: [],
        },
      ];

      let action;
      if (isIPDMode) {
        action = await dispatch(
          addModuleIPD({
            data: {
              userId: admittingDoctorId,
              modules: modulesPayload,
              form,
            },
          })
        );
      } else {
        action = await dispatch(
          addModuleOPD({
            userId,
            modules: modulesPayload,
          })
        );
      }

      if (action.meta.requestStatus === "fulfilled") {
        const updatedModules = extractModulesFromResponse(action.payload);

        if (isIPDMode) {
          if (typeof onCustomModuleAdded === "function") {
            const addedModule = updatedModules.find(
              (module) =>
                module.module_id && !previousModuleIds.has(module.module_id)
            );

            if (addedModule) {
              onCustomModuleAdded(addedModule);
            }
          }
        }

        setShowInput(false);
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" alt="Success" />
              <div>
                <div className="title-common text-start fontroboto">{`${newModuleName} module has been created successfully.`}</div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
                alt="Close"
              />
            </div>
          ),
          duration: 3,
        });
        setNewModuleName("");
      }
    } catch (error) {
      message.error(error || "Failed to add module.");
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setNewModuleName("");
  };

  return (
    <div className="add-custom-module-cta-container">
      {showInput && (
        <div className="custom-module-input-container">
          <img className="me-2" src={CustomModuleIcon} alt="Custom Module" />
          <Input
            placeholder="Enter custom module name"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            className="custom-module-input"
            {...(isIPDMode && {
              maxLength: 40,
              suffix: (
                <div className="custom-module-input-suffix">
                  {newModuleName?.length}/40
                </div>
              ),
            })}
          />
          <>
            <CheckOutlined
              className="input-action-icon tick-icon"
              onClick={handleAddModule}
            />
            <CloseOutlined
              className="input-action-icon cross-icon"
              onClick={handleCancel}
            />
          </>
        </div>
      )}

      {/* Add Custom Module CTA */}
      <div className="cta-container" onClick={() => setShowInput(true)}>
        <Button
          type="link"
          icon={<PlusOutlined />}
          className="add-custom-module-link"
          disabled={activeModuleCount >= limit}
        >
          Add Custom Module
        </Button>
        <div className="module-info">
          <span className="module-count">{`${activeModuleCount}/${limit} modules added`}</span>
          <Tooltip
            title={`You can create up to ${limit} custom modules. If you’ve reached the limit, delete an existing custom module to add a new one.`}
            placement="top"
            className="info-tooltip"
          >
            <InfoCircleOutlined className="info-icon" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default AddCustomModule;
