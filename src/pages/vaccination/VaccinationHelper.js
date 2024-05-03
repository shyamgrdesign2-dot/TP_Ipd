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

export const getDueDate = (
  tvt_due_day,
  tvt_due_month,
  tvt_due_year,
  birthDate
) => {
  const dateCount = tvt_due_day + tvt_due_month * 30 + tvt_due_year * 365;
  if (dateCount) {
    birthDate.setDate(birthDate.getDate() + dateCount);
  }

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
    birthDate.getDate() +
    " " +
    monthNames[birthDate.getMonth()] +
    " " +
    birthDate.getFullYear()
  );
};
