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
    const matchingItem = patientDetails?.find(
      (obj) => obj.tvac_name === item.tvac_name
    );

    const { tvt_due_day, tvt_due_month, tvt_due_year } = item;

    const dateCount = tvt_due_day + tvt_due_month * 30 + tvt_due_year * 365;
    const dueDate1 = new Date(birthDate);
    if (dateCount) {
      dueDate1.setDate(dueDate1.getDate() + dateCount);
    }
    const dueDate = dateFormatter(dueDate1);
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

export const getDates = (sampleMap) => {
  const newArray = [];
  sampleMap.forEach((value, key) => {
    // Check if all SampleObject instances in the array have a date attribute
    const allDatesPresent = value.every(
      (sampleObject) => sampleObject.tvp_given_date
    );

    const today = new Date();
    const anyFutureDate = today < new Date(value[0].dueDate);

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

// Function to calculate age in weeks, months, and years from DOB
function calculateAge(dob) {
  const dobDate = new Date(dob);
  const currentDate = new Date();

  // Calculate age in years
  let ageYears = currentDate.getFullYear() - dobDate.getFullYear();

  // Calculate age in months
  let ageMonths = currentDate.getMonth() - dobDate.getMonth();
  if (
    ageMonths < 0 ||
    (ageMonths === 0 && currentDate.getDate() < dobDate.getDate())
  ) {
    ageYears--; // Adjust age in years if birthday hasn't occurred yet this year
    ageMonths += 12; // Add 12 months to adjust negative months
  }

  // Calculate age in weeks
  const ageWeeks = Math.floor(
    (currentDate - dobDate) / (1000 * 60 * 60 * 24 * 7)
  );

  return { years: ageYears, months: ageMonths, weeks: ageWeeks };
}

export const getDefaultOption = (dob) => {
  const age = calculateAge(dob);
  // Determine default option based on age
  let defaultOption;
  if (age.years === 0 && age.months === 0 && age.weeks <= 6) {
    defaultOption = "Birth";
  } else if (age.weeks >= 6 && age.weeks < 10) {
    defaultOption = `${age.weeks} week`;
  } else if (age.weeks >= 10 && age.weeks < 14) {
    defaultOption = `${age.weeks} Week`;
  } else if (age.weeks >= 14 && age.months < 6) {
    defaultOption = `${age.weeks} Week`;
  } else if (age.months >= 6 && age.months < 7) {
    defaultOption = `${age.years} Year`;
  } else if (age.years >= 10 && age.years < 15) {
    defaultOption = `${age.years} Years`;
  } else if (age.years >= 15) {
    defaultOption = "15 -18 Years";
  } else {
    defaultOption = "Default Option";
  }

  return defaultOption;
};
