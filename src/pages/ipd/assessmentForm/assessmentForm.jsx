import { AnimatePresence } from "framer-motion";
import patient_data from "../../../utils/patientMockData.json";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import { normalizeToDefault } from "../../../utils/utils";
import {
  aidKit,
  basicInfo,
  editIcon,
  lab,
  medication,
  plusIcon,
  plusIconColoured,
  recordPad,
  roundDotted,
  vitals,
  vitalsDarkColoured,
} from "../../../assets/images/icons";
import MedicationsBox from "../../../components/MedicationsBox";
import LabParams from "../../../components/LabParams";
import LabParametersList from "../../../components/LabParametersList";
import { Drawer, Radio } from "antd";
import { getLabParamsData, setGynecHistoryData } from "../../../redux/prescriptionSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LabResultsTable from "../../../components/ViewLabParams";
import MedicalHistoryList from "../../../components/MedicalHistoryList";
import MedicalHistoryBox from "../../../components/MedicalHistoryBox";

const LayoutWithMenu = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "LayoutWithMenu")
  );
});
const CollapsibleWrapper = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "CollapsibleWrapper")
  );
});
const GenericCard = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "GenericCard")
  );
});
const RichTextEditWrapper = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "RichTextEditWrapper")
  );
});
const UnitInput = React.lazy(() => {
    return import("shared_ui/components").then((m) =>
      normalizeToDefault(m, "UnitInput")
    );
  });

const AssessmentForm = () => {
  const dispatch = useDispatch();
  let {
    medicationData,
    pillupSwitch,
    labParamsData,
    medicalHistoryData,
    gynecHistoryData,
  } = useSelector((state) => state.prescription);
  const [open, setOpen] = useState(true);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [value, setValue] = useState({});
  const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
  const [addMedicalHistoryDrawer, setAddMedicaHistoryDrawer] = useState(false);
  const [examinationValue, setExaminationValue] = useState({});

  const onExaminationRadioChange = (e, id) => {
    setExaminationValue({ ...examinationValue, [id]: e.target.value });
  };

  const handleLabParamsUpdate = () => {
    getLabParams(); // Update state with the new lab params data
  };

  const getLabParams = async () => {
    dispatch(
      getLabParamsData({
        patient_unique_id: patient_data?.patient_unique_id,
      })
    ).catch((err) => {
      console.error("Error fetching lab params:", err);
    });
  };

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  const handleSaveGynecHistory = (gynecHistoryData) => {
    dispatch(setGynecHistoryData(gynecHistoryData));
  };

  const handleAddLabParamsDrawer = useCallback(() => {
    setAddlabparamsDrawer(!addlabparamsDrawer);
  }, [addlabparamsDrawer]);

  const handleAddLabResults = () => {
    handleAddLabParamsDrawer();
  };

  const handleAddMedicalHistory = () => {
    setAddMedicaHistoryDrawer(!addMedicalHistoryDrawer);
  }

  const handleVitalsValue = (e, key) => {
    setValue({ ...value, [key]: e });
  };

  const renderLabResultsBody = () => {
    return (
      <div className={`ipdaf-generic-card-container ${labParamsData?.length ? 'ipdaf-padding-0': ''}`}>
        {labParamsData?.length ? (
          <LabResultsTable isIPD={true} showHeader={false} showSearchBar={false} />
        ) : null}
        <div onClick={handleAddLabResults}>
          <GenericCard icon={plusIconColoured} title={"Add Lab Results"} />
        </div>
      </div>
    );
  };

  const renderMedicalHistory = () => {
    return (
        <div className={`ipdaf-generic-card-container ${medicalHistoryData?.length ? 'ipdaf-padding-0': ''}`}>
        {medicalHistoryData?.length ? (
          <MedicalHistoryList  patientDataFromProps={patient_data}/>
        ) : null}
        <div onClick={handleAddMedicalHistory}>
          <GenericCard icon={medicalHistoryData?.length ? editIcon : plusIconColoured} title={medicalHistoryData?.length ? "Add/Edit Past Medical History" : "Add Past Medical History"} />
        </div>
      </div>
    )
  }

  const renderBasicInfo = () => {
    return (
      <CollapsibleWrapper
        title="Basic Info"
        icon={basicInfo}
        collapsible
        width={"100%"}
        className={"collapsible-wrapper-class"}
        defaultOpen
      >
        <RichTextEditWrapper
          title="Chief Complaint"
          width="100%"
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={'Enter chief complaint like patient’s main symptoms or presenting problem'} // TODO: FIX - shouldnt add styling to placeholder
          icon={roundDotted}
          showAutoFill
          containerClass="wrapper-class"
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
        />

        <RichTextEditWrapper
          title="History of Present Illness"
          width="100%"
          icon={aidKit}
          showAutoFill
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          onAutoFill={() => {
            console.log("auto fill");
          }}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter details like onset, duration, progression, and associated symptoms"}
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
        />
        <div className="ipdaf-box-container">
          <MedicationsBox />
        </div>
        <RichTextEditWrapper
          title="Lab Results"
          width="100%"
          containerClass="wrapper-class"
          icon={lab}
          showAutoFill
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
          renderBody={renderLabResultsBody}
        />
        <RichTextEditWrapper
          title="Past Medical History"
          width="100%"
          containerClass="wrapper-class"
          icon={recordPad}
          showAutoFill
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
      </CollapsibleWrapper>
    );
  };

  const renderPhysicalExamination = () => {
    return (
        <CollapsibleWrapper
        title="Physical Examination"
        icon={vitalsDarkColoured}
        collapsible
        width={"100%"}
        className={"collapsible-wrapper-class"}
        defaultOpen
      >
        <div className="ipdaf-vitals-main-container">
        <div className="ipdaf-vitals-header">
            <img src={vitals} alt="vitals" />
            <div>{'Vitals'}</div>
        </div>
        <div className='ipdaf-vitals-container'>
            {IPD.VITALS?.map(vital => {
                return (
                    <UnitInput
                        containerStyle={{ marginBottom: '20px' }}
                        onChange={e => handleVitalsValue(e, vital.name)}
                        value={value?.[vital?.name]}
                        type='text'
                        inputMode='decimal'
                        {...vital}
                    />
                );
            })}
        </div>
        </div>

        <div className='examinations-parent-container'>
            {IPD.EXAMINATION.map(item => {
            return (
                <RichTextEditWrapper
                    initialValue={[
                        {
                        type: 'paragraph',
                        children: [{ text: '' }],
                        },
                    ]}
                    placeholder={'Additional notes if any'}
                    containerClass='wrapper-class examination-rich-container'
                >
                    <div className='examination-container-header'>
                        <div className='examination-header'>{item.title} : </div>
                        <Radio.Group
                            className='exam-radio-text'
                            onChange={e => onExaminationRadioChange(e, item.title)}
                            value={examinationValue[item.title]}
                            options={item.options}
                        />
                    </div>
                </RichTextEditWrapper>
            );
            })}
        </div>
        
      </CollapsibleWrapper>
    )
  }
  const renderSections = () => {
    return {
      basic: renderBasicInfo,
      pe: renderPhysicalExamination,
    };
  };
  const assessmentsFormItems = () => {
    return IPD.ASSESSMENTS_MENU?.map((item) => {
      return { ...item, renderSection: renderSections()?.[item.id] };
    });
  };
  return (
    <>
      <Suspense fallback={<>Loading ...</>}>
        <AnimatePresence mode="wait">
          <div className="ipd-assessments-form-container">
            {open && (
              <LayoutWithMenu
                key="assessment"
                items={assessmentsFormItems()}
                onRequestClose={() => setOpen(false)}
                headerOffset={72}
              />
            // renderPhysicalExamination()
            )}
          </div>
        </AnimatePresence>
      </Suspense>
      {addlabparamsDrawer && (
        <Drawer
          closeIcon={false}
          width={"100%"}
          placement="right"
          open={addlabparamsDrawer}
          onClose={showHideBackModal}
          bodyStyle={{ backgroundColor: "white" }}
        >
          <LabParams
            handleAddLabParamsDrawer={handleAddLabParamsDrawer}
            patient_unique_id={patient_data?.patient_unique_id}
            onSave={handleLabParamsUpdate}
            isBackModalOpen={isBackModalOpen}
            showHideBackModal={showHideBackModal}
            isIPD={true}
            patientGender={patient_data?.pm_gender}
          />
        </Drawer>
      )}
      {
        addMedicalHistoryDrawer && (
            <Drawer
                closeIcon={false}
                width={"100%"}
                placement="right"
                open={addMedicalHistoryDrawer}
                onClose={showHideBackModal}
                bodyStyle={{ backgroundColor: "white" }}
        >
            <MedicalHistoryBox 
                handleDrawerMedicalHistory={handleAddMedicalHistory}
                handleCollapsed={handleAddMedicalHistory}
                onSave={handleSaveGynecHistory}
                patientDataFromProps={patient_data}
            />
        </Drawer>
        )
      }
    </>
  );
};

export default AssessmentForm;
