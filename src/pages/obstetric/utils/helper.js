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
