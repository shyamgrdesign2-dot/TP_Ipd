import React, { useCallback, useContext, useEffect, useState } from "react";
import { Tooltip, Input, Button, message } from "antd";
import {
  PlusOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "../CustomModule.scss";
import CustomModuleIcon from "../../assets/images/custom-module.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  addModule,
  getModuleContents,
  getModules,
} from "../../redux/customModuleSlice";
import { savePrintsettings } from "../../redux/doctorsSlice";
import CashManagerContext from "../../context/CashManagerContext";
import { customizedPad } from "../../redux/doctorsSlice";
import { MESSAGE_KEY } from "../../utils/constants";
import visitEnd from "../../assets/images/end-visit.svg";
import imgCloseVisit from "../../assets/images/close-visit.svg";

const TabAddCustomModule = () => {
  const [showInput, setShowInput] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const dispatch = useDispatch();
  const { customModules } = useSelector((state) => state.customModules);
  const {
    userId,
    customizedPadRightList,
    customizedPadLeftList,
    defaultPrintSettings,
  } = useSelector((state) => state.doctors);
  const { setCustomModuleContents, tcmId } = useContext(CashManagerContext);

  useEffect(() => {
    if (tcmId) {
      getCustomModuleContents();
    }
  }, [tcmId]);

  const getCustomModuleContents = useCallback(async () => {
    const action = await dispatch(getModuleContents(tcmId));
    if (action.meta.requestStatus === "fulfilled") {
      setCustomModuleContents(action.payload.moduleContents);
    }
  }, [tcmId]);

  useEffect(() => {
    dispatch(getModules(userId)).catch((error) =>
      message.error(error || "Failed to fetch modules.")
    );
  }, [userId]);

  const handleAddModule = async () => {
    if (!newModuleName.trim()) {
      message.error("Module name cannot be empty.");
      return;
    }
    if (customModules.length >= 5) {
      message.error("You can only add up to 5 custom modules.");
      return;
    }

    try {
      const action = await dispatch(
        addModule({
          userId,
          modules: [
            ...customModules,
            {
              name: newModuleName,
              templates: [],
            },
          ],
        })
      );
      if (action.meta.requestStatus === "fulfilled") {
        const newModule =
          action?.payload?.modules?.[action?.payload?.modules?.length - 1];
        dispatch(
          customizedPad({
            data: {
              default: false,
              reset: false,
              left: customizedPadLeftList,
              right: [
                ...customizedPadRightList,
                {
                  tmdpm_id: newModule.module_id,
                  tmdpm_name: newModule.name,
                  tmdpm_short_name: newModule.name,
                  tmdpm_type: "R",
                  tmdpm_status: 0,
                  is_custom_module: true,
                },
              ],
            },
          })
        );

        const rxNewModule = {
          id: newModule.module_id,
          title: newModule.name,
          format: "inline",
          enable: "Y",
          custom_status: "Y",
          is_custom_module: true,
        };

        const rxPrescription = {
          ...defaultPrintSettings?.prescription,
          case_option: [
            ...(defaultPrintSettings?.prescription?.case_option || []),
            rxNewModule,
          ],
        };

        const sendData = {
          ...defaultPrintSettings,
          prescription: JSON.stringify(rxPrescription),
          header_footer: JSON.stringify(defaultPrintSettings?.header_footer),
          page_format: JSON.stringify(defaultPrintSettings?.page_format),
        };

        dispatch(savePrintsettings(sendData));

        setShowInput(false);
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" />
              <div>
                <div className="title-common text-start fontroboto">{`${newModuleName} module has been created successfully.`}</div>
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
          disabled={customModules.length >= 5}
        >
          Add Custom Module
        </Button>
        <div className="module-info">
          <span className="module-count">{`${customModules.length}/5 modules added`}</span>
          <Tooltip
            title="You can create up to 5 custom modules. If you’ve reached the limit, delete an existing custom module to add a new one."
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

export default TabAddCustomModule;
