import React, { useCallback, useContext, useMemo } from "react";
import { Col, Radio, Row, Form, Table, Collapse, Checkbox } from "antd";

import { MenuOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PrintSettingsContext from "../../context/PrintSettingsContext";

import { isMobile } from "react-device-detect";
import { useAccess } from "../../pages/vaccination/useAccess";
import { graphsToPrintData } from "../../pages/growthChart/growthChartHelper";

// const CustomRow = ({ children, ...props }) => {
//     const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
//         id: props['data-row-key'],
//     });
//     const style = {
//         ...props.style,
//         transform: CSS.Transform.toString(
//             transform && {
//                 ...transform,
//                 scaleY: 1,
//             }
//         ),
//         transition,
//         ...(isDragging ? {
//             position: 'relative',
//             zIndex: 9999,
//         } : {}),
//     };
//     return (
//         <tr {...props} ref={setNodeRef} style={style} {...attributes}>
//             {React.Children.map(children, (child) => {
//                 if (child.key === 'sort') {
//                     return React.cloneElement(child, {
//                         children: (
//                             <MenuOutlined
//                                 ref={setActivatorNodeRef}
//                                 style={{
//                                     touchAction: 'none',
//                                     cursor: 'move',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center',
//                                 }}
//                                 {...listeners}
//                             />
//                         ),
//                     });
//                 } else if (child.key === 'enable') {
//                     return React.cloneElement(child, {
//                         style: {
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                         },
//                     });
//                 }
//                 return child;
//             })}
//         </tr>
//     );
// };

const RowContext = React.createContext({});
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <MenuOutlined
      ref={setActivatorNodeRef}
      style={{
        touchAction: "none",
        cursor: "move",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...listeners}
    />
  );
};
const CustomRow = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
        position: "relative",
        zIndex: 9999,
      }
      : {}),
  };
  const contextValue = useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners]
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const checkboxOptions = [
  {
    label: "DOSE",
    value: "dose",
  },
  {
    label: "FREQUENCY",
    value: "frequency", // ✅ Added
  },
  {
    label: "DURATION",
    value: "duration",
  },
  {
    label: "QUANTITY",
    value: "quantity",
  },
  {
    label: "NOTE",
    value: "note",
  },

];

const obsHistoryCheckboxOptions = [
  {
    label: "GPLAE",
    value: "gplae",
  },
  {
    label: "Patient Info",
    value: "diagnosis",
  },
  {
    label: "History",
    value: "history",
  },
  {
    label: "Examination",
    value: "examination",
  },
  {
    label: "ANC Scheduler",
    value: "ancHistory",
  },
  {
    label: "Immunisation History",
    value: "immunisationHistory",
  },
];

function PrescriptionLayout({ todayVaccines, growthChartDetails, obstetricDetails, patientBills }) {
  const { caseManagerData, printSettings, setPrintSettings, medicalHistoryCheckboxOptions, labParamsData, zydusSelectedLabParams, customModules } = useContext(PrintSettingsContext);
  const { isVaccinationAccessable, isGrowthChartAccessable, isGynaecHistoryAccessable } = useAccess(
    caseManagerData?.patient_data?.patient_age
  );

  const customModulesMap = new Map(
    customModules.map((module) => [module.module_id, module.name])
  );

  const customModulesRxData = caseManagerData?.moduleContents?.filter((module) => module.content.length).map((content) => ({
    ...content,
    module_name: customModulesMap.get(content.module_id),
  }))

  const onMainCaseOptionChange = useCallback(
    (e) => {
      const updatedData = printSettings.prescription.case_option.map((x) => {
        return { ...x, format: e.target.value };
      });

      setPrintSettings((prev) => {
        return {
          ...prev,
          prescription: {
            case_option: updatedData,
          },
        };
      });
    },
    [printSettings]
  );

  const onCaseOptionChange = (record, flag, i) => {
    flag === "radio"
      ? (printSettings.prescription.case_option[i].format = record.target.value)
      : (printSettings.prescription.case_option[i].enable =
        record.enable === "Y" ? "N" : "Y");

    setPrintSettings((prev) => {
      return {
        ...prev,
      };
    });
  };

  const onMedicationWithGenericChange = (e, i) => {
    printSettings.prescription.case_option[i].medicine_with_generic =
      e.target.value;
    setPrintSettings((prev) => {
      return {
        ...prev,
      };
    });
  };

  const onFollowUpWithDateFormat = (e, i) => {
    printSettings.prescription.case_option[i].followup_dateformat =
      e.target.value;
    setPrintSettings((prev) => {
      return {
        ...prev,
      };
    });
  };

  const onMedicationWithNumericFormat = (e, i) => {
    printSettings.prescription.case_option[i].numeric_frequency =
      e.target.value;
    setPrintSettings((prev) => {
      return {
        ...prev,
      };
    });
  };

  const onMedicationOptionChange = (checkedValues, i) => {
    printSettings.prescription.case_option[i].medicine_option = checkedValues;
    setPrintSettings((prev) => {
      return {
        ...prev,
      };
    });
  };

  const onMedicalHistoryOptionChange = (checkedValues, i) => {
    printSettings.prescription.case_option[i].medical_history_option = checkedValues;
    setPrintSettings((prev) => {
      return {
        ...prev,
      };
    });
  };


  const growthChartOptions = graphsToPrintData
    .map((item) => ({
      label: item.label === "Height Vs Weight" ? "H & W" : item.label,
      value: item?.id === "HeightVsWeight" ? "heightVsWeight" : item.id?.toLowerCase(),
    }));

  const onGrowthChartOptionChange = (checkedValues, i) => {
    setPrintSettings((prev) => {
      prev.prescription.case_option[i].growth_chart_option = checkedValues;
      return {
        ...prev,
      };
    });
  };

  const onObsHistoryOptionChange = (checkedValues, i) => {
    setPrintSettings((prev) => {
      prev.prescription.case_option[i].obs_history_option = checkedValues;
      return {
        ...prev,
      };
    });
  };

  const accordionItems = (record, i) => [
    {
      key: "1",
      label: (
        <div className="text-start">
          <div className="fw-semibold">Customise Options</div>
          <div className="subtitle-customize">
            Selected/deselect medication columns need to be printed
          </div>
        </div>
      ),
      children: (
        <>
          <div className="fw-medium text-start py-2">MEDICINE</div>
          <div className="d-flex align-items-center text-start">
            <Radio.Group
              value={record?.medicine_with_generic}
              onChange={(e) => onMedicationWithGenericChange(e, i)}
            >
              <Radio className="mb-2" value={true}>
                Medicine with Generic Name
              </Radio>
              <Radio value={false}>Only Medicine Name</Radio>
            </Radio.Group>
          </div>
          <hr />
          <div className="fw-medium text-start py-2">FREQUENCY FORMAT</div>
          <div className="d-flex align-items-center text-start">
            <Radio.Group
              value={record?.numeric_frequency}
              onChange={(e) => onMedicationWithNumericFormat(e, i)}
            >
              <Radio className="mb-2" value={true}>
                Numeric format (e.g., 1-0-0)
              </Radio>
              <Radio value={false}>Text format (e.g., Morning)</Radio>
            </Radio.Group>
          </div>
          <hr />
          <div className="d-flex align-items-center">
            <Checkbox.Group
              options={checkboxOptions}
              value={record?.medicine_option}
              onChange={(checkedValues) =>
                onMedicationOptionChange(checkedValues, i)
              }
            />
          </div>
          <div className="subtitle-customize text-start mt-3">
            <span>Note:</span> The printed information will always include the
            name of the medicine (brand or generic). and the frequency.
          </div>
        </>
      ),
    },
  ];

  const accordionItemsFollowUp = (record, i) => [
    {
      key: "1",
      label: (
        <div className="text-start">
          <div className="fw-semibold">Customise Options</div>
          <div className="subtitle-customize">
            Select the parameters to be displayed
          </div>
        </div>
      ),
      children: (
        <>
          <div className="fw-medium text-start py-2">FOLLOW UP FORMAT</div>
          <div className="d-flex align-items-center text-start">
            <Radio.Group
              value={record?.followup_dateformat}
              onChange={(e) => onFollowUpWithDateFormat(e, i)}
            >
              <Radio className="mb-2" value={true}>Date format (e.g., 24/12/2024)</Radio>
              <Radio value={false}>Duration format (e.g., 2 days/weeks/months)</Radio>
            </Radio.Group>
          </div>
        </>
      ),
    },
  ];

  const medicalHistoryAccordionItems = (record, i) => [
    {
      key: "1",
      label: (
        <div className="text-start">
          <div className="fw-semibold">Customise Options</div>
          <div className="subtitle-customize">
            Selected/deselect medical history need to be printed
          </div>
        </div>
      ),
      children: (
        <>
          <div className="d-flex align-items-center pt-2">
            <Checkbox.Group
              options={medicalHistoryCheckboxOptions}
              value={record?.medical_history_option}
              onChange={(checkedValues) =>
                onMedicalHistoryOptionChange(checkedValues, i)
              }
            />
          </div>
        </>
      ),
    },
  ];
  const growthChartAccordionItems = (record, i) => [
    {
      key: "1",
      label: (
        <div className="text-start">
          <div className="fw-semibold">Customise Options</div>
          <div className="subtitle-customize">
            Select/deselect the parameters need to be printed
          </div>
        </div>
      ),
      children: (
        <div
          className="d-flex align-items-center"
          style={{ paddingTop: "12px" }}
        >
          <Checkbox.Group
            options={growthChartOptions
              .filter(({ value }) => printSettings?.prescription?.case_option?.[i]?.format === "table" ? value !== "heightVsWeight" : growthChartDetails?.growthChartImageData?.[value])}
            defaultValue={record?.growth_chart_option}
            onChange={(checkedValues) => onGrowthChartOptionChange(checkedValues, i)}
          />
        </div>
      ),
    },
  ];

  const obsHistoryAccordionItems = (record, i) => [
    {
      key: "1",
      label: (
        <div className="text-start">
          <div className="fw-semibold">Customise Options</div>
          <div className="subtitle-customize">
            Select/deselect the parameters need to be printed
          </div>
        </div>
      ),
      children: (
        <div className="d-flex align-items-center">
          <Checkbox.Group
            style={{ columnGap: "4px" }}
            options={obsHistoryCheckboxOptions}
            value={record?.obs_history_option}
            onChange={(checkedValues) =>
              onObsHistoryOptionChange(checkedValues, i)
            }
          />
        </div>
      ),
    },
  ];

  //Display Patient Info
  const caseOptionTable = [
    {
      key: "sort",
      // colSpan: 2,
      align: "center",
      dataIndex: "sort",
      width: 40,
      render: () => <DragHandle />,
    },
    {
      // colSpan: 0,
      dataIndex: "title",
      key: "title",
      render: (text, record, i) => (
        <>
          <div className="d-flex align-items-center justify-content-between text-start">
            <div
              className="d-flex align-items-center cursor-pointer Preview-color-icon"
              onClick={() => onCaseOptionChange(record, "visible", printSettings?.prescription?.case_option?.findIndex(x => x.id === record.id))}
            >
              <i
                className={`icon-Preview ${record.enable === "N" && "disable-preview"
                  } me-3`}
              ></i>
              <span style={{ wordBreak: "break-word" }}>{record.title}</span>
            </div>
            <Form.Item className="mb-0 form_addnewpatient ">
              <Radio.Group
                className={`d-flex gender-radio all-change-radio ${isMobile ? "segmented-radio-mobile" : ""
                  }`}
                onChange={(e) => onCaseOptionChange(e, "radio", printSettings?.prescription?.case_option?.findIndex(x => x.id === record.id))}
                value={record.format}
              >
                <Radio.Button className="w-100 text-center" value="inline" disabled={record?.id === 17}>
                  {record?.id === 12 ? "Graph View" : "Inline"}
                </Radio.Button>
                {record?.id !== 12 &&
                  <Radio.Button className="w-100 text-center" value="listview" disabled={record?.id === 17}>
                    List View
                  </Radio.Button>
                }
                <Radio.Button className="w-100 text-center" value="table" disabled={record?.id === 17}>
                  Table
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
          {record.id === 4 && (
            <div style={{ marginLeft: -40, display: "flex" }}>
              <div style={{ flex: 1 }}>
                <div className="border mt-3 rounded-4 p-3 bg-white ">
                  <Collapse
                    items={accordionItems(record, printSettings?.prescription?.case_option?.findIndex(x => x.id === record.id))}
                    defaultActiveKey={["1"]}
                    className="prescriptiontab-accordian"
                    expandIconPosition={"end"}
                  />
                </div>
              </div>
            </div>
          )}
          {record.id === 9 && (
            <div style={{ marginLeft: -40, display: "flex" }}>
              <div style={{ flex: 1 }}>
                <div className="border mt-3 rounded-4 p-3 bg-white ">
                  <Collapse
                    items={accordionItemsFollowUp(record, printSettings?.prescription?.case_option?.findIndex(x => x.id === record.id))}
                    defaultActiveKey={["1"]}
                    className="prescriptiontab-accordian"
                    expandIconPosition={"end"}
                  />
                </div>
              </div>
            </div>
          )}
          {record.id === 8 && (
            <div style={{ marginLeft: -40, display: "flex" }}>
              <div style={{ flex: 1 }}>
                <div className="border mt-3 rounded-4 p-3 bg-white ">
                  <Collapse
                    items={medicalHistoryAccordionItems(record, printSettings?.prescription?.case_option?.findIndex(x => x.id === record.id))}
                    defaultActiveKey={["1"]}
                    className="prescriptiontab-accordian"
                    expandIconPosition={"end"}
                  />
                </div>
              </div>
            </div>
          )}
          {record.id === 12 && (
            <div style={{ marginLeft: -40, display: "flex" }}>
              <div style={{ flex: 1 }}>
                <div className="border mt-3 rounded-4 p-3 bg-white ">
                  <Collapse
                    items={growthChartAccordionItems(record, printSettings?.prescription?.case_option?.findIndex(x => x.id === record.id))}
                    defaultActiveKey={["1"]}
                    className="prescriptiontab-accordian"
                    expandIconPosition={"end"}
                  />
                </div>
              </div>
            </div>
          )}
          {record.id === 14 && (
            <div style={{ marginLeft: -40, display: "flex" }}>
              <div style={{ flex: 1 }}>
                <div className="border mt-3 rounded-4 p-3 bg-white ">
                  <Collapse
                    items={obsHistoryAccordionItems(record, printSettings?.prescription?.case_option?.findIndex(x => x.id === record.id))}
                    defaultActiveKey={["1"]}
                    className="prescriptiontab-accordian"
                    expandIconPosition={"end"}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  const onDragEndCaseOption = ({ active, over }) => {
    if (active.id !== over?.id) {
      setPrintSettings((prev) => {
        const activeIndex = prev.prescription.case_option.findIndex((i) => i.id === active.id);
        const overIndex = prev.prescription.case_option.findIndex((i) => i.id === over?.id);
        return {
          ...prev,
          prescription: {
            case_option: arrayMove(prev.prescription.case_option, activeIndex, overIndex)
          }
        };
      });
    }
  };

  return (
    <div className="px-3">
      <div className="titleprint mb-3">Format Style</div>
      <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
        <Col>
          All Change to
        </Col>
        <Col className={`${isMobile ? 'radio-width-static' : 'radio-width-static-web'}`}>
          <Form.Item className="mb-0">
            <Radio.Group className={`d-flex gender-radio all-change-radio ${isMobile ? 'segmented-radio-mobile' : ''}`} onChange={onMainCaseOptionChange}
              value={
                printSettings?.prescription?.case_option.every(e => e.format === 'inline') ? 'inline'
                  : printSettings?.prescription?.case_option.every(e => e.format === 'listview') ? 'listview'
                    : printSettings?.prescription?.case_option.every(e => e.format === 'table') ? 'table'
                      : null}>
              <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
              <Radio.Button className="w-100 text-center" value="listview">List View</Radio.Button>
              <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      {printSettings?.prescription?.case_option?.length > 0 && (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndCaseOption}>
          <SortableContext
            // rowKey array
            items={printSettings?.prescription?.case_option?.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              className={`customize-table customize-table-format table-display-patient dragicon-position ${isMobile ? 'radio-width-static' : 'radio-width-static-web'}`}
              pagination={false}
              components={{
                body: {
                  row: CustomRow,
                },
              }}
              rowKey="id"
              columns={caseOptionTable}
              // dataSource={printSettings?.prescription?.case_option.map((e) => ({ ...e, key: e.id }))}
              dataSource={printSettings?.prescription?.case_option?.filter((option, index) =>
                (caseManagerData.symptoms.length > 0 && option.id === 1) ?
                  ({ ...option, key: option.id })
                  : (caseManagerData.examination.length > 0 && option.id === 2) ?
                    ({ ...option, key: option.id })
                    : (caseManagerData.diagnosis.length > 0 && option.id === 3) ?
                      ({ ...option, key: option.id })
                      : (caseManagerData.medicine.length > 0 && option.id === 4) ?
                        ({ ...option, key: option.id })
                        : (caseManagerData.advice.length > 0 && option.id === 5) ?
                          ({ ...option, key: option.id })
                          : (caseManagerData.investigation.length > 0 && option.id === 6) ?
                            ({ ...option, key: option.id })
                            : ((caseManagerData.vitals.length > 0 || caseManagerData?.patient_birth_weight) && option.id === 7) ?
                              ({ ...option, key: option.id })
                              : (caseManagerData.medical_history.length > 0 && option.id === 8) ?
                                ({ ...option, key: option.id })
                                : (caseManagerData.follow_up_date && option.id === 9) ?
                                  ({ ...option, key: option.id })
                                  : (caseManagerData.visit_advice && option.id === 91) ?
                                    ({ ...option, key: option.id })
                                    : (isVaccinationAccessable && (todayVaccines?.given?.length || todayVaccines?.due?.length) && option.id === 10) ?
                                      ({ ...option, key: option.id })
                                      : (caseManagerData?.smart_prescription_filename?.length && option.id === 11) ?
                                        ({ ...option, key: option.id })
                                        : (isGrowthChartAccessable && option.id === 12 && growthChartDetails?.growthChartImageData && Object.keys(growthChartDetails?.growthChartImageData)?.length > 0 && growthChartDetails?.todayGrowthChartData?.length > 0) ?
                                          ({ ...option, key: option.id })
                                          : (caseManagerData.gynecHistoryData && isGynaecHistoryAccessable && option.id === 13) ?
                                            ({ ...option, key: option.id })
                                            : (option.id === 14 && isGynaecHistoryAccessable && obstetricDetails?.id) ?
                                              ({ ...option, key: option.id })
                                              : (caseManagerData.labParamsData?.length > 0 && option.id === 15) ? ({ ...option, key: option.id })
                                                : (caseManagerData?.surgeries?.length > 0 && option.id === 16) ?
                                                  ({ ...option, key: option.id })
                                                  : (zydusSelectedLabParams?.length > 0 && option.id === 18) ? ({ ...option, key: option.id })
                                                    : (option.is_custom_module === true && customModulesRxData?.find((e) => e?.module_id === option?.id)?.content?.length > 0) ?
                                                      ({ ...option, key: option.id })
                                                      : (patientBills?.length > 0 && option.id === 17) &&
                                                      ({ ...option, key: option.id })
              )}
              showHeader={false}
            />
          </SortableContext>
        </DndContext>
      )}

      {/* {printSettings?.prescription?.case_option?.map((e, i) => {
                return (
                    e?.custom_status === 'Y' && (
                        <Row key={i} justify="space-between" className="align-items-center form_addnewpatient mb-28">
                            <Col lg={10}>
                                <div className="d-flex align-items-center cursor-pointer Preview-color-icon" onClick={() => onCaseOptionChange(e, 'visible', i)}>
                                    <i className={`icon-Preview ${e.enable === 'N' && 'disable-preview'} me-2`}></i>
                                    <span>{e.title}</span>
                                </div>
                            </Col>
                            <Col lg={14}>
                                <Form.Item className="mb-0">
                                    <Radio.Group className={`d-flex gender-radio all-change-radio ${isMobile ? 'segmented-radio-mobile' : ''}`} onChange={(e) => onCaseOptionChange(e, 'radio', i)} value={e.format}>
                                        <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
                                        <Radio.Button className="w-100 text-center" value="listview">List View</Radio.Button>
                                        <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                )
            })} */}
    </div>
  );
}

export default React.memo(PrescriptionLayout);
