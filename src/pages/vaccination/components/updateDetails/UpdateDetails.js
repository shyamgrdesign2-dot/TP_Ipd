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
import "./updateDetails.scss";
import moment from "moment";
import SuccessPopup from "../SuccessPopup.js";

const UpdateDetails = ({ vaccines = [], givenD, dueD }) => {
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

  useEffect(() => {
    getVaccineBrands();
  }, []);

  const getVaccineBrands = async () => {};

  const updateVaccine = async () => {
    setShowSuccess(true);
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
      open={true}
      width={936}
      footer={null}
    >
      <Row gutter={[16, 16]} style={{ height: "655px" }}>
        <Col span={12} className="d-flex flex-column gap-3">
          <label>Add Date</label>
          <div className="border rounded">
            <div
              className={`d-flex justify-content-between p-2 ${
                selectedDate === "given"
                  ? "border border-primary bg-custom-purple"
                  : ""
              }`}
              onClick={() => {
                !givenDate && setChangeDate(true);
              }}
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
                <Button
                  type="link"
                  style={{ color: "#4B4AD5" }}
                  onClick={() => setChangeDate(!changeDate)}
                >
                  Change
                </Button>
              )}
            </div>
            <div
              className={`d-flex justify-content-between p-2 ${
                selectedDate === "due"
                  ? "border border-primary bg-custom-purple"
                  : ""
              }`}
              onClick={() => {
                !dueDate && setChangeDate(true);
              }}
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
              />
            </div>
          )}
        </Col>
        <Divider type="vertical" style={{ height: "100%" }} />

        <Col span={11}>
          {selectedDate === "given" ? (
            <div style={{ maxHeight: "605px", overflowY: "auto" }}>
              {selectedVaccines?.map((vaccine, i) => (
                <div className="d-flex flex-column gap-3">
                  <label>
                    {vaccine?.name}
                    <div style={{ opacity: 0.5 }}>{`(Selected vaccine ${
                      i + 1
                    })`}</div>
                  </label>
                  <Select
                    showSearch
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
                    options={[
                      {
                        value: "1",
                        label: "Zydus",
                      },
                      {
                        value: "2",
                        label: "Aristo",
                      },
                    ]}
                  />
                  <label>Note</label>
                  <TextArea
                    value={""}
                    onChange={(e) => {}}
                    placeholder="Add additional details"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    width={200}
                  />
                  <Divider dashed style={{ width: "100%" }} />
                </div>
              ))}
              <div className="d-flex justify-content-end">
                <Button disabled={false} type="primary">
                  Update Vaccine
                </Button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
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
              <div className="d-flex justify-content-end">
                <Button disabled={false} type="primary" onClick={updateVaccine}>
                  Update Vaccine
                </Button>
              </div>
            </div>
          )}
        </Col>
      </Row>
      <SuccessPopup show={showSuccess} />
    </Modal>
  );
};

export default memo(UpdateDetails);
