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
  message,
  Checkbox
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../context/CashManagerContext';
import { MESSAGE_KEY } from "../utils/constants";
import { onlyNumberFormat } from "../utils/utils";
import Symptomsicon from "../assets/images/Symptoms.svg";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getAdviceTemplates,
  getFrequentlySearchedAdvice,
  searchAdvice
} from "../redux/adviceSlice";

function AdviceBox() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    selectedAdviceList,
    parentOptionsList,
    childOptionsList,
    templates,
    loading,
  } = useSelector((state) => state.advice);
  const dispatch = useDispatch();

  const { adviceData, setAdviceData } = useContext(CashManagerContext);
  // const [adviceData, setAdviceData] = useState([]);

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [parentSearchOptions, setParentSearchOptions] = useState([]);

  const [autoCompleteFlag, setAutoCompleteFlag] = useState(false);
  const [searchChildQuery, setSearchChildQuery] = useState(null);
  const [childSearchOptions, setChildSearchOptions] = useState([]);

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
    if (selectedAdviceList.length > 0) {
      const updatedData = adviceData.map((e, i) => {
        return { ...e, ...selectedAdviceList[i] };
      });
      setAdviceData(updatedData);
    }
  }, [selectedAdviceList]);

  useEffect(() => {
    dispatch(getAdviceTemplates());
  }, []);

  useEffect(() => {
    setMatchedTemplates(templates);
    setAllTemplates(templates);
  }, [templates]);

  //Parent AutoComplete
  useEffect(() => {
    if (searchQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchAdvice({ searchQuery: searchQuery, type: "parent" })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(getFrequentlySearchedAdvice());
    }
  }, [searchQuery]);

  useEffect(() => {
    const data = [];
    parentOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.advice_name,
        label: <><Checkbox className="advice-check" checked={adviceData.some(x => x.advice_name == e.advice_name)}></Checkbox>{e.advice_name}</>,
      });
    });

    data.unshift({
      key: -1,
      label: (
        <div className="d-flex justify-content-between align-items-center">
          <div>FREQUENTLY USED</div>
          <Button
            className="btn btn-primary3 ms-3">
            {`Done (${adviceData.length})`}
          </Button>
        </div>
      ),
    });

    searchQuery &&
      data.push({
        key: JSON.stringify({
          unique_id: uuidv4(),
          change: 1,
          advice_name: searchQuery
        }),
        value: searchQuery,
        label: (
          <>
            <div>{searchQuery}</div>
          </>
        ),
      });

    setParentSearchOptions(data);
  }, [parentOptionsList, adviceData]);

  const onFocusParent = useCallback(
    () => {
      setAutoCompleteFlag(true);
    },
    [autoCompleteFlag]
  );
  const onBlurParent = useCallback(
    () => {
      setAutoCompleteFlag(false);
    },
    [autoCompleteFlag]
  );

  const onSearchParent = useCallback(
    (query) => {
      setSearchQuery(query);
    },
    [searchQuery]
  );

  const onSelectParent = useCallback(
    (data, e) => {
      // setAutoCompleteFlag(true);
      // console.log('onSelectParent')
      adviceData.push({
        ...JSON.parse(e.key),
      });
      setAdviceData((prev) => [...prev]);
      // setSearchParentQuery("");
    },
    [autoCompleteFlag, searchQuery, adviceData]
  );

  const onRemoveRow = (index) => {
    adviceData.splice(index, 1);
    setAdviceData((prev) => [...prev]);
  };

  //PopOver1 function
  const showHideTemplatesListPopover = useCallback(() => {
    setPopOver1(!popOver1);
  }, [popOver1]);

  const onSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      let filteredTemplates = templates.filter((template) => {
        return template.tat_template_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setMatchedTemplates(filteredTemplates);
    } else {
      setMatchedTemplates(templates);
    }
  };

  const onTemplateSelected = (template) => {
    const updatedData = template.advices.map(e => {
      return { ...e, unique_id: uuidv4(), since: "", severity: "", note: "" }
    })
    setAdviceData([...adviceData, ...updatedData]);
    showHideTemplatesListPopover();
  };

  const onDeleteTemplateClicked = (tat_id) => {
    dispatch(deleteTemplate(tat_id));
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
      setInputTemplateName(e.target.value);
    },
    [inputTemplateName]
  );

  const onAddTemplateClicked = async () => {
    if (adviceData.length == 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 advice added',
        duration: 2
      });
    } else if (adviceData.filter(e => e.advice_name == "").length > 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup advice name',
        duration: 2
      });
    } else {
      var sendData = {
        tat_template_name: inputTemplateName,
        advices: adviceData,
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
    if (adviceData.length == 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 advice added',
        duration: 2
      });
    } else if (adviceData.filter(e => e.advice_name == "").length > 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup symptom name',
        duration: 2
      });
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tat_id: data.tat_id,
        tat_template_name: data.tat_template_name,
        advice: adviceData,
      };
      const action = await dispatch(updateTemplate(sendData));
      if (action.meta.requestStatus == "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  //Child Componet
  const TABLE_ADVICE = useMemo(() => {
    return (
      adviceData.length > 0 &&
      adviceData.map((item, index) => {
        return (
          <Row
            key={index}
            gutter={[0]}
            className='px-3 advicecheck-row justify-content-between align-items-center'>
            <Checkbox checked onClick={() => onRemoveRow(index)}>{item.advice_name}</Checkbox>
            <Button className="btn btn-delete-prescription p-0"><i className="icon-Edit"></i></Button>
          </Row>
        );
      })
    );
  }, [adviceData, childSearchOptions]);

  //Template Componet
  const TEMPLATE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="pop-header" key="advice-template">
          <div className="align-items-center d-flex justify-content-between">
            <div className="title-common">Advice Templates</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideTemplatesListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          <div className="mt-3" key="advice-template-search">
            <Input
              className="popinput"
              onChange={onSearch}
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
                    <div className="title">{template.tat_template_name}</div>
                    <div className="text-truncate">
                      {template.advices.map((item, ii) => {
                        return (
                          <span key={ii}>{`${item.advice_name}${template.advices.length - 1 != ii ? ", " : ""
                            }`}</span>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className="btn btn-delete-prescription p-0 ms-2"
                    onClick={() => onDeleteTemplateClicked(template.tat_id)}
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
              value={inputTemplateName && inputTemplateName.tat_template_name}
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Template"
              onSearch={onSearchTemplate}
              onSelect={onSelectTemplate}
              options={allTemplates.map((template) => {
                return {
                  key: JSON.stringify(template),
                  value: template.tat_template_name,
                  label: (
                    <div key={template.tat_id}>
                      {template.tat_template_name}
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
            <img className="me-2" src={Symptomsicon} alt="Advice" />
            <div className="title-common">Advice</div>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn d-flex align-items-center btn-text">
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

        {TABLE_ADVICE}

        <div className="p-14">
          <AutoComplete
            // defaultValue={searchParentQuery}
            value={searchQuery}
            onSearch={onSearchParent}
            onFocus={onFocusParent}
            onBlur={onBlurParent}
            options={parentSearchOptions}
            className="autocomplete-custom w-100"
            open={autoCompleteFlag}
            onSelect={onSelectParent}
          >
            <Input
              placeholder="Search by Patient’s Name, Phone number or Id"
              prefix={<i className="icon-search"></i>}
            />
          </AutoComplete>
        </div>
      </div>
    </>
  );
}

export default React.memo(AdviceBox);
