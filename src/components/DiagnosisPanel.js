import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  Input,
  Button,
  Row,
  Col,
  Select,
  Popover,
  Tabs,
} from "antd";

import Diagnosisicon from "../assets/images/Diagnosis.svg";
import {
  addTemplate,
  clearDiagnosisSearch,
  deleteTemplate,
  getDiagnosisTemplates,
  searchDiagnosis,
  updateTemplate,
} from "../redux/diagnosisSlice";
import { EmptyPlank } from "./WalkInConsultation";

const SEVERITY_LIST = [
  { value: "severe", label: "Severe" },
  { value: "moderate", label: "Moderate" },
  { value: "mild", label: "Mild" },
];

const ADD_EDIT_TEMPLATE_TABS = [
  {
    key: "1",
    label: "New Template",
  },
  {
    key: "2",
    label: "Update Template",
  },
];

const TemplatesList = ({ showHidePopOver1, templates, onTemplateSelected }) => {
  console.log('TemplatesList: ', templates);
  const [matchedTemplates, setMatchedTemplates] = useState(templates);
  const dispatch = useDispatch();

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

  const onDeleteTemplateClicked = (template) => {
    dispatch(deleteTemplate(template.tdt_id));
  };

  return (
    <>
      <div className="pop-header" key="diagnosis-template">
        <div className="align-items-center d-flex justify-content-between">
          <div className="title-common">Diagnosis Templates</div>
          <Button
            className="btn btn-delete-prescription p-0"
            onClick={showHidePopOver1}
          >
            <i className="icon-Cross" />
          </Button>
        </div>
        <div className="mt-3" key="diagnosis-template-search">
          <Input
            className="popinput"
            onChange={onSearch}
            prefix={<i className="icon-search me-2" />}
          />
        </div>
      </div>
      <div className="pop-body">
        {matchedTemplates?.map((template) => {
          return (
            <div
              className="align-items-center d-flex justify-content-between medicine-templates"
              key={template.tds_id}
            >
              <div
                className="round-box"
                onClick={() => {
                  onTemplateSelected(template);
                }}
              >
                <i className="icon-template"></i>
              </div>
              <div
                className="text-truncate"
                onClick={() => {
                  onTemplateSelected(template);
                }}
              >
                <div className="title">{template.tdt_template_name}</div>
                <div className="text-truncate">
                  {template.diagnosis.map((diagnosis) => {
                    return <> {diagnosis.tds_name},</>;
                  })}
                </div>
              </div>
              <Button
                className="btn btn-delete-prescription p-0 ms-3"
                onClick={() => {
                  onDeleteTemplateClicked(template);
                }}
              >
                <i className="icon-delete"></i>
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
};

const DiagnosisPanel = () => {
  const { diagnosis, templates, resultantTemplate, loading, error } =
    useSelector((state) => state.diagnosis);
  const [searchQuery, setSearchQuery] = useState(null);
  const [template, setTemplate] = useState(null);
  const [selectedDiagnosises, setSelectedDiagnosises] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [popOver1, setPopOver1] = useState(false);
  const [popOver2, setPopOver2] = useState(false);
  const [value, setValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");
  const [tabChange, setTabChange] = useState("1");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDiagnosisTemplates());
  }, [dispatch]);

  useEffect(() => {
    console.log("templates: ", templates);
    if (resultantTemplate) {
      setAllTemplates([...allTemplates, resultantTemplate]);
    }

    if (templates) {
      console.log("updating setAllTemplates: ");
      setAllTemplates(templates);
    }
  }, [templates, resultantTemplate]);

  const addCustomDiagnosisQueryPlank = () => {
    const data = [];
    data.push({
      label: (
        <>
          <div>{searchQuery}</div>
        </>
      ),
    });
    setOptions(data);
  };

  useEffect(() => {
    const data = [];
    console.log("diagnosis:", diagnosis);
    if (diagnosis) {
      if (diagnosis.length === 0) {
        data.push({
          value: -1,
          label: (
            <>
              <EmptyPlank emptyMessage={error} />
            </>
          ),
        });
      } else {
        diagnosis.map((diagnosis) => {
          return data.push({
            value: diagnosis.tds_name,
            label: (
              <>
                <div
                  onClick={() => {
                    setIsModalOpen();
                    onSelect(diagnosis);
                  }}
                >
                  {diagnosis.tds_name}
                </div>
              </>
            ),
          });
        });
      }
    }

    data.push({
      label: (
        <>
          <div
            onClick={() => {
              setIsModalOpen();
              onSelect({
                tds_name: searchQuery, // Diagnosis Name
                tds_id: 0, // Diagnosis id 0 when add new diagnosis
                pms_default: 0,
              });
            }}
          >
            {searchQuery}
          </div>
        </>
      ),
    });
    setOptions(data);
  }, [diagnosis]);

  useEffect(() => {
    if (!searchQuery) {
      addCustomDiagnosisQueryPlank();
    } else if (searchQuery && searchQuery.length >= 3) {
      dispatch(searchDiagnosis(searchQuery));
    }
  }, [dispatch, searchQuery]);

  const onSearch = (query) => {
    setValue(query);
    let id = setTimeout(() => {
      setSearchQuery(query);
      clearTimeout(id);
    }, 500);
  };

  const onSelect = (diagnosis) => {
    console.log("diagnosis: ", diagnosis);
    setSearchQuery("");
    setSelectedDiagnosises([...selectedDiagnosises, diagnosis]);
    dispatch(clearDiagnosisSearch());
  };

  /* const onSearch = (data) => {
    setValue(data);
    console.log("onSearch", data);
    if (data.length > 0) {
      const array = [
        { id: 1, name: "Chest Pain" },
        { id: 2, name: "Chest Discomfort" },
        { id: 3, name: "Snoring" },
        { id: 4, name: "Anxiety" },
        { id: 5, name: "High blood pressure" },
        { id: 6, name: "Heartburn" },
        { id: -1 },
      ];
      array.map((e) => {
        if (e.id != -1) {
          options.push({
            value: e.name,
            label: <>{e.name}</>,
          });
        }
      });
    }
    setOptions((prev) => [...prev]);
  }; */

  const onSelectSearch = (data) => {
    console.log("onSelectSearch", data);
  };

  const onTemplateToEditSelected = (template) => {
    console.log("onTemplateToEditSelected template:", template);
    setTemplate(template);
  };

  const showHidePopOver1 = () => {
    setPopOver1(!popOver1);
  };

  const showHidePopOver2 = () => {
    setPopOver2(!popOver2);
  };

  const [options, setOptions] = useState([
    {
      label: "FREQUENTLY USED",
    },
  ]);

  const onTemplateSelected = (template) => {
    setSelectedDiagnosises([...selectedDiagnosises, ...template.diagnosis]);
  };

  const onTabChange = (key) => {
    setTabChange(key);
    setTemplate(null);
    console.log(`onSelectChange ${key}`);
  };

  const removeDiagnosis = (diagnosis) => {
    const index = selectedDiagnosises.indexOf(diagnosis);
    console.log("index:", index);
    if (index > -1) {
      selectedDiagnosises.splice(index, 1);
    }
    setSelectedDiagnosises([...selectedDiagnosises]);
  };

  const onAddTemplateClicked = () => {
    if (!selectedDiagnosises || selectedDiagnosises.length === 0) {
      return;
    }

    const templateToAdd = {
      ...template,
      diagnosis: selectedDiagnosises,
    };

    console.log("templateToAdd: ", templateToAdd);
    dispatch(addTemplate(templateToAdd));
  };

  const onUpdateTemplateClicked = () => {
    if (!selectedDiagnosises || selectedDiagnosises.length === 0) {
      return;
    }

    const templateToUpdate = {
      ...template,
      diagnosis: selectedDiagnosises,
    };

    console.log("onUpdateTemplateClicked: ", templateToUpdate);
    dispatch(updateTemplate(templateToUpdate));
  };

  const saveContent = (
    <>
      <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
        <Tabs
          defaultActiveKey="1"
          items={ADD_EDIT_TEMPLATE_TABS}
          onChange={onTabChange}
          className="w-100"
        />
        <Button
          className="btn btn-delete-prescription"
          onClick={showHidePopOver2}
        >
          <i className="icon-Cross"></i>
        </Button>
      </div>
      {tabChange == 1 ? (
        <div className="pop-header d-flex">
          <Input
            className="popinput inputheight41"
            placeholder="Template Name"
            onChange={(e) => {
              setTemplate({ ...template, tdt_template_name: e.target.value });
            }}
          />
          <Button
            className="btn btn-primary3 btn-41 ms-3"
            disabled={!template?.tdt_template_name}
            onClick={onAddTemplateClicked}
          >
            {" "}
            Save{" "}
          </Button>
        </div>
      ) : (
        <div className="pop-header d-flex">
          <Select
            showSearch
            className="autocomplete-custom w-100 popinput inputheight41"
            placeholder="Select Template"
            options={allTemplates.map((template) => {
              return {
                value: template.tdt_template_name,
                label: (
                  <div
                    key={template.tdt_id}
                    onClick={() => {
                      onTemplateToEditSelected(template);
                    }}
                  >
                    {template.tdt_template_name}
                  </div>
                ),
              };
            })}
          />
          <Button
            className="btn btn-primary3 btn-41 ms-3"
            onClick={onUpdateTemplateClicked}
            disabled={!template?.tdt_template_name}
          >
            {" "}
            Update{" "}
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="col-lg-8 col-md-12 col-12 mt-lg-0 mt-3">
      <div className="prescription-box-sm">
        <div className="d-flex align-items-center justify-content-between p-14-pb0">
          <div className="d-flex align-items-center">
            <img className="me-2" src={Diagnosisicon} alt="Diagnosis" />
            <div className="title-common">Diagnosis</div>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn d-flex align-items-center btn-text">
              {" "}
              <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span>
            </button>
            <Popover
              open={popOver1}
              onOpenChange={showHidePopOver1}
              content={() => {
                return allTemplates ? (
                  <TemplatesList
                    showHidePopOver1={showHidePopOver1}
                    templates={allTemplates}
                    onTemplateSelected={onTemplateSelected}
                  />
                ) : (
                  <div className="align-items-center w-100 justify-content-between p-2">
                    No templtes were found
                  </div>
                );
              }}
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
              onOpenChange={showHidePopOver2}
              content={saveContent}
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
        {selectedDiagnosises?.map((diagnosis) => {
          return (
            <Row
              gutter={[0]}
              className="align-items-center border-bottom border-top mt-14"
            >
              <Col lg={7} md={7} sm={7} xs={7} className="border-end">
                <div className="p-2 fontroboto fw-medium">
                  {diagnosis.tds_name}
                </div>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                <AutoComplete
                  options={options}
                  className="autocomplete-custom w-100 inputborder"
                  // onSelect={onSelect}
                  // onSearch={onSearch}
                  bordered={false}
                  placeholder="Since"
                ></AutoComplete>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                <Select
                  showSearch
                  className="autocomplete-custom w-100 inputborder"
                  placeholder="Severity"
                  onSearch={onSelectSearch}
                  options={SEVERITY_LIST}
                />
              </Col>
              <Col lg={8} md={8} sm={7} xs={7} className="border-end">
                <Input className="notesinput border-0" placeholder="Notes" />
              </Col>
              <Col lg={1} md={1} sm={2} xs={2} className="text-center">
                <Button
                  className="btn py-0 btn-delete-prescription px-0"
                  onClick={() => {
                    removeDiagnosis(diagnosis);
                  }}
                >
                  <i className="icon-delete"></i>
                </Button>
              </Col>
            </Row>
          );
        })}

        <Form className="p-14">
          <Form.Group controlId="exampleForm.ControlInput1">
            <AutoComplete
              value={value}
              options={options}
              className="autocomplete-custom w-100"
              onSearch={onSearch}
            >
              <Input
                placeholder="Search by Patient’s Name, Phone number or Id"
                prefix={<i className="icon-search"></i>}
                suffix={
                  diagnosis?.length > 0 && (
                    <i
                      className="icon-Cross"
                      onClick={() => {
                        dispatch(clearDiagnosisSearch());
                        setSearchQuery(null);
                        setValue("");
                      }}
                    ></i>
                  )
                }
              />
            </AutoComplete>
          </Form.Group>
        </Form>
      </div>
      {/* <div className="prescription-box-sm">
                              <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                      <img className='me-2' src={Examinationsicon} alt="Examinations" />
                                      <div className="title-common">Examinations</div>
                                  </div>
                                  <div className="d-flex align-items-center">
                                      <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button></Link>
                                      <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button></Link>
                                  </div>
                              </div>
                              <Form className="mt-2">
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Control type="email" placeholder="Search by patient name" />
                                  </Form.Group>
                              </Form>
                          </div>
                          <div className="prescription-box-sm">
                              <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                      <img className='me-2' src={Diagnosisicon} alt="Diagnosis" />
                                      <div className="title-common">Diagnosis</div>
                                  </div>
                                  <div className="d-flex align-items-center">
                                      <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button></Link>
                                      <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button></Link>
                                  </div>
                              </div>
                              <Form className="mt-2">
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Control type="email" placeholder="Search by patient name" />
                                  </Form.Group>
                              </Form>
                          </div>
                          <div className="prescription-box-sm">
                              <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                      <img className='me-2' src={Medicationicon} alt="Medication" />
                                      <div className="title-common">Medication (Rx)</div>
                                  </div>
                                  <div className="d-flex align-items-center">
                                      <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button></Link>
                                      <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button></Link>
                                  </div>
                              </div>
                              <Form className="mt-2">
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Control type="email" placeholder="Search by patient name" />
                                  </Form.Group>
                              </Form>
                          </div> */}
    </div>
  );
};

export default DiagnosisPanel;
