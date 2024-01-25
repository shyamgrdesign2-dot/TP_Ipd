import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {
  AutoComplete,
  Input,
  Button,
  Row,
  Col,
  Select,
  Popover,
  Tabs,
  Spin,
  message
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../context/CashManagerContext';
import { MESSAGE_KEY } from "../utils/constants";
import { onlyNumberFormat, removeBeforeWhiteSpace } from "../utils/utils";
import Symptomsicon from "../assets/images/Symptoms.svg";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getSymptomsTemplates,
  getFrequentlySearchedSymptoms,
  searchSymptoms
} from "../redux/symptomsSlice";

function SymptomsBox() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    selectedSymptomsList,
    parentOptionsList,
    childOptionsList,
    templates,
    loading,
  } = useSelector((state) => state.symptoms);
  const dispatch = useDispatch();

  const { symptomsData, setSymptomsData } = useContext(CashManagerContext);
  // const [ symptomsData, setSymptomsData] = useState([]);

  const SEVERITY_LIST = [
    { value: "severe", label: "Severe" },
    { value: "moderate", label: "Moderate" },
    { value: "mild", label: "Mild" },
  ];

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [searchParentQuery, setSearchParentQuery] = useState("");
  const [parentSearchOptions, setParentSearchOptions] = useState([]);

  const [searchChildQuery, setSearchChildQuery] = useState(null);
  const [childSearchOptions, setChildSearchOptions] = useState([]);
  const [sinceOptions, setSinceOptions] = useState([]);
  const SINCE_OPTIONS = [
    { value: "Hour", label: "Hour" },
    { value: "Day", label: "Day" },
    { value: "Week", label: "Week" },
    { value: "Month", label: "Month" },
    { value: "Year", label: "Year" },
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
    if (selectedSymptomsList.length > 0) {
      const updatedData = symptomsData.map((e, i) => {
        return { ...e, ...selectedSymptomsList[i] };
      });
      setSymptomsData(updatedData);
    }
  }, [selectedSymptomsList]);

  useEffect(() => {
    dispatch(getSymptomsTemplates());
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
          searchSymptoms({ searchQuery: searchParentQuery, type: "parent" })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(getFrequentlySearchedSymptoms());
    }
  }, [searchParentQuery]);

  useEffect(() => {
    const data = [];
    parentOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.symptom_name,
        label: <div>{e.symptom_name}</div>,
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
    } else {
      searchParentQuery &&
        data.push({
          key: JSON.stringify({
            unique_id: uuidv4(),
            change: 1,
            symptom_name: searchParentQuery
          }),
          value: searchParentQuery,
          label: (
            <>
              <div>{searchParentQuery}</div>
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

  const onSelectParent = useCallback(
    (data, e) => {
      symptomsData.push({
        ...JSON.parse(e.key),
        since: "",
        severity: "",
        note: "",
      });
      setSymptomsData((prev) => [...prev]);
      setSearchParentQuery("");
    },
    [searchParentQuery, symptomsData]
  );

  //Child AutoComplete
  useEffect(() => {
    if (searchChildQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchSymptoms({
            searchQuery: searchChildQuery.query,
            type: "child",
          })
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
        value: e.symptom_name,
        label: <div>{e.symptom_name}</div>,
      });
    });
    if (searchChildQuery?.query) {
      data.push({
        key: JSON.stringify({
          ...symptomsData[searchChildQuery.index],
          unique_id: uuidv4(),
          change: 1,
          symptom_name: searchChildQuery.query
        }),
        value: searchChildQuery.query,
        label: (
          <>
            <div>{searchChildQuery.query}</div>
          </>
        ),
      });
    }
    setChildSearchOptions(data);
  }, [childOptionsList]);

  const onFocusChid = (i) => {
    setSearchChildQuery({ query: symptomsData[i].symptom_name, index: i });
    dispatch(
      searchSymptoms({ searchQuery: symptomsData[i].symptom_name, type: "child" })
    );
  };

  const onSearchChild = useCallback(
    (query, i) => {
      const updateQuery = removeBeforeWhiteSpace(query)
      symptomsData[i] = {
        ...symptomsData[i],
        change: 1,
        symptom_name: updateQuery
      };
      setSymptomsData((prev) => [...prev]);
      setSearchChildQuery({ query: updateQuery, index: i });
    },
    [searchChildQuery, symptomsData]
  );

  const onSelectChild = useCallback(
    (data, e, i) => {
      symptomsData[i] = { ...symptomsData[i], ...JSON.parse(e.key) };
      setSymptomsData((prev) => [...prev]);
      setSearchChildQuery({ query: JSON.parse(e.key).symptom_name, index: i });
    },
    [searchChildQuery, symptomsData]
  );

  const onSearchSinceChid = useCallback(
    (query, i) => {
      const updateQuery = onlyNumberFormat(query);
      symptomsData[i].since = updateQuery;
      setSymptomsData((prev) => [...prev]);
      if (updateQuery) {
        const options = SINCE_OPTIONS.map((option) => {
          return {
            key: Math.random(),
            value: `${updateQuery} ${option.value}`,
            label: <>{`${updateQuery} ${option.label}`}</>,
          };
        });
        setSinceOptions(options);
      } else {
        setSinceOptions([]);
      }
    },
    [sinceOptions, symptomsData]
  );

  const onSelectSinceChild = useCallback(
    (data, i) => {
      setSinceOptions([]);
      symptomsData[i].since = data;
      setSymptomsData((prev) => [...prev]);
    },
    [sinceOptions, symptomsData]
  );

  const onSelectSeverityChild = useCallback(
    (data, i) => {
      symptomsData[i].severity = data;
      setSymptomsData((prev) => [...prev]);
    },
    [symptomsData]
  );

  const onChangeNoteChild = useCallback(
    (e, i) => {
      symptomsData[i].note = e.target.value;
      setSymptomsData((prev) => [...prev]);
    },
    [symptomsData]
  );

  const onRemoveRow = (index) => {
    symptomsData.splice(index, 1);
    setSymptomsData((prev) => [...prev]);
  };

  //PopOver1 function
  const showHideTemplatesListPopover = useCallback(() => {
    setPopOver1(!popOver1);
  }, [popOver1]);

  const onSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      let filteredTemplates = templates.filter((template) => {
        return template.tst_template_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setMatchedTemplates(filteredTemplates);
    } else {
      setMatchedTemplates(templates);
    }
  };

  const onTemplateSelected = (template) => {
    const updatedData = template.symptoms.map(e => {
      return { ...e, unique_id: uuidv4(), since: "", severity: "", note: "" }
    })
    setSymptomsData([...symptomsData, ...updatedData]);
    showHideTemplatesListPopover();
  };

  const onDeleteTemplateClicked = (tst_id) => {
    dispatch(deleteTemplate(tst_id));
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
    if (symptomsData.length == 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 symptom added',
        duration: 2
      });
    } else if (symptomsData.filter(e => e.symptom_name == "").length > 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup symptom name',
        duration: 2
      });
    } else {
      var sendData = {
        tst_template_name: inputTemplateName,
        symptoms: symptomsData,
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
    if (symptomsData.length == 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 symptom added',
        duration: 2
      });
    } else if (symptomsData.filter(e => e.symptom_name == "").length > 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup symptom name',
        duration: 2
      });
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tst_id: data.tst_id,
        tst_template_name: data.tst_template_name,
        symptoms: symptomsData,
      };
      const action = await dispatch(updateTemplate(sendData));
      if (action.meta.requestStatus == "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  //Child Componet
  const TABLE_SYMPTOMS = useMemo(() => {
    return (
      symptomsData.length > 0 &&
      symptomsData.map((item, index) => {
        return (
          <Row
            key={index}
            gutter={[0]}
            className={`${index === 0 && "mt-14 border-top"} align-items-center border-bottom`}
          >
            <Col lg={7} md={7} sm={7} xs={7} className="border-end">
              <div className="fontroboto fw-medium">
                <AutoComplete
                  defaultValue={item.symptom_name}
                  value={item.symptom_name}
                  placeholder="Symptom Name"
                  bordered={false}
                  defaultOpen={false}
                  onSearch={(query) => onSearchChild(query, index)}
                  onFocus={() => onFocusChid(index)}
                  options={childSearchOptions}
                  className="autocomplete-custom w-100 inputborder"
                  defaultActiveFirstOption={true}
                  onSelect={(data, e) => onSelectChild(data, e, index)}
                />
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} className="border-end">
              <AutoComplete
                defaultValue={item.since}
                value={item.since}
                placeholder="Since"
                bordered={false}
                defaultOpen={false}
                onSearch={(query) => onSearchSinceChid(query, index)}
                options={sinceOptions}
                className="autocomplete-custom w-100 inputborder"
                defaultActiveFirstOption={true}
                onSelect={(data) => onSelectSinceChild(data, index)}
              />
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} className="border-end">
              <Select
                className="autocomplete-custom w-100 inputborder"
                placeholder="Severity"
                defaultValue={item.severity != "" ? item.severity : null}
                value={item.severity != "" ? item.severity : null}
                onSelect={(data) => onSelectSeverityChild(data, index)}
                options={SEVERITY_LIST}
                onClear={() => onSelectSeverityChild("", index)}
                allowClear
              />
            </Col>
            <Col lg={8} md={8} sm={7} xs={7} className="border-end">
              <Input
                className="notesinput border-0"
                placeholder="Notes"
                defaultValue={item.note}
                value={item.note}
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
      })
    );
  }, [symptomsData, childSearchOptions]);

  //Template Componet
  const TEMPLATE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="pop-header" key="symptoms-template">
          <div className="align-items-center d-flex justify-content-between">
            <div className="title-common">Symptoms Templates</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideTemplatesListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          <div className="mt-3" key="symptoms-template-search">
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
                    onClick={() => onTemplateSelected(template)}
                  >
                    <i className="icon-template"></i>
                  </div>
                  <div
                    className="text-truncate w-100"
                    onClick={() => onTemplateSelected(template)}
                  >
                    <div className="title text-main2">{template.tst_template_name}</div>
                    <div className="text-truncate">
                      {template.symptoms.map((item, ii) => {
                        return (
                          <span key={ii}>{`${item.symptom_name}${template.symptoms.length - 1 != ii ? ", " : ""
                            }`}</span>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className="btn btn-delete-prescription p-0 ms-2"
                    onClick={() => onDeleteTemplateClicked(template.tst_id)}
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
              value={inputTemplateName && inputTemplateName.tst_template_name}
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Template"
              onSearch={onSearchTemplate}
              onSelect={onSelectTemplate}
              options={allTemplates.map((template) => {
                return {
                  key: JSON.stringify(template),
                  value: template.tst_template_name,
                  label: (
                    <div key={template.tst_id}>
                      {template.tst_template_name}
                    </div>
                  ),
                };
              })}
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
      <div className="prescription-box-sm">
        <div className="d-flex align-items-center justify-content-between p-14-pb0">
          <div className="d-flex align-items-center">
            <img className="me-2" src={Symptomsicon} alt="Symptoms" />
            <div className="title-common">Symptoms</div>
          </div>
          <div className="d-flex align-items-center">
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
            <Popover
              open={popOver2}
              onOpenChange={showHideSaveTemplatePopOver}
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
          </div>
        </div>

        {TABLE_SYMPTOMS}

        <div className="p-14">
          <AutoComplete
            // defaultValue={searchParentQuery}
            value={searchParentQuery}
            onSearch={onSearchParent}
            options={parentSearchOptions}
            className="autocomplete-custom w-100"
            onSelect={onSelectParent}
            defaultActiveFirstOption={true}
          >
            <Input
              placeholder="Search Symptoms"
              prefix={<i className="icon-search"></i>}
            />
          </AutoComplete>
        </div>
      </div>
    </>
  );
}

export default React.memo(SymptomsBox);
