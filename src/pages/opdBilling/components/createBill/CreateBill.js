import { Col, Container, Navbar, Row } from "react-bootstrap";
import CommonModal from "../../../../common/CommonModal";
import {
  AutoComplete,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Input,
  Select,
  Table,
} from "antd";
import alertIcon from "./../../../../assets/images/alertIcon.svg";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import DiagnosisNotes from "../../../obstetric/components/diagnosisNotes/DiagnosisNotes";
import { removeBeforeWhiteSpace } from "../../../../utils/utils";
import ServiceItemPopup from "../serviceItemPopup/ServiceItemPopup";
import "./CreateBill.scss";
import RefIdPopup from "../refIdPopup/RefIdPopup";
import ReadMore from "../../../../common/ReadMore";
import { useNavigate } from "react-router-dom";

const CreateBill = ({
  handleCreateBillDrawer,
  patient_unique_id,
  isBackModalOpen,
  showHideBackModal,
  onSave,
}) => {
  const navigate = useNavigate();
  const [diagnosisNotesDrawer, setDiagnosisNotesDrawer] = useState(false);
  const [patientDiagnosisNotes, setPatientDiagnosisNotes] = useState("");
  const [searchCustomSelected, setSearchCustomSelected] = useState(null);
  const [shouldShowRefIdPopup, setShowRefIdPopup] = useState(-1);
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      item: "",
      qty: "",
      price: "",
      discount: "",
      gst: "",
      total: "",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const timeOutId = setTimeout(() => {
        getSearchOptions();
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      setSearchOptions([]);
    }
  }, [searchQuery]);

  const getSearchOptions = async () => {
    // const searchOptionsRes = await fetchSearchImmunisation(
    //   searchQuery,
    //   patient_data.patient_unique_id
    // );
    const searchOptionsRes = [
      {
        name: "Item A",
        id: 1,
        item: "Item A",
        qty: 2,
        price: 100,
        discount: 10,
        gst: 18,
        total: 110,
      },
      {
        name: "Item B",
        id: 2,
        item: "Item B",
        qty: "2",
        price: "100",
        discount: "10",
        gst: "18",
        total: "110",
      },
      {
        name: "Item C",
        id: 3,
        item: "Item C",
        qty: "2",
        price: "100",
        discount: "10",
        gst: "18",
        total: "110",
      },
    ];
    const data = [];
    searchOptionsRes?.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e }),
        value: e.id,
        label: <div>{e.name}</div>,
      });
    });
    searchQuery &&
      data.push({
        key: JSON.stringify({
          change: 1,
          name: searchQuery,
        }),
        value: searchQuery,
        label: (
          <>
            <div>
              {searchQuery}
              <i className="icon-Add mx-1 text-primary fs-6" />{" "}
              <a className="fw-medium text-decoration-underline text-primary">
                {" "}
                Add Custom
              </a>
            </div>
          </>
        ),
        isCustom: true,
      });
    setSearchOptions(data);
  };
  const handleInputChange = (value, key, column) => {
    const updatedData = dataSource.map((row) =>
      row.key === key ? { ...row, [column]: value } : row
    );
    setDataSource(updatedData);
  };

  const handleAddRow = () => {
    const newRow = {
      key: (dataSource.length + 1).toString(),
      item: "",
      qty: "",
      price: "",
      discount: "",
      gst: "",
      total: "",
    };
    setDataSource([...dataSource, newRow]);
  };

  const handleDeleteRow = (key) => {
    const updatedData = dataSource.filter((row) => row.key !== key);
    setDataSource(updatedData);
  };

  const onSelect = (value, option, index) => {
    const selectedData = option?.key && JSON.parse(option.key);
    if (option?.isCustom) {
      setSearchCustomSelected({ ...selectedData, isCustom: option.isCustom });
    } else if (option) {
      handleInputChange(selectedData.item, index, "item");
      handleInputChange(typeof selectedData.qty, index, "qty");
      handleInputChange(selectedData.price, index, "price");
      handleInputChange(selectedData.discount, index, "discount");
      handleInputChange(selectedData.gst, index, "gst");
      handleInputChange(selectedData.total, index, "total");
    } else {
      console.log("directly add the entry to the table");
    }
  };

  const onSearch = useCallback(
    (query) => {
      setSearchQuery(removeBeforeWhiteSpace(query));
    },
    [searchQuery]
  );

  const handleSelect = (value, key) => {
    const updatedData = dataSource.map((row) =>
      row.key === key ? { ...row, item: value } : row
    );
    setDataSource(updatedData);
  };

  const columns = [
    {
      title: "ITEMS",
      dataIndex: "item",
      width: "27%",
      render: (_, record, index) => (
        <AutoComplete
          value={record.item}
          onSearch={onSearch}
          options={searchOptions}
          onSelect={(value, option) => onSelect(value, option, index + 1)}
          className="autocomplete-custom w-100"
          defaultActiveFirstOption={true}
        >
          <Input
            placeholder="Search & add new item"
            style={{ border: "none" }}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "item")
            }
          />
        </AutoComplete>
      ),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      width: "11%",
      render: (_, record) => (
        <Input
          value={record.qty}
          onChange={(e) => handleInputChange(e.target.value, record.key, "qty")}
          bordered={false}
          style={{ textAlign: "center" }}
          type="number"
        />
      ),
    },
    {
      title: "PRICE PER UNIT",
      dataIndex: "price",
      width: "13%",
      render: (_, record) => (
        <Input
          value={record.price}
          onChange={(e) =>
            handleInputChange(e.target.value, record.key, "price")
          }
          prefix="₹"
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "DISCOUNT",
      dataIndex: "discount",
      width: "15%",
      render: (_, record) => (
        <Input
          value={record.discount}
          onChange={(e) =>
            handleInputChange(e.target.value, record.key, "discount")
          }
          prefix="₹"
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "GST (%)",
      dataIndex: "gst",
      width: "11%",
      render: (_, record) => (
        <Input
          value={record.gst}
          onChange={(e) => handleInputChange(e.target.value, record.key, "gst")}
          suffix="%"
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "total",
      width: "13%",
      render: (_, record) => (
        <Input
          value={record.total}
          onChange={(e) =>
            handleInputChange(e.target.value, record.key, "total")
          }
          prefix="₹"
          bordered={false}
          style={{ textAlign: "center" }}
          disabled={true}
        />
      ),
      onCell: () => ({
        style: {
          backgroundColor: "#FAFAFB",
        },
      }),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      width: "10%",
      render: (_, record) => (
        <Button
          className="btn btn-delete-prescription p-0"
          onClick={() => handleDeleteRow(record.key)}
        >
          <i className="icon-delete" style={{ color: "#454551" }} />
        </Button>
      ),
    },
  ];

  const [paymentModes, setPaymentModes] = useState([
    { mode: "Cash", amount: 850, refId: "" },
  ]);

  const handleModeChange = (value, index, type) => {
    const updatedModes = [...paymentModes];
    updatedModes[index][type] = value;
    setPaymentModes(updatedModes);
  };

  const handleAmountChange = (value, index) => {
    const updatedModes = [...paymentModes];
    updatedModes[index].amount = parseFloat(value) || 0;
    setPaymentModes(updatedModes);
  };

  const addPaymentMode = () => {
    setPaymentModes([...paymentModes, { mode: undefined, amount: 0 }]);
  };

  const removePaymentMode = (index) => {
    const updatedModes = paymentModes.filter((_, i) => i !== index);
    setPaymentModes(updatedModes);
  };

  const handleDrawerDiagnosisNotes = () => {
    setDiagnosisNotesDrawer(!diagnosisNotesDrawer);
  };

  return (
    <div>
      <Navbar className="headerprescription p-0">
        <Container fluid className="h-100 gx-0 w-100">
          <Row className="h-100 align-items-center w-100 justify-content-between">
            <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
              <div className="align-items-center d-flex h-100 gap-2">
                <div className="border-end h-100 text-center">
                  <div
                    onClick={handleCreateBillDrawer}
                    className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                  >
                    <i className="icon-right" />
                  </div>
                  <CommonModal
                    isModalOpen={isBackModalOpen}
                    onCancel={showHideBackModal}
                    modalWidth={500}
                    title={"You may lose your data"}
                    modalBody={
                      <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                          <div className="d-flex align-items-center">
                            <img
                              className="me-3"
                              src={alertIcon}
                              alt="Warning"
                            />
                            <span>
                              Are you sure you want to leave? <br />
                              You will permanently lose your data.
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center mt-2 justify-content-end">
                            <div
                              onClick={handleCreateBillDrawer}
                              className="me-4 text-decoration-underline btn p-0 text-main"
                            >
                              Yes Leave
                            </div>
                            <Button
                              onClick={showHideBackModal}
                              className="lh-lg btn btn-primary3 btn-41 px-4"
                            >
                              <span>No, Stay</span>
                            </Button>
                          </div>
                        </div>
                      </>
                    }
                  />
                </div>
                <span className="title-digitise-card">Create Bill</span>
              </div>
            </Col>
            <Col sm="auto" md="auto" lg="auto" className="h-100  w-auto">
              <div className="align-items-center d-flex h-100 gap-4">
                <div>
                  <Checkbox className="me-2" />
                  Add bill for Form 3C
                </div>
                <div>
                  <Checkbox className="me-2" />
                  Include in RX
                </div>
                <Button
                  type="button"
                  className="btn-41 btn px-4 ant-btn-text btn-input align-items-center d-flex"
                  onClick={handleCreateBillDrawer}
                >
                  Save & Print
                </Button>

                <Button
                  type="primary"
                  className="btn-41 btn px-4 me-2 ant-btn-text align-items-center d-flex"
                  onClick={() => navigate("/preview-bill")}
                >
                  Save & Preview
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <div className="scrollableContainer">
        <Row className="h-100 align-items-start w-100">
          <Col
            className="h-100"
            style={{
              flex: "0 0 72%",
              maxWidth: "72%",
              overflowY: "auto",
              height: "100%",
              paddingRight: 0,
            }}
          >
            <div className="d-flex flex-column h-100 gap-2 px-3 py-4">
              <div className="d-flex gap-3">
                <div>
                  <div>Patient Name & ID</div>
                  <Input
                    className="text-main"
                    style={{ width: 230 }}
                    value={"Rahul Sharma, PI202305003"}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-6]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <div>Mobile Number</div>
                  <Input
                    className="text-main"
                    style={{ width: 130 }}
                    value={"9344414944"}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-6]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <div>Bill Date</div>
                  <Input
                    className="text-main"
                    style={{ width: 125 }}
                    value={"04-12-2024"}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-6]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <div>Doctor Name</div>
                  <Input
                    className="text-main"
                    value={"Dr Ashish Kumar"}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-6]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
              </div>
              <Divider />
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey="key"
                bordered
                className="customize-table"
              />
              <Button
                type="button"
                className="btn-41 btn px-4 ant-btn-text btn-input align-items-center d-flex"
                onClick={handleAddRow}
                icon={<PlusOutlined />}
                style={{ marginTop: 16, width: "fit-content" }}
              >
                Add Another Service
              </Button>
            </div>
          </Col>
          <Col
            className="h-100 py-4"
            style={{
              flex: "0 0 28%",
              maxWidth: "28%",
              overflowY: "auto",
              height: "100%",
              backgroundColor: "rgba(241, 241, 245, 0.5)",
            }}
          >
            <div className="d-flex gap-2">
              <div>
                <div className="text-lg font-medium mb-2">
                  Paid Amount <span>*</span>
                </div>
                {paymentModes.map((payment, index) => (
                  <div key={index} className="relative">
                    {index > 0 && (
                      <div className="flex items-center gap-2 mb-2 relative">
                        <span className="text-gray-500 text-sm font-medium z-10 bg-white px-2">
                          And
                        </span>
                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                      </div>
                    )}
                    <div className="flex align-items-center gap-4 mb-3">
                      <div className="d-flex align-items-center gap-1">
                        <div
                          className="d-flex flex-column"
                          style={{
                            background: "rgba(75, 74, 213, 0.06)",
                            borderRadius: 10,
                          }}
                        >
                          <div className="d-flex">
                            <Select
                              placeholder="Select"
                              value={payment.mode}
                              onChange={(value) =>
                                handleModeChange(value, index, "mode")
                              }
                              className="payment-mode"
                              dropdownStyle={{ width: 180 }}
                              options={[
                                { value: "Cash", label: "Cash" },
                                { value: "Credit Card", label: "Credit Card" },
                                { value: "Debit Card", label: "Debit Card" },
                                { value: "UPI", label: "UPI" },
                                { value: "Cheque", label: "Cheque" },
                                {
                                  value: "Advance Deposit",
                                  label: "Advance Deposit",
                                },
                                { value: "Others", label: "Others" },
                              ]}
                            />
                            <Input
                              type="number"
                              prefix="₹"
                              value={payment.amount}
                              onChange={(e) =>
                                handleAmountChange(e.target.value, index)
                              }
                              className="w-40 payment-input"
                            />
                          </div>
                          {payment?.mode && payment.mode !== "Cash" && (
                            <span
                              className="show-more-link"
                              style={{
                                textAlign: "center",
                                borderRadius: "0 0 10px 10px",
                                height: 25,
                                cursor: "pointer",
                              }}
                              onClick={() => setShowRefIdPopup(index)}
                            >
                              {payment?.refId ?? `Add ${payment.mode} Ref ID`}
                            </span>
                          )}
                        </div>
                        {paymentModes.length > 1 && (
                          <Button
                            className="btn btn-delete-prescription p-2 d-flex align-items-center justify-content-center"
                            onClick={() => removePaymentMode(index)}
                          >
                            <i
                              className="icon-delete"
                              style={{ color: "#454551" }}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex align-items-center gap-2">
                  <button
                    className="btn d-flex align-items-center btn-text"
                    onClick={addPaymentMode}
                  >
                    <i className={`icon-Add me-1 fs-5 text-primary`} />
                    <span className="text-primary">Payment mode</span>
                  </button>
                </div>
              </div>
            </div>
            <Divider />
            <div
              className="d-flex flex-column gap-2"
              style={{ background: "white", borderRadius: 16, padding: 14 }}
            >
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>950</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Line Item Discount:</span>
                <span>-140</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Extra Discount:</span>
                <span>950</span>
              </div>
              <Divider style={{ margin: 0 }} />
              <div className="d-flex justify-content-between">
                <span style={{ fontWeight: 600 }}>Total Payable Amount:</span>
                <span style={{ fontWeight: 600 }}>950</span>
              </div>
              <Divider style={{ margin: 0 }} />
              <div className="d-flex justify-content-between">
                <span>Paid Via “Cash”:</span>
                <span>950</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Paid Via “UPI”:</span>
                <span>950</span>
              </div>
              <Divider style={{ margin: 0 }} />
              <div className="d-flex justify-content-between">
                <span>Total Amount Paid:</span>
                <span>850</span>
              </div>
            </div>

            {patientDiagnosisNotes?.length === 0 ? (
              <button
                className="btn d-flex align-items-center btn-text"
                style={{
                  color: "#4B4AD5",
                  fontWeight: "500",
                  padding: "25px 0px 40px",
                }}
                onClick={handleDrawerDiagnosisNotes}
              >
                <i className={`icon-Add me-1 fs-5`} /> Add Notes
              </button>
            ) : (
              <div
                className="d-flex justify-content-between"
                style={{ padding: "25px 0px 25px 14px" }}
              >
                <div className="d-flex gap-1">
                  <span style={{ fontWeight: "600" }}>Notes: </span>
                  <ReadMore text={patientDiagnosisNotes} textLimit={60} />
                </div>
                <div onClick={handleDrawerDiagnosisNotes}>
                  <i className="icon-Edit text-primary fs-16 cursor-pointer" />
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
      {searchCustomSelected?.isCustom && (
        <ServiceItemPopup
          onCancel={() => setSearchCustomSelected(null)}
          title={"Add New Item"}
        />
      )}
      {shouldShowRefIdPopup !== null && shouldShowRefIdPopup >= 0 && (
        <RefIdPopup
          index={shouldShowRefIdPopup}
          refId={paymentModes[shouldShowRefIdPopup]?.refId}
          showHideModal={() => setShowRefIdPopup(-1)}
          handleModeChange={handleModeChange}
        />
      )}
      {diagnosisNotesDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerDiagnosisNotes}
          open={diagnosisNotesDrawer}
          className="modalWidth-563"
          width="auto"
          push={false}
        >
          <DiagnosisNotes
            handleDrawerDiagnosisNotes={handleDrawerDiagnosisNotes}
            diagnosisNotes={patientDiagnosisNotes}
            setDiagnosisNotes={setPatientDiagnosisNotes}
            isDiagnosis={false}
          />
        </Drawer>
      )}
    </div>
  );
};

export default CreateBill;
