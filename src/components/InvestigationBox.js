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
  Tooltip
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../context/CashManagerContext';
import { MESSAGE_KEY } from "../utils/constants";
import { onlyNumberFormat, removeBeforeWhiteSpace } from "../utils/utils";
import Investigationicon from "../assets/images/Lab.svg";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getInvestigationTemplates,
  getFrequentlySearchedInvestigation,
  searchInvestigation
} from "../redux/investigationSlice";

function InvestigationBox() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    selectedInvestigationList,
    parentOptionsList,
    childOptionsList,
    templates,
    loading,
  } = useSelector((state) => state.investigation);
  const dispatch = useDispatch();

  const { investigationData, setInvestigationData } = useContext(CashManagerContext);
  // const [ investigationData, setInvestigationData] = useState([]);

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [searchParentQuery, setSearchParentQuery] = useState("");
  const [parentSearchOptions, setParentSearchOptions] = useState([]);

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
    if (selectedInvestigationList.length > 0) {
      const updatedData = investigationData.map((e, i) => {
        return { ...e, ...selectedInvestigationList[i] };
      });
      setInvestigationData(updatedData);
    }
  }, [selectedInvestigationList]);

  useEffect(() => {
    dispatch(getInvestigationTemplates());
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
          searchInvestigation({ searchQuery: searchParentQuery, type: "parent" })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(getFrequentlySearchedInvestigation());
    }
  }, [searchParentQuery]);

  useEffect(() => {
    const data = [];
    parentOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.investigation_name,
        label: <div>{e.investigation_name}</div>,
      });
    });
    if (searchParentQuery.length === 0) {
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
            investigation_name: searchParentQuery
          }),
          value: searchParentQuery,
          label: (
            <>
              <div>{searchParentQuery}<i className="icon-Add mx-1 text-primary fs-6"></i> <a className="fw-medium text-decoration-underline text-primary"> Add Custom</a></div>
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
      investigationData.push({
        ...JSON.parse(e.key),
        note: "",
      });
      setInvestigationData((prev) => [...prev]);
      setSearchParentQuery("");
    },
    [searchParentQuery, investigationData]
  );

  //Child AutoComplete
  useEffect(() => {
    if (searchChildQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchInvestigation({
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
        value: e.investigation_name,
        label: <div>{e.investigation_name}</div>,
      });
    });
    if (searchChildQuery?.query) {
      data.push({
        key: JSON.stringify({
          ...investigationData[searchChildQuery.index],
          unique_id: uuidv4(),
          change: 1,
          investigation_name: searchChildQuery.query
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
    setSearchChildQuery({ query: investigationData[i].investigation_name, index: i });
    dispatch(
      searchInvestigation({ searchQuery: investigationData[i].investigation_name, type: "child" })
    );
  };

  const onSearchChild = useCallback(
    (query, i) => {
      const updateQuery = removeBeforeWhiteSpace(query)
      investigationData[i] = {
        ...investigationData[i],
        change: 1,
        investigation_name: updateQuery
      };
      setInvestigationData((prev) => [...prev]);
      setSearchChildQuery({ query: updateQuery, index: i });
    },
    [searchChildQuery, investigationData]
  );

  const onSelectChild = useCallback(
    (data, e, i) => {
      investigationData[i] = { ...investigationData[i], ...JSON.parse(e.key) };
      setInvestigationData((prev) => [...prev]);
      setSearchChildQuery({ query: JSON.parse(e.key).investigation_name, index: i });
    },
    [searchChildQuery, investigationData]
  );

  const onChangeNoteChild = useCallback(
    (e, i) => {
      investigationData[i].note = e.target.value;
      setInvestigationData((prev) => [...prev]);
    },
    [investigationData]
  );

  const onRemoveRow = (index) => {
    investigationData.splice(index, 1);
    setInvestigationData((prev) => [...prev]);
  };

  //PopOver1 function
  const showHideTemplatesListPopover = useCallback(() => {
    setPopOver1(!popOver1);
  }, [popOver1]);

  const onSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      let filteredTemplates = templates.filter((template) => {
        return template.tit_template_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setMatchedTemplates(filteredTemplates);
    } else {
      setMatchedTemplates(templates);
    }
  };

  const onTemplateSelected = (template) => {
    const updatedData = template.investigation.map(e => {
      return { ...e, unique_id: uuidv4(), note: "" }
    })
    setInvestigationData([...investigationData, ...updatedData]);
    showHideTemplatesListPopover();
  };

  const onDeleteTemplateClicked = (tit_id) => {
    dispatch(deleteTemplate(tit_id));
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
    if (investigationData.length === 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 investigation added',
        duration: 2
      });
    } else if (investigationData.filter(e => e.investigation_name == "").length > 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup investigation name',
        duration: 2
      });
    } else {
      var sendData = {
        tit_template_name: inputTemplateName,
        investigation: investigationData,
      };
      const action = await dispatch(addTemplate(sendData));
      if (action.meta.requestStatus === "fulfilled") {
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
    if (investigationData.length === 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'At least 1 investigation added',
        duration: 2
      });
    } else if (investigationData.filter(e => e.investigation_name == "").length > 0) {
      messageApi.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: 'Please fillup investigation name',
        duration: 2
      });
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tit_id: data.tit_id,
        tit_template_name: data.tit_template_name,
        investigation: investigationData,
      };
      const action = await dispatch(updateTemplate(sendData));
      if (action.meta.requestStatus === "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  //Child Componet
  const TABLE_INVESTIGATION = useMemo(() => {
    return (
      investigationData.length > 0 &&
      investigationData.map((item, index) => {
        return (
          <Row
            key={index}
            gutter={[0]}
            className={`${index === 0 && "mt-14 border-top"} align-items-center border-bottom`}
          >
            <Col lg={9} md={9} sm={9} xs={9} className="border-end">
              <div className="fontroboto fw-medium">
                <AutoComplete
                  defaultValue={item.investigation_name}
                  value={item.investigation_name}
                  placeholder="Investigation Name"
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
            <Col lg={14} md={14} sm={13} xs={13} className="border-end">
              <Input
                className="notesinput border-0"
                placeholder="Instruction"
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
  }, [investigationData, childSearchOptions]);

  //Template Componet
  const TEMPLATE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="pop-header" key="investigation-template">
          <div className="align-items-center d-flex justify-content-between">
            <div className="title-common">Investigation Templates</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideTemplatesListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          <div className="mt-3" key="investigation-template-search">
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
                    <div className="title text-main2">{template.tit_template_name}</div>
                    <div className="text-truncate">
                      {template.investigation.map((item, ii) => {
                        return (
                          <span key={ii}>{`${item.investigation_name}${template.investigation.length - 1 != ii ? ", " : ""
                            }`}</span>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className="btn btn-delete-prescription p-0 ms-2"
                    onClick={() => onDeleteTemplateClicked(template.tit_id)}
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
              value={inputTemplateName && JSON.parse(inputTemplateName).tit_template_name}
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Template"
              onSearch={onSearchTemplate}
              onSelect={onSelectTemplate}
              optionLabelProp="label"
              options={allTemplates.map((template) => {
                return {
                  key: JSON.stringify(template),
                  value: template.tit_template_name,
                  label: (
                    <div key={template.tit_id}>
                      {template.tit_template_name}
                    </div>
                  ),
                };
              })}
              optionRender={(option) => (
                <div className="align-items-center d-flex text-truncate w-100">
                  <div className="round-box"><i className="icon-template"></i></div>
                  <div className="text-truncate w-100">
                    <div className="title text-main2">{option.data.value}</div>
                    <div className="text-truncate">
                      {JSON.parse(option.data.key).investigation.map((item, ii) => {
                        return (
                          <span key={ii}>{`${item.investigation_name}${JSON.parse(option.data.key).investigation.length - 1 != ii ? ", " : ""
                            }`}</span>
                        );
                      })}
                    </div>
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
      <div className="">
        <div className="d-flex align-items-center justify-content-between p-14-pb0">
          <div className="d-flex align-items-center">
            <img className="me-2" src={Investigationicon} alt="Investigation" />
            <div className="title-common">Lab Investigation</div>
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
            <Tooltip placement="bottom" title={(investigationData.length > 0) ? "" : "Please enter some Investigation to save a template"}>
              <Popover
                open={popOver2}
                onOpenChange={() => (investigationData.length > 0) && showHideSaveTemplatePopOver()}
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

        {TABLE_INVESTIGATION}

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
              placeholder="Search Lab Investigation"
              prefix={<i className="icon-search"></i>}
            />
          </AutoComplete>
        </div>
      </div>
    </>
  );
}

export default React.memo(InvestigationBox);
