import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  InputNumber,
  Input,
  Button,
  Drawer,
  Tabs,
  message,
  Select,
  Card,
  Spin,
  Row,
  Col,
  Form,
  Radio,
  Segmented,
  Tooltip,
} from "antd";
import {
  Button as BSButton,
  ButtonGroup as BSButtonGroup,
} from "react-bootstrap";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import CashManagerContext from "../../context/CashManagerContext";
import { MESSAGE_KEY } from "../../utils/constants";
import {
  onlyNumberFormat,
  removeBeforeWhiteSpace,
  isNumeric,
} from "../../utils/utils";
import Medicationicon from "../../assets/images/Medication.svg";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getMedicationTemplates,
  singleTemplateDetails,
  getMedicineDetails,
  getFrequentlySearchedMedication,
  showMedicineTime,
  showMedicineFrequency,
  getLoadPreviousRx,
} from "../../redux/medicationSlice";

import TabMedicationSearch from "./TabMedicationSearch";
import TabMedicationMoreModal from "./TabMedicationMoreModal";

function TabMedicationBox() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    selectedMedicationList,
    parentOptionsList,
    templates,
    frequencyList,
    timingList,
    loading,
  } = useSelector((state) => state.medication);
  const dispatch = useDispatch();

  const { patient_data, medicationData, setMedicationData } =
    useContext(CashManagerContext);

  const [parentDrawer, setParentDrawer] = useState(false);
  const [childDrawer, setChildDrawer] = useState(false);
  const [childDrawerData, setChildDrawerData] = useState(null);

  const [templateDrawer, setTemplateDrawer] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [saveDrawer, setSaveDrawer] = useState(false);

  const [inputTemplateName, setInputTemplateName] = useState(null);
  const TAB_ADD_TEMPLATE = 1;
  const TAB_UPDATE_TEMPLATE = 2;
  const ADD_EDIT_TEMPLATE_TABS = [
    { key: TAB_ADD_TEMPLATE, label: "New Template" },
    { key: TAB_UPDATE_TEMPLATE, label: "Update Template" },
  ];
  const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const SINCE_OPTIONS = [
    { value: "day(s)", label: "D" },
    { value: "week(s)", label: "W" },
    { value: "month(s)", label: "M" },
    { value: "year(s)", label: "Y" },
  ];
  const [sinceValue, setSinceValue] = useState(1);
  const [inputSince, setInputSince] = useState("");
  const [sinceOptions, setSinceOptions] = useState([]);

  const [selectedTab, setSelectedTab] = useState(null);
  const [timingMoreOptionsVisible, setTimingMoreOptionsVisible] = useState(false);
  const [frequencyMoreOptionsVisible, setFrequencyMoreOptionsVisible] = useState(false);

  const filteredTitles = frequencyList.filter((item) => item.tmf_block !== 0);

  useEffect(() => {
    const onEditPreFillMedicationData = () => {
      const updatedData = medicationData.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: <>{e1.tmu_title}</>,
          };
        });

        const unitObj = medicineUnit
          ? medicineUnit.find((x) => x.value === e.tmm_unit)
          : null;
        const frequencyObj = frequencyList.find(
          (x) => x.tmf_id === e.tmm_freq_type
        );
        const timingObj = timingList.find((x) => x.tmt_id === e.tmm_time);

        return {
          ...e,
          tmm_unit_name:
            unitObj && unitObj !== undefined
              ? JSON.parse(unitObj.key).tmu_title
              : "",
          tmm_freq_type_name:
            frequencyObj !== undefined ? frequencyObj.tmf_title : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          medicineUnit: medicineUnit,
          unique_id: uuidv4(),
        };
      });
      setMedicationData([...updatedData]);
    };
    medicationData.length > 0 && onEditPreFillMedicationData()
  }, []);

  useEffect(() => {
    dispatch(getMedicationTemplates());
    dispatch(getFrequentlySearchedMedication());
    dispatch(showMedicineTime());
    dispatch(showMedicineFrequency());
  }, []);

  useEffect(() => {
    setMatchedTemplates(templates);
    setAllTemplates(templates);
  }, [templates]);

  const onRemoveRow = (index) => {
    medicationData.splice(index, 1);
    setMedicationData((prev) => [...prev]);
    setSelectedIndex(null);
  };

  // Handle Parent Drawer
  const handleDrawerParent = useCallback(() => {
    setParentDrawer(!parentDrawer);
  }, [parentDrawer]);

  const onSelectParent = async (e) => {
    const action = await dispatch(getMedicineDetails(e.tmm_id));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action.payload.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: <>{e1.tmu_title}</>,
          };
        });

        const unitObj = medicineUnit
          ? medicineUnit.find((x) => x.value === e.tmm_unit)
          : null;
        const frequencyObj = frequencyList.find(
          (x) => x.tmf_id === e.tmm_freq_type
        );
        const timingObj = timingList.find((x) => x.tmt_id === e.tmm_time);

        return {
          ...e,
          tmm_unit_name:
            unitObj && unitObj !== undefined
              ? JSON.parse(unitObj.key).tmu_title
              : "",
          tmm_freq_type_name:
            frequencyObj !== undefined ? frequencyObj.tmf_title : "",
          tmf_block_val:
            frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          medicineUnit: medicineUnit,
          unique_id: uuidv4(),
        };
      });
      medicationData.push({
        ...updatedData[0],
      });
      setMedicationData((prev) => [...prev]);
      setSelectedIndex(medicationData.length - 1);
      handleDrawerParent();
    } else {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: action.error.message,
        duration: 2,
      });
    }
  };

  // Handle Child Drawer
  const handleDrawerChild = useCallback(
    (item) => {
      setChildDrawer(!childDrawer);
      setChildDrawerData(item);
      if (item) {
        if (item?.tmf_block > 0) {
          setSelectedTab("other");
        } else {
          if (item?.tcm_tmm_freq_evening) {
            setSelectedTab("mean");
          } else {
            setSelectedTab("man");
          }
        }
      }
      setSinceValue(item && item.tmm_days ? parseInt(item.tmm_days) : 1);
    },
    [childDrawer, childDrawerData, sinceValue, selectedTab]
  );

  // Handle Template Drawer
  const handleDrawerTemplate = useCallback(() => {
    setTemplateDrawer(!templateDrawer);
  }, [templateDrawer]);

  // Handle Save Drawer
  const handleDrawerSave = useCallback(() => {
    setInputTemplateName(null);
    setSaveDrawer(!saveDrawer);
  }, [saveDrawer]);

  const onTabChange = useCallback(
    (key) => {
      setInputTemplateName(null);
      setTabChange(key);
    },
    [tabChange]
  );

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
      patient_unique_id:
        patient_data !== undefined ? patient_data.patient_unique_id : 0,
    };
    const action = await dispatch(getLoadPreviousRx(sendData));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action.payload.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: <>{e1.tmu_title}</>,
          };
        });

        const unitObj = medicineUnit
          ? medicineUnit.find((x) => x.value === e.tmm_unit)
          : null;
        const frequencyObj = frequencyList.find(
          (x) => x.tmf_id === e.tmm_freq_type
        );
        const timingObj = timingList.find((x) => x.tmt_id === e.tmm_time);

        return {
          ...e,
          tmm_unit_name:
            unitObj && unitObj !== undefined
              ? JSON.parse(unitObj.key).tmu_title
              : "",
          tmm_freq_type_name:
            frequencyObj !== undefined ? frequencyObj.tmf_title : "",
          tmf_block_val:
            frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          medicineUnit: medicineUnit,
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
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: <>{e1.tmu_title}</>,
          };
        });

        const unitObj = medicineUnit
          ? medicineUnit.find((x) => x.value === e.tmm_unit)
          : null;
        const frequencyObj = frequencyList.find(
          (x) => x.tmf_id === e.tmm_freq_type
        );
        const timingObj = timingList.find((x) => x.tmt_id === e.tmm_time);

        return {
          ...e,
          tmm_unit_name:
            unitObj && unitObj !== undefined
              ? JSON.parse(unitObj.key).tmu_title
              : "",
          tmm_freq_type_name:
            frequencyObj !== undefined ? frequencyObj.tmf_title : "",
          tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
          medicineUnit: medicineUnit,
          unique_id: uuidv4(),
        };
      });
      setMedicationData([...medicationData, ...updatedData]);
      handleDrawerTemplate();
    } else {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: action.error.message,
        duration: 2,
      });
    }
  };

  const onDeleteTemplateClicked = (tmtd_id) => {
    dispatch(deleteTemplate(tmtd_id));
  };

  const onChangeSaveTemplate = useCallback(
    (e) => {
      const updateQuery = removeBeforeWhiteSpace(e.target.value);
      setInputTemplateName(updateQuery);
    },
    [inputTemplateName]
  );

  const onAddTemplateClicked = async () => {
    if (medicationData.length === 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: "At least 1 medication added",
        duration: 2,
      });
    } else if (
      medicationData.filter((e) => e.tmm_medicine_name === "").length > 0
    ) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: "Please fillup medication name",
        duration: 2,
      });
    } else {
      var sendData = {
        tmtd_template_name: inputTemplateName,
        data: medicationData,
      };
      const action = await dispatch(addTemplate(sendData));
      if (action.meta.requestStatus === "fulfilled") {
        setInputTemplateName(null);
        handleDrawerSave();
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
    if (medicationData.length === 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: "At least 1 medication added",
        duration: 2,
      });
    } else if (
      medicationData.filter((e) => e.medication_name === "").length > 0
    ) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: "warning",
        content: "Please fillup medication name",
        duration: 2,
      });
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tmtd_id: data.tmtd_id,
        tmtd_template_name: data.tmtd_template_name,
        data: medicationData,
      };
      const action = await dispatch(updateTemplate(sendData));
      if (action.meta.requestStatus === "fulfilled") {
        setInputTemplateName(null);
        handleDrawerSave();
      }
    }
  };

  const TABLE_MEDICATION = useMemo(() => {
    return (
      medicationData.length > 0 &&
      medicationData.map((item, index) => {
        return (
          <div
            key={index}
            style={{
              width:
                item.tmm_medicine_name.length > 12 &&
                  item.tmm_medicine_name.length < 24
                  ? `${item.tmm_medicine_name.length * 10.5}px`
                  : item.tmm_medicine_name.length >= 24
                    ? "256px"
                    : "150px",
            }}
            className="d-flex align-items-center justify-content-between text-truncate closable-chips closable-chips-active"
          >
            <div
              className="text-truncate p-2"
              onClick={() => handleDrawerChild({ ...item, index: index })}>
              <div className="text-truncate">
                {item.tmm_medicine_name}
                {item.tmm_dosage || item.tmm_unit_name ? (
                  isNumeric(item.tmf_block) && item.tmf_block === 0 ? (
                    <div className="text-truncate small">{`
                    ${item.tmm_dosage && item.tmm_unit_name ? `${item.tmm_dosage} ${item.tmm_unit_name}` + " | " : ""}
                    ${item.tcm_tmm_freq_morning ? item.tcm_tmm_freq_morning + " - " : "0 -"}
                    ${item.tcm_tmm_freq_afternoon ? item.tcm_tmm_freq_afternoon + " - " : "0 -"}
                    ${item.tcm_tmm_freq_evening ? item.tcm_tmm_freq_evening + " - " : selectedTab !== 'man' ? "0 -" : ""}
                    ${item.tcm_tmm_freq_night ? item.tcm_tmm_freq_night + " | " : "0 |"}
                    ${item.tmm_time_name ? item.tmm_time_name : ""}`}</div>
                  ) : (
                    <div className="text-truncate small">{`
                      ${item.tmm_dosage && item.tmm_unit_name ? `${item.tmm_dosage} ${item.tmm_unit_name}` + " | " : ""}
                      ${item.tmm_freq_type_name ? item.tmm_freq_type_name + " | " : ""}
                      ${item.tmm_time_name ? item.tmm_time_name : ""}
                      `}</div>
                  )
                ) : (
                  <div className="text-truncate small">Note</div>
                )}
              </div>
            </div>
            <Button
              type="text"
              className="rounded-0 btn-close-chips"
              onClick={() => onRemoveRow(index)}
            >
              <i className="icon-Cross"></i>
            </Button>
          </div>
        );
      })
    );
  }, [medicationData, selectedTab]);

  //Template Componet
  const TEMPLATE_CONTENT = useMemo(() => {
    return (
      <>
        <div>
          <div className="medicine-templates">
            <Input
              className="popinput"
              onChange={onSearch}
              placeholder="Search Templates"
              prefix={<i className="icon-search me-2"></i>}
              allowClear
            />
          </div>
          <div className="tab-template-height">
            {matchedTemplates.length > 0 &&
              matchedTemplates.map((template, i) => {
                return (
                  <div
                    className="align-items-center d-flex justify-content-between medicine-templates"
                    key={i}
                  >
                    <div
                      className="align-items-center d-flex text-truncate w-100"
                      onClick={() => onTemplateSelected(template.tmtd_id)}
                    >
                      <div className="round-box">
                        <i className="icon-template"></i>
                      </div>
                      <div className="text-truncate w-100">
                        <div className="title text-main2">
                          {template.tmtd_template_name}
                        </div>
                      </div>
                    </div>
                    <Button
                      className="btn btn-delete-prescription p-0 ms-3"
                      onClick={() => onDeleteTemplateClicked(template.tmtd_id)}
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
        </div>
      </>
    );
  }, [templateDrawer, matchedTemplates]);

  //Save Componet
  const SAVE_CONTENT = useMemo(() => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
          <Tabs
            defaultActiveKey={TAB_ADD_TEMPLATE}
            items={ADD_EDIT_TEMPLATE_TABS}
            onChange={onTabChange}
            className="w-100"
          />
        </div>
        {tabChange === TAB_ADD_TEMPLATE ? (
          <div className="medicine-templates d-flex">
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
          <div className="medicine-templates d-flex">
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
  }, [tabChange, saveDrawer, inputTemplateName, loading, allTemplates]);

  const onChangeDosageChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      setChildDrawerData({ ...childDrawerData, tmm_dosage: updateQuery });
    },
    [childDrawerData]
  );

  const onSelectMedicineUnitChild = useCallback(
    (data) => {
      const obj = childDrawerData.medicineUnit
        ? childDrawerData.medicineUnit.find((e) => e.value === data)
        : null;
      if (obj && obj !== undefined) {
        const objParse = JSON.parse(obj.key);
        setChildDrawerData({
          ...childDrawerData,
          tmm_unit: objParse.tmu_id,
          tmm_unit_name: objParse.tmu_title,
          tmu_id: objParse.tmu_id,
        });
      }
    },
    [childDrawerData]
  );

  const morningDecrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_morning: parseInt(prev.tcm_tmm_freq_morning) - 1,
      };
    });
  }, [childDrawerData]);

  const morningClick = useCallback(() => {
    setChildDrawerData((prev) => {
      return { ...prev, tcm_tmm_freq_morning: 1 };
    });
  }, [childDrawerData]);

  const onChangeInputMorningChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      setChildDrawerData({
        ...childDrawerData,
        tcm_tmm_freq_morning: updateQuery,
      });
    },
    [childDrawerData]
  );

  const morningIncrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_morning: parseInt(prev.tcm_tmm_freq_morning) + 1,
      };
    });
  }, [childDrawerData]);

  const afternoonDecrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_afternoon: parseInt(prev.tcm_tmm_freq_afternoon) - 1,
      };
    });
  }, [childDrawerData]);

  const afternoonClick = useCallback(() => {
    setChildDrawerData((prev) => {
      return { ...prev, tcm_tmm_freq_afternoon: 1 };
    });
  }, [childDrawerData]);

  const onChangeInputAfternoonChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      setChildDrawerData({
        ...childDrawerData,
        tcm_tmm_freq_afternoon: updateQuery,
      });
    },
    [childDrawerData]
  );

  const afternoonIncrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_afternoon: parseInt(prev.tcm_tmm_freq_afternoon) + 1,
      };
    });
  }, [childDrawerData]);

  const eveningDecrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_evening: parseInt(prev.tcm_tmm_freq_evening) - 1,
      };
    });
  }, [childDrawerData]);

  const eveningClick = useCallback(() => {
    setChildDrawerData((prev) => {
      return { ...prev, tcm_tmm_freq_evening: 1 };
    });
  }, [childDrawerData]);

  const onChangeInputEveningChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      setChildDrawerData({
        ...childDrawerData,
        tcm_tmm_freq_evening: updateQuery,
      });
    },
    [childDrawerData]
  );

  const eveningIncrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_evening: parseInt(prev.tcm_tmm_freq_evening) + 1,
      };
    });
  }, [childDrawerData]);

  const nightDecrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_night: parseInt(prev.tcm_tmm_freq_night) - 1,
      };
    });
  }, [childDrawerData]);

  const nightClick = useCallback(() => {
    setChildDrawerData((prev) => {
      return { ...prev, tcm_tmm_freq_night: 1 };
    });
  }, [childDrawerData]);

  const onChangeInputNightChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      setChildDrawerData({
        ...childDrawerData,
        tcm_tmm_freq_night: updateQuery,
      });
    },
    [childDrawerData]
  );

  const nightIncrement = useCallback(() => {
    setChildDrawerData((prev) => {
      return {
        ...prev,
        tcm_tmm_freq_night: parseInt(prev.tcm_tmm_freq_night) + 1,
      };
    });
  }, [childDrawerData]);

  const handleRadioChange = useCallback(
    (e) => {
      setSelectedTab(e.target.value);
      if (e.target.value !== "other") {
        childDrawerData.tmf_block = 0;
      } else {
        childDrawerData.tmf_block = 1;
      }
      setChildDrawerData({
        ...childDrawerData,
        tmm_freq_type: 0,
        tmm_freq_type_name: "",
        tcm_tmm_freq_afternoon: 0,
        tcm_tmm_freq_evening: 0,
        tcm_tmm_freq_morning: 0,
        tcm_tmm_freq_night: 0
      });
    },
    [selectedTab, childDrawerData]
  );

  const onChangeFrequencyChild = useCallback(
    (item) => {
      setChildDrawerData({
        ...childDrawerData,
        tmm_freq_type: item.tmf_id,
        tmm_freq_type_name: item.tmf_title,
        tmf_block_val: item.tmf_block_val
      });
    },
    [childDrawerData]
  );

  const handleFrequencyMoreOptionsVisible = useCallback(
    () => {
      setFrequencyMoreOptionsVisible(!frequencyMoreOptionsVisible)
    },
    [frequencyMoreOptionsVisible]
  );

  const onChangeTimingChild = useCallback(
    (item) => {
      setChildDrawerData({
        ...childDrawerData,
        tmm_time: item.tmt_id,
        tmm_time_name: item.tmt_title
      });
    },
    [childDrawerData]
  );

  const handleTimingMoreOptionsVisible = useCallback(
    () => {
      setTimingMoreOptionsVisible(!timingMoreOptionsVisible)
    },
    [timingMoreOptionsVisible]
  );

  useEffect(() => {
    if (sinceValue !== -1) {
      const options = SINCE_OPTIONS.map((option) => {
        return {
          key: Math.random(),
          value: option.value,
          label: <>{`${sinceValue}${option.label}`}</>,
        };
      });
      setSinceOptions(options);
    } else if (inputSince.length > 0) {
      const options = SINCE_OPTIONS.map((option) => {
        return {
          key: Math.random(),
          value: option.value,
          label: <>{`${inputSince}${option.label}`}</>,
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
  }, [sinceValue]);

  const onChangeInputSinceChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      setInputSince(updateQuery);
      setChildDrawerData({
        ...childDrawerData,
        tmm_days: parseInt(updateQuery),
        tmm_duration_type: "",
      });
      if (updateQuery.length > 0) {
        const options = SINCE_OPTIONS.map((option) => {
          return {
            key: Math.random(),
            value: option.value,
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

  const SINCE_LIST = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    {
      value: -1,
      label: (
        <Input
          className="w-100 segment-input"
          placeholder="Custom"
          value={inputSince}
          inputMode="numeric"
          onChange={onChangeInputSinceChild}
          onClick={() => onChangeSegmentedSinceChild(-1)}
        />
      ),
    },
  ];

  const onChangeSegmentedSinceChild = useCallback(
    (key) => {
      setSinceValue(key);
      setChildDrawerData({
        ...childDrawerData,
        tmm_days: key !== -1 ? key : 0,
        tmm_duration_type: "",
      });
    },
    [sinceValue, childDrawerData]
  );

  const onChangeSinceChild = useCallback(
    (key) => {
      setChildDrawerData({ ...childDrawerData, tmm_duration_type: key });
    },
    [childDrawerData]
  );

  const onChangeInputNoteChild = useCallback(
    (e) => {
      setChildDrawerData({ ...childDrawerData, tmm_remarks: e.target.value });
    },
    [childDrawerData]
  );

  const updateChild = (item) => {
    const { index, ...updatedReqData } = item;
    medicationData[item.index] = {
      ...medicationData[item.index],
      ...updatedReqData,
    };
    setMedicationData((prev) => [...prev]);
    handleDrawerChild();
  };

  //Child Componet
  const CHILD_DRAWER_DATA = useMemo(() => {
    return (
      childDrawerData && (
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
                  {childDrawerData.tmm_medicine_name}
                  <div className="text-truncate fs-14 fw-normal fontroboto mt-1">
                    {childDrawerData.tmm_generic}
                  </div>
                </div>
              </div>
              <Button
                className="btn btn-primary3 btn-41 px-4 me-20"
                onClick={() => updateChild(childDrawerData)}
              >
                Done
              </Button>
            </div>
          </Card>
          <div className="p-4">
            <div>
              <label className="title-common mb-1">Unit/Dose</label>
              <Row gutter={20} className="mb-3">
                <Col md={12}>
                  <Input
                    placeholder="e.g. 1"
                    value={
                      childDrawerData.tmm_dosage
                        ? childDrawerData.tmm_dosage
                        : ""
                    }
                    inputMode="numeric"
                    onChange={onChangeDosageChild}
                    className="inputheight38 rounded-10px"
                  />
                </Col>
                <Col md={12}>
                  <Select
                    className="autocomplete-custom w-100 popinput inputheight38"
                    placeholder="Select"
                    defaultValue={
                      childDrawerData.medicineUnit
                        ? childDrawerData.medicineUnit.findIndex(
                          (e) => e.value === childDrawerData.tmm_unit
                        ) !== -1
                          ? parseInt(childDrawerData.tmm_unit)
                          : null
                        : null
                    }
                    value={
                      childDrawerData.medicineUnit
                        ? childDrawerData.medicineUnit.findIndex(
                          (e) => e.value === childDrawerData.tmm_unit
                        ) !== -1
                          ? parseInt(childDrawerData.tmm_unit)
                          : null
                        : null
                    }
                    onSelect={onSelectMedicineUnitChild}
                    options={childDrawerData.medicineUnit}
                  />
                </Col>
              </Row>
              <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                <label className="title-common">Timing</label>
                <div className="mb-1 man-mean">
                  <Radio.Group
                    size="small"
                    onChange={handleRadioChange}
                    value={selectedTab}
                  >
                    <Radio.Button
                      value="man"
                      className={`${selectedTab === "man" ? "selected-tab" : ""} fw-medium`}
                    >
                      <span
                        className={`${selectedTab === "man" ? "selected-tab" : ""} fw-medium`}
                      >
                        MAN
                      </span>
                    </Radio.Button>
                    <Radio.Button
                      value="mean"
                      className={`${selectedTab === "mean" ? "selected-tab" : ""} fw-medium`}
                    >
                      <span
                        className={`${selectedTab === "mean" ? "selected-tab" : ""} fw-medium`}
                      >
                        MEAN
                      </span>
                    </Radio.Button>
                    <Radio.Button
                      value="other"
                      className={`${selectedTab === "other" ? "selected-tab" : ""} fw-medium`}
                    >
                      <span
                        className={`${selectedTab === "other" ? "selected-tab" : ""} fw-medium`}
                      >
                        Hrs a Day
                      </span>
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              {selectedTab === "man" && (
                <Row className="input-dark">
                  <Col lg={8}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border w-100 rounded-0"
                    >
                      {childDrawerData.tcm_tmm_freq_morning !== undefined &&
                        childDrawerData.tcm_tmm_freq_morning !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={morningDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData.tmf_block}
                        onClick={() =>
                          !childDrawerData.tcm_tmm_freq_morning &&
                          morningClick()
                        }
                      >
                        <Input
                          placeholder="Morning"
                          inputMode="numeric"
                          value={
                            childDrawerData.tcm_tmm_freq_morning
                              ? childDrawerData.tcm_tmm_freq_morning
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputMorningChild}
                        />
                      </BSButton>
                      {childDrawerData.tcm_tmm_freq_morning !== undefined &&
                        childDrawerData.tcm_tmm_freq_morning !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={morningIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col lg={8}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 w-100 border rounded-0 border-start-0"
                    >
                      {childDrawerData.tcm_tmm_freq_afternoon !== undefined &&
                        childDrawerData.tcm_tmm_freq_afternoon !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={afternoonDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData.tmf_block}
                        onClick={() =>
                          !childDrawerData.tcm_tmm_freq_afternoon &&
                          afternoonClick()
                        }
                      >
                        <Input
                          placeholder="Afternoon"
                          inputMode="numeric"
                          value={
                            childDrawerData.tcm_tmm_freq_afternoon
                              ? childDrawerData.tcm_tmm_freq_afternoon
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputAfternoonChild}
                        />
                      </BSButton>
                      {childDrawerData.tcm_tmm_freq_afternoon !== undefined &&
                        childDrawerData.tcm_tmm_freq_afternoon !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={afternoonIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col lg={8}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 w-100 border rounded-0 border-start-0"
                    >
                      {childDrawerData.tcm_tmm_freq_night !== undefined &&
                        childDrawerData.tcm_tmm_freq_night !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={nightDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData.tmf_block}
                        onClick={() =>
                          !childDrawerData.tcm_tmm_freq_night && nightClick()
                        }
                      >
                        <Input
                          placeholder="Night"
                          inputMode="numeric"
                          value={
                            childDrawerData.tcm_tmm_freq_night
                              ? childDrawerData.tcm_tmm_freq_night
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputNightChild}
                        />
                      </BSButton>
                      {childDrawerData.tcm_tmm_freq_night !== undefined &&
                        childDrawerData.tcm_tmm_freq_night !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
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
                  <Col lg={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0"
                    >
                      {childDrawerData.tcm_tmm_freq_morning !== undefined &&
                        childDrawerData.tcm_tmm_freq_morning !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={morningDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData.tmf_block}
                        onClick={() =>
                          !childDrawerData.tcm_tmm_freq_morning &&
                          morningClick()
                        }
                      >
                        <Input
                          placeholder="Morning"
                          inputMode="numeric"
                          value={
                            childDrawerData.tcm_tmm_freq_morning
                              ? childDrawerData.tcm_tmm_freq_morning
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputMorningChild}
                        />
                        {/* <InputNumber
                          placeholder="Morning"
                          value={
                            childDrawerData.tcm_tmm_freq_morning
                              ? childDrawerData.tcm_tmm_freq_morning
                              : ""
                          }
                          style={{ paddingLeft:"5%", textAlign: 'center', fontSize: '18px' }}
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputMorningChild}
                          step={0.1}
                        /> */}
                      </BSButton>
                      {childDrawerData.tcm_tmm_freq_morning !== undefined &&
                        childDrawerData.tcm_tmm_freq_morning !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={morningIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col lg={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0 border-start-0"
                    >
                      {childDrawerData.tcm_tmm_freq_afternoon !== undefined &&
                        childDrawerData.tcm_tmm_freq_afternoon !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={afternoonDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData.tmf_block}
                        onClick={() =>
                          !childDrawerData.tcm_tmm_freq_afternoon &&
                          afternoonClick()
                        }
                      >
                        <Input
                          placeholder="Afternoon"
                          inputMode="numeric"
                          value={
                            childDrawerData.tcm_tmm_freq_afternoon
                              ? childDrawerData.tcm_tmm_freq_afternoon
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputAfternoonChild}
                        />
                        {/* <InputNumber
                          placeholder="Afternoon"
                          value={
                            childDrawerData.tcm_tmm_freq_afternoon
                              ? childDrawerData.tcm_tmm_freq_afternoon
                              : ""
                          }
                          style={{ paddingLeft:"5%", textAlign: 'center', fontSize: '18px' }}
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputAfternoonChild}
                          step={0.1}
                        /> */}
                      </BSButton>
                      {childDrawerData.tcm_tmm_freq_afternoon !== undefined &&
                        childDrawerData.tcm_tmm_freq_afternoon !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={afternoonIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col lg={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0 border-start-0"
                    >
                      {childDrawerData.tcm_tmm_freq_evening !== undefined &&
                        childDrawerData.tcm_tmm_freq_evening !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={eveningDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData.tmf_block}
                        onClick={() =>
                          !childDrawerData.tcm_tmm_freq_evening &&
                          eveningClick()
                        }
                      >
                        <Input
                          placeholder="Evening"
                          inputMode="numeric"
                          value={
                            childDrawerData.tcm_tmm_freq_evening
                              ? childDrawerData.tcm_tmm_freq_evening
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputEveningChild}
                        />
                        {/* <InputNumber
                          placeholder="Evening"
                          value={
                            childDrawerData.tcm_tmm_freq_evening
                              ? childDrawerData.tcm_tmm_freq_evening
                              : ""
                          }
                          style={{ paddingLeft:"5%", textAlign: 'center', fontSize: '18px' }}
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputEveningChild}
                          step={0.1}
                        /> */}
                      </BSButton>
                      {childDrawerData.tcm_tmm_freq_evening !== undefined &&
                        childDrawerData.tcm_tmm_freq_evening !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={eveningIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
                          </BSButton>
                        )}
                    </BSButtonGroup>
                  </Col>
                  <Col lg={6}>
                    <BSButtonGroup
                      aria-label="Basic example"
                      className="inputheight45 border rounded-0 border-start-0"
                    >
                      {childDrawerData.tcm_tmm_freq_night !== undefined &&
                        childDrawerData.tcm_tmm_freq_night !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={nightDecrement}
                          >
                            <i className="icon-minus d-block text-main"></i>
                          </BSButton>
                        )}
                      <BSButton
                        variant="outline-light"
                        className="rounded-0 dateoutline p-0 bg-white"
                        disabled={childDrawerData.tmf_block}
                        onClick={() =>
                          !childDrawerData.tcm_tmm_freq_night && nightClick()
                        }
                      >
                        <Input
                          placeholder="Night"
                          inputMode="numeric"
                          value={
                            childDrawerData.tcm_tmm_freq_night
                              ? childDrawerData.tcm_tmm_freq_night
                              : ""
                          }
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputNightChild}
                        />
                        {/* <InputNumber
                          placeholder="Night"
                          value={childDrawerData.tcm_tmm_freq_night}
                          style={{ paddingLeft:"5%", textAlign: 'center', fontSize: '18px' }}
                          className="rounded-0 h-100 border-0 text-center text-main"
                          onChange={onChangeInputNightChild}
                          step={0.1}
                        /> */}
                      </BSButton>
                      {childDrawerData.tcm_tmm_freq_night !== undefined &&
                        childDrawerData.tcm_tmm_freq_night !== 0 && (
                          <BSButton
                            variant="outline-light"
                            className="rounded-0 dateoutline px-2 bg-white"
                            disabled={childDrawerData.tmf_block}
                            onClick={nightIncrement}
                          >
                            <i className="icon-Add text-main d-block"></i>
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
                            className={`btn text-truncate ${childDrawerData.tmm_freq_type === item.tmf_id &&
                              "btn-segement"
                              }`}
                            onClick={() => onChangeFrequencyChild(item)}
                          >
                            {item.tmf_title}
                          </button>
                          {i === filteredTitles.slice(0, 2).length - 1 && (
                            <button
                              key={-1}
                              type="button"
                              className={`btn segment-more ${filteredTitles
                                .slice(2, filteredTitles.length)
                                .some(
                                  (e) => e.tmf_id === childDrawerData.tmm_freq_type
                                ) && "btn-segement"
                                }`}
                              onClick={handleFrequencyMoreOptionsVisible}
                            >
                              {filteredTitles
                                .slice(2, filteredTitles.length)
                                .some(
                                  (e) => e.tmf_id === childDrawerData.tmm_freq_type
                                ) ? (
                                <span id="selected">
                                  <i className="icon-Edit me-2 fs-21"></i>{" "}
                                  {childDrawerData.tmm_freq_type_name}
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
                {frequencyMoreOptionsVisible && (
                  <TabMedicationMoreModal
                    width='563px'
                    title={'Frequency'}
                    onClose={handleFrequencyMoreOptionsVisible}
                    onClick={(item) => {
                      setFrequencyMoreOptionsVisible(false);
                      onChangeFrequencyChild(item);
                    }}
                    label={'tmf_title'}
                    value={'tmf_id'}
                    selectedValue={childDrawerData.tmm_freq_type}
                    array={filteredTitles.slice(2, filteredTitles.length)} />
                )}
              </div>
              <div>
                <div className="segement-static d-flex flex-wrap">
                  {timingList.slice(0, 5).map((item, i) => {
                    return (
                      <>
                        <button
                          key={i}
                          type="button"
                          className={`btn mt-3 ${childDrawerData.tmm_time === item.tmt_id
                            ? "btn-segement"
                            : ""
                            }`}
                          onClick={() => onChangeTimingChild(item)}
                        >
                          {item.tmt_title}
                        </button>
                        {i === timingList.slice(0, 5).length - 1 && (
                          <button
                            key={-1}
                            type="button"
                            className={`btn mt-3 segment-more ${timingList
                              .slice(5, timingList.length)
                              .some(
                                (e) => e.tmt_id === childDrawerData.tmm_time
                              ) && "btn-segement"
                              }`}
                            onClick={handleTimingMoreOptionsVisible}
                          >
                            {timingList
                              .slice(5, timingList.length)
                              .some(
                                (e) => e.tmt_id === childDrawerData.tmm_time
                              ) ? (
                              <span id="selected">
                                <i className="icon-Edit me-2 fs-21"></i>
                                {childDrawerData.tmm_time_name}
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
                {timingMoreOptionsVisible && (
                  <TabMedicationMoreModal
                    width='563px'
                    title={'Timings'}
                    onClose={handleTimingMoreOptionsVisible}
                    onClick={(item) => {
                      setTimingMoreOptionsVisible(false);
                      onChangeTimingChild(item);
                    }}
                    label={'tmt_title'}
                    value={'tmt_id'}
                    selectedValue={childDrawerData.tmm_time}
                    array={timingList.slice(5, timingList.length)} />
                )}
              </div>
            </div>
            <div className="mt-3">
              <label className="title-common mb-1">Duration</label>
              <Segmented
                value={sinceValue > 5 ? -1 : sinceValue}
                className="search-segment"
                options={SINCE_LIST}
                onChange={onChangeSegmentedSinceChild}
              />
            </div>
            <div className="mt-3 mb-3">
              <Segmented
                value={
                  childDrawerData.tmm_duration_type !== undefined &&
                  childDrawerData.tmm_duration_type
                }
                className="search-segment"
                options={sinceOptions}
                onChange={onChangeSinceChild}
              />
            </div>
            <label className="title-common mb-1">Note</label>
            <Input.TextArea
              value={
                childDrawerData.tmm_remarks ? childDrawerData.tmm_remarks : ""
              }
              placeholder="Enter any specific notes here"
              className="textareaPlaceholder"
              rows={3}
              onChange={onChangeInputNoteChild}
            />
          </div>
        </>
      )
    );
  }, [
    childDrawer,
    childDrawerData,
    sinceValue,
    inputSince,
    sinceOptions,
    selectedTab,
    timingMoreOptionsVisible,
    frequencyMoreOptionsVisible
  ]);

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
            <button
              className="btn d-flex align-items-center btn-text"
              onClick={handleDrawerTemplate}
            >
              {" "}
              <i className="icon-template me-2"></i> <span>Templates</span>
            </button>
            <Tooltip
              placement="bottom"
              title={
                medicationData.length > 0
                  ? ""
                  : "Please enter some Medications to save a template"
              }
            >
              <button
                className="btn d-flex align-items-center btn-text"
                onClick={() => medicationData.length > 0 && handleDrawerSave()}
              >
                {" "}
                <i className="icon-save me-2"></i> <span>Save</span>
              </button>
            </Tooltip>
          </div>
          <Drawer
            title="Medication Templates"
            placement="right"
            onClose={handleDrawerTemplate}
            open={templateDrawer}
            className="modalWidth-563"
            width="auto"
          >
            {TEMPLATE_CONTENT}
          </Drawer>

          <Drawer
            title="Save Template"
            placement="right"
            onClose={handleDrawerSave}
            open={saveDrawer}
            className="modalWidth-563"
            width="auto"
          >
            {SAVE_CONTENT}
          </Drawer>
        </div>
        <div className="d-flex flex-wrap p-14-pb0">
          {TABLE_MEDICATION}
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleDrawerChild}
            open={childDrawer}
            className="modalWidth-563"
            width="auto"
          >
            {CHILD_DRAWER_DATA}
          </Drawer>
        </div>
        <div className="p-14 py-0">
          <div
            className="inputheight38 border rounded-10px d-flex align-items-center"
            onClick={handleDrawerParent}
          >
            <i className="icon-search mx-2"></i>
            <span className="fontroboto backbar fw-normal">
              Search Medicines by Name, Brand or generic
            </span>
          </div>
        </div>
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
        <div
          className="d-flex flex-wrap p-14-pb0 overflow-hidden"
          style={{ maxHeight: "114px" }}
        >
          {parentOptionsList.length > 0 &&
            parentOptionsList
              .filter(
                (e) =>
                  ![
                    ...medicationData.map(
                      (e1) => e1.tmm_medicine_name
                    ),
                  ].includes(e.tmm_medicine_name)
              ).map((item, i) => {
                return (
                  <Button
                    key={i}
                    type="text"
                    className="btn btn-primary2 chips-custom mb-14 me-14"
                    onClick={() => onSelectParent(item)}
                  >
                    {item.tmm_medicine_name}
                  </Button>
                );
              })}
        </div>
      </div>
    </>
  );
}

export default React.memo(TabMedicationBox);
