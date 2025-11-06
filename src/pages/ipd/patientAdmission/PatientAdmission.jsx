// PatientAdmission.jsx
import React, { useEffect, useState } from "react";
import {
  ConfigProvider,
  Row,
  Col,
  Form as AntForm,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Space,
  Divider,
  Card,
  message,
  Spin,
} from "antd";
import { useForm, Controller, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";
import {
  doctorDepartmentRoles as fetchDoctorDeptRoles,
  fetchWards,
  checkPatientAdmitted,
} from "../../../redux/ipd/ipdSlice";
import "./styles.scss";
import ApiIpdService from "../../../api/services/ipd/ipdService";
import { getTokenData } from "../../../utils/utils";

const FIELD_SCHEMA = [
  { id: "departmentId", label: "Department*", type: "select-departments" }, // Redux: ipd.doctorDepartmentRoles
  { id: "wardId", label: "Select Ward*", type: "select-wards" }, // Redux: ipd.wards
  { id: "roomId", label: "Select Room*", type: "select-rooms" }, // depends on ward.rooms
  {
    id: "admittingDoctorId",
    label: "Admitting Doctor*",
    type: "select-admit-doc",
  },
  {
    id: "attendingDoctor",
    label: "Attending Doctor*",
    type: "select-attending",
  }, // from filters.doctor
  { id: "admissionDate", label: "Admission Date*", type: "date" },
  { id: "admissionTime", label: "Admission Time*", type: "time" },
  // { id: "referralInfo", label: "Referral Info", type: "searchWithAdd" },
  // {
  //   id: "patientCategory",
  //   label: "Patient Category",
  //   type: "select-static",
  //   options: ["Cash", "Insurance", "Corporate", "Government"],
  // },
  { id: "admissionNo", label: "Admission Number", type: "input" },
  {
    id: "haveAMLC",
    label: "Have a MLC?",
    type: "select-static",
    options: ["Yes", "No"],
  },
  { id: "mlcNumber", label: "MLC Number", type: "input" },
  { id: "careTaker", label: "Care Taker", type: "input" },
  { id: "contactNo", label: "Contact No", type: "input" },
  {
    id: "relationship",
    label: "Relationship",
    type: "select-static",
    options: ["Father", "Mother", "Spouse", "Sibling", "Friend", "Guardian"],
  },
  { id: "insuranceNumber", label: "Insurance Number", type: "input" },
  { id: "policyNumber", label: "Policy Number", type: "input" },
  { id: "tpaNumber", label: "TPA Number", type: "input" },
];

/* ---------------- Utils ---------------- */
function toUpperSafe(val, fallback = "") {
  if (!val || typeof val !== "string") return fallback;
  return val.toUpperCase();
}
function combineToAdmittedOn(dateISO, timeISO) {
  const d = dateISO ? dayjs(dateISO) : null;
  const t = timeISO ? dayjs(timeISO) : null;
  if (d && t)
    return d
      .hour(t.hour())
      .minute(t.minute())
      .second(0)
      .millisecond(0)
      .toISOString();
  return (d || t || dayjs()).toISOString();
}
function calcAgeFromDOB(dobISO) {
  if (!dobISO) return null;
  const dob = dayjs(dobISO);
  if (!dob.isValid()) return null;
  const now = dayjs();
  const years = now.diff(dob, "year");
  const months = now.diff(dob.add(years, "year"), "month");
  return { years, months: Math.max(months, 0) };
}

/* ---------------- Field Renderer ---------------- */
function FieldRenderer({
  field,
  control,
  wards, // [{ _id, name, rooms:[{_id,type,name,available}] }]
  departmentsRoles, // [{ department, departmentId, doctors:[{doctorId,doctorName,role,code}] }]
  selectedDepartmentId,
  selectedWardId,
  onDepartmentChange,
  onWardChange,
  doctorsList, // filters.doctor
  onSearchDoctors,
}) {
  const haveAMLC = useWatch({ control, name: "haveAMLC" });
  if (field.id === "mlcNumber" && haveAMLC !== "Yes") return null;

  const requiredIds = [
    "departmentId",
    "wardId",
    "roomId",
    "admittingDoctorId",
    "attendingDoctor",
    "admissionDate",
    "admissionTime",
    // "admissionNo",
  ];
  const rules = requiredIds.includes(field.id)
    ? { required: `${field.label.replace("*", "")} is required` }
    : {};

  const renderSelect = (
    list = [],
    rhf,
    mapItem = (x) => ({ value: x, label: x }),
    extraProps = {}
  ) => {
    return (
      <Select
        value={rhf.value}
        onChange={rhf.onChange}
        onBlur={rhf.onBlur}
        allowClear
        placeholder="Select"
        popupMatchSelectWidth={false}
        options={list.map(mapItem)}
        optionLabelProp="label"
        showSearch
        filterOption={(input, option) =>
          (option?.label || "").toLowerCase().includes(input.toLowerCase())
        }
        className="w-100"
        {...extraProps}
      />
    );
  };

  if (field.id === "contactNo") {
    return (
      <Controller
        name="contactNo"
        control={control}
        rules={{
          validate: {
            digitsOnly: (v) =>
              v == null ||
              v === "" ||
              /^\d*$/.test(v) ||
              "Only numbers are allowed",
            maxTen: (v) =>
              v == null ||
              v === "" ||
              v.length <= 10 ||
              "Contact number cannot exceed 10 digits",
          },
        }}
        render={({ field: rhf }) => (
          <Input
            placeholder="Contact No"
            inputMode="numeric"
            pattern="\d*"
            value={rhf.value ?? ""}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              rhf.onChange(onlyDigits);
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              const onlyDigits = text.replace(/\D/g, "");
              e.preventDefault();
              rhf.onChange(`${rhf.value ?? ""}${onlyDigits}`);
            }}
          />
        )}
      />
    );
  }

  switch (field.type) {
    case "select-departments":
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) =>
            renderSelect(
              departmentsRoles || [],
              {
                ...rhf,
                onChange: (val) => {
                  onDepartmentChange?.(val);
                  rhf.onChange(val);
                },
              },
              (d) => ({ value: d.departmentId, label: d.department })
            )
          }
        />
      );

    case "select-admit-doc": {
      const selectedDept = (departmentsRoles || []).find(
        (d) => d.departmentId === selectedDepartmentId
      );
      const doctors = selectedDept?.doctors || [];
      return (
        <Controller
          key={selectedDepartmentId}
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) =>
            renderSelect(
              doctors,
              rhf,
              (doc) => ({
                value: doc.doctorId,
                label: `${doc.doctorName} (${doc.role})`,
              }),
              { disabled: !selectedDepartmentId }
            )
          }
        />
      );
    }

    case "select-wards":
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) =>
            renderSelect(
              wards || [],
              {
                ...rhf,
                onChange: (val) => {
                  onWardChange?.(val);
                  rhf.onChange(val);
                },
              },
              (w) => ({ value: w._id, label: w.name })
            )
          }
        />
      );

    case "select-rooms": {
      const ward = (wards || []).find((w) => w._id === selectedWardId);
      const rooms = ward?.rooms || [];
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) =>
            renderSelect(rooms, rhf, (r) => ({ value: r._id, label: r.name }), {
              disabled: !selectedWardId,
            })
          }
        />
      );
    }

    case "select-attending":
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          key={selectedDepartmentId}
          render={({ field: rhf }) => (
            <Select
              value={rhf.value}
              onChange={rhf.onChange}
              onBlur={rhf.onBlur}
              allowClear
              placeholder="Select"
              popupMatchSelectWidth={false}
              showSearch
              optionLabelProp="label"
              onSearch={(q) => onSearchDoctors?.(q)}
              filterOption={(input, option) =>
                (option?.label || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={(doctorsList || []).map((d) => ({
                value: d?.id ?? d?.doctorId ?? d?.value ?? d?.code ?? d?.name,
                label: d?.name ?? d?.doctorName ?? String(d),
              }))}
              className="w-100"
            />
          )}
        />
      );

    case "select-static": {
      const opts = field.options || [];
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) =>
            renderSelect(opts, rhf, (x) => ({ value: x, label: x }))
          }
        />
      );
    }

    case "date":
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) => (
            <DatePicker
              value={rhf.value ? dayjs(rhf.value) : null}
              onChange={(d) => rhf.onChange(d ? d.toISOString() : null)}
              format="DD-MM-YYYY"
              className="w-100"
            />
          )}
        />
      );

    case "time":
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) => (
            <TimePicker
              value={rhf.value ? dayjs(rhf.value) : null}
              onChange={(t) =>
                rhf.onChange(
                  t
                    ? dayjs()
                        .hour(t.hour())
                        .minute(t.minute())
                        .second(0)
                        .toISOString()
                    : null
                )
              }
              format="HH:mm"
              className="w-100"
            />
          )}
        />
      );

    case "searchWithAdd":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: rhf }) => (
            <Space.Compact className="referral-compact w-100">
              <Input
                placeholder="Search reference"
                value={rhf.value || ""}
                onChange={(e) => rhf.onChange(e.target.value)}
              />
              <Button
                type="default"
                onClick={() => console.log("Add New referral clicked")}
              >
                Add New
              </Button>
            </Space.Compact>
          )}
        />
      );

    default:
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) => (
            <Input
              placeholder={field.label}
              value={rhf.value || ""}
              onChange={(e) => rhf.onChange(e.target.value)}
            />
          )}
        />
      );
  }
}

/* ---------------- Main ---------------- */
export default function PatientAdmission() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const dispatch = useDispatch();

  const { filters } = useSelector((s) => s.inPatients);
  const doctorsList = filters?.doctor || [];
  const departmentsRoles = useSelector(
    (s) => s.ipd?.doctorDepartmentRoles || []
  );
  const wardsState = useSelector((s) => s.ipd?.wards);

  const wards = Array.isArray(wardsState)
    ? wardsState
    : wardsState?.data || wardsState || [];

  const ageFromDOB = calcAgeFromDOB(patientDetails?.dob);
  const ageYears =
    ageFromDOB?.years ?? patientDetails?.age ?? patientDetails?.ageYears ?? "-";
  const ageMonths = ageFromDOB?.months ?? patientDetails?.ageMonths;
  const name = patientDetails?.name || patientDetails?.patientName || "-";
  const gender = patientDetails?.gender || "-";
  const metaAge =
    `${patientDetails?.age}y` ||
    (ageYears !== "-" && typeof ageMonths === "number"
      ? `${ageYears}y,${ageMonths}m`
      : ageYears !== "-"
      ? `${ageYears}y`
      : "-");

  const [loadingInitial, setLoadingInitial] = useState(true);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      admissionDate: dayjs().toISOString(),
      admissionTime: dayjs().toISOString(),
      haveAMLC: "Yes",
      departmentId: undefined,
      wardId: undefined,
      roomId: undefined,
      admittingDoctorId: undefined,
      attendingDoctor: undefined,
      contactNo: "",
    },
  });

  const selectedDepartmentId = useWatch({ control, name: "departmentId" });
  const selectedWardId = useWatch({ control, name: "wardId" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Promise.all([
          dispatch(fetchDoctorDeptRoles()),
          dispatch(fetchFilters({ field: "doctor" })),
          dispatch(fetchWards()),
        ]);
      } finally {
        if (mounted) setLoadingInitial(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const handleDepartmentChange = () => {
    setValue("admittingDoctorId", undefined);
  };
  const handleWardChange = () => setValue("roomId", undefined);

  const onSubmit = async (formData) => {
    try {
      const admittedOn = combineToAdmittedOn(
        formData.admissionDate,
        formData.admissionTime
      );

      const ward = (wards || []).find((w) => w._id === formData.wardId);
      const room = ward?.rooms?.find((r) => r._id === formData.roomId);
      const dept = (departmentsRoles || []).find(
        (d) => d.departmentId === formData.departmentId
      );
      const doctor = (dept?.doctors || []).find(
        (doc) => doc.doctorId === formData.admittingDoctorId
      );
      const tokenData = getTokenData();
      const hospitalId = tokenData?.clinic_id;

      const payload = {
        details: {
          id: String(patientDetails?.id ?? patientDetails?.patientId ?? ""),
          name: name === "-" ? "" : name,
          gender: toUpperSafe(gender, ""),
          age: typeof ageYears === "number" ? ageYears : "",
          contact:
            patientDetails?.contact || patientDetails?.contactNumber || "",
          address: patientDetails?.address || "",
          bloodGroup: patientDetails?.bloodGroup,
        },
        ward: {
          id: ward?._id || "",
          title: ward?.name || "",
        },
        room: {
          id: room?._id || "",
          title: room?.name || "",
        },
        doctor: {
          id:
            doctor?.doctorId ||
            patientDetails?.primaryConsultant?.id ||
            patientDetails?.doctorId ||
            "",
          name:
            doctor?.doctorName || patientDetails?.primaryConsultant?.name || "",
          speciality:
            doctor?.role || patientDetails?.primaryConsultant?.speciality || "",
        },
        doctorId: formData?.attendingDoctor || 0,
        hospitalId: hospitalId || 0,
        admittedOn,
        // referral: !!formData.referralInfo,
        admissionId: patientDetails?.admissionId || "",
        isDischarged: false,
        mrno: patientDetails?.mrno || patientDetails?.mrNo || "",
        visitno: patientDetails?.visitno || "",
        encounterno: patientDetails?.encounterno || "",
        admissionNo: formData?.admissionNo || "",
        metadata: {
          // category: formData.patientCategory || "",
          category: "",
          haveMLC: formData.haveAMLC === "Yes",
          mlcno: formData.mlcNumber || "",
          caretaker: formData.careTaker || "",
          contactno: formData.contactNo || "",
          relationship: formData.relationship || "",
          insuranceno: formData.insuranceNumber || "",
          policyno: formData.policyNumber || "",
          tpano: formData.tpaNumber || "",
          // attendingDoctor not part of required payload
        },
      };

      const checkIfAdmitted = await dispatch(
        checkPatientAdmitted({
          patientId: patientDetails?.id ?? patientDetails?.patientId ?? "",
        })
      );
      if (!!checkIfAdmitted.payload.alreadyAdmitted) {
        message.error("Patient is already admitted");
        return;
      }
      await ApiIpdService.createAdmission(payload);
      message.success("Admission created successfully");
      navigate(`/ipd/inPatients`, {
        replace: true,
      });
    } catch (err) {
      console.error("Create Admission Error:", err);
      message.error(
        err?.response?.data?.message ||
          "Unable to create admission. Please try again."
      );
    }
  };

  return (
    <ConfigProvider theme={{ token: { borderRadius: 12, controlHeight: 40 } }}>
      <div className="ipd-patient-admission-form-container">
        <Card
          title={
            <div className="fs24-semibold-text">Add Admission Details</div>
          }
          bordered
          className="admission-card"
        >
          <AntForm layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <div className="patient-strip">
              <div className="patient-name">{name}</div>
              <div className="patient-meta">
                {gender || "-"} • {metaAge}
              </div>
              {(patientDetails?.mrno || patientDetails?.mrNo) && (
                <div className="patient-mrno">
                  <span className="text-uppercase fw-semibold">mrno:</span>{" "}
                  {patientDetails?.mrno || patientDetails?.mrNo || "-"}
                </div>
              )}
            </div>

            <Spin spinning={loadingInitial}>
              <Row gutter={[16, 12]}>
                {FIELD_SCHEMA.map((f) => (
                  <Col key={f.id} xs={24} md={12}>
                    <AntForm.Item
                      label={f.label.replace("*", "")}
                      required={/\*/.test(f.label)}
                      className="field-item"
                      validateStatus={errors[f.id] ? "error" : undefined}
                      help={errors[f.id]?.message}
                    >
                      <FieldRenderer
                        field={f}
                        control={control}
                        wards={wards}
                        departmentsRoles={departmentsRoles}
                        selectedDepartmentId={selectedDepartmentId}
                        selectedWardId={selectedWardId}
                        onDepartmentChange={handleDepartmentChange}
                        onWardChange={handleWardChange}
                        doctorsList={doctorsList}
                        onSearchDoctors={(q) =>
                          dispatch(fetchFilters({ field: "doctor", search: q }))
                        }
                      />
                    </AntForm.Item>
                  </Col>
                ))}
              </Row>
            </Spin>

            <Divider className="divider" />

            <div className="form-actions">
              <Button htmlType="button" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button type="primary" htmlType="submit">
                Confirm Admission
              </Button>
            </div>
          </AntForm>
        </Card>
      </div>
    </ConfigProvider>
  );
}
