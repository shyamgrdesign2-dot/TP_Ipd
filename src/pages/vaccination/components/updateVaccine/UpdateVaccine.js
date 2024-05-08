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
import { updateDueDate, updateVaccine } from "../../service.js";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const UpdateVaccine = ({
  show,
  setShow,
  brands,
  selectedVaccines,
  patientDetails,
  getVaccineDetails,
  setSelectedCards,
}) => {
  const { TextArea } = Input;
  const [changeDate, setChangeDate] = useState(false);
  const [givenDate, setGivenDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("given");
  const [dayFromToday, setDayFromToday] = useState();
  const [dueDateNote, setDueDateNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const dayFromTodayList = [
    { label: "Tomorrow", value: 1 },
    { label: "1 week", value: 7 },
    { label: "2 weeks", value: 14 },
    { label: "1 month", value: 30 },
    { label: "2 months", value: 60 },
  ];
  const [vaccineDetails, setVaccineDetails] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);

  const { state } = useLocation();
  const { patient_data } = state;

  useEffect(() => {
    if (!selectedVaccines?.[0]?.tvp_given_date) setChangeDate(true);
    setGivenDate(selectedVaccines?.[0]?.tvp_given_date ?? "");
    setDueDate(
      selectedVaccines?.[0]?.dueDate
        ? moment(selectedVaccines?.[0]?.dueDate, "D MMMM YYYY").format(
            "YYYY-MM-DD"
          )
        : ""
    );
  }, []);

  const updateVaccineDetails = async () => {
    setUpdateLoader(true);
    // Create an array of promises for each API call
    const updatePromises = selectedVaccines.map(async (vaccine) => {
      const payload = {
        patient_pid: patientDetails?.vac_pid || patient_data?.pm_pid,
        patient_uid: patientDetails?.patient_unique_id || patient_data?.pm_id,
        hospital_bid:
          patientDetails?.hm_business_id || patient_data?.hm_business_id,
        hospital_id: patientDetails?.hm_id || patient_data?.hm_id,
        vaccine_template_id: vaccine?.tvt_id,
        vaccine_name: vaccine?.tvac_name,
        vaccine_company_id:
          vaccineDetails[vaccine?.tvac_name]?.vaccine_company_id ||
          vaccine?.brandId,
        vaccine_given_date: givenDate,
        remarks:
          vaccineDetails[vaccine?.tvac_name]?.remarks || vaccine?.tvp_remarks,
      };

      return updateVaccine(payload);
    });

    // Wait for all API calls to finish
    try {
      const updateVaccineRes = await Promise.all(updatePromises);
      setUpdateLoader(false);
      console.log({ updateVaccineRes });
      setShowSuccess(true);
      getVaccineDetails();
      setTimeout(() => {
        setShow(false);
      }, 1000);
    } catch (error) {
      // Handle errors here
      console.error("Error updating vaccines:", error);
      setUpdateLoader(false); // Set loader state accordingly
    }
  };

  const closeHandler = () => {
    setChangeDate(false);
    setShow(false);
  };

  const handleDetails = (vaccineName, detail, value) => {
    setVaccineDetails((prev) => {
      if (prev[vaccineName]) prev[vaccineName][detail] = value;
      else prev[vaccineName] = { [detail]: value };
      return prev;
    });
  };

  const updateVaccineDueDate = async () => {
    setUpdateLoader(true);

    const updatePromises = selectedVaccines.map(async (vaccine) => {
      const payload = {
        patient_pid: patientDetails?.vac_pid,
        patient_uid: patientDetails?.patient_unique_id,
        vaccine_template_id: vaccine?.tvt_id,
        overriden_due_date: dueDate,
        remarks: dueDateNote,
      };

      return updateDueDate(payload);
    });

    // Wait for all API calls to finish
    try {
      const updateDueDateRes = await Promise.all(updatePromises);
      setUpdateLoader(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShow(false);
      }, 1000);
      getVaccineDetails();
    } catch (error) {
      // Handle errors here
      console.error("Error updating vaccines:", error);
      setUpdateLoader(false); // Set loader state accordingly
    }
  };

  const disabledDate = (current) => {
    return selectedDate === "given"
      ? current && current > moment().endOf("day")
      : current && current < moment().startOf("day");
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
      onCancel={closeHandler}
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
                  {selectedDate === "given" && givenDate
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
                  {selectedDate === "due" && dueDate
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
                picker="date"
                open={changeDate}
                placeholder="Select Date"
                placement="bottom"
                suffixIcon={<div></div>}
                bordered={false}
                onChange={(_, d) => {
                  if (selectedDate === "given") {
                    setGivenDate(d);
                  } else setDueDate(d);
                  setChangeDate(false);
                }}
                value={
                  selectedDate === "given" && givenDate
                    ? dayjs(givenDate, "YYYY-MM-DD")
                    : selectedDate === "due" && dueDate
                    ? dayjs(dueDate, "YYYY-MM-DD")
                    : ""
                }
                format="YYYY-MM-DD"
                style={{ border: "none" }}
                dropdownClassName="custom-picker-dropdown"
                disabledDate={disabledDate}
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
                      {vaccine?.tvac_name}
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
                      options={brands?.map((brand) => ({
                        label: brand?.tvc_name,
                        value: brand?.tvc_id,
                      }))}
                      dropdownStyle={{ maxHeight: "176px", overflow: "auto" }}
                      onChange={(value) => {
                        handleDetails(
                          vaccine?.tvac_name,
                          "vaccine_company_id",
                          value
                        );
                      }}
                      defaultValue={vaccine?.brandId ?? ""}
                    />
                    <label>Note</label>
                    <TextArea
                      onChange={(e) =>
                        handleDetails(
                          vaccine?.tvac_name,
                          "remarks",
                          e.target.value
                        )
                      }
                      placeholder="Add additional details"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      width={200}
                      defaultValue={vaccine?.tvp_remarks ?? ""}
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
                      const newDueDate = moment()
                        .add(value, "days")
                        .format("YYYY-MM-DD");
                      setDueDate(newDueDate);
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
                onClick={() => {
                  if (selectedDate === "given") updateVaccineDetails();
                  else updateVaccineDueDate();
                  setSelectedCards([]);
                }}
                loading={updateLoader}
              >
                Update Vaccine
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
    </Modal>
  );
};

export default memo(UpdateVaccine);
