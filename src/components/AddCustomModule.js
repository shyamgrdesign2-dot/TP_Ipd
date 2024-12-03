import React, { useState } from "react";
import { Tooltip, Input, Button, message } from "antd";
import {
  PlusOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./CustomModule.scss";
import CustomModuleIcon from "../assets/images/custom-module.svg";
import CustomModule from "./CustomModule";

const AddCustomModuleUI = () => {
  const [modules, setModules] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");

  const handleAddModule = () => {
    if (!newModuleName.trim()) {
      message.error("Module name cannot be empty.");
      return;
    }
    if (modules.length >= 5) {
      message.error("You can only add up to 5 custom modules.");
      return;
    }

    setModules([...modules, { name: newModuleName }]);
    setNewModuleName("");
    setShowInput(false);
  };

  const handleCancel = () => {
    setShowInput(false);
    setNewModuleName("");
  };

  return (
    <>
      {modules.map((module) => (
        <CustomModule module={module.name} />
      ))}
      <div className="add-custom-module-cta-container">
        {/* Dynamically Rendered Input Module */}
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
            disabled={modules.length >= 5}
          >
            Add Custom Module
          </Button>
          <div className="module-info">
            <span className="module-count">{`${modules.length}/5 modules added`}</span>
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
    </>
  );
};

export default AddCustomModuleUI;
