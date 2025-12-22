import {
  Button,
  Input,
  Select,
  Spin,
  Tabs,
  Tooltip,
} from "antd";
import { useCallback, useMemo, useState } from "react";
import { errorMessage, removeBeforeWhiteSpace } from "../../../../utils/utils";
import { useDispatch } from "react-redux";
import { addTemplate, deleteTemplate, singleTemplateDetails, updateTemplate } from "../../../../redux/symptomsSlice";
import { LoadingOutlined } from "@ant-design/icons";
import CommonModal from "../../../../common/CommonModal";
import alertIcon from "./../../../../assets/images/alertIcon.svg";
import { Popover } from "antd";

const BillTemplate = ({ setDataSource, dataSource, totalBillAmount }) => {
  const TAB_ADD_TEMPLATE = 1;
  const TAB_UPDATE_TEMPLATE = 2;
  const ADD_EDIT_TEMPLATE_TABS = [
    { key: TAB_ADD_TEMPLATE, label: "New Template" },
    { key: TAB_UPDATE_TEMPLATE, label: "Update Template" },
  ];

  const dispatch = useDispatch();

  const [popOver1, setPopOver1] = useState(false);
  const [matchedTemplates, setMatchedTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [removeTemplateId, setRemoveTemplateId] = useState(null);
  const [popOver2, setPopOver2] = useState(false);
  const [inputTemplateName, setInputTemplateName] = useState(null);
  const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);
  const [allTemplates, setAllTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const onRemoveRows = () => {
    setDataSource([
      {
        masterId: "",
        name: "",
        quantity: "",
        amount: "",
        discount: "",
        discountType: "",
        gst: "",
        totalAmount: "",
        createdBy: "",
      },
    ]);
    showHideClearData();
  };

  const onDeleteTemplateClicked = async (tst_id) => {
    const action = await dispatch(deleteTemplate(tst_id));
    if (action.meta.requestStatus === "rejected") {
      errorMessage(action.error);
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

  //PopOver1 function
  const showHideTemplatesListPopover = useCallback(() => {
    setPopOver1(!popOver1);
  }, [popOver1]);

  //PopOver2 function
  const showHideSaveTemplatePopOver = useCallback(() => {
    setInputTemplateName(null);
    setPopOver2(!popOver2);
  }, [popOver2]);

  const showHideClearData = useCallback(() => {
    setIsModalOpen1(!isModalOpen1);
  }, [isModalOpen1]);

  const onChangeSaveTemplate = useCallback(
    (e) => {
      const updateQuery = removeBeforeWhiteSpace(e.target.value);
      setInputTemplateName(updateQuery);
    },
    [inputTemplateName]
  );

  const onTemplateSelected = async (template) => {
    window.Moengage.track_event("symptom_template_used", {
      template_name: template.tst_template_name,
    });
    const action = await dispatch(singleTemplateDetails(template.tst_id));
    if (action.meta.requestStatus === "fulfilled") {
      const updatedData = action?.payload;
      setDataSource((prev) => [...prev, ...updatedData]);
      showHideTemplatesListPopover();
    } else {
      errorMessage(action.error);
    }
  };

  const onAddTemplateClicked = async () => {
    if (dataSource.length === 0) {
      errorMessage("At least 1 symptom added");
    } else if (dataSource.filter((e) => e.symptom_name == "").length > 0) {
      errorMessage("Please fillup symptom name");
    } else {
      var sendData = {
        tst_template_name: inputTemplateName,
        dataSource: dataSource,
      };
      const action = await dispatch(addTemplate(sendData));
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

  const onTabChange = useCallback(
    (key) => {
      setInputTemplateName(null);
      setTabChange(key);
    },
    [tabChange]
  );

  const onSearch = useCallback(
    (query) => {
      setSearchQuery(removeBeforeWhiteSpace(query));
    },
    [searchQuery]
  );

  const onUpdateTemplateClicked = async () => {
    if (dataSource.length === 0) {
      errorMessage("At least 1 symptom added");
    } else if (dataSource.filter((e) => e.symptom_name == "").length > 0) {
      errorMessage("Please fillup symptom name");
    } else {
      var data = JSON.parse(inputTemplateName);
      var sendData = {
        tst_id: data.tst_id,
        tst_template_name: data.tst_template_name,
        dataSource: dataSource,
      };
      const action = await dispatch(updateTemplate(sendData));
      if (action.meta.requestStatus === "fulfilled") {
        setInputTemplateName(null);
        showHideSaveTemplatePopOver();
      }
    }
  };

  //Template Componet
  const TEMPLATE_CONTENT = useCallback(() => {
    return (
      <>
        <div className="pop-header" key="symptoms-template">
          <div className="align-items-center d-flex justify-content-between">
            <div className="title-common">Template List</div>
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
                    <div className="title text-main2">
                      {template.tst_template_name}
                    </div>
                    <div className="text-truncate">
                      <span>{template.symptoms}</span>
                    </div>
                  </div>
                  <Button
                    className="btn btn-delete-prescription p-0 ms-2"
                    onClick={() => {
                      showHideModal(template.tst_id);
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
              // loading={loading}
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
                inputTemplateName &&
                JSON.parse(inputTemplateName).tst_template_name
              }
              className="autocomplete-custom w-100 popinput inputheight41"
              placeholder="Select Template"
              onSearch={onSearchTemplate}
              onSelect={onSelectTemplate}
              optionLabelProp="label"
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
              optionRender={(option) => (
                <div className="align-items-center d-flex text-truncate w-100">
                  <div className="round-box">
                    <i className="icon-template"></i>
                  </div>
                  <div className="text-truncate w-100">
                    <div className="title text-main2">{option.data.value}</div>
                    <div className="text-truncate">
                      <span>{JSON.parse(option.data.key).symptoms}</span>
                    </div>
                  </div>
                </div>
              )}
            />
            <Button
              className="btn btn-primary3 btn-41 ms-3"
              // loading={loading}
              disabled={inputTemplateName ? false : true}
              onClick={onUpdateTemplateClicked}
            >
              {" Update "}
            </Button>
          </div>
        )}
      </>
    );
  }, [tabChange, popOver2, inputTemplateName, allTemplates]);

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
                  Yes Delete
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
                  Are you sure you want to Clear Selected <b>Bill Items</b>?
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

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <div className="fs-16 font-medium">Billing Items</div>
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
              dataSource?.length > 0
                ? ""
                : "Please enter some Billing Items to save a template"
            }
          >
            <Popover
              open={popOver2}
              onOpenChange={() =>
                dataSource?.length > 0 && showHideSaveTemplatePopOver()
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
            disabled={totalBillAmount > 0 ? false : true}
          >
            <i className="icon-eraser1 me-2"></i> <span>Clear</span>
          </button>
        </div>
      </div>
      {DELETE_MODAL}
      {REMOVE_ALL_ROWS}
    </>
  );
};

export default BillTemplate;
