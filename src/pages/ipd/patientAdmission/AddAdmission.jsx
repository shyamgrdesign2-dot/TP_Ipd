import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  Input,
  Select,
  List,
  Typography,
  Space,
  Skeleton,
  Empty,
} from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  clearPatientsSearch,
} from "../../../redux/ipd/ipdSlice";
import "./styles.scss";
import { searchPatients } from "../../../redux/appointmentsSlice";
import { defaultIcons } from "../../../assets/images/icons";

const { Title, Text, Link } = Typography;

function calcAgeFromDOB(dobISO) {
  if (!dobISO) return null;
  const dob = dayjs(dobISO);
  if (!dob.isValid()) return null;
  const totalMonths = dayjs().diff(dob, "month");
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { years, months };
}

const COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+81"];

export default function AddAdmission() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, patients: list } = useSelector((state) => state.records);
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");

  // debounce
  const debounceRef = useRef();
  const triggerSearch = useCallback((code, mob) => {
    if (!mob || mob.trim().length < 3) {
      dispatch(clearPatientsSearch());
      return;
    }
    dispatch(searchPatients({ searchQuery: mob.trim(), company: "zydus" }));
  }, []);

  const onMobileChange = (e) => {
    const val = e?.target?.value || "";
    setMobile(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      triggerSearch(countryCode, val);
    }, 400);
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (mobile.trim()) {
      debounceRef.current = setTimeout(
        () => triggerSearch(countryCode, mobile),
        300
      );
    }
    // cleanup on unmount
    return () => clearTimeout(debounceRef.current);
  }, [countryCode]); // eslint-disable-line

  const onSelectPatient = (patient) => {
    console.log("intel ==> patient", patient);
    // Shape a minimal patientDetails for the next screen
    const ageObj = calcAgeFromDOB(patient?.dob);
    const patientDetails = {
      id: patient?.patientId || patient?._id,
      name: patient?.patientname,
      gender: patient?.gender,
      contact: patient?.mobilenumber || patient?.phone,
      mrno: patient?.mrno || patient?.mrNo,
      dob: patient?.dob,
      age: ageObj?.years,
      ageMonths: ageObj?.months,
      bloodGroup: patient?.bloodGroup,
      // add more if your API provides it and is useful downstream
    };

    navigate("/ipd/patient-admission", { state: { patientDetails } });
  };

  const renderSubtitle = (p) => {
    const phone = p?.mobilenumber || p?.phone || p?.contact || "";
    const ageObj = typeof p?.age === "number" ? false : calcAgeFromDOB(p?.dob);
    const ageTxt = ageObj ? `${ageObj.years}y,${ageObj.months}m` : `${p?.age}y`;
    return (
      <Space size="middle" className="aadm-item-sub">
        {phone && <span className="aadm-sub-phone">{phone}</span>}
        {phone && ageTxt && <span className="aadm-dot">•</span>}
        {ageTxt && <span className="aadm-sub-age">{ageTxt}</span>}
      </Space>
    );
  };

  const handleBackClick = () => {
    navigate("/ipd/inPatients", { replace: true });
  };

  return (
    <div className="add-admission-page">
      <div onClick={handleBackClick} className="add-admission-back-btn-abs">
        <img src={defaultIcons.leftArrowIcon} alt="<" />
      </div>
      <Title level={2} className="aadm-heading">
        Add Admission
      </Title>

      <Card className="aadm-search-card" bordered>
        <div className="aadm-input-row">
          <Select
            className="aadm-cc"
            value={countryCode}
            onChange={setCountryCode}
            options={COUNTRY_CODES.map((c) => ({ value: c, label: c }))}
            showSearch
            popupMatchSelectWidth={false}
          />
          <Input
            className="aadm-mobile"
            placeholder="Enter Patient's Mobile Number"
            value={mobile}
            onChange={onMobileChange}
            allowClear
            inputMode="numeric"
          />
        </div>
      </Card>

      <div className="aadm-list-title">Existing Patients</div>

      <Card className="aadm-list-card" bordered>
        {loading ? (
          <div>
            <Skeleton active title paragraph={{ rows: 1 }} />
            <Skeleton active title paragraph={{ rows: 1 }} />
          </div>
        ) : list && list.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={list}
            split={false}
            renderItem={(item) => (
              <List.Item
                className="aadm-item"
                onClick={() => onSelectPatient(item)}
              >
                <div className="aadm-item-row">
                  <div className="aadm-item-main">
                    <Link
                      className="aadm-name"
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectPatient(item);
                      }}
                    >
                      {item?.patientname || "-"}
                    </Link>
                    <div className="aadm-sub">{renderSubtitle(item)}</div>
                  </div>
                  <div className="aadm-item-phone">
                    <PhoneOutlined className="aadm-phone-icon" />
                    <Text>
                      {item?.mobilenumber ||
                        item?.contact ||
                        item?.phone ||
                        "-"}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          // <>woaw</>
          <Empty description="No patients found" />
        )}
      </Card>
    </div>
  );
}
