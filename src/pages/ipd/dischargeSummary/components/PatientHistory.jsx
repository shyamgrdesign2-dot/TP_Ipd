import React, { useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons } from "../../../../assets/images/icons";
import "./styles.scss";
import { useSelector } from "react-redux";
import PastMedicalHistory from "../../assessmentForm/PastMedicalHistory";
import ChiefComplaint from "../../assessmentForm/ChiefComplaint";
import GynecHistory from "../../assessmentForm/GynecHistory";
import ObstetricHistory from "../../assessmentForm/ObstetricHistory";
import DrawerWrapper from "../../components/DrawerWrapper/DrawerWrapper";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const GenericCard = createRemoteComponent("GenericCard");

const PatientHistory = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { chiefComplaint } = useSelector((state) => state.assessment);
  const [
    showAddEditPresentingComplaintsDrawer,
    setShowAddEditPresentingComplaintsDrawer,
  ] = useState(false);
  const { medicalHistoryData } = useSelector((state) => state.prescription);
  const [sectionItemData, setSectionItemData] = useState(null);
  const handleAddEditPresentingComplaints = (data) => {
    setSectionItemData(data);
    setShowAddEditPresentingComplaintsDrawer((prev) => !prev);
  };
  const handleSavePresentingComplaints = (data) => {
    handleAddEditPresentingComplaints({});
    setSectionItemData({});
  };
  const renderSection = () => {
    return (
      <div className="ipdph-patient-history-container">
        {sectionData?.children?.map((item) => {
          switch (item?.id) {
            case "presentingComplaints":
              return (
                <div
                  key={`chief-complaint-${JSON.stringify(chiefComplaint)}`}
                  className="ipdph-chiefcomplaint-container"
                >
                  <ChiefComplaint
                    hideBorder={true}
                    isEditable={false}
                    // {...props}
                    isDischargeSummary={true}
                    sectionData={item}
                  >
                  <div onClick={() => handleAddEditPresentingComplaints(item)}>
                    <GenericCard
                      icon={defaultIcons.editIcon}
                      title={"Add/Edit Presenting Complaints"}
                    />
                  </div>
                  </ChiefComplaint>
                </div>
              );
            case "pastMedicalHistory":
              return (
                <PastMedicalHistory
                  isEditable={true}
                  sectionData={sectionData?.children?.find(
                    (child) => child.id === "pastMedicalHistory"
                  )}
                  medicalHistoryData={medicalHistoryData}
                  isDischargeSummary={true}
                />
              );
            case "gynecHistory":
              return (
                <GynecHistory isEditable={true} {...props} sectionData={item} />
              );
            case "obstetricHistory":
              return (
                <ObstetricHistory
                  isEditable={true}
                  {...props}
                  sectionData={item}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={
          sectionData?.id
            ? dischargeSummaryIcons[`${sectionData.id}Dark`]
            : null
        }
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderSection()}
      </CollapsibleWrapper>
      {showAddEditPresentingComplaintsDrawer && (
        <DrawerWrapper
          width={"100%"}
          open={showAddEditPresentingComplaintsDrawer}
          onClose={handleAddEditPresentingComplaints}
          title="Presenting Complaints"
          saveButtonText="Save"
          onSave={handleSavePresentingComplaints}
        >
          <ChiefComplaint
            isEditable={true}
            isDischargeSummary={true}
            {...props}
            sectionData={sectionItemData}
          />
        </DrawerWrapper>
      )}
    </>
  );
};

export default PatientHistory;
