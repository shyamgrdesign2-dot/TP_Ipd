import React, { useEffect, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useSelector, useDispatch } from "react-redux";
import GynecHistoryList from "../../../components/GynecHistoryList";
import { isMobile } from "react-device-detect";
// import TabMedicalHistoryList from "../../../components/tab_design/TabMedicalHistoryList";
import MedicalHistoryBox from "../../../components/MedicalHistoryBox";
import { Drawer } from "antd";
import { setGynecHistoryData } from "../../../redux/ipd/assessmentsFormSlice";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");

const GynecHistory = (props) => {
  const {
    isEditable = true,
    sectionData,
    patientDataForOPDComponents,
  } = props || {};

  let { gynecHistoryData } = useSelector((state) => state.assessment);
  const dispatch = useDispatch();
  const [addGynecHistoryDrawer, setAddGynecHistoryDrawer] = useState(false);

  const handleGynecHistory = () => {
    setAddGynecHistoryDrawer(!addGynecHistoryDrawer);
  };

  const isGynecHistoryDataExists =
    gynecHistoryData && Object.keys(gynecHistoryData).length;
  const renderMedicalHistory = () => {
    return (
      <div
        className={`ipdaf-generic-card-container ${
          isGynecHistoryDataExists ? "ipdaf-padding-0 ipdaf-margin-0" : ""
        } ${!isEditable ? 'ipdaf-gynec-readable' : '' }`}
      >
        {isGynecHistoryDataExists ? (
          <GynecHistoryList
            patientDataFromProps={patientDataForOPDComponents}
            gynecHistory={gynecHistoryData}
            showTitle={false}
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
            />
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
        showActionBtns={false}
        title={sectionData?.title}
        width="100%"
        containerClass="wrapper-class ipd-gynec-history-wrapper"
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
        renderBody={renderMedicalHistory}
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
            handleDrawerMedicalHistory={handleGynecHistory}
            handleCollapsed={handleGynecHistory}
            onSave={onSaveGynecHistory} // TODO: INTEL - fix
            patientDataFromProps={patientDataForOPDComponents}
            showMenstrualHistory={true}
            showMedicalHistory={false}
          />
        </Drawer>
      )}
    </>
  );
};

export default GynecHistory;
