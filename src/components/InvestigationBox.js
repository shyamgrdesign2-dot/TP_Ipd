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
  Tooltip
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { useFeatureIsOn } from "@growthbook/growthbook-react";

import CommonModal from '../common/CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';
import CashManagerContext from '../context/CashManagerContext';
import { errorMessage, onlyNumberFormat, removeBeforeWhiteSpace } from "../utils/utils";
import Investigationicon from "../assets/images/Lab.svg";
import { MenuOutlined } from '@ant-design/icons';
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getInvestigationTemplates,
  getFrequentlySearchedInvestigation,
  searchInvestigation
} from "../redux/investigationSlice";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DifferentialDiagnosis from "./DifferentialDiagnosis";
import { getDecodedToken } from "../utils/localStorage";
import { GB_APOLLO_DISABLE_FEATURE, GB_ZYDUS_USER } from "../utils/constants";
import { env } from "../EnvironmentConfig";

const { TextArea } = Input;

function InvestigationBox({handleDDxDrawer, generatedDDx}) {
  const {
    selectedInvestigationList,
    parentOptionsList,
    childOptionsList,
    templates,
    loading,
  } = useSelector((state) => state.investigation);
  const dispatch = useDispatch();

  const { investigationData, setInvestigationData, diagnosisData } =
    useContext(CashManagerContext);
  // const [ investigationData, setInvestigationData] = useState([]);

  const [ddxInvestigationOptionsList, setDdxInvestigationOptionsList] =
    useState([]);

  const filteredDdxInvestigationOptionsList =
    ddxInvestigationOptionsList?.filter(
      (e) =>
        ![...investigationData.map((e1) => e1.investigation_name)].includes(
          e.investigation_name
        )
    );

  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);
  const decodedToken = getDecodedToken();
  const tokenData = decodedToken?.result;

  const isApolloHosBusinessIdAccessableFromGB = useFeatureIsOn(GB_APOLLO_DISABLE_FEATURE);

  useEffect(() => {
    if (diagnosisData?.length > 0 && generatedDDx?.length > 0) {
      const associatedLabTestsData = diagnosisData?.map((diagnosis) => {
        if (diagnosis?.isDDx) {
            return generatedDDx?.find(
              (item) => item?._id === diagnosis?.unique_id
            )?.labTests;
        }
      })?.filter((item) => item);
      const uniqueLabTests = [...new Set(associatedLabTestsData?.flat())];
      const ddxOptionsList = uniqueLabTests
        ?.map((item) => {
          return {
            investigation_name: item,
            hm_type: 1,
            pms_default: 1,
            isDDx: true,
          };
        });
        setDdxInvestigationOptionsList(ddxOptionsList);
      } else if (diagnosisData?.length === 0) {
        setDdxInvestigationOptionsList([]);
      }
    }, [diagnosisData]);

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [removeTemplateId, setRemoveTemplateId] = useState(null);

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
        label: <div>{e.investigation_name} {(e?.hm_type === 1 && e?.um_id === 0) && <span className="align-items-center small fs-12-1 d-inline-flex justify-content-center rounded-circle text-white" style={{width: 18, height: 18, background: '#c44ea2'}}>Z</span>}</div>,
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
    }
    else {
      searchParentQuery && parentOptionsList.findIndex(e => e.investigation_name?.toLowerCase()?.trim() == searchParentQuery?.toLowerCase()?.trim()) === -1 && tokenData?.hospital_business_id != env.zydus_business_id && !isZydusUserAccessableFromGB && !isApolloHosBusinessIdAccessableFromGB &&
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
      window.Moengage.track_event("investigation_select", {
        "value": data
      });
      investigationData.push({
        ...JSON.parse(e.key),
        note: "",
      });
      setInvestigationData((prev) => [...prev]);
      setSearchParentQuery("");
    },
    [searchParentQuery, investigationData]
  );

  const onSelectDDx = (e) => {
    investigationData.push({
      ...e,
      note: "",
    });
    setInvestigationData((prev) => [...prev]);
    setSearchParentQuery("");
  };

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
    // if (searchChildQuery?.query) {
    //   data.push({
    //     key: JSON.stringify({
    //       ...investigationData[searchChildQuery.index],
    //       unique_id: uuidv4(),
    //       change: 1,
    //       investigation_name: searchChildQuery.query
    //     }),
    //     value: searchChildQuery.query,
    //     label: (
    //       <>
    //         <div>{searchChildQuery.query}</div>
    //       </>
    //     ),
    //   });
    // }
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
    window.Moengage.track_event("investigation_template_used", {
      "template_name": template.tit_template_name
    });
    const updatedData = template.investigation.map(e => {
      return { ...e, unique_id: uuidv4(), note: e.note ? e.note : "" }
    })
    setInvestigationData([...investigationData, ...updatedData]);
    showHideTemplatesListPopover();
  };

  const onDeleteTemplateClicked = async (tit_id) => {
    const action = await dispatch(deleteTemplate(tit_id));
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
    if (investigationData?.length === 0) {
      errorMessage('At least 1 investigation added')
    } else if (investigationData.filter(e => e.investigation_name == "").length > 0) {
      errorMessage('Please fillup investigation name')
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
    if (investigationData?.length === 0) {
      errorMessage('At least 1 investigation added')
    } else if (investigationData.filter(e => e.investigation_name == "").length > 0) {
      errorMessage('Please fillup investigation name')
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

  //Child Componet
  // const TABLE_INVESTIGATION = useMemo(() => {
  //   return (
  //     investigationData?.length > 0 &&
  //     investigationData.map((item, index) => {
  //       return (
  //         <Row
  //           key={index}
  //           gutter={[0]}
  //           className={`${index === 0 && "mt-14 border-top"} align-items-center border-bottom`}
  //         >
  //           <Col lg={9} md={9} sm={9} xs={9}>
  //             <div className="fontroboto fw-medium">
  //               <AutoComplete
  //                 defaultValue={item.investigation_name}
  //                 value={item.investigation_name}
  //                 placeholder="Investigation Name"
  //                 bordered={false}
  //                 disabled={true}
  //                 defaultOpen={false}
  //                 onSearch={(query) => onSearchChild(query, index)}
  //                 onFocus={() => onFocusChid(index)}
  //                 options={childSearchOptions}
  //                 className="autocomplete-custom w-100 inputborder"
  //                 defaultActiveFirstOption={true}
  //                 onSelect={(data, e) => onSelectChild(data, e, index)}
  //               />
  //             </div>
  //           </Col>
  //           <Col lg={14} md={14} sm={13} xs={13} className="border-start border-end">
  //             <TextArea
  //               className="notesinput border-0"
  //               placeholder="Instruction"
  //               defaultValue={item.note}
  //               value={item.note}
  //               autoSize={{
  //                 minRows: 1,
  //                 maxRows: 2,
  //               }}
  //               onChange={(e) => onChangeNoteChild(e, index)}
  //             />
  //           </Col>
  //           <Col lg={1} md={1} sm={2} xs={2} className="text-center">
  //             <Button
  //               className="btn py-0 btn-delete-prescription px-0"
  //               onClick={() => onRemoveRow(index)}
  //             >
  //               <i className="icon-delete"></i>
  //             </Button>
  //           </Col>
  //         </Row>
  //       );
  //     })
  //   );
  // }, [investigationData, childSearchOptions]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedItems = reorder(
      investigationData,
      result.source.index,
      result.destination.index
    );
    setInvestigationData(reorderedItems);
  };

  const TABLE_INVESTIGATION = useMemo(() => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="investigation" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {investigationData?.length > 0 &&
                investigationData.map((item, index) => (
                  <Draggable key={index} draggableId={`investigation-${index}`} index={index}>
                    {(provided) => (
                      <Row
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        key={index}
                        gutter={[0]}
                        className={`${index === 0 && 'mt-14 border-top'
                          } align-items-center border-bottom`}
                      >
                        <Col lg={1} md={1} sm={1} xs={1} className="text-center">
                          <MenuOutlined
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            style={{ cursor: 'grab' }}
                          >
                          </MenuOutlined>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <div className="fontroboto fw-medium">
                            <AutoComplete
                              defaultValue={item.investigation_name}
                              value={item.investigation_name}
                              placeholder="Investigation Name"
                              bordered={false}
                              disabled={true}
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
                        <Col lg={14} md={14} sm={13} xs={13} className="border-start border-end">
                          <TextArea
                            className="notesinput border-0"
                            placeholder="Instruction"
                            defaultValue={item.note}
                            value={item.note}
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
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
                    onClick={() => {
                      showHideModal(template.tit_id)
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

  const showHideClearData = useCallback(() => {
    setIsModalOpen1(!isModalOpen1);
  }, [isModalOpen1]);

  const onRemoveRows = () => {
    setInvestigationData([])
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
                  Are you sure you want to Clear Selected <b>Lab Investigation</b>?
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

  return (
    <>
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
            <Tooltip
              placement="bottom"
              title={
                investigationData?.length > 0
                  ? ""
                  : "Please enter some Investigation to save a template"
              }
            >
              <Popover
                open={popOver2}
                onOpenChange={() =>
                  investigationData?.length > 0 && showHideSaveTemplatePopOver()
                }
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
            <button
              onClick={showHideClearData}
              className="btn btn-text clear-text d-flex align-items-center"
              disabled={investigationData?.length > 0 ? false : true}
            >
              <i className="icon-eraser1 me-2"></i> <span>Clear</span>
            </button>
          </div>
        </div>

        {DELETE_MODAL}
        {REMOVE_ALL_ROWS}
        {TABLE_INVESTIGATION}

        {filteredDdxInvestigationOptionsList?.length > 0 && (
          <div style={{ padding: "0 14px" }}>
            <DifferentialDiagnosis
              handleDDxDrawer={handleDDxDrawer}
              ddxOptionsList={filteredDdxInvestigationOptionsList}
              onSelectParent={onSelectDDx}
            />
          </div>
        )}

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
