import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { AutoComplete, Input, Button, Form, Row, Col, Select, Popover, Tabs, Spin, Tooltip, Drawer, message, Switch, Tour } from "antd";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CommonModal from '../common/CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';
import CashManagerContext from '../context/CashManagerContext';
import { errorMessage, onlyNumberFormat, removeBeforeWhiteSpace, frequencyFormat, frequencyCombination, isNumeric, onlyDecimalFormat, capitalizeAfterSentence, replaceCommasAndSemicolons, capitalize, hasNumber, isAlphabetExit, calculateDose, getClinicName } from "../utils/utils";
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
import { setMedicationData, setPillupSwitch } from "../redux/prescriptionSlice";


const { TextArea } = Input;

function MedicationsBox(props) {
  const { isEditable = true } = props;
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
  const { patient_data, caseManagerData } = state;
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;

  let { medicationData : medicationDataFromStore, pillupSwitch } = useSelector((state) => state.prescription);
  const medicationData = medicationDataFromStore ? structuredClone(medicationDataFromStore) : [];


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

  const isPillUpAccessableFromGB = useFeatureIsOn(GB_PILLUP_MEDICINE);

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

          const unitObj = e?.medicineUnit ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit) : null;
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
          medicationLibrary.push({
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
          });
          setMedicationLibrary(medicationData);
          setSearchMLQuery("");
          setAddCustom(null);
        } else {
          const next =  [...medicationData, updatedData?.[0]];
          dispatch(setMedicationData(next));
          setSearchParentQuery("");
          setAddCustom(null);
        }

      } else {
        errorMessage(action.error)
      }
    }
  };

  const onSearchUnitPerDoseChid = useCallback(
    (query, i) => {
      const updateQuery = onlyDecimalFormat(query);
      medicationData[i].tmm_dosage_unit_name = updateQuery;
      medicationData[i].tmm_dosage = '';
      medicationData[i].tmm_unit = 0;
      medicationData[i].tmm_unit_name = '';
      medicationData[i].tmu_id = 0;
      dispatch(setMedicationData(medicationData));
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

  const onBlurUnitPerDoseChid = useCallback(
    async (i) => {
      if (!isAlphabetExit(medicationData[i].tmm_dosage_unit_name)) {
        setUnitPerDoseOptions([]);
        medicationData[i].tmm_dosage_unit_name = "";
        medicationData[i].tmm_dosage = '';
        medicationData[i].tmm_unit = 0;
        medicationData[i].tmm_unit_name = '';
        medicationData[i].tmu_id = 0;
        dispatch(setMedicationData(medicationData));
      }
    },
    [unitPerDoseOptions, medicationData]
  );

  const onSelectUnitPerDoseChild = useCallback(
    (data, e, i) => {
      setUnitPerDoseOptions([]);
      const objParse = JSON.parse(e.key);
      medicationData[i].tmm_dosage_unit_name = data;
      medicationData[i].tmm_dosage = objParse.tmm_dosage;
      medicationData[i].tmm_unit = objParse.tmu_id;
      medicationData[i].tmm_unit_name = objParse.tmu_title;
      medicationData[i].tmu_id = objParse.tmu_id;
      dispatch(setMedicationData(medicationData));
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

  const filteredTitles = frequencyList.filter((item) => item.tmf_block !== 0);

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

  const onAutoFillDuration = (index) => {
    const { tmm_days_duration_type, tmm_days, tmm_duration_type } = medicationData[index]
    medicationData.forEach(e => {
      e.tmm_days_duration_type = tmm_days_duration_type;
      e.tmm_days = tmm_days;
      e.tmm_duration_type = tmm_duration_type;
    });
    dispatch(setMedicationData(medicationData));
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

  const onChangeNoteChild = useCallback(
    (e, i) => {
      medicationData[i].tmm_remarks = e.target.value;
      dispatch(setMedicationData(medicationData));
    },
    [medicationData]
  );

  const onRemoveRow = (index) => {
    medicationData.splice(index, 1);
    dispatch(setMedicationData(medicationData));
  };

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

        const unitObj = e?.medicineUnit ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit) : null;
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

        const unitObj = e?.medicineUnit ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit) : null;
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

  const taperDoseAdd = async (item) => {
    const clinic_name = getClinicName(profile?.hospital_data);
    window.Moengage.track_event("TP_Medicine_Tappered_Web", {
      clinic_name,
      "Doctor_unique_id": profile?.doctor_unique_id,
      "Doctor_specialty": profile?.dp_name,
      "Patient_Name": patient_data?.pm_fullname,
      "Patient_ID": patient_data?.patient_unique_id,
      "Rx_Id": item?.tmm_id,
    });
    const array = await innerMedication(item?.index).map(e1 => ({ ...e1, index: medicationData.findIndex(e => e.unique_id == e1.unique_id) }))
    let updatedData = {
      ...array.at(-1),
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
    let { index, ...updated } = updatedData
    medicationData.splice(parseInt(array.at(-1).index) + 1, 0, updated);
    dispatch(setMedicationData(medicationData));
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
    const noteProps = isEditable ? { lg: 6, md: 6, sm: 6, xs: 6 } : { flex: 'auto' };
    return (
      <>
        {medicationData.length > 0 &&
          <Row
            gutter={[0]}
            className={`mt-14 border-top align-items-center`}
          >
            <Col lg={1} md={1} sm={1} xs={1}>
              &nbsp;
            </Col>
            <Col lg={5} md={5} sm={5} xs={5}>
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                <label>MEDICINE</label>
              </div>
            </Col>
            <Col lg={18} md={18} sm={18} xs={18}>
              <Row>
                <Col lg={5} md={5} sm={5} xs={5} className="border-end border-start">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label>UNIT PER DOSE</label>
                  </div>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome d-flex align-items-center">
                    <label>FREQUENCY </label>
                    <Popover
                      open={frequencyPopOver}
                      content={FREQUENCY_CONTENT}
                      placement="rightTop"
                      trigger="click"
                      arrow={false}
                      onOpenChange={showHideFrequencyPopOver}
                      overlayClassName="pp-0">
                      <i className='icon-info ms-1 fs-18'></i>
                    </Popover>
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
                <Col {...noteProps} className="border-end">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label>NOTE</label>
                  </div>
                </Col>
                {isEditable && <Col lg={1} md={1} sm={2} xs={2} className="text-center">
                  <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                    <label></label>
                  </div>
                </Col>}
              </Row>
            </Col>
          </Row>
        }
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="medication" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {medicationData.length > 0 &&
                  medicationData.map((e, index) => ({ ...e, index: index })).reduce((acc, curr) => acc?.at(-1)?.tmm_id == curr.tmm_id ? acc : [...acc, curr], []).map((item, i) => (
                    <Draggable key={i} draggableId={`medication-${i}`} index={i}>
                      {(provided) => (
                        <Row
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          key={i}
                          gutter={[0]}
                          className={`taper-dose align-items-center ${i === 0 && "border-top"} border-bottom`}
                        >
                          <Col lg={1} md={1} sm={1} xs={1} className="text-center">
                            <MenuOutlined
                              {...provided.dragHandleProps}
                              className="drag-handle"
                              style={{ cursor: 'grab' }}
                            >
                            </MenuOutlined>
                          </Col>
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <div className="fontroboto fw-medium p-2 pe-3">
                              <label>{item.tmm_medicine_name}</label>
                              <Tooltip placement="bottom" title={item.tmm_generic}>
                                <div className="text-truncate fw-normal me-1">{item.tmm_generic}</div>
                              </Tooltip>
                            </div>
                          </Col>
                          <Col lg={18} md={18} sm={18} xs={18}>
                            {!item.pms_default &&
                              <i className="icon-Edit fs-18 position-absolute" style={{ bottom: 0, left: -22 }}
                                onClick={() => {
                                  const medicineType = medicineTypeList.find(x => x?.tmy_id == item?.tmm_type)
                                  const makeData = {
                                    unique_id: item.unique_id,
                                    tmm_id: item.tmm_id,
                                    tmm_medicine_name: item.tmm_medicine_name,
                                    tmm_generic: item.tmm_generic,
                                    tmm_company: item.tmm_company
                                  }
                                  const updateItem = medicineType !== undefined ? { ...makeData, ...medicineType } : makeData
                                  showHideAddMedicineModal()
                                  setAddCustom(updateItem);
                                }}
                              ></i>
                            }
                            {innerMedication(item.index).map(e1 => ({ ...e1, index: medicationData.findIndex(e => e.unique_id == e1.unique_id) })).map((item, ii) => {
                              return (
                                <Row key={ii} className={`${ii != 0 && 'position-relative border-top'}`}>
                                  <Col lg={5} md={5} sm={5} xs={5} className="border-end border-start">
                                    <AutoComplete
                                      defaultValue={item.tmm_dosage_unit_name}
                                      value={item.tmm_dosage_unit_name}
                                      placeholder="e.g 1 Tablet"
                                      bordered={false}
                                      defaultOpen={false}
                                      onSearch={(query) => onSearchUnitPerDoseChid(query, item?.index)}
                                      onBlur={() => onBlurUnitPerDoseChid(item?.index)}
                                      options={unitPerDoseOptions}
                                      // backfill={true}
                                      className="autocomplete-custom w-100 h-100 inputborder"
                                      defaultActiveFirstOption={true}
                                      onSelect={(data, e) => onSelectUnitPerDoseChild(data, e, item?.index)}
                                      onClear={() => onSearchUnitPerDoseChid("", item?.index)}
                                      allowClear
                                    />
                                    {ii === 0 && profile?.dp_id === 9 && (
                                      dosesList.some((e1) => e1.medicine_id == item.tmm_id) ? (
                                        <div className="badge-tapper position-absolute" style={{ bottom: 0, left: 20 }} onClick={() => handleViewDoseCalcDrawer("1", item?.tmm_id)}><img src={calculatorIconBlue} alt="Dose calcultor" className="svg-hovered me-1" /> Edit Calculation</div>
                                      ) : (
                                        <div className="badge-tapper position-absolute" style={{ bottom: 0, left: 20 }} onClick={() => handleViewDoseCalcDrawer("1", 0)}><img src={calculatorIconBlue} alt="Dose calcultor" className="svg-hovered me-1" /> Dose Calculator</div>
                                      )
                                    )}
                                  </Col>
                                  <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                                    <Select
                                      showSearch
                                      className="autocomplete-custom w-100 h-100 inputborder"
                                      placeholder="e.g 1-0-1"
                                      defaultValue={item.tmm_freq_type_name != "" ? item.tmm_freq_type_name : null}
                                      value={item.tmm_freq_type_name != "" ? item.tmm_freq_type_name : null}
                                      onSearch={(query) => onSearchFrequencyChild(query, item?.index)}
                                      onFocus={() => onSearchFrequencyChild(item.tmm_freq_type_name, item?.index)}
                                      onBlur={() => onBlurFrequencyChild(item?.index)}
                                      onSelect={(data) => onSelectFrequencyChild(data, item?.index)}
                                      options={frequencyOptions}
                                      onClear={() => onSelectFrequencyChild("", item?.index)}
                                      allowClear
                                    />
                                  </Col>
                                  <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                                    <Select
                                      className="autocomplete-custom w-100 h-100 inputborder"
                                      placeholder="e.g Before Food"
                                      defaultValue={item.tmm_time_name != "" ? item.tmm_time_name : null}
                                      value={item.tmm_time_name != "" ? item.tmm_time_name : null}
                                      onSelect={(data) => onSelectTimingChild(data, item?.index)}
                                      options={timingList.map((e) => {
                                        return {
                                          value: JSON.stringify({ ...e, unique_id: uuidv4() }),
                                          label: e.tmt_title,
                                        };
                                      })}
                                      onClear={() => onSelectTimingChild("", item?.index)}
                                      allowClear
                                    />
                                  </Col>
                                  <Col lg={4} md={4} sm={4} xs={4} className="border-end autofill">
                                    <AutoComplete
                                      defaultValue={item.tmm_days_duration_type}
                                      value={hasNumber(item.tmm_days_duration_type) ? item.tmm_days_duration_type : capitalize(item.tmm_days_duration_type, true)}
                                      placeholder="e.g 1 Day"
                                      bordered={false}
                                      defaultOpen={false}
                                      onSearch={(query) => onSearchSinceChid(query, item?.index)}
                                      options={sinceOptions}
                                      className="autocomplete-custom h-100 w-100 inputborder truncate-autocomplete"
                                      popupClassName="option-truncate"
                                      defaultActiveFirstOption={true}
                                      onSelect={(data, e) => onSelectSinceChild(data, e, item?.index)}
                                      onClear={() => onSearchSinceChid("", item?.index)}
                                      allowClear
                                    />
                                    {item?.tmm_days_duration_type && (
                                      <div className="badge-autofill" onClick={() => onAutoFillDuration(item?.index)}><i className="icon-copyIcon fs-12-1" />Autofill to all meds</div>
                                    )}
                                  </Col>
                                  <Col {...noteProps} className="border-end">
                                    <TextArea
                                      className="notesinput border-0 h-100 align-self-center"
                                      placeholder="Notes"
                                      defaultValue={item.tmm_remarks}
                                      value={item.tmm_remarks}
                                      autoSize={{
                                        minRows: 1,
                                        maxRows: 2,
                                      }}
                                      onChange={(e) => onChangeNoteChild(e, item?.index)}
                                    />
                                  </Col>
                                  {isEditable ? <Col lg={1} md={1} sm={2} xs={2} className="d-flex align-items-center justify-content-center">
                                    <Button
                                      className="btn py-0 btn-delete-prescription px-0"
                                      onClick={() => onRemoveRow(item?.index)}
                                    >
                                      <i className="icon-delete"></i>
                                    </Button>
                                  </Col> : null}
                                  {ii != 0 && (<div className="badge-then">Then</div>)}
                                </Row>
                              )
                            })}
                          </Col>
                          <div className="badge-tapper" onClick={() => taperDoseAdd(item)}>
                            <i className="icon-Add me-1"></i> Tapering Dose
                          </div>
                        </Row>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
  }, [medicationData, frequencyPopOver, isEditable]);

  //Child Component
  // const TABLE_MEDICATION = useMemo(() => {
  //   return (
  //     <>
  //       {medicationData.length > 0 &&
  //         <Row
  //           gutter={[0]}
  //           className={`mt-14 border-top align-items-center`}
  //         >
  //           <Col lg={5} md={5} sm={5} xs={5}>
  //             <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
  //               <label>MEDICINE</label>
  //             </div>
  //           </Col>
  //           <Col lg={19} md={19} sm={19} xs={19}>
  //             <Row>
  //               <Col lg={4} md={4} sm={4} xs={4} className="border-end border-start">
  //                 <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
  //                   <label>UNIT PER DOSE</label>
  //                 </div>
  //               </Col>
  //               <Col lg={5} md={5} sm={5} xs={5} className="border-end">
  //                 <div className="fontroboto fw-medium p-2 fs-12 text-welcome d-flex align-items-center">
  //                   <label>FREQUENCY </label>
  //                   <Popover
  //                     open={frequencyPopOver}
  //                     content={FREQUENCY_CONTENT}
  //                     placement="rightTop"
  //                     trigger="click"
  //                     arrow={false}
  //                     onOpenChange={showHideFrequencyPopOver}
  //                     overlayClassName="pp-0">
  //                     <i className='icon-info ms-1 fs-18'></i>
  //                   </Popover>
  //                 </div>
  //               </Col>
  //               <Col lg={5} md={5} sm={5} xs={5} className="border-end">
  //                 <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
  //                   <label>WHEN</label>
  //                 </div>
  //               </Col>
  //               <Col lg={3} md={3} sm={3} xs={3} className="border-end">
  //                 <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
  //                   <label>DURATION</label>
  //                 </div>
  //               </Col>
  //               <Col lg={6} md={6} sm={6} xs={6} className="border-end">
  //                 <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
  //                   <label>NOTE</label>
  //                 </div>
  //               </Col>
  //               <Col lg={1} md={1} sm={2} xs={2} className="text-center">
  //                 <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
  //                   <label></label>
  //                 </div>
  //               </Col>
  //             </Row>
  //           </Col>
  //         </Row>
  //       }
  //       {medicationData.length > 0 &&
  //         medicationData.map((e, index) => ({ ...e, index: index })).reduce((acc, curr) => acc?.at(-1)?.tmm_id == curr.tmm_id ? acc : [...acc, curr], []).map((item, i) => {
  //           return (
  //             <>
  //               <Row
  //                 key={i}
  //                 gutter={[0]}
  //                 align="middle"
  //                 className={`taper-dose ${i === 0 && "border-top"} border-bottom`}
  //               >
  //                 <Col lg={5} md={5} sm={5} xs={5}>
  //                   <div className="fontroboto fw-medium p-2 pe-3">
  //                     <label>{item.tmm_medicine_name}</label>
  //                     <Tooltip placement="bottom" title={item.tmm_generic}>
  //                       <div className="text-truncate fw-normal me-1">{item.tmm_generic}</div>
  //                     </Tooltip>
  //                   </div>
  //                 </Col>
  //                 <Col lg={19} md={19} sm={19} xs={19}>
  //                   {!item.pms_default &&
  //                     <i className="icon-Edit fs-18 position-absolute" style={{ bottom: 0, left: -22 }}
  //                       onClick={() => {
  //                         const medicineType = medicineTypeList.find(x => x?.tmy_id == item?.tmm_type)
  //                         const makeData = {
  //                           unique_id: item.unique_id,
  //                           tmm_id: item.tmm_id,
  //                           tmm_medicine_name: item.tmm_medicine_name,
  //                           tmm_generic: item.tmm_generic,
  //                           tmm_company: item.tmm_company
  //                         }
  //                         const updateItem = medicineType !== undefined ? { ...makeData, ...medicineType } : makeData
  //                         showHideAddMedicineModal()
  //                         setAddCustom(updateItem);
  //                       }}
  //                     ></i>
  //                   }
  //                   {innerMedication(item.index).map(e1 => ({ ...e1, index: medicationData.findIndex(e => e.unique_id == e1.unique_id) })).map((item, ii) => {
  //                     return (
  //                       <Row key={ii} className={`${ii != 0 && 'position-relative border-top'}`}>
  //                         <Col lg={4} md={4} sm={4} xs={4} className="border-end border-start">
  //                           <AutoComplete
  //                             defaultValue={item.tmm_dosage_unit_name}
  //                             value={item.tmm_dosage_unit_name}
  //                             placeholder="e.g 1 Tablet"
  //                             bordered={false}
  //                             defaultOpen={false}
  //                             onSearch={(query) => onSearchUnitPerDoseChid(query, item?.index)}
  //                             onBlur={() => onBlurUnitPerDoseChid(item?.index)}
  //                             options={unitPerDoseOptions}
  //                             // backfill={true}
  //                             className="autocomplete-custom w-100 h-100 inputborder"
  //                             defaultActiveFirstOption={true}
  //                             onSelect={(data, e) => onSelectUnitPerDoseChild(data, e, item?.index)}
  //                             onClear={() => onSearchUnitPerDoseChid("", item?.index)}
  //                             allowClear
  //                           />
  //                         </Col>
  //                         <Col lg={5} md={5} sm={5} xs={5} className="border-end">
  //                           <Select
  //                             showSearch
  //                             className="autocomplete-custom w-100 h-100 inputborder"
  //                             placeholder="e.g 1-0-1"
  //                             defaultValue={item.tmm_freq_type_name != "" ? item.tmm_freq_type_name : null}
  //                             value={item.tmm_freq_type_name != "" ? item.tmm_freq_type_name : null}
  //                             onSearch={(query) => onSearchFrequencyChild(query, item?.index)}
  //                             onFocus={() => onSearchFrequencyChild(item.tmm_freq_type_name, item?.index)}
  //                             onBlur={() => onBlurFrequencyChild(item?.index)}
  //                             onSelect={(data) => onSelectFrequencyChild(data, item?.index)}
  //                             options={frequencyOptions}
  //                             onClear={() => onSelectFrequencyChild("", item?.index)}
  //                             allowClear
  //                           />
  //                         </Col>
  //                         <Col lg={5} md={5} sm={5} xs={5} className="border-end">
  //                           <Select
  //                             className="autocomplete-custom w-100 h-100 inputborder"
  //                             placeholder="e.g Before Food"
  //                             defaultValue={item.tmm_time_name != "" ? item.tmm_time_name : null}
  //                             value={item.tmm_time_name != "" ? item.tmm_time_name : null}
  //                             onSelect={(data) => onSelectTimingChild(data, item?.index)}
  //                             options={timingList.map((e) => {
  //                               return {
  //                                 value: JSON.stringify({ ...e, unique_id: uuidv4() }),
  //                                 label: e.tmt_title,
  //                               };
  //                             })}
  //                             onClear={() => onSelectTimingChild("", item?.index)}
  //                             allowClear
  //                           />
  //                         </Col>
  //                         <Col lg={3} md={3} sm={3} xs={3} className="border-end">
  //                           <AutoComplete
  //                             defaultValue={item.tmm_days_duration_type}
  //                             value={hasNumber(item.tmm_days_duration_type) ? item.tmm_days_duration_type : capitalize(item.tmm_days_duration_type, true)}
  //                             placeholder="e.g 1 Day"
  //                             bordered={false}
  //                             defaultOpen={false}
  //                             onSearch={(query) => onSearchSinceChid(query, item?.index)}
  //                             options={sinceOptions}
  //                             className="autocomplete-custom h-100 w-100 inputborder truncate-autocomplete"
  //                             popupClassName="option-truncate"
  //                             defaultActiveFirstOption={true}
  //                             onSelect={(data, e) => onSelectSinceChild(data, e, item?.index)}
  //                             onClear={() => onSearchSinceChid("", item?.index)}
  //                             allowClear
  //                           />
  //                         </Col>
  //                         <Col lg={6} md={6} sm={6} xs={6} className="border-end">
  //                           <TextArea
  //                             className="notesinput border-0 h-100 align-self-center"
  //                             placeholder="Notes"
  //                             defaultValue={item.tmm_remarks}
  //                             value={item.tmm_remarks}
  //                             autoSize={{
  //                               minRows: 1,
  //                               maxRows: 2,
  //                             }}
  //                             onChange={(e) => onChangeNoteChild(e, item?.index)}
  //                           />
  //                         </Col>
  //                         <Col lg={1} md={1} sm={2} xs={2} className="d-flex align-items-center justify-content-center">
  //                           <Button
  //                             className="btn py-0 btn-delete-prescription px-0"
  //                             onClick={() => onRemoveRow(item?.index)}
  //                           >
  //                             <i className="icon-delete"></i>
  //                           </Button>
  //                         </Col>
  //                         {ii != 0 && (<div className="badge-then">Then</div>)}
  //                       </Row>
  //                     )
  //                   })}
  //                 </Col>
  //                 <div className="badge-tapper" onClick={() => taperDoseAdd(item)}>
  //                   <i className="icon-Add me-1"></i> Tapering Dose
  //                 </div>
  //               </Row>
  //             </>
  //           );
  //         })}
  //     </>
  //   );
  // }, [medicationData, frequencyPopOver]);

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

        if (doseCalculatorDrawer) {
          medicationLibrary.map(item => {
            if (item.tmm_id == modifyData.tmm_id) {
              item.tmm_medicine_name = modifyData.tmm_medicine_name;
              item.tmm_generic = modifyData.tmm_generic;
              item.tmm_company = modifyData.tmm_company;
              item.tmm_type = modifyData.tmm_type;
              item.tmm_dosage_unit_name = '';
              item.tmm_dosage = '';
              item.tmm_unit = 0;
              item.tmm_unit_name = '';
              item.tmu_id = 0;
              item.medicineUnit = modifyData.medicineUnit;
            }
            return item;
          });
        } else {
          medicationData.map(item => {
            if (item.tmm_id == modifyData.tmm_id) {
              item.tmm_medicine_name = modifyData.tmm_medicine_name;
              item.tmm_generic = modifyData.tmm_generic;
              item.tmm_company = modifyData.tmm_company;
              item.tmm_type = modifyData.tmm_type;
              item.tmm_dosage_unit_name = '';
              item.tmm_dosage = '';
              item.tmm_unit = 0;
              item.tmm_unit_name = '';
              item.tmu_id = 0;
              item.medicineUnit = modifyData.medicineUnit;
            }
            return item;
          });
        }
      } else {
        const updatedData = action.payload.map((e) => {

          const unitObj = e?.medicineUnit ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit) : null;
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
          medicationLibrary.push({
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
          });
        } else {
          medicationData.push({
            ...updatedData[0],
          });
        }
      }
      if (doseCalculatorDrawer) {
        setMedicationLibrary(medicationData);
        setSearchMLQuery("");
      } else {
        dispatch(setMedicationData(medicationData));
        setSearchParentQuery("");
      }
      showHideAddMedicineModal()
      setGenericQuery('');
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
    dispatch(setMedicationData([]))
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

  // Tour Pillup
  const tourRef = useRef(null);

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

  return (
    <>
      <div>
        <div className="d-flex align-items-center justify-content-between p-14-pb0">
          <div className="d-flex align-items-center">
            <img className="me-2" src={Medicationicon} alt="Medication" />
            <div className="title-common">{isPillUpAccessableFromGB ? 'Meds' : 'Medications'} (Rx)</div>
            {(isPillUpAccessableFromGB && isEditable) &&
              <div ref={tourRef} className="ms-2 border rounded-20px px-2 py-1 d-flex align-items-center" style={{ backgroundColor: 'rgb(226, 226, 234, 0.2)' }}>
                <img src={Pillup} />
                <Popover
                  open={popOver3}
                  onOpenChange={showHidePillUpPopover}
                  content={profile?.userSettingFlag?.find(e => e?.type === 'pillup')?.status === 1 ? PILLUP_CONTENT() : null}
                  trigger="hover"
                  placement="bottom"
                >
                  <i className="icon-info opacity-50 fs-18 mx-1"></i>
                </Popover>
                <Switch className="switch-custom" value={pillupSwitch} onChange={pillUpChange} />
                <Tour placement="bottom" closeIcon={false} open={tourOpen} steps={steps} onClose={onTourHandle} />
              </div>
            }
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
              onClick={loadPreviousRxClick}
            >
              {" "}
              <i className="icon-reload me-2"></i> <span>{isPillUpAccessableFromGB ? 'Prev. Rx ' : 'Load Prev. Rx'}</span>
            </button>
            <Popover
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
            </Tooltip>
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

        {isEditable && <div className="p-14">
          <AutoComplete
            // defaultValue={searchParentQuery}
            value={searchParentQuery}
            onSearch={onSearchParent}
            options={parentSearchOptions}
            className="autocomplete-custom w-100"
            onSelect={onSelectParent}
            defaultActiveFirstOption={true}
            popupClassName={!searchParentQuery && "boxpopup"}
          >
            <Input
              placeholder="Search Medicines by Name"
              prefix={<i className="icon-search"></i>}
            />
          </AutoComplete>
        </div>}
      </div>
    </>
  );
}

export default React.memo(MedicationsBox);