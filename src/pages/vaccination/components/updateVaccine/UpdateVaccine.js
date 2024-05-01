import {
  Modal,
  Radio,
  DatePicker,
  Select,
  Button,
  Input,
  Row,
  Col,
  Flex,
  Divider,
  Space,
} from "antd";
import { useEffect, useState, memo } from "react";
import "./updateVaccine.scss";
import moment from "moment";
import SuccessPopup from "../SuccessPopup.js";

const UpdateVaccine = ({ show, setShow }) => {
  const { TextArea } = Input;
  const [changeDate, setChangeDate] = useState(true);
  const [givenDate, setGivenDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("given");
  const [dayFromToday, setDayFromToday] = useState();
  const [dueDateNote, setDueDateNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const selectedVaccines = [{ name: "BCG" }, { name: "XYZ" }, { name: "hdj" }];
  const dayFromTodayList = [
    { label: "Tomorrow", value: 1 },
    { label: "1 week", value: 2 },
    { label: "2 weeks", value: 3 },
    { label: "1 month", value: 4 },
    { label: "2 months", value: 5 },
  ];
  const brands = [
    {
      value: "1",
      label: "Zydus",
    },
    {
      value: "2",
      label: "Aristo",
    },
    {
      value: "3",
      label: "Aristo",
    },
    {
      value: "4",
      label: "Aristo",
    },
    {
      value: "5",
      label: "Aristo",
    },
    {
      value: "6",
      label: "Aristo",
    },
    {
      value: "7",
      label: "Aristo",
    },
    {
      value: "8",
      label: "Aristo",
    },
  ];

  useEffect(() => {
    getVaccineBrands();
  }, []);

  const getVaccineBrands = async () => {};

  const updateVaccine = async () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShow(false);
    }, 1000);
  };

  return (
    <Modal
      title={
        <div>
          <div>Update Details</div>
          <hr style={{ borderTop: "1px solid #ccc", margin: "10px 0" }} />
        </div>
      }
      centered
      open={show}
      width={936}
      footer={null}
      onCancel={() => setShow(false)}
    >
      <Row gutter={[16, 16]} style={{ height: "655px", marginTop: "20px" }}>
        <Col
          span={12}
          className="d-flex flex-column gap-3"
          style={{ width: "414px" }}
        >
          <label>Add Date</label>
          <div>
            <div
              className={`d-flex justify-content-between align-items-center p-2 border rounded-top border-purple ${
                selectedDate === "given"
                  ? "border-primary bg-custom-purple"
                  : ""
              }`}
              onClick={() => {
                !givenDate && setChangeDate(true);
              }}
              style={{ height: "86px" }}
            >
              <Radio
                checked={selectedDate === "given"}
                onClick={() => setSelectedDate("given")}
              >
                Given Date
                <div style={{ opacity: 0.5 }}>
                  {givenDate && !changeDate
                    ? moment(givenDate).format("D MMMM YYYY")
                    : "Date the vaccination is given"}
                </div>
              </Radio>
              {selectedDate === "given" && givenDate && !changeDate && (
                <Button type="link" onClick={() => setChangeDate(!changeDate)}>
                  Change
                </Button>
              )}
            </div>
            <div
              className={`d-flex justify-content-between align-items-center p-2 border rounded-bottom ${
                selectedDate === "due" ? "border-primary bg-custom-purple" : ""
              }`}
              onClick={() => {
                !dueDate && setChangeDate(true);
              }}
              style={{ height: "86px" }}
            >
              <Radio
                checked={selectedDate === "due"}
                onClick={() => setSelectedDate("due")}
              >
                Due Date
                <div style={{ opacity: 0.5 }}>
                  {dueDate && !changeDate
                    ? moment(dueDate).format("D MMMM YYYY")
                    : "Date on which vaccination will be given"}
                </div>
              </Radio>
              {selectedDate === "due" && dueDate && !changeDate && (
                <Button
                  type="link"
                  style={{ color: "#4B4AD5" }}
                  onClick={() => setChangeDate(!changeDate)}
                >
                  Change
                </Button>
              )}
            </div>
          </div>
          {changeDate && (
            <div className="d-flex">
              <DatePicker
                open={changeDate}
                placeholder="Select Date"
                placement="bottom"
                suffixIcon={<div></div>}
                bordered={false}
                onChange={(_, d) => {
                  if (selectedDate === "given") setGivenDate(d);
                  else setDueDate(d);
                  setChangeDate(false);
                }}
                format="YYYY-MM-DD"
                value={""}
                style={{ border: "none" }}
              />
            </div>
          )}
        </Col>
        <Divider
          type="vertical"
          style={{ height: "100%", marginLeft: "20px", marginRight: "15px" }}
        />

        <Col span={11} style={{ width: "414px" }}>
          <div
            className="d-flex flex-column gap-3"
            style={{ maxHeight: "650px", overflowY: "auto" }}
          >
            {selectedDate === "given" ? (
              <>
                {selectedVaccines?.map((vaccine, i) => (
                  <>
                    <label>
                      {vaccine?.name}
                      <div style={{ opacity: 0.5 }}>{`(Selected vaccine ${
                        i + 1
                      })`}</div>
                    </label>
                    <Select
                      placeholder="Select vaccine brand"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={brands}
                      dropdownStyle={{ maxHeight: "176px", overflow: "auto" }}
                    />
                    <label>Note</label>
                    <TextArea
                      onChange={(e) => {}}
                      placeholder="Add additional details"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      width={200}
                    />
                    <Divider dashed style={{ width: "100%" }} />
                  </>
                ))}
              </>
            ) : (
              <>
                <label>Day from today</label>
                <Flex
                  vertical
                  style={{
                    width: "100%",
                  }}
                >
                  <Radio.Group
                    onChange={({ target: { value } }) => {
                      setDayFromToday(value);
                    }}
                    value={dayFromToday}
                  >
                    <Space direction="vertical">
                      {dayFromTodayList.map(({ label, value }) => (
                        <Radio value={value} key={value}>
                          {label}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Flex>

                <label>Note</label>
                <TextArea
                  value={dueDateNote}
                  onChange={({ target: { value } }) => {
                    setDueDateNote(value);
                  }}
                  placeholder="Add additional details"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  width={200}
                />
              </>
            )}
            <div className="d-flex justify-content-end">
              <Button
                style={{
                  width: "145px",
                  height: "41px",
                }}
                disabled={false}
                type="primary"
                onClick={updateVaccine}
              >
                Update Vaccine
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <SuccessPopup show={showSuccess} />
    </Modal>
  );
};

export default memo(UpdateVaccine);
