import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { Drawer } from "antd";
import { useSelector } from "react-redux";
import Obstetric from "../../obstetric/Obstetric";
import ObstetricSummary from "../../obstetric/components/ObstetricSummary";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");
// const SectionedTable = createRemoteComponent("SectionedTable");
// const GenericTable = createRemoteComponent("GenericTable");

const ObstetricHistory = (props) => {
  const { sectionData, isEditable = true, patientDataForOPDComponents } = props;
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const { pregnancyHistory = [] } = allObstetricDetails;
  const [addObstetricHistoryDrawer, setAddObstetricHistoryDrawer] =
    useState(false);
  const handleObstetricHistory = () => {
    setAddObstetricHistoryDrawer(!addObstetricHistoryDrawer);
  };

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
            />
          </div>
        ) : null}
      </div>
    );
  };

  if (!isEditable && (!Object.keys(obstetricDetails)?.length || !pregnancyHistory?.length)) return null;

  return (
    <div>
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={false}
        title={sectionData?.title}
        width="100%"
        containerClass={`wrapper-class ${isEditable ? 'ipd-wrapper-class-readonly' : ''}`}
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
            handleObstetricHistory={(data) => {console.log('INTEL ==> DATA',data)}}
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
