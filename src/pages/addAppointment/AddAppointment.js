import React, { useState, useEffect, useCallback, useMemo } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, message, Tooltip } from "antd";

import ConfirmAppointment from "./components/ConfirmAppointment";
import { addAppointment, getSlotsList } from "./service";
import { errorMessage, getTokenData } from "../../utils/utils";
import Form from "react-bootstrap/Form";
import { DatePicker, Tabs, Select } from "antd";
import tutorial from "../../assets/images/tutorial-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import "./addAppointment.scss";
import { listDoctor } from "../../redux/bulkMessagesSlice";
import { getDecodedToken, useLocalStorage } from "../../utils/localStorage";
import greenRightIcon from "../../assets/images/green-rounded-check.svg";
import visitEnd from '../../assets/images/end-visit.svg';
import imgCloseVisit from '../../assets/images/close-visit.svg';
import profileCircle from "../../assets/images/profile-circle.svg";
import { DownOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { MESSAGE_KEY, PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../utils/constants";
import { isChrome, isSafari } from "react-device-detect";
import config from "../../config";
import axios from "axios";

const TIME_SECTIONS = {
  MIDNIGHT: { start: "00:00", end: "03:00", label: "Midnight" },
  LATE_NIGHT: { start: "03:00", end: "05:00", label: "Late Night" },
  MORNING: { start: "05:00", end: "12:00", label: "Morning" },
  AFTERNOON: { start: "12:00", end: "17:00", label: "Afternoon" },
  EVENING: { start: "17:00", end: "21:00", label: "Evening" },
  NIGHT: { start: "21:00", end: "24:00", label: "Night" },
};

const getTimeSection = (time) => {
  const hour = dayjs(time, "HH:mm:ss").hour();

  if (hour >= 0 && hour < 3) return "MIDNIGHT";
  if (hour >= 3 && hour < 5) return "LATE_NIGHT";
  if (hour >= 5 && hour < 12) return "MORNING";
  if (hour >= 12 && hour < 17) return "AFTERNOON";
  if (hour >= 17 && hour < 21) return "EVENING";
  if (hour >= 21 && hour <= 23) return "NIGHT";

  return "MORNING"; // default fallback
};

const generateTimeSlots = (slotsData) => {
  let allTimeSlots = {
    MIDNIGHT: [],
    LATE_NIGHT: [],
    MORNING: [],
    AFTERNOON: [],
    EVENING: [],
    NIGHT: [],
  };

  slotsData.forEach((slot) => {
    // Just add type property to distinguish in UI
    const timeSlot = {
      ...slot,
    };

    // Add the slot to appropriate section
    const section = getTimeSection(slot.start);
    allTimeSlots[section].push(timeSlot);
  });

  // Sort slots within each section
  Object.keys(allTimeSlots).forEach((section) => {
    allTimeSlots[section].sort((a, b) => {
      return dayjs(a.start, "HH:mm:ss").diff(dayjs(b.start, "HH:mm:ss"));
    });
  });

  return allTimeSlots;
};

const { TabPane } = Tabs;

const TimeSlotContainer = ({
  slots,
  selectedTimeSlot,
  setSelectedTimeSlot,
  isLoading,
  handleConfirmAppointment,
  editTime,
  isSlotInPast,
  selectedDoctorOption,
}) => {
  if (isLoading) {
    return <div className="slots-info">Loading slots...</div>;
  }

  const renderSlotsCount = (slots) => {
    if (!slots || slots.length === 0) return "No slots available";

    // Count available slots (excluding confirmed and leave slots)
    const availableCount = slots.filter(
      (slot) => slot.status === "available"
    ).length;

    // Get time range
    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];
    const startTime = dayjs(firstSlot.start, "HH:mm:ss").format("hh:mm A");
    const endTime = dayjs(lastSlot.end, "HH:mm:ss").format("hh:mm A");

    return `${availableCount} Slots Available (${startTime} to ${endTime})`;
  };

  const getTooltipContent = (slot) => {
    switch (slot.status) {
      case "confirmed":
        return (
          <div className="appointment-tooltip">
            <h4>Appointment Details({slot.appointments.length})</h4>
            {slot.appointments.map((appointment, index) => (
              <div key={index}>
                <div className="patient-info">
                  <i className="icon-profile" /> {appointment.pm_full_name} (
                  {appointment.pm_gender.charAt(0)}, {appointment.ageYears}y)
                  <i className="icon-phone" /> {appointment.pm_contact_no}
                </div>
                {index !== slot.appointments.length - 1 && (
                  <div className="divider"></div>
                )}
              </div>
            ))}
            <div className="time-info">
              <div>Today,{dayjs(slot.start, "HH:mm:ss").format("hh:mm A")}</div>
              <div>
                {dayjs(slot.appointments[0].pam_app_date).format(
                  "DD MMM, YYYY"
                )}{" "}
                with {selectedDoctorOption?.label}
              </div>
            </div>
          </div>
        );
      case "unavailable":
        return (
          <div className="no-availability-tooltip">
            <h4>No Availability Set</h4>
            <div>
              You haven't scheduled any slots during this time interval. Update
              your Availability Settings to enable booking in this period.
            </div>
          </div>
        );
      case "leave":
        return (
          <div className="leave-tooltip">
            <h4>On Leave</h4>
            <div>
              Whatever remarks that doctor writes in the PHP will be shown here.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="slots-info">{renderSlotsCount(slots)}</div>
      {editTime && (
        <div className="slot-instruction-info">{"Select new time slot"}</div>
      )}
      <div className="slots-container">
        {slots?.map((slot, index) => {
          const isPast = isSlotInPast(slot.start);
          const slotStatus = slot.status;

          const slotContent = (
            <div
              className={`slot ${slotStatus} ${isPast ? "past" : ""}`}
              onClick={() => {
                if (slot.status === "available" && !isPast) {
                  handleConfirmAppointment();
                  setSelectedTimeSlot(slot);
                }
              }}
            >
              {slot.status === "confirmed" && <img src={greenRightIcon} />}
              <div>
                {slot.status === "unavailable" || slot.status === "leave" ? (
                  <>
                    {dayjs(slot.start, "HH:mm:ss").format("hh:mm A")} -{" "}
                    {dayjs(slot.end, "HH:mm:ss").format("hh:mm A")}
                  </>
                ) : (
                  dayjs(slot.start, "HH:mm:ss").format("hh:mm A")
                )}
              </div>
            </div>
          );

          return slot.status === "available" && isPast ? (
            slotContent
          ) : (
            <Tooltip
              key={index}
              title={getTooltipContent(slot)}
              overlayClassName="slot-tooltip"
              placement="top"
            >
              {slotContent}
            </Tooltip>
          );
        })}
      </div>
    </>
  );
};

function AddAppointment() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dateChips, setDateChips] = useState([]);
  const [chipStartDate, setChipStartDate] = useState(dayjs());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const { doctorList } = useSelector((state) => state.bulkMessages);
  const dispatch = useDispatch();
  // const [doctors, setDoctors] = useState(doctorList);
  const [displayMonth, setDisplayMonth] = useState(dayjs());
  const [timeSlots, setTimeSlots] = useState({});
  const [tokenData, setTokenData] = useState(null);
  const { profile } = useSelector((state) => state.doctors);
  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );
  const decodedToken = getDecodedToken();
  const isAdmin = decodedToken?.result?.admin;
  const [selectedDoctor, setSelectedDoctor] = useState(
    decodedToken?.result?.user_id
  );

  // Add loading state
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Add this function to determine current time section
  const getCurrentTimeSection = () => {
    const currentHour = dayjs().hour();

    if (currentHour >= 0 && currentHour < 3) return "MIDNIGHT";
    if (currentHour >= 3 && currentHour < 5) return "LATE_NIGHT";
    if (currentHour >= 5 && currentHour < 12) return "MORNING";
    if (currentHour >= 12 && currentHour < 17) return "AFTERNOON";
    if (currentHour >= 17 && currentHour < 21) return "EVENING";
    if (currentHour >= 21 && currentHour <= 23) return "NIGHT";

    return "MORNING"; // default fallback
  };

  // Add state for active tab
  const [activeTab, setActiveTab] = useState(getCurrentTimeSection());

  // Function to check if a slot is in the past
  const isSlotInPast = (slotTime) => {
    if (dayjs(selectedDate).isBefore(dayjs(), "day")) return true;
    if (dayjs(selectedDate).isAfter(dayjs(), "day")) return false;

    // For today, compare times
    const currentTime = dayjs();
    const slotDateTime = dayjs(selectedDate)
      .hour(parseInt(slotTime.split(":")[0]))
      .minute(parseInt(slotTime.split(":")[1]));

    return slotDateTime.isBefore(currentTime);
  };

  useEffect(() => {
    // Initialize chips with today's date
    setDateChips(generateDateChips(dayjs()));
  }, []);

  useEffect(() => {
    // Update display month based on whether selected date is in current chip range
    if (dateChips.length > 0) {
      if (isDateInChipRange(selectedDate)) {
        setDisplayMonth(selectedDate);
      } else {
        setDisplayMonth(dateChips[0]); // Show first chip's month
      }
    }
  }, [selectedDate, dateChips]);

  const generateDateChips = (startDate) => {
    const chips = [];
    for (let i = 0; i < 10; i++) {
      chips.push(startDate.add(i, "day"));
    }
    return chips;
  };

  const isDateInChipRange = (date) => {
    // Ensure we're working with dayjs objects
    const selectedDateStr = dayjs(date).format("YYYY-MM-DD");
    const firstDateStr = dateChips[0].format("YYYY-MM-DD");
    const lastDateStr = dateChips[dateChips.length - 1].format("YYYY-MM-DD");

    return selectedDateStr >= firstDateStr && selectedDateStr <= lastDateStr;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!isDateInChipRange(date)) {
      setChipStartDate(date);
      const newChips = generateDateChips(date);
      setDateChips(newChips);
    }
    setDisplayMonth(date);
  };

  const handleNavigateChips = (direction) => {
    const newStartDate =
      direction === "left"
        ? chipStartDate.subtract(10, "day")
        : chipStartDate.add(10, "day");
    setChipStartDate(newStartDate);
    const newChips = generateDateChips(newStartDate);
    setDateChips(newChips);

    // Always update display month to first chip's month if selected date not in range
    if (!isDateInChipRange(selectedDate)) {
      setDisplayMonth(newChips[0]);
    }
  };

  const handleChipClick = (date) => {
    setSelectedDate(date);
    setDisplayMonth(date);
  };

  useEffect(() => {
    dispatch(listDoctor());
  }, []);

  useEffect(() => {
    // Fetch slots when doctor or date changes
    const fetchSlots = async () => {
      if (selectedDoctor || (profile?.um_name && selectedDate)) {
        setIsLoadingSlots(true);
        const token = await getToken();
        try {
          var decoded = jwtDecode(token);
          setTokenData(decoded.result);
          const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
          const response = await getSlotsList(
            selectedDoctor || decoded.result?.user_id,
            formattedDate
          );

          if (response?.status) {
            const generatedSlots = generateTimeSlots(response.slots || []);
            setTimeSlots(generatedSlots);
          } else {
            errorMessage(response?.message || "Failed to fetch slots");
            setTimeSlots({
              MIDNIGHT: [],
              LATE_NIGHT: [],
              MORNING: [],
              AFTERNOON: [],
              EVENING: [],
              NIGHT: [],
            });
          }
        } catch (error) {
          errorMessage("Error fetching slots");
          console.error("Error fetching slots:", error);
        } finally {
          setIsLoadingSlots(false);
        }
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  // Make sure doctorList is properly mapped to doctorOptions
  const doctorOptions = doctorList?.map((doctor) => ({
    value: String(doctor.um_id), // Ensure this matches the type of selectedDoctor
    label: doctor.um_name,
  }));

  // Find the selected doctor's label with additional type checking
  const selectedDoctorOption = doctorOptions?.find(
    (doctor) =>
      doctor?.value === (selectedDoctor ? String(selectedDoctor) : null)
  );

  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
  };

  const { state } = useLocation();
  const { patient_data } = state != null && state;

  const [confirmAppointment, setConfirmAppointment] = useState(false);

  const [editDoctor, setEditDoctor] = useState(false);
  const [editTime, setEditTime] = useState(false);
  const [clickedPatient, setClickedPatient] = useState(null);
  const [selectedCashType, setSelectedCashType] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [remarks, setRemarks] = useState("");

  // Add a new state to store the complete slot details
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);

  useEffect(() => {
    if (patient_data) {
      setClickedPatient(patient_data);
      handleConfirmAppointment();
    }
  }, [patient_data]);

  const handleConfirmAppointment = useCallback(
    (flag) => {
      if (flag == "edit_doctor") {
        setEditDoctor(true);
      } else if (flag == "edit_time") {
        setEditTime(true);
      } else {
        setEditTime(false);
      }
      setConfirmAppointment(!confirmAppointment);
    },
    [confirmAppointment, editDoctor, editTime]
  );

  const validation = () => !(clickedPatient && selectedCashType);

  // Update your time slot selection handler
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
    setSelectedSlotDetails(slot); // Store the complete slot object
  };

  const onBookAppointmentPress = async () => {
    let sendData = {
      doctor_id: selectedDoctor,
      patient_unique_id: clickedPatient?.patient_unique_id,
      pm_pid: clickedPatient?.pm_pid,
      appointment_date: dayjs(selectedDate).format("YYYY-MM-DD"),
      appointment_start_time: dayjs(
        selectedSlotDetails.start,
        "HH:mm:ss"
      ).format("HH:mm"),
      appointment_end_time: dayjs(selectedSlotDetails.end, "HH:mm:ss").format(
        "HH:mm"
      ),
      appointment_duration: selectedSlotDetails?.availability?.increment || 5,
      category_id: selectedCategories ? selectedCategories : "",
      toct_id: selectedCashType,
      appointment_remark: remarks,
    };

    const response = await addAppointment(sendData);
    if (response?.status) {
      // Close the drawer
      setConfirmAppointment(false);

      message.open({
        key: MESSAGE_KEY,
        type: "",
        className: "message-appointment",
        content: (
          <div className="d-flex align-items-center">
            <img src={visitEnd} className="me-3" />
            <div>
              <div className="title-common text-start fontroboto">{`${clickedPatient?.pm_first_name}’s appointment booked successfully!`}</div>
            </div>
            <img
              src={imgCloseVisit}
              className="ms-3"
              onClick={() => message.destroy()}
            />
          </div>
        ),
        duration: 5,
      });

      // Reset form states
      setSelectedTimeSlot(null);
      setSelectedSlotDetails(null);
      setSelectedCategories(null);
      setSelectedCashType(null);
      setRemarks("");
      setClickedPatient(null);

      // Refresh the slots data for the selected date
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const slotsResponse = await getSlotsList(selectedDoctor, formattedDate);
      if (slotsResponse?.status) {
        const generatedSlots = generateTimeSlots(slotsResponse.slots || []);
        setTimeSlots(generatedSlots);
      }
    } else {
      errorMessage(response?.message);
    }
  };

  async function SSO_TO_PM(flag) {
    try {
      const tokenData = decodedToken?.result;

      var sendData = {
        doctor_unique_id: tokenData.doctor_unique_id,
      };

      var URL;

      if (flag === 1) {
        sendData["mobile_no"] = tokenData.mobile_no;
        sendData["clinic_id"] = tokenData.clinic_id;
        sendData["hm_business_id"] = tokenData.hospital_business_id;
        sendData["from"] = "app";
        URL = config.sso_to_pm_url;
      } else if (flag === 2) {
        sendData["hospital_business_id"] = tokenData.hospital_business_id;
        URL = config.sso_to_pm_admin_url;
      }

      const formData = new FormData();
      Object.keys(sendData).forEach((key) => {
        formData.append(key, sendData[key]);
      });

      const response = await axios.post(URL, formData, {
        auth: {
          username: config.sso_to_pm_username,
          password: config.sso_to_pm_password,
        },
      });

      return response.data;
    } catch (err) {
      console.error(err.message);
    }
  }

  const myAvailability = async () => {
    SSO_TO_PM(1).then(async (data) => {
      if (data.success == 200) {
        if (!isChrome && !isSafari) {
          navigate(`/?url=${data.url}&module=my_availability&key=phpRedirect`, {
            replace: true,
          });
          navigate(0, { replace: true });
        } else {
          await window.open(`${data.url}&module=my_availability`);
        }
      }
    });
  };

  return (
    <>
      <div className="welcomesection position-relative">
        <div className="bg-welcome d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div
              onClick={() => navigate(-1)}
              className="lh-1 me-1 px-2 text-dark cursor-pointer"
            >
              <i className="fs-3 icon-right"></i>
            </div>
            <div>
              <h1>Select an Appointment Slot</h1>
            </div>
          </div>
          <div className="d-flex gap-1">
            <div className="d-lg-flex d-block">
              <button className="btn d-flex align-items-center btn-text mx-3 tutorial p-0">
                <span className="text-decoration-none rounded-5 pe-3 bg-white shadow2">
                  <img height={42} src={tutorial} />
                  Tutorial
                </span>
              </button>

              <Button
                variant="primary"
                onClick={myAvailability}
                className="px-3 btn-41 d-flex align-items-center rounded-10px"
              >
                <i className="icon-calendar me-2"></i>
                {"Availability Settings"}
              </Button>
            </div>
          </div>
        </div>
        <div className="pb-5">&nbsp;</div>
      </div>
      <div className={`border rounded-4 appointment-wrap p-4`}>
        <div className="d-flex align-items-center justify-content-between">
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="MMMM, YYYY"
            picker="date"
            inputReadOnly
            allowClear={false}
            defaultPickerValue={displayMonth}
            suffixIcon={
              <i className="icon-right d-block text-main fs-5 suffix-icon-down"></i>
            }
            style={{ width: "165px" }}
            onClick={(e) => {
              const input = e.target.closest(".ant-picker");
              if (input) {
                input.click();
              }
            }}
          />

          <div className="arrows" style={{ display: "flex", gap: "5px" }}>
            <button
              className="arrow-btn"
              icon="<"
              onClick={() => handleNavigateChips("left")}
            >
              <i class="icon-right d-block text-main fs-5"></i>
            </button>
            <button
              className="arrow-btn"
              icon=">"
              onClick={() => handleNavigateChips("right")}
            >
              <i class="icon-right iconrotate180 d-block text-main fs-5"></i>
            </button>
          </div>
        </div>

        <div className="date-chips-container mb-4">
          {dateChips.map((date) => (
            <div className="d-flex flex-column align-items-center">
              <div
                key={date.format("YYYY-MM-DD")}
                onClick={() => handleChipClick(date)}
                className={`date-chip ${
                  date.format("YYYY-MM-DD") ===
                  selectedDate.format("YYYY-MM-DD")
                    ? "active"
                    : ""
                }`}
              >
                <div
                  className={`${
                    date.format("YYYY-MM-DD") ===
                    selectedDate.format("YYYY-MM-DD")
                      ? "date-chip active"
                      : ""
                  }`}
                >
                  {date.format("D")}
                </div>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  textAlign: "center",
                  paddingTop: "6px",
                }}
              >
                {date.format("ddd")}
              </div>
            </div>
          ))}
        </div>

        <div className="doctor-selection">
          <Select
            placeholder="Select Doctor"
            value={selectedDoctorOption}
            onChange={handleDoctorChange}
            options={doctorOptions}
            className="doctor-select"
            disabled={!doctorOptions?.length}
            onDropdownVisibleChange={(open) => setEditDoctor(open)}
            open={editDoctor}
            style={{
              width: "20%",
              border: editDoctor ? "1px solid #4B4AD5" : "none",
              borderRadius: editDoctor ? "10px" : "none",
            }}
          />
        </div>

        <div className="timeslots-section">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            defaultActiveKey={getCurrentTimeSection()}
          >
            <TabPane tab="Morning" key="MORNING">
              <TimeSlotContainer
                slots={timeSlots.MORNING}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={handleTimeSlotSelect}
                isLoading={isLoadingSlots}
                handleConfirmAppointment={handleConfirmAppointment}
                editTime={editTime}
                isSlotInPast={isSlotInPast}
                selectedDoctorOption={selectedDoctorOption}
              />
            </TabPane>
            <TabPane tab="Afternoon" key="AFTERNOON">
              <TimeSlotContainer
                slots={timeSlots.AFTERNOON}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={handleTimeSlotSelect}
                isLoading={isLoadingSlots}
                handleConfirmAppointment={handleConfirmAppointment}
                editTime={editTime}
                isSlotInPast={isSlotInPast}
                selectedDoctorOption={selectedDoctorOption}
              />
            </TabPane>
            <TabPane tab="Evening" key="EVENING">
              <TimeSlotContainer
                slots={timeSlots.EVENING}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={handleTimeSlotSelect}
                isLoading={isLoadingSlots}
                handleConfirmAppointment={handleConfirmAppointment}
                editTime={editTime}
                isSlotInPast={isSlotInPast}
                selectedDoctorOption={selectedDoctorOption}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <Drawer
        className="modalWidth-645"
        width="auto"
        title="Confirm Appointment"
        placement="right"
        closable
        open={confirmAppointment}
        onClose={handleConfirmAppointment}
        extra={
          <Button
            type="primary"
            className="btn-41"
            disabled={validation()}
            onClick={onBookAppointmentPress}
          >
            Book Appointment
          </Button>
        }
      >
        <ConfirmAppointment
          handleConfirmAppointment={handleConfirmAppointment}
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          clickedPatient={clickedPatient}
          setClickedPatient={setClickedPatient}
          selectedCashType={selectedCashType}
          setSelectedCashType={setSelectedCashType}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          remarks={remarks}
          setRemarks={setRemarks}
        />
      </Drawer>
    </>
  );
}

export default AddAppointment;
