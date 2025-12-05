import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Input,
  Row,
  Select,
  Space,
  Spin,
  TimePicker,
  Tooltip,
} from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  doctorDepartmentRoles as fetchDoctorDeptRoles,
  fetchWards,
  checkPatientAdmitted,
  editAdmission,
} from "../../../redux/ipd/ipdSlice";
import {
    clearSearch,
    placeIctOrder,
    searchPatients,
  } from "../../../redux/appointmentsSlice";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";
import "./CreateAdmission.scss";
import ApiIpdService from "../../../api/services/ipd/ipdService";
import { getTokenData, isZydus } from "../../../utils/utils";
import { isMobile } from "react-device-detect";
import message from "antd/es/message";
import SubHeader from "./components/SubHeader";
import WardBedDrawer from "./components/WardBedDrawer";
import { defaultIcons } from "../../../assets/images/assessmentIcons";
import { defaultIcons as dischargeSummaryIcons } from "../../../assets/images/dischargeSummaryIcons";
import { defaultIcons as assessmentIcons } from "../../../assets/images/assessmentIcons";
import carePlanIcon from '../../../assets/images/Care plan_Active.svg';


const FIELD_SCHEMA = [
  { id: "departmentId", label: "Department*", type: "select-departments", placeholder:"Search & Select Department" },
  { id: "admittingDoctorId", label: "Admitting Doctor*", type: "select-admit-doc", placeholder:"Search & Select Doctor" },
  { id: "admissionDate", label: "Admission Date*", type: "date", placeholder:"Select Admission Date" },
  { id: "admissionTime", label: "Admission Time*", type: "time", placeholder:"Select Admission Time" },
  { id: "wardBed", label: "Ward & Bed*", type: "ward-bed-select", placeholder:"Select Ward & Bed" },
  {
    id: "patientCategory",
    label: "Patient Category",
    type: "select-static",
    placeholder:"Select Patient Category",
    options: ["Emergency", "Insurance", "Cash", "Corporate"],
  },
//   { id: "admissionNo", label: "Admission Number", type: "input", placeholder:"Enter Admission Number" },
  { id: "mlcNumber", label: "MLC Number", type: "input", placeholder:"Enter MLC Number" },
  { id: "careTaker", label: "Care Taker Name*", type: "input", placeholder:"Enter Care Taker Name" },
  { id: "contactNo", label: "Care Taker Mobile number*", type: "input", placeholder:"Enter Care Taker Mobile Number" },
  {
    id: "relationship",
    label: "Relation With the Patient*",
    type: "select-static",
    placeholder:"Search & select relation",
    options: ["Father", "Mother", "Spouse", "Sibling", "Friend", "Guardian", "Other"],
  },
  { id: "insuranceNumber", label: "Insurance Number", type: "input", placeholder:"Enter Insurance Number" },
  { id: "policyNumber", label: "Policy Number", type: "input", placeholder:"Enter Policy Number" },
  { id: "tpaNumber", label: "TPA Number", type: "input", placeholder:"Enter TPA Number" },
  { id: "preApprovalId", label: "Pre-Approval ID", type: "input", placeholder:"Enter Pre-Approval ID" },
];

const REQUIRED_FIELD_IDS = [
  "departmentId",
  "wardBed",
  "admittingDoctorId",
  "admissionDate",
  "admissionTime",
  "contactNo",
  "relationship",
  "careTaker",
];

const SECTION_LAYOUT = [
  {
    key: "admission-details",
    title: "Admission Details",
    description: "Assign the right department, doctor, ward and timing.",
    icon: assessmentIcons.examinationsPc,
    fieldIds: [
      "departmentId",
      "admittingDoctorId",
      "admissionDate",
      "admissionTime",
      "wardBed",
      "patientCategory",
      "mlcNumber",
    ],
  },
  {
    key: "care-taker",
    title: "Care Taker Details",
    description: "Primary contact person during the stay.",
    icon: carePlanIcon,
    fieldIds: ["contactNo", "careTaker", "relationship"],
  },
  {
    key: "insurance",
    title: "Insurance Details",
    icon: dischargeSummaryIcons.assessmentPc,
    description: "Optional insurance & policy information.",
    fieldIds: ["insuranceNumber", "policyNumber", "tpaNumber", "preApprovalId"],
  },
//   {
//     key: "surgery-procedure",
//     title: "SurgerycProcedure Details",
//     icon: dischargeSummaryIcons.otNotesDark,
//     description: "Optional surgery/procedure details.",
//     fieldIds: ["surgeryProcedure"],
//   }
];

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

function FieldRenderer({
  field,
  control,
  wards,
  departmentsRoles,
  selectedDepartmentId,
  selectedWardId,
  doctorsList,
  onDepartmentChange,
  onWardChange,
  onSearchDoctors,
  onWardBedClick,
  selectedWardBed,
  fieldError,
}) {
//   const haveAMLC = useWatch({ control, name: "haveAMLC" });
//   if (field.id === "mlcNumber" && haveAMLC !== "Yes") return null;

  const rules = REQUIRED_FIELD_IDS.includes(field.id)
    ? { required: `${field.label.replace("*", "")} is required` }
    : {};

  const renderSelect = (
    list = [],
    rhf,
    mapItem = (x) => ({ value: x, label: x }),
    extraProps = {}
  ) => (
    <Select
      value={rhf.value}
      onChange={rhf.onChange}
      onBlur={rhf.onBlur}
      allowClear
      placeholder={field.placeholder || "Select"}
      popupMatchSelectWidth={false}
      options={list.map(mapItem)}
      optionLabelProp="label"
      showSearch
      filterOption={(input, option) =>
        (option?.label || "").toLowerCase().includes(input.toLowerCase())
      }
      className="w-100 custom-select-placeholder"
      {...extraProps}
    />
  );

  if (field.id === "contactNo") {
    return (
      <Controller
        name="contactNo"
        control={control}
        rules={{
          required: "Care Taker Mobile number is required",
          validate: {
            digitsOnly: (v) =>
              !v || /^\d+$/.test(v) || "Only numbers are allowed",
            exactlyTen: (v) =>
              !v || v.length === 10 || "Contact number must be exactly 10 digits",
          },
        }}
        render={({ field: rhf }) => (
          <Input
            placeholder={field.placeholder || "Enter Care Taker Mobile Number"}
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
      const selectComponent = (
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
                label: `${doc.doctorName}`,
              }),
              { disabled: !selectedDepartmentId }
            )
          }
        />
      );

      if (selectedDepartmentId) return selectComponent;

      return (
        <Tooltip
          title="Please select a Department"
          placement="topLeft"
          trigger={["hover", "focus"]}
        >
          <div>{selectComponent}</div>
        </Tooltip>
      );
    }

    case "ward-bed-select":
      return (
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: rhf }) => {
            const displayClassNames = [
              "ward-bed-display",
              selectedWardBed ? "filled" : "empty",
              fieldError ? "has-error" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <>
                <input type="hidden" {...rhf} />
                <div
                  className={displayClassNames}
                tabIndex={0}
                role="button"
                onClick={() => {
                  rhf.onBlur();
                  onWardBedClick?.();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onWardBedClick?.();
                  }
                }}
              >
                  <span className="ward-bed-text">
                    {selectedWardBed || "Select Ward & Bed"}
                  </span>
                  {selectedWardBed && (
                    <i className="icon-Edit" />
                  )}
                </div>
              </>
            );
          }}
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
              format="DD MMM YYYY"
              className="w-100 admission-date-picker"
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
              format="hh:mm A"
              use12Hours
              className="w-100 admission-date-picker"
            />
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
              placeholder={field.placeholder || field.label}
              value={rhf.value || ""}
              onChange={(e) => rhf.onChange(e.target.value)}
            />
          )}
        />
      );
  }
}

export default function CreateAdmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [searchParams] = useSearchParams();
  const { isEditMode, admissionData, patient_data } = state || {};
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


  const { patients, error } = useSelector((state) => state.records);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isEditingName, setIsEditingName] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [patientSearchOptions, setPatientSearchOptions] = useState([]);
  const [searchQueryName, setSearchQueryName] = useState("");
  const [searchQueryMobile, setSearchQueryMobile] = useState("");
  const [autoCompleteFlagName, setAutoCompleteFlagName] = useState(false);
  const nameAutoCompleteRef = useRef(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [wardBedDrawerOpen, setWardBedDrawerOpen] = useState(false);
  const [selectedWardBed, setSelectedWardBed] = useState("");
  const [isEditModeState, setIsEditModeState] = useState(isEditMode || false);
//   const [selectedTab, setSelectedTab] = useState(1);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const tableRef = useRef(null);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      admissionDate: dayjs().toISOString(),
      admissionTime: dayjs().toISOString(),
      haveAMLC: "",
      departmentId: undefined,
      wardBed: undefined,
      admittingDoctorId: undefined,
      attendingDoctor: undefined,
      contactNo: patientDetails?.contact,
    },
  });

  const selectedDepartmentId = useWatch({ control, name: "departmentId" });
  const selectedWardBedValue = useWatch({ control, name: "wardBed" });
  const watchedValues = watch();
  
  // Parse wardBed value to get wardId and roomId
  const [selectedWardId, selectedRoomId] = useMemo(() => {
    if (!selectedWardBedValue) return [null, null];
    try {
      const parsed = JSON.parse(selectedWardBedValue);
      return [parsed.wardId, parsed.roomId];
    } catch {
      return [null, null];
    }
  }, [selectedWardBedValue]);

  // Update selectedWardBed display when form value changes
  useEffect(() => {
    if (selectedWardId && selectedRoomId && wards.length > 0) {
      const ward = wards.find((w) => w._id === selectedWardId);
      const room = ward?.rooms?.find((r) => r._id === selectedRoomId);
      if (ward && room) {
        setSelectedWardBed(`${ward.name} - ${room.name}`);
      }
    } else if (!selectedWardBedValue) {
      setSelectedWardBed("");
    }
  }, [selectedWardId, selectedRoomId, wards, selectedWardBedValue]);

  const requiredFieldLabels = useMemo(() => {
    return REQUIRED_FIELD_IDS.reduce((acc, fieldId) => {
      const field = FIELD_SCHEMA.find((f) => f.id === fieldId);
      if (field) {
        acc[fieldId] = field.label.replace("*", "").trim();
      }
      return acc;
    }, {});
  }, []);

  const isPatientSelected = Boolean(
    patientData?.pm_pid ||
      patientData?.pm_fullname ||
      patientData?.patient_unique_id ||
      patientDetails?.patientId ||
      patientDetails?.patientName ||
      patientDetails?.id ||
      patientDetails?.name
  );

  const missingRequiredFields = useMemo(() => {
    if (!isPatientSelected) return [];
    return REQUIRED_FIELD_IDS.filter((fieldId) => {
      const value = watchedValues?.[fieldId];
      if (typeof value === "string") {
        return value.trim() === "";
      }
      return value == null || value === false;
    });
  }, [watchedValues, isPatientSelected]);

  const missingFieldLabels = missingRequiredFields.map(
    (id) => requiredFieldLabels[id] || id
  );

  const helperMessage = !isPatientSelected
    ? "Please select a patient to proceed."
    : missingFieldLabels.length > 1
    ? "Please fill all required details."
    : missingFieldLabels.length === 1
    ? `Please fill ${missingFieldLabels[0]}.`
    : "";

  const isConfirmDisabled = !isPatientSelected || missingFieldLabels.length > 0;

  const ageFromDOB = calcAgeFromDOB(patientDetails?.dob || patientData?.DOB);
  const ageYears =
    ageFromDOB?.years ?? 
    patientData?.ageYears ?? 
    patientDetails?.age ?? 
    patientDetails?.ageYears ?? 
    "-";
  const ageMonths = ageFromDOB?.months ?? patientData?.ageMonths ?? patientDetails?.ageMonths;
  const name = 
    patientData?.pm_fullname ?? 
    patientDetails?.name ?? 
    patientDetails?.patientName ?? 
    "-";
  const gender = 
    patientData?.pm_gender ?? 
    patientDetails?.gender ?? 
    "-";
  const prefix = 
    patientData?.pm_salutation ?? 
    patientDetails?.prefix ?? 
    "";
  const metaAge =
    (typeof ageYears === "number" && typeof ageMonths === "number"
      ? `${ageYears}y ${ageMonths}m`
      : typeof ageYears === "number"
      ? `${ageYears}y`
      : "-") || "-";

  // Initialize edit mode data
  useEffect(() => {
    if (isEditMode && admissionData && departmentsRoles.length > 0) {
      const details = admissionData?.details || {};
      const metadata = admissionData?.metadata || {};
      const ward = admissionData?.ward || {};
      const room = admissionData?.room || {};
      const doctor = admissionData?.doctor || {};

      // Set patient data
      const patientInfo = {
        pm_fullname: details?.name || "",
        pm_salutation: details?.prefix || "",
        pm_gender: details?.gender || "",
        pm_contact_no: details?.contact || "",
        patient_unique_id: details?.id || "",
        pm_pid: details?.pm_pid || "",
        patient_address: details?.address || "",
        pm_address: details?.address || "",
        pm_blood_group: details?.bloodGroup || "",
        ageYears: details?.age || "",
      };

      setPatientData(patientInfo);
      setPatientDetails({
        patientName: details?.name || "",
        mobileNumber: details?.contact || "",
        patientUniqueId: details?.id || "",
        patientId: details?.pm_pid || "",
      });

      // Parse admission date and time
      const admittedOn = admissionData?.admittedOn;
      let admissionDate = dayjs().toISOString();
      let admissionTime = dayjs().toISOString();
      
      if (admittedOn) {
        const dateTime = dayjs(admittedOn);
        admissionDate = dateTime.toISOString();
        admissionTime = dateTime.toISOString();
      }

      // Find department that contains this doctor
      const doctorId = doctor?.id || doctor?.doctorId;
      let foundDepartmentId = undefined;
      
      if (doctorId) {
        for (const dept of departmentsRoles) {
          const foundDoctor = dept?.doctors?.find(
            (doc) => doc.doctorId === doctorId || doc.doctorId === String(doctorId)
          );
          if (foundDoctor) {
            foundDepartmentId = dept.departmentId;
            break;
          }
        }
      }

      // Set form values
      setValue("departmentId", foundDepartmentId);
      setValue("admittingDoctorId", doctorId);
      setValue("admissionDate", admissionDate);
      setValue("admissionTime", admissionTime);
      
      // Set ward and bed
      if (ward?.id && room?.id) {
        setValue("wardBed", JSON.stringify({ wardId: ward.id, roomId: room.id }));
        setSelectedWardBed(`${ward.title || ward.name || ""} - ${room.title || room.name || ""}`);
      }
      
      setValue("patientCategory", metadata?.category || "");
      setValue("admissionNo", admissionData?.admissionNo || "");
      setValue("mlcNumber", metadata?.mlcno === "0" ? "" : metadata?.mlcno || "");
      setValue("careTaker", metadata?.caretaker || "");
      setValue("contactNo", metadata?.contactno || "");
      setValue("relationship", metadata?.relationship || "");
      setValue("insuranceNumber", metadata?.insuranceno || "");
      setValue("policyNumber", metadata?.policyno || "");
      setValue("tpaNumber", metadata?.tpano || "");
      setValue("preApprovalId", metadata?.preApprovalId || "");

      setIsEditingName(false); // Disable patient search in edit mode
    }
  }, [isEditMode, admissionData, departmentsRoles, setValue]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Promise.all([
          dispatch(fetchDoctorDeptRoles()),
          dispatch(fetchFilters({ field: "doctor" })),
          dispatch(fetchWards({ includeAll: true })),
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

  const handleWardBedConfirm = (wardId, roomId) => {
    const ward = wards.find((w) => w._id === wardId);
    const room = ward?.rooms?.find((r) => r._id === roomId);
    
    if (ward && room) {
      const displayValue = `${ward.name} - ${room.name}`;
      setSelectedWardBed(displayValue);
      setValue("wardBed", JSON.stringify({ wardId, roomId }));
    }
  };

  const handleWardBedClick = () => {
    setWardBedDrawerOpen(true);
  };

  const onSubmit = async (formData) => {

    // console.log(formData,"formData");
    try {
      const admittedOn = combineToAdmittedOn(
        formData.admissionDate,
        formData.admissionTime
      );

      // Parse wardBed to get wardId and roomId
      let wardId, roomId;
      try {
        const wardBedData = JSON.parse(formData.wardBed || "{}");
        wardId = wardBedData.wardId;
        roomId = wardBedData.roomId;
      } catch {
        wardId = null;
        roomId = null;
      }

      // In edit mode, fall back to admissionData if form lookup fails
      let ward = (wards || []).find((w) => w._id === wardId);
      let room = ward?.rooms?.find((r) => r._id === roomId);
      
      // If not found and in edit mode, use data from admissionData
      if (isEditModeState && admissionData) {
        if (!ward && admissionData?.ward?.id) {
          ward = {
            _id: admissionData.ward.id,
            name: admissionData.ward.title,
          };
        }
        if (!room && admissionData?.room?.id) {
          room = {
            _id: admissionData.room.id,
            name: admissionData.room.title,
          };
        }
      }
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
          id: String(patientDetails?.patientUniqueId ?? patientDetails?.patientUniqueId ?? ""),
          pm_pid: patientDetails?.patientId || "",
          name: name === "-" ? "" : name,
          gender: toUpperSafe(gender, ""),
          prefix: prefix || "",
          age: typeof ageYears === "number" ? ageYears : "",
          contact:
            patientData?.pm_contact_no ??
            patientDetails?.contact ?? 
            patientDetails?.contactNumber ?? 
            "",
          address:
            patientData?.patient_address ??
            patientData?.pm_address ??
            patientDetails?.address ?? 
            "",
          bloodGroup:
            patientData?.pm_blood_group ??
            patientDetails?.bloodGroup ??
            patientData?.pm_blood_group ??
            "",
        },
        ward: {
          id: ward?._id || admissionData?.ward?.id || "",
          title: ward?.name || admissionData?.ward?.title || "",
        },
        room: {
          id: room?._id || admissionData?.room?.id || "",
          title: room?.name || admissionData?.room?.title || "",
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
            doctor?.speciality ||
            patientDetails?.primaryConsultant?.speciality ||
            "",
          role: doctor?.role || patientDetails?.primaryConsultant?.role || "",
        },
        doctorId: tokenData?.user_id || null,
        hospitalId: hospitalId || 0,
        admittedOn,
        referral: admissionData?.referral || false,
        isDischarged: admissionData?.isDischarged || false,
        sentForApproval: admissionData?.sentForApproval || false,
        mrno:"0",
        visitno:"0",
        encounterno:"0",
        admissionNo:admissionData?.admissionNo || "",
        metadata: {
          category: formData.patientCategory || "",
          haveMLC: formData.mlcNumber && formData.mlcNumber.trim() !== "" ? true : false,
          mlcno: formData.mlcNumber || "0",
          caretaker: formData.careTaker || "",
          contactno: formData.contactNo || "",
          relationship: formData.relationship || "",
          insuranceno: formData.insuranceNumber || "",
          policyno: formData.policyNumber || "",
          tpano: formData.tpaNumber || "",
          preApprovalId: formData.preApprovalId || "",
        },
      };

    //   console.log(payload,"payload");

      if (isEditModeState && admissionData?.admissionId) {
        // Edit mode - call edit API
        // Remove fields that shouldn't be in edit payload based on curl:
        const editPayload = { ...payload };
        delete editPayload.sentForApproval;

        // console.log(editPayload,"editPayload");
        
        await dispatch(editAdmission({
          admissionId: admissionData.admissionId,
          data: editPayload,
        }));
        message.success("Admission updated successfully");
      } else {
        // Create mode
        const checkIfAdmitted = await dispatch(
          checkPatientAdmitted({
            patientId: patientDetails?.patientUniqueId ?? patientDetails?.patientId ?? "",
          })
        );
        if (!!checkIfAdmitted.payload.alreadyAdmitted) {
          message.error("Patient is already admitted");
          return;
        }

        const createPayload = { ...payload };
        delete createPayload.admissionNo;
        await ApiIpdService.createAdmission(createPayload);
        message.success("Admission created successfully");
      }
      
      navigate(`/ipd/inPatients`, {
        replace: true,
      });
    } catch (err) {
      console.error("Create/Edit Admission Error:", err);
      message.error(
        err?.response?.data?.message ||
          `Unable to ${isEditModeState ? "update" : "create"} admission. Please try again.`
      );
    }
  };

  const renderSectionFields = (fieldIds) =>
    fieldIds.map((fieldId) => {
      const field = FIELD_SCHEMA.find((f) => f.id === fieldId);
      if (!field) return null;
      const fieldValue = watch(field.id);
      const shouldMarkMissing =
        isPatientSelected &&
        REQUIRED_FIELD_IDS.includes(field.id) &&
        (!fieldValue || (typeof fieldValue === "string" && !fieldValue.trim())) &&
        (isSubmitted || touchedFields?.[field.id]);

      return (
        <Col key={field.id} xs={24} sm={12} md={8}>
          <div
            className={`form-field ${
              errors[field.id] ? "form-field-error" : ""
            } ${shouldMarkMissing ? "form-field-missing" : ""}`}
          >
            <label className="field-label">
              {field.label.replace("*", "")}
              {/\*/.test(field.label) && <span className="required">*</span>}
            </label>
            <FieldRenderer
              field={field}
              control={control}
              wards={wards}
              departmentsRoles={departmentsRoles}
              selectedDepartmentId={selectedDepartmentId}
              selectedWardId={selectedWardId}
              doctorsList={doctorsList}
              onDepartmentChange={handleDepartmentChange}
              onWardChange={handleDepartmentChange}
              onSearchDoctors={(q) =>
                dispatch(fetchFilters({ field: "doctor", search: q }))
              }
              onWardBedClick={handleWardBedClick}
              selectedWardBed={selectedWardBed}
              fieldError={errors[field.id]}
            />
            {errors[field.id] && (
              <div className="field-error">{errors[field.id]?.message}</div>
            )}
          </div>
        </Col>
      );
    });

  const patientMeta = useMemo(
    () => [
      { label: "Gender", value: gender || "-" },
      { label: "Age", value: metaAge || "-" },
      {
        label: "UHID",
        value: patientDetails?.mrno || patientDetails?.mrNo || "-",
      },
      {
        label: "Admission ID",
        value: patientDetails?.admissionId || "-",
      },
    ],
    [gender, metaAge, patientDetails]
  );

  const BoldWordInName = ({ name, boldWord }) => {
    // Split the name into parts based on the bold word
    const parts = name.split(new RegExp(`(${boldWord})`, "i"));

    // Map through the parts and apply different styles to the bold word
    const formattedName = parts.map((part, index) => {
      if (part.toLowerCase() === boldWord.toLowerCase()) {
        // If the part matches the bold word, render it in bold
        return (
          <span key={index} className="fw-medium">
            {part}
          </span>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });

    return formattedName;
  };

  const PatientPlank = (patient) => {
    return (
      <>
        <div className="d-flex align-items-center">
          <div
            className="d-flex align-items-center"
            onClick={() => {
              setAutoCompleteFlagName(false);
              onSelect(patient);
            }}
          >
            <div className="list-patientName d-flex align-items-center me-4">
              <i className="icon-patients backbar me-2"></i>{" "}
              <span>
                {patient.pm_salutation && patient.pm_salutation}{" "}
                <BoldWordInName
                  name={patient.pm_fullname}
                  boldWord={searchQuery}
                />{" "}
                ({patient.pm_gender}, {patient.ageYears}y)
              </span>
            </div>
            <div className="list-patientName d-flex align-items-center me-4">
              <i className="icon-phone backbar me-2"></i>
              <BoldWordInName
                name={patient.pm_contact_no}
                boldWord={searchQuery}
              />
            </div>
            <div className="list-patientName d-flex align-items-center me-4">
              <i className="icon-Id backbar me-2"></i>
              <BoldWordInName name={patient.pm_pid} boldWord={searchQuery} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const onSearchName = useCallback(
    (query) => {
      setSearchQueryName(query);
    },
    [setSearchQueryName]
  );

  const onSearchMobile = useCallback(
    (query) => {
      setSearchQueryMobile(query);
    },
    [setSearchQueryMobile]
  );

  useEffect(() => {
    if (searchQueryName || searchQueryMobile) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchPatients({
            searchQuery: searchQueryName || searchQueryMobile,
            company: "",
          })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(clearSearch());
    }
  }, [searchQueryName, searchQueryMobile]);

  useEffect(() => {
    const data = [];
    if (patients) {
      if (patients.length === 0 && searchQuery.length > 0) {
        data.push({
          key: -2,
          label: <div>{error}</div>,
        });
      } else {
        patients.map((patient) => {
          return data.push({
            key: JSON.stringify(patient),
            value: patient.pm_pid,
            label: PatientPlank(patient),
          });
        });
      }
    }
    // Add "Add New Patient" option for non-Zydus users
    if (!isZydus()) {
      data.push({
        key: -1,
        value: "Add New Patient",
        label: AddPatientPlank(),
      });
    }
    setPatientSearchOptions(data);
  }, [patients, searchQuery, error]);

  const goToAddPatient = () => {
    navigate("/ipd/add-new-patient", {
      state: {
        from: "/ipd/create-admission",
        returnPath: "/ipd/create-admission",
      },
    });
  };

  const AddPatientPlank = () => {
    return (
      <Button
        type="text"
        className="btn btn-primary1 btn-41 align-items-center d-flex"
        icon={<i className="icon-Add"></i>}
        onClick={(e) => {
          e.stopPropagation();
          goToAddPatient();
        }}
      >
        Add New Patient
      </Button>
    );
  };

  const onSelect = (value, option) => {
    // Check if "Add New Patient" was selected
    if (option?.key === -1 || value === "Add New Patient") {
      goToAddPatient();
      return;
    }

    // Handle patient selection
    try {
      const patient = typeof option?.key === 'string' ? JSON.parse(option.key) : option?.key;
      if (patient && patient.pm_pid) {
        setPatientDetails({
          patientName: patient.pm_fullname,
          mobileNumber: patient.pm_contact_no,
          patientUniqueId: patient.patient_unique_id,
          patientId: patient.pm_pid,
        });
        setPatientData(patient);
        setPatientSearchOptions([]);
        setSearchQueryMobile("");
        setSearchQueryName("");
        setIsEditingName(false);
      }
    } catch (error) {
      console.error("Error parsing patient data:", error);
    }
  };

  useEffect(() => {
    if (isEditingName && nameAutoCompleteRef.current) {
      nameAutoCompleteRef.current.focus();
    }
  }, [isEditingName]);

  // Handle patient data from URL query parameters (cross-domain)
  useEffect(() => {
    const patientDataParam = searchParams.get('patientData');
    if (patientDataParam && !patient_data && !isEditModeState && !patientData) {
      try {
        // Decode base64 and parse JSON
        const decodedData = decodeURIComponent(atob(patientDataParam));
        const parsedPatientData = JSON.parse(decodedData);

        // console.log(parsedPatientData,"parsedPatientData");
        // console.log(patientData,"patientData");
        if (parsedPatientData) {
          setPatientData(parsedPatientData);
          setPatientDetails({
            patientName: parsedPatientData.pm_fullname || parsedPatientData.name || "",
            mobileNumber: parsedPatientData.pm_contact_no || parsedPatientData.contact || "",
            patientUniqueId: parsedPatientData.patient_unique_id || parsedPatientData.id || "",
            patientId: parsedPatientData.pm_pid || parsedPatientData.patientId || "",
          });
          setIsEditingName(false);
          
          // Clean up URL after reading the data
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('patientData');
          navigate(
            { pathname: location.pathname, search: newSearchParams.toString() },
            { replace: true }
          );
        }
      } catch (error) {
        console.error("Error parsing patient data from URL:", error);
        message.error("Failed to load patient data from URL");
      }
    }
  }, [searchParams, patient_data, isEditModeState, patientData, navigate, location.pathname]);

  // Handle return from AddNewPatient page with new patient data
  useEffect(() => {
    if (patient_data && !isEditModeState && !patientData) {
      // Pre-fill patient data when returning from AddNewPatient
      // console.log(patient_data,"patient_data");
      setPatientData(patient_data);
      setPatientDetails({
        patientName: patient_data.pm_fullname,
        mobileNumber: patient_data.pm_contact_no,
        patientUniqueId: patient_data.patient_unique_id,
        patientId: patient_data.pm_pid,
      });
      setIsEditingName(false);
    }
  }, [patient_data, isEditModeState, patientData]);

  return (
    <div className="create-admission-page-container">
      <SubHeader
        showConfirmAdmissionButton={isPatientSelected}
        headerTitle={isEditModeState ? "Edit Admission" : "Create New Admission"}
        onConfirmAdmissionClick={() => handleSubmit(onSubmit)()}
        isConfirmDisabled={isConfirmDisabled}
        helperMessage={helperMessage}
        onDisabledClick={() => {
          if (helperMessage) {
            message.warning(helperMessage);
          }
        }}
        isEditMode={isEditModeState}
      />
      <div className="border rounded-4 create-admission-page dateborder">
        <Card className="patient-summary-card">
          <div className="d-flex gap-2">
            <div style={{ width: "100%" }}>
              <div className="fs-18 fw-medium mb-2 d-flex align-items-center gap-2">
                <img src={defaultIcons.basicInfoPc} alt="patient" />
                <span>Patient Details</span>
              </div>
              {isEditingName && !patient_data && !isEditModeState ? (
                <AutoComplete
                  ref={nameAutoCompleteRef}
                  value={searchQueryName}
                  onSearch={(value) => {
                    setSearchQueryName(value);
                    onSearchName(value);
                    onSearchMobile(value);
                  }}
                  options={patientSearchOptions}
                  onSelect={onSelect}
                  className="w-100 autocomplete-custom"
                  open={autoCompleteFlagName}
                  onFocus={() => {
                    setAutoCompleteFlagName(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setAutoCompleteFlagName(false);
                      setIsEditingName(true);
                    }, 200);
                  }}
                  popupClassName="autocomplete-dropdown"
                >
                  <Input
                    placeholder="Search by Patient's Name, Mobile number or Id"
                    prefix={<i className="icon-search"></i>}
                    suffix={
                      searchQueryName.length > 0 && (
                        <i
                          className="icon-Cross"
                          onClick={() => {
                            setSearchQueryName("");
                            setSearchQueryMobile("");
                          }}
                        />
                      )
                    }
                  />
                </AutoComplete>
              ) : (
                <div
                  className={`d-flex align-items-center flex-wrap border w-100 ${
                    (patient_data || isEditModeState) ? "pe-none disabled" : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!patient_data && !isEditModeState) {
                      setIsEditingName(true);
                    }
                  }}
                  style={{ padding: "5px 10px", borderRadius: "12px" }}
                >
                  <div className="list-patientName d-flex align-items-center me-4 ml-2 my-1">
                    <i className="icon-patients backbar "></i>{" "}
                    <span
                      className="patientInfo"
                      style={{ width: "max-content" }}
                    >
                      {patientData?.pm_fullname ||
                        patientData?.patientName ||
                        patientDetails?.patientName}{" "}
                      ({patientData?.pm_gender || patientDetails?.gender}, {patientData?.ageYears || patientDetails?.ageYears}y)
                    </span>
                  </div>
                  <div className="list-patientName d-flex align-items-center me-4 my-1">
                    <i className="icon-phone backbar"></i>
                    <span className="patientInfo">
                      {patientData?.pm_contact_no ||
                        patientData?.mobileNumber ||
                        patientDetails?.mobileNumber}
                    </span>
                  </div>
                  <div className="list-patientName d-flex align-items-center me-4 my-1">
                    <i className="icon-Id backbar"></i>
                    <span className="patientInfo">
                      {patientData?.pm_pid ||
                        patientData?.pmPid ||
                        patientDetails?.patientId}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Spin spinning={loadingInitial}>
          {isPatientSelected && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {SECTION_LAYOUT.map((section) => (
                <Card className="form-section-card" key={section.key}>
                  <div className="section-header">
                    <div>
                      <p className="section-eyebrow d-flex align-items-center gap-2">
                        <img src={section.icon} alt={section.title} />
                        {section.title}
                      </p>
                    </div>
                  </div>
                  <Row gutter={[20, 20]}>
                    {renderSectionFields(section.fieldIds)}
                  </Row>
                </Card>
              ))}
            </form>
          )}
        </Spin>
      </div>

      <WardBedDrawer
        open={wardBedDrawerOpen}
        onClose={() => setWardBedDrawerOpen(false)}
        wards={wards}
        selectedWardId={selectedWardId}
        selectedRoomId={selectedRoomId}
        onConfirm={handleWardBedConfirm}
      />
    </div>
  );
}