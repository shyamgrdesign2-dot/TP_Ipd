import { AnimatePresence } from "framer-motion";
import patient_data from "../../../utils/patientMockData.json";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import { normalizeToDefault } from "../../../utils/utils";
import {
  aidKit,
  basicInfo,
  ddx,
  doc,
  editIcon,
  folderDark,
  galaxy,
  instructions,
  lab,
  medication,
  obstetrics,
  plusIcon,
  plusIconColoured,
  recordPad,
  recordPadDark,
  roundDotted,
  vitals,
  vitalsDarkColoured,
} from "../../../assets/images/icons";
import MedicationsBox from "../../../components/MedicationsBox";
import LabParams from "../../../components/LabParams";
import LabParametersList from "../../../components/LabParametersList";
import { ConfigProvider, Drawer, Radio } from "antd";
import { getLabParamsData, setGynecHistoryData } from "../../../redux/prescriptionSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LabResultsTable from "../../../components/ViewLabParams";
import MedicalHistoryList from "../../../components/MedicalHistoryList";
import MedicalHistoryBox from "../../../components/MedicalHistoryBox";
import { useNavigate } from "react-router-dom";
import Obstetric from "../../obstetric/Obstetric";


const dummyData = {
    generic: {
        headings: [
      'LMP',
      'E.D.D',
      'C.E.E.D',
      'Gestation',
      'Blood',
      'Husband’s blood',
      'Consng',
      'Merital status',
    ],
    values: 
      [
        '20 Oct 24',
        '20 Oct 24',
        '20 Oct 24',
        '2W, 3D',
        'AB-',
        '1',
        'Yes',
        'Married',
      ],
    },
    sectioned: {
        headings: ['Gravida', 'Para', 'Living', 'Abortion', 'NND', 'Ectopic'],
        values: [['2', '1', '1', '1', '1', '1']]
    }
};

const pregnancyHistory = {
    title: 'Pregnancy history',
    sections: [
      {
        columns: [
          'Gravida no',
          'Outcome',
          'Term length',
          'Mode of delivery',
          'Delivery date',
          'Gender',
          'Baby weight',
        ],
        values: [['1', 'Live', 'Term', 'NVD', '20 Oct ‘24', 'Male', '2kgs']],
        remarks: 'Patient not able to remember previous medicines consumed',
      },
      {
        columns: [
          'Gravida no',
          'Outcome',
          'Gestation',
          'Location',
          'Mode of management',
        ],
        values: [['2', 'Ectopic', '4', 'Left tube', 'Medical']],
        remarks: 'Patient not able to remember previous medicines consumed',
      },
    ],
  };


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

const GenericTable = React.lazy(() => {
    return import("shared_ui/components").then((m) =>
      normalizeToDefault(m, "GenericTable")
    );
  });
  const SectionedTable = React.lazy(() => {
    return import("shared_ui/components").then((m) =>
      normalizeToDefault(m, "SectionedTable")
    );
  });
const UnitInput = React.lazy(() => {
    return import("shared_ui/components").then((m) =>
      normalizeToDefault(m, "UnitInput")
    );
  });

  const AutoFillButton = React.lazy(() => {
    return import("shared_ui/components").then((m) =>
      normalizeToDefault(m, "AutoFillButton")
    );
  });

const AssessmentsForm = (props) => {
    const { isEditable = true } = props;
  const dispatch = useDispatch();
  let {
    medicationData,
    pillupSwitch,
    labParamsData,
    medicalHistoryData,
    gynecHistoryData,
  } = useSelector((state) => state.prescription);
  const {
    obstetricDetails: allObstetricDetails,
    isObstetricDetailsFetched,
    isNavigateToObstetric,
  } = useSelector((state) => state.obstetric);
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [assessmentsFormItems, setAssessmentsFormItems] = useState([]);
  const [assessmentValue, setAssessmentValue] = useState({});
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [value, setValue] = useState({});
  const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
  const [addObstetricHistoryDrawer, setAddObstetricHistoryDrawer] = useState(false);
  const [addMedicalHistoryDrawer, setAddMedicaHistoryDrawer] = useState(false);
  const [examinationValue, setExaminationValue] = useState({});

  const onExaminationRadioChange = (e, id) => {
    setExaminationValue({ ...examinationValue, [id]: e.target.value });
  };

  const handleLabParamsUpdate = () => {
    getLabParams(); // Update state with the new lab params data
  };

  const handleAssessmentChange = (key, e) => {
    const next = { ...assessmentValue, [key]: e.target.value };
    console.log('INTEL ==> next', next)
    setAssessmentValue(next);
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

  const handleObstetricHistory = () => {
    setAddObstetricHistoryDrawer(!addObstetricHistoryDrawer);
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
        {isEditable ? <div onClick={handleAddLabResults}>
          <GenericCard icon={plusIconColoured} title={"Add Lab Results"} />
        </div> : null}
      </div>
    );
  };

  const renderMedicalHistory = () => {
    return (
        <div className={`ipdaf-generic-card-container ${medicalHistoryData?.length ? 'ipdaf-padding-0': ''}`}>
        {medicalHistoryData?.length ? (
          <MedicalHistoryList  patientDataFromProps={patient_data}/>
        ) : null}
        {isEditable ? <div onClick={handleAddMedicalHistory}>
          <GenericCard icon={medicalHistoryData?.length ? editIcon : plusIconColoured} title={medicalHistoryData?.length ? "Add/Edit Past Medical History" : "Add Past Medical History"} />
        </div> : null}
      </div>
    )
  }

  const renderObstetricHistory = () => {
    return (
        <div className={`ipdaf-generic-card-container ipdaf-obstetrics-container ${dummyData?.generic ? 'ipdaf-padding-0': ''}`}>
        {dummyData?.generic ? (
            <>
                <GenericTable
                    title='Patient diagnosis'
                    columns={dummyData?.sectioned?.headings}
                    rows={dummyData?.sectioned?.values}
                />
                <SectionedTable
                    title={pregnancyHistory.title}
                    sections={pregnancyHistory.sections}
                />
            </>
        ) : null}
        {isEditable ? <div onClick={handleObstetricHistory}>
          <GenericCard icon={dummyData?.generic ? editIcon : plusIconColoured} title={dummyData?.generic ? "Add/Edit Obstetric History" : "Add Obstetric History"} />
        </div>: null}
      </div>
    )
  }

  const renderAutoFillButton = () => {
    return (
        <AutoFillButton
          onClick={() => {}}
          title={`Autofill Basic Info Details From OPD (15 Jun 2025)`}
        />
    )
  }
  const renderBasicInfo = () => {
    return (
      <CollapsibleWrapper
        title="Basic Info"
        icon={basicInfo}
        collapsible={isEditable} // TODO: INTEL - TO BE USED for view details screen
        width={"100%"}
        className={"collapsible-wrapper-class"}
        defaultOpen
        renderRightHeaderSection={isEditable ? renderAutoFillButton: null}
      >
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
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
          showAutoFill={isEditable}
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

        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="History of Present Illness"
          width="100%"
          icon={aidKit}
          showAutoFill={false}
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
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Lab Results"
          width="100%"
          containerClass="wrapper-class"
          icon={lab}
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
          renderBody={renderLabResultsBody}
        />
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Past Medical History"
          width="100%"
          containerClass="wrapper-class"
          icon={recordPad}
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
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Obstetric History"
          width="100%"
          containerClass="wrapper-class"
          icon={obstetrics}
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
      </CollapsibleWrapper>
    );
  };

  const renderExaminationSection = () => {
    return (
        <div className="examinations-parent-container">
            {IPD.EXAMINATION.map(item => {
            return (
                <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
                    initialValue={[
                        {
                        type: 'paragraph',
                        children: [{ text: '' }],
                        },
                    ]}
                    // title="Examination"
                    // width="100%"
                    // icon={aidKit}
                    showAutoFill={false}
                    opdDate="15 Jun 2025"
                    showMagicPenGif={false}
                    showMicrophone={false}
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
    )
  }

  const renderPhysicalExamination = () => {
    return (
        <CollapsibleWrapper
        title="Physical Examination"
        icon={vitalsDarkColoured}
        collapsible={isEditable}
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

        
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
            initialValue={[
                {
                type: 'paragraph',
                children: [{ text: '' }],
                },
            ]}
            title="Examination"
            width="100%"
            icon={aidKit}
            showAutoFill={false}
            opdDate="15 Jun 2025"
            showMagicPenGif={false}
            showMicrophone={false}
            placeholder={'Additional notes if any'}
            containerClass='wrapper-class examination-rich-container'
            renderBody={renderExaminationSection}
        />
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Others"
          width="100%"
          icon={galaxy}
          showAutoFill={false}
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter any other examination findings not covered above"}
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

        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Provisional Diagnosis"
          width="100%"
          icon={ddx}
          showAutoFill={false}
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter provisional diagnosis like suspected condition or working diagnosis"}
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
      </CollapsibleWrapper>
    )
  }

  const renderFunctionalAssessment = () => {
    return (
        <CollapsibleWrapper
        title="Functional Assessment"
        icon={vitalsDarkColoured}
        collapsible={isEditable}
        width={"100%"}
        className={"collapsible-wrapper-class"}
        defaultOpen
      >
        <div className='assessments-parent-container'>
            {IPD.FUNCTIONAL_ASSESSMENT.map(item => (
            <div key={item.key} className='assessment-card'>
                <div className='assessment-card-header'>
                <div className='assessment-title'>{item.title}:</div>
                </div>
                <ConfigProvider
                theme={{
                    components: {
                    Radio: {
                        colorPrimary: '#4B4AD5',
                        colorPrimaryHover: '#4B4AD5',
                        colorPrimaryActive: '#4B4AD5',
                    },
                    },
                }}
                >
                <Radio.Group
                    className='assessment-radio-group big-ring-radio'
                    options={item.options}
                    onChange={e => handleAssessmentChange(item.key, e)}
                    value={assessmentValue[item.key]}
                />
                </ConfigProvider>
            </div>
            ))}
        </div>
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Others"
          width="100%"
          icon={galaxy}
          showAutoFill={false}
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter any other examination findings not covered above"}
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
      </CollapsibleWrapper>
    )
  }

  const renderTreatmentPlan = () => {
    return (
        <CollapsibleWrapper
        title="Treatment Plan"
        icon={folderDark}
        collapsible={isEditable}
        width={"100%"}
        className={"collapsible-wrapper-class"}
        defaultOpen
      >
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Immediate Management"
          width="100%"
          icon={recordPad}
          showAutoFill={false}
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter immediate management like emergency interventions or initial treatment"}
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
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Monitoring Plan"
          width="100%"
          icon={vitals}
          showAutoFill={false}
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter monitoring plan like vitals charting, labs, or daily observations"}
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
      </CollapsibleWrapper>
    )
  }

  const renderNote = () => {
    return (
        <CollapsibleWrapper
        title="Additional Notes"
        icon={recordPadDark}
        collapsible={isEditable}
        width={"100%"}
        className={"collapsible-wrapper-class"}
        defaultOpen
      >
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Special Instructions"
          width="100%"
          icon={instructions}
          showAutoFill={false}
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter Special Instructions, Precautions or Additional Notes"}
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
        <RichTextEditWrapper readOnly={!isEditable} showToolbar={isEditable} showActionBtns={isEditable} 
          title="Discharge Criteria"
          width="100%"
          icon={doc}
          showAutoFill={false}
          containerClass="wrapper-class"
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          initialValue={[
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]}
          placeholder={"Enter discharge criteria like stable vitals, afebrile status etc"}
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
      </CollapsibleWrapper>
    )
  }

  const renderSections = useMemo(() => {
    return {
      basic: renderBasicInfo || (() => <>basic info</>),
      pe: renderPhysicalExamination || (() => <>Physial exam</>),
      func: renderFunctionalAssessment || (() => <>Functional Assessment</>),
      plan: renderTreatmentPlan || (() => <>Treatment Plan</>),
      note: renderNote || (() => (<>Note</>))
    };
  }, [examinationValue, value, assessmentValue]);

    useEffect(() => {
      const formItems = IPD.ASSESSMENTS_MENU.map(item => ({
        ...item,
        renderSection: renderSections[item.id],
      }));
      setAssessmentsFormItems(formItems);
    }, [renderSections]);
  
  return (
    <>
      <Suspense fallback={<>Loading ...</>}>
        <div className={`ipd-assessments-form-container ${!isEditable ? 'ipd-assessments-readable-container': ''}`} style={{"--backgroundColor": isEditable ? '#fff': '#FFFFFF80'}}>
        {(open && assessmentsFormItems) && (
            <LayoutWithMenu
            key="assessment"
            items={assessmentsFormItems}
            onRequestClose={() => {
                navigate(-1);
                return setOpen(false);
            }}
            headerOffset={72}
            />
        )}
        </div>
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
      {
        addObstetricHistoryDrawer && (
            <Drawer
                closeIcon={false}
                width={"100%"}
                placement="right"
                open={addObstetricHistoryDrawer}
                onClose={showHideBackModal}
                bodyStyle={{ backgroundColor: "white" }}
        >
            <Obstetric 
                obstetricDetails={obstetricDetails}
                obstetricDrawer={"pregnancyHistory"}
                handleDrawerObstetric={handleObstetricHistory}
                patientDataFromProps={patient_data}
            />
        </Drawer>
        )
      }
    </>
  );
};

export default AssessmentsForm;
