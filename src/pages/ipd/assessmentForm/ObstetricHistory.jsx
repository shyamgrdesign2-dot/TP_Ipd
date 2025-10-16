import React, { useState, useCallback, useRef } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Obstetric from "../../obstetric/Obstetric";
import ObstetricSummary from "../../obstetric/components/ObstetricSummary";
import {
  addObstetricDetails,
  addObstetricDetailsBackup,
} from "../../../redux/obstetricSlice";
import {
  deepMergePreserveFirst,
  formatDateToShortMonthYear,
} from "../../../utils/utils";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");
const AutoFillButton = createRemoteComponent("AutoFillButton");

const ObstetricHistory = (props) => {
  const { sectionData, isEditable = true, patientDataForOPDComponents } = props;
  const { obstetricDetailsBackup, obstetricDetails: allObstetricDetails } =
    useSelector((state) => state.obstetric);
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const { pregnancyHistory = [] } = allObstetricDetails;
  const { lastPrescriptionDataForAssessment, lastPrescriptionDate } =
    useSelector((state) => state.assessment);
  const { lastRxDate } = lastPrescriptionDate || {};
  const dispatch = useDispatch();
  const [addObstetricHistoryDrawer, setAddObstetricHistoryDrawer] =
    useState(false);
  const [autoFillButtonRef, setAutoFillButtonRef] = useState(null);
  const handleObstetricHistory = () => {
    setAddObstetricHistoryDrawer(!addObstetricHistoryDrawer);
  };

  const renderAutoFillButton = () => {
    const { obstetricHistoryEntry: lastObstetricDetails = {} } =
      lastPrescriptionDataForAssessment || {};
    if (!lastRxDate || !Object.keys(lastObstetricDetails)?.length) return null;
    return (
      <AutoFillButton
        refCallback={setAutoFillButtonRef}
        onClick={(data, e) => {
          e?.stopPropagation();

          if (data?.[0] === "undo") {
            dispatch(addObstetricDetails(obstetricDetailsBackup));
            return;
          }
          if (
            Object.keys(lastObstetricDetails)?.length &&
            !Object.keys(allObstetricDetails)?.length
          ) {
            dispatch(addObstetricDetails(lastObstetricDetails));
          } else {
            dispatch(addObstetricDetailsBackup(allObstetricDetails));
            dispatch(addObstetricDetails(lastObstetricDetails));
            dispatch(
              addObstetricDetails(
                deepMergePreserveFirst(
                  allObstetricDetails,
                  lastObstetricDetails
                )
              )
            );
          }
        }}
        title={`Autofill From OPD (${formatDateToShortMonthYear(lastRxDate)})`}
      />
    );
  };
  // , [lastPrescriptionDataForAssessment, allObstetricDetails, obstetricDetailsBackup]);

  const renderObstetricHistory = () => {
    return (
      <div
        className={`ipdaf-generic-card-container ipdaf-obstetrics-container ${
          Object.keys(obstetricDetails)?.length ? "ipdaf-padding-0" : ""
        }`}
      >
        <ObstetricSummary
          data={obstetricDetails}
          pastPregnancyData={pregnancyHistory}
        />
        {isEditable ? (
          <div onClick={handleObstetricHistory}>
            <GenericCard
              icon={
                Object.keys(obstetricDetails)?.length
                  ? defaultIcons.editIcon
                  : defaultIcons.plusIconColoured
              }
              title={
                Object.keys(obstetricDetails)?.length
                  ? "Add/Edit Obstetric History"
                  : "Add Obstetric History"
              }
            >
              {renderAutoFillButton()}
            </GenericCard>
          </div>
        ) : null}
      </div>
    );
  };

  if (
    !isEditable &&
    !Object.keys(obstetricDetails)?.length &&
    !pregnancyHistory?.length
  )
    return null;

  return (
    <div>
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showOnlyClear={isEditable}
        isDataPresent={
          Object.keys(obstetricDetails)?.length || pregnancyHistory?.length
        }
        onErase={(e) => {
          dispatch(addObstetricDetails({}));
          if (autoFillButtonRef && autoFillButtonRef.click) {
            autoFillButtonRef.click(e);
          }
        }}
        title={sectionData?.title}
        data-testid={sectionData?.id}
        width="100%"
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        icon={assessmentsIcons[`${sectionData?.id}Pc`]}
        showAutoFill={isEditable}
        opdDate="15 Jun 2025"
        onAutoFill={() => {
          console.log("auto fill");
        }}
        renderBody={renderObstetricHistory}
      />
      {addObstetricHistoryDrawer && (
        <Drawer
          closeIcon={false}
          width={"100%"}
          placement="right"
          classNames={{ header: "ipd-customization-drawer" }}
          open={addObstetricHistoryDrawer}
          onClose={handleObstetricHistory}
          bodyStyle={{ backgroundColor: "white" }}
        >
          <Obstetric
            obstetricDetails={obstetricDetails}
            obstetricDrawer={"pregnancyHistory"}
            isIPD={true}
            handleDrawerObstetric={handleObstetricHistory}
            patientDataFromProps={patientDataForOPDComponents}
          />
        </Drawer>
      )}
    </div>
  );
};

export default ObstetricHistory;
