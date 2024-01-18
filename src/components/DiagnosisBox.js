import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
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
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import CashManagerContext from "../context/CashManagerContext";
import { MESSAGE_KEY } from "../utils/constants";
import { onlyNumberFormat, removeBeforeWhiteSpace } from "../utils/utils";
import Diagnosisicon from "../assets/images/Diagnosis.svg";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getDiagnosisTemplates,
  getFrequentlySearchedDiagnosis,
  searchDiagnosis,
} from "../redux/diagnosisSlice";

function DiagnosisBox() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    selectedDiagnosisList,
    parentOptionsList,
    childOptionsList,
    templates,
    loading,
  } = useSelector((state) => state.diagnosis);
  const dispatch = useDispatch();

  const { diagnosisData, setDiagnosisData } = useContext(CashManagerContext);
  // const [diagnosisData, setDiagnosisData] = useState([]);

  const STATUS_LIST = [
    { value: "ruled out", label: "Ruled Out" },
    { value: "suspected", label: "Suspected" },
    { value: "confirmed", label: "Confirmed" },
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
    if (selectedDiagnosisList.length > 0) {
      const updatedData = diagnosisData.map((e, i) => {
        return { ...e, ...selectedDiagnosisList[i] };
      });
      setDiagnosisData(updatedData);
    }
  }, [selectedDiagnosisList]);

  useEffect(() => {
    dispatch(getDiagnosisTemplates());
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
          searchDiagnosis({ searchQuery: searchParentQuery, type: "parent" })
        );
      }, 500);

      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(getFrequentlySearchedDiagnosis());
    }
  }, [searchParentQuery]);

  useEffect(() => {
    const data = [];
    parentOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.tds_name,
        label: <div>{e.tds_name}</div>,
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
            tds_id: 0,
            tds_name: searchParentQuery,
            pms_default: 0,
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
      diagnosisData.push({
        ...JSON.parse(e.key),
        since: "",
        status: "",
        note: "",
      });
      setDiagnosisData((prev) => [...prev]);
      setSearchParentQuery("");
    },
    [searchParentQuery, diagnosisData]
  );

  //Child AutoComplete
  useEffect(() => {
    if (searchChildQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchDiagnosis({
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
        value: e.tds_name,
        label: <div>{e.tds_name}</div>,
      });
    });
    if (searchChildQuery?.query) {
      data.push({
        key: JSON.stringify({
          ...diagnosisData[searchChildQuery.index],
          unique_id: uuidv4(),
          tds_id: 0,
          tds_name: searchChildQuery.query,
          pms_default: 0,
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
    setSearchChildQuery({ query: diagnosisData[i].tds_name, index: i });
    dispatch(
      searchDiagnosis({ searchQuery: diagnosisData[i].tds_name, type: "child" })
    );
  };

  const onSearchChild = useCallback(
    (query, i) => {
      const updateQuery = removeBeforeWhiteSpace(query)
      diagnosisData[i] = {
        ...diagnosisData[i],
        tds_id: 0,
        tds_name: updateQuery,
        pms_default: 0,
      };
      setDiagnosisData((prev) => [...prev]);
      setSearchChildQuery({ query: updateQuery, index: i });
    },
    [searchChildQuery, diagnosisData]
  );

  const onSelectChild = useCallback(
    (data, e, i) => {
      diagnosisData[i] = { ...diagnosisData[i], ...JSON.parse(e.key) };
      setDiagnosisData((prev) => [...prev]);
      setSearchChildQuery({ query: JSON.parse(e.key).tds_name, index: i });
    },
    [searchChildQuery, diagnosisData]
  );

  const onSearchSinceChid = useCallback(
    (query, i) => {
      const updateQuery = onlyNumberFormat(query);
      diagnosisData[i].since = updateQuery;
      setDiagnosisData((prev) => [...prev]);
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
    [sinceOptions, diagnosisData]
  );

  const onSelectSinceChild = useCallback(
    (data, i) => {
      setSinceOptions([]);
      diagnosisData[i].since = data;
      setDiagnosisData((prev) => [...prev]);
    },
    [sinceOptions, diagnosisData]
  );

  const onSelectStatusChild = useCallback(
    (data, i) => {
      diagnosisData[i].status = data;
      setDiagnosisData((prev) => [...prev]);
    },
    [diagnosisData]
  );

  const onChangeNoteChild = useCallback(
    (e, i) => {
      diagnosisData[i].note = e.target.value;
      setDiagnosisData((prev) => [...prev]);
    },
    [diagnosisData]
  );

  const onRemoveRow = (index) => {
    diagnosisData.splice(index, 1);
    setDiagnosisData((prev) => [...prev]);
  };

  //PopOver1 function
  const showHideTemplatesListPopover = useCallback(() => {
    setPopOver1(!popOver1);
  }, [popOver1]);

  const onSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      let filteredTemplates = templates.filter((template) => {
        return template.tdt_template_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setMatchedTemplates(filteredTemplates);
    } else {
      setMatchedTemplates(templates);
    }
  };

  const onTemplateSelected = (template) => {
    const updatedData = template.diagnosis.map(e => {
      return { ...e, unique_id: uuidv4(), since: "", status: "", note: "" }
    })
    setDiagnosisData([...diagnosisData, ...updatedData]);
    showHideTemplatesListPopover();
  };

  const onDeleteTemplateClicked = (tdt_id) => {
    dispatch(deleteTemplate(tdt_id));
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
    if (diagnosisData.length == 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: "warning",
        content: "At least 1 diagnosis added",
        duration: 2,
      });
    } else if (diagnosisData.filter((e) => e.tds_name == "").length > 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: "warning",
        content: "Please fillup diagnosis name",
        duration: 2,
      });
    } else {
      var sendData = {
        tdt_template_name: inputTemplateName,
        diagnosis: diagnosisData,
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
    if (diagnosisData.length == 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: "warning",
        content: "At least 1 diagnosis added",
        duration: 2,
      });
    } else if (diagnosisData.filter((e) => e.tds_name == "").length > 0) {
      messageApi.open({
        MESSAGE_KEY,
        type: "warning",
        content: "Please fillup diagnosis name",
        duration: 2,
      });
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tdt_id: data.tdt_id,
        tdt_template_name: data.tdt_template_name,
        diagnosis: diagnosisData,
      };
      const action = await dispatch(updateTemplate(sendData));
      if (action.meta.requestStatus == "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  //Child Componet
  const TABLE_DIAGNOSIS = useMemo(() => {
    return (
      diagnosisData.length > 0 &&
      diagnosisData.map((item, index) => {
        return (
          <Row
            key={index}
            gutter={[0]}
            className={`${index === 0 && "mt-14 border-top"
              } align-items-center border-bottom`}
          >
            <Col lg={7} md={7} sm={7} xs={7} className="border-end">
              <div className="fontroboto fw-medium">
                <AutoComplete
                  defaultValue={item.tds_name}
                  value={item.tds_name}
                  placeholder="Diagnosis Name"
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
                placeholder="Status"
                defaultValue={item.status}
                value={item.status}
                onSelect={(data) => onSelectStatusChild(data, index)}
                options={STATUS_LIST}
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
                <i className="icon-delete" />
              </Button>
            </Col>
          </Row>
        );
      })
    );
  }, [diagnosisData, childSearchOptions]);

  //Template Componet
  const TEMPLATE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="pop-header" key="diagnosis-template">
          <div className="align-items-center d-flex justify-content-between">
            <div className="title-common">Diagnosis Templates</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideTemplatesListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          <div className="mt-3" key="diagnosis-template-search">
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
                    <i className="icon-template" />
                  </div>
                  <div
                    className="text-truncate w-100"
                    onClick={() => onTemplateSelected(template)}
                  >
                    <div className="title text-main2">{template.tdt_template_name}</div>
                    <div className="text-truncate">
                      {template.diagnosis.map((item, ii) => {
                        return (
                          <span key={ii}>{`${item.tds_name}${template.diagnosis.length - 1 != ii ? ", " : ""
                            }`}</span>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className="btn btn-delete-prescription p-0 ms-2"
                    onClick={() => onDeleteTemplateClicked(template.tdt_id)}
                  >
                    {template.loading ? (
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 22 }} spin />
                        }
                      />
                    ) : (
                      <i className="icon-delete" />
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
            <i className="icon-Cross" />
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
              value={inputTemplateName && inputTemplateName.tdt_template_name}
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Template"
              onSearch={onSearchTemplate}
              onSelect={onSelectTemplate}
              options={allTemplates.map((template) => {
                return {
                  key: JSON.stringify(template),
                  value: template.tdt_template_name,
                  label: (
                    <div key={template.tdt_id}>
                      {template.tdt_template_name}
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
            <img className="me-2" src={Diagnosisicon} alt="Diagnosis" />
            <div className="title-common">Diagnosis</div>
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
                <i className="icon-template me-2" /> <span>Templates</span>
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
                <i className="icon-save me-2" /> <span>Save</span>
              </button>
            </Popover>
          </div>
        </div>

        {TABLE_DIAGNOSIS}

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
              placeholder="Search Diagnosis"
              prefix={<i className="icon-search" />}
            />
          </AutoComplete>
        </div>
      </div>
    </>
  );
}

export default React.memo(DiagnosisBox);
