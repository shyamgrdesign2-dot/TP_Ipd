import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { DatePicker, TimePicker, Select } from "antd";
import dayjs from "dayjs";
import DrawerWrapper from "../../components/DrawerWrapper/DrawerWrapper.jsx";
import { createRemoteComponent } from "../../../../shared/remoteComponents.js";
import { defaultIcons } from "../../../../assets/images/icons/index.js";
import "./DischargeConfirmationModal.scss";
import { useDispatch } from "react-redux";
import { voiceRx } from "../../../../redux/ipd/ipdSlice.js";
import { defaultIcons as defaultAssetIcons } from "../../../../assets/images/icons";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const dateDisplayFormat = "DD-MM-YYYY";
const timeFormat = "hh:mm A";

const initialState = {
  dateOfDischarge: dayjs(),
  timeOfDischarge: dayjs(),
  dischargeType: "Normal",
  dischargeRemarks: [{ type: "paragraph", children: [{ text: "" }] }],
};

const DischargeConfirmationModal = forwardRef(
  (
    {
      open,
      closeClick,
      submitClick,
      dateOfDischarge,
      timeOfDischarge,
      dischargeType,
      dischargeRemarks,
      onDischargeDataChange,
      apiToCall,
      patientId = null,
      admissionId = null,
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const apiRef = useRef(null);
    const [formData, setFormData] = useState(initialState);
    const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

    const dischargeTypeOptions = [
      { value: "Normal", label: <div>Normal</div> },
      { value: "LAMA", label: <div>LAMA</div> },
      { value: "Death", label: <div>Death</div> },
    ];

    useEffect(() => {
      setFormData({
        dateOfDischarge: dateOfDischarge || dayjs(),
        timeOfDischarge: timeOfDischarge || dayjs(),
        dischargeType: dischargeType || "Normal",
        dischargeRemarks:
          dischargeRemarks && dischargeRemarks.length > 0
            ? dischargeRemarks
            : [{ type: "paragraph", children: [{ text: "" }] }],
      });
    }, [dateOfDischarge, timeOfDischarge, dischargeType, dischargeRemarks]);

    const handleFieldChange = (field, value) => {
      const updatedData = {
        ...formData,
        [field]: value,
      };
      setFormData(updatedData);

      if (onDischargeDataChange) {
        onDischargeDataChange(updatedData);
      }
    };

    useEffect(() => {
      return () => {
        setFormData(initialState);
      };
    }, []);

    const clearFormData = () => {
      setFormData(initialState);
      setTimeout(() => {
        apiRef?.current?.clear();
      }, 100);
    };
    useImperativeHandle(ref, () => ({
      clearFormData,
    }));
    const handleDischarge = () => {
      if (submitClick) {
        submitClick(formData);
      }
    };

    const handleAIRecordingComplete = async (payload, callback) => {
      if (!patientId || !admissionId) {
        callback?.();
        return;
      }
      const response = await dispatch(
        voiceRx({
          patientId,
          admissionId,
          schemaKey: "DISRCHARGED_SUMMARY.dischargeConfirmation.dischargeRemarks",
          audioFile: payload?.audioBlob,
          filename: payload?.filename,
          mimeType: payload?.mimeType,
          previousOutput: formData.dischargeRemarks,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        const updatedData =
          response?.payload?.data?.rxDigitizationHistory?.[0]?.response
            ?.dischargeRemarks || [];
        if (Array.isArray(updatedData) && updatedData.length) {
          handleFieldChange("dischargeRemarks", updatedData);
          // setAutoFillTextToAppend(updatedData);
        }
        callback?.();
      } else {
        callback?.();
      }
    };

    return (
      <DrawerWrapper
        open={open}
        onClose={closeClick}
        width={580}
        onSave={handleDischarge}
        title="Discharge Details"
        saveButtonText={
          apiToCall === "markPatientAsDischarged"
            ? "Discharge"
            : "Send for Discharge Approval"
        }
        showDisclaimerBanner={false}
        sectionFrom="Discharge Summary"
      >
        <div className="discharge-confirmation-container">
          {/* Discharge Date and Time Row */}
          <div className="discharge-row">
            <div className="discharge-field">
              <label className="discharge-label">
                Discharge Date<span className="required-asterisk">*</span>
              </label>
              <DatePicker
                className="w-100 popinput inputheight41"
                format={dateDisplayFormat}
                value={
                  formData.dateOfDischarge
                    ? dayjs(formData.dateOfDischarge, dateDisplayFormat)
                    : null
                }
                onChange={(date) =>
                  handleFieldChange(
                    "dateOfDischarge",
                    date ? date.format(dateDisplayFormat) : null
                  )
                }
                suffixIcon={null}
                prefix={
                  <img src={defaultIcons.calendarPlainIcon} alt="calendar" />
                }
                placeholder="DD-MM-YYYY"
                allowClear
                inputReadOnly
              />
            </div>

            <div className="discharge-field">
              <label className="discharge-label">
                Discharge Time<span className="required-asterisk">*</span>
              </label>
              <TimePicker
                className="w-100 popinput inputheight41"
                format={timeFormat}
                use12Hours
                value={
                  formData.timeOfDischarge
                    ? dayjs(formData.timeOfDischarge, timeFormat)
                    : null
                }
                onChange={(time) =>
                  handleFieldChange(
                    "timeOfDischarge",
                    time ? time.format(timeFormat) : null
                  )
                }
                suffixIcon={null}
                prefix={<img src={defaultIcons.clockIcon} alt="clock" />}
                placeholder="hh:mm"
                allowClear
                inputReadOnly
                defaultOpenValue={dayjs("00:00 AM", timeFormat)}
              />
            </div>
          </div>

          {/* Type of Discharge */}
          <div className="discharge-field">
            <label className="discharge-label">
              Type of Discharge<span className="required-asterisk">*</span>
            </label>
            <Select
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Type of Discharge"
              options={dischargeTypeOptions}
              value={formData.dischargeType || undefined}
              onChange={(val) => handleFieldChange("dischargeType", val)}
            />
          </div>

          {/* Additional Remarks */}
          <div className="discharge-field">
            <label className="discharge-label">Additional Remarks</label>
            <div className="discharge-remarks-editor">
              <RichTextEditWrapper
                onExposeApi={(api) => {
                  apiRef.current = api;
                }}
                readOnly={false}
                showToolbar={true}
                showActionBtns={false}
                width="100%"
                showAutoFill={false}
                containerClass="discharge-rich-text-wrapper"
                showVoiceAI={!!patientId && !!admissionId}
                showMicrophone={true}
                voiceAiIcon={defaultAssetIcons.voiceAiIcon}
                onVoiceAIRecordingComplete={handleAIRecordingComplete}
                onChange={(data) => handleFieldChange("dischargeRemarks", data)}
                initialValue={formData.dischargeRemarks}
                placeholder="The patient is stable and has been discharged after careful consideration."
                onSave={() => {
                  console.log("save");
                }}
                onErase={() => {
                  setAutoFillTextToAppend(["clear"]);
                }}
                onTemplate={() => {
                  console.log("template");
                }}
                newAutoFillTextToAppend={autoFillTextToAppend}
                setNewAutoFillTextToAppend={setAutoFillTextToAppend}
              />
            </div>
          </div>
        </div>
      </DrawerWrapper>
    );
  }
);

export default DischargeConfirmationModal;
