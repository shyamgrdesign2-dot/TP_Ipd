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
    const vaccineGivenToPatient = patientDetails?.find(
      (obj) => obj.tvac_name === item.tvac_name
    );

    const { tvt_due_day, tvt_due_month, tvt_due_year } = item;
    const dateCount = tvt_due_day + tvt_due_month * 30 + tvt_due_year * 365;
    const dueDate1 = new Date(birthDate);
    if (dateCount) {
      dueDate1.setDate(dueDate1.getDate() + dateCount);
    }
    const dueDate = dateFormatter(dueDate1);

    const matchingForOverDue = overridenVaccines.find(
      (obj) => obj.tvd_temp_id === item.tvt_id
    );

    const brandDetails = details.find((brand) => brand.tvc_id === item.tvc_id);

    return {
      ...item,
      ...vaccineGivenToPatient,
      ...matchingForOverDue,
      brandName: brandDetails?.tvc_name,
      brandId: brandDetails?.tvc_id,
      dueDate: dueDate,
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

    const anyFutureDate = moment(value[0].dueDate).isSameOrAfter(
      new Date(),
      "day"
    );

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

export const getOverDueVaccines = (notGivenVaccines, birthDate) => {
  return notGivenVaccines?.map((item) => {
    const { tvt_due_day, tvt_due_month, tvt_due_year } = item;
    const dateCount = tvt_due_day + tvt_due_month * 30 + tvt_due_year * 365;
    const birthDayObject = moment(birthDate, "Do MMM YYYY");

    const formattedDate = birthDayObject.format("DD-MMM-YYYY").toUpperCase();
    const dueDate1 = new Date(formattedDate);
    if (dateCount) {
      dueDate1.setDate(dueDate1.getDate() + dateCount);
    }
    const today = new Date();
    if (today > dueDate1) {
      return { ...item, dueDate: dueDate1 };
    }
  });
};
