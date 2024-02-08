import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Input,
  Select,
  message,
  Segmented,
  Form,
  Radio,
  Drawer,
} from "antd";
import {
  Button as BSButton,
  ButtonGroup as BSButtonGroup,
} from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { onlyNumberFormat, isNumeric } from "../../utils/utils";

import CashManagerContext from "../../context/CashManagerContext";
import { MESSAGE_KEY } from "../../utils/constants";
import {
  getMedicineDetails,
  searchMedication,
} from "../../redux/medicationSlice";

import TabSearchHeader from "./TabSearchHeader";
import TabMedicationMoreModal from "./TabMedicationMoreModal";

function TabMedicationSearch({ passIndex, onClose }) {

  const [messageApi, contextHolder] = message.useMessage();
  const { parentOptionsList, childOptionsList, frequencyList, timingList } =
    useSelector((state) => state.medication);
  const dispatch = useDispatch();

  const { medicationData, setMedicationData } = useContext(CashManagerContext);

  const [searchChildQuery, setSearchChildQuery] = useState("");
  const [childSearchOptions, setChildSearchOptions] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(passIndex);
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
    if (selectedIndex != null) {
      const selectedMedication = medicationData[selectedIndex];
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
  }, [selectedIndex]);

  //Parent AutoComplete
  useEffect(() => {
    if (searchChildQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchMedication({ searchQuery: searchChildQuery, type: "child" })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [searchChildQuery]);

  useEffect(() => {
    const data = [];
    childOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.tmm_medicine_name,
      });
    });
    // if (searchChildQuery.length > 0) {
    //     searchChildQuery &&
    //         data.push({
    //             key: JSON.stringify({
    //                 unique_id: uuidv4(),
    //                 change: 1,
    //                 symptom_name: searchChildQuery
    //             }),
    //             value: searchChildQuery
    //         });
    // }
    setChildSearchOptions(data);
  }, [childOptionsList]);

  const onSearchParent = useCallback(
    (query) => {
      setSearchChildQuery(query);
    },
    [searchChildQuery]
  );

  const onSelectParent = async (e) => {
    const action = await dispatch(getMedicineDetails(e.tmm_id));
    if (action.meta.requestStatus == "fulfilled") {
      const updatedData = action.payload.map((e) => {
        const medicineUnit = e?.medicineUnit.map((e1) => {
          return {
            key: JSON.stringify({ ...e1 }),
            value: e1.tmu_id,
            label: <>{e1.tmu_title}</>,
          };
        });

        const unitObj = medicineUnit
          ? medicineUnit.find((x) => x.value == e.tmm_unit)
          : null;
        const frequencyObj = frequencyList.find(
          (x) => x.tmf_id == e.tmm_freq_type
        );
        const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

        return {
          ...e,
          tmm_unit_name:
            unitObj && unitObj != undefined
              ? JSON.parse(unitObj.key).tmu_title
              : "",
          tmm_freq_type_name:
            frequencyObj != undefined ? frequencyObj.tmf_title : "",
          tmf_block_val:
            frequencyObj != undefined ? frequencyObj.tmf_block_val : "",
          tmm_time_name: timingObj != undefined ? timingObj.tmt_title : "",
          medicineUnit: medicineUnit,
          unique_id: uuidv4(),
        };
      });
      medicationData.push({
        ...updatedData[0],
      });
      setMedicationData((prev) => [...prev]);
      setSelectedIndex(medicationData.length - 1);
      setSinceValue(1);
      setSearchChildQuery("");
    } else {
      messageApi.open({
        MESSAGE_KEY,
        type: "warning",
        content: action.error.message,
        duration: 2,
      });
    }
  }

  const onRemoveRow = (index) => {
    medicationData.splice(index, 1);
    setMedicationData((prev) => [...prev]);
    setSelectedIndex(null);
  };

  //Child Componet
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
            className={`${selectedIndex == index && "closable-chips-active"
              } d-flex align-items-center justify-content-between text-truncate closable-chips`}
          >
            <div
              className="text-truncate p-2"
              onClick={() => {
                setSelectedIndex(index);
                setSinceValue(item.tmm_days ? parseInt(item.tmm_days) : 1);
              }}
            >
              <div className="text-truncate">
                {item.tmm_medicine_name}
                {item.tmm_dosage || item.tmm_unit_name ? (
                  isNumeric(item.tmf_block) && item.tmf_block == 0 ? (
                    <div className="text-truncate small">{`
                    ${item.tmm_dosage && item.tmm_unit_name ? `${item.tmm_dosage} ${item.tmm_unit_name}` + " | " : ""}
                    ${item.tcm_tmm_freq_morning ? item.tcm_tmm_freq_morning + " - " : "0 -"}
                    ${item.tcm_tmm_freq_afternoon ? item.tcm_tmm_freq_afternoon + " - " : "0 -"}
                    ${item.tcm_tmm_freq_evening ? item.tcm_tmm_freq_evening + " - " : selectedTab != 'man' ? "0 -" : ""}
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
  }, [medicationData, selectedIndex]);

  const onChangeDosageChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      medicationData[selectedIndex].tmm_dosage = updateQuery;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const onSelectMedicineUnitChild = useCallback(
    (data) => {
      const obj = medicationData[selectedIndex].medicineUnit
        ? medicationData[selectedIndex].medicineUnit.find(
          (e) => e.value == data
        )
        : null;
      if (obj && obj != undefined) {
        const objParse = JSON.parse(obj.key);
        medicationData[selectedIndex].tmm_unit = objParse.tmu_id;
        medicationData[selectedIndex].tmm_unit_name = objParse.tmu_title;
        medicationData[selectedIndex].tmu_id = objParse.tmu_id;
        setMedicationData((prev) => [...prev]);
      }
    },
    [selectedIndex, medicationData]
  );

  const morningDecrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_morning =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_morning) - 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const morningClick = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_morning = 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const onChangeInputMorningChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      medicationData[selectedIndex].tcm_tmm_freq_morning = updateQuery;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const morningIncrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_morning =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_morning) + 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const afternoonDecrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_afternoon =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_afternoon) - 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const afternoonClick = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_afternoon = 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const onChangeInputAfternoonChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      medicationData[selectedIndex].tcm_tmm_freq_afternoon = updateQuery;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const afternoonIncrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_afternoon =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_afternoon) + 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const eveningDecrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_evening =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_evening) - 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const eveningClick = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_evening = 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const onChangeInputEveningChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      medicationData[selectedIndex].tcm_tmm_freq_evening = updateQuery;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const eveningIncrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_evening =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_evening) + 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const nightDecrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_night =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_night) - 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const nightClick = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_night = 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const onChangeInputNightChild = useCallback(
    (e) => {
      const updateQuery = onlyNumberFormat(e.target.value);
      medicationData[selectedIndex].tcm_tmm_freq_night = updateQuery;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const nightIncrement = useCallback(() => {
    medicationData[selectedIndex].tcm_tmm_freq_night =
      parseInt(medicationData[selectedIndex].tcm_tmm_freq_night) + 1;
    setMedicationData((prev) => [...prev]);
  }, [selectedIndex, medicationData]);

  const handleRadioChange = useCallback(
    (e) => {
      setSelectedTab(e.target.value);
      if (e.target.value !== "other") {
        medicationData[selectedIndex].tmf_block = 0;
      } else {
        medicationData[selectedIndex].tmf_block = 1;
      }
      medicationData[selectedIndex].tmm_freq_type = 0;
      medicationData[selectedIndex].tmm_freq_type_name = "";
      medicationData[selectedIndex].tcm_tmm_freq_afternoon = 0;
      medicationData[selectedIndex].tcm_tmm_freq_evening = 0;
      medicationData[selectedIndex].tcm_tmm_freq_morning = 0;
      medicationData[selectedIndex].tcm_tmm_freq_night = 0;
      setMedicationData((prev) => [...prev]);
    },
    [selectedTab, medicationData]
  );

  const onChangeFrequencyChild = useCallback(
    (item) => {
      medicationData[selectedIndex].tmm_freq_type = item.tmf_id;
      medicationData[selectedIndex].tmm_freq_type_name = item.tmf_title;
      medicationData[selectedIndex].tmf_block_val = item.tmf_block_val;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const handleFrequencyMoreOptionsVisible = useCallback(
    () => {
      setFrequencyMoreOptionsVisible(!frequencyMoreOptionsVisible)
    },
    [frequencyMoreOptionsVisible]
  );

  const onChangeTimingChild = useCallback(
    (item) => {
      medicationData[selectedIndex].tmm_time = item.tmt_id;
      medicationData[selectedIndex].tmm_time_name = item.tmt_title;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const handleTimingMoreOptionsVisible = useCallback(
    () => {
      setTimingMoreOptionsVisible(!timingMoreOptionsVisible)
    },
    [timingMoreOptionsVisible]
  );

  useEffect(() => {
    if (sinceValue != -1) {
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
      medicationData[selectedIndex].tmm_days = parseInt(updateQuery);
      medicationData[selectedIndex].tmm_duration_type = "";
      setMedicationData((prev) => [...prev]);
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
    [inputSince, sinceOptions, medicationData]
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
      medicationData[selectedIndex].tmm_days = key != -1 ? key : 0;
      medicationData[selectedIndex].tmm_duration_type = "";
      setMedicationData((prev) => [...prev]);
    },
    [sinceValue, selectedIndex, medicationData]
  );

  const onChangeSinceChild = useCallback(
    (key) => {
      medicationData[selectedIndex].tmm_duration_type = key;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  const onChangeInputNoteChild = useCallback(
    (e) => {
      medicationData[selectedIndex].tmm_remarks = e.target.value;
      setMedicationData((prev) => [...prev]);
    },
    [selectedIndex, medicationData]
  );

  //Child Componet
  const CHILD_DRAWER_DATA = useMemo(() => {
    return (
      selectedIndex != null && (
        <>
          <div className="h-100">
            <div className="selectedchip-header d-flex flex-column justify-content-center title px-20">
              <div className="text-truncate title-common fontroboto">
                {selectedIndex != null &&
                  medicationData[selectedIndex]?.tmm_medicine_name}
                <div className="text-truncate fs-14 fw-normal fontroboto mt-1">
                  {selectedIndex != null &&
                    medicationData[selectedIndex]?.tmm_generic}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div>
                <label className="title-common mb-1">Unit/Dose</label>
                <Row gutter={20} className="mb-3">
                  <Col md={12}>
                    <Input
                      placeholder="e.g. 1"
                      value={
                        medicationData[selectedIndex]?.tmm_dosage
                          ? medicationData[selectedIndex].tmm_dosage
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
                        medicationData[selectedIndex]?.medicineUnit
                          ? medicationData[
                            selectedIndex
                          ].medicineUnit.findIndex(
                            (e) =>
                              e.value ==
                              medicationData[selectedIndex].tmm_unit
                          ) != -1
                            ? parseInt(medicationData[selectedIndex].tmm_unit)
                            : null
                          : null
                      }
                      value={
                        medicationData[selectedIndex]?.medicineUnit
                          ? medicationData[
                            selectedIndex
                          ].medicineUnit.findIndex(
                            (e) =>
                              e.value ==
                              medicationData[selectedIndex].tmm_unit
                          ) != -1
                            ? parseInt(medicationData[selectedIndex].tmm_unit)
                            : null
                          : null
                      }
                      onSelect={onSelectMedicineUnitChild}
                      options={medicationData[selectedIndex].medicineUnit}
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
                        className="inputheight45 border rounded-0"
                      >
                        {medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-2 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={morningDecrement}
                            >
                              <i className="icon-minus fs-18 d-block text-main"></i>
                            </BSButton>
                          )}
                        <BSButton
                          variant="outline-light"
                          className="rounded-0 dateoutline p-0 bg-white"
                          disabled={medicationData[selectedIndex].tmf_block}
                          onClick={() =>
                            !medicationData[selectedIndex]
                              .tcm_tmm_freq_morning && morningClick()
                          }
                        >
                          <Input
                            placeholder="Morning"
                            inputMode="numeric"
                            value={
                              medicationData[selectedIndex].tcm_tmm_freq_morning
                                ? medicationData[selectedIndex]
                                  .tcm_tmm_freq_morning
                                : ""
                            }
                            className="rounded-0 h-100 text-center text-main"
                            onChange={onChangeInputMorningChild}
                          />
                        </BSButton>
                        {medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-2 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={morningIncrement}
                            >
                              <i className="icon-Add fs-18 text-main d-block"></i>
                            </BSButton>
                          )}
                      </BSButtonGroup>
                    </Col>
                    <Col lg={8}>
                      <BSButtonGroup
                        aria-label="Basic example"
                        className="inputheight45 border rounded-0 border-start-0"
                      >
                        {medicationData[selectedIndex].tcm_tmm_freq_afternoon !=
                          undefined &&
                          medicationData[selectedIndex]
                            .tcm_tmm_freq_afternoon != 0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-2 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={afternoonDecrement}
                            >
                              <i className="icon-minus fs-18 d-block text-main"></i>
                            </BSButton>
                          )}
                        <BSButton
                          variant="outline-light"
                          className="rounded-0 dateoutline p-0 bg-white"
                          disabled={medicationData[selectedIndex].tmf_block}
                          onClick={() =>
                            !medicationData[selectedIndex]
                              .tcm_tmm_freq_afternoon && afternoonClick()
                          }
                        >
                          <Input
                            placeholder="Afternoon"
                            inputMode="numeric"
                            value={
                              medicationData[selectedIndex]
                                .tcm_tmm_freq_afternoon
                                ? medicationData[selectedIndex]
                                  .tcm_tmm_freq_afternoon
                                : ""
                            }
                            className="rounded-0 h-100 text-center text-main"
                            onChange={onChangeInputAfternoonChild}
                          />
                        </BSButton>
                        {medicationData[selectedIndex].tcm_tmm_freq_afternoon !=
                          undefined &&
                          medicationData[selectedIndex]
                            .tcm_tmm_freq_afternoon != 0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-2 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={afternoonIncrement}
                            >
                              <i className="icon-Add fs-18 text-main d-block"></i>
                            </BSButton>
                          )}
                      </BSButtonGroup>
                    </Col>
                    <Col lg={8}>
                      <BSButtonGroup
                        aria-label="Basic example"
                        className="inputheight45 border rounded-0 border-start-0"
                      >
                        {medicationData[selectedIndex].tcm_tmm_freq_night !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_night !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-2 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={nightDecrement}
                            >
                              <i className="icon-minus fs-18 d-block text-main"></i>
                            </BSButton>
                          )}
                        <BSButton
                          variant="outline-light"
                          className="rounded-0 dateoutline p-0 bg-white"
                          disabled={medicationData[selectedIndex].tmf_block}
                          onClick={() =>
                            !medicationData[selectedIndex].tcm_tmm_freq_night &&
                            nightClick()
                          }
                        >
                          <Input
                            placeholder="Night"
                            inputMode="numeric"
                            value={
                              medicationData[selectedIndex].tcm_tmm_freq_night
                                ? medicationData[selectedIndex]
                                  .tcm_tmm_freq_night
                                : ""
                            }
                            className="rounded-0 h-100 text-center text-main"
                            onChange={onChangeInputNightChild}
                          />
                        </BSButton>
                        {medicationData[selectedIndex].tcm_tmm_freq_night !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_night !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-2 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={nightIncrement}
                            >
                              <i className="icon-Add fs-18 text-main d-block"></i>
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
                        {medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={morningDecrement}
                            >
                              <i className="icon-minus fs-18 d-block text-main"></i>
                            </BSButton>
                          )}
                        <BSButton
                          variant="outline-light"
                          className="rounded-0 dateoutline p-0 bg-white"
                          disabled={medicationData[selectedIndex].tmf_block}
                          onClick={() =>
                            !medicationData[selectedIndex]
                              .tcm_tmm_freq_morning && morningClick()
                          }
                        >
                          <Input
                            placeholder="Morning"
                            inputMode="numeric"
                            value={
                              medicationData[selectedIndex].tcm_tmm_freq_morning
                                ? medicationData[selectedIndex]
                                  .tcm_tmm_freq_morning
                                : ""
                            }
                            className="rounded-0 h-100 px-1 text-center text-main"
                            onChange={onChangeInputMorningChild}
                          />
                        </BSButton>
                        {medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_morning !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={morningIncrement}
                            >
                              <i className="icon-Add fs-18 text-main d-block"></i>
                            </BSButton>
                          )}
                      </BSButtonGroup>
                    </Col>
                    <Col lg={6}>
                      <BSButtonGroup
                        aria-label="Basic example"
                        className="inputheight45 border rounded-0 border-start-0"
                      >
                        {medicationData[selectedIndex].tcm_tmm_freq_afternoon !=
                          undefined &&
                          medicationData[selectedIndex]
                            .tcm_tmm_freq_afternoon != 0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={afternoonDecrement}
                            >
                              <i className="icon-minus fs-18 d-block text-main"></i>
                            </BSButton>
                          )}
                        <BSButton
                          variant="outline-light"
                          className="rounded-0 dateoutline p-0 bg-white"
                          disabled={medicationData[selectedIndex].tmf_block}
                          onClick={() =>
                            !medicationData[selectedIndex]
                              .tcm_tmm_freq_afternoon && afternoonClick()
                          }
                        >
                          <Input
                            placeholder="Afternoon"
                            inputMode="numeric"
                            value={
                              medicationData[selectedIndex]
                                .tcm_tmm_freq_afternoon
                                ? medicationData[selectedIndex]
                                  .tcm_tmm_freq_afternoon
                                : ""
                            }
                            className="rounded-0 h-100 px-1 text-center text-main"
                            onChange={onChangeInputAfternoonChild}
                          />
                        </BSButton>
                        {medicationData[selectedIndex].tcm_tmm_freq_afternoon !=
                          undefined &&
                          medicationData[selectedIndex]
                            .tcm_tmm_freq_afternoon != 0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={afternoonIncrement}
                            >
                              <i className="icon-Add fs-18 text-main d-block"></i>
                            </BSButton>
                          )}
                      </BSButtonGroup>
                    </Col>
                    <Col lg={6}>
                      <BSButtonGroup
                        aria-label="Basic example"
                        className="inputheight45 border rounded-0 border-start-0"
                      >
                        {medicationData[selectedIndex].tcm_tmm_freq_evening !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_evening !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={eveningDecrement}
                            >
                              <i className="icon-minus fs-18 d-block text-main"></i>
                            </BSButton>
                          )}
                        <BSButton
                          variant="outline-light"
                          className="rounded-0 dateoutline p-0 bg-white"
                          disabled={medicationData[selectedIndex].tmf_block}
                          onClick={() =>
                            !medicationData[selectedIndex]
                              .tcm_tmm_freq_evening && eveningClick()
                          }
                        >
                          <Input
                            placeholder="Evening"
                            inputMode="numeric"
                            value={
                              medicationData[selectedIndex].tcm_tmm_freq_evening
                                ? medicationData[selectedIndex]
                                  .tcm_tmm_freq_evening
                                : ""
                            }
                            className="rounded-0 px-1 h-100 text-center text-main"
                            onChange={onChangeInputEveningChild}
                          />
                        </BSButton>
                        {medicationData[selectedIndex].tcm_tmm_freq_evening !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_evening !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={eveningIncrement}
                            >
                              <i className="icon-Add fs-18 text-main d-block"></i>
                            </BSButton>
                          )}
                      </BSButtonGroup>
                    </Col>
                    <Col lg={6}>
                      <BSButtonGroup
                        aria-label="Basic example"
                        className="inputheight45 border rounded-0 border-start-0"
                      >
                        {medicationData[selectedIndex].tcm_tmm_freq_night !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_night !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={nightDecrement}
                            >
                              <i className="icon-minus fs-18 d-block text-main"></i>
                            </BSButton>
                          )}
                        <BSButton
                          variant="outline-light"
                          className="rounded-0 dateoutline p-0 bg-white"
                          disabled={medicationData[selectedIndex].tmf_block}
                          onClick={() =>
                            !medicationData[selectedIndex].tcm_tmm_freq_night &&
                            nightClick()
                          }
                        >
                          <Input
                            placeholder="Night"
                            inputMode="numeric"
                            value={
                              medicationData[selectedIndex].tcm_tmm_freq_night
                                ? medicationData[selectedIndex]
                                  .tcm_tmm_freq_night
                                : ""
                            }
                            className="rounded-0 h-100 px-1 text-center text-main"
                            onChange={onChangeInputNightChild}
                          />
                        </BSButton>
                        {medicationData[selectedIndex].tcm_tmm_freq_night !=
                          undefined &&
                          medicationData[selectedIndex].tcm_tmm_freq_night !=
                          0 && (
                            <BSButton
                              variant="outline-light"
                              className="rounded-0 dateoutline px-1 bg-white"
                              disabled={medicationData[selectedIndex].tmf_block}
                              onClick={nightIncrement}
                            >
                              <i className="icon-Add fs-18 text-main d-block"></i>
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
                              className={`btn text-truncate px-1 ${selectedIndex != null &&
                                medicationData[selectedIndex].tmm_freq_type ==
                                item.tmf_id &&
                                "btn-segement"
                                }`}
                              onClick={() => onChangeFrequencyChild(item)}
                            >
                              {item.tmf_title}
                            </button>
                            {i == filteredTitles.slice(0, 2).length - 1 && (
                              <button
                                key={-1}
                                type="button"
                                className={`btn text-truncate segment-more px-1 ${selectedIndex != null &&
                                  filteredTitles
                                    .slice(2, filteredTitles.length)
                                    .some(
                                      (e) =>
                                        e.tmf_id ==
                                        medicationData[selectedIndex]
                                          .tmm_freq_type
                                    ) &&
                                  "btn-segement"
                                  }`}
                                onClick={handleFrequencyMoreOptionsVisible}
                              >
                                {selectedIndex != null &&
                                  filteredTitles
                                    .slice(2, filteredTitles.length)
                                    .some(
                                      (e) =>
                                        e.tmf_id ==
                                        medicationData[selectedIndex]
                                          .tmm_freq_type
                                    ) ? (
                                  <span id="selected">
                                    <i className="icon-Edit me-2 fs-21"></i>
                                    {
                                      medicationData[selectedIndex]
                                        .tmm_freq_type_name
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
                  {frequencyMoreOptionsVisible && (
                    <TabMedicationMoreModal
                      width='41.5%'
                      title={'Frequency'}
                      onClose={handleFrequencyMoreOptionsVisible}
                      onClick={(item) => {
                        setFrequencyMoreOptionsVisible(false);
                        onChangeFrequencyChild(item);
                      }}
                      label={'tmf_title'}
                      value={'tmf_id'}
                      selectedValue={medicationData[selectedIndex].tmm_freq_type}
                      array={filteredTitles.slice(2, filteredTitles.length)} />
                  )}
                </div>
                <div className="segement-static d-flex flex-wrap">
                  {timingList.slice(0, 5).map((item, i) => {
                    return (
                      <>
                        <button
                          key={i}
                          type="button"
                          className={`btn mt-3 text-truncate px-1 ${selectedIndex != null &&
                            medicationData[selectedIndex].tmm_time ==
                            item.tmt_id &&
                            "btn-segement"
                            }`}
                          onClick={() => onChangeTimingChild(item)}
                        >
                          {item.tmt_title}
                        </button>
                        {i == timingList.slice(0, 5).length - 1 && (
                          <button
                            key={-1}
                            type="button"
                            className={`btn mt-3 text-truncate px-1 segment-more ${selectedIndex != null &&
                              timingList
                                .slice(5, timingList.length)
                                .some(
                                  (e) =>
                                    e.tmt_id ==
                                    medicationData[selectedIndex].tmm_time
                                ) &&
                              "btn-segement"
                              }`}
                            onClick={handleTimingMoreOptionsVisible}
                          >
                            {selectedIndex != null &&
                              timingList
                                .slice(5, timingList.length)
                                .some(
                                  (e) =>
                                    e.tmt_id ==
                                    medicationData[selectedIndex].tmm_time
                                ) ? (
                              <span id="selected">
                                <i className="icon-Edit me-2 fs-21"></i>
                                {medicationData[selectedIndex].tmm_time_name}
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
                    width='41.5%'
                    title={'Timings'}
                    onClose={handleTimingMoreOptionsVisible}
                    onClick={(item) => {
                      setTimingMoreOptionsVisible(false);
                      onChangeTimingChild(item);
                    }}
                    label={'tmt_title'}
                    value={'tmt_id'}
                    selectedValue={medicationData[selectedIndex].tmm_time}
                    array={timingList.slice(5, timingList.length)} />
                )}
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
                    medicationData[selectedIndex].tmm_duration_type !=
                    undefined &&
                    medicationData[selectedIndex].tmm_duration_type
                  }
                  className="search-segment"
                  options={sinceOptions}
                  onChange={onChangeSinceChild}
                />
              </div>
              <label className="title-common mb-1">Note</label>
              <Input.TextArea
                value={
                  medicationData[selectedIndex].tmm_remarks
                    ? medicationData[selectedIndex].tmm_remarks
                    : ""
                }
                placeholder="Enter any specific notes here"
                className="textareaPlaceholder"
                rows={3}
                onChange={onChangeInputNoteChild}
              />
            </div>
          </div>
        </>
      )
    );
  }, [
    selectedIndex,
    medicationData,
    sinceValue,
    inputSince,
    sinceOptions,
    selectedTab,
    timingMoreOptionsVisible,
    frequencyMoreOptionsVisible,
  ]);

  return (
    <>
      {contextHolder}
      <Card bordered={false} className="search-modalCard h-100">
        <TabSearchHeader
          placeholder="Search Medicines by Name, Brand or generic"
          searchQuery={searchChildQuery}
          onSearchParent={onSearchParent}
          disabled={medicationData.length > 0 ? false : true}
          onClose={onClose}
        />
        <div className="modalcard-body">
          <Row gutter={0} className="h-100">
            <Col md={14}>
              <div className="bg-white h-100 p-14">
                {medicationData.length > 0 && !searchChildQuery && (
                  <>
                    <div className="title2">Added</div>
                    <div className="d-flex flex-wrap mt-3">
                      {TABLE_MEDICATION}
                    </div>
                  </>
                )}
                <div>
                  <div className="title2">
                    {searchChildQuery.length > 0
                      ? "Search Results"
                      : "Frequently Used"}
                  </div>
                  <div className="mt-3 d-flex flex-wrap">
                    {searchChildQuery.length > 0
                      ? childSearchOptions.length > 0 &&
                      childSearchOptions
                        .filter(
                          (e) =>
                            ![
                              ...medicationData.map(
                                (e1) => e1.tmm_medicine_name
                              ),
                            ].includes(e.value)
                        )
                        .map((item, i) => {
                          return (
                            // i === childSearchOptions.length - 1 ? (
                            //     <Button
                            //         key={i}
                            //         type="text"
                            //         className="btn btn-primary2 chips-custom mb-14 me-14 d-flex align-items-center chips-addCustom"
                            //         onClick={() => onSelectParent({ ...JSON.parse(item.key) })}>
                            //         {item.value} <i className="icon-Add mx-1 fs-6"></i> <a className="text-decoration-underline"> Add Custom</a>
                            //     </Button>
                            // ) : (
                            <Button
                              key={i}
                              type="text"
                              style={{
                                width: item.value.length > 26 && "250px",
                              }}
                              className={`${item.value.length > 26 && "chips-custom-break"
                                } btn btn-primary2 chips-custom mb-14 me-14`}
                              onClick={() =>
                                onSelectParent({ ...JSON.parse(item.key) })
                              }
                            >
                              {item.value}
                            </Button>
                            // )
                          );
                        })
                      : parentOptionsList.length > 0 &&
                      parentOptionsList
                        .filter(
                          (e) =>
                            ![
                              ...medicationData.map(
                                (e1) => e1.tmm_medicine_name
                              ),
                            ].includes(e.tmm_medicine_name)
                        )
                        .map((item, i) => {
                          return (
                            <Button
                              key={i}
                              type="text"
                              style={{
                                width:
                                  item.tmm_medicine_name.length > 26 &&
                                  "250px",
                              }}
                              className={`${item.tmm_medicine_name.length > 26 &&
                                "chips-custom-break"
                                } btn btn-primary2 chips-custom mb-14 me-14`}
                              onClick={() => onSelectParent(item)}
                            >
                              {item.tmm_medicine_name}
                            </Button>
                          );
                        })}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={10}>{CHILD_DRAWER_DATA}</Col>
          </Row>
        </div>
      </Card>
    </>
  );
}

export default React.memo(TabMedicationSearch);
