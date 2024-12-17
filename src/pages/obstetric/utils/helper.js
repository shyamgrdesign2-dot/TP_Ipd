import { ABORTION, MISCARRIAGE } from "../../../utils/constants";

export const isNumberCheck = (e) => {
  const { value } = e.target;
  const reg = /^[0-9]*$/;
  if (reg.test(value) || value === "") {
    return true;
  }
  return false;
};

export const isDecimalCheck = (e) => {
  const { value } = e.target;
  const reg = /^[0-9]*\.?[0-9]*$/;
  if (reg.test(value) || value === "") {
    return true;
  }
  return false;
};

export const isPrimigravida = (pastPregnancyData) => {
  const gravidityValue = pastPregnancyData?.find(
    (item) => item.key === "gravidity"
  )?.value;
  const otherValuesEmpty = pastPregnancyData?.every((item) => {
    if (item.key !== "gravidity") {
      return [0, "0", "", null, undefined].includes(item.value);
    }
    return true;
  });

  return gravidityValue == 1 && otherValuesEmpty;
};

export const getPregnancyOutcome = (outcome) => {
  return outcome === ABORTION ? MISCARRIAGE : outcome;
};

export const getTypeOfAbortion = (typeOfAbortion) => {
  return typeOfAbortion === "Missed abortion"
    ? "Missed Miscarriage"
    : typeOfAbortion;
};

export const updateEnablePrint = (ancHistory) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Start of today (12:00 AM)
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999); // End of today (11:59 PM)

  // removing Deleted Entry
  const updatedAncHistory = ancHistory?.filter((item) => !item?.isDeleted);

  return updatedAncHistory.map((item) => {
    const updatedAt = new Date(item.updated_at);

    // Check if updated_at is within today's range
    if (updatedAt >= todayStart && updatedAt <= todayEnd && item.enablePrint) {
      return { ...item, enablePrint: true };
    } else {
      return { ...item, enablePrint: false };
    }
  });
};

export const splitByTrimester = (data) => {
  const firstTrimester = data?.filter(
    (item) => item?.weekRange?.start >= 1 && item?.weekRange?.start <= 12
  );
  const secondTrimester = data?.filter(
    (item) => item.weekRange?.start >= 13 && item?.weekRange?.start <= 27
  );
  const thirdTrimester = data?.filter((item) => item?.weekRange?.start >= 28);

  return [firstTrimester, secondTrimester, thirdTrimester];
};

export function mergeData(
  arrayData,
  defaultData,
  ancDoctorList,
  userId,
  isAncScheduler
) {
  // Start with a copy of the existing arrayData
  const updatedArrayData = [...arrayData];

  // Loop through defaultData and check if each item is present in arrayData
  defaultData.forEach((defaultItem) => {
    const isPresent = arrayData.some(
      (arrayItem) =>
        arrayItem.masterId === defaultItem.id &&
        arrayItem.master.name === defaultItem.name
    );

    // If not present, add it to updatedArrayData
    if (!isPresent) {
      const updatedObject = {
        masterId: defaultItem.id,
        master: {
          name: defaultItem.name,
          default: true,
        },
        status: "Due",
        notes: null,
        enablePrint: false,
        created_at: new Date().toISOString(),
        created_by: userId,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      };

      // Conditionally add weekRange if it should be included
      if (isAncScheduler) {
        updatedObject.weekRange = {
          start: defaultItem.weekRange.start,
          end: defaultItem.weekRange.end,
        };
        updatedObject.dueDate = null;
      } else {
        updatedObject.givenDate = null;
        updatedObject.dueDate = null;
      }
      updatedArrayData.push(updatedObject);
    }
  });

  ancDoctorList.forEach((defaultItem) => {
    const isPresent = arrayData.some(
      (arrayItem) =>
        arrayItem.masterId === defaultItem.id &&
        arrayItem.master.name === defaultItem.name
    );

    // If not present, add it to updatedArrayData
    if (
      !isPresent &&
      defaultItem.id &&
      defaultItem?.weekRange?.start &&
      defaultItem?.weekRange?.end
    ) {
      const updatedObject = {
        masterId: defaultItem.id,
        master: {
          name: defaultItem.name,
          default: false,
        },
        status: "Due",
        notes: null,
        enablePrint: false,
        created_at: new Date().toISOString(),
        created_by: userId,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      };

      // Conditionally add weekRange if it should be included
      if (isAncScheduler) {
        updatedObject.weekRange = {
          start: defaultItem.weekRange.start,
          end: defaultItem.weekRange.end,
        };
        updatedObject.dueDate = null;
      } else {
        updatedObject.givenDate = null;
        updatedObject.dueDate = null;
      }
      updatedArrayData.push(updatedObject);
    }
  });

  return updatedArrayData;
}
