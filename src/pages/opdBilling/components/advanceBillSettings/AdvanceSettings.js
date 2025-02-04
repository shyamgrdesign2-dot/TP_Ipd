import React, { useEffect, useState } from "react";
import { Drawer, Input, Select, Tooltip, Button, Radio } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "./AdvanceBillSettings.module.css";
import { useSelector } from "react-redux";
import SequenceSettings from "./SequenceSettings";
import { updateAdvancedSettings } from "../../service";
import { errorMessage } from "../../../../utils/utils";
import dayjs from "dayjs";

const AdvanceBillSettings = ({ visible, onClose, getAdvanceSettings }) => {
  const [settings, setSettings] = useState({});
  const { advancedSettings } = useSelector((state) => state.billing);

  const [billModalOpen, setBillModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    if (advancedSettings) setSettings(advancedSettings);
  }, [advancedSettings]);

  const handleSaveBillSequence = async (settings) => {
    updateSettings({
      ...advancedSettings,
      billSequence: settings,
    });
  };

  const handleSaveReceiptSequence = (settings) => {
    updateSettings({
      ...advancedSettings,
      receiptSequence: settings,
    });
  };

  const updateSettings = async (payload) => {
    try {
      const res = await updateAdvancedSettings(payload);
      if (res?.status === 204) {
        getAdvanceSettings();
        setBillModalOpen(false);
        setReceiptModalOpen(false);
        onClose();
      } else {
        errorMessage(res?.message || "Error while updating sequence settings");
      }
    } catch (err) {
      errorMessage(err?.message || "Error while updating sequence settings");
    }
  };

  const handleDefaultPaymentMode = (value) => {
    setSettings({ ...settings, defaultPaymentMode: value });
  };

  const handleBillingStatusInAppointmentScreen = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value === "Show" });
  };

  const handleDefaultDiscountType = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleDefaultForm3cFlag = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value === "Checked" });
  };

  const handleDefaultRxFlag = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value === "Checked" });
  };

  const handleEnabledForReceptionist = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value === "Allow" });
  };

  const handleChangeGstin = (e) => {
    setSettings({ ...settings, GSTIN: e.target.value });
  };

  const generatePreview = (sequence) => {
    const {
      prefixEnabled,
      prefix,
      sequenceType,
      sequenceFormat,
      serialNumber,
    } = sequence || {};
    let preview = "";

    if (prefixEnabled) {
      preview += prefix;
    }

    if (sequenceType === "dateBased") {
      const date = dayjs();
      switch (sequenceFormat) {
        case "YYYYX":
          preview += date.format("YYYY") + serialNumber;
          break;
        case "YYYYMMX":
          preview += date.format("YYYYMM") + serialNumber;
          break;
        case "YYYYMMDDX":
          preview += date.format("YYYYMMDD") + serialNumber;
          break;
        default:
          preview += date.format("YYYY") + serialNumber;
      }
    } else {
      preview += serialNumber;
    }

    return preview;
  };

  const handleAdvancedSettings = () => {
    updateSettings({ ...advancedSettings, ...settings });
  };

  return (
    <Drawer
      title="Advance Bill Settings"
      placement="right"
      onClose={onClose}
      open={visible}
      width={598}
      extra={
        <Button
          type="primary"
          onClick={handleAdvancedSettings}
          disabled={!advancedSettings}
        >
          Save
        </Button>
      }
    >
      <div className="bg-white">
        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Bill No. Sequence</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>
          <Input
            value={generatePreview(settings.billSequence)}
            suffix={
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  advancedSettings?.billSequence && setBillModalOpen(true)
                }
              >
                <i className="icon-Edit" />
              </span>
            }
            disabled
            style={{ height: "38px" }}
          />
        </div>
        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Receipt No. Sequence</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>
          <Input
            value={generatePreview(settings.receiptSequence)}
            suffix={
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  advancedSettings?.receiptSequence && setReceiptModalOpen(true)
                }
              >
                <i className="icon-Edit" />
              </span>
            }
            disabled
            style={{ height: "38px" }}
          />
        </div>

        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>GSTIN number</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>
          <Input
            value={settings.GSTIN}
            style={{ height: "38px" }}
            onChange={handleChangeGstin}
          />
        </div>

        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Select Default Payment mode</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>
          <Select
            value={settings.defaultPaymentMode}
            style={{ width: "100%", height: "38px" }}
            options={[
              { value: "Cash", label: "Cash" },
              { value: "Card", label: "Card" },
              { value: "UPI", label: "UPI" },
            ]}
            onChange={handleDefaultPaymentMode}
          />
        </div>

        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Billing/Unbilled Status in Appointment Screen</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>

          <Radio.Group
            value={settings.billingStatusInAppointmentScreen ? "Show" : "Hide"}
            style={{ display: "flex", marginTop: 10 }}
            onChange={handleBillingStatusInAppointmentScreen}
            name="billingStatusInAppointmentScreen"
          >
            {["Hide", "Show"].map((value, i) => {
              return (
                <Radio.Button
                  key={i}
                  value={value}
                  style={{
                    width: "50%",
                    height: "38px",
                  }}
                  className="custom-radio-button d-flex align-items-center justify-content-center"
                >
                  {value}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>

        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Set Default Discount Type as</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>
          <Radio.Group
            value={settings.defaultDiscountType}
            style={{ display: "flex", marginTop: 10 }}
            onChange={handleDefaultDiscountType}
            name="defaultDiscountType"
          >
            {[
              { label: "%", value: "percentage" },
              { label: "₹", value: "flat" },
            ].map((item, i) => {
              return (
                <Radio.Button
                  key={i}
                  value={item.value}
                  style={{
                    width: "50%",
                    height: "38px",
                  }}
                  className="custom-radio-button d-flex align-items-center justify-content-center"
                >
                  {item.label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>

        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Add Bill to Form 3C (Checkbox Default State)</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>
          <Radio.Group
            value={settings.defaultForm3cFlag ? "Checked" : "Unchecked"}
            style={{ display: "flex", marginTop: 10 }}
            onChange={handleDefaultForm3cFlag}
            name="defaultForm3cFlag"
          >
            {[
              { label: "Unchecked (not selected)", value: "Unchecked" },
              { label: "Checked (Selected)", value: "Checked" },
            ].map((item, i) => {
              return (
                <Radio.Button
                  key={i}
                  value={item.value}
                  style={{
                    width: "50%",
                    height: "38px",
                  }}
                  className="custom-radio-button d-flex align-items-center justify-content-center"
                >
                  {item.label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>

        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Include in Rx (Checkbox Default State)</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>
          <Radio.Group
            value={settings.defaultRxFlag ? "Checked" : "Unchecked"}
            style={{ display: "flex", marginTop: 10 }}
            onChange={handleDefaultRxFlag}
            name="defaultRxFlag"
          >
            {[
              { label: "Unchecked (not selected)", value: "Unchecked" },
              { label: "Checked (Selected)", value: "Checked" },
            ].map((item, i) => {
              return (
                <Radio.Button
                  key={i}
                  value={item.value}
                  style={{
                    width: "50%",
                    height: "38px",
                  }}
                  className="custom-radio-button d-flex align-items-center justify-content-center"
                >
                  {item.label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>

        <div className={styles.formItem}>
          <div className={styles.inputWithIcon}>
            <label>Receptionist Access Control</label>
            {/* <Tooltip title="Help information"> */}
            <InfoCircleOutlined className={styles.infoIcon} />
            {/* </Tooltip> */}
          </div>

          <Radio.Group
            value={settings.enabledForReceptionist ? "Allow" : "Restrict"}
            style={{ display: "flex", marginTop: 10 }}
            onChange={handleEnabledForReceptionist}
            name="enabledForReceptionist"
          >
            {["Allow", "Restrict"].map((item, i) => {
              return (
                <Radio.Button
                  key={i}
                  value={item}
                  style={{
                    width: "50%",
                    height: "38px",
                  }}
                  className="custom-radio-button d-flex align-items-center justify-content-center"
                >
                  {item}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
      </div>
      <SequenceSettings
        type="bill"
        open={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onSave={handleSaveBillSequence}
        initialValues={advancedSettings.billSequence}
      />
      <SequenceSettings
        type="receipt"
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        onSave={handleSaveReceiptSequence}
        initialValues={advancedSettings.receiptSequence}
      />
    </Drawer>
  );
};

export default AdvanceBillSettings;
