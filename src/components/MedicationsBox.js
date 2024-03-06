import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { AutoComplete, Input, Button, Row, Col, Select, Popover, Tabs, Spin, message, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CommonModal from '../common/CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';
import CashManagerContext from '../context/CashManagerContext';
import { MESSAGE_KEY } from "../utils/constants";
import { onlyNumberFormat, removeBeforeWhiteSpace, frequencyFormat, frequencyCombination, isNumeric } from "../utils/utils";
import Medicationicon from "../assets/images/Medication.svg";
import TimingInfo from "../assets/images/TimingInfo.svg";
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
} from "../redux/medicationSlice";

const { TextArea } = Input;

function MedicationsBox() {
  const [messageApi, contextHolder] = message.useMessage();
  const { frequencyList, timingList } = useSelector((state) => state.doctors);
  const {
    selectedMedicationList,
    parentOptionsList,
    templates,
    loading,
  } = useSelector((state) => state.medication);
  const dispatch = useDispatch();

  const { patient_data, medicationData, setMedicationData } = useContext(CashManagerContext);

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeTemplateId, setRemoveTemplateId] = useState(null);

  const [searchParentQuery, setSearchParentQuery] = useState("");
  const [parentSearchOptions, setParentSearchOptions] = useState([]);

  const [unitPerDoseOptions, setUnitPerDoseOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  const [sinceOptions, setSinceOptions] = useState([]);
  const SINCE_OPTIONS = [
    { value: "day(s)", label: "Days" },
    { value: "week(s)", label: "Weeks" },
    { value: "month(s)", label: "Months" },
    { value: "year(s)", label: "Years" },
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

  useEffect(() => {
    dispatch(getMedicationTemplates());
  }, []);

  useEffect(() => {
    setMatchedTemplates(templates);
    setAllTemplates(templates);
  }, [templates]);

  //Parent AutoComplete
  useEffect(() => {
    if (searchParentQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchMedication({ searchQuery: searchParentQuery, type: "parent" })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(getFrequentlySearchedMedication());
    }
  }, [searchParentQuery]);

  useEffect(() => {
    const data = [];
    parentOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.tmm_medicine_name,
        label: <div><span className="fw-medium">{e.tmm_medicine_name}</span>, <span>{e.tmm_generic}</span></div>,
      });
    });
    if (searchParentQuery.length == 0) {
      data.unshift({
        key: -1,
        label: (
          <>
            <div>FREQUENTLY USED</div>
          </>
        ),
      });
    }
    setParentSearchOptions(data);
  }, [parentOptionsList]);

  const onSearchParent = useCallback(
    (query) => {
      setSearchParentQuery(removeBeforeWhiteSpace(query));
    },
    [searchParentQuery]
  );

  const onSelectParent = async (data, e) => {
    const action = await dispatch(getMedicineDetails(JSON.parse(e.key).tmm_id));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action.payload.map((e) => {

        const unitObj = e?.medicineUnit ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit) : null;
        const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
        const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

        return {
          ...e,
          tmm_unit_name: unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
          tmm_freq_type_name: e.tmf_block == 0 ?
            `${e.tcm_tmm_freq_morning ? e.tcm_tmm_freq_morning + " - " : "0 -"}${e.tcm_tmm_freq_afternoon ? e.tcm_tmm_freq_afternoon + " - " : "0 -"}${e.tcm_tmm_freq_evening ? e.tcm_tmm_freq_evening + " - " : "0 -"}${e.tcm_tmm_freq_night ? e.tcm_tmm_freq_night : "0"}`
            : frequencyObj !== undefined ? frequencyObj.tmf_title : "",
          tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
          tmm_days_duration_type: `${e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""}`,
          unique_id: uuidv4(),
        };
      });
      medicationData.push({
        ...updatedData[0],
      });
      setMedicationData((prev) => [...prev]);
      setSearchParentQuery("");
    } else {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: action.error.message,
        duration: 2,
      });
    }
  };

  const onSearchUnitPerDoseChid = useCallback(
    (query, i) => {
      const updateQuery = onlyNumberFormat(query);
      medicationData[i].tmm_dosage_unit_name = updateQuery;
      medicationData[i].tmm_dosage = '';
      medicationData[i].tmm_unit = 0;
      medicationData[i].tmm_unit_name = '';
      medicationData[i].tmu_id = 0;
      setMedicationData((prev) => [...prev]);
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

  const onSelectUnitPerDoseChild = useCallback(
    (data, e, i) => {
      setUnitPerDoseOptions([]);
      const objParse = JSON.parse(e.key);
      medicationData[i].tmm_dosage_unit_name = data;
      medicationData[i].tmm_dosage = objParse.tmm_dosage;
      medicationData[i].tmm_unit = objParse.tmu_id;
      medicationData[i].tmm_unit_name = objParse.tmu_title;
      medicationData[i].tmu_id = objParse.tmu_id;
      setMedicationData((prev) => [...prev]);
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
  //     setMedicationData((prev) => [...prev]);
  //   },
  //   [medicationData]
  // );

  const filteredTitles = frequencyList.filter((item) => item.tmf_block !== 0);

  const [frequencyQuery, setFrequencyQuery] = useState('');

  const onBlurFrequencyChild = useCallback(
    async (i) => {
      if (isNumeric(frequencyQuery) && frequencyQuery.length <= 3) {
        medicationData[i].tmm_freq_type_name = `${frequencyQuery[0]}-${frequencyQuery[1]}-${frequencyQuery[2]}`;
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery[1];
        medicationData[i].tcm_tmm_freq_evening = frequencyQuery[2];
        medicationData[i].tcm_tmm_freq_morning = frequencyQuery[0];
        medicationData[i].tcm_tmm_freq_night = 0;
        setMedicationData((prev) => [...prev]);
      } else if (isNumeric(frequencyQuery) && frequencyQuery.length >= 4) {
        medicationData[i].tmm_freq_type_name = `${frequencyQuery[0]}-${frequencyQuery[1]}-${frequencyQuery[2]}-${frequencyQuery[3]}`;
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery[1];
        medicationData[i].tcm_tmm_freq_evening = frequencyQuery[2];
        medicationData[i].tcm_tmm_freq_morning = frequencyQuery[0];
        medicationData[i].tcm_tmm_freq_night = frequencyQuery[3];
        setMedicationData((prev) => [...prev]);
      } else if (!frequencyFormat(medicationData[i].tmm_freq_type_name) && filteredTitles.findIndex((x) => x.tmf_title == medicationData[i].tmm_freq_type_name) == -1) {
        medicationData[i].tmm_freq_type_name = "";
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery[1];
        medicationData[i].tcm_tmm_freq_evening = frequencyQuery[2];
        medicationData[i].tcm_tmm_freq_morning = frequencyQuery[0];
        medicationData[i].tcm_tmm_freq_night = frequencyQuery[3];
        setMedicationData((prev) => [...prev]);
      } else if (frequencyFormat(medicationData[i].tmm_freq_type_name)) {
        medicationData[i].tmm_freq_type_name = frequencyQuery;
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = frequencyQuery.split("-")[1] ? frequencyQuery.split("-")[1] : 0;
        medicationData[i].tcm_tmm_freq_evening = frequencyQuery.split("-")[2] ? frequencyQuery.split("-")[2] : 0;
        medicationData[i].tcm_tmm_freq_morning = frequencyQuery.split("-")[0] ? frequencyQuery.split("-")[0] : 0;
        medicationData[i].tcm_tmm_freq_night = frequencyQuery.split("-")[3] ? frequencyQuery.split("-")[3] : 0;
        setMedicationData((prev) => [...prev]);
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
        setMedicationData((prev) => [...prev]);
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
        medicationData[i].tcm_tmm_freq_afternoon = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[1] ? objParse.tmf_title.split("-")[1] : 0;
        medicationData[i].tcm_tmm_freq_evening = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[2] ? objParse.tmf_title.split("-")[2] : 0;
        medicationData[i].tcm_tmm_freq_morning = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[0] ? objParse.tmf_title.split("-")[0] : 0;
        medicationData[i].tcm_tmm_freq_night = objParse.tmf_id != 0 ? 0 : objParse.tmf_title.split("-")[3] ? objParse.tmf_title.split("-")[3] : 0;
      } else {
        medicationData[i].tmm_freq_type_name = "";
        medicationData[i].tmf_block = 0;
        medicationData[i].tmm_freq_type = 0;
        medicationData[i].tcm_tmm_freq_afternoon = 0;
        medicationData[i].tcm_tmm_freq_evening = 0;
        medicationData[i].tcm_tmm_freq_morning = 0;
        medicationData[i].tcm_tmm_freq_night = 0;
      }
      setMedicationData((prev) => [...prev]);
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
      setMedicationData((prev) => [...prev]);
    },
    [medicationData]
  );

  const onSearchSinceChid = useCallback(
    (query, i) => {
      const updateQuery = onlyNumberFormat(query);
      medicationData[i].tmm_days_duration_type = updateQuery;
      medicationData[i].tmm_days = '';
      medicationData[i].tmm_duration_type = '';
      setMedicationData((prev) => [...prev]);
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
        setSinceOptions([]);
      }
    },
    [sinceOptions, medicationData]
  );

  const onSelectSinceChild = useCallback(
    (data, e, i) => {
      setSinceOptions([]);
      const objParse = JSON.parse(e.key);
      medicationData[i].tmm_days_duration_type = data;
      medicationData[i].tmm_days = objParse.tmm_days;
      medicationData[i].tmm_duration_type = objParse.value;
      setMedicationData((prev) => [...prev]);
    },
    [sinceOptions, medicationData]
  );

  const onChangeNoteChild = useCallback(
    (e, i) => {
      medicationData[i].tmm_remarks = e.target.value;
      setMedicationData((prev) => [...prev]);
    },
    [medicationData]
  );

  const onRemoveRow = (index) => {
    medicationData.splice(index, 1);
    setMedicationData((prev) => [...prev]);
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
          tmm_freq_type_name: e.tmf_block == 0 ?
            `${e.tcm_tmm_freq_morning ? e.tcm_tmm_freq_morning + " - " : "0 -"}${e.tcm_tmm_freq_afternoon ? e.tcm_tmm_freq_afternoon + " - " : "0 -"}${e.tcm_tmm_freq_evening ? e.tcm_tmm_freq_evening + " - " : "0 -"}${e.tcm_tmm_freq_night ? e.tcm_tmm_freq_night : "0"}`
            : frequencyObj !== undefined ? frequencyObj.tmf_title : "",
          tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
          tmm_days_duration_type: `${e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""}`,
          unique_id: uuidv4(),
        };
      });
      setMedicationData([...medicationData, ...updatedData]);
    } else {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: action.error.message,
        duration: 2,
      });
    }
  };

  const onTemplateSelected = async (tmtd_id) => {
    const action = await dispatch(singleTemplateDetails(tmtd_id));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action.payload.map((e) => {

        const unitObj = e?.medicineUnit ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit) : null;
        const frequencyObj = frequencyList.find((x) => x.tmf_id == e.tmm_freq_type);
        const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

        return {
          ...e,
          tmm_unit_name: unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
          tmm_freq_type_name: e.tmf_block == 0 ?
            `${e.tcm_tmm_freq_morning ? e.tcm_tmm_freq_morning + " - " : "0 -"}${e.tcm_tmm_freq_afternoon ? e.tcm_tmm_freq_afternoon + " - " : "0 -"}${e.tcm_tmm_freq_evening ? e.tcm_tmm_freq_evening + " - " : "0 -"}${e.tcm_tmm_freq_night ? e.tcm_tmm_freq_night : "0"}`
            : frequencyObj !== undefined ? frequencyObj.tmf_title : "",
          tmf_block_val: frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          tmm_dosage_unit_name: `${e.tmm_dosage ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""}` : ""}`,
          tmm_days_duration_type: `${e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""}`,
          unique_id: uuidv4(),
        };
      });
      setMedicationData([...medicationData, ...updatedData]);
      showHideTemplatesListPopover();
    } else {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: action.error.message,
        duration: 2,
      });
    }
  };

  const onDeleteTemplateClicked = async (tmtd_id) => {
    const action = await dispatch(deleteTemplate(tmtd_id));
    if (action.meta.requestStatus === "fulfilled") {
      showHideModal()
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
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 medication added',
        duration: 2
      });
    } else if (medicationData.filter((e) => e.tmm_medicine_name == "").length > 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup medication name',
        duration: 2
      });
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
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 medication added',
        duration: 2
      });
    } else if (medicationData.filter(e => e.tmm_medicine_name == "").length > 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup medication name',
        duration: 2
      });
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
  const [timingPopOver, setTimingPopOver] = useState(false);

  const showHideTimingPopOver = useCallback(() => {
    setTimingPopOver(!timingPopOver);
  }, [timingPopOver]);

  const TIMING_CONTENT = useCallback(() => {
    return (
      <div className="position-relative">
        <img src={TimingInfo} alt="Timing Info" />
        <i onClick={showHideTimingPopOver} className="icon-Cross position-absolute cursor-pointer" style={{ right: 13, top: 15, color: '#92929D' }}></i>
      </div>
    );
  }, [timingPopOver]);

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
            {console.log("first")}
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
                <div onClick={() => onDeleteTemplateClicked(removeTemplateId)}
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

  //Child Componet
  const TABLE_MEDICATION = useMemo(() => {
    return (
      <>
        {medicationData.length > 0 &&
          <Row
            gutter={[0]}
            className={`mt-14 border-top align-items-center`}
          >
            <Col lg={5} md={5} sm={5} xs={5} className="border-end">
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                <label>MEDICINE</label>
              </div>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} className="border-end">
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                <label>UNIT PER DOSE</label>
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} className="border-end">
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome d-flex align-items-center">
                <label>TIMING </label>
                <Popover
                  open={timingPopOver}
                  content={TIMING_CONTENT}
                  placement="rightTop"
                  trigger="click"
                  arrow={false}
                  onOpenChange={showHideTimingPopOver}
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
            <Col lg={3} md={3} sm={3} xs={3} className="border-end">
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                <label>DURATION</label>
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} className="border-end">
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                <label>NOTE</label>
              </div>
            </Col>
            <Col lg={1} md={1} sm={2} xs={2} className="text-center">
              <div className="fontroboto fw-medium p-2 fs-12 text-welcome">
                <label></label>
              </div>
            </Col>
          </Row>
        }
        {medicationData.length > 0 &&
          medicationData.map((item, index) => {
            return (
              <Row
                key={index}
                gutter={[0]}
                className={`${index === 0 && "border-top"} border-bottom`}
              >
                <Col lg={5} md={5} sm={5} xs={5} className="border-end">
                  <div className="fontroboto fw-medium p-2">
                    <label>{item.tmm_medicine_name}</label>
                    <Tooltip placement="bottom" title={item.tmm_generic}>
                      <div className="text-truncate fw-normal">{item.tmm_generic}</div>
                    </Tooltip>
                  </div>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3} className="border-end">
                  <AutoComplete
                    defaultValue={item.tmm_dosage_unit_name}
                    value={item.tmm_dosage_unit_name}
                    placeholder="e.g 1 Tablet"
                    bordered={false}
                    defaultOpen={false}
                    onSearch={(query) => onSearchUnitPerDoseChid(query, index)}
                    options={unitPerDoseOptions}
                    // backfill={true}
                    className="autocomplete-custom w-100 h-100 inputborder"
                    defaultActiveFirstOption={true}
                    onSelect={(data, e) => onSelectUnitPerDoseChild(data, e, index)}
                    onClear={() => onSearchUnitPerDoseChid("", index)}
                    allowClear
                  />
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                  <Select
                    showSearch
                    className="autocomplete-custom w-100 h-100 inputborder"
                    placeholder="e.g 1-0-1"
                    defaultValue={item.tmm_freq_type_name != "" ? item.tmm_freq_type_name : null}
                    value={item.tmm_freq_type_name != "" ? item.tmm_freq_type_name : null}
                    onSearch={(query) => onSearchFrequencyChild(query, index)}
                    onFocus={() => onSearchFrequencyChild(item.tmm_freq_type_name, index)}
                    onBlur={() => onBlurFrequencyChild(index)}
                    onSelect={(data) => onSelectFrequencyChild(data, index)}
                    options={frequencyOptions}
                    onClear={() => onSelectFrequencyChild("", index)}
                    allowClear
                  />
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                  <Select
                    className="autocomplete-custom w-100 h-100 inputborder"
                    placeholder="e.g Before Food"
                    defaultValue={item.tmm_time_name != "" ? item.tmm_time_name : null}
                    value={item.tmm_time_name != "" ? item.tmm_time_name : null}
                    onSelect={(data) => onSelectTimingChild(data, index)}
                    options={timingList.map((e) => {
                      return {
                        value: JSON.stringify({ ...e, unique_id: uuidv4() }),
                        label: e.tmt_title,
                      };
                    })}
                    onClear={() => onSelectTimingChild("", index)}
                    allowClear
                  />
                </Col>
                <Col lg={3} md={3} sm={3} xs={3} className="border-end">
                  <AutoComplete
                    defaultValue={item.tmm_days_duration_type}
                    value={item.tmm_days_duration_type}
                    placeholder="e.g 1 Day"
                    bordered={false}
                    defaultOpen={false}
                    onSearch={(query) => onSearchSinceChid(query, index)}
                    options={sinceOptions}
                    className="autocomplete-custom h-100 w-100 inputborder"
                    defaultActiveFirstOption={true}
                    onSelect={(data, e) => onSelectSinceChild(data, e, index)}
                    onClear={() => onSearchSinceChid("", index)}
                    allowClear
                  />
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                  <TextArea
                    className="notesinput border-0 h-100 align-self-center"
                    placeholder="Notes"
                    defaultValue={item.tmm_remarks}
                    value={item.tmm_remarks}
                    autoSize={{
                      minRows: 1,
                      maxRows: 2,
                    }}
                    onChange={(e) => onChangeNoteChild(e, index)}
                  />
                </Col>
                <Col lg={1} md={1} sm={2} xs={2} className="text-center">
                  <Button
                    className="btn py-0 btn-delete-prescription px-0"
                    onClick={() => onRemoveRow(index)}
                  >
                    <i className="icon-delete"></i>
                  </Button>
                </Col>
              </Row>
            );
          })}
      </>
    );
  }, [medicationData, timingPopOver]);

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

  return (
    <>
      {contextHolder}
      <div>
        <div className="d-flex align-items-center justify-content-between p-14-pb0">
          <div className="d-flex align-items-center">
            <img className="me-2" src={Medicationicon} alt="Medication" />
            <div className="title-common">Medications (Rx)</div>
          </div>
          <div className="d-flex align-items-center">
            <button
              className="btn d-flex align-items-center btn-text"
              onClick={loadPreviousRxClick}
            >
              {" "}
              <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span>
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
                <i className="icon-template me-2"></i> <span>Templates</span>
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
          </div>
        </div>

        {DELETE_MODAL}
        {TABLE_MEDICATION}

        <div className="p-14">
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
        </div>
      </div>
    </>
  );
}

export default React.memo(MedicationsBox);
