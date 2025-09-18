import React, { useState, useCallback, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import "./styles.scss";
import LabResultsTable from "../../../components/ViewLabParams";
import { defaultIcons } from "../../../assets/images/icons";
import { Drawer } from "antd";
import LabParams from "../../../components/LabParams";
import { useDispatch } from "react-redux";
import { setLabResults } from "../../../redux/ipd/assessmentsFormSlice";
import { useSelector } from "react-redux";
import { formatDateToShortMonthYear } from "../../../utils/utils";
import { useLocation } from "react-router-dom";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");
const AutoFillButton = createRemoteComponent("AutoFillButton");

const LabResults = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { labResults, lastPrescriptionDataForAssessment } = useSelector(
    (state) => state.assessment
  );
  const { state } = useLocation();
  const { patient_data } = state;
  const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const dispatch = useDispatch();
  const handleAddLabParamsDrawer = useCallback(() => {
    setAddlabparamsDrawer(!addlabparamsDrawer);
  }, [addlabparamsDrawer]);

  const handleAddLabResults = () => {
    handleAddLabParamsDrawer();
  };

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  const handleLabParamsUpdate = (data) => {
    dispatch(setLabResults(data));
    handleAddLabParamsDrawer();
  };

  
  const renderAutoFillButton = useCallback(() => {
    const { labResults: lastLabResults = {} } = lastPrescriptionDataForAssessment || {};
    const { modifiedAt, results, createdAt, date } = lastLabResults;
    if (!(modifiedAt || createdAt || date)) return null;
    return (
      <AutoFillButton
        onClick={(data, e) => {
          e?.stopPropagation();

          if (data?.[0] === "undo") {
            dispatch(setLabResults([]));
            return;
          }
          if (results && !labResults?.length) {
            dispatch(setLabResults(results));
          } else {
            dispatch(setLabResults([...labResults, ...results]));
          }
        }}
        title={`Autofill From OPD (${formatDateToShortMonthYear(
          modifiedAt || createdAt || date
        )})`}
      />
    );
  }, [lastPrescriptionDataForAssessment, labResults]);

  const renderLabResultsBody = useCallback(() => {
    return (
      <div
        className={`ipdaf-generic-card-container ${
          labResults?.length ? "ipdaf-padding-0" : ""
        }`}
      >
        {labResults?.length ? (
          <LabResultsTable
            isIPD={true}
            showHeader={false}
            labParamsData={labResults}
            showSearchBar={false}
            isEditable={false}
          />
        ) : null}
        {isEditable ? (
          <div onClick={handleAddLabResults}>
            <GenericCard
              icon={defaultIcons.plusIconColoured}
              title={"Add Lab Results"}
            >
              {renderAutoFillButton()}
            </GenericCard>
          </div>
        ) : null}
      </div>
    );
  }, [labResults, lastPrescriptionDataForAssessment]);

  if (!isEditable && !labResults?.length) return null;
  return (
    <>
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={false}
        title={sectionData?.title}
        width="100%"
        containerClass={`wrapper-class ${!isEditable ? 'ipd-wrapper-class-readonly' : ''}`} 
        icon={defaultIcons[sectionData?.icon]}
        showAutoFill={false}
        renderBody={renderLabResultsBody}
      />
      {addlabparamsDrawer && (
        <Drawer
          closeIcon={false}
          width={"100%"}
          placement="right"
          open={addlabparamsDrawer}
          onClose={handleAddLabParamsDrawer}
          bodyStyle={{ backgroundColor: "white" }}
        >
          <LabParams
            handleAddLabParamsDrawer={handleAddLabParamsDrawer}
            onSave={handleLabParamsUpdate} // TODO: INTEL - fix
            isBackModalOpen={isBackModalOpen}
            showHideBackModal={showHideBackModal}
            patient_unique_id={patient_data?.patient_unique_id}
            existingDataFromProps={labResults}
            isIPD={true}
          />
        </Drawer>
      )}
    </>
  );
};

export default LabResults;
