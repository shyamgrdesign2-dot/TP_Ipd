import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import {
  defaultIcons,
} from "../../../assets/images/icons";
import { Drawer } from "antd";
import { useSelector } from "react-redux";
import Obstetric from "../../obstetric/Obstetric";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");
const SectionedTable = createRemoteComponent("SectionedTable");
const GenericTable = createRemoteComponent('GenericTable');

const dummyData = {
  generic: {
    headings: [
      "LMP",
      "E.D.D",
      "C.E.E.D",
      "Gestation",
      "Blood",
      "Husband’s blood",
      "Consng",
      "Merital status",
    ],
    values: [
      "20 Oct 24",
      "20 Oct 24",
      "20 Oct 24",
      "2W, 3D",
      "AB-",
      "1",
      "Yes",
      "Married",
    ],
  },
  sectioned: {
    headings: ["Gravida", "Para", "Living", "Abortion", "NND", "Ectopic"],
    values: [["2", "1", "1", "1", "1", "1"]],
  },
};

const pregnancyHistory = {
  title: "Pregnancy history",
  sections: [
    {
      columns: [
        "Gravida no",
        "Outcome",
        "Term length",
        "Mode of delivery",
        "Delivery date",
        "Gender",
        "Baby weight",
      ],
      values: [["1", "Live", "Term", "NVD", "20 Oct ‘24", "Male", "2kgs"]],
      remarks: "Patient not able to remember previous medicines consumed",
    },
    {
      columns: [
        "Gravida no",
        "Outcome",
        "Gestation",
        "Location",
        "Mode of management",
      ],
      values: [["2", "Ectopic", "4", "Left tube", "Medical"]],
      remarks: "Patient not able to remember previous medicines consumed",
    },
  ],
};

const ObstetricHistory = (props) => {
  const { sectionData, isEditable = true, patientDataForOPDComponents } = props;
  const {
    obstetricDetails: allObstetricDetails,
  } = useSelector((state) => state.obstetric);
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const [addObstetricHistoryDrawer, setAddObstetricHistoryDrawer] =
    useState(false);
  const handleObstetricHistory = () => {
    setAddObstetricHistoryDrawer(!addObstetricHistoryDrawer);
  };

  const renderObstetricHistory = () => {
    return (
      <div
        className={`ipdaf-generic-card-container ipdaf-obstetrics-container ${
          dummyData?.generic ? "ipdaf-padding-0" : ""
        }`}
      >
        {dummyData?.generic ? (
          <>
            <GenericTable
              title="Patient diagnosis"
              columns={dummyData?.sectioned?.headings}
              rows={dummyData?.sectioned?.values}
            />
            <SectionedTable
              title={pregnancyHistory.title}
              sections={pregnancyHistory.sections}
            />
          </>
        ) : null}
        {isEditable ? (
          <div onClick={handleObstetricHistory}>
            <GenericCard
              icon={dummyData?.generic ? defaultIcons.editIcon : defaultIcons.plusIconColoured}
              title={
                dummyData?.generic
                  ? "Add/Edit Obstetric History"
                  : "Add Obstetric History"
              }
            />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div>
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
            obstetricDrawer={"pregnancyHistory"}
            handleDrawerObstetric={handleObstetricHistory}
            patientDataFromProps={patientDataForOPDComponents}
          />
        </Drawer>
      )}
    </div>
  );
};

export default ObstetricHistory;
