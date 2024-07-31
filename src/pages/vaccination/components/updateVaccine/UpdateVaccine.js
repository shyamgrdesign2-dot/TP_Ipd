/* eslint-disable react-hooks/exhaustive-deps */
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
import { useEffect, useState, memo, useRef } from "react";
import "./updateVaccine.scss";
import moment from "moment";
import SuccessPopup from "../SuccessPopup.js";
import { updateDueDate, updateVaccine } from "../../service.js";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { errorMessage } from "../../../../utils/utils.js";
import {
  addDueVaccines,
  addGivenVaccines,
} from "../../../../redux/vaccineSlice.js";
import { useDispatch, useSelector } from "react-redux";

const UpdateVaccine = ({
  show,
  setShow,
  brands,
  selectedVaccines,
  patientDetails,
  getVaccineDetails,
  setSelectedCards,
  setSelectAll,
  setCardClicked,
  setLoading,
}) => {
  console.log({ patientDetails });
  const dispatch = useDispatch();
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
  const [focusedIndexes, setFocusedIndexes] = useState([]);
  const [isOpen, setIsOpen] = useState(
    Array(selectedVaccines?.length).fill(false)
  );
  const selectRefs = useRef([]);
  const { state } = useLocation();
  const { patient_data } = state;
  const formRef = useRef(null);
  const { profile } = useSelector((state) => state.doctors);
  console.log({ profile });

  const handleFocus = (index, isFocused = false) => {
    setIsOpen((prev) => {
      const newState = [...prev];
      newState[index] = isFocused;
      return newState;
    });
  };

  const scrollToIndex = (index) => {
    const element = selectRefs.current[index];
    if (element) {
      element.scrollTo({ behavior: "smooth", block: "center" });
      element.focus();
      handleFocus(index, true);
    }
  };

  useEffect(() => {
    setGivenDate(
      selectedVaccines?.[0]?.tvp_given_date ?? moment().format("YYYY-MM-DD")
    );
    if (selectedVaccines?.[0]?.tvd_due_date) {
      setDueDate(
        moment(selectedVaccines?.[0]?.tvd_due_date).format("YYYY-MM-DD")
      );
    } else if (selectedVaccines?.[0]?.dueDate) {
      setDueDate(
        moment(selectedVaccines?.[0]?.dueDate, "D MMMM YYYY").format(
          "YYYY-MM-DD"
        )
      );
    }
  }, []);

  const updateVaccineDetails = async () => {
    setCardClicked(false);
    const newFocusedIndexes = [];
    selectRefs.current.forEach((ref, index) => {
      if (
        !vaccineDetails?.[selectedVaccines?.[index]?.tvac_name]
          ?.vaccine_company_id &&
        !selectedVaccines?.[index]?.brandId
      ) {
        if (ref) {
          ref.focus();
        }
        newFocusedIndexes.push(index);
      }
    });

    if (newFocusedIndexes?.length) {
      scrollToIndex(newFocusedIndexes[0]);
      setFocusedIndexes(newFocusedIndexes);
      return;
    }
    setUpdateLoader(true);
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
          (vaccineDetails[vaccine?.tvac_name]?.remarks ||
            vaccine?.tvp_remarks) ??
          "",
      };

      const result = updateVaccine(payload);
      const resultStatus = await result;
      if (resultStatus?.status === 201) {
        window.Moengage.track_event("TP_vaccination_updated", {
          doctor_id: profile?.doctor_unique_id,
          patient_number: patientDetails?.vac_contact_no,
          patient_id: patientDetails?.patient_unique_id,
        });
        dispatch(addGivenVaccines({ payload, vaccine }));
      }
      return result;
    });

    try {
      const updateVaccineRes = await Promise.all(updatePromises);
      setLoading(true);
      setUpdateLoader(false);
      if (updateVaccineRes?.every((res) => res?.status === 201)) {
        setShowSuccess(true);
        getVaccineDetails(true);
        setTimeout(() => {
          setShow(false);
          setSelectedCards([]);
          setSelectAll(false);
        }, 1000);
      } else {
        errorMessage({ name: "TypeError" });
      }
    } catch (error) {
      // Handle errors here
      errorMessage({ name: "TypeError" });
      console.error("Error updating vaccines:", error);
      setUpdateLoader(false); // Set loader state accordingly
    }
  };

  const closeHandler = () => {
    setCardClicked(false);
    setSelectedCards([]);
    setSelectAll(false);
    setChangeDate(false);
    setShow(false);
  };

  const handleDetails = (vaccineName, detail, value, index) => {
    setVaccineDetails((prev) => {
      if (prev[vaccineName]) prev[vaccineName][detail] = value;
      else prev[vaccineName] = { [detail]: value };
      return prev;
    });
    handleFocus(index);
  };

  const updateVaccineDueDate = async () => {
    setUpdateLoader(true);
    setCardClicked(false);
    const updatePromises = selectedVaccines.map(async (vaccine) => {
      const payload = {
        patient_pid: patientDetails?.vac_pid,
        patient_uid: patientDetails?.patient_unique_id,
        vaccine_template_id: vaccine?.tvt_id,
        overriden_due_date: dueDate,
        remarks: dueDateNote,
      };
      const result = updateDueDate(payload);
      const resultStatus = await result;
      if (resultStatus?.status === 200) {
        window.Moengage.track_event("TP_vaccination_updated", {
          doctor_id: profile?.doctor_unique_id,
          patient_number: patientDetails?.vac_contact_no,
          patient_id: patientDetails?.patient_unique_id,
        });
        dispatch(addDueVaccines({ payload, vaccine }));
      }
      return result;
    });

    // Wait for all API calls to finish
    try {
      const updateDueDateRes = await Promise.all(updatePromises);
      setUpdateLoader(false);
      setLoading(true);
      if (updateDueDateRes?.every((res) => res?.status === 200)) {
        setShowSuccess(true);
        getVaccineDetails(true);
        setTimeout(() => {
          setShow(false);
          setSelectedCards([]);
          setSelectAll(false);
        }, 1000);
      } else {
        errorMessage({ name: "TypeError" });
      }
    } catch (error) {
      // Handle errors here
      errorMessage({ name: "TypeError" });
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
            ref={formRef}
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
                      showSearch
                      placeholder="Select vaccine brand"
                      className="custom-select-style"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          ?.toLowerCase()
                          .includes(input?.toLowerCase())
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={brands
                        ?.filter((brand) =>
                          vaccine?.tvac_name === "Influenza"
                            ? brand?.tvc_default_vac === "Influenza-1"
                            : brand?.tvc_default_vac === vaccine?.tvac_name
                        )
                        ?.map((brand) => ({
                          label: brand?.tvc_name,
                          value: brand?.tvc_id,
                        }))}
                      dropdownStyle={{ maxHeight: "176px", overflow: "auto" }}
                      onChange={(value) => {
                        handleDetails(
                          vaccine?.tvac_name,
                          "vaccine_company_id",
                          value,
                          i
                        );
                      }}
                      defaultValue={vaccine?.brandId}
                      ref={(ref) => {
                        if (ref) selectRefs.current[i] = ref;
                      }}
                      open={isOpen[i]}
                      onFocus={() => handleFocus(i, true)}
                      onBlur={() => handleFocus(i)}
                      style={{
                        border: focusedIndexes.includes(i)
                          ? "1px solid blue"
                          : "none",
                        borderRadius: focusedIndexes.includes(i)
                          ? "10px"
                          : "none",
                      }}
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
                  height: "41px",
                }}
                disabled={false}
                type="primary"
                onClick={() => {
                  if (selectedDate === "given") updateVaccineDetails();
                  else updateVaccineDueDate();
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
