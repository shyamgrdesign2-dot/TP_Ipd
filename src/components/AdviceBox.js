import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from "react";
import {
  AutoComplete,
  Input,
  Button,
  Row,
  Select,
  Popover,
  Tabs,
  Spin,
  message,
  Checkbox,
  Drawer,
  Card
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../context/CashManagerContext';
import { MESSAGE_KEY } from "../utils/constants";
import { removeBeforeWhiteSpace } from "../utils/utils";
import Adviceicon from "../assets/images/advice.svg";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getAdviceTemplates,
  getFrequentlySearchedAdvice,
  searchAdvice
} from "../redux/adviceSlice";

function AdviceBox() {
  const inputRef = useRef();
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
  const [adviceDataCheck, setAdviceDataCheck] = useState([]);

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [parentSearchOptions, setParentSearchOptions] = useState([]);

  const [autoCompleteFlag, setAutoCompleteFlag] = useState(false);
  const [childDrawer, setChildDrawer] = useState(false);
  const [childDrawerData, setChildDrawerData] = useState(null);

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
        label: <><Checkbox className="advice-check" checked={adviceDataCheck.some(x => x.advice_name == e.advice_name)}></Checkbox>{e.advice_name}</>,
      });
    });

    data.unshift({
      key: -1,
      label: (
        <div className="d-flex justify-content-between align-items-center">
          <div>{searchQuery ? 'SEARCHED' : 'FREQUENTLY USED'}</div>
          <Button
            className="btn btn-primary3 ms-3" onClick={onClickParent}>
            {`Done (${adviceDataCheck.length})`}
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
        label: <div className='d-flex align-items-center'>
          <Checkbox checked={adviceDataCheck.some(x => x.advice_name == searchQuery)}></Checkbox>
          <div className="ms-2">{searchQuery} <i className="icon-Add mx-1 fs-6"></i> <a className="text-decoration-underline"> Add Custom</a></div>
        </div>,
      });
    setParentSearchOptions(data);
  }, [parentOptionsList, adviceDataCheck]);

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
      setSearchQuery(removeBeforeWhiteSpace(query));
    },
    [searchQuery]
  );

  const onSelectParent = useCallback(
    (data, e) => {
      setAdviceDataCheck((previousState) => {
        const index = previousState.findIndex((x) => x.advice_name == JSON.parse(e.key).advice_name)
        console.log(index)
        if (index !== -1) {
          const cloned = [...previousState]
          cloned.splice(index, 1)
          return cloned
        } else {
          return [...previousState, JSON.parse(e.key)]
        }
      })
      // if (adviceDataCheck.some(el => el.advice_name == JSON.parse(e.key).advice_name)) {
      //   console.log('Some')
      //   const index = adviceDataCheck.findIndex(el => el.advice_name == JSON.parse(e.key).advice_name)
      //   if (index !== -1)
      //     adviceDataCheck.splice(index, 1)
      // } else {
      //   console.log('With')
      //   adviceDataCheck.push({
      //     ...JSON.parse(e.key),
      //   })
      // }
      // setAdviceDataCheck(prev => [...prev])
    },
    [adviceDataCheck]
  );

  function onClickParent() {
    const data = [...adviceData, ...adviceDataCheck]
    setAdviceData(data);
    setAdviceDataCheck([])
    setSearchQuery("");
    setAutoCompleteFlag(false);
    inputRef.current.blur()
  }

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
      return { ...e, unique_id: uuidv4() }
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
      const updateQuery = removeBeforeWhiteSpace(e.target.value)
      setInputTemplateName(updateQuery);
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
        content: 'Please fillup advice name',
        duration: 2
      });
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tat_id: data.tat_id,
        tat_template_name: data.tat_template_name,
        advices: adviceData,
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
            <Checkbox checked onClick={() => onRemoveRow(index)}><div className="text-truncate-twolines">{item.advice_name}</div></Checkbox>
            <Button className="btn btn-delete-prescription p-0" onClick={() => handleDrawerChild({ ...item, index: index })}><i className="icon-Edit"></i></Button>
          </Row>
        );
      })
    );
  }, [adviceData]);

  // Handle Child Drawer
  const handleDrawerChild = useCallback((item) => {
    setChildDrawer(!childDrawer);
    setChildDrawerData(item)
  }, [childDrawer, childDrawerData]);

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
              placeholder="Search Templates"
              allowClear
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
                    <div className="title text-main2">{template.tat_template_name}</div>
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

  const onChangeInputNoteChild = useCallback(
    (e) => {
      const updateQuery = removeBeforeWhiteSpace(e.target.value)
      setChildDrawerData({ ...childDrawerData, advice_name: updateQuery })
    },
    [childDrawerData]
  );

  const updateChild = (item) => {
    const { index, ...updatedReqData } = item;
    console.log(adviceData[item.index].advice_name, updatedReqData.advice_name)
    if (adviceData[item.index].advice_name != updatedReqData.advice_name) {
      updatedReqData["change"] = 1
    }
    adviceData[item.index] = { ...adviceData[item.index], ...updatedReqData };
    setAdviceData((prev) => [...prev]);
    handleDrawerChild()
  }

  //Child Componet
  const CHILD_DRAWER_DATA = useMemo(() => {
    return (
      childDrawerData && (
        <>
          <Card bordered={false} className="search-modalCard">
            <div className='modalCard-header align-items-center justify-content-between d-flex'>
              <div className='align-items-center d-flex'>
                <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerChild}>
                  <i className='icon-Cross fs-3'></i>
                </Button>
                <div className="modal-title text-truncate-twolines">{'Edit Advice'}</div>
              </div>
              <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={() => updateChild(childDrawerData)}>
                Done
              </Button>
            </div>
          </Card>
          <div className="p-4">
            <Input.TextArea value={childDrawerData.advice_name != undefined && childDrawerData.advice_name} placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNoteChild} />
          </div>
        </>
      )
    );
  }, [childDrawer, childDrawerData]);

  return (
    <>
      {contextHolder}
      <div className="prescription-box-sm">
        <div className="d-flex align-items-center justify-content-between p-14-pb0">
          <div className="d-flex align-items-center">
            <img className="me-2" src={Adviceicon} alt="Advice" />
            <div className="title-common">Advices</div>
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

        {TABLE_ADVICE}
        <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild} open={childDrawer} className="modalWidth-563" width="auto">
          {CHILD_DRAWER_DATA}
        </Drawer>

        <div className="p-14">
          <AutoComplete
            ref={inputRef}
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
              placeholder="Search Advices"
              prefix={<i className="icon-search"></i>}
            />
          </AutoComplete>
        </div>
      </div>
    </>
  );
}

export default React.memo(AdviceBox);
