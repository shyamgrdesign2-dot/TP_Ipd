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

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");

const LabResults = (props) => {
  const { isEditable = true, sectionData, patient_data } = props || {};
  const { labResults, lastPrescriptionDataForAssessment } = useSelector(
    (state) => state.assessment
  );
  const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const dispatch = useDispatch();
  const handleAddLabParamsDrawer = useCallback(() => {
    setAddlabparamsDrawer(!addlabparamsDrawer);
  }, [addlabparamsDrawer]);

  useEffect(() => {
    dispatch(setLabResults(lastPrescriptionDataForAssessment?.labResults?.results))
  }, [lastPrescriptionDataForAssessment?.labResults?.results])

  const handleAddLabResults = () => {
    handleAddLabParamsDrawer();
  };

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  const handleLabParamsUpdate = (data) => {
    dispatch(setLabResults(data))
      handleAddLabParamsDrawer()
  };
  
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
          />
        ) : null}
        {isEditable ? (
          <div onClick={handleAddLabResults}>
            <GenericCard icon={defaultIcons.plusIconColoured} title={"Add Lab Results"} />
          </div>
        ) : null}
      </div>
    );
  }, [labResults]);

  return (
    <>
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={false}
        title={sectionData?.title}
        width="100%"
        containerClass="wrapper-class"
        icon={defaultIcons[sectionData?.icon]}
        showAutoFill={isEditable}
        opdDate="15 Jun 2025"
        onAutoFill={() => {
          console.log("auto fill");
        }}
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          console.log("erase");
        }}
        onTemplate={() => {
          console.log("template");
        }}
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
            patient_unique_id={patient_data?.details?.id}
            onSave={handleLabParamsUpdate} // TODO: INTEL - fix
            isBackModalOpen={isBackModalOpen}
            showHideBackModal={showHideBackModal}
            existingDataFromProps={labResults}
            isIPD={true}
            patientGender={patient_data?.details?.gender}
          />
        </Drawer>
      )}
    </>
  );
};

export default LabResults;
