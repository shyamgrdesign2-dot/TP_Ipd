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

const CreateBill = ({
  handleCreateBillDrawer,
  patient_unique_id,
  isBackModalOpen,
  showHideBackModal,
  onSave,
}) => {
  const { Option } = Select;
  const [diagnosisNotesDrawer, setDiagnosisNotesDrawer] = useState(false);
  const [patientDiagnosisNotes, setPatientDiagnosisNotes] = useState("");
  const [searchCustomSelected, setSearchCustomSelected] = useState(null);
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
  const [searchOptions, setSearchOptions] = useState([
    { value: "Item A" },
    { value: "Item B" },
    { value: "Item C" },
  ]);

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
      { name: "Item A", id: 1 },
      { name: "Item B", id: 2 },
      { name: "Item C", id: 3 },
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

  const onSelect = (value, option) => {
    const key = option.key && JSON.parse(option.key);
    if (option?.isCustom) {
      setSearchCustomSelected({ ...key, isCustom: option.isCustom });
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

  const handleAddNewItem = (value, key) => {
    if (!searchOptions.some((option) => option.value === value)) {
      setSearchOptions([...searchOptions, { value }]);
    }
    handleSelect(value, key);
  };

  const columns = [
    {
      title: "ITEM",
      dataIndex: "item",
      render: (_, record) => (
        <AutoComplete
          value={record.item}
          onSearch={onSearch}
          options={searchOptions}
          onSelect={onSelect}
          className="autocomplete-custom w-100"
          defaultActiveFirstOption={true}
        >
          <Input
            placeholder="Search & add new vaccine"
            prefix={<i className="icon-search" />}
            onBlur={() => handleAddNewItem(record.item, record.key)}
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
      render: (_, record) => (
        <Input
          value={record.price}
          onChange={(e) =>
            handleInputChange(e.target.value, record.key, "price")
          }
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "DISCOUNT",
      dataIndex: "discount",
      render: (_, record) => (
        <Input
          value={record.discount}
          onChange={(e) =>
            handleInputChange(e.target.value, record.key, "discount")
          }
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "GST (%)",
      dataIndex: "gst",
      render: (_, record) => (
        <Input
          value={record.gst}
          onChange={(e) => handleInputChange(e.target.value, record.key, "gst")}
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "total",
      render: (_, record) => (
        <Input
          value={record.total}
          onChange={(e) =>
            handleInputChange(e.target.value, record.key, "total")
          }
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "ACTION",
      dataIndex: "action",
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
    { mode: "Cash", amount: 850 },
  ]);

  const handleModeChange = (value, index) => {
    const updatedModes = [...paymentModes];
    updatedModes[index].mode = value;
    setPaymentModes(updatedModes);
  };

  const handleAmountChange = (value, index) => {
    const updatedModes = [...paymentModes];
    updatedModes[index].amount = parseFloat(value) || 0;
    setPaymentModes(updatedModes);
  };

  const addPaymentMode = () => {
    setPaymentModes([...paymentModes, { mode: "", amount: 0 }]);
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
                <span>Create Bill</span>
              </div>
            </Col>
            <Col sm="auto" md="auto" lg="auto" className="h-100  w-auto">
              <div className="align-items-center d-flex h-100 gap-2">
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
                  className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
                  onClick={handleCreateBillDrawer}
                >
                  Save & Print
                </Button>

                <Button
                  type="button"
                  className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
                  onClick={handleCreateBillDrawer}
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
              flex: "0 0 75%",
              maxWidth: "75%",
              overflowY: "auto",
              height: "100%",
            }}
          >
            <div className="d-flex flex-column h-100 gap-2 px-3 py-4">
              <div className="d-flex gap-3">
                <div>
                  <div>Patient Name & ID</div>
                  <Input
                    value={"12345467676890"}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-6]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <div>Patient Name & ID</div>
                  <Input
                    value={"12345467676890"}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-6]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <div>Patient Name & ID</div>
                  <Input
                    value={"12345467676890"}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-6]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <div>Patient Name & ID</div>
                  <Input
                    value={"12345467676890"}
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
              />
              <Button
                type="primary"
                onClick={handleAddRow}
                icon={<PlusOutlined />}
                style={{ marginTop: "16px", width: 200 }}
              >
                Add Another Service
              </Button>
            </div>
          </Col>
          <Col
            className="h-100"
            style={{
              flex: "0 0 25%",
              maxWidth: "25%",
              overflowY: "auto",
              height: "100%",
            }}
          >
            <div className="d-flex h-100 gap-2">
              <div className="p-4">
                <div className="text-lg font-medium mb-2">
                  Paid Amount <span className="text-red-500">*</span>
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
                    <div className="flex items-center gap-4 mb-3">
                      <Select
                        placeholder="Select"
                        value={payment.mode}
                        onChange={(value) => handleModeChange(value, index)}
                        className="w-40"
                      >
                        <Option value="Cash">Cash</Option>
                        <Option value="Card">Credit Card</Option>
                        <Option value="Card">Debit Card</Option>
                        <Option value="UPI">UPI</Option>
                        <Option value="UPI">Cheque</Option>
                        <Option value="Net Banking">Advance Deposit</Option>
                        <Option value="Net Banking">Others</Option>
                      </Select>
                      <Input
                        type="number"
                        prefix="₹"
                        value={payment.amount}
                        onChange={(e) =>
                          handleAmountChange(e.target.value, index)
                        }
                        className="w-40"
                      />
                      {paymentModes.length > 1 && (
                        <Button
                          className="btn btn-delete-prescription p-0"
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
                ))}
                <div className="flex items-center gap-2">
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={addPaymentMode}
                    className="text-blue-600"
                  >
                    Payment mode
                  </Button>
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

            <button
              className="btn d-flex align-items-center btn-text"
              style={{
                color: "#4B4AD5",
                fontWeight: "500",
                paddingTop: "30px",
              }}
              onClick={handleDrawerDiagnosisNotes}
            >
              <i className={`icon-Add me-1 fs-5`} /> Add Notes
            </button>
          </Col>
        </Row>
      </div>
      {searchCustomSelected && (
        <ServiceItemPopup
          onCancel={() => setSearchCustomSelected(null)}
          title={"Add New Item"}
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
