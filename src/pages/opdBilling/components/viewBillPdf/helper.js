import moment from "moment";
import { PX_TO_PT } from "./constants";

export const getMarginByFormat = (
  letterHeadFormat,
  headerFooter,
  position,
  defaultValue
) => {
  const marginType =
    letterHeadFormat === 0
      ? "custom_letterhead_margin"
      : letterHeadFormat === 1
      ? "uploaded_letterhead_margin"
      : letterHeadFormat === 2
      ? "margin"
      : null;

  return marginType && headerFooter?.[marginType]?.[position] >= 0
    ? (headerFooter?.[marginType]?.[position] || defaultValue) * 25
    : PX_TO_PT * 30;
};

export const calculatePadding = (headerFooter) => {
  const letterHeadFormat = headerFooter?.letterHeadFormat;
  return {
    paddingTop: [0, 1, 2].includes(letterHeadFormat)
      ? getMarginByFormat(letterHeadFormat, headerFooter, "top", 0.5)
      : PX_TO_PT * 30,
    paddingLeft: [0, 1, 2].includes(letterHeadFormat)
      ? getMarginByFormat(letterHeadFormat, headerFooter, "left", 0.5)
      : PX_TO_PT * 30,
    paddingRight: [0, 1, 2].includes(letterHeadFormat)
      ? getMarginByFormat(letterHeadFormat, headerFooter, "right", 0.5)
      : PX_TO_PT * 30,
  };
};

export const patientDataShow = (id, caseManagerData) => {
  var value = "";
  if (id == 1) {
    value = `${
      caseManagerData?.patient_data?.patient_salutation
        ? `${caseManagerData?.patient_data?.patient_salutation} ${caseManagerData?.patient_data?.patient_name}, ${caseManagerData?.patient_data?.patient_id}`
        : `${caseManagerData?.patient_data?.patient_name}, ${caseManagerData?.patient_data?.patient_id}`
    }`;
  } else if (id == 2) {
    value = `${
      caseManagerData?.patient_data?.patient_consultaion_date
        ? moment(
            caseManagerData?.patient_data?.patient_consultaion_date
          ).format("DD/MM/YYYY HH:mm")
        : "-"
    }`;
  } else if (id == 3) {
    value = `${genderAge(
      caseManagerData?.patient_data,
      caseManagerData?.doctor_data
    )}, ${caseManagerData?.patient_data?.patient_gender}`;
  } else if (id == 4) {
    value = `${
      caseManagerData?.patient_data?.patient_contact_no
        ? caseManagerData?.patient_data?.patient_contact_no
        : "-"
    }`;
  } else if (id == 5) {
    value = `${
      caseManagerData?.patient_data?.patient_ht_wt
        ? caseManagerData?.patient_data?.patient_ht_wt
        : "-"
    }`;
  } else if (id == 6) {
    value = `${
      caseManagerData?.patient_data?.patient_blood_group
        ? caseManagerData?.patient_data?.patient_blood_group
        : "-"
    }`;
  } else if (id == 7) {
    value = `${
      caseManagerData?.patient_data?.patient_address
        ? caseManagerData?.patient_data?.patient_address
        : "-"
    }`;
  } else if (id == 8) {
    value = `${
      caseManagerData?.patient_data?.patient_consultation_type
        ? caseManagerData?.patient_data?.patient_consultation_type
        : "-"
    }`;
  } else if (id == 9) {
    value = `${
      caseManagerData?.patient_data?.patient_edd_date
        ? caseManagerData?.patient_data?.patient_edd_date
        : "-"
    }`;
  } else if (id == 10) {
    value = `${
      caseManagerData?.patient_data?.patient_email
        ? caseManagerData?.patient_data?.patient_email
        : "-"
    }`;
  } else if (id == 11) {
    value = `${
      caseManagerData?.patient_data?.patient_reference_id
        ? caseManagerData?.patient_data?.patient_reference_id
        : "-"
    }`;
  } else if (id == 12) {
    value = `${
      caseManagerData?.patient_data?.patient_salutation
        ? `${caseManagerData?.patient_data?.patient_salutation} ${caseManagerData?.patient_data?.patient_name}`
        : `${caseManagerData?.patient_data?.patient_name}`
    }`;
  } else if (id == 13) {
    value = `${
      caseManagerData?.patient_data?.patient_id
        ? caseManagerData?.patient_data?.patient_id
        : "-"
    }`;
  }
  return value;
};

export const genderAge = (patient_data, profile) => {
  var value = ``;
  if (profile?.dp_id === 9) {
    if (patient_data?.ageYears != 0) {
      value += `${patient_data?.ageYears}y`;
    }
    if (patient_data?.ageMonths != 0) {
      value += ` ${patient_data?.ageMonths}m`;
    }
    if (patient_data?.ageDays != 0) {
      value += ` ${patient_data?.ageDays}d`;
    }
  } else {
    if (patient_data?.ageYears != 0) {
      value += `${patient_data?.ageYears}y`;
    } else if (patient_data?.ageMonths != 0) {
      value += ` ${patient_data?.ageMonths}m`;
    } else if (patient_data?.ageDays != 0) {
      value += ` ${patient_data?.ageDays}d`;
    }
  }
  return value;
};
