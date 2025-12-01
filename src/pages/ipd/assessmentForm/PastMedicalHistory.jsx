import React, { useState, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { useSelector, useDispatch } from "react-redux";
import MedicalHistoryList from "../../../components/MedicalHistoryList";
import MedicalHistoryBox from "../../../components/MedicalHistoryBox";
import { Drawer, message } from "antd";
import { setMedicalHistoryData } from "../../../redux/prescriptionSlice";
import {
  formatDateToShortMonthYear,
  mergeArraysOfObjects,
} from "../../../utils/utils";
import { useDischargeSummaryData } from "../dischargeSummary/utils/useDischargeSummaryData";
import { voiceRx } from "../../../redux/ipd/ipdSlice";
import { useLocation } from "react-router-dom";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");
const VoiceAI = createRemoteComponent("VoiceAI");
const AutoFillButton = createRemoteComponent("AutoFillButton");

const PastMedicalHistory = (props) => {
  const {
    isEditable = true,
    sectionData,
    isDischargeSummary = false,
  } = props || {};
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const { showLastUpdatedAt } = useDischargeSummaryData();
  let { medicalHistoryData } = useSelector((state) => state.prescription);
  const { lastPrescriptionDataForAssessment, lastPrescriptionDate } =
    useSelector((state) => state.assessment);
  const { lastRxDate } = lastPrescriptionDate || {};
  const dispatch = useDispatch();
  const [addMedicalHistoryDrawer, setAddMedicaHistoryDrawer] = useState(false);
  const [autoFillButtonRef, setAutoFillButtonRef] = useState(null);
  const handleAddMedicalHistory = () => {
    setAddMedicaHistoryDrawer(!addMedicalHistoryDrawer);
  };

  const handleAIRecordingComplete = async (payload, callback) => {
    const response = await dispatch(
      voiceRx({
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        schemaKey: "ASSESSMENTS.basicInfo.pastMedicalHistory",
        audioFile: payload?.audioBlob,
        filename: payload?.filename,
        mimeType: payload?.mimeType,
        previousOutput: medicalHistoryData,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      const updatedData =
        response?.payload?.data?.rxDigitizationHistory?.[0]?.response || [];
      if (!!updatedData?.length) {
        console.log("newConvertedData", updatedData);
        dispatch(setMedicalHistoryData(updatedData));
        callback?.();
      } else {
        callback?.();
      }
    } else {
      callback?.();
    }
  };

  const renderAutoFillButton = useCallback(() => {
    const { pastMedicalHistory: lastPastMedicalHistory = {} } =
      lastPrescriptionDataForAssessment || {};
    if (!lastPrescriptionDataForAssessment?.pastMedicalHistory?.length)
      return null;
    return (
      <AutoFillButton
        refCallback={setAutoFillButtonRef}
        onClick={(data, e) => {
          e?.stopPropagation();

          if (data?.[0] === "undo") {
            dispatch(setMedicalHistoryData([]));
            return;
          }
          if (lastPastMedicalHistory.length && !medicalHistoryData?.length) {
            dispatch(setMedicalHistoryData(lastPastMedicalHistory));
          } else {
            dispatch(
              setMedicalHistoryData(
                mergeArraysOfObjects(lastPastMedicalHistory, medicalHistoryData)
              )
            );
          }
        }}
        title={`Autofill From OPD ${
          lastRxDate ? `(${formatDateToShortMonthYear(lastRxDate)})` : ""
        }`}
      />
    );
  }, [lastPrescriptionDataForAssessment, medicalHistoryData]);

  const renderMedicalHistory = () => {
    return (
      <div
        className={`ipdaf-generic-card-container ipdaf-past-medical-history-container ${
          medicalHistoryData?.length ? "ipdaf-padding-0 ipdaf-margin-0" : ""
        } ${!isEditable ? "ipdaf-readable-renderer" : null}`}
      >
        {medicalHistoryData?.length ? (
          <MedicalHistoryList
            isIPD={true}
            isDischargeSummary={isDischargeSummary}
          />
        ) : null}
        {isEditable ? (
          <div className="d-flex align-items-center">
            <div
              className="ipdaf-pmh-generic-card-container"
              onClick={handleAddMedicalHistory}
            >
              <GenericCard
                icon={
                  medicalHistoryData?.length
                    ? defaultIcons.editIcon
                    : defaultIcons.plusIconColoured
                }
                title={
                  medicalHistoryData?.length
                    ? "Add/Edit Past Medical History"
                    : "Add Past Medical History"
                }
              >
                {renderAutoFillButton()}
              </GenericCard>
            </div>
            <VoiceAI
              voiceAiIcon={defaultIcons.voiceAiIcon}
              onRecordingComplete={handleAIRecordingComplete}
            />
          </div>
        ) : null}
      </div>
    );
  };

  if (!isEditable && !medicalHistoryData?.length) return null;
  return (
    <>
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showOnlyClear={isEditable}
        isDataPresent={medicalHistoryData?.length}
        onErase={(e) => {
          dispatch(setMedicalHistoryData([]));
          if (autoFillButtonRef && autoFillButtonRef.click) {
            autoFillButtonRef.click(e);
          }
        }}
        title={sectionData?.title || "Past Medical History"}
        width="100%"
        containerClass="wrapper-class ipd-pmh-wrapper-class"
        icon={assessmentsIcons[`${sectionData?.id}Pc`]}
        showAutoFill={false}
        opdDate="15 Jun 2025"
        onAutoFill={() => {
          console.log("auto fill");
        }}
        onSave={() => {
          console.log("save");
        }}
        renderBody={renderMedicalHistory}
        headerComponent={medicalHistoryData?.length ? showLastUpdatedAt : null}
      />
      {addMedicalHistoryDrawer && (
        <Drawer
          closeIcon={false}
          width={"100%"}
          placement="right"
          open={addMedicalHistoryDrawer}
          onClose={handleAddMedicalHistory}
          bodyStyle={{ backgroundColor: "white" }}
        >
          <MedicalHistoryBox
            handleDrawerMedicalHistory={handleAddMedicalHistory}
            handleCollapsed={handleAddMedicalHistory}
            onSave={handleAddMedicalHistory} // TODO: INTEL - fix
            showMenstrualHistory={false}
            showMedicalHistory={true}
          />
        </Drawer>
      )}
    </>
  );
};

export default PastMedicalHistory;
