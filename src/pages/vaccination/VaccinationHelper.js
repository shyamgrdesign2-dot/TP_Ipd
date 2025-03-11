import moment from "moment";

export const getDistinctAges = (vaccineDetails) => {
  const idMap = new Map(); // Map to store objects grouped by ages
  const distinctIds = []; // Array to store distinct IDs

  vaccineDetails.forEach((obj) => {
    if (!idMap.has(obj.tvt_age)) {
      idMap.set(obj.tvt_age, []);
      distinctIds.push(obj.tvt_age);
    }
    idMap.get(obj.tvt_age).push(obj);
  });

  return { distinctIds, idMap };
};

export const mergeDataPatientDetails = (
  vaccineDetails,
  patientDetails,
  overridenVaccines,
  details,
  birthDate
) => {
  return vaccineDetails?.map((item) => {
    const vaccineGivenToPatient =
      patientDetails?.findLast((obj) => obj.tvp_temp_id === item.tvt_id) || {};

    const { tvt_due_day, tvt_due_month, tvt_due_year } = item;
    const { tvp_given_date, tvp_create_date, tvp_modify_date } =
      vaccineGivenToPatient;
    const givenModifiedDate = tvp_modify_date || tvp_create_date;
    const futureDate = birthDate
      ? moment(birthDate, "Do MMM YYYY")
          .add({
            days: tvt_due_day,
            months: tvt_due_month,
            years: tvt_due_year,
          })
          .format("DD-MMM-YYYY")
      : "";

    const matchingForOverDue = overridenVaccines.find(
      (obj) => obj.tvd_temp_id === item.tvt_id
    );
    const dueModifiedDate =
      matchingForOverDue?.tvd_modify_date ||
      matchingForOverDue?.tvd_create_date;

    // Determine which record to use based on date comparison
    let useGivenPatient = true;
    if (givenModifiedDate && dueModifiedDate) {
      const givenDate = moment(givenModifiedDate).toISOString();
      const overriddenDate = moment(dueModifiedDate).toISOString();
      useGivenPatient = givenDate >= overriddenDate;
    } else if (!givenModifiedDate && matchingForOverDue?.tvd_due_date) {
      useGivenPatient = false;
    }

    const brandDetails =
      useGivenPatient && tvp_given_date
        ? details.find(
            (brand) => brand.tvc_id === vaccineGivenToPatient?.tvc_id
          )
        : {};

    return {
      ...item,
      ...(useGivenPatient ? vaccineGivenToPatient : matchingForOverDue),
      ...(useGivenPatient &&
        tvp_given_date && {
          brandName: brandDetails?.tvc_name,
          brandId: brandDetails?.tvc_id,
        }),
      dueDate: futureDate,
    };
  });
};

export const dateFormatter = (date) => {
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (Date.parse(date)) {
    return (
      date.getDate() +
      " " +
      monthNames[date.getMonth()] +
      " " +
      date.getFullYear()
    );
  }
  return null;
};

export const getDates = (sampleMap) => {
  const newArray = [];
  sampleMap.forEach((value, key) => {
    // Check if all SampleObject instances in the array have a date attribute
    const allDatesPresent = value.every(
      (sampleObject) => sampleObject.tvp_given_date
    );

    const anyFutureDate = value?.[0]?.dueDate
      ? moment(value[0].dueDate).isSameOrAfter(new Date(), "day")
      : true;

    // Set the alert field based on the presence of dates
    const alert = allDatesPresent
      ? "success"
      : anyFutureDate
      ? null
      : "failure";

    // Create an object containing the key, its associated array of SampleObjects, and the alert field
    const newObj = {
      label: key,
      alert: alert,
      dueDate: new Date(value[0].dueDate),
    };

    // Push the new object into the newArray
    newArray.push(newObj);
  });
  return newArray;
};

export const getDefaultOption = (dateOptions) => {
  const today = moment(new Date());
  const dateOption = dateOptions.find((item) =>
    moment(item?.dueDate)?.isSameOrAfter(today, "day")
  );
  const activeValue = dateOptions.indexOf(dateOption);
  if (activeValue === -1 || activeValue === 0) {
    return 0;
  }
  return activeValue - 1;
};

export const isVaccineModifiedRecently = (modifyDate) => {
  if (!modifyDate) return true;

  const modifiedDateTime = moment(modifyDate);
  const now = moment();
  const hoursDifference = now.diff(modifiedDateTime, "hours");

  return hoursDifference <= 24;
};
