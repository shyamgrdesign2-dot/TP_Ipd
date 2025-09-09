import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useSelector } from "react-redux";
import MedicalHistoryList from "../../../components/MedicalHistoryList";
import MedicalHistoryBox from "../../../components/MedicalHistoryBox";
import { Drawer } from "antd";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");

const PastMedicalHistory = (props) => {
  const {
    isEditable = true,
    sectionData,
    patientDataForOPDComponents,
  } = props || {};
  let { medicalHistoryData } = useSelector((state) => state.prescription);
  const [addMedicalHistoryDrawer, setAddMedicaHistoryDrawer] = useState(false);

  const handleAddMedicalHistory = () => {
    setAddMedicaHistoryDrawer(!addMedicalHistoryDrawer);
  };

  const renderMedicalHistory = () => {
    return (
      <div
        className={`ipdaf-generic-card-container ${
          medicalHistoryData?.length ? "ipdaf-padding-0 ipdaf-margin-0" : ""
        }`}
      >
        {medicalHistoryData?.length ? (
          <MedicalHistoryList isIPD={true} />
        ) : null}
        {isEditable ? (
          <div onClick={handleAddMedicalHistory}>
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
        showActionBtns={false}
        title={sectionData?.title || "Past Medical History"}
        width="100%"
        containerClass="wrapper-class ipd-pmh-wrapper-class"
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
        onVoiceDictatorClick={(callback) => {
          console.log("voice dictation");
          setTimeout(() => {
            callback();
          }, 3000);
        }}
        renderBody={renderMedicalHistory}
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
            patientDataFromProps={patientDataForOPDComponents}
            showMenstrualHistory={false}
            showMedicalHistory={true}
          />
        </Drawer>
      )}
    </>
  );
};

export default PastMedicalHistory;
