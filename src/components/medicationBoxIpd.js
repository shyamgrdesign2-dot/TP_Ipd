import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { AutoComplete, Input, Button, Form, Row, Col, Select, Popover, Tabs, Spin, Tooltip, Drawer, message, Switch, Tour, Card, Radio } from "antd";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button as BSButton, ButtonGroup as BSButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CommonModal from '../common/CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';
import CashManagerContext from '../context/CashManagerContext';
import { errorMessage, onlyNumberFormat, removeBeforeWhiteSpace, frequencyFormat, frequencyCombination, isNumeric, onlyDecimalFormat, capitalizeAfterSentence, replaceCommasAndSemicolons, capitalize, hasNumber, isAlphabetExit, calculateDose, getClinicName, mergeArraysOfObjects, formatDateToShortMonthYear } from "../utils/utils";
import Medicationicon from "../assets/images/Medication.svg";
import TimingInfo from "../assets/images/TimingInfo.svg";
import noRecordFound from '../assets/images/no-record-round.svg';
import calculatorIcon from '../assets/images/calculator.svg';
import calculatorIconBlue from '../assets/images/calculator-blue.svg';
import visitEnd from '../assets/images/end-visit.svg';
import imgCloseVisit from '../assets/images/close-visit.svg';
import { MenuOutlined } from '@ant-design/icons';
import tagNew from '../../src/assets/images/tag-new.svg';
import Pillup from '../assets/images/pillup.svg';
import editIcon from "../assets/images/edit.svg";

import { useFeatureIsOn } from "@growthbook/growthbook-react";

import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getMedicationTemplates,
  getFrequentlySearchedMedication,
  searchMedication,
  singleTemplateDetails,
  getMedicineDetails,
  getLoadPreviousRx,
  searchGeneric,
  addMedicine,
  editMedicine,
  updateFrequentlyMedication,
  getAllDoses
} from "../redux/medicationSlice";
import { EXTRA_OPTIONS, GB_PILLUP_MEDICINE, MESSAGE_KEY } from "../utils/constants";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DoseCalculator from "./dose_calculator/doseCalculator";
import { upsertDoctorSettingFlag } from "../redux/doctorsSlice";
import { useLocation } from "react-router-dom";
import { clearMedicationData, setMedicationData, setPillupSwitch } from "../redux/prescriptionSlice";
import TabMedicationSearch from "./tab_design/TabMedicationSearch";
import TabMedicationMoreModal from "./tab_design/TabMedicationMoreModal";
import { createRemoteComponent } from "../shared/remoteComponents";

const AutoFillButton = createRemoteComponent("AutoFillButton");

const { TextArea } = Input;

function MedicationsBox(props) {
  const { isEditable = true, medication: medicationFromProps = [] } = props;
  const { profile, frequencyList, timingList, medicineTypeList } = useSelector((state) => state.doctors);
  const {
    dosesList,
    parentOptionsList,
    templates,
    genericList,
    loading,
  } = useSelector((state) => state.medication);
  const { todayData } = useSelector((state) => state.vitals);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data = {}, caseManagerData } = state || {};
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const [autoFillButtonRef, setAutoFillButtonRef] = useState(null);
  const { lastPrescriptionDataForAssessment, lastPrescriptionDate } =
    useSelector((state) => state.assessment);
  const { lastRxDate } = lastPrescriptionDate || {};

  let { medicationData: medicationDataFromStore, pillupSwitch } = useSelector((state) => state.prescription);
  const medicationData = medicationFromProps?.length ? medicationFromProps : medicationDataFromStore || [];

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [removeTemplateId, setRemoveTemplateId] = useState(null);

  const [searchParentQuery, setSearchParentQuery] = useState("");
  const [parentSearchOptions, setParentSearchOptions] = useState([]);

  const [unitPerDoseOptions, setUnitPerDoseOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  const [sinceOptions, setSinceOptions] = useState(EXTRA_OPTIONS);
  const [tourOpen, setTourOpen] = useState(false);
  const [popOver3, setPopOver3] = useState(false);
  const SINCE_OPTIONS = [
    { value: "Day(s)", label: "Days" },
    { value: "Week(s)", label: "Weeks" },
    { value: "Month(s)", label: "Months" },
    { value: "Year(s)", label: "Years" },
  ];

  //PopOver2
  const [popOver2, setPopOver2] = useState(false);
  const [inputTemplateName, setInputTemplateName] = useState(null);
  const TAB_ADD_TEMPLATE = 1;
  const TAB_UPDATE_TEMPLATE = 2;
  const ADD_EDIT_TEMPLATE_TABS = [
    { key: TAB_ADD_TEMPLATE, label: "New Template" },
    { key: TAB_UPDATE_TEMPLATE, label: "Update Template" },
  ];
  const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);

  //Add Custom
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [addCustom, setAddCustom] = useState(null);
  const [genericQuery, setGenericQuery] = useState('');

  //Dose Calculator
  const [activeTab, setActiveTab] = useState("1");
  const [doseCalculatorDrawer, setDoseCalculatorDrawer] = useState(false);
  const [searchMLQuery, setSearchMLQuery] = useState("");
  const [medicationLibrary, setMedicationLibrary] = useState([]);
  const [editDoseId, setEditDoseId] = useState(0);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const [parentDrawer, setParentDrawer] = useState(false);
  const [childDrawer, setChildDrawer] = useState(false);
  const [childDrawerData, setChildDrawerData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [childIndex, setChildIndex] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [sinceValue, setSinceValue] = useState(1);
  const [inputSince, setInputSince] = useState("");
  const [timingMoreOptionsVisible, setTimingMoreOptionsVisible] = useState(false);
  const [frequencyMoreOptionsVisible, setFrequencyMoreOptionsVisible] = useState(false);
  const [durationMoreOptionsVisible, setDurationMoreOptionsVisible] = useState(false);

  const isPillUpAccessableFromGB = useFeatureIsOn(GB_PILLUP_MEDICINE);

  const filteredTitles = frequencyList.filter((item) => item.tmf_block !== 0);

  const handleViewDoseCalcDrawer = (tab, value) => {
    setDoseCalculatorDrawer(!doseCalculatorDrawer)
    setActiveTab(typeof tab == 'string' ? tab : '1')
    setEditDoseId(isNumeric(value) ? value : 0)
    setSearchMLQuery("")
    setMedicationLibrary([])
    setAddCustom(null)
  }

  useEffect(() => {
    dispatch(getMedicationTemplates());
    dispatch(getAllDoses())
  }, []);

  useEffect(() => {
    setMatchedTemplates(templates);
    setAllTemplates(templates);
  }, [templates]);

  //Parent AutoComplete
  useEffect(() => {
    if (searchParentQuery || searchMLQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchMedication({ searchQuery: doseCalculatorDrawer ? searchMLQuery : searchParentQuery, type: "parent" })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(getFrequentlySearchedMedication());
    }
  }, [doseCalculatorDrawer, searchMLQuery, searchParentQuery]);

  useEffect(() => {
    const data = [];
    parentOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.tmm_medicine_name,
        label: <div><span className="fw-medium">{e.tmm_medicine_name}</span>, <span>{e.tmm_generic}</span>  {(e?.tmm_hm_type === 1 && e?.um_id === 0) && <span className="align-items-center small fs-12-1 d-inline-flex justify-content-center rounded-circle text-white" style={{ width: 18, height: 18, background: '#c44ea2' }}>Z</span>}</div>,
      });
    });
    if (doseCalculatorDrawer) {
      if (searchMLQuery.length == 0) {
        data.unshift({
          key: -1,
          label: (
            <>
              <div>FREQUENTLY USED</div>
            </>
          ),
        });
      } else {
        searchMLQuery &&
          data.push({
            key: JSON.stringify({
              unique_id: uuidv4(),
              tmm_id: 0,
              tmm_medicine_name: searchMLQuery
            }),
            value: `${searchMLQuery}${Math.random()}`,
            label: (
              <>
                <div className="text-primary fontroboto fs-16"> <i className="icon-Add mx-1 fs-6"></i> Add <span className="fw-medium fontroboto text-primary">"{searchMLQuery}"</span> <a className="text-primary fontroboto">as a new medicine</a></div>
              </>
            ),
          });
      }
    } else {
      if (searchParentQuery.length == 0) {
        data.unshift({
          key: -1,
          label: (
            <>
              <div>FREQUENTLY USED</div>
            </>
          ),
        });
      } else {
        searchParentQuery &&
          data.push({
            key: JSON.stringify({
              unique_id: uuidv4(),
              tmm_id: 0,
              tmm_medicine_name: searchParentQuery
            }),
            value: `${searchParentQuery}${Math.random()}`,
            label: (
              <>
                <div className="text-primary fontroboto fs-16"> <i className="icon-Add mx-1 fs-6"></i> Add <span className="fw-medium fontroboto text-primary">"{searchParentQuery}"</span> <a className="text-primary fontroboto">as a new medicine</a></div>
              </>
            ),
          });
      }
    }
    setParentSearchOptions(data);
  }, [doseCalculatorDrawer, parentOptionsList]);

  const onSearchParent = useCallback(
    (query) => {
      doseCalculatorDrawer ?
        setSearchMLQuery(removeBeforeWhiteSpace(query)) :
        setSearchParentQuery(removeBeforeWhiteSpace(query));
    },
    [doseCalculatorDrawer, searchMLQuery, searchParentQuery]
  );

  const onSelectParent = async (data, item) => {
    if (JSON.parse(item.key).tmm_id === 0) {
      showHideAddMedicineModal()
      setAddCustom(JSON.parse(item.key));
    } else {
      window.Moengage.track_event("medicine_select", {
        "value": JSON.parse(item.key).tmm_medicine_name
      });

      if (doseCalculatorDrawer) {
        const medicineExists = medicationLibrary.some((med) => med.tmm_id == JSON.parse(item.key).tmm_id);

        if (medicineExists) {
          message.open({
            key: MESSAGE_KEY,
            type: '',
            className: 'message-appointment',
            content: (
              <div className='d-flex align-items-center'>
                <InfoCircleOutlined className="fs-21 me-2 circle-outlined-custom" />
                <div>
                  <div className='text-start fs-18 fontroboto'>This medicine is already added. You can't add it again</div>
                </div>
                <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
              </div>
            ),
            duration: 3,
          });
          return;
        }
      }

      const action = await dispatch(getMedicineDetails(JSON.parse(item.key).tmm_id));
      if (action.meta.requestStatus === "fulfilled") {
        const updatedData = action.payload.map((e) => {

          const medicineUnit = e?.medicineUnit.map((e1) => {
            return {
              key: JSON.stringify({ ...e1 }),
              value: e1.tmu_id,
              label: String(e1.tmu_title || ""),
            };
          });

          const unitObj = medicineUnit ? medicineUnit.find((x) => x.value == e.tmm_unit) : null;
          const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
          const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

          let doseCalData = {}
          const objDose = dosesList.find((e1) => e1.medicine_id == e.tmm_id)
          if (objDose !== undefined) {
            const dose = calculateDose(objDose?.dosage, todayData?.weight, objDose?.concentration)
            doseCalData['tmm_dosage_unit_name'] = `${dose ? `${dose} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`;
            doseCalData['tmm_dosage'] = dose ? dose : "";
            doseCalData['tmm_unit_name'] = unitObj && unitObj !== undefined ? unitObj.tmu_title : "";
            doseCalData['tmm_unit'] = unitObj && unitObj !== undefined ? unitObj.tmu_id : "";
            doseCalData['tmu_id'] = unitObj && unitObj !== undefined ? unitObj.tmu_id : "";
          } else {
            doseCalData['tmm_dosage_unit_name'] = `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`;
            doseCalData['tmm_unit_name'] = unitObj && unitObj !== undefined ? unitObj.tmu_title : "";
          }

          return {
            ...e,
            objectID: JSON.parse(item.key).objectID,
            // tmm_unit_name: unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
            tmm_freq_type_name:
              e.tmf_block == 0
                ? `${e.tcm_tmm_freq_morning && e.tcm_tmm_freq_morning != 0
                  ? e.tcm_tmm_freq_morning + " - "
                  : "0 -"
                }${e.tcm_tmm_freq_afternoon && e.tcm_tmm_freq_afternoon != 0
                  ? e.tcm_tmm_freq_afternoon + " - "
                  : "0 -"
                }${e.tcm_tmm_freq_evening && e.tcm_tmm_freq_evening != 0
                  ? e.tcm_tmm_freq_evening + " - "
                  : ""
                }${e.tcm_tmm_freq_night && e.tcm_tmm_freq_night != 0
                  ? e.tcm_tmm_freq_night
                  : "0"}`
                : frequencyObj !== undefined
                  ? frequencyObj.tmf_title
                  : "",
            tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
            tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
            // tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
            tmm_days_duration_type: EXTRA_OPTIONS.some((x) => x.value == e.tmm_duration_type) ? e.tmm_duration_type : e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : "",
            unique_id: uuidv4(),
            ...doseCalData
          };
        });
        if (doseCalculatorDrawer) {
          const modifyData = updatedData[0]
          const objDose = dosesList.find((e1) => e1.medicine_id == modifyData.tmm_id)
          const newMedicine = {
            ...modifyData,
            tmm_dosage_unit_name: "",
            tmm_dosage: '',
            tmm_unit: 0,
            tmm_unit_name: '',
            tmu_id: 0,
            id: objDose !== undefined ? objDose?.id : "",
            medicine_id: modifyData.tmm_id,
            dosage: objDose !== undefined ? objDose?.dosage : "",
            dosage_unit: "mg/kg/dose",
            concentration: objDose !== undefined ? objDose?.concentration : "",
            concentration_unit: "mg/ml",
            medicine_name: modifyData.tmm_medicine_name,
            medicine_generic_name: modifyData.tmm_generic,
            exist: dosesList.some((e1) => e1.medicine_id == modifyData.tmm_id) ? true : false
          };
          setMedicationLibrary(prev => [...prev, newMedicine]);
          setSearchMLQuery("");
          setAddCustom(null);
        } else {
          // const next =  [...medicationData, updatedData?.[0]];
          // dispatch(setMedicationData(next));
          // setSearchParentQuery("");
          // setAddCustom(null);

          // Immutable add for medicationData
          const updatedMedicationData = [...medicationData, { ...updatedData[0] }];
          dispatch(setMedicationData(updatedMedicationData));
          setSelectedIndex(updatedMedicationData.length - 1);
          // Only then open parent drawer
          handleDrawerParent();
        }

      } else {
        errorMessage(action.error)
      }
    }
  };

  const onSearchUnitPerDoseChid = useCallback(
    (query, i) => {
      const updateQuery = onlyDecimalFormat(query);
      
      // Create a new array with updated medication data
      const updatedMedicationData = medicationData.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            tmm_dosage_unit_name: updateQuery,
            tmm_dosage: '',
            tmm_unit: 0,
            tmm_unit_name: '',
            tmu_id: 0,
          };
        }
        return item;
      });
      
      dispatch(setMedicationData(updatedMedicationData));
      
      if (updateQuery) {
        const options = medicationData[i].medicineUnit.map((e) => {
          return {
            key: JSON.stringify({ ...e, tmm_dosage: updateQuery, unique_id: uuidv4() }),
            value: `${updateQuery} ${e.tmu_title}`,
            label: <>{`${updateQuery} ${e.tmu_title}`}</>,
          };
        });
        setUnitPerDoseOptions(options);
      } else {
        setUnitPerDoseOptions([]);
      }
    },
    [unitPerDoseOptions, medicationData]
  );

  // Utility function to normalize medicineUnit format
  const normalizeMedicineUnit = (medicineUnit = []) => {
    // Check if already in correct format
    const isFormatted =
      medicineUnit.length > 0 &&
      Object.prototype.hasOwnProperty.call(medicineUnit[0], "key");

    if (isFormatted) return medicineUnit; // ✅ Already formatted

    // Otherwise, convert raw data to formatted
    return medicineUnit.map((e1) => ({
      key: JSON.stringify(e1),
      value: e1.tmu_id,
      label: String(e1.tmu_title || ""),
    }));
  };


  const onBlurUnitPerDoseChid = useCallback(
    async (i) => {
      const currentItem = medicationData[i];
      if (!isAlphabetExit(currentItem.tmm_dosage_unit_name)) {
        setUnitPerDoseOptions([]);
        
        // Create a new array with updated medication data
        const updatedMedicationData = medicationData.map((item, index) => {
          if (index === i) {
            return {
              ...item,
              tmm_dosage_unit_name: "",
              tmm_dosage: '',
              tmm_unit: 0,
              tmm_unit_name: '',
              tmu_id: 0,
            };
          }
          return item;
        });
        
        dispatch(setMedicationData(updatedMedicationData));
      }
    },
    [unitPerDoseOptions, medicationData]
  );

  const onSelectUnitPerDoseChild = useCallback(
    (data, e, i) => {
      setUnitPerDoseOptions([]);
      const objParse = JSON.parse(e.key);
      
      // Create a new array with updated medication data
      const updatedMedicationData = medicationData.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            tmm_dosage_unit_name: data,
            tmm_dosage: objParse.tmm_dosage,
            tmm_unit: objParse.tmu_id,
            tmm_unit_name: objParse.tmu_title,
            tmu_id: objParse.tmu_id,
          };
        }
        return item;
      });
      
      dispatch(setMedicationData(updatedMedicationData));
    },
    [unitPerDoseOptions, medicationData]
  );

  // const onSelectSeverityChild = useCallback(
  //   (data, i) => {
  //     if (data) {
  //       const objParse = JSON.parse(data);
  //       medicationData[i].tmm_freq_type = objParse.tmf_id;
  //       medicationData[i].tmm_freq_type_name = objParse.tmf_title;
  //       medicationData[i].tmf_block_val = objParse.tmf_block_val;
  //     } else {
  //       medicationData[i].tmm_freq_type = 0;
  //       medicationData[i].tmm_freq_type_name = '';
  //       medicationData[i].tmf_block_val = 0;
  //     }
  //     setMedicationData(medicationData);
  //   },
  //   [medicationData]
  // );

  const [frequencyQuery, setFrequencyQuery] = useState('');

  const onBlurFrequencyChild = useCallback(
    async (i) => {
      if (isNumeric(frequencyQuery) && frequencyQuery.length <= 3) {
        medicationData[i].tmm_freq_type_name = `${frequencyQuery[0]}-${frequencyQuery[1] ? frequencyQuery[1] : 0}-${frequencyQuery[2] ? frequencyQuery[2] : 0}`;
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery[1] ? frequencyQuery[1] : 0;
        medicationData[i].tcm_tmm_freq_evening = 0;
        medicationData[i].tcm_tmm_freq_morning = frequencyQuery[0];
        medicationData[i].tcm_tmm_freq_night = frequencyQuery[2] ? frequencyQuery[2] : 0;
        dispatch(setMedicationData(medicationData));
      } else if (isNumeric(frequencyQuery) && frequencyQuery.length >= 4) {
        medicationData[i].tmm_freq_type_name = `${frequencyQuery[0]}-${frequencyQuery[1] ? frequencyQuery[1] : 0}-${frequencyQuery[2] ? frequencyQuery[2] : 0}-${frequencyQuery[3] ? frequencyQuery[3] : 0}`;
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery[1] ? frequencyQuery[1] : 0;
        medicationData[i].tcm_tmm_freq_evening = frequencyQuery[2] ? frequencyQuery[2] : 0;
        medicationData[i].tcm_tmm_freq_morning = frequencyQuery[0];
        medicationData[i].tcm_tmm_freq_night = frequencyQuery[3] ? frequencyQuery[3] : 0;
        dispatch(setMedicationData(medicationData));
      } else if (!frequencyFormat(medicationData[i].tmm_freq_type_name) && filteredTitles.findIndex((x) => x.tmf_title == medicationData[i].tmm_freq_type_name) == -1) {
        medicationData[i].tmm_freq_type_name = "";
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = 0;
        medicationData[i].tcm_tmm_freq_evening = 0;
        medicationData[i].tcm_tmm_freq_morning = 0;
        medicationData[i].tcm_tmm_freq_night = 0;
        dispatch(setMedicationData(medicationData));
      } else if (frequencyFormat(medicationData[i].tmm_freq_type_name)) {
        medicationData[i].tmm_freq_type_name = frequencyQuery;
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        if (frequencyQuery.split("-")[3] !== undefined) {
          medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery.split("-")[1] ? frequencyQuery.split("-")[1] : 0;
          medicationData[i].tcm_tmm_freq_evening = frequencyQuery.split("-")[2] ? frequencyQuery.split("-")[2] : 0;
          medicationData[i].tcm_tmm_freq_morning = frequencyQuery.split("-")[0] ? frequencyQuery.split("-")[0] : 0;
          medicationData[i].tcm_tmm_freq_night = frequencyQuery.split("-")[3] ? frequencyQuery.split("-")[3] : 0;
        } else {
          medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery.split("-")[1] ? frequencyQuery.split("-")[1] : 0;
          medicationData[i].tcm_tmm_freq_evening = 0;
          medicationData[i].tcm_tmm_freq_morning = frequencyQuery.split("-")[0] ? frequencyQuery.split("-")[0] : 0;
          medicationData[i].tcm_tmm_freq_night = frequencyQuery.split("-")[2] ? frequencyQuery.split("-")[2] : 0;
        }
        dispatch(setMedicationData(medicationData));
      }
    },
    [medicationData]
  );

  const onSearchFrequencyChild = useCallback(
    async (query, i) => {
      setFrequencyQuery(query)
      if (query) {

        const data = [];

        const updateQuery = frequencyFormat(query);

        if (updateQuery) {
          const combinationList = await frequencyCombination(query)
          combinationList.map((option) => {
            return data.push({
              value: JSON.stringify({ tmf_id: 0, tmf_title: option, tmf_block: 0, tmf_block_val: "", unique_id: uuidv4() }),
              label: <>{option}</>,
            });
          });
        }

        filteredTitles.map((option) => {
          return data.push({
            value: JSON.stringify({ ...option, unique_id: uuidv4() }),
            label: <>{option.tmf_title}</>,
          });
        });

        setFrequencyOptions(data)

        medicationData[i].tmm_freq_type_name = query;
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = 0;
        medicationData[i].tcm_tmm_freq_evening = 0;
        medicationData[i].tcm_tmm_freq_morning = 0;
        medicationData[i].tcm_tmm_freq_night = 0;
        dispatch(setMedicationData(medicationData));
      }
    },
    [frequencyOptions, medicationData]
  );

  const onSelectFrequencyChild = useCallback(
    (data, i) => {
      if (data) {
        const objParse = JSON.parse(data);
        setFrequencyQuery(objParse.tmf_title)
        medicationData[i].tmm_freq_type_name = objParse.tmf_title;
        medicationData[i].tmf_block = objParse.tmf_block;
        medicationData[i].tmf_block_val = objParse.tmf_block_val;
        medicationData[i].tmm_freq_type = objParse.tmf_id;
        if (objParse.tmf_title.split("-")[3] !== undefined) {
          medicationData[i].tcm_tmm_freq_afternoon = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[1] ? objParse.tmf_title.split("-")[1] : 0;
          medicationData[i].tcm_tmm_freq_evening = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[2] ? objParse.tmf_title.split("-")[2] : 0;
          medicationData[i].tcm_tmm_freq_morning = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[0] ? objParse.tmf_title.split("-")[0] : 0;
          medicationData[i].tcm_tmm_freq_night = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[3] ? objParse.tmf_title.split("-")[3] : 0;
        } else {
          medicationData[i].tcm_tmm_freq_afternoon = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[1] ? objParse.tmf_title.split("-")[1] : 0;
          medicationData[i].tcm_tmm_freq_evening = 0;
          medicationData[i].tcm_tmm_freq_morning = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[0] ? objParse.tmf_title.split("-")[0] : 0;
          medicationData[i].tcm_tmm_freq_night = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[2] ? objParse.tmf_title.split("-")[2] : 0;
        }
      } else {
        setFrequencyQuery("")
        medicationData[i].tmm_freq_type_name = "";
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = 0;
        medicationData[i].tcm_tmm_freq_evening = 0;
        medicationData[i].tcm_tmm_freq_morning = 0;
        medicationData[i].tcm_tmm_freq_night = 0;
      }
      dispatch(setMedicationData(medicationData));
    },
    [medicationData]
  );

  const onSelectTimingChild = useCallback(
    (data, i) => {
      if (data) {
        const objParse = JSON.parse(data);
        medicationData[i].tmm_time = objParse.tmt_id;
        medicationData[i].tmm_time_name = objParse.tmt_title;
      } else {
        medicationData[i].tmm_time = 0;
        medicationData[i].tmm_time_name = '';
      }
      dispatch(setMedicationData(medicationData));
    },
    [medicationData]
  );

  const onSearchSinceChid = useCallback(
    (query, i) => {
      const updateQuery = onlyNumberFormat(query);
      medicationData[i].tmm_days_duration_type = updateQuery;
      medicationData[i].tmm_days = '';
      medicationData[i].tmm_duration_type = '';
      dispatch(setMedicationData(medicationData));
      if (updateQuery) {
        const options = SINCE_OPTIONS.map((option) => {
          return {
            key: JSON.stringify({ ...option, tmm_days: parseInt(updateQuery), unique_id: uuidv4() }),
            value: `${updateQuery} ${option.value}`,
            label: <>{`${updateQuery} ${option.label}`}</>,
          };
        });
        setSinceOptions(options);
      } else {
        setSinceOptions(EXTRA_OPTIONS);
      }
    },
    [sinceOptions, medicationData]
  );

  const onSelectSinceChild = useCallback(
    (data, e, i) => {
      setSinceOptions(EXTRA_OPTIONS);
      const objParse = JSON.parse(e.key);
      medicationData[i].tmm_days_duration_type = data;
      medicationData[i].tmm_days = objParse.tmm_days;
      medicationData[i].tmm_duration_type = objParse.value;
      dispatch(setMedicationData(medicationData));
    },
    [sinceOptions, medicationData]
  );

  const onAutoFillDuration = () => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const { tmm_days_duration_type, tmm_days, tmm_duration_type } = childDrawerData[childIndex];
    const updatedChildDrawerData = childDrawerData.map(e => ({
      ...e,
      tmm_days_duration_type,
      tmm_days,
      tmm_duration_type
    }));
    setChildDrawerData(updatedChildDrawerData);
    const updatedMedicationData = medicationData.map(e => ({
      ...e,
      tmm_days_duration_type,
      tmm_days,
      tmm_duration_type
    }));
    dispatch(setMedicationData(updatedMedicationData));
    message.open({
      key: MESSAGE_KEY,
      type: '',
      className: 'message-appointment',
      content: (
        <div className='d-flex align-items-center'>
          <img src={visitEnd} className='me-2' />
          <div>
            <div className='text-start fs-18 fontroboto'>Autofilled this Duration to all medicines</div>
          </div>
          <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
        </div>
      ),
      duration: 3,
    });
  }

  // Child drawer helper functions
  const updateChild = async (item) => {
    if (item?.length > 0) {
      onRemoveRow(selectedIndex, item);
    } else {
      onRemoveRow(selectedIndex);
    }
    handleDrawerChild();
  }

  const onChange = (unique_id) => {
    setActiveKey(unique_id);
    setChildIndex(childDrawerData?.findIndex(e => e.unique_id == unique_id))
    const data = childDrawerData?.find(e => e.unique_id == unique_id)
    setSinceValue(data && data?.tmm_days ? parseInt(data?.tmm_days) : 1);
  }

  useEffect(() => {
    if (childIndex != null) {
      const selectedMedication = childDrawerData?.[childIndex];
      if (selectedMedication?.tmf_block > 0) {
        setSelectedTab("other");
      } else {
        if (selectedMedication?.tcm_tmm_freq_evening) {
          setSelectedTab("mean");
        } else {
          setSelectedTab("man");
        }
      }
    }
  }, [childIndex]);

  const onEdit = (unique_id, action, item) => {
    if (action === 'add') {
      taperDoseAdd(item);
    } else {
      if (!Array.isArray(childDrawerData)) return;
      const index = childDrawerData.findIndex(e => e.unique_id == unique_id);
      if (index != -1) {
        const updated = childDrawerData.filter(e => e.unique_id !== unique_id);
        setChildDrawerData(updated);
        const checkIndex = updated.findIndex(e => e.unique_id == activeKey);
        if (checkIndex != -1) {
          setChildIndex(checkIndex);
        } else {
          setChildIndex(selectedIndex);
          setActiveKey(updated[selectedIndex]?.unique_id);
        }
      }
    }
  };

  // Radio button change handler
  const handleRadioChange = useCallback(
    (e) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      setSelectedTab(e.target.value);
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? {
          ...item,
          tmf_block: e.target.value !== "other" ? 0 : 1,
          tmm_freq_type: 0,
          tmm_freq_type_name: "",
          tcm_tmm_freq_afternoon: 0,
          tcm_tmm_freq_evening: 0,
          tcm_tmm_freq_morning: 0,
          tcm_tmm_freq_night: 0
        } : item
      );
      setChildDrawerData(updated);
    },
    [selectedTab, childDrawerData, childIndex]
  );

  // More options visibility handlers
  const handleTimingMoreOptionsVisible = useCallback(
    () => {
      setTimingMoreOptionsVisible(!timingMoreOptionsVisible)
    },
    [timingMoreOptionsVisible]
  );

  const handleFrequencyMoreOptionsVisible = useCallback(
    () => {
      setFrequencyMoreOptionsVisible(!frequencyMoreOptionsVisible)
    },
    [frequencyMoreOptionsVisible]
  );

  const handleDurationMoreOptionsVisible = useCallback(
    () => {
      setDurationMoreOptionsVisible(!durationMoreOptionsVisible)
    },
    [durationMoreOptionsVisible]
  );

  const onChangeDosageChild = useCallback(
    (e) => {
      if (
        !Array.isArray(childDrawerData) ||
        childIndex === null ||
        !childDrawerData[childIndex]
      ) {
        console.warn("onChangeDosageChild: Invalid childDrawerData or childIndex");
        return;
      }
  
      const updateQuery = onlyDecimalFormat(e.target.value);
      const currentItem = childDrawerData[childIndex];
      const currentUnitName = currentItem?.tmm_unit_name || "";
  
      const updated = childDrawerData.map((item, idx) =>
        idx === childIndex
          ? {
              ...item,
              tmm_dosage: updateQuery,
              tmm_dosage_unit_name:
                updateQuery && currentUnitName
                  ? `${updateQuery} ${currentUnitName}`
                  : updateQuery || "",
            }
          : item
      );
  
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );
  

  const onSelectMedicineUnitChild = useCallback(
    (data) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) {
        console.warn('onSelectMedicineUnitChild: Invalid childDrawerData or childIndex');
        return;
      }
  
      const medicineUnit = childDrawerData[childIndex]?.medicineUnit || [];
      const selected =
        medicineUnit.find((e) => e.value == data || e.tmu_id == data);
  
      if (!selected) return;
  
      const parsedObj = selected.key
        ? JSON.parse(selected.key)
        : {
            tmu_id: selected.tmu_id ?? selected.value,
            tmu_title: selected.tmu_title ?? selected.label,
          };
  
      const updated = childDrawerData.map((item, idx) => {
        if (idx !== childIndex) return item;
  
        const dosage = item.tmm_dosage || "";
        const unitName = parsedObj.tmu_title || "";
        const dosageUnitName = dosage && unitName ? `${dosage} ${unitName}` : `1 ${unitName}`;
  
        return {
          ...item,
          tmm_unit: parsedObj.tmu_id,
          tmm_unit_name: parsedObj.tmu_title,
          tmu_id: parsedObj.tmu_id,
          tmm_dosage_unit_name: dosageUnitName,
        };
      });
  
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );  
  

  useEffect(() => {
    if (sinceValue !== -1) {
      const options = SINCE_OPTIONS.map((option) => {
        return {
          key: Math.random(),
          value: `${sinceValue} ${option.value}`,
          label: <>{`${sinceValue}${option.label}`}</>,
        };
      });
      setSinceOptions(options);
    } else if (inputSince.length > 0) {
      const options = SINCE_OPTIONS.map((option) => {
        return {
          key: Math.random(),
          value: `${inputSince} ${option.value}`,
          label: <>{`${inputSince}${option.label}`}</>,
        };
      });
      setSinceOptions(options);
    } else {
      const options = SINCE_OPTIONS.map((option) => {
        return {
          key: Math.random(),
          value: `${option.value}`,
          label: <>{`${option.label}`}</>,
        };
      });
      setSinceOptions(options);
    }
  }, [sinceValue]);

  const onChangeInputSinceChild = useCallback(
    (e) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      const updateQuery = onlyNumberFormat(e.target.value);
      setInputSince(updateQuery);
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tmm_days: 0, tmm_duration_type: "" } : item
      );
      setChildDrawerData(updated);
      if (updateQuery.length > 0) {
        const options = SINCE_OPTIONS.map((option) => {
          return {
            key: Math.random(),
            value: `${updateQuery} ${option.value}`,
            label: <>{`${updateQuery}${option.label}`}</>,
          };
        });
        setSinceOptions(options);
      } else {
        const options = SINCE_OPTIONS.map((option) => {
          return {
            key: Math.random(),
            value: option.value,
            label: <>{`${option.label}`}</>,
          };
        });
        setSinceOptions(options);
      }
    },
    [inputSince, sinceOptions, childDrawerData]
  );

  const onChangeSegmentedSinceChild = useCallback(
    (key) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      setSinceValue(key);
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tmm_days: 0, tmm_duration_type: "" } : item
      );
      setChildDrawerData(updated);
    },
    [sinceValue, childIndex, childDrawerData]
  );

  // Constants for child drawer
  const SINCE_LIST = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    {
      value: -1,
      label: (
        <Input
          className="w-100 custom-segment-input inputheight45 border-0"
          placeholder="Custom"
          value={inputSince}
          inputMode="numeric"
          onChange={onChangeInputSinceChild}
          onClick={() => onChangeSegmentedSinceChild(-1)}
        />
      ),
    },
  ];

  const onChangeInputMorningChild = useCallback(
    (e) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      const updateQuery = onlyDecimalFormat(e.target.value);
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tcm_tmm_freq_morning: updateQuery } : item
      );
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );

  const onChangeInputAfternoonChild = useCallback(
    (e) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      const updateQuery = onlyDecimalFormat(e.target.value);
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tcm_tmm_freq_afternoon: updateQuery } : item
      );
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );

  const onChangeInputEveningChild = useCallback(
    (e) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      const updateQuery = onlyDecimalFormat(e.target.value);
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tcm_tmm_freq_evening: updateQuery } : item
      );
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );

  const onChangeInputNightChild = useCallback(
    (e) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      const updateQuery = onlyDecimalFormat(e.target.value);
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tcm_tmm_freq_night: updateQuery } : item
      );
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );

  const onChangeFrequencyChild = useCallback(
    (item) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      const updated = childDrawerData.map((med, idx) => {
        if (idx === childIndex) {
          if (item.tmf_id != med.tmm_freq_type) {
            return {
              ...med,
              tmm_freq_type: item.tmf_id,
              tmm_freq_type_name: item.tmf_title,
              tmf_block_val: item.tmf_block_val
            };
          } else {
            return {
              ...med,
              tmm_freq_type: 0,
              tmm_freq_type_name: "",
              tmf_block_val: ""
            };
          }
        }
        return med;
      });
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );

  const onChangeTimingChild = useCallback(
    (item) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      const updated = childDrawerData.map((med, idx) => {
        if (idx === childIndex) {
          if (item.tmt_id != med.tmm_time) {
            return { ...med, tmm_time: item.tmt_id, tmm_time_name: item.tmt_title };
          } else {
            return { ...med, tmm_time: 0, tmm_time_name: "" };
          }
        }
        return med;
      });
      setChildDrawerData(updated);
    },
    [childIndex, childDrawerData]
  );

  const onChangeSinceChild = useCallback(
    (key) => {
      if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
      if (hasNumber(key)) {
        const updated = childDrawerData.map((item, idx) => {
          if (idx === childIndex) {
            if (key != item.tmm_days_duration_type) {
              return {
                ...item,
                tmm_days_duration_type: key,
                tmm_days: key.split(" ")[0],
                tmm_duration_type: key.split(" ")[1]
              };
            } else {
              return {
                ...item,
                tmm_days_duration_type: "",
                tmm_days: 0,
                tmm_duration_type: ""
              };
            }
          }
          return item;
        });
        setChildDrawerData(updated);
      }
    },
    [childIndex, childDrawerData]
  );

  const onChangeDurationChild = useCallback(
    (item) => {
      childDrawerData[childIndex].tmm_days_duration_type = item.value;
      setChildDrawerData((prev) => [...prev]);
    },
    [childIndex, childDrawerData]
  );

  const morningClick = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { ...item, tcm_tmm_freq_morning: 1 } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const morningIncrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { 
        ...item, 
        tcm_tmm_freq_morning: parseInt(item.tcm_tmm_freq_morning) + 1 
      } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const morningDecrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    if (parseInt(childDrawerData[childIndex]?.tcm_tmm_freq_morning) > 0) {
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { 
          ...item, 
          tcm_tmm_freq_morning: parseInt(item.tcm_tmm_freq_morning) - 1 
        } : item
      );
      setChildDrawerData(updated);
    }
  }, [childIndex, childDrawerData]);

  const afternoonClick = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { ...item, tcm_tmm_freq_afternoon: 1 } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const afternoonIncrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { ...item, tcm_tmm_freq_afternoon: parseInt(item.tcm_tmm_freq_afternoon) + 1 } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const afternoonDecrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    if (parseInt(childDrawerData[childIndex]?.tcm_tmm_freq_afternoon) > 0) {
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tcm_tmm_freq_afternoon: parseInt(item.tcm_tmm_freq_afternoon) - 1 } : item
      );
      setChildDrawerData(updated);
    }
  }, [childIndex, childDrawerData]);

  const eveningClick = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { ...item, tcm_tmm_freq_evening: 1 } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const eveningIncrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { ...item, tcm_tmm_freq_evening: parseInt(item.tcm_tmm_freq_evening) + 1 } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const eveningDecrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    if (parseInt(childDrawerData[childIndex]?.tcm_tmm_freq_evening) > 0) {
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tcm_tmm_freq_evening: parseInt(item.tcm_tmm_freq_evening) - 1 } : item
      );
      setChildDrawerData(updated);
    }
  }, [childIndex, childDrawerData]);

  const nightClick = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { ...item, tcm_tmm_freq_night: 1 } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const nightIncrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    const updated = childDrawerData.map((item, idx) => 
      idx === childIndex ? { ...item, tcm_tmm_freq_night: parseInt(item.tcm_tmm_freq_night) + 1 } : item
    );
    setChildDrawerData(updated);
  }, [childIndex, childDrawerData]);

  const nightDecrement = useCallback(() => {
    if (!Array.isArray(childDrawerData) || childIndex === null || !childDrawerData[childIndex]) return;
    if (parseInt(childDrawerData[childIndex]?.tcm_tmm_freq_night) > 0) {
      const updated = childDrawerData.map((item, idx) => 
        idx === childIndex ? { ...item, tcm_tmm_freq_night: parseInt(item.tcm_tmm_freq_night) - 1 } : item
      );
      setChildDrawerData(updated);
    }
  }, [childIndex, childDrawerData]);

  const onChangeInputNoteChild = useCallback(
    (e) => {
      const { value } = e.target;
      if (!Array.isArray(childDrawerData) || childIndex === null) return;
      setChildDrawerData((prev) =>
        prev.map((item, idx) =>
          idx === childIndex ? { ...item, tmm_remarks: value } : item
        )
      );
    },
    [childIndex, childDrawerData]
  );

  const innerMedication = (index) => {
    const mainArray = []
    for (let i = index; i < medicationData.length; i++) {
      if (medicationData[i].tmm_id == medicationData[index].tmm_id) {
        mainArray.push(medicationData[i])
      } else {
        break;
      }
    }
    return mainArray
  }

  const onRemoveRow = async (index, data = []) => {
    const childData = await innerMedication(index)
    // Immutable removal
    let updatedMedicationData = medicationData.filter(
      item => !(Array.isArray(childData) && childData.some(child => child.unique_id === item.unique_id))
    );
    // If data is provided, insert immutably
    if (data?.length > 0) {
      updatedMedicationData = [
        ...updatedMedicationData.slice(0, selectedIndex),
        ...data,
        ...updatedMedicationData.slice(selectedIndex),
      ];
    }
    dispatch(setMedicationData(updatedMedicationData));
    setSelectedIndex(null);
  };

  // Handle Parent Drawer
  const handleDrawerParent = useCallback(() => {
    setParentDrawer(!parentDrawer);
  }, [parentDrawer]);

  // Handle Child Drawer
  const handleDrawerChild = (data, index) => {
    setParentDrawer(false);
    setChildDrawer(!childDrawer);
    setChildDrawerData(data);
    if (data && data?.length > 0) {
      if (data[0]?.tmf_block > 0) {
        setSelectedTab("other");
      } else {
        if (data[0]?.tcm_tmm_freq_evening) {
          setSelectedTab("mean");
        } else {
          setSelectedTab("man");
        }
      }
    }
    setSinceValue(data && data?.length > 0 && data[0].tmm_days ? parseInt(data[0].tmm_days) : 1);
    setSelectedIndex(index);
    setChildIndex(data && data?.length > 0 ? 0 : null)
    setActiveKey(data && data?.length > 0 ? data[0]?.unique_id : null)
    setAddCustom(null);
  }

  const mainMedicationSelect = async (index) => {
    const childData = await innerMedication(index);
    console.log(childData,"childData")
    handleDrawerChild(childData, index)
  }

  //PopOver1 function
  const showHideTemplatesListPopover = useCallback(() => {
    setPopOver1(!popOver1);
  }, [popOver1]);

  const onSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      let filteredTemplates = templates.filter((template) => {
        return template.tmtd_template_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setMatchedTemplates(filteredTemplates);
    } else {
      setMatchedTemplates(templates);
    }
  };

  const loadPreviousRxClick = async () => {
    var sendData = {
      patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
      tcm_id: tcmId,
    };
    const action = await dispatch(getLoadPreviousRx(sendData));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action.payload.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: String(e1.tmu_title || ""),
          };
        });

        const unitObj = medicineUnit
          ? medicineUnit.find((x) => x.value == e.tmm_unit)
          : null;
        const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
        const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

        return {
          ...e,
          tmm_unit_name: unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
          tmm_freq_type_name:
            e.tmf_block == 0
              ? `${e.tcm_tmm_freq_morning && e.tcm_tmm_freq_morning != 0
                ? e.tcm_tmm_freq_morning + " - "
                : "0 -"
              }${e.tcm_tmm_freq_afternoon && e.tcm_tmm_freq_afternoon != 0
                ? e.tcm_tmm_freq_afternoon + " - "
                : "0 -"
              }${e.tcm_tmm_freq_evening && e.tcm_tmm_freq_evening != 0
                ? e.tcm_tmm_freq_evening + " - "
                : ""
              }${e.tcm_tmm_freq_night && e.tcm_tmm_freq_night != 0
                ? e.tcm_tmm_freq_night
                : "0"}`
              : frequencyObj !== undefined
                ? frequencyObj.tmf_title
                : "",
          tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
          tmm_days_duration_type: EXTRA_OPTIONS.some((x) => x.value == e.tmm_duration_type) ? e.tmm_duration_type : e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : "",
          unique_id: uuidv4(),
        };
      });
      dispatch(setMedicationData([...medicationData, ...updatedData]));
    } else {
      errorMessage(action.error)
    }
  };

  const onTemplateSelected = async (tmtd_id) => {
    window.Moengage.track_event("medication_template_used", {
      "template_name": tmtd_id.tmtd_template_name
    });
    const action = await dispatch(singleTemplateDetails(tmtd_id));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action.payload.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: String(e1.tmu_title || ""),
          };
        });

        const unitObj = medicineUnit ? medicineUnit.find((x) => x.value == e.tmm_unit) : null;
        const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
        const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

        return {
          ...e,
          tmm_unit_name: unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
          tmm_freq_type_name:
            e.tmf_block == 0
              ? `${e.tcm_tmm_freq_morning && e.tcm_tmm_freq_morning != 0
                ? e.tcm_tmm_freq_morning + " - "
                : "0 -"
              }${e.tcm_tmm_freq_afternoon && e.tcm_tmm_freq_afternoon != 0
                ? e.tcm_tmm_freq_afternoon + " - "
                : "0 -"
              }${e.tcm_tmm_freq_evening && e.tcm_tmm_freq_evening != 0
                ? e.tcm_tmm_freq_evening + " - "
                : ""
              }${e.tcm_tmm_freq_night && e.tcm_tmm_freq_night != 0
                ? e.tcm_tmm_freq_night
                : "0"}`
              : frequencyObj !== undefined
                ? frequencyObj.tmf_title
                : "",
          tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
          tmm_days_duration_type: EXTRA_OPTIONS.some((x) => x.value == e.tmm_duration_type) ? e.tmm_duration_type : e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : "",
          unique_id: uuidv4(),
        };
      });
      dispatch(setMedicationData([...medicationData, ...updatedData]));
      showHideTemplatesListPopover();
    } else {
      errorMessage(action.error)
    }
  };

  const onDeleteTemplateClicked = async (tmtd_id) => {
    const action = await dispatch(deleteTemplate(tmtd_id));
    if (action.meta.requestStatus === "rejected") {
      errorMessage(action.error)
    }
  };

  //PopOver2 function
  const showHideSaveTemplatePopOver = useCallback(() => {
    setInputTemplateName(null);
    setPopOver2(!popOver2);
  }, [popOver2]);

  const onTabChange = useCallback(
    (key) => {
      setInputTemplateName(null);
      setTabChange(key);
    },
    [tabChange]
  );

  const onChangeSaveTemplate = useCallback(
    (e) => {
      const updateQuery = removeBeforeWhiteSpace(e.target.value)
      setInputTemplateName(updateQuery);
    },
    [inputTemplateName]
  );

  const onAddTemplateClicked = async () => {
    if (medicationData.length == 0) {
      errorMessage('At least 1 medication added')
    } else if (medicationData.filter((e) => e.tmm_medicine_name == "").length > 0) {
      errorMessage('Please fillup medication name')
    } else {
      var sendData = {
        tmtd_template_name: inputTemplateName,
        data: medicationData,
      };
      const action = await dispatch(addTemplate(sendData));
      if (action.meta.requestStatus == "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  const onSearchTemplate = useCallback(() => {
    setInputTemplateName(null);
  }, [inputTemplateName]);

  const onSelectTemplate = useCallback(
    (data, e) => {
      setInputTemplateName(e.key);
    },
    [inputTemplateName]
  );

  const onUpdateTemplateClicked = async () => {
    if (medicationData.length == 0) {
      errorMessage('At least 1 medication added')
    } else if (medicationData.filter(e => e.tmm_medicine_name == "").length > 0) {
      errorMessage('Please fillup medication name')
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tmtd_id: data.tmtd_id,
        tmtd_template_name: data.tmtd_template_name,
        data: medicationData,
      };
      const action = await dispatch(updateTemplate(sendData));
      if (action.meta.requestStatus == "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  // TimingInfo popover
  const [frequencyPopOver, setFrequencyPopOver] = useState(false);

  const showHideFrequencyPopOver = useCallback(() => {
    setFrequencyPopOver(!frequencyPopOver);
  }, [frequencyPopOver]);

  const FREQUENCY_CONTENT = useCallback(() => {
    return (
      <div className="position-relative">
        <img src={TimingInfo} alt="Timing Info" />
        <i onClick={showHideFrequencyPopOver} className="icon-Cross position-absolute cursor-pointer" style={{ right: 13, top: 15, color: '#92929D' }}></i>
      </div>
    );
  }, [frequencyPopOver]);

  const showHideModal = useCallback((template_id) => {
    template_id !== undefined ? setRemoveTemplateId(template_id) : setRemoveTemplateId(null)
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  //Template Remove
  const DELETE_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isModalOpen}
        onCancel={showHideModal}
        modalWidth={500}
        title={"You may lose your data"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className='me-3' src={alertIcon} alt="Warning" />
                <span>
                  Are you sure you want to delete this template?
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div onClick={() => {
                  onDeleteTemplateClicked(removeTemplateId)
                  showHideModal()
                }}
                  className="me-4 text-decoration-underline btn p-0 text-main">
                  Yes Delete
                </div>
                <Button onClick={showHideModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isModalOpen]);

  const taperDoseAdd = (item) => {
    let updatedData = {
      ...item,
      tmf_block: 0,
      tmm_freq_type: 0,
      tmm_freq_type_name: "",
      tmf_block_val: "",
      tcm_tmm_freq_afternoon: 0,
      tcm_tmm_freq_evening: 0,
      tcm_tmm_freq_morning: 0,
      tcm_tmm_freq_night: 0,
      tmm_days: 0,
      tmm_days_duration_type: "",
      tmm_duration_type: "",
      tmm_dosage: "",
      tmm_dosage_unit_name: "",
      tmm_remarks: "",
      tmm_time: 0,
      tmm_time_name: "",
      tmm_unit: 0,
      tmm_unit_name: "",
      tmu_id: 0,
      unique_id: uuidv4(),
    }
    // Immutable add for childDrawerData
    const newArr = Array.isArray(childDrawerData)
      ? [...childDrawerData, updatedData]
      : [updatedData];
    setChildDrawerData(newArr);
    setChildIndex(newArr.length - 1);
    setSinceValue(updatedData.tmm_days ? parseInt(updatedData.tmm_days) : 1);
    setActiveKey(updatedData.unique_id);
  };

  const reorder = async (list, startIndex, endIndex) => {
    const result = Array.from(list);

    const findMedicationIndex = medicationData.map((e, index) => ({ ...e, index: index })).reduce((acc, curr) => acc?.at(-1)?.tmm_id == curr.tmm_id ? acc : [...acc, curr], [])

    const array = await innerMedication(findMedicationIndex[startIndex].index)
    const array1 = await innerMedication(findMedicationIndex[endIndex].index)

    const removedArray = result.filter(item => !array.some((x) => x.unique_id === item.unique_id));

    if (findMedicationIndex[startIndex].index > findMedicationIndex[endIndex].index) {
      const dragIndex = removedArray.findIndex(x => x.unique_id == array1.at(0).unique_id)
      removedArray.splice(dragIndex, 0, ...array)
    }
    else {
      const dragIndex = removedArray.findIndex(x => x.unique_id == array1.at(-1).unique_id)
      removedArray.splice(dragIndex + 1, 0, ...array)
    }

    return removedArray;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedItems = await reorder(
      medicationData,
      result.source.index,
      result.destination.index
    );
    dispatch(setMedicationData(reorderedItems));
  };

  const TABLE_MEDICATION = useMemo(() => {
    const noteProps = isEditable ? { lg: 4, md: 4, sm: 4, xs: 4 } : { lg: 7, md: 7, sm: 7, xs: 7 };
    
    const rows = (medicationData || []).map((item, index) => {
      const dosageValue = item?.tmm_dosage;
      const dosageUnitName = typeof item?.tmm_dosage_unit_name === "string" ? item.tmm_dosage_unit_name.trim() : "";

      const resolvedUnitId = item?.tmm_unit ?? item?.tmu_id ?? item?.default_tmm_unit;
      let resolvedUnitLabel = typeof item?.tmm_unit_name === "string" ? item.tmm_unit_name.trim() : "";
      if (!resolvedUnitLabel && Array.isArray(item?.medicineUnit)) {
        const matchedUnit = item.medicineUnit.find((unit) => {
          const unitValue = typeof unit?.value === "number" ? unit.value : parseInt(unit?.value, 10);
          return unitValue == resolvedUnitId;
        });
        if (matchedUnit) {
          if (typeof matchedUnit.label === "string" && matchedUnit.label.trim()) {
            resolvedUnitLabel = matchedUnit.label.trim();
          } else if (matchedUnit.key) {
            try {
              const parsed = JSON.parse(matchedUnit.key);
              resolvedUnitLabel = parsed?.tmu_title || resolvedUnitLabel;
            } catch (error) {
              console.warn("Unable to parse medicine unit", matchedUnit, error);
            }
          }
        }
      }

      const safe = (v) => {
        if (
          typeof v === "string" &&
          (v.includes("null") || v.includes("undefined"))
        ) {
          return "--";
        }
        return (v ?? "--").toString().trim();
      };
      const name = safe(dosageUnitName);
      const value = safe(dosageValue);
      const unit = safe(resolvedUnitLabel);
      let unitPerDoseDisplay = "";

      if (name) {
        unitPerDoseDisplay = name;
      } else if (value) {
        unitPerDoseDisplay = unit ? `${value ? value : 1} ${unit}` : value;
      } else if (unit) {
        unitPerDoseDisplay = unit ? `${value ? value : 1} ${unit}` : value;
      }

      return {
        originalItem: item,
        index,
        medicineName: item?.tmm_medicine_name || "--",
        genericName: item?.tmm_generic || "",
        unitPerDose: unitPerDoseDisplay,
        frequency: isNumeric(item.tmf_block) && item.tmf_block == 0 ? `${item.tcm_tmm_freq_morning ? item.tcm_tmm_freq_morning + " - " : "0 -"}
        ${item.tcm_tmm_freq_afternoon ? item.tcm_tmm_freq_afternoon + " - " : "0 -"}
        ${item.tcm_tmm_freq_evening ? item.tcm_tmm_freq_evening + " - " : ""}
        ${item.tcm_tmm_freq_night ? item.tcm_tmm_freq_night + "" : "0"}` : `${item.tmm_freq_type_name ? item.tmm_freq_type_name : "--"}`,
        when: item?.tmm_time_name || "--",
        duration: item?.tmm_days_duration_type || "--",
        note: item?.tmm_remarks && item?.tmm_remarks !== "null" ? item?.tmm_remarks : "--",
      };
    });
        
    return (
      <div className="ipd-wrapper-class-medbox-readonly">
        {medicationData.length > 0 &&
          <Row
            gutter={[0]}
            style={{background:"#FAFAFB"}}
            className={`mt-14 border-top border-end border-start align-items-center ipd-wrapper-class-medbox`}
          >
            {isEditable ? <Col lg={1} md={1} sm={1} xs={1}>
              &nbsp;
            </Col> : null}
            <Col lg={5} md={5} sm={5} xs={5}>
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                <label>MEDICINE</label>
              </div>
            </Col>
            <Col lg={18} md={18} sm={18} xs={18}>
              <Row>
                <Col lg={4} md={4} sm={4} xs={4} className="border-end border-start">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label>UNIT PER DOSE</label>
                  </div>
                </Col>
                <Col lg={5} md={5} sm={5} xs={5} className="border-end">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome d-flex align-items-center">
                    <label>FREQUENCY</label>
                  </div>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label>WHEN</label>
                  </div>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label>DURATION</label>
                  </div>
                </Col>
                <Col {...noteProps} className={isEditable ? "border-end" : ""}>
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label>NOTE</label>
                  </div>
                </Col>
                {isEditable && (<Col lg={1} md={1} sm={2} xs={2} className="text-center">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label>ACTIONS</label>
                  </div>
                </Col>)}
              </Row>
            </Col>
          </Row>
        }
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="medication" direction="vertical" className="ipd-wrapper-class-medbox-tbody-readonly">
            {(provided) => (
              <div  className="ipd-wrapper-class-medbox-tbody-readonly" {...provided.droppableProps} ref={provided.innerRef}>
                {rows.length > 0 &&
                  rows.reduce((acc, curr) => acc?.at(-1)?.originalItem.tmm_id == curr.originalItem.tmm_id ? acc : [...acc, curr], []).map((item, i) => (
                    <Draggable key={i} draggableId={`medication-${i}`} index={i}>
                      {(provided) => (
                        <Row
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          key={i}
                          gutter={[0]}
                          className={`taper-dose align-items-center ${i === 0 && "border-top"} border-bottom`}
                        >
                          {isEditable ? <Col lg={1} md={1} sm={1} xs={1} className="text-center">
                            <MenuOutlined
                              {...provided.dragHandleProps}
                              className="drag-handle"
                              style={{ cursor: 'grab' }}
                            >
                            </MenuOutlined>
                          </Col> : null}
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <div className="fontroboto fw-medium">
                              <label style={{padding:"0 5px 0 5px"}}>{item.originalItem.tmm_medicine_name}</label>
                              <Tooltip placement="bottom" title={item.originalItem.tmm_generic}>
                                <div style={{padding:"0 5px 0 5px"}} className="text-truncate fw-normal me-1">{item.originalItem.tmm_generic}</div>
                              </Tooltip>
                            </div>
                          </Col>
                          <Col lg={18} md={18} sm={18} xs={18}>
                            {!item.originalItem.pms_default && isEditable &&
                              <i className="icon-Edit fs-18 position-absolute" style={{ bottom: 0, left: -22 }}
                                onClick={() => {
                                  const medicineType = medicineTypeList.find(x => x?.tmy_id == item.originalItem?.tmm_type)
                                  const makeData = {
                                    unique_id: item.originalItem.unique_id,
                                    tmm_id: item.originalItem.tmm_id,
                                    tmm_medicine_name: item.originalItem.tmm_medicine_name,
                                    tmm_generic: item.originalItem.tmm_generic,
                                    tmm_company: item.originalItem.tmm_company
                                  }
                                  const updateItem = medicineType !== undefined ? { ...makeData, ...medicineType } : makeData
                                  showHideAddMedicineModal()
                                  setAddCustom(updateItem);
                                }}
                              ></i>
                            }
                            {rows.filter(row => row.originalItem.tmm_id === item.originalItem.tmm_id).map((subItem, ii) => {
                              return (
                                <Row key={ii} className={`${ii != 0 && 'position-relative border-top'}`}>
                                  <Col lg={4} md={4} sm={4} xs={4} className="border-end border-start">
                                    <AutoComplete
                                      disabled
                                    //   defaultValue={subItem.tmm_dosage_unit_name || "--"}
                                      value={subItem.unitPerDose ? subItem.unitPerDose : '--'}
                                      placeholder="e.g 1 Tablet"
                                      bordered={false}
                                      defaultOpen={false}
                                      onSearch={(query) => onSearchUnitPerDoseChid(query, subItem?.index)}
                                      onBlur={() => onBlurUnitPerDoseChid(subItem?.index)}
                                      options={unitPerDoseOptions}
                                      // backfill={true}
                                      className="autocomplete-custom bg-white w-100 h-100 inputborder"
                                      defaultActiveFirstOption={true}
                                      onSelect={(data, e) => onSelectUnitPerDoseChild(data, e, subItem?.index)}
                                      onClear={() => onSearchUnitPerDoseChid("", subItem?.index)}
                                      allowClear
                                    />
                                    {/* {ii === 0 && (profile?.dp_id === 9 || profile?.dp_id === NEO_NATOLOGISTS_DP_ID) && (
                                      dosesList.some((e1) => e1.medicine_id == item.tmm_id) ? (
                                        <div className="badge-tapper position-absolute" style={{ bottom: 0, left: 20 }} onClick={() => handleViewDoseCalcDrawer("1", item?.tmm_id)}><img src={calculatorIconBlue} alt="Dose calcultor" className="svg-hovered me-1" /> Edit Calculation</div>
                                      ) : (
                                        <div className="badge-tapper position-absolute" style={{ bottom: 0, left: 20 }} onClick={() => handleViewDoseCalcDrawer("1", 0)}><img src={calculatorIconBlue} alt="Dose calcultor" className="svg-hovered me-1" /> Dose Calculator</div>
                                      )
                                    )} */}
                                  </Col>
                                  <Col lg={5} md={5} sm={5} xs={5} className="border-end">
                                    <Select
                                      disabled
                                      open={false}               // prevents dropdown opening
                                      suffixIcon={null}          // hides the arrow
                                      showSearch
                                      className={`autocomplete-custom bg-white w-100 h-100 inputborder ${!isEditable ? 'autoselect-medrx-readonly': ''}`}
                                      placeholder="e.g 1-0-1"
                                      defaultValue={subItem.frequency ? subItem.frequency : "--"}
                                      value={subItem.frequency ? subItem.frequency : "--"}
                                      onSearch={(query) => onSearchFrequencyChild(query, subItem?.index)}
                                      onFocus={() => onSearchFrequencyChild(subItem.frequency, subItem?.index)}
                                      onBlur={() => onBlurFrequencyChild(subItem?.index)}
                                      onSelect={(data) => onSelectFrequencyChild(data, subItem?.index)}
                                      options={frequencyOptions}
                                      onClear={() => onSelectFrequencyChild("", subItem?.index)}
                                      allowClear
                                    />
                                  </Col>
                                  <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                                    <Select
                                      disabled
                                      open={false}               // prevents dropdown opening
                                      suffixIcon={null}          // hides the arrow
                                      className={`autocomplete-custom bg-white w-100 h-100 inputborder ${!isEditable ? 'autoselect-medrx-readonly': ''}`}
                                      placeholder="e.g Before Food"
                                      defaultValue={subItem.when != "--" ? subItem.when : null}
                                      value={subItem.when != "--" ? subItem.when : null}
                                      onSelect={(data) => onSelectTimingChild(data, subItem?.index)}
                                      options={timingList.map((e) => {
                                        return {
                                          value: JSON.stringify({ ...e, unique_id: uuidv4() }),
                                          label: e.tmt_title,
                                        };
                                      })}
                                      onClear={() => onSelectTimingChild("", subItem?.index)}
                                      allowClear
                                    />
                                  </Col>
                                  <Col lg={4} md={4} sm={4} xs={4} className="border-end autofill">
                                    <AutoComplete
                                      disabled
                                      open={false}               // prevents dropdown opening
                                      suffixIcon={null}          // hides the arrow
                                      defaultValue={subItem.duration}
                                      value={hasNumber(subItem.duration) ? subItem.duration : capitalize(subItem.duration, true)}
                                      placeholder="e.g 1 Day"
                                      bordered={false}
                                      defaultOpen={false}
                                      onSearch={(query) => onSearchSinceChid(query, subItem?.index)}
                                      options={sinceOptions}
                                      className="autocomplete-custom bg-white h-100 w-100 inputborder truncate-autocomplete"
                                      popupClassName="option-truncate"
                                      defaultActiveFirstOption={true}
                                      onSelect={(data, e) => onSelectSinceChild(data, e, subItem?.index)}
                                      onClear={() => onSearchSinceChid("", subItem?.index)}
                                      allowClear
                                    />
                                    {/* {item?.tmm_days_duration_type && (
                                      <div className="badge-autofill" onClick={() => onAutoFillDuration(item?.index)}><i className="icon-copyIcon fs-12-1" />Autofill to all meds</div>
                                    )} */}
                                  </Col>
                                  <Col {...noteProps} className={isEditable ? "border-end" : ""}>
                                    <TextArea
                                      disabled
                                      className="notesinput bg-white border-0 h-100 align-self-center"
                                      placeholder="Notes"
                                      defaultValue={subItem.note}
                                      value={subItem.note ? subItem.note : "--"}
                                      autoSize={{
                                        minRows: 1,
                                        maxRows: 2,
                                      }}
                                      // onChange={(e) => onChangeNoteChild(e, subItem?.index)}
                                    />
                                  </Col>
                                  {isEditable && (<Col lg={3} md={3} sm={3} xs={3} className="d-flex align-items-center justify-content-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <img
                                            onClick={() => mainMedicationSelect(subItem?.index)}
                                            src={editIcon}
                                            width={18}
                                            height={18}
                                            alt="edit"
                                            style={{ cursor: "pointer" }}
                                        />
                                        <i
                                            className="icon-delete fs-20"
                                            onClick={() => onRemoveRow && onRemoveRow(subItem?.index)}
                                            style={{ cursor: "pointer", width: "18px", height: "18px" }}
                                        ></i>
                                    </div>
                                  </Col>)}
                                  {ii != 0 && (<div className="badge-then">Then</div>)}
                                </Row>
                              )
                            })}
                          </Col>
                          {/* <div className="badge-tapper" onClick={() => taperDoseAdd(item)}>
                            <i className="icon-Add me-1"></i> Tapering Dose
                          </div> */}
                        </Row>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }, [medicationData, frequencyPopOver, isEditable, selectedTab, childDrawerData]);

  //Template Componet
  const TEMPLATE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="pop-header" key="medicationData-template">
          <div className="align-items-center d-flex justify-content-between">
            <div className="title-common">Medications Templates</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideTemplatesListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          <div className="mt-3" key="medicationData-template-search">
            <Input
              allowClear
              className="popinput"
              onChange={onSearch}
              placeholder="Search Templates"
              prefix={<i className="icon-search me-2" />}
            />
          </div>
        </div>
        <div className="pop-body">
          {matchedTemplates.length > 0 &&
            matchedTemplates.map((template, i) => {
              return (
                <div
                  className="align-items-center d-flex medicine-templates"
                  key={i}
                >
                  <div
                    className="round-box"
                    onClick={() => onTemplateSelected(template.tmtd_id)}
                  >
                    <i className="icon-template"></i>
                  </div>
                  <div
                    className="text-truncate w-100"
                    onClick={() => onTemplateSelected(template.tmtd_id)}
                  >
                    <div className="title text-main2">{template.tmtd_template_name}</div>
                    <div className="text-truncate">{template.medicine_name}</div>
                  </div>
                  <Button
                    className="btn btn-delete-prescription p-0 ms-2"
                    onClick={() => {
                      showHideModal(template.tmtd_id)
                      showHideTemplatesListPopover()
                    }}
                  >
                    {template.loading ? (
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 22 }} spin />
                        }
                      />
                    ) : (
                      <i className="icon-delete"></i>
                    )}
                  </Button>
                </div>
              );
            })}
        </div>
      </>
    );
  }, [popOver1, matchedTemplates]);

  //Save Componet
  const SAVE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
          <Tabs
            defaultActiveKey={TAB_ADD_TEMPLATE}
            items={ADD_EDIT_TEMPLATE_TABS}
            onChange={onTabChange}
            className="w-100"
          />
          <Button
            className="btn btn-delete-prescription"
            onClick={showHideSaveTemplatePopOver}
          >
            <i className="icon-Cross"></i>
          </Button>
        </div>
        {tabChange === TAB_ADD_TEMPLATE ? (
          <div className="pop-header d-flex">
            <Input
              allowClear
              value={inputTemplateName && inputTemplateName}
              className="popinput inputheight41"
              placeholder="Template Name"
              onChange={onChangeSaveTemplate}
            />
            <Button
              className="btn btn-primary3 btn-41 ms-3"
              loading={loading}
              disabled={inputTemplateName ? false : true}
              onClick={onAddTemplateClicked}
            >
              {" Save "}
            </Button>
          </div>
        ) : (
          <div className="pop-header d-flex">
            <Select
              showSearch
              value={inputTemplateName && JSON.parse(inputTemplateName).tmtd_template_name}
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Template"
              onSearch={onSearchTemplate}
              onSelect={onSelectTemplate}
              optionLabelProp="label"
              options={allTemplates.map((template) => {
                return {
                  key: JSON.stringify(template),
                  value: template.tmtd_template_name,
                  label: (
                    <div key={template.tmtd_id}>
                      {template.tmtd_template_name}
                    </div>
                  ),
                };
              })}
              optionRender={(option) => (
                <div className="align-items-center d-flex text-truncate w-100">
                  <div className="round-box"><i className="icon-template"></i></div>
                  <div className="text-truncate w-100">
                    <div className="title text-main2">{option.data.value}</div>
                    <div className="text-truncate">{JSON.parse(option.data.key).medicine_name}</div>
                  </div>
                </div>
              )}
            />
            <Button
              className="btn btn-primary3 btn-41 ms-3"
              loading={loading}
              disabled={inputTemplateName ? false : true}
              onClick={onUpdateTemplateClicked}
            >
              {" Update "}
            </Button>
          </div>
        )}
      </>
    );
  }, [tabChange, popOver2, inputTemplateName, loading, allTemplates]);

  //Add Custom
  const showHideAddMedicineModal = useCallback(
    () => {
      setIsAddMedicineOpen(!isAddMedicineOpen)
    },
    [isAddMedicineOpen]
  );

  const onChangeMedicineName = useCallback(
    (e) => {
      setAddCustom({ ...addCustom, tmm_medicine_name: e.target.value });
    },
    [addCustom]
  );

  const onChangeCompanyName = useCallback(
    (e) => {
      setAddCustom({ ...addCustom, tmm_company: e.target.value });
    },
    [addCustom]
  );

  const onSelectMedicineType = useCallback(
    (data) => {
      if (data) {
        setAddCustom({ ...addCustom, ...JSON.parse(data) });
      } else {
        const { tmy_id, tmy_title, ...updatedReqData } = addCustom;
        setAddCustom(updatedReqData)
      }
    },
    [addCustom]
  );

  useEffect(() => {
    if (genericQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(searchGeneric(genericQuery));
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [genericQuery]);

  const onSearchGeneric = useCallback(
    (query) => {
      setGenericQuery(replaceCommasAndSemicolons(removeBeforeWhiteSpace(query)));
    },
    [genericQuery]
  );

  const onSelectGeneric = useCallback(
    (data) => {
      if (data) {
        setAddCustom({ ...addCustom, ...JSON.parse(data) });
      } else {
        const { tmm_generic, ...updatedReqData } = addCustom;
        setAddCustom(updatedReqData)
      }
    },
    [addCustom]
  );

  const onAddEditMedicineClick = async () => {
    var sendData = {
      tmm_id: addCustom?.tmm_id,
      tmm_medicine_name: addCustom?.tmm_medicine_name,
      tmm_type: addCustom?.tmy_id,
      tmm_generic: addCustom?.tmm_generic !== undefined ? addCustom?.tmm_generic : '',
      tmm_company: addCustom?.tmm_company !== undefined ? addCustom?.tmm_company : ''
    };
    const action = addCustom?.tmm_id ? await dispatch(editMedicine(sendData)) : await dispatch(addMedicine(sendData))
    if (action.meta.requestStatus === "fulfilled") {
      if (addCustom?.tmm_id) {
        const modifyData = action.payload[0]

        await dispatch(updateFrequentlyMedication(modifyData))

        const medicineUnit = modifyData?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: String(e1.tmu_title || ""),
          };
        });

        if (doseCalculatorDrawer) {
          const updatedMedicationLibrary = medicationLibrary.map(item => {
            if (item.tmm_id == modifyData.tmm_id) {
              return {
                ...item,
                tmm_medicine_name: modifyData.tmm_medicine_name,
                tmm_generic: modifyData.tmm_generic,
                tmm_company: modifyData.tmm_company,
                tmm_type: modifyData.tmm_type,
                tmm_dosage_unit_name: '',
                tmm_dosage: '',
                tmm_unit: 0,
                tmm_unit_name: '',
                tmu_id: 0,
                medicineUnit: medicineUnit
              };
            }
            return item;
          });
          setMedicationLibrary(updatedMedicationLibrary);
        } else {
          const updatedMedicationData = medicationData.map(item => {
            if (item.tmm_id == modifyData.tmm_id) {
              return {
                ...item,
                tmm_medicine_name: modifyData.tmm_medicine_name,
                tmm_generic: modifyData.tmm_generic,
                tmm_company: modifyData.tmm_company,
                tmm_type: modifyData.tmm_type,
                tmm_dosage_unit_name: '',
                tmm_dosage: '',
                tmm_unit: 0,
                tmm_unit_name: '',
                tmu_id: 0,
                medicineUnit: medicineUnit
              };
            }
            return item;
          });
          dispatch(setMedicationData(updatedMedicationData));
        }
      } else {
        const updatedData = action.payload.map((e) => {
          const medicineUnit = e?.medicineUnit.map((e1) => {
            return {
              key: JSON.stringify({ ...e1 }),
              value: e1.tmu_id,
              label: String(e1.tmu_title || ""),
            };
          });

          const unitObj = medicineUnit ? medicineUnit.find((x) => x.value == e.tmm_unit) : null;
          const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
          const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

          let doseCalData = {}
          const objDose = dosesList.find((e1) => e1.medicine_id == e.tmm_id)
          if (objDose !== undefined) {
            const dose = calculateDose(objDose?.dosage, todayData?.weight, objDose?.concentration, e?.tmm_type)
            doseCalData['tmm_dosage_unit_name'] = `${dose ? `${dose} ${unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_title : ""}` : ""}`;
            doseCalData['tmm_dosage'] = dose ? dose : "";
            doseCalData['tmm_unit_name'] = unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_title : "";
            doseCalData['tmm_unit'] = unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_id : "";
            doseCalData['tmu_id'] = unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_id : "";
          } else {
            doseCalData['tmm_dosage_unit_name'] = `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_title : ""}` : ""}`;
            doseCalData['tmm_unit_name'] = unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_title : "";
          }

          return {
            ...e,
            // tmm_unit_name: unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_title : "",
            tmm_freq_type_name:
              frequencyObj !== undefined ? frequencyObj.tmf_title : "",
            tmf_block_val:
              frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
            tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
            medicineUnit: medicineUnit,
            // tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? JSON.parse(unitObj.key).tmu_title : ""}` : ""}`,
            tmm_days_duration_type: EXTRA_OPTIONS.some((x) => x.value == e.tmm_duration_type) ? e.tmm_duration_type : e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : "",
            unique_id: uuidv4(),
            ...doseCalData
          };
        });
        if (doseCalculatorDrawer) {
          const modifyData = updatedData[0]
          const objDose = dosesList.find((e1) => e1.medicine_id == modifyData.tmm_id)
          const newMedicine = {
            ...modifyData,
            tmm_dosage_unit_name: "",
            tmm_dosage: '',
            tmm_unit: 0,
            tmm_unit_name: '',
            tmu_id: 0,
            id: objDose !== undefined ? objDose?.id : "",
            medicine_id: modifyData.tmm_id,
            dosage: objDose !== undefined ? objDose?.dosage : "",
            dosage_unit: "mg/kg/dose",
            concentration: objDose !== undefined ? objDose?.concentration : "",
            concentration_unit: "mg/ml",
            medicine_name: modifyData.tmm_medicine_name,
            medicine_generic_name: modifyData.tmm_generic,
            exist: dosesList.some((e1) => e1.medicine_id == modifyData.tmm_id) ? true : false
          };
          setMedicationLibrary(prev => [...prev, newMedicine]);
        }
      }
      if (doseCalculatorDrawer) {
        setSearchMLQuery("");
      } else {
        // medicationData already dispatched via immutable updates above
        const childData = await innerMedication(selectedIndex)
        setChildDrawerData(childData);
      }
      setAddCustom(null);
    } else {
      errorMessage(action.error)
    }
  }

  const emptyText = (
    genericQuery.length > 0 &&
    <div className="text-center py-3">
      <img className="mb-3" style={{ width: 100 }} src={noRecordFound} alt="No Result Found" />
      <div className="title-common fontroboto mb-3">Sorry ! No results found</div>
      <div className="fontroboto text-greycolor">The generic name is currently not listed in our <br /> database We will add it soon. </div>
    </div>
  );

  const ADD_MEDICINE_DATA = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isAddMedicineOpen}
        onCancel={showHideAddMedicineModal}
        modalWidth={500}
        title={`${addCustom?.tmm_id ? 'Edit' : 'Add'} Custom Medicine`}
        modalBody={
          <>
            <div>
              <Form.Item
                label={<>Name <sup className="mt-3 text-danger fs-18">*</sup></>}
                className="inputLabel-45">
                <Input
                  placeholder="Medicine Name"
                  value={addCustom?.tmm_medicine_name}
                  onChange={onChangeMedicineName}
                  className="inputheight45 text-capitalize" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label={<>Type <sup className="mt-3 text-danger fs-18">*</sup></>}
                className="inputLabel-45">
                <Select
                  showSearch
                  className="inputheight45 autocomplete-custom"
                  placeholder="Medicine Type"
                  defaultValue={addCustom?.tmy_title !== undefined ? addCustom?.tmy_title : null}
                  value={addCustom?.tmy_title !== undefined ? addCustom?.tmy_title : null}
                  onSelect={onSelectMedicineType}
                  options={medicineTypeList.map((e) => {
                    return {
                      value: JSON.stringify({ ...e }),
                      label: e.tmy_title,
                    };
                  })}
                  onClear={() => onSelectMedicineType("")}
                  allowClear
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Generic"
                className="inputLabel-45">
                <Select
                  showSearch
                  className="inputheight45 autocomplete-custom"
                  placeholder="Generic Name"
                  defaultValue={addCustom?.tmm_generic !== undefined ? addCustom?.tmm_generic : null}
                  value={addCustom?.tmm_generic !== undefined ? addCustom?.tmm_generic : null}
                  onSearch={onSearchGeneric}
                  onSelect={onSelectGeneric}
                  options={[...genericList, { tmm_generic: genericQuery }].filter(e => e.tmm_generic).map((e, i) => {
                    return {
                      value: JSON.stringify({ ...e }),
                      label: i === [...genericList, { tmm_generic: genericQuery }].filter(e => e.tmm_generic).length - 1 && genericQuery.length > 0 ?
                        <>
                          <div>{e.tmm_generic}<i className="icon-Add mx-1 text-primary fs-6"></i> <a className="fw-medium text-decoration-underline text-primary"> Add Custom</a></div>
                        </>
                        :
                        <>{e.tmm_generic}</>,
                    };
                  })}
                  onClear={() => onSelectGeneric("")}
                  // notFoundContent={emptyText}
                  notFoundContent={null}
                  allowClear
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Company"
                className="inputLabel-45">
                <Input
                  placeholder="Company Name"
                  value={addCustom?.tmm_company}
                  onChange={onChangeCompanyName}
                  className="inputheight45 text-capitalize" />
              </Form.Item>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div onClick={showHideAddMedicineModal}
                  className="me-4 btn p-0 text-main">
                  Cancel
                </div>
                <Button className="lh-lg btn btn-primary3 btn-41 px-4" onClick={onAddEditMedicineClick} loading={loading} disabled={addCustom?.tmm_medicine_name && addCustom?.tmy_id ? false : true}>
                  <span>{`${addCustom?.tmm_id ? 'Update' : 'Add'} Custom Medicine`}</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isAddMedicineOpen, addCustom, genericList, genericQuery, loading]);

  const showHideClearData = useCallback(() => {
    setIsModalOpen1(!isModalOpen1);
  }, [isModalOpen1]);

  const onRemoveRows = () => {
    dispatch(clearMedicationData())
    showHideClearData()
  };

  //Remove All Rows
  const REMOVE_ALL_ROWS = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isModalOpen1}
        onCancel={showHideClearData}
        modalWidth={500}
        title={"You may lose your data"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className='me-3' src={alertIcon} alt="Warning" />
                <span>
                  Are you sure you want to Clear Selected <b>Medications (Rx)</b>?
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div onClick={onRemoveRows}
                  className="me-4 text-decoration-underline btn p-0 text-main">
                  <span>Yes, Clear</span>
                </div>
                <Button onClick={showHideClearData} className="lh-lg btn btn-primary3 btn-41 px-4">
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isModalOpen1]);

  const showHideModal2 = useCallback(() => {
    setIsModalOpen2(!isModalOpen2);
  }, [isModalOpen2]);

  //Child Componet
  const CHILD_DRAWER_DATA = useMemo(() => {
    return (
      <>
        <Card bordered={false} className="search-modalCard">
          <div className="modalCard-header align-items-center justify-content-between d-flex">
            <div className="align-items-center d-flex text-truncate">
              <Button
                type="text"
                className="btn btn-delete-prescription px-3 focus-none h-100"
                onClick={handleDrawerChild}
              >
                <i className="icon-Cross fs-3"></i>
              </Button>
              <div className="text-truncate title-common fontroboto">
                {medicationData[selectedIndex]?.tmm_medicine_name}
                <div className="text-truncate fs-14 fw-normal fontroboto mt-1">
                  {medicationData[selectedIndex]?.tmm_generic}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {!medicationData[selectedIndex]?.pms_default && (
                <i
                  className="icon-Edit ms-2"
                  onClick={() => {
                    const medicineType = medicineTypeList.find(
                      (x) =>
                        x?.tmy_id == medicationData[selectedIndex]?.tmm_type
                    );
                    const makeData = {
                      unique_id: medicationData[selectedIndex]?.unique_id,
                      tmm_id: medicationData[selectedIndex]?.tmm_id,
                      tmm_medicine_name: String(
                        medicationData[selectedIndex]?.tmm_medicine_name || ""
                      ),
                      tmm_generic: String(
                        medicationData[selectedIndex]?.tmm_generic || ""
                      ),
                      tmm_company: String(
                        medicationData[selectedIndex]?.tmm_company || ""
                      ),
                      tmm_type: medicationData[selectedIndex]?.tmm_type,
                      ...medicineType,
                    };
                    setAddCustom(makeData);
                  }}
                ></i>
              )}
              <Button
                className="btn btn-primary3 btn-41 px-4 ms-3 me-20"
                onClick={() => updateChild(childDrawerData)}
              >
                Done
              </Button>
            </div>
          </div>
        </Card>
        {Array.isArray(childDrawerData) && childDrawerData.length > 0 ? (
          <Tabs
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={(targetKey, action) =>
              onEdit(targetKey, action, childDrawerData[childIndex])
            }
            items={childDrawerData.map((e, i) => ({
              key: e.unique_id,
              label: `Dose ${i + 1}`,
              children: null,
            }))}
            className="tablet-medication-tabs"
          />
        ) : null}
        <i
          className="icon-Add custom-tapper-button"
          onClick={() =>
            taperDoseAdd(
              childDrawerData && childDrawerData?.length > 0
                ? childDrawerData[childIndex]
                : medicationData[selectedIndex]
            )
          }
        />
        {childDrawerData && childDrawerData?.length > 0 && (
          <div className="p-4">
            <div>
              <label className="title-common mb-1">Unit/Dose</label>
              <Row gutter={20} className="mb-3">
                <Col md={12}>
                  <Input
                    placeholder="e.g. 1"
                    value={
                      childDrawerData?.[childIndex]?.tmm_dosage
                        ? childDrawerData[childIndex]?.tmm_dosage
                        : ""
                    }
                    inputMode="decimal"
                    onChange={onChangeDosageChild}
                    className="inputheight38 rounded-10px"
                  />
                </Col>
                <Col md={12}>
                  <Select
                    className="autocomplete-custom w-100 popinput inputheight38"
                    placeholder="Select"
                    value={
                      childDrawerData?.[childIndex]?.tmm_unit
                        ? Number(childDrawerData[childIndex].tmm_unit)
                        : null
                    }
                    onSelect={onSelectMedicineUnitChild}
                    options={normalizeMedicineUnit(
                      childDrawerData?.[childIndex]?.medicineUnit
                    )}
                  />
                </Col>
              </Row>
              <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                <label className="title-common">Frequency</label>
                <div className="mb-1 man-mean">
                  <Radio.Group
                    size="small"
                    onChange={handleRadioChange}
                    value={selectedTab}
                  >
                    <Radio.Button
                      value="man"
                      className={`${
                        selectedTab === "man" ? "selected-tab" : ""
                      } fw-medium`}
                    >
                      <span
                        className={`${
                          selectedTab === "man" ? "selected-tab" : ""
                        } fw-medium`}
                      >
                        MAN
                      </span>
                    </Radio.Button>
                    <Radio.Button
                      value="mean"
                      className={`${
                        selectedTab === "mean" ? "selected-tab" : ""
                      } fw-medium`}
                    >
                      <span
                        className={`${
                          selectedTab === "mean" ? "selected-tab" : ""
                        } fw-medium`}
                      >
                        MEAN
                      </span>
                    </Radio.Button>
                    <Radio.Button
                      value="other"
                      className={`${
                        selectedTab === "other" ? "selected-tab" : ""
                      } fw-medium`}
                    >
                      <span
                        className={`${
                          selectedTab === "other" ? "selected-tab" : ""
                        } fw-medium`}
                      >
                        Hrs a Day
                      </span>
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              {selectedTab === "man" && (
                <Row className="input-dark">
                  <Col sm={8}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border w-100 rounded-0"
                    >
                      {childDrawerData[childIndex]?.tcm_tmm_freq_morning !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_morning !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={morningDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData[childIndex]?.tmf_block}
                        onClick={() =>
                          !childDrawerData[childIndex]?.tcm_tmm_freq_morning &&
                          morningClick()
                        }
                      >
                        <Input
                          placeholder="Morning"
                          inputMode="numeric"
                          value={
                            childDrawerData[childIndex]?.tcm_tmm_freq_morning
                              ? childDrawerData[childIndex]
                                  ?.tcm_tmm_freq_morning
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputMorningChild}
                        />
                      </BSButton>
                      {childDrawerData[childIndex]?.tcm_tmm_freq_morning !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_morning !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={morningIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col sm={8}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 w-100 border rounded-0 border-start-0"
                    >
                      {childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={afternoonDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData[childIndex]?.tmf_block}
                        onClick={() =>
                          !childDrawerData[childIndex]
                            ?.tcm_tmm_freq_afternoon && afternoonClick()
                        }
                      >
                        <Input
                          placeholder="Afternoon"
                          inputMode="numeric"
                          value={
                            childDrawerData[childIndex]?.tcm_tmm_freq_afternoon
                              ? childDrawerData[childIndex]
                                  ?.tcm_tmm_freq_afternoon
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputAfternoonChild}
                        />
                      </BSButton>
                      {childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={afternoonIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col sm={8}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 w-100 border rounded-0 border-start-0"
                    >
                      {childDrawerData[childIndex]?.tcm_tmm_freq_night !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_night !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={nightDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData[childIndex]?.tmf_block}
                        onClick={() =>
                          !childDrawerData[childIndex]?.tcm_tmm_freq_night &&
                          nightClick()
                        }
                      >
                        <Input
                          placeholder="Night"
                          inputMode="numeric"
                          value={
                            childDrawerData[childIndex]?.tcm_tmm_freq_night
                              ? childDrawerData[childIndex]?.tcm_tmm_freq_night
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputNightChild}
                        />
                      </BSButton>
                      {childDrawerData[childIndex]?.tcm_tmm_freq_night !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_night !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={nightIncrement}
                          >
                            <i className="icon-Add d-block text-main"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                </Row>
              )}
              {selectedTab === "mean" && (
                <Row className="input-dark">
                  <Col sm={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0"
                    >
                      {childDrawerData[childIndex]?.tcm_tmm_freq_morning !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_morning !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={morningDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData[childIndex]?.tmf_block}
                        onClick={() =>
                          !childDrawerData[childIndex]?.tcm_tmm_freq_morning &&
                          morningClick()
                        }
                      >
                        <Input
                          placeholder="Morning"
                          inputMode="numeric"
                          value={
                            childDrawerData[childIndex]?.tcm_tmm_freq_morning
                              ? childDrawerData[childIndex]
                                  ?.tcm_tmm_freq_morning
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputMorningChild}
                        />
                      </BSButton>
                      {childDrawerData[childIndex]?.tcm_tmm_freq_morning !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_morning !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={morningIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col sm={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0 border-start-0"
                    >
                      {childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={afternoonDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData[childIndex]?.tmf_block}
                        onClick={() =>
                          !childDrawerData[childIndex]
                            ?.tcm_tmm_freq_afternoon && afternoonClick()
                        }
                      >
                        <Input
                          placeholder="Afternoon"
                          inputMode="numeric"
                          value={
                            childDrawerData[childIndex]?.tcm_tmm_freq_afternoon
                              ? childDrawerData[childIndex]
                                  ?.tcm_tmm_freq_afternoon
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputAfternoonChild}
                        />
                      </BSButton>
                      {childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_afternoon !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={afternoonIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col sm={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0 border-start-0"
                    >
                      {childDrawerData[childIndex]?.tcm_tmm_freq_evening !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_evening !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={eveningDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData[childIndex]?.tmf_block}
                        onClick={() =>
                          !childDrawerData[childIndex]?.tcm_tmm_freq_evening &&
                          eveningClick()
                        }
                      >
                        <Input
                          placeholder="Evening"
                          inputMode="numeric"
                          value={
                            childDrawerData[childIndex]?.tcm_tmm_freq_evening
                              ? childDrawerData[childIndex]
                                  ?.tcm_tmm_freq_evening
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputEveningChild}
                        />
                      </BSButton>
                      {childDrawerData[childIndex]?.tcm_tmm_freq_evening !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_evening !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={eveningIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col sm={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0 border-start-0"
                    >
                      {childDrawerData[childIndex]?.tcm_tmm_freq_night !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_night !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={nightDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData[childIndex]?.tmf_block}
                        onClick={() =>
                          !childDrawerData[childIndex]?.tcm_tmm_freq_night &&
                          nightClick()
                        }
                      >
                        <Input
                          placeholder="Night"
                          inputMode="numeric"
                          value={
                            childDrawerData[childIndex]?.tcm_tmm_freq_night
                              ? childDrawerData[childIndex]?.tcm_tmm_freq_night
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputNightChild}
                        />
                      </BSButton>
                      {childDrawerData[childIndex]?.tcm_tmm_freq_night !==
                        undefined &&
                        childDrawerData[childIndex]?.tcm_tmm_freq_night !=
                          0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData[childIndex]?.tmf_block}
                            onClick={nightIncrement}
                          >
                            <i className="icon-Add d-block text-main"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                </Row>
              )}
              <div>
                {selectedTab === "other" && (
                  <div className="segement-static d-flex flex-wrap">
                    {filteredTitles.slice(0, 2).map((item, i) => {
                      return (
                        <>
                          <button
                            key={i}
                            type="button"
                            className={`btn text-truncate ${
                              childDrawerData[childIndex]?.tmm_freq_type ==
                                item.tmf_id && "btn-segement"
                            }`}
                            onClick={() => onChangeFrequencyChild(item)}
                          >
                            {item.tmf_title}
                          </button>
                          {i == filteredTitles.slice(0, 2).length - 1 && (
                            <button
                              key={-1}
                              type="button"
                              className={`btn segment-more ${
                                filteredTitles
                                  .slice(2, filteredTitles.length)
                                  .some(
                                    (e) =>
                                      e.tmf_id ==
                                      childDrawerData[childIndex]?.tmm_freq_type
                                  ) && "btn-segement"
                              }`}
                              onClick={handleFrequencyMoreOptionsVisible}
                            >
                              {filteredTitles
                                .slice(2, filteredTitles.length)
                                .some(
                                  (e) =>
                                    e.tmf_id ==
                                    childDrawerData[childIndex]?.tmm_freq_type
                                ) ? (
                                <span id="selected">
                                  <i className="icon-Edit me-2 fs-21"></i>{" "}
                                  {
                                    childDrawerData[childIndex]
                                      ?.tmm_freq_type_name
                                  }
                                </span>
                              ) : (
                                "More"
                              )}
                            </button>
                          )}
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
              {frequencyMoreOptionsVisible && (
                <TabMedicationMoreModal
                  width="563px"
                  title={"Frequency"}
                  onClose={handleFrequencyMoreOptionsVisible}
                  onClick={(item) => {
                    setFrequencyMoreOptionsVisible(false);
                    onChangeFrequencyChild(item);
                  }}
                  label={"tmf_title"}
                  value={"tmf_id"}
                  selectedValue={childDrawerData[childIndex]?.tmm_freq_type}
                  array={filteredTitles.slice(2, filteredTitles.length)}
                />
              )}
              <div>
                <div className="segement-static d-flex flex-wrap">
                  {timingList.slice(0, 5).map((item, i) => {
                    return (
                      <>
                        <button
                          key={i}
                          type="button"
                          className={`btn mt-3 ${
                            childDrawerData?.[childIndex]?.tmm_time ==
                            item.tmt_id
                              ? "btn-segement"
                              : ""
                          }`}
                          onClick={() => onChangeTimingChild(item)}
                        >
                          {item.tmt_title}
                        </button>
                        {i == timingList.slice(0, 5).length - 1 && (
                          <button
                            key={-1}
                            type="button"
                            className={`btn mt-3 segment-more ${
                              timingList
                                .slice(5, timingList.length)
                                .some(
                                  (e) =>
                                    e.tmt_id ==
                                    childDrawerData?.[childIndex]?.tmm_time
                                ) && "btn-segement"
                            }`}
                            onClick={handleTimingMoreOptionsVisible}
                          >
                            {timingList
                              .slice(5, timingList.length)
                              .some(
                                (e) =>
                                  e.tmt_id ==
                                  childDrawerData?.[childIndex]?.tmm_time
                              ) ? (
                              <span id="selected">
                                <i className="icon-Edit me-2 fs-21"></i>
                                {childDrawerData?.[childIndex]?.tmm_time_name}
                              </span>
                            ) : (
                              "More"
                            )}
                          </button>
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
            {timingMoreOptionsVisible && (
              <TabMedicationMoreModal
                width="563px"
                title={"Timings"}
                onClose={handleTimingMoreOptionsVisible}
                onClick={(item) => {
                  setTimingMoreOptionsVisible(false);
                  onChangeTimingChild(item);
                }}
                label={"tmt_title"}
                value={"tmt_id"}
                selectedValue={childDrawerData?.[childIndex]?.tmm_time}
                array={timingList.slice(5, timingList.length)}
              />
            )}
            <div className="mt-3">
              <label className="title-common mb-1">Duration</label>
              <div className="segement-static d-flex">
                {SINCE_LIST.map((item, i) => {
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`btn w-100 p-0 ${
                        sinceValue > 5
                          ? item.value == -1 &&
                            "btn-segement custom-input-selected"
                          : sinceValue == item.value && "btn-segement"
                      }`}
                      onClick={() => onChangeSegmentedSinceChild(item.value)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 mb-3">
              <div className="segement-static d-flex">
                {sinceOptions.map((item, i) => {
                  return (
                    <>
                      <button
                        key={i}
                        type="button"
                        className={`btn ${
                          childDrawerData[childIndex]?.tmm_days_duration_type ==
                            item.value && "btn-segement"
                        }`}
                        onClick={() => onChangeSinceChild(item.value)}
                      >
                        {item.label}
                      </button>
                      {i == sinceOptions.length - 1 && (
                        <button
                          key={-1}
                          type="button"
                          className={`btn text-truncate px-1 segment-more ${
                            EXTRA_OPTIONS.some(
                              (e) =>
                                e.value ==
                                childDrawerData[childIndex]
                                  ?.tmm_days_duration_type
                            ) && "btn-segement"
                          }`}
                          onClick={handleDurationMoreOptionsVisible}
                        >
                          {EXTRA_OPTIONS.some(
                            (e) =>
                              e.value ==
                              childDrawerData[childIndex]
                                ?.tmm_days_duration_type
                          ) ? (
                            <span id="selected">
                              <i className="icon-Edit me-2 fs-21"></i>
                              {hasNumber(
                                childDrawerData[childIndex]
                                  ?.tmm_days_duration_type
                              )
                                ? childDrawerData[childIndex]
                                    ?.tmm_days_duration_type
                                : capitalize(
                                    childDrawerData[childIndex]
                                      ?.tmm_days_duration_type,
                                    true
                                  )}
                            </span>
                          ) : (
                            "More"
                          )}
                        </button>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
            {durationMoreOptionsVisible && (
              <TabMedicationMoreModal
                width="563px"
                title={"Duration"}
                onClose={handleDurationMoreOptionsVisible}
                onClick={(item) => {
                  setDurationMoreOptionsVisible(false);
                  onChangeDurationChild(item);
                }}
                label={"label"}
                value={"value"}
                selectedValue={
                  childDrawerData[childIndex]?.tmm_days_duration_type
                }
                array={EXTRA_OPTIONS}
              />
            )}

            {childDrawerData[childIndex]?.tmm_days_duration_type && (
              <div className="text-primary d-flex align-items-center">
                <i className="icon-copyIcon fs-16 me-1" />{" "}
                <span
                  className="text-primary text-decoration-underline"
                  onClick={() => onAutoFillDuration(selectedIndex)}
                >
                  Autofill this duration for all added meds.
                </span>
              </div>
            )}

            <label className="title-common mb-1 mt-3">Note</label>
            <Input.TextArea
              value={
                childDrawerData[childIndex]?.tmm_remarks
                  ? childDrawerData[childIndex]?.tmm_remarks
                  : ""
              }
              placeholder="Enter any specific notes here"
              className="textareaPlaceholder"
              rows={3}
              onChange={onChangeInputNoteChild}
            />
          </div>
        )}
      </>
    );
  }, [
    childDrawer,
    childDrawerData,
    sinceValue,
    inputSince,
    sinceOptions,
    selectedTab,
    timingMoreOptionsVisible,
    frequencyMoreOptionsVisible,
    durationMoreOptionsVisible,
    activeKey,
    childIndex
  ]);

  // Tour Pillup
  const tourRef = useRef(null);
  const autoFillClickedRef = useRef(0);

  useEffect(() => {
    if (isPillUpAccessableFromGB && profile?.userSettingFlag?.find(e => e?.type === 'pillup')?.status !== 1) {
      tourRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        setTourOpen(true)
      }, 1000);
    }
  }, [isPillUpAccessableFromGB]);

  const PILLUP_CONTENT = useCallback(() => {
    if (!isEditable)  return null;
    return (
      <div className="p-2">
        <div className="fs-18 fw-semibold text-black">Pillup Fulfilment <img className="img-fluid ms-2" src={tagNew} /></div>
        <div className="pt-1">You can now activate <b>PillUp</b> medicine <br /> fulfilment for the patient by enabling <br /> the toggle</div>
      </div>
    );
  }, [popOver3, isEditable]);

  //PopOver3 function
  const showHidePillUpPopover = useCallback(() => {
    setPopOver3(!popOver3);
  }, [popOver3]);

  const onTourHandle = () => {
    dispatch(upsertDoctorSettingFlag({ type: 'pillup', status: 1 }))
    setTourOpen(!tourOpen)
  }

  const steps = [
    {
      description:
        <>
          <div className="fs-18 fw-semibold pt-3 text-black">Pillup Fulfilment <img className="img-fluid ms-2" src={tagNew} /></div>
          <div className="pt-1">You can now activate <b>PillUp</b> medicine <br /> fulfilment for the patient by enabling <br /> the toggle</div>
        </>,
      target: () => tourRef.current,
      nextButtonProps: {
        children: 'Okay',
        onClick: onTourHandle
      }
    }
  ];

  const pillUpChange = (checked) => {
    dispatch(setPillupSwitch(checked))
  };

  const renderAutoFill = useCallback(() => {
    const { currentMedications: lastMedications = {} } =
      lastPrescriptionDataForAssessment || {};
    if (
      !lastMedications?.length
    )
      return null;
    return (
      <div className="relative-medication-box-auto-fill">
        <AutoFillButton
          refCallback={setAutoFillButtonRef}
          showOnlyAutoFill={true}
          onClick={(data, e) => {
            e?.stopPropagation();
            if (autoFillClickedRef?.current > 0) return;
            autoFillClickedRef.current += 1;
  
            
            const updatedData = lastMedications?.map((e) => {
              const medicineUnit = e?.medicineUnit.map((e1) => {
                return {
                  key: JSON.stringify({ ...e1 }),
                  value: e1.tmu_id,
                  label: String(e1.tmu_title || ""),
                };
              });
      
              const unitObj = medicineUnit
                ? medicineUnit.find((x) => x.value?.toString() == e.tmm_unit)
                : null;
              const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
              const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);
      
              return {
                ...e,
                tmm_unit_name: unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
                tmm_freq_type_name:
                  e.tmf_block == 0
                    ? `${e.tcm_tmm_freq_morning && e.tcm_tmm_freq_morning != 0
                      ? e.tcm_tmm_freq_morning + " - "
                      : "0 -"
                    }${e.tcm_tmm_freq_afternoon && e.tcm_tmm_freq_afternoon != 0
                      ? e.tcm_tmm_freq_afternoon + " - "
                      : "0 -"
                    }${e.tcm_tmm_freq_evening && e.tcm_tmm_freq_evening != 0
                      ? e.tcm_tmm_freq_evening + " - "
                      : ""
                    }${e.tcm_tmm_freq_night && e.tcm_tmm_freq_night != 0
                      ? e.tcm_tmm_freq_night
                      : "0"}`
                    : frequencyObj !== undefined
                      ? frequencyObj.tmf_title
                      : "",
                tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
                tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
                tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
                tmm_days_duration_type: EXTRA_OPTIONS.some((x) => x.value == e.tmm_duration_type) ? e.tmm_duration_type : e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : "",
                unique_id: uuidv4(),
              };
            });
            if (lastMedications.length && !medicationData?.length) {
              dispatch(setMedicationData(updatedData));
            } else {
              dispatch(
                setMedicationData(
                  [...medicationData, ...updatedData]
                )
              );
              // dispatch(
              //   setMedicationData(
              //     [...medicationData, ...lastMedications]
              //   )
              // );
            }
          }}
          title={`Autofill From OPD ${lastRxDate ? `(${formatDateToShortMonthYear(lastRxDate)})` : ""}`}
        />
      </div>
    );
  }, [lastPrescriptionDataForAssessment, medicationData]);

  return (
    <>
      <div>
        <div className="d-flex align-items-center justify-content-between p-14-pb0">
          <div className="d-flex align-items-center">
            <img className="me-2" src={Medicationicon} alt="Medication" />
            <div className="title-common">{isPillUpAccessableFromGB ? 'Meds' : 'Medications'} (Rx)</div>
          </div>
          {isEditable && <div className="d-flex align-items-center">
            {profile?.dp_id === 9 && (
              <button
                className="btn d-flex align-items-center btn-text"
                onClick={handleViewDoseCalcDrawer}
              >
                {" "}
                <img src={calculatorIcon} alt="Dose calcultor" className="svg-hovered me-2" /><span>{isPillUpAccessableFromGB ? 'Dose calc' : 'Dose calculator'}</span>
              </button>
            )}
            <button
              className="btn d-flex align-items-center btn-text"
              // onClick={loadPreviousRxClick}
            >
              {" "}
              {/* <i className="icon-reload me-2"></i> <span>{isPillUpAccessableFromGB ? 'Prev. Rx ' : 'Load Prev. Rx'}</span> */}
              {renderAutoFill()}
            </button>
            {/* <Popover
              open={popOver1}
              onOpenChange={showHideTemplatesListPopover}
              content={TEMPLATE_CONTENT}
              trigger="click"
              overlayClassName="pop-350 pp-0"
              placement="bottom"
            >
              <button className="btn d-flex align-items-center btn-text">
                {" "}
                <i className="icon-template me-2"></i> <span>{isPillUpAccessableFromGB ? 'Temp' : 'Templates'}</span>
              </button>
            </Popover>
            <Tooltip placement="bottom" title={(medicationData.length > 0) ? "" : "Please enter some medications to save a template"}>
              <Popover
                open={popOver2}
                onOpenChange={() => (medicationData.length > 0) && showHideSaveTemplatePopOver()}
                // onOpenChange={showHideSaveTemplatePopOver}
                content={SAVE_CONTENT}
                trigger="click"
                overlayClassName="pop-450 pp-0"
                placement="bottom"
              >
                <button className="btn d-flex align-items-center btn-text">
                  {" "}
                  <i className="icon-save me-2"></i> <span>Save</span>
                </button>

              </Popover>
            </Tooltip> */}
            <button onClick={showHideClearData} className="btn btn-text clear-text d-flex align-items-center" disabled={medicationData.length > 0 ? false : true}>
              <i className="icon-eraser1 me-2"></i> {!isPillUpAccessableFromGB && <span>Clear</span>}
            </button>
          </div>}
        </div>

        {DELETE_MODAL}
        {REMOVE_ALL_ROWS}
        {TABLE_MEDICATION}
        {isAddMedicineOpen && ADD_MEDICINE_DATA}

        {doseCalculatorDrawer &&
          <Drawer
            closeIcon={false}
            className="modalWidth-800"
            placement="right"
            open={doseCalculatorDrawer}
            onClose={showHideModal2}
            width="auto"
            styles={{
              body: {
                backgroundColor: "white",
              }
            }}
          >
            <DoseCalculator
              handleViewDoseCalcDrawer={handleViewDoseCalcDrawer}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchMLQuery={searchMLQuery}
              setSearchMLQuery={setSearchMLQuery}
              medicationLibrary={medicationLibrary}
              setMedicationLibrary={setMedicationLibrary}
              parentSearchOptions={parentSearchOptions}
              onSearchParent={onSearchParent}
              onSelectParent={onSelectParent}
              showHideAddMedicineModal={showHideAddMedicineModal}
              setAddCustom={setAddCustom}
              editDoseId={editDoseId}
              isModalOpen2={isModalOpen2}
              showHideModal2={showHideModal2}
            />
          </Drawer>
        }

        <Drawer
          closeIcon={false}
          placement="right"
          onClose={() => handleDrawerChild()}
          open={childDrawer}
          className="modalWidth-563"
          width="auto"
        >
          {addCustom ? ADD_MEDICINE_DATA : CHILD_DRAWER_DATA}
        </Drawer>

        {isEditable && <div className="p-14 py-0">
          <div
            className="inputheight38 border rounded-10px d-flex align-items-center"
            onClick={handleDrawerParent}
          >
            <i className="icon-search mx-2"></i>
            <span className="fontroboto backbar fw-normal">
              Search Medicines by Name
            </span>
          </div>
        </div>}
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerParent}
          open={parentDrawer}
          width={"100%"}
          className="searchdrawer-content"
        >
          {parentDrawer && (
            <TabMedicationSearch
              passIndex={selectedIndex}
              onClose={handleDrawerParent}
            />
          )}
        </Drawer>
      </div>
    </>
  );
}

export default React.memo(MedicationsBox);