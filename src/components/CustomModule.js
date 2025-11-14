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
  Tooltip,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import "./CustomModule.scss";

import CommonModal from "../common/CommonModal";
import alertIcon from "../assets/images/alertIcon.svg";
import CashManagerContext from "../context/CashManagerContext";
import { errorMessage, removeBeforeWhiteSpace } from "../utils/utils";
import ModuleIcon from "../assets/images/custom-module.svg";
import { MenuOutlined } from "@ant-design/icons";
import {
  addModule as addModuleOPD,
  clearSearchResults as clearSearchResultsOPD,
  searchModule as searchModuleOPD,
  userPreModulesRX,
} from "../redux/customModuleSlice";
import {
  addModule as addModuleIPD,
  clearSearchResults as clearSearchResultsIPD,
  searchModule as searchModuleIPD,
} from "../redux/ipd/customModuleSlice";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import editIcon from "../assets/images/edit-icon-blue.svg";
import deleteIcon from "../assets/images/delete-icon-blue.svg";
import TextArea from "antd/es/input/TextArea";
import { MESSAGE_KEY } from "../utils/constants";
import visitEnd from "../assets/images/end-visit.svg";
import imgCloseVisit from "../assets/images/close-visit.svg";
import { getDecodedToken } from "../utils/localStorage";
import config from "../config";

function CustomModule({
  module,
  form,
  customModuleContents: customModuleContentsProp,
  setCustomModuleContents: setCustomModuleContentsProp,
  admissionId,
  patientId,
  onModuleDeleted,
  onModuleRenamed,
  ...props
}) {
  const isIPDMode = !!form;

  const { customModules, searchModuleResults, loading } = useSelector((state) =>
    isIPDMode ? state.ipdCustomModules : state.customModules
  );
  const { userId } = useSelector((state) => state.doctors);

  const dispatch = useDispatch();
  const decodedToken = getDecodedToken();

  const context = useContext(CashManagerContext);
  const customModuleContents =
    customModuleContentsProp ||
    context?.customModuleContents ||
    props?.customModuleContents ||
    [];
  const setCustomModuleContents =
    setCustomModuleContentsProp ||
    context?.setCustomModuleContents ||
    props?.setCustomModuleContents ||
    (() => {});
  const patient_data = props?.patient_data || context?.patient_data;
  const tcmId = admissionId || patientId || context?.tcmId || props?.tcmId;

  //PopOver1
  const [popOver1, setPopOver1] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [removeTemplateId, setRemoveTemplateId] = useState(null);

  const [searchChildQuery, setSearchChildQuery] = useState({});
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
  const templates = module?.templates;
  const [canEditName, setCanEditName] = useState(false);
  const [newModuleName, setNewModuleName] = useState(module?.name || "");
  const [isDeleteModuleModalOpen, setIsDeleteModuleModalOpen] = useState(false);
  const moduleData =
    customModuleContents
      .filter((content) => content.module_id === module.module_id)
      ?.flatMap((item) => item.content) || [];

  useEffect(() => {
    const moduleContent = customModuleContents.find(
      (content) => content.module_id === module.module_id
    );

    if (!moduleContent || moduleContent.content.length === 0) {
      updateCustomModuleContents([{ title: "", notes: "" }]);
    }

    setMatchedTemplates(templates);
    setAllTemplates(templates);
  }, [module, customModuleContents]);

  //Parent AutoComplete
  useEffect(() => {
    if (isIPDMode) {
      dispatch(clearSearchResultsIPD());
      const timeOutId = setTimeout(() => {
        if (form) {
          dispatch(
            searchModuleIPD({
              moduleId: module?.module_id,
              keyword: searchChildQuery.query,
              form,
            })
          );
        }
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(clearSearchResultsOPD());
      const timeOutId = setTimeout(() => {
        dispatch(
          searchModuleOPD({
            moduleId: module?.module_id,
            keyword: searchChildQuery.query,
          })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [searchChildQuery, isIPDMode, form, module?.module_id, dispatch]);

  useEffect(() => {
    const data = [];
    searchModuleResults.map(({ title, notes }, i) => {
      return data.push({
        key: JSON.stringify({ title, notes, i, unique_id: uuidv4() }),
        value: title,
        label: <div className="fw-medium">{title}</div>,
      });
    });
    if (searchChildQuery.query?.length === 0) {
      data.unshift({
        key: -1,
        label: (
          <>
            <div>FREQUENTLY USED</div>
          </>
        ),
      });
    } else {
      searchChildQuery?.query &&
        data.push({
          key: JSON.stringify({
            unique_id: uuidv4(),
            change: 1,
            title: searchChildQuery?.query,
            notes: "",
          }),
          value: searchChildQuery?.query,
          label: (
            <>
              <div>
                {searchChildQuery?.query}
                <i className="icon-Add mx-1 text-primary fs-6"></i>{" "}
                <a className="fw-medium text-decoration-underline text-primary">
                  {" "}
                  Add Custom
                </a>
              </div>
            </>
          ),
        });
    }
    setChildSearchOptions(data);
  }, [searchModuleResults]);

  const updateCustomModuleContents = (updatedContent) => {
    setCustomModuleContents((prevContents) => {
      const moduleExists = prevContents.some(
        (content) => content.module_id === module.module_id
      );
      return moduleExists
        ? prevContents.map((content) => {
            if (content.module_id === module.module_id) {
              return {
                ...content,
                module_name: module.name,
                content: updatedContent,
              };
            }
            return content;
          })
        : [
            ...prevContents,
            {
              module_id: module.module_id,
              module_name: module.name,
              content: updatedContent,
            },
          ];
    });
  };

  const onFocusChid = (i) => {
    setSearchChildQuery({
      query: moduleData[i].title,
      index: i,
    });
  };

  const onSearchChild = useCallback(
    (query, i) => {
      const updatedQuery = removeBeforeWhiteSpace(query);
      const updatedModuleData = [...moduleData];
      updatedModuleData[i] = {
        ...updatedModuleData[i],
        title: updatedQuery,
        change: 1,
      };
      updateCustomModuleContents(updatedModuleData);
      setSearchChildQuery({ query: updatedQuery, index: i });
    },
    [moduleData]
  );

  const onSelectChild = useCallback(
    (data, option, i) => {
      const updatedModuleData = [...moduleData];
      const tokenData = decodedToken?.result;
      const currentBusinessId = tokenData?.hospital_business_id;
      const isZydusUser = currentBusinessId == config.ZYDUS_BUSINESS_ID;

      // For Zydus users, use the old behavior (title only)
      if (isZydusUser) {
        updatedModuleData[i] = {
          ...updatedModuleData[i],
          title: data,
        };

        // Add new empty entry for dropdown selections
        if (option && option.key && option.key !== -1) {
          updatedModuleData.push({ title: "", notes: "" });
        }

        updateCustomModuleContents(updatedModuleData);
        return;
      }

      // For non-Zydus users, use the new behavior (title + notes)
      let title = data;
      let notes = "";

      // Approach 1: Parse the key if it exists
      if (option && option.key && option.key !== -1) {
        try {
          const selectedData = JSON.parse(option.key);
          title = selectedData.title || data;
          notes = selectedData.notes || "";

          // Only add a new empty entry when an item is selected from dropdown
          updatedModuleData.push({ title: "", notes: "" });
        } catch (error) {
          // If parsing fails, try approach 2
        }
      }

      // Approach 2: Find the corresponding search result
      if (!notes && searchModuleResults.length > 0) {
        const matchingResult = searchModuleResults.find(
          (result) => result.title === data
        );
        if (matchingResult) {
          notes = matchingResult.notes || "";
        }
      }

      updatedModuleData[i] = {
        ...updatedModuleData[i],
        title: title,
        notes: notes,
      };

      updateCustomModuleContents(updatedModuleData);
    },
    [moduleData, searchModuleResults, decodedToken]
  );

  const onChangeNoteChild = useCallback(
    (e, i) => {
      const updatedModuleData = [...moduleData];

      updatedModuleData[i] = { ...updatedModuleData[i], notes: e.target.value };
      updateCustomModuleContents(updatedModuleData);
    },
    [moduleData]
  );

  const onRemoveRow = (index) => {
    if (
      moduleData.length === 1 &&
      !moduleData[index].title &&
      !moduleData[index].notes
    ) {
      errorMessage(`Please fillup ${module?.name} name or notes`);
      return;
    }

    const updatedModuleData = moduleData.filter((_, i) => i !== index);
    updateCustomModuleContents(updatedModuleData);
  };

  //PopOver1 function
  const showHideTemplatesListPopover = useCallback(() => {
    setPopOver1(!popOver1);
  }, [popOver1]);

  const onSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      let filteredTemplates = templates.filter((template) => {
        return template.template_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setMatchedTemplates(filteredTemplates);
    } else {
      setMatchedTemplates(templates);
    }
  };

  const loadPreviousClick = async () => {
    const tokenData = decodedToken?.result;
    var sendData = {
      module_id: module?.module_id,
      hm_business_id: tokenData?.hospital_business_id,
      um_id: tokenData?.user_id,
      patient_unique_id:
        patient_data !== undefined ? patient_data.patient_unique_id : 0,
      tcm_id: tcmId,
    };
    const action = await dispatch(userPreModulesRX(sendData));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action.payload?.moduleContents[0]?.content.map(
        (e) => {
          return { ...e, unique_id: uuidv4(), notes: e.notes || "" };
        }
      );
      // Find the module's existing content and update it
      const updatedModuleData = [
        ...moduleData?.filter((e) => e.title || e.notes),
        ...(updatedData || []),
      ];
      // Update the parent state with the new module contents
      updateCustomModuleContents(updatedModuleData);
    } else {
      errorMessage(action.error);
    }
  };

  const onTemplateSelected = (template) => {
    const updatedData = template.content.map((e) => {
      return { ...e, unique_id: uuidv4(), notes: e.notes || "" };
    });

    // Find the module's existing content and update it
    const updatedModuleData = [
      ...moduleData?.filter((e) => e.title || e.notes),
      ...updatedData,
    ];
    // Update the parent state with the new module contents
    updateCustomModuleContents(updatedModuleData);

    // Close the template popover
    showHideTemplatesListPopover();
  };

  const onDeleteTemplateClicked = async (templateId) => {
    const modules = customModules.map((cm) => {
      if (cm.module_id === module.module_id) {
        return {
          ...cm,
          templates: cm.templates.filter((t) => t.template_id !== templateId),
        };
      }
      return cm;
    });
    let action;
    if (isIPDMode) {
      action = await dispatch(
        addModuleIPD({
          data: { userId, modules, form },
        })
      );
    } else {
      action = await dispatch(addModuleOPD({ userId, modules }));
    }
    if (action.meta.requestStatus === "rejected") {
      errorMessage(action.error);
    }
  };

  const onDeleteModule = async () => {
    try {
      const moduleToDelete = customModules.find(
        (m) => m.module_id === module.module_id
      );
      const modulesPayload = customModules.filter(
        (cm) => cm.module_id !== module.module_id
      );
      let action;
      if (isIPDMode) {
        action = await dispatch(
          addModuleIPD({
            data: { userId, modules: modulesPayload, form },
          })
        );
      } else {
        action = await dispatch(
          addModuleOPD({
            userId,
            modules: modulesPayload,
          })
        );
      }
      if (action.meta.requestStatus === "fulfilled") {
        setCustomModuleContents((prev) => {
          return prev.filter(
            (item) => item.module_id !== moduleToDelete?.module_id
          );
        });

        if (typeof onModuleDeleted === "function") {
          onModuleDeleted(moduleToDelete?.module_id);
        }

        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" />
              <div>
                <div className="title-common text-start fontroboto">{`${moduleToDelete?.name} module deleted successfully.`}</div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
              />
            </div>
          ),
          duration: 3,
        });
      }
    } catch (error) {
      message.error(error || "Failed to delete module.");
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
      const updateQuery = removeBeforeWhiteSpace(e.target.value);
      setInputTemplateName(updateQuery);
    },
    [inputTemplateName]
  );

  const onAddTemplateClicked = async () => {
    if (!moduleData?.some((e) => e.title || e.notes)) {
      errorMessage(
        `At least 1 ${module.module_name || module.name} should be added`
      );
    } else {
      const modules = customModules.map((cm) => {
        if (cm.module_id === module.module_id) {
          return {
            ...cm,
            templates: [
              {
                template_name: inputTemplateName,
                content: moduleData?.filter((e) => e.title || e.notes),
              },
              ...cm.templates,
            ],
          };
        }
        return cm;
      });
      let action;
      if (isIPDMode) {
        action = await dispatch(
          addModuleIPD({
            data: { userId, modules, form },
          })
        );
      } else {
        action = await dispatch(addModuleOPD({ userId, modules }));
      }
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
    if (moduleData.length === 0) {
      errorMessage(`At least 1 ${module?.name} added`);
    } else if (moduleData.filter((e) => e.title == "").length > 0) {
      errorMessage(`Please fillup ${module?.name} name`);
    } else {
      let data = JSON.parse(inputTemplateName);
      const modules = customModules.map((cm) => {
        if (cm.module_id === module.module_id) {
          return {
            ...cm,
            templates: cm.templates.map((t) => {
              if (t.template_id === data.template_id) {
                return {
                  ...t,
                  template_name: data.template_name,
                  content: moduleData?.filter((e) => e.title || e.notes),
                };
              }
              return t;
            }),
          };
        }
        return cm;
      });
      let action;
      if (isIPDMode) {
        action = await dispatch(
          addModuleIPD({
            data: { userId, modules, form },
          })
        );
      } else {
        action = await dispatch(addModuleOPD({ userId, modules }));
      }
      if (action.meta.requestStatus === "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  const showHideModal = useCallback(
    (template_id) => {
      template_id !== undefined
        ? setRemoveTemplateId(template_id)
        : setRemoveTemplateId(null);
      setIsModalOpen(!isModalOpen);
    },
    [isModalOpen]
  );

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
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>Are you sure you want to delete this template?</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={() => {
                    onDeleteTemplateClicked(removeTemplateId);
                    showHideModal();
                  }}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes, Delete
                </div>
                <Button
                  onClick={showHideModal}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isModalOpen]);

  const toggleDeleteModuleModal = useCallback(() => {
    setIsDeleteModuleModalOpen(!isDeleteModuleModalOpen);
  }, [isDeleteModuleModalOpen]);

  const DELETE_MODULE_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isDeleteModuleModalOpen}
        onCancel={toggleDeleteModuleModal}
        modalWidth={500}
        title={"Are you sure you want to delete?"}
        modalBody={
          <>
            <div className="d-flex align-items-start alert-warning rounded-10px p-3 patient-details">
              <img className="me-3" src={alertIcon} alt="Warning" />
              <span>
                Deleting this "<b>{module?.name}</b>" module will permanently
                remove all saved templates and data associated with it. This
                action cannot be undone.
              </span>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={() => {
                    onDeleteModule();
                    toggleDeleteModuleModal();
                  }}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes, Delete
                </div>
                <Button
                  onClick={toggleDeleteModuleModal}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isDeleteModuleModalOpen]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedItems = reorder(
      moduleData,
      result.source.index,
      result.destination.index
    );
    updateCustomModuleContents(reorderedItems);
  };

  const TABLE_CUSTOM_MODULE = useMemo(() => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`${module?.name}`} direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {moduleData.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={`${module?.name}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <Row
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      key={index}
                      gutter={[0]}
                      className={`${
                        index === 0 && "mt-14 border-top"
                      } align-items-center border-bottom`}
                    >
                      <Col lg={1} md={1} sm={1} xs={1} className="text-center">
                        <MenuOutlined
                          {...provided.dragHandleProps}
                          className="drag-handle"
                          style={{ cursor: "grab" }}
                        ></MenuOutlined>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={8}>
                        <div className="fontroboto fw-medium">
                          <AutoComplete
                            defaultValue={item.title}
                            value={item.title}
                            placeholder={`${module?.name} Name`}
                            bordered={false}
                            defaultOpen={false}
                            onSearch={(query) => onSearchChild(query, index)}
                            onFocus={() => onFocusChid(index)}
                            options={childSearchOptions}
                            className="autocomplete-custom w-100 inputborder"
                            defaultActiveFirstOption={true}
                            onSelect={(data, option) =>
                              onSelectChild(data, option, index)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                onSearchChild(e.target.value, index);
                              }
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        lg={14}
                        md={14}
                        sm={13}
                        xs={13}
                        className="border-end"
                      >
                        <TextArea
                          className="customnotesinput"
                          placeholder="Notes"
                          value={item.notes}
                          onChange={(e) => onChangeNoteChild(e, index)}
                          autoSize={{ minRows: 1, maxRows: 10 }} // Dynamically resizes between 1 and 10 rows
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
  }, [moduleData, childSearchOptions]);

  //Template Componet
  const TEMPLATE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="pop-header" key={`${module.module_name}-template`}>
          <div className="align-items-center d-flex justify-content-between">
            <div className="title-common">{module?.name} Templates</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideTemplatesListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          <div className="mt-3" key={`${module.module_name}-template-search`}>
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
                    <div className="title text-main2">
                      {template.template_name}
                    </div>
                    <div className="text-truncate">
                      {template?.content?.map((item, ii) => {
                        return (
                          <span key={ii}>{`${item.title || item.notes}${
                            template.content.length - 1 != ii ? ", " : ""
                          }`}</span>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className="btn btn-delete-prescription p-0 ms-2"
                    onClick={() => {
                      showHideModal(template.template_id);
                      showHideTemplatesListPopover();
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
              value={
                inputTemplateName && JSON.parse(inputTemplateName).template_name
              }
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Template"
              onSearch={onSearchTemplate}
              onSelect={onSelectTemplate}
              optionLabelProp="label"
              options={allTemplates.map((template) => {
                return {
                  key: JSON.stringify(template),
                  value: template.template_name,
                  label: (
                    <div key={template.template_id}>
                      {template.template_name}
                    </div>
                  ),
                };
              })}
              optionRender={(option) => (
                <div className="align-items-center d-flex text-truncate w-100">
                  <div className="round-box">
                    <i className="icon-template"></i>
                  </div>
                  <div className="text-truncate w-100">
                    <div className="title text-main2">{option.data.value}</div>
                    <div className="text-truncate">
                      {JSON.parse(option.data.key).content.map((item, ii) => {
                        return (
                          <span key={ii}>{`${item.title}${
                            JSON.parse(option.data.key).content.length - 1 != ii
                              ? ", "
                              : ""
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
    // Clear the current module's content
    updateCustomModuleContents([]);

    // Close the clear data modal
    showHideClearData();
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
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>
                  Are you sure you want to Clear Selected <b>{module?.name}</b>?
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={onRemoveRows}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  <span>Yes, Clear</span>
                </div>
                <Button
                  onClick={showHideClearData}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isModalOpen1]);

  const menu = (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => setCanEditName(true)}
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#4a4a4a",
          padding: "8px 12px",
        }}
      >
        <img
          src={editIcon}
          width={16}
          height={16}
          alt="edit"
          style={{ margin: "0 8px 3px 0" }}
        />
        Edit Module Name
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={toggleDeleteModuleModal}
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#ff4d4f",
          padding: "8px 12px",
        }}
      >
        <img
          src={deleteIcon}
          width={16}
          height={16}
          alt="edit"
          style={{ margin: "0 8px 3px 0" }}
        />
        Delete Module
      </Menu.Item>
    </Menu>
  );

  const handleEditModuleName = async () => {
    if (!newModuleName.trim()) {
      message.error("Module name cannot be empty.");
      return;
    }
    if (customModules.some((cm) => cm.name === newModuleName.trim())) {
      message.error("Module name already exists.");
      return;
    }

    try {
      const modulesPayload = customModules.map((cm) => {
        if (cm.module_id === module.module_id) {
          return {
            ...cm,
            name: newModuleName,
          };
        }
        return cm;
      });
      let action;
      if (isIPDMode) {
        action = await dispatch(
          addModuleIPD({
            data: { userId, modules: modulesPayload, form },
          })
        );
      } else {
        action = await dispatch(
          addModuleOPD({
            userId,
            modules: modulesPayload,
          })
        );
      }
      if (action.meta.requestStatus === "fulfilled") {
        setCanEditName(false);
        if (typeof onModuleRenamed === "function") {
          onModuleRenamed(module.module_id, newModuleName.trim());
        }
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" />
              <div>
                <div className="title-common text-start fontroboto">
                  {`Module name updated successfully.`}
                </div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
              />
            </div>
          ),
        });
      }
    } catch (error) {
      message.error(error || "Failed to update module name.");
    }
  };

  const handleCancel = () => {
    setCanEditName(false);
    setNewModuleName(module?.name);
  };

  const handleAddRow = () => {
    updateCustomModuleContents([...moduleData, { title: "", notes: "" }]);
  };

  return (
    <div className="prescription-box-sm">
      <div className="d-flex align-items-center justify-content-between p-14-pb0">
        {canEditName ? (
          <div className="d-flex w-100">
            <img className="me-2" src={ModuleIcon} alt={module?.name} />
            <Input
              placeholder="Enter custom module name"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              className="custom-module-input"
            />
            <>
              <CheckOutlined
                className="input-action-icon tick-icon"
                onClick={handleEditModuleName}
              />
              <CloseOutlined
                className="input-action-icon cross-icon"
                onClick={handleCancel}
              />
            </>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center">
              <img className="me-2" src={ModuleIcon} alt={module?.name} />
              <div className="title-common">{module?.name}</div>
            </div>

            <div className="d-flex align-items-center">
              <button
                className="btn d-flex align-items-center btn-text"
                onClick={loadPreviousClick}
              >
                {" "}
                <i className="icon-reload me-2"></i>{" "}
                <span>Load Prev. data</span>
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
              <Tooltip
                placement="bottom"
                title={
                  moduleData?.filter((e) => e.title || e.notes).length > 0
                    ? ""
                    : `Please enter some ${module?.name} to save a template`
                }
              >
                <Popover
                  open={popOver2}
                  onOpenChange={() =>
                    moduleData?.filter((e) => e.title || e.notes).length > 0 &&
                    showHideSaveTemplatePopOver()
                  }
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
                disabled={
                  moduleData?.filter((e) => e.title || e.notes).length > 0
                    ? false
                    : true
                }
              >
                <i className="icon-eraser1 me-2"></i> <span>Clear</span>
              </button>
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={
                    <MoreOutlined
                      style={{
                        fontSize: "18px",
                        color: "#4a4a4a",
                        fontWeight: "bold",
                      }}
                    />
                  }
                  className="more-options-btn"
                />
              </Dropdown>
            </div>
          </>
        )}
      </div>

      {DELETE_MODAL}
      {REMOVE_ALL_ROWS}
      {TABLE_CUSTOM_MODULE}
      {DELETE_MODULE_MODAL}

      <div className="p-14">
        <Button
          type="link"
          icon={<PlusOutlined />}
          className="add-custom-module-link"
          onClick={handleAddRow}
        >
          Add New Line
        </Button>
      </div>
    </div>
  );
}

export default React.memo(CustomModule);
