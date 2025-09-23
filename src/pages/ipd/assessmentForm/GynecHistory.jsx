import React, { useCallback, useEffect, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { useSelector, useDispatch } from "react-redux";
import GynecHistoryList from "../../../components/GynecHistoryList";
import MedicalHistoryBox from "../../../components/MedicalHistoryBox";
import { Drawer } from "antd";
import {
  setGyneacHistoryBackup,
  setGynecHistoryData,
} from "../../../redux/ipd/assessmentsFormSlice";
import { formatDateToShortMonthYear } from "../../../utils/utils";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");
const AutoFillButton = createRemoteComponent("AutoFillButton");

const GynecHistory = (props) => {
  const {
    isEditable = true,
    sectionData,
    patientDataForOPDComponents,
  } = props || {};

  let {
    gynecHistoryData,
    lastPrescriptionDataForAssessment,
    lastPrescriptionDate,
    gyneacHistoryBackup,
  } = useSelector((state) => state.assessment);
  const { lastRxDate } = lastPrescriptionDate || {};
  const dispatch = useDispatch();
  const [addGynecHistoryDrawer, setAddGynecHistoryDrawer] = useState(false);
  const [autoFillButtonRef, setAutoFillButtonRef] = useState(null);
  const handleGynecHistory = () => {
    setAddGynecHistoryDrawer(!addGynecHistoryDrawer);
  };

  const renderAutoFillButton = useCallback(() => {
    const { gyneacHistory: lastGyneacHistory = {} } =
      lastPrescriptionDataForAssessment || {};
    if (!lastRxDate) return null;
    return (
      <AutoFillButton
        refCallback={setAutoFillButtonRef}
        onClick={(data, e) => {
          e?.stopPropagation();

          if (data?.[0] === "undo") {
            dispatch(setGynecHistoryData(gyneacHistoryBackup));
            return;
          }
          if (lastGyneacHistory.length && !gynecHistoryData?.length) {
            dispatch(setGynecHistoryData(lastGyneacHistory));
          } else {
            dispatch(setGyneacHistoryBackup(gynecHistoryData));
            dispatch(
              setGynecHistoryData({ ...gynecHistoryData, ...lastGyneacHistory })
            );
          }
        }}
        title={`Autofill From OPD (${formatDateToShortMonthYear(lastRxDate)})`}
      />
    );
  }, [
    lastPrescriptionDataForAssessment,
    gynecHistoryData,
    gyneacHistoryBackup,
  ]);

  const isGynecHistoryDataExists =
    gynecHistoryData && Object.keys(gynecHistoryData).length;
  const renderMedicalHistory = () => {
    return (
      <div
        className={`ipdaf-generic-card-container ${
          isGynecHistoryDataExists ? "ipdaf-padding-0 ipdaf-margin-0" : ""
        } ${!isEditable ? "ipdaf-gynec-readable" : ""}`}
      >
        {isGynecHistoryDataExists ? (
          <GynecHistoryList
            gynecHistory={gynecHistoryData}
            showTitle={false}
            fetchDataOnLaunch={false}
          />
        ) : null}
        {isEditable ? (
          <div onClick={handleGynecHistory}>
            <GenericCard
              icon={
                isGynecHistoryDataExists
                  ? defaultIcons.editIcon
                  : defaultIcons.plusIconColoured
              }
              title={
                isGynecHistoryDataExists
                  ? "Add/Edit Gynec History"
                  : "Add Gynec History"
              }
            >
              {renderAutoFillButton()}
            </GenericCard>
          </div>
        ) : null}
      </div>
    );
  };

  const onSaveGynecHistory = (data) => {
    dispatch(setGynecHistoryData(data));
  };

  if (!isEditable && !isGynecHistoryDataExists) return null;

  return (
    <>
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        isDataPresent={isGynecHistoryDataExists}
        title={sectionData?.title}
        data-testid={sectionData?.id}
        width="100%"
        containerClass="wrapper-class ipd-gynec-history-wrapper"
        icon={assessmentsIcons[`${sectionData?.id}Pc`]}
        showAutoFill={isEditable}
        opdDate="15 Jun 2025"
        onAutoFill={() => {
          console.log("auto fill");
        }}
        onSave={() => {
          console.log("save");
        }}
        renderBody={renderMedicalHistory}
        onErase={(e) => {
          dispatch(setGynecHistoryData({}));
          if (autoFillButtonRef && autoFillButtonRef.click) {
            autoFillButtonRef.click(e);
          }
        }}
      />
      {addGynecHistoryDrawer && (
        <Drawer
          closeIcon={false}
          width={"100%"}
          placement="right"
          open={addGynecHistoryDrawer}
          onClose={handleGynecHistory}
        >
          <MedicalHistoryBox
            fetchDataOnLaunch={false}
            handleDrawerMedicalHistory={handleGynecHistory}
            handleCollapsed={handleGynecHistory}
            onSave={onSaveGynecHistory} // TODO: INTEL - fix
            showMenstrualHistory={true}
            showMedicalHistory={false}
            gynecHistoryFromProps={gynecHistoryData}
          />
        </Drawer>
      )}
    </>
  );
};

export default GynecHistory;
