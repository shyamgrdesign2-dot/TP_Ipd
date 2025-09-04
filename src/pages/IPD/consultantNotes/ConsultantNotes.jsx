import patient_data from "../../../utils/patientMockData.json";
import React, {
  Suspense,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import { normalizeToDefault } from "../../../utils/utils";
import { aidKit, doc, vitals } from "../../../assets/images/icons";
import MedicationsBox from "../../../components/MedicationsBox";
import { Drawer } from "antd";
import {
  getLabParamsData,
  setGynecHistoryData,
} from "../../../redux/prescriptionSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InvestigationBox from "../../../components/InvestigationBox";

const LayoutWithMenu = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "LayoutWithMenu")
  );
});

const Customization = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "Customization")
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

const ConsultantNotes = (props) => {
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
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [consultantNotesFormItems, setConsultantNotesFormItems] = useState([]);
  const [assessmentValue, setAssessmentValue] = useState({});
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [value, setValue] = useState({});
  const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
  const [addObstetricHistoryDrawer, setAddObstetricHistoryDrawer] =
    useState(false);
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
    console.log("INTEL ==> next", next);
    setAssessmentValue(next);
  };

  const getLabParams = async () => {
    dispatch(
      getLabParamsData({
        patient_unique_id: patient_data?.details?.id,
      })
    ).catch((err) => {
      console.error("Error fetching lab params:", err);
    });
  };

  useEffect(() => {
    // fetch assessments form from api
  }, []);

  useEffect(() => {
    // fetch all the templates available
  }, []);

  const patientDataForOPDComponents = {
    pm_contact_no: patient_data?.details?.contact,
    pm_gender: patient_data?.details?.gender,
    patient_unique_id: patient_data?.details?.id,
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
  };

  const handleObstetricHistory = () => {
    setAddObstetricHistoryDrawer(!addObstetricHistoryDrawer);
  };

  const handleVitalsValue = (e, key) => {
    setValue({ ...value, [key]: e });
  };

  const renderAutoFillButton = () => {
    return (
      <AutoFillButton
        onClick={() => {}}
        title={`Autofill Basic Info Details From OPD (15 Jun 2025)`}
      />
    );
  };
  const renderClinicalAssessment = () => {
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title="Clinical Assessment & Plan"
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
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]}
        placeholder={
          "Enter clinical assessment & plan like patient’s condition and management steps"
        }
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
    );
  };

  const renderAdditionalRemarks = () => {
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title="Additional Remarks"
        width="100%"
        icon={doc}
        showAutoFill={false}
        containerClass="wrapper-class"
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        initialValue={[
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]}
        placeholder={"Enter additional remarks if any"}
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
    );
  };

  const renderVitals = () => {
    return (
      <div className="ipd-vitals-main-container">
        <div className="ipdaf-vitals-header">
          <img src={vitals} alt="vitals" />
          <div>{"Vitals"}</div>
        </div>
        <div className="ipdcn-vitals-container">
          {IPD.CONSULTANT_NOTES_VITALS?.map((vital) => {
            return (
              <UnitInput
                containerStyle={{ marginBottom: "20px" }}
                onChange={(e) => handleVitalsValue(e, vital.name)}
                value={value?.[vital?.name]}
                type="text"
                inputMode="decimal"
                {...vital}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderSections = useMemo(() => {
    return {
      clinicalAssessment: renderClinicalAssessment,
      vitals: renderVitals,
      medication: () => (
        <div className="ipdaf-box-container">
          <MedicationsBox />
        </div>
      ),
      labInvestigation: () => (
        <div className="ipdaf-box-container">
          <InvestigationBox />
        </div>
      ),
      remarks: renderAdditionalRemarks,
    };
  }, [examinationValue, value, assessmentValue]);

  useEffect(() => {
    const formItems = IPD.CONSULTANT_NOTES_MENU.map((item) => ({
      ...item,
      renderSection: renderSections[item.id],
    }));

    setConsultantNotesFormItems(formItems);
  }, [renderSections]);

  return (
    <div className="afipd-assessments-form-container">
      <Suspense fallback={<>Loading ...</>}>
        <div
          className={`ipd-assessments-form-container ${
            !isEditable ? "ipd-assessments-readable-container" : ""
          }`}
          style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
        >
          {open && consultantNotesFormItems && (
            <LayoutWithMenu
              onCustomiseClick={() => setShowCustomisationDrawer(true)}
              key="consult"
              items={consultantNotesFormItems}
              onRequestClose={() => {
                navigate(-1);
                return setOpen(false);
              }}
              headerOffset={72}
              header="Consultant Notes"
              saveButtonText="Save"
            />
          )}
        </div>
      </Suspense>
      {showCustomisationDrawer && (
        <Drawer
          closeIcon={true}
          width={"100%"}
          placement="right"
          title="Customise Your Form"
          open={showCustomisationDrawer}
          onClose={() => setShowCustomisationDrawer(false)}
          bodyStyle={{ backgroundColor: "white" }}
        >
          <Suspense fallback={<>Loading ...</>}>
            <Customization
              onModelChange={(data) => {
                console.log("INTEL ==> model change", data);
              }}
              customModel={IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE}
            />
          </Suspense>
        </Drawer>
      )}
    </div>
  );
};

export default ConsultantNotes;
