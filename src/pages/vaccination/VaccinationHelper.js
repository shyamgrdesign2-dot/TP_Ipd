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
  birthDate
) => {
  return vaccineDetails?.map((item) => {
    const matchingItem = patientDetails
      ?.toReversed()
      ?.find((obj) => obj.tvac_name === item.tvac_name);

    const { tvt_due_day, tvt_due_month, tvt_due_year } = item;
    const dueDate = getDueDate(
      tvt_due_day,
      tvt_due_month,
      tvt_due_year,
      birthDate
    );
    return { ...item, ...matchingItem, dueDate: dueDate };
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
  return (
    date.getDate() +
    " " +
    monthNames[date.getMonth()] +
    " " +
    date.getFullYear()
  );
};

export const getDueDate = (
  tvt_due_day,
  tvt_due_month,
  tvt_due_year,
  birthDate
) => {
  const dateCount = tvt_due_day + tvt_due_month * 30 + tvt_due_year * 365;
  const dueDate = new Date();
  if (dateCount) {
    dueDate.setDate(birthDate.getDate() + dateCount);
  }

  return dateFormatter(dueDate);
};

export const getDates = (sampleMap, birthDate) => {
  const newArray = [];

  sampleMap.forEach((value, key) => {
    // Check if all SampleObject instances in the array have a date attribute
    const allDatesPresent = value.every(
      (sampleObject) => sampleObject.tvp_given_date
    );

    const { tvt_due_day, tvt_due_month, tvt_due_year } = value[0] || {};

    const dueDate = getDueDate(
      tvt_due_day,
      tvt_due_month,
      tvt_due_year,
      birthDate
    );

    const today = new Date();
    const updateDate = new Date(dueDate);

    const anyFutureDate = today < updateDate;

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
    };

    // Push the new object into the newArray
    newArray.push(newObj);
  });
  return newArray;
};
