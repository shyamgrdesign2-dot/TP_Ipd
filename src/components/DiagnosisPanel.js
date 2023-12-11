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
  clearDiagnosisSearch,
  getDiagnosisTemplates,
  searchDiagnosis,
} from "../redux/diagnosisSlice";
import { EmptyPlank } from "./WalkInConsultation";

const TemplatesList = ({ showHidePopOver1, templates, onTemplateSelected }) => {
  const [matchedTemplates, setMatchedTemplates] = useState(templates);

  const onSearch = (e) => {
    const searchQuery = e.target.value;

    if (searchQuery) {
      let filteredTemplates = templates.filter((template) => {
        return template.tdt_template_name.toLowerCase().includes(searchQuery.toLowerCase());
      });

      setMatchedTemplates(filteredTemplates);
    } else {
      setMatchedTemplates(templates);
    }
  };

  return (
    <>
      <div className="pop-header">
        <div className="align-items-center d-flex justify-content-between">
          <div className="title-common">Diagnosis Templates</div>
          <Button
            className="btn btn-delete-prescription p-0"
            onClick={showHidePopOver1}
          >
            <i className="icon-Cross" />
          </Button>
        </div>
        <div className="mt-3">
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
            <>
              <div
                className="align-items-center d-flex justify-content-between medicine-templates"
                key={template.tds_id}
                onClick={() => {
                  onTemplateSelected(template);
                }}
              >
                <div className="round-box">
                  <i className="icon-template"></i>
                </div>
                <div className="text-truncate">
                  <div className="title">{template.tdt_template_name}</div>
                  <div className="text-truncate">
                    Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet
                  </div>
                </div>
                <Button className="btn btn-delete-prescription p-0 ms-3">
                  <i className="icon-delete"></i>
                </Button>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

const DiagnosisPanel = () => {
  const { diagnosis, templates, loading, error } = useSelector(
    (state) => state.diagnosis
  );
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedDianosises, setSelectedDianosises] = useState([]);
  const [dianosisTemplates, setDianosisTemplates] = useState([]);
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
    setDianosisTemplates(templates);
  }, [templates]);

  const addAddPatientPlank = () => {
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
          <div>{searchQuery}</div>
        </>
      ),
    });
    setOptions(data);
  }, [diagnosis]);

  useEffect(() => {
    if (!searchQuery) {
      // dispatch(clearSearch());
      addAddPatientPlank();
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
    setSelectedDianosises([...selectedDianosises, diagnosis]);
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
  const onSelectChange = (value) => {
    console.log(`onSelectChange ${value}`);
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

  const severityList = [
    { value: "severe", label: "Severe" },
    { value: "moderate", label: "Moderate" },
    { value: "mild", label: "Mild" },
  ];

  const saveitems = [
    /*  */
    // {
    //     key: '1',
    //     label: 'New Template',
    //     children: (
    //         <>
    //             <div className="pop-header">

    //                 <Button className="btn btn-delete-prescription p-0"><i className="icon-Cross"></i></Button>

    //                 <div className="mt-3">
    //                     <Input className="popinput" prefix={<i className='icon-search me-2'></i>} />
    //                 </div>
    //             </div>
    //         </>
    //     ),
    // },
    {
      key: "1",
      label: "New Template",
    },
    {
      key: "2",
      label: "Update Template",
    },
  ];

  const onTemplateSelected = (template) => {
    setSelectedDianosises([...selectedDianosises, ...template.diagnosis]);
  };

  const onTabChange = (key) => {
    setTabChange(key);
    console.log(`onSelectChange ${key}`);
  };

  const removeDiagnosis = (diagnosis) => {
    var index = selectedDianosises.indexOf(diagnosis);
    console.log("index:", index);
    if (index > -1) {
      selectedDianosises.splice(index, 1);
    }
    setSelectedDianosises([...selectedDianosises]);
  };

  const saveContent = (
    <>
      <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
        <Tabs
          defaultActiveKey="1"
          items={saveitems}
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
          />
          <Button className="btn btn-primary3 btn-41 ms-3"> Save </Button>
        </div>
      ) : (
        <div className="pop-header d-flex">
          <Select
            showSearch
            className="autocomplete-custom w-100 popinput inputheight41"
            placeholder="Select Template"
            onChange={onSelectChange}
            onSearch={onSelectSearch}
            options={severityList}
          />
          <Button className="btn btn-primary3 btn-41 ms-3"> Update </Button>
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
                return dianosisTemplates ? (
                  <TemplatesList
                    showHidePopOver1={showHidePopOver1}
                    templates={dianosisTemplates}
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
        {selectedDianosises?.map((diagnosis) => {
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
                  onChange={onSelectChange}
                  onSearch={onSelectSearch}
                  options={severityList}
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
